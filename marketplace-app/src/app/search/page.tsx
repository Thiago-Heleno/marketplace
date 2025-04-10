import React, { Suspense } from "react";
import { searchProducts } from "@/actions/product.actions";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

interface SearchPageProps {
  searchParams: {
    q?: string; // Search query
    // Add other potential search params like page later
  };
}

// Separate async component to fetch and display results
async function SearchResults({ query }: { query: string }) {
  const products = await searchProducts(query);

  return (
    <>
      {products.length === 0 ? (
        <p className="text-center text-muted-foreground col-span-full">
          No products found matching your search: {query}.
        </p>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </>
  );
}

// Loading skeleton component
function SearchLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Search Results {query && `for: ${query}`}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Use Suspense for streaming results */}
        <Suspense fallback={<SearchLoadingSkeleton />}>
          {query ? (
            <SearchResults query={query} />
          ) : (
            <p className="text-center text-muted-foreground col-span-full">
              Please enter a search term.
            </p>
          )}
        </Suspense>
      </div>
      {/* TODO: Add pagination controls */}
    </div>
  );
}

// TODO: Add generateMetadata for search page
