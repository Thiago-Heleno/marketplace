"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart, CartItem } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Trash2, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/actions/checkout.actions";
import { toast } from "sonner";
import { Label } from "@/components/ui/label"; // Import Label

// Placeholder type for fetched product details - refine later
interface CartItemDetails extends CartItem {
  title: string;
  priceInCents: number;
  imageUrl: string | null;
  slug: string;
  variantName?: string; // e.g., "Size"
  variantValue?: string; // e.g., "Large"
  isPhysical: boolean;
}

// Placeholder function to fetch details - replace with actual action later
async function fetchCartItemDetails(
  items: CartItem[]
): Promise<CartItemDetails[]> {
  console.log("Placeholder: Fetching details for items:", items);
  // In a real app, this would call a server action:
  // const details = await getCartItemsDetailsAction(items.map(item => item.productVariantId));
  // return items.map(item => ({ ...item, ...details[item.productVariantId] }));

  // Mock data for now:
  return items.map((item) => ({
    ...item,
    title: `Product ${item.productId.substring(0, 4)}`,
    priceInCents: Math.floor(Math.random() * 5000) + 1000, // Random price
    imageUrl: null, // Placeholder
    slug: `product-${item.productId.substring(0, 4)}`,
    variantName: "Size",
    variantValue: "M",
    isPhysical: Math.random() > 0.5,
  }));
}

export function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } =
    useCart();
  const [detailedItems, setDetailedItems] = useState<CartItemDetails[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState(""); // State for affiliate code input

  // Fetch details when cart items change and sheet is open
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      setIsLoadingDetails(true);
      fetchCartItemDetails(cartItems)
        .then(setDetailedItems)
        .catch((err) => console.error("Failed to fetch cart details:", err))
        .finally(() => setIsLoadingDetails(false));
    } else if (cartItems.length === 0) {
      setDetailedItems([]); // Clear details if cart is empty
    }
  }, [cartItems, isOpen]);

  const subtotal = detailedItems.reduce(
    (sum, item) => sum + item.priceInCents * item.quantity,
    0
  );

  // Check if any item is physical (needed for checkout prep)
  const hasPhysicalItems = detailedItems.some((item) => item.isPhysical);

  // Handle checkout button click
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // TODO: Pass selected addressId when implemented
      const result = await createCheckoutSession({ cartItems, affiliateCode }); // Pass affiliateCode

      if (result.success && result.redirectUrl) {
        // Redirect to Stripe checkout
        window.location.href = result.redirectUrl;
        // Optionally clear cart here or wait for webhook confirmation
        // clearCart();
      } else {
        toast.error(result.error || "Failed to initiate checkout.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Open shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          {" "}
          {/* Add ScrollArea */}
          {isLoadingDetails ? ( // Use renamed state
            <p className="text-center py-10">Loading cart details...</p> // Basic loading state
          ) : detailedItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-4">
              {detailedItems.map((item) => (
                <div
                  key={item.productVariantId}
                  className="flex gap-4 items-start"
                >
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="rounded border aspect-square object-cover"
                  />
                  <div className="flex-grow">
                    <Link
                      href={`/products/${item.slug}`}
                      className="hover:underline font-medium text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.variantName && item.variantValue && (
                      <p className="text-xs text-muted-foreground">
                        {item.variantName}: {item.variantValue}
                      </p>
                    )}
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice(item.priceInCents)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.productVariantId,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="h-8 w-16 text-center"
                        aria-label={`Quantity for ${item.title}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.productVariantId)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {detailedItems.length > 0 && (
          <SheetFooter className="mt-auto pt-6 border-t">
            <div className="w-full space-y-4">
              {/* Affiliate Code Input */}
              <div className="space-y-1.5">
                <Label htmlFor="affiliate-code">
                  Affiliate Code (Optional)
                </Label>
                <Input
                  id="affiliate-code"
                  value={affiliateCode}
                  onChange={(e) =>
                    setAffiliateCode(e.target.value.toUpperCase())
                  } // Store uppercase
                  placeholder="Enter code"
                  disabled={isCheckingOut}
                  className="h-9"
                />
              </div>

              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {/* Placeholder for shipping/address (Task 3.4) */}
              {hasPhysicalItems && (
                <p className="text-sm text-muted-foreground text-center">
                  Shipping cost ({formatPrice(500)}) will be added.{" "}
                  {/* Placeholder value */}
                  <br />
                  Address selection required at checkout (Task 3.4).
                </p>
              )}
              {/* TODO: Implement actual address fetching/selection UI */}
              <Button
                className="w-full"
                onClick={handleCheckout} // Add onClick handler
                disabled={
                  isLoadingDetails ||
                  isCheckingOut ||
                  hasPhysicalItems /* && !selectedAddressId */
                } // Disable during loading, checkout, or if address needed but not selected
              >
                {isCheckingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </Button>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
