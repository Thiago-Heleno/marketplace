import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { db } from "@/db";
import {
  orders,
  orderItems,
  products,
  productVariants,
  affiliateCodes, // Added
  affiliateReferrals, // Added
} from "@/db/schema";
import { eq, inArray, sql, and } from "drizzle-orm"; // Added 'and'
import { Resend } from "resend";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const affiliateCommissionRateString = process.env.AFFILIATE_COMMISSION_RATE; // Added

if (
  !stripeSecretKey ||
  !webhookSecret ||
  !resendApiKey ||
  affiliateCommissionRateString === undefined // Check if rate is set
) {
  throw new Error(
    "Stripe secret key, webhook secret, Resend API key, or Affiliate Commission Rate is not set in environment variables."
  );
}

const stripe = new Stripe(stripeSecretKey);
const resend = new Resend(resendApiKey);

// Helper type for parsed cart details
type ParsedCartItem = { vId: string; qty: number };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }
  if (!webhookSecret) {
    console.error("❌ Stripe webhook secret is not configured.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(
      `❌ Error verifying Stripe webhook signature: ${errorMessage}`
    );
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("✅ Received checkout.session.completed event:", session.id);

    // --- Order Creation Logic ---
    const metadata = session.metadata;
    const userId = metadata?.userId;
    const cartDetailsString = metadata?.cartDetails;
    const shippingAddressId = metadata?.addressId;
    const affiliateCode = metadata?.affiliateCode; // Extract affiliate code
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    const customerEmail = session.customer_details?.email; // Get customer email for confirmation
    const totalAmount = session.amount_total; // Total amount in cents from Stripe

    // Basic validation of metadata
    if (!userId || !cartDetailsString || !paymentIntentId || !totalAmount) {
      console.error("❌ Missing essential metadata from Stripe session:", {
        userId,
        cartDetailsString,
        paymentIntentId,
        totalAmount,
      });
      return NextResponse.json(
        { error: "Missing essential metadata." },
        { status: 400 }
      );
    }

    let parsedCartItems: ParsedCartItem[] = [];
    try {
      parsedCartItems = JSON.parse(cartDetailsString);
      if (!Array.isArray(parsedCartItems) || parsedCartItems.length === 0) {
        throw new Error("Invalid cart details format or empty cart.");
      }
    } catch (error) {
      console.error("❌ Failed to parse cartDetails metadata:", error);
      return NextResponse.json(
        { error: "Invalid cart details metadata." },
        { status: 400 }
      );
    }

    try {
      // Fetch necessary product/variant details for order creation
      const variantIds = parsedCartItems.map((item) => item.vId);
      const fetchedVariants = await db.query.productVariants.findMany({
        where: inArray(productVariants.id, variantIds),
        with: {
          product: {
            columns: { id: true, vendorId: true, isDigital: true, title: true },
          },
        },
        columns: { id: true, productId: true, priceModifierInCents: true },
      });

      const productIds = fetchedVariants.map((v) => v.productId);
      const baseProducts = await db.query.products.findMany({
        where: inArray(products.id, productIds),
        columns: { id: true, priceInCents: true },
      });
      const basePriceMap = new Map(
        baseProducts.map((p) => [p.id, p.priceInCents])
      );

      // Assert userId as string before transaction, as the initial check guarantees it's defined here.
      const customerUserId = userId as string;

      // Start DB Transaction
      const newOrderId = await db.transaction(async (tx) => {
        // Create Order record
        const [newOrder] = await tx
          .insert(orders)
          .values({
            userId: customerUserId, // Use asserted variable
            totalAmountInCents: totalAmount,
            shippingAddressId: shippingAddressId || null, // Use null if not provided
            stripePaymentIntentId: paymentIntentId,
            status: "PROCESSING", // Initial status
          })
          .returning({ id: orders.id });

        if (!newOrder?.id) {
          throw new Error("Failed to create order record.");
        }
        const orderId = newOrder.id;

        // Create OrderItem records and decrement stock
        for (const item of parsedCartItems) {
          const variantDetails = fetchedVariants.find((v) => v.id === item.vId);
          const basePrice = basePriceMap.get(variantDetails?.productId ?? "");

          if (!variantDetails || basePrice === undefined) {
            throw new Error(`Could not find details for variant ${item.vId}`);
          }

          const finalPrice =
            basePrice + (variantDetails.priceModifierInCents || 0);
          const itemStatus = variantDetails.product.isDigital
            ? "ACCESS_GRANTED"
            : "PENDING_FULFILLMENT";

          // Insert Order Item
          const [insertedOrderItem] = await tx
            .insert(orderItems)
            .values({
              // Capture inserted item ID
              orderId: orderId,
              productId: variantDetails.productId,
              productVariantId: variantDetails.id,
              vendorId: variantDetails.product.vendorId, // Get vendorId from fetched product
              quantity: item.qty,
              priceAtPurchaseInCents: finalPrice,
              status: itemStatus,
            })
            .returning({ id: orderItems.id }); // Return the ID

          if (!insertedOrderItem?.id) {
            console.error(
              `❌ Failed to insert or retrieve ID for order item with variant ${variantDetails.id}`
            );
            // Optionally throw error to rollback transaction if this is critical
            continue; // Skip stock/affiliate logic if item insertion failed
          }
          const newOrderItemId = insertedOrderItem.id;

          // Decrement Stock (Atomic operation with check)
          const updateStockResult = await tx
            .update(productVariants)
            .set({ stock: sql`${productVariants.stock} - ${item.qty}` })
            .where(
              and(
                eq(productVariants.id, item.vId),
                sql`${productVariants.stock} >= ${item.qty}` // Check if stock is sufficient
              )
            )
            .returning({ id: productVariants.id }); // Return ID to check if update occurred

          // Check if stock update failed (due to insufficient stock)
          if (updateStockResult.length === 0) {
            console.error(
              `❌ Stock update failed for variant ${item.vId} (Order ${orderId}, Item ${newOrderItemId}). Insufficient stock (${item.qty} requested). Payment already processed.`
            );
            // Mark the order item as cancelled due to stock issue after payment
            await tx
              .update(orderItems)
              .set({ status: "CANCELLED" }) // Or a custom 'STOCK_ERROR' status
              .where(eq(orderItems.id, newOrderItemId));
            console.warn(
              `⚠️ Order item ${newOrderItemId} status set to CANCELLED due to insufficient stock after payment.`
            );
            // Skip affiliate logic for this item as it couldn't be fulfilled
            continue;
          }

          // --- Affiliate Referral Logic ---
          // Check if affiliateCode is a valid, non-empty string first
          if (
            typeof affiliateCode === "string" && // Check type first
            affiliateCode.trim() !== "" // Then check content
          ) {
            const codeToQuery = affiliateCode; // Let TS infer type (should be string here)
            const affiliateRate = parseFloat(affiliateCommissionRateString);

            if (isNaN(affiliateRate)) {
              console.error(
                "❌ Invalid AFFILIATE_COMMISSION_RATE:",
                affiliateCommissionRateString
              );
            } else {
              // Now query for the code using the guaranteed string constant
              const validCode = await tx.query.affiliateCodes.findFirst({
                where: and(
                  eq(affiliateCodes.code, codeToQuery), // Use the guaranteed string
                  eq(affiliateCodes.isActive, true)
                ),
                columns: { id: true, userId: true },
              });

              // Check if code exists, is active, and affiliate is not the customer
              // Use the asserted customerUserId here
              if (validCode && validCode.userId !== customerUserId) {
                const commissionEarned = Math.round(finalPrice * affiliateRate);

                // Insert referral record only if commission > 0
                if (commissionEarned > 0) {
                  await tx.insert(affiliateReferrals).values({
                    affiliateUserId: validCode.userId,
                    affiliateCodeId: validCode.id,
                    orderItemId: newOrderItemId, // Use the captured ID
                    commissionRateAtTime: Math.round(affiliateRate * 10000), // Store as basis points (e.g., 5% = 500)
                    commissionEarnedInCents: commissionEarned,
                    status: "PENDING", // Initial status
                  });
                  console.log(
                    `🔗 Affiliate referral created for order item ${newOrderItemId} via code ${codeToQuery}` // Use guaranteed string
                  );
                }
              } else if (validCode && validCode.userId === customerUserId) {
                // Use asserted variable
                // Log inside the main 'if' block where codeToQuery is string
                console.log(
                  // Use asserted customerUserId variable
                  `ℹ️ Affiliate code ${codeToQuery} belongs to the customer (${customerUserId}), skipping referral.`
                );
              } else {
                // Log inside the main 'if' block where codeToQuery is string
                console.log(
                  `ℹ️ Affiliate code ${codeToQuery} not found or inactive.`
                );
              }
            }
          } else {
            // Log here if the code was provided but invalid/empty
            if (affiliateCode) {
              // Check if it existed at all
              // Simplify log message to avoid type issues with interpolation
              console.log(
                // Uncommented the log
                `ℹ️ Invalid or empty affiliate code provided, skipping referral.`
              );
            }
            // No need to log if affiliateCode was undefined/null initially
          }
          // --- End Affiliate Referral Logic ---
        }

        return orderId;
      }); // End DB Transaction

      // Send Order Confirmation Email (outside transaction)
      if (customerEmail && newOrderId) {
        try {
          await resend.emails.send({
            from: "Marketplace <noreply@yourdomain.com>", // Replace with your verified domain
            to: customerEmail,
            subject: "Your Marketplace Order Confirmation",
            // TODO: Create a proper email template (React Email?)
            html: `<p>Thank you for your order! Your order ID is ${newOrderId}.</p><p>We've received your payment and are processing your order.</p>`,
          });
          console.log(
            `✅ Order confirmation email sent to ${customerEmail} for order ${newOrderId}`
          );
        } catch (emailError) {
          console.error(
            `❌ Failed to send order confirmation email for order ${newOrderId}:`,
            emailError
          );
          // Don't fail the webhook response if email fails, just log it.
        }
      } else {
        console.warn(
          `⚠️ Could not send confirmation email. Missing email or order ID. Email: ${customerEmail}, OrderID: ${newOrderId}`
        );
      }
    } catch (error) {
      console.error("❌ Error processing order:", error);
      // Return 500 even if processing fails, Stripe will retry.
      return NextResponse.json(
        { error: "Internal server error during order processing." },
        { status: 500 }
      );
    }
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
