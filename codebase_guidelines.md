# Marketplace Application - Developer Documentation

## 1. Overview

This document provides guidelines and instructions for developers working on the Marketplace application codebase. The application is built using Next.js (App Router), Drizzle ORM with PostgreSQL, NextAuth.js for authentication, Tailwind CSS with Shadcn UI for the user interface, and Stripe for payments. Backend logic is primarily handled through Next.js Server Actions.

**Key Technologies:**

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js (Credentials Provider)
- **UI:** Tailwind CSS, Shadcn UI
- **Payments:** Stripe (via Checkout & Webhooks)
- **Emails:** Resend
- **Validation:** Zod

## 2. Authentication & Authorization

Authentication is managed using NextAuth.js (v5 beta likely), configured in `auth.ts` and `auth.config.ts`. It primarily uses a Credentials provider for email/password login.

**Key Files:**

- `auth.ts`: Main NextAuth configuration (adapter, providers, session strategy, callbacks).
- `auth.config.ts`: Shared configuration, including custom login page path and the `authorized` callback for route protection.
- `src/actions/auth.actions.ts`: Server actions for registration, login, password reset requests, and password resetting.
- `src/lib/schemas/auth.schema.ts`: Zod schemas for validating auth-related form data.
- `middleware.ts`: Applies auth protection to routes.
- `src/db/schema.ts`: Defines the `users` and `passwordResetTokens` tables.

**How it Works:**

1.  **Login/Signup:**
    - Users register via the `RegisterForm` (`src/components/auth/RegisterForm.tsx`), which calls the `registerUser` server action (`src/actions/auth.actions.ts`). Passwords are hashed using `bcryptjs` before saving to the `users` table.
    - Users log in via the `LoginForm` (`src/components/auth/LoginForm.tsx`), which calls the `signInWithCredentials` server action (`src/actions/auth.actions.ts`). This action uses the `signIn` function from `auth.ts`.
    - The `authorize` function within the `Credentials` provider in `auth.ts` verifies the email, password hash (using `bcryptjs.compare`), and checks if the user's `status` is `ACTIVE`.
2.  **Password Reset:**
    - Users request a reset via `ForgotPasswordForm` (`src/components/auth/ForgotPasswordForm.tsx`), calling the `requestPasswordReset` action.
    - This action generates a secure token, stores it in `password_reset_tokens` table, and sends a reset link via Resend (`src/lib/resend.ts`).
    - Users click the link to `/reset-password?token=...`.
    - The `ResetPasswordForm` (`src/components/auth/ResetPasswordForm.tsx`) calls the `resetPassword` action, which validates the token, updates the user's `passwordHash`, and deletes the token.
3.  **Route Protection:**
    - The `middleware.ts` file intercepts requests based on its `config.matcher`.
    - It uses the `auth` function (initialized with `authConfig`) which invokes the `authorized` callback defined in `auth.config.ts`.
    - Currently, the `authorized` callback checks if the route starts with `/dashboard` and redirects unauthenticated users to `/login`. Authenticated users are allowed access.
4.  **Server Action Protection:** Most server actions (e.g., `product.actions.ts`, `user.actions.ts`) explicitly check for authentication and authorization at the beginning using `const session = await auth();` and verifying `session.user.id` and `session.user.role`.

**Roles & Permissions:**

- Roles are defined by the `userRoleEnum` in `src/db/schema.ts`: `CUSTOMER`, `VENDOR`, `AFFILIATE`, `ADMIN`.
- User status is defined by `userStatusEnum`: `PENDING`, `ACTIVE`, `REJECTED`, `SUSPENDED`.
- `VENDOR`, `AFFILIATE`, and `ADMIN` registrations default to `PENDING` status and require admin approval via actions in `src/actions/user.actions.ts` (`approveUser`, `rejectUser`). `CUSTOMER` users are `ACTIVE` by default.
- Authorization checks within Server Actions often restrict functionality based on `session.user.role` and sometimes `session.user.status`.

**How to Get Current User Data:**

- **Server Components/Actions:** Import and use the `auth` function from `@/../auth`.

  ```typescript
  import { auth } from "@/../auth";

  async function someServerComponentOrAction() {
    const session = await auth();
    if (session?.user) {
      console.log("User ID:", session.user.id);
      console.log("User Role:", session.user.role); // Extended in callbacks
      console.log("User Status:", session.user.status); // Extended in callbacks
    } else {
      // Handle unauthenticated user
    }
  }
  ```

- **Client Components:** Use the `useSession` hook from `next-auth/react`. Wrap components needing session data in `<SessionProvider>` (likely done in a layout or specific page component, e.g., `ProductPage` uses it for Review/Question forms).

  ```typescript
  // Example in a client component
  import { useSession } from "next-auth/react";

  function ClientComponent() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading session...</p>;
    if (status === "authenticated") {
      return (
        <p>
          Welcome, {session.user?.email}! Your role is {session.user?.role}
        </p>
      );
    }
    return <p>You are not logged in.</p>;
  }
  ```

**Code Examples:**

- **Logging In (Client-Side Form calling Action):** See `src/components/auth/LoginForm.tsx` calling `signInWithCredentials` from `src/actions/auth.actions.ts`.
- **Registering (Client-Side Form calling Action):** See `src/components/auth/RegisterForm.tsx` calling `registerUser` from `src/actions/auth.actions.ts`.
- **Checking Auth Status (Server Action):**

  ```typescript
  // Inside a Server Action (e.g., src/actions/someAction.ts)
  "use server";
  import { auth } from "@/../auth";

  export async function protectedAction() {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    // Proceed with action logic for authenticated user
    // ...
    return { success: true, message: "Action completed" };
  }
  ```

- **Accessing Protected Resources (Middleware):** See `middleware.ts` and `auth.config.ts`. No explicit code needed in components for basic dashboard protection; the middleware handles redirection.

## 3. Routing (Frontend/Backend)

This project uses the Next.js App Router.

**Key Files/Concepts:**

- `src/app/`: Root directory for application routes.
- `page.tsx`: Defines the UI for a specific route segment.
- `layout.tsx`: Defines shared UI for a route segment and its children.
- `loading.tsx` (Optional): UI shown during loading of a route segment.
- `error.tsx` (Optional): UI shown if an error occurs in a route segment.
- `src/app/api/`: Directory for backend API routes (e.g., webhooks, file downloads).
- `middleware.ts`: Intercepts requests for defined routes (see Authentication section).
- Dynamic Segments: Folders named like `[slug]` or `[assetId]` capture dynamic parts of the URL.

**How Routes are Defined:**

- **Frontend Pages:** File-based routing. A file `src/app/products/page.tsx` corresponds to the `/products` route. A file `src/app/products/[slug]/page.tsx` corresponds to `/products/:slug`.
- **API Routes:** Similar file-based structure within `src/app/api/`. A file `src/app/api/webhooks/stripe/route.ts` handles POST requests to `/api/webhooks/stripe`. Exported functions like `GET`, `POST`, etc., handle specific HTTP methods.

**How to Create New Routes/Pages/Endpoints:**

1.  **New Page:** Create a new folder within `src/app/` (e.g., `src/app/my-new-page/`). Inside that folder, create a `page.tsx` file containing your React component.
2.  **New API Route:** Create folders within `src/app/api/` mirroring the desired path (e.g., `src/app/api/my-endpoint/`). Inside the final folder, create a `route.ts` file. Export async functions named `GET`, `POST`, `PUT`, `DELETE`, etc., corresponding to the HTTP methods you want to handle.

**Route Parameters:**

- **Pages:** Accessed via the `params` prop passed to the page component.

  ```typescript
  // Example: src/app/products/[slug]/page.tsx
  interface ProductPageProps {
    params: { slug: string };
  }

  export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = params;
    // Use slug to fetch data...
  }
  ```

- **API Routes:** Accessed via the `context` parameter (often destructured to get `params`).
  ```typescript
  // Example: src/app/api/download/[assetId]/route.ts
  import { NextRequest, NextResponse } from "next/server";
  interface RouteContext {
    params: { assetId: string };
  }
  export async function GET(req: NextRequest, context: RouteContext) {
    const { assetId } = context.params;
    // Use assetId...
  }
  ```

**Middleware:**

- `middleware.ts` at the root applies to routes defined in its `config.matcher`. It uses NextAuth.js to handle authentication checks. See the Authentication section for details.

**Examples:**

- **Defining a New Page (`/about`):**
  - Create `src/app/about/page.tsx`.
  - Content: See `src/app/about/page.tsx`.
- **Linking to a Page:** Use the Next.js `<Link>` component.
  ```typescript
  import Link from 'next/link';
  <Link href="/about">About Us</Link>
  <Link href={`/products/${product.slug}`}>View Product</Link>
  ```
- **Defining an API Route (`/api/download/[assetId]`):** See `src/app/api/download/[assetId]/route.ts`.
- **Calling an API Route (Example using Fetch, though less common in this app):**
  ```typescript
  // Usually Server Actions are preferred for client-server communication in this app.
  // This is just a generic example.
  async function downloadAsset(assetId: string) {
    const response = await fetch(`/api/download/${assetId}`);
    if (response.ok) {
      // Handle file download (e.g., create Blob URL)
    } else {
      // Handle error
    }
  }
  ```

## 4. Database Interaction (Drizzle ORM)

The application uses Drizzle ORM with the `postgres` driver to interact with a PostgreSQL database.

**Key Files:**

- `src/db/schema.ts`: Defines all database tables, enums, and relations using Drizzle schema syntax (`pgTable`, `pgEnum`, `relations`).
- `src/db/index.ts`: Initializes the Drizzle client connection using the `DATABASE_URL` environment variable and exports the `db` instance.
- `src/db/migrations/`: Contains SQL migration files generated by Drizzle Kit.
- `drizzle.config.ts`: Configuration file for Drizzle Kit (migration tool).
- `package.json`: Contains scripts (`db:generate`, `db:push`) for managing migrations.

**Database Connection:**

- The connection is established in `src/db/index.ts`.
- The `db` instance exported from this file is used throughout the application (primarily in Server Actions) to interact with the database.

**Models/Schemas Definition:**

- Schemas are defined in `src/db/schema.ts`. Each table is defined using `pgTable`, specifying columns with their types (e.g., `uuid`, `text`, `integer`, `boolean`, `timestamp`, `pgEnum`, `jsonb`).
- Constraints (`notNull`, `unique`, `default`) and foreign keys (`references`) are defined within the column definitions or table configuration block.
- Relationships (one-to-one, one-to-many, many-to-many) are defined using the `relations` helper from `drizzle-orm`.

**Common CRUD Operations (Examples from Actions):**

- **Create (Insert):**

  ```typescript
  // Example from src/actions/auth.actions.ts (registerUser)
  await db.insert(users).values({
    firstName,
    lastName,
    email,
    passwordHash,
    role,
    status: initialStatus,
  });

  // Example from src/actions/product.actions.ts (createProduct - within transaction)
  const [newProduct] = await tx
    .insert(products)
    .values({
      /* ...product data... */
    })
    .returning({ id: products.id });
  ```

- **Read (Query):**

  - **Find First:**

    ```typescript
    // Example from src/actions/auth.actions.ts (requestPasswordReset)
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Example from src/actions/product.actions.ts (getProductById)
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        // Eager loading relations
        images: { orderBy: (images, { asc }) => [asc(images.order)] },
        digitalAssets: true,
      },
    });
    ```

  - **Find Many:**

    ```typescript
    // Example from src/actions/user.actions.ts (getPendingUsers)
    const pendingUsers = await db.query.users.findMany({
      where: eq(users.status, "PENDING"),
      orderBy: (users, { asc }) => [asc(users.createdAt)],
    });

    // Example from src/actions/product.actions.ts (getVendorProducts)
    const vendorProducts = await db.query.products.findMany({
      where: eq(products.vendorId, vendorId),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      with: { images: { limit: 1 } },
    });
    ```

  - **Using Operators:** `eq`, `and`, `or`, `inArray`, `ilike`, `desc`, `asc` are imported from `drizzle-orm` and used within `where` and `orderBy` clauses. See various `.actions.ts` files for examples.
  - **Aggregations:** Use `sql` helper for sums, counts etc.
    ```typescript
    // Example from src/actions/user.actions.ts (getVendorBalance)
    const earningsResult = await db
      .select({ total: sql<string>`coalesce(sum(${orderItems.priceAtPurchaseInCents}::integer), 0)::text` })
      .from(orderItems)
      .where(...)
      .groupBy(...);
    const total = parseInt(earningsResult[0]?.total || "0");
    ```

- **Update:**

  ```typescript
  // Example from src/actions/user.actions.ts (approveUser)
  await db
    .update(users)
    .set({ status: "ACTIVE", updatedAt: new Date() })
    .where(and(eq(users.id, userIdToApprove), eq(users.status, "PENDING")));

  // Example from src/actions/product.actions.ts (updateProduct - within transaction)
   await tx
     .update(products)
     .set({ /* ...updated data... */, updatedAt: new Date() })
     .where(eq(products.id, productId));
  ```

- **Delete:**

  ```typescript
  // Example from src/actions/auth.actions.ts (resetPassword)
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.id, existingToken.id));

  // Example from src/actions/product.actions.ts (deleteProduct)
  await db.delete(products).where(eq(products.id, productId));
  ```

- **Transactions:** Use `db.transaction(async (tx) => { ... })` for atomic operations. Actions involving multiple related inserts/updates (like product creation with images/assets) use transactions. See `createProduct` and `updateProduct` in `product.actions.ts`.

**Conventions & Migrations:**

- **Naming:** Table names are plural (e.g., `users`, `products`), columns use snake_case (e.g., `first_name`, `price_in_cents`). Enum types also use snake_case (e.g., `user_role`).
- **Primary Keys:** Use `uuid` type with `defaultRandom()` for primary keys (`id`).
- **Timestamps:** `created_at` and `updated_at` columns are common, using `timestamp with time zone` and `defaultNow()`. The `updatedAt` column often includes `.$onUpdate(() => new Date())`.
- **Migrations:** Managed by Drizzle Kit.
  - Generate migration files: `npm run db:generate` (or `pnpm`, `yarn`). This creates SQL files in `src/db/migrations/` based on changes in `schema.ts`.
  - Apply migrations: `npm run db:push`. This directly pushes schema changes to the database (suitable for development, potentially risky for production - `db:generate` + manual review/apply is safer for production).
  - Snapshots (`0000_snapshot.json`, `0001_snapshot.json`) are generated by Drizzle Kit to track schema state.

## 5. Backend Logic (Server Actions & API Routes)

Backend logic is primarily implemented using **Next.js Server Actions**, colocated in the `src/actions/` directory and organized by feature (e.g., `product.actions.ts`, `auth.actions.ts`). Specific use cases like webhooks and secure file downloads utilize **API Routes** under `src/app/api/`.

**Key Files/Concepts:**

- `src/actions/*.actions.ts`: Contain Server Action functions marked with `"use server";`.
- `src/app/api/**/route.ts`: Define API route handlers.
- Server Actions are called directly from client components (forms, buttons) or server components.
- API Routes are typically called by external services (Stripe webhook) or via `Workspace` (though less common in this app's client-side logic).

**Structure of Server Actions:**

Most actions follow a similar pattern:

1.  **`"use server";` Directive:** Marks the function to run only on the server.
2.  **Authentication/Authorization Check:** Uses `await auth()` from `@/../auth` to get the session and checks `session.user.id` and `session.user.role`.
3.  **Input Validation:** Uses Zod schemas (defined in `src/lib/schemas/`) with `.safeParse()` to validate input data (often passed from forms).
4.  **Core Logic:** Interacts with the database (using `db` from `@/db`), performs file operations (using `fs`), calls third-party services (Resend).
5.  **Transactions:** Uses `db.transaction()` for atomic database operations.
6.  **Revalidation:** Uses `revalidatePath()` from `next/cache` to invalidate client-side router cache and trigger data refetching on specific pages after mutations.
7.  **Return Value:** Typically returns an object like `{ success: boolean, message?: string, error?: string, data?: any }` for the client to handle.

**Typical Request Flow (Server Action):**

1.  User interacts with a client component (e.g., submits `ProductForm.tsx`).
2.  The client component calls the imported Server Action (e.g., `createProduct`).
3.  The Server Action executes _on the server_.
4.  It performs auth checks, validation, database operations, file uploads, etc.
5.  It returns a result object back to the client component.
6.  The client component uses the result to show success/error messages (e.g., using `toast`) or update its state.

**Structure of API Routes:**

- Located under `src/app/api/`.
- Export named async functions corresponding to HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- Receive `NextRequest` and optionally a `context` object (containing `params` for dynamic routes).
- Return `NextResponse` objects (e.g., `NextResponse.json(...)`, `new NextResponse(...)`).
- Examples:
  - `src/app/api/webhooks/stripe/route.ts`: Handles incoming POST requests from Stripe, verifies the signature, processes the event (e.g., `checkout.session.completed`), interacts with the DB, and returns a response to Stripe.
  - `src/app/api/download/[assetId]/route.ts`: Handles GET requests, performs auth checks, verifies purchase, reads the file from a secure location (`uploads/assets`), and streams it back to the user with appropriate headers.

**How to Add New Backend Logic:**

- **For most operations initiated by user interaction:** Add a new Server Action function in the relevant `src/actions/*.actions.ts` file (or create a new file). Follow the structure outlined above.
- **For webhook handlers or specialized endpoints:** Create a new API Route under `src/app/api/`.

**Examples:**

- **Creating a Product (Server Action):** See `createProduct` in `src/actions/product.actions.ts`. Called from `ProductForm.tsx`.
- **Updating Order Item Status (Server Action):** See `updateOrderItemStatus` in `src/actions/order.actions.ts`. Called from `VendorOrderTable.tsx`.
- **Handling Stripe Webhook (API Route):** See `POST` function in `src/app/api/webhooks/stripe/route.ts`.
- **Handling File Download (API Route):** See `GET` function in `src/app/api/download/[assetId]/route.ts`.

## 6. UI Components (Shadcn UI & Custom)

The UI is built using **Tailwind CSS** and **Shadcn UI** components, extended with custom components specific to the marketplace features.

**Key Files/Concepts:**

- `src/components/ui/`: Contains the base Shadcn UI components (Button, Card, Input, Select, Dialog, etc.). These are generally not modified directly but used as building blocks.
- `src/components/`: Contains custom reusable components, organized into subdirectories by feature (e.g., `auth`, `products`, `vendor`, `profile`, `layout`, `cart`).
- `tailwind.config.ts`: Configures Tailwind CSS, including theme extensions (colors, radii) based on Shadcn variables.
- `src/app/globals.css`: Imports Tailwind base, components, and utilities, defines CSS variables for light/dark themes.
- `src/lib/utils.ts`: Contains the `cn` utility function for merging Tailwind classes.
- `components.json`: Configuration file for the Shadcn UI CLI.

**Styling Approach:**

- **Tailwind CSS:** Primarily used for layout, spacing, typography, and utility-based styling. Classes are applied directly in the JSX.
- **Shadcn UI Variables:** CSS variables defined in `globals.css` (e.g., `--primary`, `--card`, `--radius`) are used by Shadcn components and can be referenced in custom Tailwind styles if needed.
- **`cn` Utility:** Used extensively in components (especially Shadcn UI ones) to conditionally apply and merge Tailwind classes.

**How to Use Existing Components:**

- **Shadcn UI:** Import directly from `@/components/ui/...`. Refer to the Shadcn UI documentation for available props and usage.

  ```typescript
  import { Button } from "@/components/ui/button";
  import { Card, CardHeader, CardContent } from "@/components/ui/card";

  function MyComponent() {
    return (
      <Card>
        <CardHeader>...</CardHeader>
        <CardContent>
          <Button variant="outline">Click Me</Button>
        </CardContent>
      </Card>
    );
  }
  ```

- **Custom Components:** Import from their respective paths within `@/components/...`.

  ```typescript
  import { ProductCard } from "@/components/products/ProductCard";
  import { VendorProductTable } from "@/components/vendor/VendorProductTable";
  import { LoginForm } from "@/components/auth/LoginForm";

  function SomePage() {
    // ... fetch product data ...
    return (
      <div>
        <LoginForm />
        {/* <ProductCard product={productData} /> */}
        {/* <VendorProductTable data={vendorProducts} /> */}
      </div>
    );
  }
  ```

- Props for custom components can be inferred by looking at their definition (e.g., `VendorProductTableProps` in `VendorProductTable.tsx`).

**How to Create New Reusable Components:**

1.  Create a new `.tsx` file in the appropriate subdirectory under `src/components/` (e.g., `src/components/common/MyNewComponent.tsx`).
2.  Define the component function using React.
3.  Use Shadcn UI components and Tailwind CSS classes for structure and styling.
4.  Utilize the `cn` utility if needed for conditional classes.
5.  Define props using TypeScript interfaces or types.
6.  Export the component.

**Key Custom Components:**

- `auth/LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`
- `products/ProductCard`, `ReviewList`, `QuestionAnswerList`, `ReviewForm`, `QuestionForm`
- `vendor/ProductForm`, `VendorOrderTable`, `VendorProductTable`, `WithdrawalRequestForm`
- `profile/ProfileForm`, `AddressForm`, `AddressList`
- `admin/ApprovalList`, `WithdrawalManagementTable`
- `affiliate/AffiliateCodeDisplay`
- `cart/CartSheet`
- `layout/Footer`

## 7. State Management (Cart Context)

Global state management for this application currently focuses on the shopping cart, using React's Context API.

**Key Files:**

- `src/context/CartContext.tsx`: Defines the `CartContext`, `CartProvider`, and the `useCart` hook.
- `src/app/layout.tsx`: Wraps the entire application with `CartProvider` to make the cart state available globally.
- `src/components/cart/CartSheet.tsx`: Example consumer of the `useCart` hook.

**How it Works:**

- The `CartProvider` maintains the `cartItems` state (`useState`).
- It uses `useEffect` to load the cart state from `localStorage` on initial mount and to save it back whenever `cartItems` changes. This provides persistence across page loads.
- It provides functions (`addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getItemQuantity`) to modify the cart state. These functions are memoized using `useCallback`.
- It calculates `cartCount` based on the sum of item quantities.
- The `useCart` hook provides easy access to the cart state and functions within client components.

**How to Access and Update Cart State:**

1.  Ensure the component needing cart access is a Client Component (`"use client";`).
2.  Import the `useCart` hook: `import { useCart } from "@/context/CartContext";`
3.  Call the hook within the component: `const { cartItems, addToCart, cartCount } = useCart();`
4.  Use the state variables (e.g., `cartItems`, `cartCount`) and functions (e.g., `addToCart`, `removeFromCart`) provided by the hook.

**Example Usage (from `CartSheet.tsx`):**

```typescript
"use client";
import { useCart, CartItem } from "@/context/CartContext";
// ... other imports

export function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  // ... state for detailed items, loading, etc.

  // Example: Remove item
  const handleRemove = (variantId: string) => {
    removeFromCart(variantId);
  };

  // Example: Update quantity
  const handleQuantityChange = (variantId: string, newQuantity: number) => {
    updateQuantity(variantId, newQuantity);
  };

  return (
    //... JSX using cartCount, cartItems (after fetching details), removeFromCart, updateQuantity ...
  );
}
```

**Note:** No other global state management libraries like Redux or Zustand are currently used based on the provided `package.json`.

## 8. API Client / Data Fetching (Frontend)

Frontend data fetching and mutations primarily rely on **calling Server Actions** directly from React components (both Server and Client Components). There isn't a dedicated, separate API client library or module for interacting with internal backend logic.

**How Frontend Communicates with Backend:**

- **Server Actions:** The preferred method. Client Components (`"use client";`) import Server Action functions from `src/actions/*` and call them directly (e.g., within event handlers like `onSubmit` or `onClick`). Server Components can also directly call Server Actions. Next.js handles the RPC call mechanism.
- **API Routes (Limited Use):**
  - The Stripe webhook (`/api/webhooks/stripe`) is called by Stripe, not the frontend.
  - The file download route (`/api/download/[assetId]`) is accessed via a standard `<Link href="...">` or potentially a `Workspace` call if more complex client-side download logic were needed (though currently appears to be direct link/redirect).
- **No Global `Workspace` Wrapper:** The codebase does not show a centralized API service or custom `Workspace` wrapper for interacting with the internal backend.

**Authenticated Requests:**

- When calling Server Actions, authentication is handled implicitly. The action runs on the server and can access the user's session via `await auth()` (see Authentication section). The client does not need to manage or attach authentication tokens when calling actions.
- For the specific case of the file download API route (`/api/download/[assetId]/route.ts`), the route handler itself performs authentication checks using `await auth()`. The browser's session cookie likely handles authentication for the GET request made to this route.

**Examples:**

- **Fetching Data (Server Component calling Action):**

  ```typescript
  // Example: src/app/dashboard/vendor/products/page.tsx
  import { getVendorProducts } from "@/actions/product.actions";
  import { VendorProductTable } from "@/components/vendor/VendorProductTable";

  export default async function VendorProductsPage() {
    const products = await getVendorProducts(); // Action called directly
    return <VendorProductTable data={products} />;
  }
  ```

- **Fetching Data (Client Component - less common for primary data, often done via props or route params):** Data is usually fetched server-side and passed down, or client components trigger actions that _mutate_ data and then rely on `revalidatePath` for refetching/cache invalidation.
- **Posting Data (Client Component calling Action):**

  ```typescript
  // Example: src/components/vendor/ProductForm.tsx
  "use client";
  import { useForm } from "react-hook-form";
  import { createProduct, updateProduct } from "@/actions/product.actions"; // Import actions
  // ... other imports

  function ProductForm({ onSubmit, initialData }) {
     const form = useForm<ProductFormData>(...);

     const handleFormSubmit = async (data: ProductFormData) => {
       // onSubmit here is either createProduct or updateProduct passed as prop
       const result = await onSubmit(data, imageFile, assetFile);
       if (result.success) { /* ... */ } else { /* ... */ }
     };

     return <form onSubmit={form.handleSubmit(handleFormSubmit)}>...</form>;
  }
  ```

- **Accessing Download API Route:**

  ```typescript
  // Example: src/app/dashboard/orders/page.tsx (Conceptual)
  import Link from "next/link";
  import { Download } from "lucide-react";

  // Assuming 'item' has product details including productId and assetId
  {
    item.product?.isDigital && item.status === "ACCESS_GRANTED" && (
      <Button variant="outline" size="sm" asChild>
        {/* Link directly to the API route */}
        <Link href={`/api/download/${item.product.digitalAssets[0]?.id}`}>
          {" "}
          {/* Needs actual asset ID */}
          <Download className="mr-2 h-4 w-4" /> Download
        </Link>
      </Button>
    );
  }
  ```

## 9. Utilities / Helpers

Core utility functions and validation schemas are located in the `src/lib/` directory.

**Key Files:**

- `src/lib/utils.ts`: Contains general utility functions.
  - `cn(...inputs)`: Merges Tailwind CSS classes, handling conflicts and conditional classes. Used extensively in UI components.
  - `generateSlug(str)`: Creates a URL-friendly slug from a string (lowercase, hyphenated, removes special characters). Used in `product.actions.ts`.
  - `formatPrice(priceInCents)`: Formats an integer price in cents into a currency string (e.g., $19.99). Used in various components (`CartSheet`, `ProductCard`, `VendorOrderTable`, etc.).
- `src/lib/schemas/`: Contains Zod schemas for data validation.
  - `auth.schema.ts`: Defines `LoginSchema`, `RegisterSchema`, `ForgotPasswordSchema`, `ResetPasswordSchema`. Used in auth forms (`LoginForm`, etc.) and corresponding auth actions (`auth.actions.ts`) for validation.
  - `product.schema.ts`: Defines `ProductSchema`. Used in `ProductForm.tsx` and `product.actions.ts` for validating product data.
- `src/lib/resend.ts`: Initializes and exports the Resend client instance for sending emails. Used in `auth.actions.ts` for password reset emails and potentially order confirmations (though order confirmation email sending is in the Stripe webhook handler `src/app/api/webhooks/stripe/route.ts`).

**Usage Examples:**

- **Class Merging:**
  ```typescript
  // Inside a component (e.g., src/components/ui/button.tsx)
  import { cn } from "@/lib/utils";
  className={cn("base-classes", props.className, { 'conditional-class': condition })}
  ```
- **Price Formatting:**
  ```typescript
  import { formatPrice } from "@/lib/utils";
  <p>{formatPrice(1999)}</p>; // Output: $19.99
  ```
- **Slug Generation:**
  ```typescript
  // Inside src/actions/product.actions.ts
  import { generateSlug } from "@/lib/utils";
  const slug = generateSlug(productData.title);
  ```
- **Zod Validation (Form):**
  ```typescript
  // Inside src/components/auth/LoginForm.tsx
  import { zodResolver } from "@hookform/resolvers/zod";
  import { LoginSchema, LoginInput } from "@/lib/schemas/auth.schema";
  const form = useForm<LoginInput>({ resolver: zodResolver(LoginSchema), ... });
  ```
- **Zod Validation (Server Action):**
  ```typescript
  // Inside src/actions/auth.actions.ts
  import { LoginSchema } from "@/lib/schemas/auth.schema";
  const validatedCredentials = LoginSchema.safeParse(credentials);
  if (!validatedCredentials.success) {
    // Handle validation error
  }
  const { email, password } = validatedCredentials.data;
  ```

## 10. Configuration & Environment Variables

Application configuration relies on environment variables, typically stored in a `.env.local` file at the project root (this file should be listed in `.gitignore`).

**Key Files:**

- `.env.local` (Not provided, but implied use)
- `drizzle.config.ts` (Reads `DATABASE_URL`)
- `src/db/index.ts` (Reads `DATABASE_URL`)
- `auth.ts` (Implicitly uses `AUTH_SECRET`, `NEXTAUTH_URL` via NextAuth)
- `src/actions/` (Various actions read specific keys like `RESEND_API_KEY`, `MARKETPLACE_COMMISSION_RATE`, `AFFILIATE_COMMISSION_RATE`)
- `src/app/api/webhooks/stripe/route.ts` (Reads `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `AFFILIATE_COMMISSION_RATE`)
- `scripts/seed-admin.ts` (Reads DB and Admin credentials)

**How to Configure:**

1.  Create a `.env.local` file in the project root.
2.  Add the necessary environment variables to this file in the format `KEY=VALUE`.

**Required/Key Environment Variables:**

- `DATABASE_URL`: The connection string for the PostgreSQL database (e.g., `postgresql://user:password@host:port/db`). Used by Drizzle ORM and Drizzle Kit.
- `AUTH_SECRET`: A secret key used by NextAuth.js to sign JWTs and cookies. Generate a strong random string (e.g., using `openssl rand -base64 32`).
- `NEXTAUTH_URL`: The canonical URL of your deployment (e.g., `http://localhost:3000` for development). Used by NextAuth.js for redirects and callbacks.
- `STRIPE_SECRET_KEY`: Your Stripe API secret key (sk\_...). Used for server-side Stripe operations.
- `STRIPE_WEBHOOK_SECRET`: The secret key for verifying incoming Stripe webhooks (whsec\_...).
- `RESEND_API_KEY`: Your API key from Resend for sending emails.
- `NEXT_PUBLIC_APP_URL`: The public base URL of the app (e.g., `http://localhost:3000`). Used for constructing URLs (like Stripe success/cancel URLs). _Note: Needs `NEXT_PUBLIC_` prefix to be available client-side if necessary._
- `MARKETPLACE_COMMISSION_RATE`: The commission rate taken by the marketplace from vendor sales (e.g., `0.1` for 10%). Used in `user.actions.ts` (`getVendorBalance`).
- `AFFILIATE_COMMISSION_RATE`: The commission rate given to affiliates (e.g., `0.05` for 5%). Used in webhook handler and `affiliate.actions.ts`.
- `FLAT_SHIPPING_RATE_CENTS` (Optional): A flat shipping rate in cents added during checkout if physical items are present. Used in `checkout.actions.ts`. Defaults to 0 if not set.
- **For Admin Seeding (`scripts/seed-admin.ts`):**
  - `ADMIN_EMAIL`: Email for the initial admin user.
  - `ADMIN_PASSWORD`: Password for the initial admin user.
  - `ADMIN_FIRST_NAME`: First name for the initial admin user.
  - `ADMIN_LAST_NAME`: Last name for the initial admin user.

**Accessing Environment Variables:**

- Use `process.env.VARIABLE_NAME` in server-side code (Node.js environment: Server Components, Server Actions, API Routes, config files).
- For client-side access, variables must be prefixed with `NEXT_PUBLIC_` (e.g., `process.env.NEXT_PUBLIC_APP_URL`).

## 11. Third-Party Services

- **Stripe:** Handles payment processing.
  - Integration via Stripe Checkout (`checkout.actions.ts`).
  - Order fulfillment triggered by webhooks (`app/api/webhooks/stripe/route.ts`).
  - Requires `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
- **Resend:** Handles transactional emails.
  - Used for password resets (`auth.actions.ts`) and order confirmations (webhook handler).
  - Requires `RESEND_API_KEY`.
  - Client initialized in `src/lib/resend.ts`.
- **NextAuth.js:** Handles authentication and session management.
  - Configured in `auth.ts` and `auth.config.ts`.
  - Uses Drizzle Adapter (`@auth/drizzle-adapter`).
  - Requires `AUTH_SECRET` and `NEXTAUTH_URL`.
- **Vercel Postgres (Implied):** Although not explicitly stated, `postgres` package and `DATABASE_URL` suggest a hosted PostgreSQL provider like Vercel Postgres, Neon, Supabase, etc.

## 12. Database Migrations & Seeding

- **Migrations:** Managed using Drizzle Kit.
  - Schema defined in `src/db/schema.ts`.
  - Generate migrations: `npm run db:generate`
  - Apply migrations: `npm run db:push` (Direct push, use with caution)
  - Migration files are stored in `src/db/migrations/`.
- **Seeding:** An initial admin user can be seeded using a script.
  - Script: `scripts/seed-admin.ts`.
  - Requires environment variables: `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME`, `ADMIN_LAST_NAME`.
  - Run script: `npm run db:seed:admin`
