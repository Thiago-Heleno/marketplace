import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { getPublicProducts } from "@/actions/product.actions";

export default async function HomePage() {
  // Fetch a selection of products (e.g., latest 8)
  const latestProducts = await getPublicProducts(8);

  return (
    <div className="flex flex-col min-h-[calc(100vh-theme(spacing.16))]">
      {/* Adjust min-height based on Navbar height */}
      {/* Hero Section */}
      <section className="w-full py-16 md:py-20 bg-gradient-to-r from-muted/50 to-muted">
        {" "}
        {/* Adjusted padding */}
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Discover Unique Products
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Browse and buy from independent vendors in our curated
              marketplace.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Featured Products Section */}
      <section className="w-full py-16 md:py-20">
        {" "}
        {/* Adjusted padding */}
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
            Featured Products
          </h2>
          {latestProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No products available yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {latestProducts.length > 0 && (
            <div className="mt-12 text-center">
              <Button variant="outline" asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
