"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Or SafeImage if you kept it previously
import { getPublicProductBySlug } from "@/actions/product.actions"; // Corrected path
import { formatPrice } from "@/lib/utils"; // Corrected path
import { Badge } from "@/components/ui/badge"; // Corrected path
import { Separator } from "@/components/ui/separator"; // Corrected path
import { SessionProvider } from "next-auth/react";
import { ReviewList } from "@/components/products/ReviewList"; // Corrected path
import { QuestionAnswerList } from "@/components/products/QuestionAnswerList"; // Corrected path
import { ReviewForm } from "@/components/products/ReviewForm"; // Corrected path
import { QuestionForm } from "@/components/products/QuestionForm"; // Corrected path
import { ProductVariantSelector } from "@/components/products/ProductVariantSelector"; // Corrected path
import { AddToCartButton } from "@/components/products/AddToCartButton"; // Corrected path
// Removed unused types: import type { products, productVariants } from "@/db/schema";

// Define a non-nullable type for the product prop
type ProductData = NonNullable<
  Awaited<ReturnType<typeof getPublicProductBySlug>>
>;

interface ProductPageClientProps {
  product: ProductData;
}

// Removed unused helper functions: formatDate, getInitials

export function ProductPageClient({ product }: ProductPageClientProps) {
  const placeholderImage = "/placeholder.svg"; // Assuming this exists in public

  // State managed within the client component
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );
  const [mainImgSrc, setMainImgSrc] = useState(
    product.images?.[0]?.url || placeholderImage
  );

  // Effect to update image src if product prop changes (e.g., navigating between client-rendered product pages)
  useEffect(() => {
    setMainImgSrc(product.images?.[0]?.url || placeholderImage);
    // Reset selected variant when product changes
    setSelectedVariantId(null);
  }, [product.id, product.images, placeholderImage]); // Added placeholderImage dependency

  // Internal onError handler for the main image
  const handleMainImageError = () => {
    if (mainImgSrc !== placeholderImage) {
      console.warn(`Image error, falling back: ${product.images?.[0]?.url}`);
      setMainImgSrc(placeholderImage);
    }
  };

  // Find the selected variant object based on ID
  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ?? null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square relative w-full overflow-hidden rounded-lg border">
            {/* Use standard Image component with state src and internal handler */}
            <Image
              src={mainImgSrc}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority // Prioritize main product image
              onError={handleMainImageError}
            />
          </div>
          {/* Thumbnail gallery logic can remain here */}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold mb-4">
            {formatPrice(product.priceInCents)}
          </p>
          <div className="flex items-center gap-2 mb-4">
            {product.category && (
              <Badge variant="outline">{product.category.name}</Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Sold by: {product.vendor.name}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-muted-foreground mb-6">
            {product.description || "No description available."}
          </div>

          {/* Variant Selection */}
          <ProductVariantSelector
            variants={product.variants || []}
            onVariantSelect={setSelectedVariantId} // Pass setter function
          />

          {/* Add to Cart */}
          <AddToCartButton
            productId={product.id}
            selectedVariant={selectedVariant} // Pass selected variant object
            productStock={product.stock} // Pass base stock
            variants={product.variants || []} // Pass all variants for stock check
          />

          {/* Stock Info */}
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Stock:{" "}
            {selectedVariant
              ? selectedVariant.stock > 0
                ? selectedVariant.stock
                : "Out of Stock"
              : product.stock > 0
                ? product.stock
                : "Out of Stock"}
            {selectedVariant && ` (Selected: ${selectedVariant.value})`}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <Separator className="mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
            <SessionProvider>
              {" "}
              {/* SessionProvider needed here */}
              <ReviewForm productId={product.id} />
            </SessionProvider>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Existing Reviews</h3>
            <ReviewList reviews={product.reviews || []} />
          </div>
        </div>
      </div>

      {/* Q&A Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Questions & Answers</h2>
        <Separator className="mb-6" />
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Ask a Question</h3>
          <SessionProvider>
            {" "}
            {/* SessionProvider needed here */}
            <QuestionForm productId={product.id} />
          </SessionProvider>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Existing Questions</h3>
          <SessionProvider>
            {" "}
            {/* SessionProvider needed here */}
            <QuestionAnswerList
              questionAnswers={product.questionAnswers || []}
            />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
}
