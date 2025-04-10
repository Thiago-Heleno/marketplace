"use client"; // Correct placement of directive

import React, { useState } from "react"; // Import useState
import Image from "next/image";
import { getPublicProductBySlug } from "@/actions/product.actions";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; // Import Separator
import { SessionProvider } from "next-auth/react"; // Import SessionProvider
import { ReviewList } from "@/components/products/ReviewList"; // Import actual components
import { QuestionAnswerList } from "@/components/products/QuestionAnswerList";
import { ReviewForm } from "@/components/products/ReviewForm";
import { QuestionForm } from "@/components/products/QuestionForm";
import { ProductVariantSelector } from "@/components/products/ProductVariantSelector"; // Import new component
import { AddToCartButton } from "@/components/products/AddToCartButton"; // Import new component
import type { Metadata } from "next"; // Removed ResolvingMetadata
import type {} from // products, // Removed unused import
// productVariants, // Removed unused import
// reviews as reviewsSchema, // Type not needed directly here
// questionAnswers as qnaSchema, // Type not needed directly here
// users, // Type not needed directly here
"@/db/schema"; // Import schema types

// Define more specific types for placeholder props - Removed unused Variant type
// type Variant = typeof productVariants.$inferSelect;
// type Review = typeof reviewsSchema.$inferSelect & { // Removed unused type
//   user?: Pick<typeof users.$inferSelect, "firstName" | "lastName"> | null;
// };
// type QnA = typeof qnaSchema.$inferSelect & { // Removed unused type
//   user?: Pick<typeof users.$inferSelect, "firstName" | "lastName"> | null;
//   answeredByUser?: Pick<
//     typeof users.$inferSelect,
//     "firstName" | "lastName"
//   > | null;
// };
// A simplified product type for the AddToCartButton, adjust as needed - No longer needed here
// type ProductForCart = Pick<typeof products.$inferSelect, "id" | "stock">;

// Removed placeholder components

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  // State to hold the selected variant ID
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null
  );

  // Fetch data within the client component or pass as props if using Server Component structure
  // For simplicity here, assuming product data is fetched and available
  // In a real app, you might fetch this data server-side and pass it down,
  // or use a hook like useSWR/React Query client-side.
  // Let's assume 'product' is available as fetched data (like in the original server component)
  // const product = await getPublicProductBySlug(params.slug); // This needs to be handled differently in client component

  // --- TEMPORARY: Mock product data structure for client-side rendering ---
  // Replace this with actual data fetching logic (e.g., useEffect + fetch or library)
  const [product, setProduct] = React.useState<Awaited<
    ReturnType<typeof getPublicProductBySlug>
  > | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const fetchedProduct = await getPublicProductBySlug(params.slug);
      if (!fetchedProduct) {
        // Handle not found case, maybe redirect or show error
        console.error("Product not found");
      }
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    fetchData();
  }, [params.slug]);
  // --- END TEMPORARY MOCK ---

  if (isLoading) {
    // TODO: Add proper loading skeleton
    return <div>Loading product...</div>;
  }

  if (!product) {
    // Handle not found case after fetch attempt
    notFound(); // Or return a "Not Found" component
  }

  const placeholderImage = "/placeholder.svg";

  // Find the selected variant object based on ID
  const selectedVariant =
    product.variants?.find((v) => v.id === selectedVariantId) ?? null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square relative w-full overflow-hidden rounded-lg border">
            <Image
              src={product.images?.[0]?.url || placeholderImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority // Prioritize main product image
              onError={(e) => {
                e.currentTarget.srcset = placeholderImage;
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>
          {/* TODO: Add thumbnail gallery if multiple images exist */}
          {/* {product.images && product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {product.images.map((img) => (
                <div key={img.id} className="aspect-square relative border rounded overflow-hidden cursor-pointer">
                   <Image src={img.url} alt={`Thumbnail ${img.order + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )} */}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold mb-4">
            {formatPrice(product.priceInCents)}
          </p>
          {/* TODO: Add average rating display */}
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

          {/* Stock Info - Shows selected variant stock or base stock */}
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
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
        <Separator className="mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Leave a Review</h3>
            {/* SessionProvider needed for useSession in ReviewForm */}
            <SessionProvider>
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
          {/* SessionProvider needed for useSession in QuestionForm */}
          <SessionProvider>
            <QuestionForm productId={product.id} />
          </SessionProvider>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4">Existing Questions</h3>
          {/* SessionProvider needed for useSession in QuestionAnswerList */}
          <SessionProvider>
            <QuestionAnswerList
              questionAnswers={product.questionAnswers || []}
            />
          </SessionProvider>
        </div>
      </div>
    </div>
  );
}

// --- generateMetadata ---
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props // Removed unused _parent
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data
  const product = await getPublicProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  if (!product) {
    // Return default metadata or handle not found case
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  return {
    title: `${product.title} | Marketplace`,
    description:
      product.description?.substring(0, 160) || // Use first 160 chars of description
      `Check out ${product.title} on our marketplace.`, // Fallback description
    openGraph: {
      title: product.title,
      description:
        product.description?.substring(0, 160) || `Check out ${product.title}`,
      images: product.images?.[0]?.url
        ? [
            {
              url: product.images[0].url, // Use the first product image
              // width: 800, // Optional: Specify image dimensions
              // height: 600,
              alt: product.title,
            },
          ]
        : [], // Provide empty array if no image
    },
  };
}
