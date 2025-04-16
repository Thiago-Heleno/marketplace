import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import {
  users,
  products,
  categories,
  productVariants,
  addresses,
  orders,
  orderItems,
  withdrawalRequests,
  affiliateCodes,
  productImages,
  digitalAssets,
  reviews,
  questionAnswers,
  affiliateReferrals,
  passwordResetTokens,
} from "../src/db/schema";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { generateSlug } from "../src/lib/utils"; // Assuming generateSlug is accessible

// Load environment variables from .env files
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.test" }); // Load .env.test if it exists

async function seedE2E() {
  const connectionString = process.env.TEST_DATABASE_URL;
  const fallbackConnectionString = process.env.DATABASE_URL;

  if (!connectionString && !fallbackConnectionString) {
    console.error(
      "🔴 Error: TEST_DATABASE_URL or DATABASE_URL environment variable is not set."
    );
    process.exit(1);
  }

  if (!connectionString) {
    console.warn(
      "🟡 Warning: TEST_DATABASE_URL is not set. Falling back to DATABASE_URL."
    );
    console.warn(
      "🟡 Ensure this is not your production or development database!"
    );
  }

  const client = postgres(connectionString || fallbackConnectionString!);
  const db = drizzle(client, { schema });

  console.log("🌱 Starting E2E database seeding...");

  try {
    // --- Clear existing data (order matters due to foreign keys) ---
    console.log("🗑️ Clearing existing test data...");
    await db.delete(passwordResetTokens);
    await db.delete(affiliateReferrals);
    await db.delete(withdrawalRequests);
    await db.delete(orderItems);
    await db.delete(orders);
    await db.delete(addresses);
    await db.delete(reviews);
    await db.delete(questionAnswers);
    await db.delete(digitalAssets);
    await db.delete(productImages);
    await db.delete(productVariants);
    await db.delete(products);
    await db.delete(categories);
    await db.delete(affiliateCodes);
    await db.delete(users);
    console.log("🗑️ Cleared existing data successfully.");

    // --- Define Seed Data ---
    const hashedPassword = await hash("password123", 10);

    // Users
    const seededUsers = [
      {
        id: uuidv4(),
        email: "testcustomer@example.com",
        firstName: "Test",
        lastName: "Customer",
        passwordHash: hashedPassword,
        role: "CUSTOMER" as const,
        status: "ACTIVE" as const,
      },
      {
        id: uuidv4(),
        email: "testvendor@example.com",
        firstName: "Test",
        lastName: "Vendor",
        passwordHash: hashedPassword,
        role: "VENDOR" as const,
        status: "ACTIVE" as const,
        pixKey: "vendor-pix-key", // For withdrawal test
      },
      {
        id: uuidv4(),
        email: "testaffiliate@example.com",
        firstName: "Test",
        lastName: "Affiliate",
        passwordHash: hashedPassword,
        role: "AFFILIATE" as const,
        status: "ACTIVE" as const,
        pixKey: "affiliate-pix-key", // For withdrawal test
      },
      {
        id: uuidv4(),
        email: "pendingvendor@example.com",
        firstName: "Pending",
        lastName: "Vendor",
        passwordHash: hashedPassword,
        role: "VENDOR" as const,
        status: "PENDING" as const, // For admin approval test
      },
      {
        id: uuidv4(),
        email: "pendingaffiliate@example.com",
        firstName: "Pending",
        lastName: "Affiliate",
        passwordHash: hashedPassword,
        role: "AFFILIATE" as const,
        status: "PENDING" as const, // For admin approval test
      },
      {
        id: uuidv4(),
        email: "affiliate-no-code@example.com",
        firstName: "NoCode",
        lastName: "Affiliate",
        passwordHash: hashedPassword,
        role: "AFFILIATE" as const,
        status: "ACTIVE" as const, // For code generation test
      },
      // Admin user credentials should ideally come from env for security
      // But for deterministic testing, we might seed one if needed by tests
      // Ensure seed-admin.ts uses different credentials if run separately
      {
        id: uuidv4(),
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        passwordHash: await hash(process.env.ADMIN_PASSWORD || "adminpass", 10),
        role: "ADMIN" as const,
        status: "ACTIVE" as const,
      },
      {
        id: uuidv4(),
        email: "rejectedvendor@example.com",
        firstName: "Rejected",
        lastName: "Vendor",
        passwordHash: hashedPassword,
        role: "VENDOR" as const,
        status: "REJECTED" as const,
      },
      {
        id: uuidv4(),
        email: "suspendedcustomer@example.com",
        firstName: "Suspended",
        lastName: "Customer",
        passwordHash: hashedPassword,
        role: "CUSTOMER" as const,
        status: "SUSPENDED" as const,
      },
      {
        id: uuidv4(),
        email: "vendor-no-pix@example.com",
        firstName: "NoPix",
        lastName: "Vendor",
        passwordHash: hashedPassword,
        role: "VENDOR" as const,
        status: "ACTIVE" as const,
        pixKey: null, // Explicitly null
      },
    ];
    const customer = seededUsers.find(
      (u) => u.email === "testcustomer@example.com"
    )!;
    const vendor = seededUsers.find(
      (u) => u.email === "testvendor@example.com"
    )!;
    const affiliate = seededUsers.find(
      (u) => u.email === "testaffiliate@example.com"
    )!;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _affiliateNoCode = seededUsers.find(
      // prefixed with _
      (u) => u.email === "affiliate-no-code@example.com"
    )!;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _pendingVendor = seededUsers.find(
      // prefixed with _
      (u) => u.email === "pendingvendor@example.com"
    )!;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _pendingAffiliate = seededUsers.find(
      // prefixed with _
      (u) => u.email === "pendingaffiliate@example.com"
    )!;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _adminUser = seededUsers.find(
      // prefixed with _
      (u) => u.email === (process.env.ADMIN_EMAIL || "admin@example.com")
    )!;

    console.log(`👤 Seeding ${seededUsers.length} users...`);
    await db.insert(users).values(seededUsers);

    // Affiliate Code (for existing affiliate)
    const seededAffiliateCodes = [
      { userId: affiliate.id, code: "AFFILIATE10" },
    ];
    console.log(`🔗 Seeding ${seededAffiliateCodes.length} affiliate codes...`);
    await db.insert(affiliateCodes).values(seededAffiliateCodes);

    // Categories
    const seededCategories = [
      { id: uuidv4(), name: "Seeded Category", slug: "seeded-category" },
      { id: uuidv4(), name: "Electronics", slug: "electronics" },
    ];
    const seededCategory = seededCategories[0];
    console.log(`📚 Seeding ${seededCategories.length} categories...`);
    await db.insert(categories).values(seededCategories);

    // Products
    const simpleProductTitle = "Seeded Simple Product";
    const variantProductTitle = "Seeded Product With Variants";
    const digitalProductTitle = "Seeded Digital Product";
    const outOfStockProductTitle = "Seeded Out-Of-Stock Product";

    const seededProducts = [
      // Physical Product (Simple) - For storefront, cart, vendor edit/delete
      {
        id: uuidv4(),
        vendorId: vendor.id,
        title: simpleProductTitle,
        description: "A simple physical product for testing.",
        priceInCents: 1999, // Renamed from price
        slug: generateSlug(simpleProductTitle),
        stock: 10,
        categoryId: seededCategory.id,
        isDigital: false,
        isPhysical: true,
        tags: ["seeded", "simple", "physical"],
      },
      // Physical Product (With Variants) - For storefront variant test
      {
        id: uuidv4(),
        vendorId: vendor.id,
        title: variantProductTitle,
        description: "A physical product with color variants.",
        priceInCents: 2999, // Renamed from price
        slug: generateSlug(variantProductTitle),
        stock: 0, // Stock managed at variant level
        categoryId: seededCategory.id,
        isDigital: false,
        isPhysical: true,
        tags: ["seeded", "variants", "physical"],
      },
      // Digital Product - For vendor create/edit/delete, download test
      {
        id: uuidv4(),
        vendorId: vendor.id,
        title: digitalProductTitle,
        description: "A digital product for testing downloads.",
        priceInCents: 999, // Renamed from price
        slug: generateSlug(digitalProductTitle),
        stock: 100, // Often high/irrelevant for digital unless limited
        categoryId: seededCategory.id,
        isDigital: true,
        isPhysical: false,
        tags: ["seeded", "digital"],
      },
      // Out of Stock Product - For storefront test
      {
        id: uuidv4(),
        vendorId: vendor.id,
        title: outOfStockProductTitle,
        description: "This product is intentionally out of stock.",
        priceInCents: 500,
        slug: generateSlug(outOfStockProductTitle),
        stock: 0, // Zero stock
        categoryId: seededCategory.id,
        isDigital: false,
        isPhysical: true,
        tags: ["seeded", "outofstock"],
      },
    ];
    const simpleProduct = seededProducts[0];
    const variantProduct = seededProducts[1];
    const digitalProduct = seededProducts[2];
    console.log(`📦 Seeding ${seededProducts.length} products...`);
    await db.insert(products).values(seededProducts);

    // Product Variants (for variantProduct)
    const seededVariants = [
      {
        id: uuidv4(),
        productId: variantProduct.id,
        name: "Color",
        value: "Red",
        priceModifier: 0,
        stock: 5,
      },
      {
        id: uuidv4(),
        productId: variantProduct.id,
        name: "Color",
        value: "Blue",
        priceModifier: 200, // +$2.00
        stock: 0, // Zero stock for this variant
      },
    ];
    console.log(`🎨 Seeding ${seededVariants.length} product variants...`);
    await db.insert(productVariants).values(seededVariants);

    // Addresses (for customer)
    const seededAddresses = [
      {
        id: uuidv4(),
        userId: customer.id,
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        postalCode: "12345", // Renamed from zipCode
        country: "USA",
        isDefault: true,
      },
      {
        id: uuidv4(),
        userId: customer.id,
        street: "456 Oak Ave",
        city: "Otherville",
        state: "NY",
        postalCode: "67890", // Renamed from zipCode
        country: "USA",
        isDefault: false, // For edit/delete/set-default tests
      },
    ];
    console.log(`🏠 Seeding ${seededAddresses.length} addresses...`);
    await db.insert(addresses).values(seededAddresses);
    const defaultAddress = seededAddresses.find((a) => a.isDefault)!;

    // Orders & Order Items
    // Order 1: Customer ordered simple physical product (Pending Fulfillment)
    const order1 = {
      id: uuidv4(),
      userId: customer.id,
      totalAmountInCents: simpleProduct.priceInCents + 500, // Renamed from totalAmount
      shippingAddressId: defaultAddress.id,
      status: "COMPLETED" as const, // Stripe session status
      createdAt: new Date(),
    };
    const orderItem1 = {
      id: uuidv4(),
      orderId: order1.id,
      productId: simpleProduct.id,
      productVariantId: null, // No variant
      quantity: 1,
      priceAtPurchaseInCents: simpleProduct.priceInCents, // Renamed from priceAtPurchase
      vendorId: vendor.id,
      status: "PENDING_FULFILLMENT" as const, // For vendor status update test
    };

    // Order 2: Customer ordered digital product (Access Granted)
    const order2 = {
      id: uuidv4(),
      userId: customer.id,
      totalAmountInCents: digitalProduct.priceInCents, // Renamed from totalAmount
      shippingAddressId: null,
      status: "COMPLETED" as const,
      createdAt: new Date(Date.now() - 86400000), // Yesterday
    };
    const orderItem2 = {
      id: uuidv4(),
      orderId: order2.id,
      productId: digitalProduct.id,
      productVariantId: null,
      quantity: 1,
      priceAtPurchaseInCents: digitalProduct.priceInCents, // Renamed from priceAtPurchase
      vendorId: vendor.id,
      status: "ACCESS_GRANTED" as const, // For download test
    };

    console.log(`🛒 Seeding 2 orders and 2 order items...`);
    await db.insert(orders).values([order1, order2]);
    await db.insert(orderItems).values([orderItem1, orderItem2]);

    // Withdrawal Requests
    const seededWithdrawals = [
      // Pending withdrawal for vendor (for admin approve/reject test)
      {
        id: uuidv4(),
        userId: vendor.id,
        amountInCents: 500, // Renamed from amount
        status: "PENDING" as const,
        requestedAt: new Date(),
        pixKeyUsed: vendor.pixKey!, // Added pixKeyUsed
      },
      // Approved withdrawal for affiliate (for admin mark paid test)
      {
        id: uuidv4(),
        userId: affiliate.id,
        amountInCents: 1000, // Renamed from amount
        status: "APPROVED" as const,
        requestedAt: new Date(Date.now() - 86400000), // Yesterday
        processedAt: new Date(),
        pixKeyUsed: affiliate.pixKey!, // Added pixKeyUsed
      },
    ];
    console.log(
      `💸 Seeding ${seededWithdrawals.length} withdrawal requests...`
    );
    await db.insert(withdrawalRequests).values(seededWithdrawals);

    // Questions & Answers (for vendor answer test)
    const seededQuestions = [
      {
        id: uuidv4(),
        productId: simpleProduct.id, // Question on the simple product
        userId: customer.id, // Asked by the test customer
        question: "What are the dimensions of this product?",
        answer: null, // No answer initially
        answeredByUserId: null,
        answeredAt: null,
      },
    ];
    console.log(`❓ Seeding ${seededQuestions.length} questions...`);
    await db.insert(questionAnswers).values(seededQuestions);

    console.log("✅ E2E Database seeding completed successfully!");
  } catch (error) {
    console.error("🔴 Error during E2E database seeding:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🚪 Closed database connection.");
  }
}

seedE2E();

export default seedE2E; // Export if needed by Playwright config
