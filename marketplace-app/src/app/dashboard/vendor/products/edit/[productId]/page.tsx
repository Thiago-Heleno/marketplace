import React from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductForm } from "@/components/vendor/ProductForm";
import { getProductById, updateProduct } from "@/actions/product.actions"; // Import actions
import type { ProductFormData } from "@/lib/schemas/product.schema"; // Import the type

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = params;
  const product = await getProductById(productId);

  if (!product) {
    notFound(); // Trigger 404 if product doesn't exist
  }

  // Wrapper function to pass productId to the server action
  const handleUpdateSubmit = async (
    data: ProductFormData,
    imageData?: File,
    assetData?: File
  ) => {
    // Need 'use server' directive if this wrapper itself becomes complex,
    // but since it just calls another server action, it's fine here.
    return updateProduct(productId, data, imageData, assetData);
  };

  // Prepare initial data, ensuring null values are converted to undefined for the form
  const initialFormData = {
    ...product,
    description: product.description ?? undefined,
    categoryId: product.categoryId ?? undefined,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>
          Update the details for: {product.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Pass initialData and the bound update action */}
        <ProductForm
          initialData={initialFormData} // Use prepared data
          onSubmit={handleUpdateSubmit} // Pass the wrapper function
        />
      </CardContent>
    </Card>
  );
}
