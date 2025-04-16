"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; // Import useRouter
// import { z } from "zod"; // Removed unused import
import {
  ProductSchema,
  type ProductFormData,
} from "@/lib/schemas/product.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// TODO: Fetch categories for the select dropdown

interface ProductFormProps {
  onSubmit: (
    data: ProductFormData,
    imageData?: File,
    assetData?: File
    // Update the expected return type to include redirectTo
  ) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    redirectTo?: string;
  }>;
  initialData?: Partial<ProductFormData> & { id?: string }; // For editing
  isLoading?: boolean;
}

export function ProductForm({
  onSubmit,
  initialData = {},
  isLoading = false,
}: ProductFormProps) {
  const router = useRouter(); // Initialize router
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [assetFile, setAssetFile] = useState<File | undefined>(undefined);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      priceInCents: initialData.priceInCents ?? 0,
      categoryId: initialData.categoryId ?? undefined,
      tags: initialData.tags ?? "",
      stock: initialData.stock ?? 0,
      isDigital: initialData.isDigital ?? false,
      isPhysical: initialData.isPhysical ?? true,
    },
  });

  const isDigital = form.watch("isDigital");

  const handleFormSubmit = async (data: ProductFormData) => {
    // Basic validation for file inputs based on product type
    if (!initialData.id && !imageFile) {
      // Require image for new products
      toast.error("Product image is required.");
      return;
    }
    if (data.isDigital && !initialData.id && !assetFile) {
      // Require asset file for new digital products
      toast.error("Digital asset file is required for digital products.");
      return;
    }

    const result = await onSubmit(data, imageFile, assetFile);

    if (result.success) {
      toast.success(result.message || "Product saved successfully!");
      // Redirect if redirectTo path is provided in the result
      if (result.redirectTo) {
        router.push(result.redirectTo);
      } else {
        // Optionally reset form if staying on the same page (e.g., after update)
        // form.reset(); // Consider if reset is needed after update
      }
    } else {
      toast.error(result.error || "Failed to save product.");
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(undefined);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Amazing Widget"
                  {...field}
                  data-testid="product-title-input" // Added data-testid
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your product..."
                  className="resize-none"
                  {...field}
                  data-testid="product-description-textarea" // Added data-testid
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="priceInCents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (in Cents)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 1999 for $19.99"
                  {...field}
                  data-testid="product-price-input" // Added data-testid
                />
              </FormControl>
              <FormDescription>
                Enter the price in cents (e.g., 1000 for $10.00).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Stock */}
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  {...field}
                  data-testid="product-stock-input" // Added data-testid
                />
              </FormControl>
              <FormDescription>
                Overall stock count. Variants will have their own stock later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category (Placeholder) */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="product-category-select">
                    {" "}
                    {/* Added data-testid */}
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Populate with actual categories */}
                  <SelectItem value="placeholder-cat-1">
                    Placeholder Category 1
                  </SelectItem>
                  <SelectItem value="placeholder-cat-2">
                    Placeholder Category 2
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Assign product to a category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., widget, blue, useful"
                  {...field}
                  data-testid="product-tags-input" // Added data-testid
                />
              </FormControl>
              <FormDescription>
                Comma-separated tags for search.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Type Checkboxes */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isPhysical"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="product-physical-checkbox" // Added data-testid
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Physical Product</FormLabel>
                  <FormDescription>
                    Requires shipping address at checkout.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isDigital"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    data-testid="product-digital-checkbox" // Added data-testid
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Digital Product</FormLabel>
                  <FormDescription>
                    Requires digital asset upload. Grants download access after
                    purchase.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          {/* Display error if neither is checked - handled by Zod refine */}
          <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        </div>

        {/* Image Upload */}
        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setImageFile)}
              data-testid="product-image-input" // Added data-testid
            />
          </FormControl>
          <FormDescription>
            Upload the main product image (JPEG, PNG, WEBP, GIF). Required for
            new products.
            {initialData.id && " Leave empty to keep the existing image."}
          </FormDescription>
          {imageFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {imageFile.name}
            </p>
          )}
          {/* TODO: Show preview of selected/existing image */}
          <FormMessage />
        </FormItem>

        {/* Digital Asset Upload (Conditional) */}
        {isDigital && (
          <FormItem>
            <FormLabel>Digital Asset File</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept=".pdf,.zip" // Example accepted types
                onChange={(e) => handleFileChange(e, setAssetFile)}
                data-testid="product-asset-input" // Added data-testid
              />
            </FormControl>
            <FormDescription>
              Upload the file customers will download (PDF, ZIP recommended).
              Required for new digital products.
              {initialData.id && " Leave empty to keep the existing asset."}
            </FormDescription>
            {assetFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {assetFile.name}
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}

        {/* TODO: Add Variant Management Section */}

        <Button
          type="submit"
          disabled={isLoading}
          data-testid="product-form-submit-button" // Added data-testid
        >
          {isLoading
            ? "Saving..."
            : initialData.id
              ? "Update Product"
              : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
