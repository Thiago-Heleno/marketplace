"use client";

import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { productVariants } from "@/db/schema"; // Import schema type

type Variant = typeof productVariants.$inferSelect;

interface ProductVariantSelectorProps {
  variants: Variant[];
  onVariantSelect: (variantId: string | null) => void; // Callback to parent
}

export function ProductVariantSelector({
  variants,
  onVariantSelect,
}: ProductVariantSelectorProps) {
  // State to hold the ID of the selected variant
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  // Handle selection change
  const handleSelectionChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    onVariantSelect(variantId); // Notify parent component
  };

  if (!variants || variants.length === 0) {
    return null; // Don't render anything if no variants
  }

  // Group variants by name (e.g., "Color", "Size") for display purposes
  const variantGroups: Record<string, Variant[]> = {};
  variants.forEach((variant) => {
    if (!variantGroups[variant.name]) {
      variantGroups[variant.name] = [];
    }
    variantGroups[variant.name].push(variant);
  });
  const groupNames = Object.keys(variantGroups);

  return (
    <div className="mt-4 space-y-4">
      <Label className="text-base font-medium">Select Option</Label>
      <RadioGroup
        onValueChange={handleSelectionChange} // Pass the variant ID directly
        value={selectedVariantId ?? ""} // Use selected ID for value
        className="flex flex-wrap gap-2"
      >
        {variants.map((variant) => (
          <Label
            key={variant.id}
            htmlFor={variant.id}
            className={`flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent ${
              selectedVariantId === variant.id
                ? "bg-accent ring-2 ring-primary"
                : ""
            } ${variant.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`} // Dim out of stock
          >
            <RadioGroupItem
              value={variant.id} // Use variant ID as the value for selection
              id={variant.id}
              className="sr-only"
              disabled={variant.stock <= 0} // Disable out of stock
            />
            {/* Display variant name and value */}
            {groupNames.length > 1 && `${variant.name}: `}
            {variant.value}
            {variant.stock <= 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                (Out of stock)
              </span>
            )}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
