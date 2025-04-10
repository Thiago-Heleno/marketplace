import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Duplicate imports removed below
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getVendorProducts } from "@/actions/product.actions"; // Import the action
import { VendorProductTable } from "@/components/vendor/VendorProductTable"; // Import the table component (removed columns import)

export default async function VendorProductsPage() {
  // Fetch products server-side
  const products = await getVendorProducts();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Products</CardTitle>
        <CardDescription>
          View, add, edit, or delete your product listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href="/dashboard/vendor/products/new">Add New Product</Link>
          </Button>
        </div>
        {/* Render the table component with fetched data - columns are defined within the component */}
        <VendorProductTable data={products} />
      </CardContent>
    </Card>
  );
}
