import React from "react";
// import Image from "next/image"; // Remove unused import
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils"; // Assuming formatPrice exists
import { SafeImage } from "@/components/ui/SafeImage"; // Import the new component

// Define the expected props based on getPublicProducts return type
interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    priceInCents: number;
    imageUrl: string | null;
    category?: {
      // Optional category display
      name: string;
      slug: string;
    } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const placeholderImage = "/placeholder.svg"; // Define a placeholder

  return (
    <Card
      className="w-full overflow-hidden transition-shadow duration-200 hover:shadow-lg"
      data-testid={`product-card-${product.id}`} // Added data-testid
    >
      <Link href={`/products/${product.slug}`} aria-label={product.title}>
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full">
            <SafeImage // Use SafeImage component
              src={product.imageUrl || placeholderImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Basic responsive sizes
              className="object-cover"
              priority={false} // Set priority based on context if needed (e.g., for first few items)
              fallbackSrc={placeholderImage} // Pass the fallback
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-semibold leading-tight truncate">
            {product.title}
          </CardTitle>
          {/* Optional: Display category */}
          {/* {product.category && (
            <p className="text-sm text-muted-foreground mt-1">
              {product.category.name}
            </p>
          )} */}
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-base font-medium">
            {formatPrice(product.priceInCents)}
          </p>
          {/* Add other info like rating later if needed */}
        </CardFooter>
      </Link>
    </Card>
  );
}
