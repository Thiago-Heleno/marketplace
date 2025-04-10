"use server";

// import { redirect } from "next/navigation"; // Unused
import Stripe from "stripe";
import { auth } from "../../auth"; // Corrected import path
import { db } from "@/db";
import { products, productVariants } from "@/db/schema"; // Import necessary schemas
import { inArray } from "drizzle-orm"; // Removed unused eq
import { CartItem } from "@/context/CartContext"; // Import CartItem type

// Ensure Stripe secret key is set in environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia", // Updated API version based on error
});

// Define the expected input for the action
interface CreateCheckoutSessionInput {
  cartItems: CartItem[];
  addressId?: string | null;
  affiliateCode?: string | null; // Add optional affiliate code
}

interface CreateCheckoutSessionResult {
  success: boolean;
  error?: string;
  sessionId?: string; // ID of the Stripe Checkout Session
  redirectUrl?: string; // URL to redirect the user to
}

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "User not authenticated." };
  }
  const userId = session.user.id;

  const { cartItems, addressId, affiliateCode } = input; // Destructure affiliateCode

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Cart is empty." };
  }

  try {
    // 1. Fetch Product Variant Details from DB
    const variantIds = cartItems.map((item) => item.productVariantId);
    const fetchedVariants = await db.query.productVariants.findMany({
      where: inArray(productVariants.id, variantIds),
      with: {
        product: {
          // Fetch base product info too
          columns: {
            title: true,
            isPhysical: true,
            isDigital: true,
            // Add other fields if needed for Stripe line items (e.g., description, images)
          },
        },
      },
      columns: {
        id: true,
        productId: true,
        name: true,
        value: true,
        priceModifierInCents: true,
        stock: true, // Add stock column
        // Need base price from product table
      },
    });

    // Fetch base product prices separately (or adjust query above if possible)
    const productIds = fetchedVariants.map((v) => v.productId);
    const baseProducts = await db.query.products.findMany({
      where: inArray(products.id, productIds),
      columns: { id: true, priceInCents: true },
    });
    const basePriceMap = new Map(
      baseProducts.map((p) => [p.id, p.priceInCents])
    );

    // --- Pre-Checkout Stock Check ---
    for (const item of cartItems) {
      const variantDetails = fetchedVariants.find(
        (v) => v.id === item.productVariantId
      );
      if (!variantDetails) {
        // This case should ideally not happen if cart is synced, but good to check
        return {
          success: false,
          error: `Details not found for an item in your cart (Variant ID: ${item.productVariantId}). Please refresh your cart.`,
        };
      }
      // Check stock for the specific variant
      if (variantDetails.stock < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${variantDetails.product.title} ${variantDetails.name ? `(${variantDetails.name}: ${variantDetails.value})` : ""}. Requested: ${item.quantity}, Available: ${variantDetails.stock}.`,
        };
      }
    }
    // --- End Stock Check ---

    // 2. Construct Stripe Line Items & Check for Physical Goods
    let hasPhysicalItems = false;
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cartItems) {
      const variantDetails = fetchedVariants.find(
        (v) => v.id === item.productVariantId
      );
      const basePrice = basePriceMap.get(variantDetails?.productId ?? "");

      if (!variantDetails || basePrice === undefined) {
        console.error(
          `Details not found for variant ID: ${item.productVariantId}`
        );
        return {
          success: false,
          error: `Product details missing for an item in your cart.`,
        };
      }

      if (variantDetails.product.isPhysical) {
        hasPhysicalItems = true;
      }

      const finalPrice = basePrice + (variantDetails.priceModifierInCents || 0);

      line_items.push({
        price_data: {
          currency: "usd", // Or your desired currency
          product_data: {
            name: `${variantDetails.product.title} ${variantDetails.name ? `(${variantDetails.name}: ${variantDetails.value})` : ""}`.trim(),
            // Add description, images if needed
            metadata: {
              // Store IDs for webhook processing
              productId: variantDetails.productId,
              productVariantId: variantDetails.id,
            },
          },
          unit_amount: finalPrice, // Price in cents
        },
        quantity: item.quantity,
      });
    }

    // 3. Add Shipping Cost if Physical Items Present
    const flatShippingRateCents = parseInt(
      process.env.FLAT_SHIPPING_RATE_CENTS || "0",
      10
    );
    if (hasPhysicalItems) {
      if (!addressId) {
        return {
          success: false,
          error: "Shipping address is required for physical items.",
        };
      }
      if (flatShippingRateCents > 0) {
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping Fee",
            },
            unit_amount: flatShippingRateCents,
          },
          quantity: 1,
        });
      }
    }

    // 4. Prepare Metadata for Webhook
    const metadata = {
      userId: userId,
      // Stringify cart details to fit in metadata (Stripe limits value size)
      // Store only essential info needed to recreate the order in the webhook
      cartDetails: JSON.stringify(
        cartItems.map((item) => ({
          vId: item.productVariantId,
          qty: item.quantity,
        }))
      ),
      // Ensure addressId is string or null, never undefined for Stripe metadata
      addressId: hasPhysicalItems && addressId ? addressId : null,
      // Include affiliateCode in metadata if it exists and is not empty
      ...(affiliateCode && {
        affiliateCode: affiliateCode.trim().toUpperCase(),
      }),
    };

    // 5. Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`, // Use env var for base URL
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?cancelled=true`, // Redirect back to cart on cancellation
      metadata: metadata,
      // If collecting address in Stripe Checkout for physical goods:
      // shipping_address_collection: hasPhysicalItems ? { allowed_countries: ['US', 'CA'] } : undefined, // Example countries
    });

    if (!stripeSession.url) {
      return { success: false, error: "Could not create Stripe session." };
    }

    // 6. Return Session ID and Redirect URL
    return {
      success: true,
      sessionId: stripeSession.id,
      redirectUrl: stripeSession.url,
    };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Stripe error: ${errorMessage}` };
  }
}
