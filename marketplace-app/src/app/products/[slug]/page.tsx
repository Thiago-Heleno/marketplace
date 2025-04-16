// NO "use client" directive here - this is a Server Component

import React from "react";
import { getPublicProductBySlug } from "@/actions/product.actions"; // Corrected path
import { notFound } from "next/navigation";
import { ProductPageClient } from "@/components/products/ProductPageClient"; // Corrected path
import type { Metadata } from "next"; // Removed unused ResolvingMetadata

// Define the interface for the page props
interface ProductPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined }; // Keep searchParams if needed by page/metadata
}

// --- generateMetadata (Stays in Server Component) ---
export async function generateMetadata(
  { params }: ProductPageProps
  // Removed unused _parent parameter
): Promise<Metadata> {
  const slug = params.slug;
  const product = await getPublicProductBySlug(slug); // Fetch data for metadata

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for could not be found.",
    };
  }

  // Extract description safely
  const description =
    product.description?.substring(0, 160) ||
    `Check out ${product.title} on our marketplace.`;

  // Extract image URL safely
  const imageUrl = product.images?.[0]?.url;
  const openGraphImages = imageUrl
    ? [{ url: imageUrl, alt: product.title }]
    : [];

  return {
    title: `${product.title} | Marketplace`,
    description: description,
    openGraph: {
      title: product.title,
      description: description,
      images: openGraphImages,
    },
  };
}

// --- Default Export (Server Component) ---
export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch data server-side
  const product = await getPublicProductBySlug(params.slug);

  // Handle product not found
  if (!product) {
    notFound();
  }

  // Render the Client Component, passing fetched data as props
  return <ProductPageClient product={product} />;
}
