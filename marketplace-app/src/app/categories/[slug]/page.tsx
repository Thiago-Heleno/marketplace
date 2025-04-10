import React from "react";
import { getPublicProductsByCategory } from "@/actions/product.actions";
import { ProductCard } from "@/components/products/ProductCard";
import { notFound } from "next/navigation"; // Import for handling not found categories
import type { Metadata, ResolvingMetadata } from "next"; // Import Metadata types

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const { categoryName, products } = await getPublicProductsByCategory(slug);

  // If categoryName is null, the category wasn't found
  if (!categoryName) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Category: {categoryName}
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No products found in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {/* TODO: Add pagination controls */}
    </div>
  );
}

// TODO: Implement generateStaticParams if needed for SSG.

// --- generateMetadata ---
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams: _searchParams }: Props, // Prefix unused searchParams
  parent: ResolvingMetadata // Prefix unused parent
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  // fetch data - We only need the category name for metadata here
  // Re-fetching just the name might be slightly more efficient than fetching all products again,
  // but for simplicity, we can reuse the existing action or create a dedicated one later.
  // Let's reuse for now, acknowledging potential minor inefficiency.
  const { categoryName } = await getPublicProductsByCategory(slug, 0, 0); // Fetch with limit 0

  if (!categoryName) {
    // Return default metadata or handle not found case
    return {
      title: "Category Not Found",
      description: "The category you are looking for could not be found.",
    };
  }

  return {
    title: `${categoryName} | Marketplace`,
    description: `Browse products in the ${categoryName} category.`,
    // openGraph: { // Optional: Add Open Graph data if needed
    //   title: `${categoryName} | Marketplace`,
    //   description: `Browse products in the ${categoryName} category.`,
    // },
  };
}
