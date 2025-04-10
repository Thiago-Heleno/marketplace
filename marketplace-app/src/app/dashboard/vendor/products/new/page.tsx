import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductForm } from "@/components/vendor/ProductForm";
// import type { ProductFormData } from "@/lib/schemas/product.schema"; // Removed unused import
import { createProduct } from "@/actions/product.actions"; // Import the actual action

export default function NewProductPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Fill in the details below to list a new product in the marketplace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm onSubmit={createProduct} /> {/* Use the imported action */}
      </CardContent>
    </Card>
  );
}
