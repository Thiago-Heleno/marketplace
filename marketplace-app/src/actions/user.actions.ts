"use server";

import { z } from "zod";
import { auth } from "../../auth";
import { db } from "@/db";
import { users, addresses, withdrawalRequests } from "@/db/schema"; // Added withdrawalRequests here too
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in orderBy callback
import { eq, and, desc, sum, sql, or, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { orderItems } from "@/db/schema"; // Moved orderItems import down
import { formatPrice } from "@/lib/utils";

// --- Get User Profile Data ---

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) {
    return null; // Or throw error
  }
  const userId = session.user.id;

  try {
    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        pixKey: true,
      },
      with: {
        addresses: {
          // Fetch associated addresses
          orderBy: (addr, { desc }) => [desc(addr.createdAt)], // Use different alias for orderBy
        },
      },
    });
    return userProfile;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
}

// --- Approve Withdrawal (Admin) ---
export async function approveWithdrawal(
  requestId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updated] = await db
      .update(withdrawalRequests)
      .set({
        status: "APPROVED",
        processedAt: new Date(),
        // updatedAt: new Date(), // Removed non-existent field
      })
      .where(
        and(
          eq(withdrawalRequests.id, requestId),
          eq(withdrawalRequests.status, "PENDING") // Can only approve pending requests
        )
      )
      .returning({ id: withdrawalRequests.id });

    if (!updated) {
      return {
        success: false,
        error: "Request not found or not in PENDING state.",
      };
    }

    revalidatePath("/dashboard/admin/withdrawals");
    // TODO: Notify vendor?
    return { success: true, message: "Withdrawal approved." };
  } catch (error) {
    console.error("Failed to approve withdrawal:", error);
    return {
      success: false,
      error: "Database error: Failed to approve withdrawal.",
    };
  }
}

// --- Reject Withdrawal (Admin) ---
const RejectWithdrawalSchema = z.object({
  adminNotes: z.string().min(1, "Rejection reason is required."),
});
export async function rejectWithdrawal(
  requestId: string,
  formData: z.infer<typeof RejectWithdrawalSchema>
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  const validatedFields = RejectWithdrawalSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid rejection reason." };
  }
  const { adminNotes } = validatedFields.data;

  try {
    const [updated] = await db
      .update(withdrawalRequests)
      .set({
        status: "REJECTED",
        adminNotes: adminNotes,
        processedAt: new Date(),
        // updatedAt: new Date(), // Removed non-existent field
      })
      .where(
        and(
          eq(withdrawalRequests.id, requestId),
          or(
            // Can reject PENDING or APPROVED requests
            eq(withdrawalRequests.status, "PENDING"),
            eq(withdrawalRequests.status, "APPROVED")
          )
        )
      )
      .returning({ id: withdrawalRequests.id });

    if (!updated) {
      return {
        success: false,
        error: "Request not found or cannot be rejected in its current state.",
      };
    }

    revalidatePath("/dashboard/admin/withdrawals");
    // TODO: Notify vendor?
    return { success: true, message: "Withdrawal rejected." };
  } catch (error) {
    console.error("Failed to reject withdrawal:", error);
    return {
      success: false,
      error: "Database error: Failed to reject withdrawal.",
    };
  }
}

// --- Mark Withdrawal as Paid (Admin) ---
export async function markWithdrawalPaid(
  requestId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updated] = await db
      .update(withdrawalRequests)
      .set({ status: "PAID", processedAt: new Date() }) // Ensure processedAt is updated
      .where(
        and(
          eq(withdrawalRequests.id, requestId),
          eq(withdrawalRequests.status, "APPROVED") // Can only mark APPROVED requests as paid
        )
      )
      .returning({ id: withdrawalRequests.id });

    if (!updated) {
      return {
        success: false,
        error: "Request not found or not in APPROVED state.",
      };
    }

    revalidatePath("/dashboard/admin/withdrawals");
    // TODO: Notify vendor?
    return { success: true, message: "Withdrawal marked as paid." };
  } catch (error) {
    console.error("Failed to mark withdrawal as paid:", error);
    return {
      success: false,
      error: "Database error: Failed to mark withdrawal as paid.",
    };
  }
}

// --- Admin Withdrawal Management Actions ---

// --- Get Withdrawal Requests (Admin) ---
export async function getWithdrawalRequests(
  status?: "PENDING" | "APPROVED" | "REJECTED" | "PAID"
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }

  try {
    const requests = await db.query.withdrawalRequests.findMany({
      where: status ? eq(withdrawalRequests.status, status) : undefined, // Optional status filter
      with: {
        user: {
          // Join with user table
          columns: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: (reqs, { desc }) => [desc(reqs.requestedAt)], // Show newest first
    });
    return requests;
  } catch (error) {
    console.error("Failed to fetch withdrawal requests:", error);
    return [];
  }
}

// --- Update User Profile Action ---

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  pixKey: z.string().optional(), // Optional PIX key
});

interface UpdateProfileResult {
  success: boolean;
  message?: string;
  error?: string;
  // fieldErrors?: z.ZodIssue['path'][]; // Consider returning field errors
}

export async function updateUserProfile(
  formData: z.infer<typeof UpdateProfileSchema>
): Promise<UpdateProfileResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;
  const userRole = session.user.role; // Get role for PIX key logic

  const validatedFields = UpdateProfileSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid profile data." };
  }
  const { firstName, lastName, pixKey } = validatedFields.data;

  try {
    const updateData: Partial<typeof users.$inferInsert> = {
      firstName,
      lastName,
      updatedAt: new Date(),
    };

    // Only allow updating PIX key for VENDOR or AFFILIATE
    if (
      (userRole === "VENDOR" || userRole === "AFFILIATE") &&
      pixKey !== undefined
    ) {
      updateData.pixKey = pixKey || null; // Set to null if empty string provided
    }

    await db.update(users).set(updateData).where(eq(users.id, userId));

    revalidatePath("/dashboard/profile"); // Revalidate profile page
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return {
      success: false,
      error: "Database error: Failed to update profile.",
    };
  }
}

// --- Address Management Actions ---

const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormData = z.infer<typeof AddressSchema>;

interface AddressActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

// --- Create Address ---
export async function createAddress(
  formData: AddressFormData
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  const validatedFields = AddressSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid address data." };
  }

  try {
    // Check if this is the first address, if so, make it default
    const existingAddresses = await db.query.addresses.findMany({
      where: eq(addresses.userId, userId),
      columns: { id: true },
    });
    const isFirstAddress = existingAddresses.length === 0;

    await db.insert(addresses).values({
      ...validatedFields.data,
      userId: userId,
      isDefault: isFirstAddress, // Set as default if it's the first one
    });

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Address added successfully." };
  } catch (error) {
    console.error("Failed to create address:", error);
    return { success: false, error: "Database error: Failed to add address." };
  }
}

// --- Update Address ---
export async function updateAddress(
  addressId: string,
  formData: AddressFormData
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  const validatedFields = AddressSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid address data." };
  }

  try {
    // Verify ownership before updating
    const [updated] = await db
      .update(addresses)
      .set({ ...validatedFields.data, updatedAt: new Date() })
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .returning({ id: addresses.id });

    if (!updated) {
      return { success: false, error: "Address not found or access denied." };
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Address updated successfully." };
  } catch (error) {
    console.error("Failed to update address:", error);
    return {
      success: false,
      error: "Database error: Failed to update address.",
    };
  }
}

// --- Delete Address ---
export async function deleteAddress(
  addressId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  try {
    // Verify ownership before deleting
    const [deleted] = await db
      .delete(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .returning({ id: addresses.id, isDefault: addresses.isDefault });

    if (!deleted) {
      return { success: false, error: "Address not found or access denied." };
    }

    // If the deleted address was the default, try to set another one as default
    if (deleted.isDefault) {
      const nextAddress = await db.query.addresses.findFirst({
        where: eq(addresses.userId, userId),
        orderBy: (addr, { desc }) => [desc(addr.createdAt)], // Pick the most recent as new default
      });
      if (nextAddress) {
        await db
          .update(addresses)
          .set({ isDefault: true })
          .where(eq(addresses.id, nextAddress.id));
      }
    }

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Address deleted successfully." };
  } catch (error) {
    console.error("Failed to delete address:", error);
    return {
      success: false,
      error: "Database error: Failed to delete address.",
    };
  }
}

// --- Set Default Address ---
export async function setDefaultAddress(
  addressId: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  try {
    // Use transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // 1. Unset current default
      await tx
        .update(addresses)
        .set({ isDefault: false })
        .where(
          and(eq(addresses.userId, userId), eq(addresses.isDefault, true))
        );

      // 2. Set new default (verify ownership implicitly)
      const [updated] = await tx
        .update(addresses)
        .set({ isDefault: true })
        .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
        .returning({ id: addresses.id });

      if (!updated) {
        throw new Error("Address not found or access denied."); // Rollback transaction
      }
    });

    revalidatePath("/dashboard/profile");
    return { success: true, message: "Default address updated." };
  } catch (error) {
    console.error("Failed to set default address:", error);
    const message =
      error instanceof Error &&
      error.message === "Address not found or access denied."
        ? error.message
        : "Database error: Failed to set default address.";
    return { success: false, error: message };
  }
}

// --- Admin User Management Actions ---

// --- Get Pending Users ---
export async function getPendingUsers() {
  const session = await auth();
  // Ensure user is admin
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
    // Or return { success: false, error: "Unauthorized" } if preferred
  }

  try {
    const pendingUsers = await db.query.users.findMany({
      where: eq(users.status, "PENDING"),
      columns: {
        // Select only necessary fields
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: (users, { asc }) => [asc(users.createdAt)],
    });
    return pendingUsers;
  } catch (error) {
    console.error("Failed to fetch pending users:", error);
    return []; // Return empty array on error
  }
}

// --- Approve User ---
export async function approveUser(
  userIdToApprove: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({ status: "ACTIVE", updatedAt: new Date() })
      .where(and(eq(users.id, userIdToApprove), eq(users.status, "PENDING"))) // Ensure user is actually pending
      .returning({ id: users.id });

    if (!updatedUser) {
      return {
        success: false,
        error: "User not found or not pending approval.",
      };
    }

    revalidatePath("/dashboard/admin/approvals"); // Revalidate approvals page
    // TODO: Send notification email to user?
    return { success: true, message: "User approved successfully." };
  } catch (error) {
    console.error("Failed to approve user:", error);
    return { success: false, error: "Database error: Failed to approve user." };
  }
}

// --- Reject User ---
export async function rejectUser(
  userIdToReject: string
): Promise<AddressActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedUser] = await db
      .update(users)
      .set({ status: "REJECTED", updatedAt: new Date() })
      .where(and(eq(users.id, userIdToReject), eq(users.status, "PENDING"))) // Ensure user is actually pending
      .returning({ id: users.id });

    if (!updatedUser) {
      return {
        success: false,
        error: "User not found or not pending approval.",
      };
    }

    revalidatePath("/dashboard/admin/approvals"); // Revalidate approvals page
    // TODO: Send notification email to user?
    return { success: true, message: "User rejected successfully." };
  } catch (error) {
    console.error("Failed to reject user:", error);
    return { success: false, error: "Database error: Failed to reject user." };
  }
}

export async function getVendorBalance() {
  const session = await auth();
  if (session?.user?.role !== "VENDOR" || !session?.user?.id) {
    // Only vendors have a balance in this context
    // Or throw an error if preferred
    return {
      availableBalance: 0,
      pendingBalance: 0, // Balance from orders not yet delivered/accessed
      pendingWithdrawals: 0, // Amount requested but not yet paid
      totalEarnings: 0, // Total earned from completed items (for info)
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
  const vendorId = session.user.id;
  // Ensure commission rate is read correctly from ENV and parsed
  const commissionRateString = process.env.MARKETPLACE_COMMISSION_RATE;
  if (commissionRateString === undefined) {
    console.error(
      "MARKETPLACE_COMMISSION_RATE environment variable is not set."
    );
    // Handle error appropriately, maybe return zero balance or throw
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
  const commissionRate = parseFloat(commissionRateString);
  if (isNaN(commissionRate)) {
    console.error("Invalid MARKETPLACE_COMMISSION_RATE:", commissionRateString);
    // Handle error
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }

  try {
    // 1. Calculate total earnings from completed order items
    const earningsResult = await db
      .select({
        // Use sql for explicit casting and null handling
        total: sql<string>`coalesce(sum(${orderItems.priceAtPurchaseInCents}::integer), 0)::text`,
      })
      .from(orderItems)
      .where(
        and(
          eq(orderItems.vendorId, vendorId),
          // Statuses indicating vendor should be credited
          or(
            eq(orderItems.status, "DELIVERED"),
            eq(orderItems.status, "ACCESS_GRANTED")
          )
        )
      )
      .groupBy(orderItems.vendorId); // Grouping needed for aggregate function

    const totalEarnedGross = parseInt(
      earningsResult[0]?.total?.toString() || "0"
    ); // Ensure parsing from potential string sum
    const totalCommission = Math.round(totalEarnedGross * commissionRate);
    const totalEarningsNet = totalEarnedGross - totalCommission;

    // 2. Calculate earnings from items pending completion (for info)
    const pendingEarningsResult = await db
      .select({
        // Use sql for explicit casting and null handling
        total: sql<string>`coalesce(sum(${orderItems.priceAtPurchaseInCents}::integer), 0)::text`,
      })
      .from(orderItems)
      .where(
        and(
          eq(orderItems.vendorId, vendorId),
          // Statuses indicating payment received but not yet fully completed for vendor payout
          inArray(orderItems.status, ["PENDING_FULFILLMENT", "SHIPPED"])
        )
      )
      .groupBy(orderItems.vendorId);

    const pendingEarnedGross = parseInt(
      pendingEarningsResult[0]?.total?.toString() || "0"
    );
    const pendingCommission = Math.round(pendingEarnedGross * commissionRate);
    const pendingBalance = pendingEarnedGross - pendingCommission;

    // 3. Calculate total amount from pending/approved withdrawal requests
    const withdrawalsResult = await db
      .select({
        // Use sql for explicit casting and null handling
        total: sql<string>`coalesce(sum(${withdrawalRequests.amountInCents}::integer), 0)::text`,
      })
      .from(withdrawalRequests)
      .where(
        and(
          eq(withdrawalRequests.userId, vendorId),
          // Withdrawals requested or approved but not yet marked as paid
          inArray(withdrawalRequests.status, ["PENDING", "APPROVED"])
        )
      )
      .groupBy(withdrawalRequests.userId);

    const pendingWithdrawals = parseInt(
      withdrawalsResult[0]?.total?.toString() || "0"
    );

    // 4. Calculate available balance
    // Available = Total Net Earnings (from completed items) - Pending/Approved Withdrawals
    const availableBalance = totalEarningsNet - pendingWithdrawals;

    return {
      availableBalance: availableBalance,
      pendingBalance: pendingBalance, // Informational: potential future earnings
      pendingWithdrawals: pendingWithdrawals, // Amount locked in requests
      totalEarnings: totalEarningsNet, // Net earnings from completed items
      formatted: {
        availableBalance: formatPrice(availableBalance),
        pendingBalance: formatPrice(pendingBalance),
        pendingWithdrawals: formatPrice(pendingWithdrawals),
        totalEarnings: formatPrice(totalEarningsNet),
      },
    };
  } catch (error) {
    console.error("Failed to calculate vendor balance:", error);
    // Return zero balance on error, log the error
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
}

// --- Request Withdrawal Action ---

const RequestWithdrawalSchema = z.object({
  amount: z.coerce // Use coerce to ensure string input becomes number
    .number()
    .int("Amount must be in cents.")
    .positive("Withdrawal amount must be positive."),
});

interface RequestWithdrawalResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function requestWithdrawal(
  formData: z.infer<typeof RequestWithdrawalSchema>
): Promise<RequestWithdrawalResult> {
  const session = await auth();
  if (session?.user?.role !== "VENDOR" || !session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized: Only vendors can request withdrawals.",
    };
  }
  const vendorId = session.user.id;

  // 1. Validate Input Amount
  const validatedFields = RequestWithdrawalSchema.safeParse(formData);
  if (!validatedFields.success) {
    // Extract specific field errors if needed
    const firstError =
      validatedFields.error.errors[0]?.message || "Invalid amount.";
    return { success: false, error: firstError };
  }
  const requestedAmountInCents = validatedFields.data.amount;

  try {
    // 2. Get Vendor's PIX Key and Current Balance
    const [vendorData, balanceData] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, vendorId),
        columns: { pixKey: true },
      }),
      getVendorBalance(), // Reuse the balance calculation logic
    ]);

    if (!vendorData) {
      return { success: false, error: "Vendor not found." }; // Should not happen if session is valid
    }

    // 3. Check for PIX Key
    if (!vendorData.pixKey) {
      return {
        success: false,
        error:
          "Please set your PIX key in your profile before requesting a withdrawal.",
      };
    }

    // 4. Check Available Balance
    if (requestedAmountInCents > balanceData.availableBalance) {
      return {
        success: false,
        error: `Withdrawal amount exceeds available balance (${formatPrice(balanceData.availableBalance)}).`,
      };
    }

    // 5. Check for existing PENDING withdrawal request (optional, prevent multiple pending)
    const existingPending = await db.query.withdrawalRequests.findFirst({
      where: and(
        eq(withdrawalRequests.userId, vendorId),
        eq(withdrawalRequests.status, "PENDING")
      ),
    });
    if (existingPending) {
      return {
        success: false,
        error: "You already have a pending withdrawal request.",
      };
    }

    // 6. Create Withdrawal Request Record
    await db.insert(withdrawalRequests).values({
      userId: vendorId,
      amountInCents: requestedAmountInCents,
      status: "PENDING", // Initial status
      pixKeyUsed: vendorData.pixKey, // Record the key used for this request
      requestedAt: new Date(),
    });

    // Revalidate relevant paths if needed (e.g., vendor dashboard, admin withdrawals page)
    revalidatePath("/dashboard/vendor");
    // revalidatePath("/dashboard/admin/withdrawals"); // Uncomment when admin page exists

    return {
      success: true,
      message: "Withdrawal request submitted successfully.",
    };
  } catch (error) {
    console.error("Failed to request withdrawal:", error);
    return {
      success: false,
      error: "Database error: Failed to submit withdrawal request.",
    };
  }
}
