"use server";

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
// import { z } from "zod"; // Removed direct import, used via ProductSchema
import { auth } from "../../auth";
import { db } from "@/db"; // Needed for database operations
import {
  products,
  productImages,
  digitalAssets,
  categories,
} from "@/db/schema"; // Import necessary schemas
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used in orderBy callbacks
import { eq, and, or, ilike, desc, asc } from "drizzle-orm"; // Add or, ilike, desc, asc back
import {
  ProductSchema,
  type ProductFormData,
} from "@/lib/schemas/product.schema";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation"; // Optional redirect after creation

// Define constants for upload directories
const PUBLIC_UPLOADS_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "images"
);
const PROTECTED_UPLOADS_DIR = path.join(process.cwd(), "uploads", "assets");

// Ensure directories exist
const ensureDirectoryExists = async (dirPath: string) => {
  try {
    await fs.access(dirPath);
  } catch (error: unknown) {
    // Changed any to unknown
    // Directory does not exist, create it recursively
    // Log error message if it's an Error object
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(
      `Directory ${dirPath} not found, creating... Error: ${errorMessage}`
    );
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } catch (mkdirError) {
      console.error(`Failed to create directory ${dirPath}:`, mkdirError);
      // Optionally re-throw or handle more gracefully
      throw mkdirError;
    }
  }
};

// Call this at the start to make sure directories are ready
ensureDirectoryExists(PUBLIC_UPLOADS_DIR);
ensureDirectoryExists(PROTECTED_UPLOADS_DIR);

// Define allowed file types and max size (Example: 5MB)
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
// Add allowed types for digital assets if needed (e.g., 'application/pdf')
const ALLOWED_ASSET_TYPES = ["application/pdf", "application/zip"]; // Example

interface UploadFileResult {
  success: boolean;
  filePath?: string; // Relative path for DB storage
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  error?: string;
}

// TODO: Add Zod schema for input validation if needed beyond FormData

export async function uploadFile(
  formData: FormData,
  fileType: "image" | "asset" // Specify if it's a public image or protected asset
): Promise<UploadFileResult> {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    // TODO: Refine role check if ADMIN should also upload
    return {
      success: false,
      error: "Unauthorized: Only active vendors can upload files.",
    };
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided." };
  }

  // --- Validation ---
  // Size validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: `File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB.`,
    };
  }

  // Type validation
  const allowedTypes =
    fileType === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_ASSET_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  // --- File Handling ---
  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;

    let uploadDir: string;
    let relativePath: string;

    if (fileType === "image") {
      uploadDir = PUBLIC_UPLOADS_DIR;
      // Relative path from /public for web access
      relativePath = path
        .join("/uploads", "images", uniqueFilename)
        .replace(/\\/g, "/");
    } else {
      uploadDir = PROTECTED_UPLOADS_DIR;
      // Relative path from project root for internal access/secure download
      relativePath = path
        .join("uploads", "assets", uniqueFilename)
        .replace(/\\/g, "/");
    }

    const destinationPath = path.join(uploadDir, uniqueFilename);

    // Write the file
    await fs.writeFile(destinationPath, fileBuffer);

    console.log(`File uploaded successfully to: ${destinationPath}`);

    return {
      success: true,
      filePath: relativePath, // Return the relative path suitable for DB storage/access
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    return { success: false, error: "File upload failed. Please try again." };
  }
}

// --- Create Product Action ---

interface CreateProductResult {
  success: boolean;
  message?: string;
  error?: string;
  productId?: string;
  redirectTo?: string; // Add redirectTo path
}

export async function createProduct(
  formData: ProductFormData,
  imageData: File | undefined,
  assetData: File | undefined
): Promise<CreateProductResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Input Validation (Schema)
  const validatedFields = ProductSchema.safeParse(formData);
  if (!validatedFields.success) {
    console.error(
      "Product validation failed:",
      validatedFields.error.flatten()
    );
    return {
      success: false,
      error: "Invalid product data.",
      // TODO: Consider returning fieldErrors: validatedFields.error.flatten().fieldErrors
    };
  }
  const productData = validatedFields.data;

  // 3. File Validation (Presence)
  if (!imageData) {
    return { success: false, error: "Product image is required." };
  }
  if (productData.isDigital && !assetData) {
    return {
      success: false,
      error: "Digital asset file is required for digital products.",
    };
  }

  // 4. File Uploads
  let imageUploadResult: UploadFileResult | null = null;
  let assetUploadResult: UploadFileResult | null = null;

  try {
    // Upload Image
    const imageFormData = new FormData();
    imageFormData.append("file", imageData);
    imageUploadResult = await uploadFile(imageFormData, "image");
    if (!imageUploadResult.success || !imageUploadResult.filePath) {
      return {
        success: false,
        error: imageUploadResult.error || "Failed to upload product image.",
      };
    }

    // Upload Asset (if digital)
    if (productData.isDigital && assetData) {
      const assetFormData = new FormData();
      assetFormData.append("file", assetData);
      assetUploadResult = await uploadFile(assetFormData, "asset");
      if (!assetUploadResult.success || !assetUploadResult.filePath) {
        // Attempt to clean up already uploaded image if asset fails
        if (imageUploadResult.filePath) {
          try {
            const imageDiskPath = path.join(
              process.cwd(),
              "public",
              imageUploadResult.filePath
            );
            await fs.unlink(imageDiskPath);
            console.log(
              "Cleaned up uploaded image due to asset upload failure:",
              imageUploadResult.filePath
            );
          } catch (cleanupError) {
            console.error("Failed to cleanup image file:", cleanupError);
          }
        }
        return {
          success: false,
          error: assetUploadResult.error || "Failed to upload digital asset.",
        };
      }
    }
  } catch (uploadError) {
    console.error("Unexpected error during file upload:", uploadError);
    // TODO: Add cleanup logic here too if needed
    return {
      success: false,
      error: "An unexpected error occurred during file upload.",
    };
  }

  // 5. Database Transaction
  try {
    // Generate a UUID for potential slug suffix *before* the transaction
    const uniqueSuffix = uuidv4().substring(0, 8);

    const newProductId = await db.transaction(async (tx) => {
      // Generate initial slug
      let slug = generateSlug(productData.title);

      // Check if slug exists
      const existingSlug = await tx.query.products.findFirst({
        where: eq(products.slug, slug),
        columns: { id: true }, // Only need to know if it exists
      });

      // If slug exists, append unique suffix
      if (existingSlug) {
        slug = `${slug}-${uniqueSuffix}`;
        console.log(`Slug collision detected. Using unique slug: ${slug}`);
      }

      // Parse Tags
      const tagsArray = productData.tags
        ? productData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Insert Product
      const [newProduct] = await tx
        .insert(products)
        .values({
          vendorId: vendorId,
          title: productData.title,
          slug: slug, // Use generated slug
          description: productData.description,
          priceInCents: productData.priceInCents,
          categoryId: productData.categoryId || null, // Handle optional category
          tags: tagsArray,
          stock: productData.stock,
          isDigital: productData.isDigital,
          isPhysical: productData.isPhysical,
          isActive: true, // Default to active
        })
        .returning({ id: products.id });

      if (!newProduct?.id) {
        throw new Error("Failed to create product record.");
      }
      const productId = newProduct.id;

      // Insert Image Metadata (we know imageUploadResult is successful here)
      await tx.insert(productImages).values({
        productId: productId,
        url: imageUploadResult!.filePath!, // Use the relative path from upload result
        altText: productData.title, // Use product title as default alt text
        order: 0,
      });

      // Insert Asset Metadata (if applicable)
      if (assetUploadResult?.success && assetUploadResult.filePath) {
        await tx.insert(digitalAssets).values({
          productId: productId,
          filePath: assetUploadResult.filePath,
          fileName: assetUploadResult.fileName || "download", // Provide default if undefined (schema requires NOT NULL)
          fileType: assetUploadResult.fileType || null, // Pass null if undefined (schema allows NULL)
          fileSizeBytes: assetUploadResult.fileSize || null, // Pass null if undefined (schema allows NULL)
        });
      }

      return productId;
    });

    // 6. Revalidate Path & Return Success
    revalidatePath("/dashboard/vendor/products"); // Update product list cache
    // Remove commented-out redirect

    return {
      success: true,
      message: "Product created successfully!",
      productId: newProductId,
      redirectTo: "/dashboard/vendor/products", // Add redirect path
    };
  } catch (error) {
    console.error("Failed to create product:", error);
    // Attempt to clean up uploaded files if DB transaction fails
    if (imageUploadResult?.filePath) {
      try {
        const imageDiskPath = path.join(
          process.cwd(),
          "public",
          imageUploadResult.filePath
        );
        await fs.unlink(imageDiskPath);
        console.log(
          "Cleaned up uploaded image due to DB error:",
          imageUploadResult.filePath
        );
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup image file after DB error:",
          cleanupError
        );
      }
    }
    if (assetUploadResult?.filePath) {
      try {
        const assetDiskPath = path.join(
          process.cwd(),
          assetUploadResult.filePath
        ); // Asset path is relative to root
        await fs.unlink(assetDiskPath);
        console.log(
          "Cleaned up uploaded asset due to DB error:",
          assetUploadResult.filePath
        );
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup asset file after DB error:",
          cleanupError
        );
      }
    }
    return { success: false, error: "Database error: Failed to save product." };
  } // End of catch block for DB transaction
} // End of createProduct function

// --- Update Product Action ---

interface UpdateProductResult {
  success: boolean;
  message?: string;
  error?: string;
  redirectTo?: string; // Add redirectTo path
}

export async function updateProduct(
  productId: string,
  formData: ProductFormData,
  imageData?: File, // Optional: Only provided if changed
  assetData?: File // Optional: Only provided if changed
): Promise<UpdateProductResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Input Validation
  const validatedFields = ProductSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid product data." };
  }
  const productData = validatedFields.data;

  // 3. Verify Ownership & Fetch Existing Product
  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      images: { limit: 1, orderBy: (images, { asc }) => [asc(images.order)] },
      digitalAssets: { limit: 1 },
    },
  });

  if (!existingProduct) {
    return { success: false, error: "Product not found." };
  }
  if (existingProduct.vendorId !== vendorId) {
    return { success: false, error: "Unauthorized: Cannot edit this product." };
  }

  // --- File Handling (Update/Delete Old, Upload New) ---
  let imageUploadResult: UploadFileResult | null = null;
  let assetUploadResult: UploadFileResult | null = null;
  const oldImagePath: string | null = existingProduct.images[0]?.url || null;
  const oldAssetPath: string | null =
    existingProduct.digitalAssets[0]?.filePath || null;

  try {
    // Handle Image Update
    if (imageData) {
      const imageFormData = new FormData();
      imageFormData.append("file", imageData);
      imageUploadResult = await uploadFile(imageFormData, "image");
      if (!imageUploadResult.success || !imageUploadResult.filePath) {
        return {
          success: false,
          error:
            imageUploadResult.error || "Failed to upload new product image.",
        };
      }
      // If upload successful, mark old image for deletion (delete after DB update)
    }

    // Handle Asset Update (if digital)
    if (productData.isDigital && assetData) {
      const assetFormData = new FormData();
      assetFormData.append("file", assetData);
      assetUploadResult = await uploadFile(assetFormData, "asset");
      if (!assetUploadResult.success || !assetUploadResult.filePath) {
        // Cleanup newly uploaded image if asset upload fails
        if (imageUploadResult?.filePath) {
          try {
            const imageDiskPath = path.join(
              process.cwd(),
              "public",
              imageUploadResult.filePath
            );
            await fs.unlink(imageDiskPath);
          } catch (cleanupError) {
            console.error("Failed cleanup new image:", cleanupError);
          }
        }
        return {
          success: false,
          error:
            assetUploadResult.error || "Failed to upload new digital asset.",
        };
      }
      // If upload successful, mark old asset for deletion (delete after DB update)
    } else if (
      !productData.isDigital &&
      existingProduct.isDigital &&
      oldAssetPath
    ) {
      // Product type changed from digital to non-digital, mark old asset for deletion
      console.log(
        "Product changed to non-digital, marking old asset for deletion:",
        oldAssetPath
      );
    }
  } catch (uploadError) {
    console.error("Unexpected error during file update upload:", uploadError);
    // Cleanup any newly uploaded files if error occurs before DB transaction
    if (imageUploadResult?.filePath) {
      try {
        await fs.unlink(
          path.join(process.cwd(), "public", imageUploadResult.filePath)
        );
      } catch {
        /* Ignore cleanup error */
      }
    }
    if (assetUploadResult?.filePath) {
      try {
        await fs.unlink(path.join(process.cwd(), assetUploadResult.filePath));
      } catch {
        /* Ignore cleanup error */
      }
    }
    return {
      success: false,
      error: "An unexpected error occurred during file upload.",
    };
  }

  // 4. Database Transaction (Update)
  try {
    await db.transaction(async (tx) => {
      // Generate Slug (only if title changed?) - For simplicity, let's keep slug for now.
      // const slug = generateSlug(productData.title);

      // Parse Tags
      const tagsArray = productData.tags
        ? productData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Update Product Record
      await tx
        .update(products)
        .set({
          title: productData.title,
          // slug: slug, // Keep slug for now
          description: productData.description,
          priceInCents: productData.priceInCents,
          categoryId: productData.categoryId || null,
          tags: tagsArray,
          stock: productData.stock,
          isDigital: productData.isDigital,
          isPhysical: productData.isPhysical,
          // isActive: productData.isActive, // Add isActive to form/schema if needed
          updatedAt: new Date(), // Manually set update timestamp
        })
        .where(eq(products.id, productId));

      // Update Image Metadata (if new image uploaded)
      if (imageUploadResult?.success && imageUploadResult.filePath) {
        // Upsert logic: Update if exists, insert if not (though should always exist if product exists)
        // For simplicity, let's assume one image and update it. Delete old one later.
        // If supporting multiple images, logic needs refinement (delete old, insert new, or update existing record).
        await tx
          .update(productImages)
          .set({
            url: imageUploadResult.filePath,
            altText: productData.title,
          })
          .where(eq(productImages.productId, productId)); // Assuming only one image for now
        // If no image record existed (unlikely), insert:
        // .returning() check length, if 0 then insert... (more complex)
      }

      // Update/Insert/Delete Asset Metadata
      if (assetUploadResult?.success && assetUploadResult.filePath) {
        // New asset uploaded
        if (existingProduct.digitalAssets.length > 0) {
          // Update existing asset record
          await tx
            .update(digitalAssets)
            .set({
              filePath: assetUploadResult.filePath,
              fileName: assetUploadResult.fileName || "download",
              fileType: assetUploadResult.fileType || null,
              fileSizeBytes: assetUploadResult.fileSize || null,
            })
            .where(eq(digitalAssets.productId, productId)); // Assuming one asset
        } else {
          // Insert new asset record if none existed
          await tx.insert(digitalAssets).values({
            productId: productId,
            filePath: assetUploadResult.filePath,
            fileName: assetUploadResult.fileName || "download",
            fileType: assetUploadResult.fileType || null,
            fileSizeBytes: assetUploadResult.fileSize || null,
          });
        }
      } else if (
        !productData.isDigital &&
        existingProduct.isDigital &&
        existingProduct.digitalAssets.length > 0
      ) {
        // Product changed to non-digital, delete asset record
        await tx
          .delete(digitalAssets)
          .where(eq(digitalAssets.productId, productId));
      }
    }); // End DB Transaction

    // --- Cleanup Old Files (After successful DB update) ---
    // Delete old image if new one was uploaded
    if (imageUploadResult?.success && oldImagePath) {
      try {
        const oldImageDiskPath = path.join(
          process.cwd(),
          "public",
          oldImagePath
        );
        await fs.unlink(oldImageDiskPath);
        console.log("Cleaned up old image:", oldImagePath);
      } catch (cleanupError) {
        console.error("Failed to cleanup old image file:", cleanupError);
      }
    }
    // Delete old asset if new one was uploaded OR if product became non-digital
    if (
      (assetUploadResult?.success ||
        (!productData.isDigital && existingProduct.isDigital)) &&
      oldAssetPath
    ) {
      try {
        const oldAssetDiskPath = path.join(process.cwd(), oldAssetPath); // Asset path relative to root
        await fs.unlink(oldAssetDiskPath);
        console.log("Cleaned up old asset:", oldAssetPath);
      } catch (cleanupError) {
        console.error("Failed to cleanup old asset file:", cleanupError);
      }
    }

    // 5. Revalidate & Return Success
    revalidatePath("/dashboard/vendor/products");
    revalidatePath(`/dashboard/vendor/products/edit/${productId}`); // Revalidate edit page too

    return {
      success: true,
      message: "Product updated successfully!",
      redirectTo: "/dashboard/vendor/products", // Add redirect path
    };
  } catch (error) {
    console.error("Failed to update product:", error);
    // Cleanup any newly uploaded files if DB transaction fails
    if (imageUploadResult?.filePath) {
      try {
        await fs.unlink(
          path.join(process.cwd(), "public", imageUploadResult.filePath)
        );
      } catch {
        /* Ignore cleanup error */
      }
    }
    if (assetUploadResult?.filePath) {
      try {
        await fs.unlink(path.join(process.cwd(), assetUploadResult.filePath));
      } catch {
        /* Ignore cleanup error */
      }
    }
    return {
      success: false,
      error: "Database error: Failed to update product.",
    };
  }
}

// --- Delete Product Action ---

interface DeleteProductResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function deleteProduct(
  productId: string
): Promise<DeleteProductResult> {
  // 1. Authentication & Authorization
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized" };
  }
  const vendorId = session.user.id;

  // 2. Verify Ownership & Fetch File Paths
  const productToDelete = await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: { id: true, vendorId: true }, // Only fetch necessary columns
    with: {
      images: { columns: { url: true }, limit: 1 }, // Get image path
      digitalAssets: { columns: { filePath: true }, limit: 1 }, // Get asset path
    },
  });

  if (!productToDelete) {
    return { success: false, error: "Product not found." };
  }
  if (productToDelete.vendorId !== vendorId) {
    return {
      success: false,
      error: "Unauthorized: Cannot delete this product.",
    };
  }

  const imagePath = productToDelete.images[0]?.url || null;
  const assetPath = productToDelete.digitalAssets[0]?.filePath || null;

  // 3. Database Deletion (should cascade via schema relations) & File Cleanup
  try {
    // Delete the product record from the database
    await db.delete(products).where(eq(products.id, productId));

    // If DB deletion is successful, proceed to delete files
    if (imagePath) {
      try {
        const imageDiskPath = path.join(process.cwd(), "public", imagePath);
        await fs.unlink(imageDiskPath);
        console.log("Deleted product image file:", imageDiskPath);
      } catch (cleanupError) {
        console.error("Failed to delete product image file:", cleanupError);
        // Log error but don't necessarily fail the whole operation if DB delete succeeded
      }
    }
    if (assetPath) {
      try {
        const assetDiskPath = path.join(process.cwd(), assetPath); // Asset path relative to root
        await fs.unlink(assetDiskPath);
        console.log("Deleted product asset file:", assetDiskPath);
      } catch (cleanupError) {
        console.error("Failed to delete product asset file:", cleanupError);
        // Log error but don't necessarily fail the whole operation
      }
    }

    // 4. Revalidate & Return Success
    revalidatePath("/dashboard/vendor/products");
    return { success: true, message: "Product deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return {
      success: false,
      error: "Database error: Failed to delete product.",
    };
  }
}

// --- Get Single Product Action (for editing) ---
export async function getProductById(productId: string) {
  // 1. Authentication
  const session = await auth();
  if (!session?.user?.id) {
    console.log("getProductById: Unauthenticated access attempt.");
    return null; // Not logged in
  }

  try {
    // 2. Fetch Product Data
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.order)] },
        digitalAssets: true,
        // Add variants later if needed
      },
    });

    // 3. Check Product Existence
    if (!product) {
      console.log(`getProductById: Product not found for ID: ${productId}`);
      return null;
    }

    // 4. Authorization Check: Must be owner or admin
    const isOwner = product.vendorId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      console.log(
        `getProductById: Unauthorized access attempt by user ${session.user.id} for product ${productId}.`
      );
      return null; // Not authorized
    }

    // 5. Format data slightly for the form (e.g., tags array to string)
    return {
      ...product,
      tags: product.tags?.join(", ") || "", // Convert array back to comma-separated string
      // Return image/asset info if needed for display/comparison in form
      imageUrl: product.images[0]?.url || null,
      assetFileName: product.digitalAssets[0]?.fileName || null,
    };
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return null;
  }
}
// --- Get Vendor Products Action ---

// Define the type for the returned product data, including the primary image URL
export type VendorProductListItem = Awaited<
  ReturnType<typeof getVendorProducts>
>[0];

export async function getVendorProducts() {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "VENDOR" ||
    session.user.status !== "ACTIVE"
  ) {
    // Or throw an error, depending on how you want to handle unauthorized access in components
    return [];
  }
  const vendorId = session.user.id;

  try {
    const vendorProducts = await db.query.products.findMany({
      where: eq(products.vendorId, vendorId),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      with: {
        images: {
          columns: {
            url: true,
          },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1, // Get only the first image (order 0)
        },
        // Add variants count or other relevant info later if needed
      },
      columns: {
        id: true,
        title: true,
        priceInCents: true,
        stock: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Map to include primary image URL directly
    return vendorProducts.map((p) => ({
      ...p,
      imageUrl: p.images[0]?.url || null, // Get the first image URL or null
    }));
  } catch (error) {
    console.error("Failed to fetch vendor products:", error);
    return []; // Return empty array on error
  }
}

// --- Public Storefront Actions ---

// Removed potentially redundant import of desc, asc
// import { desc, asc } from "drizzle-orm"; // Keep this commented or remove line
import {} from // categories, // Now imported above
// users, // Unused
// reviews, // Unused
// questionAnswers, // Unused
// productVariants, // Unused - variants are accessed via relation, not direct import needed here
"@/db/schema"; // Import additional schemas

// --- Get All Public Products ---
export async function getPublicProducts(
  limit: number = 20,
  offset: number = 0
) {
  try {
    const publicProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: limit,
      offset: offset,
      with: {
        // Corrected structure after potential auto-format corruption
        images: {
          columns: { url: true },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1,
        },
        category: {
          // Include category for potential filtering/display
          columns: { name: true, slug: true },
        },
      },
      columns: {
        id: true,
        title: true,
        slug: true,
        priceInCents: true,
        // Add other fields needed for listing card if necessary
      },
    });

    return publicProducts.map((p) => ({
      ...p,
      imageUrl: p.images[0]?.url || null,
    }));
  } catch (error) {
    console.error("Failed to fetch public products:", error);
    return [];
  }
}

// --- Get Public Products By Category ---
export async function getPublicProductsByCategory(
  categorySlug: string,
  limit: number = 20,
  offset: number = 0
) {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
      columns: { id: true, name: true }, // Get category ID and name
    });

    if (!category) {
      console.log(`Category not found for slug: ${categorySlug}`);
      return { categoryName: null, products: [] }; // Indicate category not found
    }

    const categoryProducts = await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        eq(products.categoryId, category.id) // Filter by category ID
      ),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: limit,
      offset: offset,
      with: {
        images: {
          columns: { url: true },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1,
        },
      },
      columns: {
        id: true,
        title: true,
        slug: true,
        priceInCents: true,
      },
    });

    return {
      categoryName: category.name,
      products: categoryProducts.map((p) => ({
        ...p,
        imageUrl: p.images[0]?.url || null,
      })),
    };
  } catch (error) {
    console.error(
      `Failed to fetch products for category ${categorySlug}:`,
      error
    );
    return { categoryName: null, products: [] }; // Return empty on error
  }
}

// --- Get Single Public Product By Slug ---
export async function getPublicProductBySlug(productSlug: string) {
  try {
    const product = await db.query.products.findFirst({
      where: and(eq(products.isActive, true), eq(products.slug, productSlug)),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.order)], // Get all images, ordered
        },
        digitalAssets: {
          // Needed to check if digital for download link logic later
          columns: { id: true },
        },
        variants: {
          // Renamed from productVariants for clarity in result
          orderBy: (variants, { asc }) => [
            asc(variants.name),
            asc(variants.value),
          ], // Order variants consistently
        },
        category: {
          columns: { name: true, slug: true },
        },
        vendor: {
          // Fetch vendor info
          columns: { firstName: true, lastName: true }, // Select only needed fields
        },
        reviews: {
          // Fetch reviews
          with: {
            user: { columns: { firstName: true, lastName: true } }, // Get reviewer name
          },
          orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        },
        questionAnswers: {
          // Fetch Q&A
          with: {
            user: { columns: { firstName: true, lastName: true } },
            answeredByUser: { columns: { firstName: true, lastName: true } },
            product: { columns: { vendorId: true } }, // Added nested product with vendorId
          },
          orderBy: (qa, { desc }) => [desc(qa.createdAt)],
        },
      },
    });

    if (!product) {
      return null; // Not found or not active
    }

    // Combine vendor first/last name using optional chaining
    const vendorName = product.vendor?.firstName
      ? `${product.vendor.firstName} ${product.vendor.lastName}`.trim()
      : "Unknown Vendor";

    // Structure the result cleanly
    return {
      ...product,
      vendor: { name: vendorName }, // Simplified vendor info
      // variants are already included via 'with'
      // images are already included via 'with'
      // category is already included via 'with'
      // reviews are already included via 'with'
      // questionAnswers are already included via 'with'
      hasDigitalAsset: (product.digitalAssets?.length ?? 0) > 0, // Use optional chaining and nullish coalescing
    };
  } catch (error) {
    console.error(`Failed to fetch product by slug ${productSlug}:`, error);
    return null; // Return null on error
  }
}

// --- Search Products Action ---
export async function searchProducts(
  query: string,
  limit: number = 20,
  offset: number = 0
) {
  if (!query) {
    return []; // Return empty if query is empty
  }

  const searchTerm = `%${query}%`; // Prepare for ILIKE

  try {
    const searchResults = await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        or(
          ilike(products.title, searchTerm),
          ilike(products.description, searchTerm)
          // TODO: Add tag search later if feasible/required. Searching within JSON array needs specific approach.
          // Example (Postgres specific, might need raw sql): sql`tags::text ILIKE ${searchTerm}`
        )
      ),
      orderBy: (products, { desc }) => [desc(products.createdAt)], // Keep consistent ordering
      limit: limit,
      offset: offset,
      with: {
        images: {
          columns: { url: true },
          orderBy: (images, { asc }) => [asc(images.order)],
          limit: 1,
        },
        category: {
          columns: { name: true, slug: true },
        },
      },
      columns: {
        id: true,
        title: true,
        slug: true,
        priceInCents: true,
      },
    });

    return searchResults.map((p) => ({
      ...p,
      imageUrl: p.images[0]?.url || null,
    }));
  } catch (error) {
    console.error(`Failed to search products for query "${query}":`, error);
    return []; // Return empty array on error
  }
}
