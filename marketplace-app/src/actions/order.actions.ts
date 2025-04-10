"use server";

import { auth } from "../../auth"; // Corrected import path
import { db } from "@/db";
import {
  orderItems,
  orderItemStatusEnum,
  affiliateReferrals, // Added affiliateReferrals schema
} from "@/db/schema";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in orderBy callback
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define the return type for vendor order items, including related data
export type VendorOrderItem = Awaited<
  ReturnType<typeof getVendorOrderItems>
>[0];

export async function getVendorOrderItems() {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    console.error("Unauthorized attempt to fetch vendor orders.");
    return []; // Return empty array or throw error for unauthorized access
  }
  const vendorId = session.user.id;

  try {
    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.vendorId, vendorId),
      orderBy: (items, { desc }) => [desc(items.createdAt)], // Use 'items' alias from orderBy
      with: {
        // Include related product and variant details needed for display
        product: {
          columns: {
            title: true,
            slug: true,
            isPhysical: true, // Add isPhysical here
          },
        },
        productVariant: {
          columns: {
            name: true, // e.g., "Size"
            value: true, // e.g., "Large"
          },
        },
        order: {
          // Include order details like ID and creation date
          columns: {
            id: true,
            createdAt: true,
          },
        },
      },
      // Select necessary columns from orderItems itself
      columns: {
        id: true,
        orderId: true,
        quantity: true,
        priceAtPurchaseInCents: true,
        status: true,
        createdAt: true,
      },
    });
    return items;
  } catch (error) {
    console.error("Failed to fetch vendor order items:", error);
    return []; // Return empty array on error
  }
}

// --- Update Order Item Status Action ---

// Define allowed status transitions for physical goods by vendors
const allowedVendorTransitions: Record<string, string[]> = {
  PENDING_FULFILLMENT: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  // DELIVERED: [], // No further vendor actions
  // ACCESS_GRANTED: [], // Digital goods, no vendor action
  // CANCELLED: [], // Cannot un-cancel
};

// Helper to format status for error messages
const formatStatus = (status: string): string => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
};

// Define the type for the status enum values
type OrderItemStatus = (typeof orderItemStatusEnum.enumValues)[number];

interface UpdateStatusResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updateOrderItemStatus(
  orderItemId: string,
  newStatus: OrderItemStatus
): Promise<UpdateStatusResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Validate newStatus is a valid enum value (basic check)
  if (!orderItemStatusEnum.enumValues.includes(newStatus)) {
    return { success: false, error: "Invalid status value provided." };
  }

  try {
    // 3. Fetch the order item and verify ownership
    const item = await db.query.orderItems.findFirst({
      where: and(
        eq(orderItems.id, orderItemId),
        eq(orderItems.vendorId, vendorId) // Ensure vendor owns this item
      ),
      columns: { id: true, status: true },
      with: {
        product: { columns: { isPhysical: true } }, // Check if it's a physical product
      },
    });

    if (!item) {
      return {
        success: false,
        error: "Order item not found or access denied.",
      };
    }

    // 4. Check if it's a physical product (vendors only update physical)
    if (!item.product?.isPhysical) {
      return {
        success: false,
        error: "Status for digital items cannot be updated by vendor.",
      };
    }

    // 5. Validate Status Transition
    const currentStatus = item.status;
    const allowedTransitions = allowedVendorTransitions[currentStatus];

    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid status transition from ${formatStatus(currentStatus)} to ${formatStatus(newStatus)}.`,
      };
    }

    // 6. Update Status in DB (within a transaction)
    await db.transaction(async (tx) => {
      // Update OrderItem status
      await tx
        .update(orderItems)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(orderItems.id, orderItemId));

      // Update AffiliateReferral status if applicable
      if (newStatus === "DELIVERED" || newStatus === "ACCESS_GRANTED") {
        // If item is confirmed, confirm the referral
        await tx
          .update(affiliateReferrals)
          .set({ status: "CONFIRMED", updatedAt: new Date() })
          .where(
            and(
              eq(affiliateReferrals.orderItemId, orderItemId),
              eq(affiliateReferrals.status, "PENDING") // Only update pending referrals
            )
          );
      } else if (newStatus === "CANCELLED") {
        // If item is cancelled, cancel the referral
        await tx
          .update(affiliateReferrals)
          .set({ status: "CANCELLED", updatedAt: new Date() })
          .where(
            and(
              eq(affiliateReferrals.orderItemId, orderItemId),
              eq(affiliateReferrals.status, "PENDING") // Only cancel pending referrals
            )
          );
      }
    }); // End transaction

    // 7. Revalidate relevant paths
    revalidatePath("/dashboard/vendor/orders"); // Revalidate the orders page
    // Potentially revalidate customer order view if implemented: revalidatePath(`/dashboard/orders/${item.orderId}`);

    return { success: true, message: "Order item status updated." };
  } catch (error) {
    console.error("Failed to update order item status:", error);
    return {
      success: false,
      error: "Database error: Failed to update status.",
    };
  }
}

// --- Get Customer Orders Action ---

import { orders } from "@/db/schema"; // Import orders schema

// Define the return type, including nested items and their details
export type CustomerOrder = Awaited<ReturnType<typeof getCustomerOrders>>[0];

export async function getCustomerOrders() {
  const session = await auth();
  if (!session?.user?.id) {
    console.error("Unauthorized attempt to fetch customer orders.");
    return []; // Return empty array for unauthorized access
  }
  const userId = session.user.id;

  try {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)], // Order by creation date
      with: {
        // Include order items and their related product/variant details
        orderItems: {
          with: {
            product: {
              columns: {
                title: true,
                slug: true,
                isDigital: true, // Needed for download link logic
              },
              // Also fetch the digital asset ID if the product is digital
              with: {
                digitalAssets: {
                  columns: {
                    id: true, // Fetch the asset ID
                  },
                  limit: 1, // Assuming one asset per product
                },
              },
            },
            productVariant: {
              columns: {
                name: true,
                value: true,
              },
            },
          },
          columns: {
            // Select necessary columns from orderItems
            id: true,
            quantity: true,
            priceAtPurchaseInCents: true,
            status: true,
            productId: true, // Needed for download link logic
          },
        },
        shippingAddress: true, // Include shipping address details
      },
      // Select necessary columns from the order itself
      columns: {
        id: true,
        totalAmountInCents: true,
        status: true, // Overall order status (might differ from item status)
        createdAt: true,
      },
    });
    return userOrders;
  } catch (error) {
    console.error("Failed to fetch customer orders:", error);
    return []; // Return empty array on error
  }
}
