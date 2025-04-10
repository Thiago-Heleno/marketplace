import { z } from "zod";

// Zod schema for product creation/update
export const ProductSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    description: z.string().optional(),
    priceInCents: z.coerce // Coerce input (likely string from form) to number
      .number({ invalid_type_error: "Price must be a number." })
      .int("Price must be in cents (integer).")
      .positive("Price must be positive.")
      .min(1, "Price must be at least 1 cent."),
    categoryId: z.string().uuid("Invalid category selected.").optional(), // Optional for now, maybe make required later
    tags: z.string().optional(), // Simple comma-separated string for now, parse in action
    stock: z.coerce // Coerce input to number
      .number({ invalid_type_error: "Stock must be a number." })
      .int("Stock must be an integer.")
      .min(0, "Stock cannot be negative."),
    isDigital: z.boolean().default(false),
    isPhysical: z.boolean().default(true),
    // imageFile: represents the uploaded image file (handled separately via FormData)
    // assetFile: represents the uploaded digital asset file (handled separately via FormData)
    // variants: Array of variant objects (handle later)
  })
  .refine((data) => data.isDigital || data.isPhysical, {
    message: "Product must be either digital or physical (or both).",
    // This path helps associate the error with a specific field if needed,
    // but for a general refinement, it might not point to a single input.
    // path: ["isDigital"], // Or ["isPhysical"]
  });

export type ProductFormData = z.infer<typeof ProductSchema>;

// Example schema for variants if added later
// export const VariantSchema = z.object({
//   name: z.string().min(1),
//   value: z.string().min(1),
//   priceModifierInCents: z.coerce.number().int().default(0),
//   stock: z.coerce.number().int().min(0),
// });
