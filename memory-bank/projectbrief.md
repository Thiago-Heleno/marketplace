# Project Brief: Multi-Vendor Marketplace (Next.js)

**Version:** 1.0
**Date:** 29/03/2025

## 1. Overview

This project aims to build a functional multi-vendor marketplace web application. Vendors should be able to register (with admin approval), list digital and physical products (including variants), manage inventory, fulfill orders, and request withdrawals. Customers should be able to browse, search, purchase products, manage their profile and orders, and download digital goods securely. Affiliates should be able to register (with admin approval), generate referral codes, track earnings, and request withdrawals. An admin user will oversee approvals and withdrawals.

The focus is on creating a **simple, reliable, and secure Minimum Viable Product (MVP)** using the specified modern tech stack.

## 2. Core Features

*   **Customer Facing:**
    *   Product Browsing & Filtering (Categories)
    *   Product Search
    *   Product Detail View (Variants, Stock, Reviews, Q&A)
    *   Shopping Cart (Client-side)
    *   Stripe Checkout (incl. Address & Shipping for Physical Goods)
    *   Order History & Status Tracking
    *   Secure Digital Asset Download
    *   User Profile Management (Name, Addresses)
    *   Password Reset Functionality
*   **Vendor Facing:**
    *   Registration (Requires Admin Approval)
    *   Product Management (CRUD - Create, Read, Update, Delete) including Variants, Images, Digital Assets, Stock.
    *   Order Management (View Orders, Update Fulfillment Status for Order Items)
    *   Balance Calculation (Based on Fulfilled Orders minus Commission)
    *   Withdrawal Requests (Requires PIX Key)
*   **Affiliate Facing:**
    *   Registration (Requires Admin Approval)
    *   Affiliate Code Generation
    *   Commission Tracking (Based on Fulfilled Referred Orders)
    *   Balance Calculation
    *   Withdrawal Requests (Requires PIX Key)
*   **Admin Facing:**
    *   User Approval (Vendors, Affiliates)
    *   View All Orders
    *   View All Users
    *   Withdrawal Request Management (Approve, Reject, Mark as Paid)

## 3. Key Requirements & Constraints

*   **Tech Stack:**
    *   Frontend: Next.js 15 (App Router), React, TailwindCSS, Shadcn UI
    *   Backend Logic: Next.js Server Actions
    *   Authentication: NextAuth.js v5 (Email/Password Provider only)
    *   Database: PostgreSQL
    *   ORM: Drizzle ORM
    *   Payments: Stripe (Checkout, Webhooks)
    *   File Storage: **Local Server File System** (`./public/uploads/images` for public images, `./uploads/assets` for protected digital assets). *Acknowledge limitations regarding scalability and deployment.*
    *   Email Service: Resend (or similar, configure via API key) for Password Reset & Order Confirmations.
    *   Testing: Jest (Unit/Integration), Cypress (E2E)
*   **Principles:**
    *   **Simplicity:** Avoid unnecessary complexity. Implement the simplest viable solution for each feature.
    *   **Reliability:** Ensure core flows work dependably. Use database transactions where appropriate (e.g., order creation).
    *   **Security:** Implement proper input validation (e.g., Zod), authorization checks (role & status based) on all Server Actions, secure password handling, webhook signature verification, secure file downloads.
*   **Testing:** Every significant feature or action added should include corresponding tests (Jest for logic/actions, Cypress for user flows).
*   **Commission Model:** Use environment variables for rates:
    *   `MARKETPLACE_COMMISSION_RATE`: Single site-wide rate (e.g., 0.20 for 20%).
    *   `AFFILIATE_COMMISSION_RATE`: Single site-wide rate (e.g., 0.05 for 5%).
*   **Shipping Model:** Use an environment variable for a flat shipping rate:
    *   `FLAT_SHIPPING_RATE_CENTS`: Applied per order if physical items are present (e.g., 500 for $5.00).
*   **Withdrawals:** Manual process. Admin marks requests as paid after external PIX transfer. Requires Vendor/Affiliate to provide a PIX key in their profile.

## 4. Detailed Functional Breakdown

### Phase 1: Project Setup & Core Foundation

*   **Task 1.1: Initialize Project:** Setup Next.js, Tailwind, Shadcn UI, Drizzle, NextAuth, Jest, Cypress, Resend SDK.
*   **Task 1.2: Setup Database & Core Schemas:**
    *   Configure Drizzle & DB connection (`DATABASE_URL`).
    *   Define Schemas: `User` (firstName, lastName, email, passwordHash, role, status ['PENDING', 'ACTIVE', 'REJECTED'], pixKey?), `Address` (linked to User), `PasswordResetToken`.
    *   Generate & apply initial migration.
*   **Task 1.3: Implement Enhanced Authentication & Registration:**
    *   Configure NextAuth Credentials provider.
    *   Sign-up form/action: Collect email, password, firstName, lastName. Hash password. Set initial `status` ('PENDING' for Vendor/Affiliate, 'ACTIVE' for Customer).
    *   Sign-in form/action.
    *   Middleware for basic route protection.
*   **Task 1.4: Implement Password Reset Flow:**
    *   Configure Resend (`RESEND_API_KEY`).
    *   "Forgot Password" page/action: Generate token, save to DB, send reset email via Resend.
    *   "Reset Password" page/action: Validate token, update password hash, invalidate token.
*   **Task 1.5: Create Basic Static Pages:** Create simple pages for Terms, Privacy Policy, About Us with placeholder content and footer links.

### Phase 2: Product Management (Vendor)

*   **Task 2.1: Define Product & Related Schemas:**
    *   Define Schemas: `Product` (vendorId, title, description, price [integer cents], slug, stock [overall], tags, categoryId, isDigital, isPhysical), `ProductVariant` (productId, name, value, priceModifier [integer cents], stock), `Category`, `ProductImage`, `DigitalAsset` (filePath, fileName), `Review`, `QuestionAnswer`.
    *   **Add `OrderItem` Schema:** (orderId, productId, productVariantId, quantity, priceAtPurchase, vendorId, **status** ['PENDING_FULFILLMENT', 'SHIPPED', 'DELIVERED', 'ACCESS_GRANTED', 'CANCELLED']).
    *   **Add `AffiliateCode` & `AffiliateReferral` Schemas:** (`AffiliateReferral` linked to `OrderItem`, includes commissionEarned, commissionRateAtTime, **status** ['PENDING', 'CONFIRMED', 'PAID', 'CANCELLED']).
    *   **Add `WithdrawalRequest` Schema:** (userId, amount, status, requestedAt, processedAt).
    *   Generate & apply migrations.
*   **Task 2.2: Implement File Upload (Local Storage):**
    *   Server Action to handle FormData uploads.
    *   Save images to `./public/uploads/images`, digital assets to `./uploads/assets`.
    *   Use UUIDs for unique filenames. Store path/metadata in DB (`ProductImage`, `DigitalAsset`).
    *   Validate file types/sizes.
*   **Task 2.3: Vendor Product CRUD Operations:**
    *   Protected routes `/dashboard/vendor/products`.
    *   Forms (Shadcn UI) for Create/Edit Product (incl. variants, uploads).
    *   Server Actions (`createProduct`, `updateProduct`, `deleteProduct`). **Authorization: Must be logged in, Role='VENDOR', Status='ACTIVE'. Verify ownership for update/delete.**
    *   **File Deletion:** `deleteProduct` and `updateProduct` (when assets/images change) **must delete** corresponding files from local storage (`fs.unlink`).
    *   Display list of vendor's products.

### Phase 3: Storefront & Purchase Flow

*   **Task 3.1: Public Product Listing & Detail Pages:**
    *   Pages `/products`, `/categories/[slug]`, `/products/[slug]`.
    *   Fetch & display products/details including variants, images, reviews, Q&A.
    *   **Zero Stock UI:** Disable "Add to Cart" and show "Out of Stock" if selected variant stock <= 0.
    *   Implement `generateMetadata` for SEO.
*   **Task 3.2: Basic Product Search:**
    *   Header search input submitting to `/search?q=query`.
    *   `/search` page fetching query param.
    *   Server Action `searchProducts(query)` using Drizzle (`ilike`) on title/desc/tags. Display results.
*   **Task 3.3: Shopping Cart:**
    *   Client-side implementation (React Context + localStorage).
    *   Functions: `addToCart` (stores `productId`, `productVariantId`, quantity), `removeFromCart`, `updateQuantity`.
    *   Cart component (e.g., Sheet) displaying items (with variant details), quantities, subtotals.
*   **Task 3.4: Checkout Preparation & Address Collection:**
    *   In Cart view:
        *   Check for physical items (`product.isPhysical`).
        *   Calculate subtotal.
        *   If physical items exist: Display flat shipping cost (from `FLAT_SHIPPING_RATE_CENTS`), add to total. Display Address selection (fetch saved, allow adding new).
        *   Require address selection if physical items present before proceeding. Store selected `addressId`.
*   **Task 3.5: Stripe Checkout Integration:**
    *   Server Action `createCheckoutSession`.
    *   Input: Cart items (`productVariantId`, quantity), selected `addressId`.
    *   Fetch `ProductVariant` details for accurate pricing/names.
    *   Construct Stripe `line_items` for product variants.
    *   **If physical items exist:** Add separate line item for flat shipping cost using `FLAT_SHIPPING_RATE_CENTS`.
    *   Create Stripe Session (`mode: 'payment'`, success/cancel URLs, metadata: { `userId`, `cartDetails` [preserving variant IDs], `addressId` }).
    *   Redirect user to Stripe URL.
*   **Task 3.6: Stripe Webhook & Order Creation:**
    *   API Route `/api/webhooks/stripe`.
    *   Verify Stripe signature (`STRIPE_WEBHOOK_SECRET`).
    *   Handle `checkout.session.completed`. Parse metadata.
    *   **DB Transaction:**
        *   Create `Order` (store `userId`, total amount, `shippingAddressId`).
        *   For each item: Create `OrderItem` (store `productVariantId`, price, vendorId, **set initial `status` based on `isDigital`: 'ACCESS_GRANTED' or 'PENDING_FULFILLMENT'**).
        *   Decrement stock for the specific `ProductVariant`.
        *   If affiliate referral applies: Create `AffiliateReferral` linked to `OrderItem` (store commission details, **initial status 'PENDING'**).
    *   Send Order Confirmation email via Resend.
    *   Return 200 OK to Stripe.

### Phase 4: Post-Purchase & Management Dashboards

*   **Task 4.1: Vendor Order Management:**
    *   Page `/dashboard/vendor/orders` displaying vendor's `OrderItems` with status.
    *   **Allow vendor to update `OrderItem.status` for physical goods:** ('PENDING_FULFILLMENT' -> 'SHIPPED', 'SHIPPED' -> 'DELIVERED', 'PENDING_FULFILLMENT' -> 'CANCELLED') via Server Actions (check ownership, valid transition).
*   **Task 4.2: Customer Order History:**
    *   Page `/dashboard/orders`. Display user's orders & items (incl. status, shipping address).
    *   Link to digital asset download route for relevant items.
*   **Task 4.3: Admin Order & User View:**
    *   Admin-only pages `/dashboard/admin/orders`, `/dashboard/admin/users` (protect via middleware). Display lists.
*   **Task 4.4: User Profile & Address Management:**
    *   Page `/dashboard/profile`.
    *   Update firstName, lastName via Server Action.
    *   Manage Addresses (Add, Edit, Delete, Set Default) via Server Actions.
    *   **Allow Vendor/Affiliate to input/update their `pixKey` here.**
*   **Task 4.5: Admin Vendor/Affiliate Approval:**
    *   Admin-only page `/dashboard/admin/approvals`. List users with `status: 'PENDING'`.
    *   Buttons calling Server Actions (`approveUser`, `rejectUser`) to update user `status` to 'ACTIVE' or 'REJECTED' (Admin auth required).
*   **Task 4.6: Implement Secure Digital Asset Download:**
    *   Protected API route `/api/download/[assetId]`.
    *   Verify auth. Get `assetId`. Fetch `DigitalAsset` path & `productId`.
    *   **Authorization:** Check if user has a completed order for the `productId`.
    *   If authorized, read file from `./uploads/assets` using `fs` and stream `Response` with correct headers (`Content-Disposition`, `Content-Type`, `Content-Length`).

### Phase 5: Advanced Features (Withdrawals & Affiliates)

*   **Task 5.1: Vendor Withdrawal System:**
    *   In Vendor Dashboard: Display balance.
    *   **Balance Calculation:** Sum `vendorShareAmount` (`item.priceAtPurchase * (1 - MARKETPLACE_COMMISSION_RATE)`) only for owned `OrderItems` where `status` is 'DELIVERED' or 'ACCESS_GRANTED'.
    *   Form to request withdrawal (requires PIX key set). Server Action `requestWithdrawal`.
    *   Admin page `/dashboard/admin/withdrawals`: List pending requests. Actions to Approve/Reject/Mark Paid (updates `WithdrawalRequest.status`).
*   **Task 5.2: Affiliate System:**
    *   Affiliate Dashboard (`/dashboard/affiliate`): Action to generate unique `AffiliateCode`.
    *   Checkout: Optional input for affiliate code.
    *   **Confirm Referrals:** Logic (e.g., during balance calculation) to update `AffiliateReferral.status` to 'CONFIRMED' if linked `OrderItem.status` becomes 'DELIVERED' or 'ACCESS_GRANTED'. Update to 'CANCELLED' if `OrderItem` is 'CANCELLED'.
    *   **Balance Calculation:** Sum `commissionEarned` from `AffiliateReferral` records where `status` is 'CONFIRMED'.
    *   Implement withdrawal request flow similar to Vendors (same `WithdrawalRequest` table/admin UI, check role/balance).
*   **Task 5.3: Reviews & Q&A Implementation:**
    *   Product Detail Page: Forms to submit Review/Question (logged-in users). Server Actions `submitReview`, `submitQuestion`.
    *   Display existing reviews/Q&A.
    *   Server Action `submitAnswer` for Vendor (own products) or Admin to answer questions.

### Phase 6: Refinement & Deployment

*   **Task 6.1: Comprehensive Testing:** Ensure good coverage with Jest & Cypress tests for all features and flows.
*   **Task 6.2: Security Hardening & Validation:** Review input validation (Zod), authorization checks, XSS risks (sanitize user content), file upload security.
*   **Task 6.3: UI Polish & Accessibility:** Review UI consistency, responsiveness, basic accessibility checks (keyboard nav, contrast).
*   **Task 6.4: Deployment Preparation:** Document ENV vars, build process, deployment steps for chosen platform (e.g., Vercel). Configure production DB, Stripe Webhook, Email Service keys.

## 5. Key Non-Functional Requirements

*   **Error Handling:** All Server Actions performing mutations MUST use `try...catch` and return structured responses (e.g., `{ success: boolean, message?: string, error?: string }`).
*   **User Feedback:** Frontend components MUST use Server Action responses to provide clear user feedback (e.g., using Shadcn UI `Toast`).
*   **Security:**
    *   Validate ALL inputs on the server (Server Actions).
    *   Implement strict authorization for ALL actions based on user role AND status.
    *   Verify Stripe webhook signatures.
    *   Prevent unauthorized access to digital assets.
    *   Use secure methods for password storage (hashing) and reset tokens.
*   **File Storage:** Understand that using the local filesystem complicates scaling and deployments. This is acceptable for V1 but should be flagged for future improvement (e.g., migrating to S3/R2).

## 6. Out of Scope (for V1)

*   Advanced Admin Dashboards/Analytics
*   Direct Admin Editing of Products/User Details
*   Vendor/Customer Messaging System
*   Automated Payouts/Integration with PIX APIs
*   Refund Processing Workflow
*   Detailed Shipping Options (Weight-based, Carrier Calculated)
*   Advanced Coupon/Discount System (beyond basic affiliate codes)
*   Multi-language / Multi-currency Support
*   Email Verification Flow (Recommended Post-V1 Add-on)
*   Wishlists / Saved Products

## 7. Instructions for AI Agent

*   Implement the project phase by phase, task by task.
*   Adhere strictly to the specified tech stack and libraries.
*   Implement features according to the descriptions, paying close attention to authorization, validation, status transitions, and calculation logic.
*   Follow the Simplicity, Reliability, Security principles.
*   Generate corresponding Jest and Cypress tests for new features/actions.
*   Use Shadcn UI components for the UI elements.
*   Implement the required error handling and user feedback patterns consistently.
*   Ask for clarification if any requirement is ambiguous.