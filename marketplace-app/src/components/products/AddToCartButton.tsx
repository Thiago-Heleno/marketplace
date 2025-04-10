"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import type { products, productVariants } from "@/db/schema";

// Define the props needed for the button
interface AddToCartButtonProps {
  productId: (typeof products.$inferSelect)["id"];
  selectedVariant: typeof productVariants.$inferSelect | null; // Allow null if no variants or none selected
  productStock: number; // Base product stock if no variants
  variants: (typeof productVariants.$inferSelect)[]; // All variants for stock checking
}

export function AddToCartButton({
  productId,
  selectedVariant,
  productStock,
  variants,
}: AddToCartButtonProps) {
  const { addToCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    let variantIdToAdd: string | null = null;
    let stockToCheck: number = productStock; // Default to base product stock
    let canAddToCart = true;

    // Determine which stock to check and which ID to add
    if (variants.length > 0) {
      // Product has variants
      if (!selectedVariant) {
        toast.error("Please select a variant.");
        return; // Don't add if variant needed but not selected
      }
      variantIdToAdd = selectedVariant.id;
      stockToCheck = selectedVariant.stock;
    } else {
      // Product has no variants, use base product stock
      variantIdToAdd = null; // No variant ID needed for cart context in this case
      stockToCheck = productStock;
    }

    // Check stock availability
    const currentQuantityInCart = getItemQuantity(variantIdToAdd ?? productId); // Use product ID if no variant
    if (currentQuantityInCart >= stockToCheck) {
      toast.error("Item is out of stock or quantity limit reached.");
      canAddToCart = false;
    }

    if (canAddToCart) {
      // Use productId as the variantId if no variant is selected/exists
      const idForCart = variantIdToAdd ?? productId;
      // Pass the item object as expected by the context
      addToCart({
        productId: productId,
        productVariantId: idForCart, // Use productId if variantIdToAdd is null
        // quantity: 1 // Default quantity is 1 in the context function
      });
      toast.success("Item added to cart!");
    }
  };

  // Determine if button should be disabled
  const isOutOfStock = selectedVariant
    ? selectedVariant.stock <= 0
    : productStock <= 0;
  const isDisabled = isOutOfStock || (variants.length > 0 && !selectedVariant);

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full mt-6"
      disabled={isDisabled}
    >
      {isDisabled
        ? isOutOfStock
          ? "Out of Stock"
          : "Select Variant"
        : "Add to Cart"}
    </Button>
  );
}
