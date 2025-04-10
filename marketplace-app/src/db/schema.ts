import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// --- Enums ---

export const userRoleEnum = pgEnum("user_role", [
  "CUSTOMER",
  "VENDOR",
  "AFFILIATE",
  "ADMIN",
]);
export const userStatusEnum = pgEnum("user_status", [
  "PENDING",
  "ACTIVE",
  "REJECTED",
  "SUSPENDED", // Added for potential future use
]);

export const orderItemStatusEnum = pgEnum("order_item_status", [
  "PENDING_FULFILLMENT", // Physical item, awaiting shipment
  "SHIPPED", // Physical item, shipped
  "DELIVERED", // Physical item, delivered
  "ACCESS_GRANTED", // Digital item, access provided (typically on order completion)
  "CANCELLED", // Item cancelled (by vendor or admin)
]);

export const affiliateReferralStatusEnum = pgEnum("affiliate_referral_status", [
  "PENDING", // Linked order item not yet fulfilled/confirmed
  "CONFIRMED", // Linked order item fulfilled, commission eligible
  "PAID", // Commission included in a paid withdrawal
  "CANCELLED", // Linked order item cancelled
]);

export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "PENDING", // Requested, awaiting admin action
  "APPROVED", // Approved by admin, awaiting payment
  "REJECTED", // Rejected by admin
  "PAID", // Marked as paid by admin
]);

// --- Tables ---

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("CUSTOMER"),
  status: userStatusEnum("status").notNull().default("ACTIVE"), // Default handled dynamically on creation based on role
  pixKey: text("pix_key"), // Optional, for Vendors/Affiliates
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Cascade delete if user is deleted
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: varchar("state", { length: 50 }).notNull(), // Assuming state/province codes/names fit
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  // No changes needed here for Task 2.1
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Phase 2 Tables ---

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(), // For URLs
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Link to the vendor (user)
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null", // Keep product if category deleted
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(), // Unique slug for product URL
    description: text("description"),
    priceInCents: integer("price_in_cents").notNull(), // Store price as integer cents
    stock: integer("stock").notNull().default(0), // Overall stock, might be sum of variants if used
    tags: jsonb("tags").$type<string[]>(), // Store tags as a JSON array of strings
    isDigital: boolean("is_digital").notNull().default(false),
    isPhysical: boolean("is_physical").notNull().default(true), // Assume physical unless specified
    isActive: boolean("is_active").notNull().default(true), // Vendor can deactivate
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      vendorIdx: uniqueIndex("products_vendor_idx").on(table.vendorId),
      categoryIdx: uniqueIndex("products_category_idx").on(table.categoryId),
      slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    };
  }
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }), // Cascade delete variants if product deleted
    name: text("name").notNull(), // e.g., "Size", "Color"
    value: text("value").notNull(), // e.g., "Large", "Red"
    priceModifierInCents: integer("price_modifier_in_cents").default(0), // Add/subtract from base product price
    stock: integer("stock").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("variants_product_idx").on(table.productId),
      // Unique constraint for product + name + value? Maybe too strict?
      // unique(table.productId, table.name, table.value)
    };
  }
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(), // Path relative to /public/uploads/images
    altText: text("alt_text"),
    order: integer("order").default(0), // For ordering images
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("images_product_idx").on(table.productId),
    };
  }
);

export const digitalAssets = pgTable(
  "digital_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    filePath: text("file_path").notNull().unique(), // Path relative to ./uploads/assets (secure location)
    fileName: text("file_name").notNull(), // Original filename for download
    fileType: text("file_type"), // e.g., application/pdf
    fileSizeBytes: integer("file_size_bytes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("assets_product_idx").on(table.productId),
    };
  }
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // User who wrote the review
    rating: integer("rating").notNull(), // e.g., 1-5 stars
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      productUserIdx: uniqueIndex("reviews_product_user_idx").on(
        table.productId,
        table.userId
      ), // Allow only one review per user per product
    };
  }
);

export const questionAnswers = pgTable(
  "question_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // User who asked the question
    question: text("question").notNull(),
    answer: text("answer"), // Answer provided by vendor or admin
    answeredByUserId: uuid("answered_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }), // User who answered
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
  },
  (table) => {
    return {
      productIdx: uniqueIndex("qa_product_idx").on(table.productId),
      userIdx: uniqueIndex("qa_user_idx").on(table.userId),
    };
  }
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Don't delete orders if user deleted? Or set null? Restrict for now.
    totalAmountInCents: integer("total_amount_in_cents").notNull(),
    shippingAddressId: uuid("shipping_address_id").references(
      () => addresses.id,
      { onDelete: "set null" } // Keep order even if address deleted
    ),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(), // Store Stripe Payment Intent ID
    status: text("status").default("PENDING"), // e.g., PENDING, PROCESSING, COMPLETED, FAILED
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      userIdx: uniqueIndex("orders_user_idx").on(table.userId),
      paymentIntentIdx: uniqueIndex("orders_stripe_pi_idx").on(
        table.stripePaymentIntentId
      ),
    };
  }
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }), // Delete items if order deleted
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }), // Don't delete item if product deleted (keep order history)
    productVariantId: uuid("product_variant_id").references(
      () => productVariants.id,
      { onDelete: "restrict" } // Don't delete item if variant deleted
    ),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Keep item even if vendor deleted
    quantity: integer("quantity").notNull(),
    priceAtPurchaseInCents: integer("price_at_purchase_in_cents").notNull(), // Price of the item (variant adjusted) when bought
    status: orderItemStatusEnum("status")
      .notNull()
      .default("PENDING_FULFILLMENT"), // Default handled dynamically based on product type
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      orderIdx: uniqueIndex("order_items_order_idx").on(table.orderId),
      productIdx: uniqueIndex("order_items_product_idx").on(table.productId),
      variantIdx: uniqueIndex("order_items_variant_idx").on(
        table.productVariantId
      ),
      vendorIdx: uniqueIndex("order_items_vendor_idx").on(table.vendorId),
    };
  }
);

export const affiliateCodes = pgTable(
  "affiliate_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Affiliate user
    code: text("code").notNull().unique(), // The unique referral code
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      userIdx: uniqueIndex("affiliate_codes_user_idx").on(table.userId),
      codeIdx: uniqueIndex("affiliate_codes_code_idx").on(table.code),
    };
  }
);

export const affiliateReferrals = pgTable(
  "affiliate_referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateUserId: uuid("affiliate_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Affiliate who gets commission
    affiliateCodeId: uuid("affiliate_code_id")
      .notNull()
      .references(() => affiliateCodes.id, { onDelete: "restrict" }), // Code used
    orderItemId: uuid("order_item_id")
      .notNull()
      .references(() => orderItems.id, { onDelete: "cascade" }) // Link to the specific item generating commission
      .unique(), // Only one referral per order item
    commissionRateAtTime: integer("commission_rate_at_time").notNull(), // Store as integer basis points (e.g., 500 for 5%)
    commissionEarnedInCents: integer("commission_earned_in_cents").notNull(),
    status: affiliateReferralStatusEnum("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      affiliateUserIdx: uniqueIndex("referrals_affiliate_user_idx").on(
        table.affiliateUserId
      ),
      orderItemIdx: uniqueIndex("referrals_order_item_idx").on(
        table.orderItemId
      ),
    };
  }
);

export const withdrawalRequests = pgTable(
  "withdrawal_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Vendor or Affiliate requesting
    amountInCents: integer("amount_in_cents").notNull(),
    status: withdrawalStatusEnum("status").notNull().default("PENDING"),
    pixKeyUsed: text("pix_key_used").notNull(), // Record the PIX key used for this request
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }), // When admin processed it
    adminNotes: text("admin_notes"), // Optional notes from admin
  },
  (table) => {
    return {
      userIdx: uniqueIndex("withdrawals_user_idx").on(table.userId),
    };
  }
);

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  passwordResetTokens: many(passwordResetTokens),
  products: many(products, { relationName: "vendorProducts" }), // Vendor's products
  orders: many(orders), // Customer's orders
  reviews: many(reviews),
  questions: many(questionAnswers, { relationName: "userQuestions" }),
  answers: many(questionAnswers, { relationName: "userAnswers" }),
  affiliateCodes: many(affiliateCodes),
  affiliateReferrals: many(affiliateReferrals), // Referrals generated by this affiliate
  withdrawalRequests: many(withdrawalRequests),
  orderItemsVendor: many(orderItems, { relationName: "vendorOrderItems" }), // Order items belonging to this vendor
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  // Removed unused 'many' here
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  // Removed unused 'many' relation for orders here as it wasn't defined elsewhere
  // orders: many(orders), // Orders shipped to this address
}));

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
);

// --- Phase 2 Relations ---

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  vendor: one(users, {
    fields: [products.vendorId],
    references: [users.id],
    // relationName: "vendorProducts", // Removed relationName
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
  digitalAssets: many(digitalAssets),
  reviews: many(reviews),
  questionAnswers: many(questionAnswers),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    orderItems: many(orderItems),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const digitalAssetsRelations = relations(digitalAssets, ({ one }) => ({
  product: one(products, {
    fields: [digitalAssets.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const questionAnswersRelations = relations(
  questionAnswers,
  ({ one }) => ({
    product: one(products, {
      fields: [questionAnswers.productId],
      references: [products.id],
    }),
    user: one(users, {
      fields: [questionAnswers.userId],
      references: [users.id],
      relationName: "userQuestions",
    }),
    answeredByUser: one(users, {
      fields: [questionAnswers.answeredByUserId],
      references: [users.id],
      relationName: "userAnswers",
    }),
  })
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  productVariant: one(productVariants, {
    fields: [orderItems.productVariantId],
    references: [productVariants.id],
  }),
  vendor: one(users, {
    fields: [orderItems.vendorId],
    references: [users.id],
    relationName: "vendorOrderItems",
  }),
  affiliateReferral: one(affiliateReferrals, {
    // Link back to the referral if one exists
    fields: [orderItems.id],
    references: [affiliateReferrals.orderItemId],
  }),
}));

export const affiliateCodesRelations = relations(
  affiliateCodes,
  ({ one, many }) => ({
    user: one(users, {
      // The affiliate who owns the code
      fields: [affiliateCodes.userId],
      references: [users.id],
    }),
    referrals: many(affiliateReferrals), // Referrals made using this code
  })
);

export const affiliateReferralsRelations = relations(
  affiliateReferrals,
  ({ one }) => ({
    affiliateUser: one(users, {
      // The affiliate who earned the commission
      fields: [affiliateReferrals.affiliateUserId],
      references: [users.id],
    }),
    affiliateCode: one(affiliateCodes, {
      // The code used for the referral
      fields: [affiliateReferrals.affiliateCodeId],
      references: [affiliateCodes.id],
    }),
    orderItem: one(orderItems, {
      // The specific order item that triggered the referral
      fields: [affiliateReferrals.orderItemId],
      references: [orderItems.id],
    }),
  })
);

export const withdrawalRequestsRelations = relations(
  withdrawalRequests,
  ({ one }) => ({
    user: one(users, {
      // The user (Vendor/Affiliate) requesting withdrawal
      fields: [withdrawalRequests.userId],
      references: [users.id],
    }),
  })
);
