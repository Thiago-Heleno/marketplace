import React from "react";
import { getPublicProducts } from "@/actions/product.actions";
import { ProductCard } from "@/components/products/ProductCard";

export default async function AllProductsPage() {
  // Fetch products - Add pagination later if needed
  const products = await getPublicProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No products found. Check back later!
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
