# System Patterns: Multi-Vendor Marketplace

**Version:** 1.0
**Date:** 30/03/2025
**Based on:** `projectbrief.md` v1.0

## 1. Architecture Overview

- **Framework:** Next.js 15 (App Router) - Leverages React Server Components and Server Actions for backend logic within the frontend framework.
- **Database:** PostgreSQL - Relational database for structured data.
- **ORM:** Drizzle ORM - TypeScript ORM for database interaction, schema definition, and migrations.
- **Authentication:** NextAuth.js v5 - Handles user authentication (Email/Password initially).
- **UI:** TailwindCSS + Shadcn UI - Utility-first CSS framework and pre-built component library.
- **Payments:** Stripe Checkout - Offloads payment processing complexity. Relies on webhooks for order confirmation.
- **File Storage:** Local Filesystem - Simple storage for V1, acknowledging scalability limitations. Public images (`./public/uploads/images`) and protected assets (`./uploads/assets`).
- **Background/API:** Next.js Server Actions and API Routes (specifically for webhooks and secure downloads).

```mermaid
graph TD
    subgraph Browser
        UI[Next.js Frontend: React, Tailwind, Shadcn]
    end

    subgraph Server (Next.js)
        AppRouter[App Router] --> ServerActions[Server Actions]
        AppRouter --> API[API Routes: /api/webhooks/stripe, /api/download]
        ServerActions --> AuthN[NextAuth.js]
        ServerActions --> Drizzle[Drizzle ORM]
        ServerActions --> FileSys[Local File System: ./public/uploads, ./uploads]
        ServerActions --> Email[Resend API]
        API --> AuthN
        API --> Drizzle
        API --> FileSys
        AuthN --> Drizzle
    end

    subgraph External Services
        Stripe[Stripe API: Checkout, Webhooks]
        Resend[Resend API: Emails]
    end

    subgraph Database
        DB[(PostgreSQL)]
    end

    UI --> AppRouter
    AppRouter --> UI

    ServerActions --> Stripe
    API -- Webhook --> ServerActions

    Drizzle --> DB

    style FileSys fill:#f9f,stroke:#333,stroke-width:2px
```

## 2. Key Technical Decisions & Patterns

- **Server Actions:** Primary mechanism for backend logic (CRUD, checkout creation, etc.). Enables colocation of frontend and backend logic. Requires strict input validation (Zod) and authorization checks.
- **Drizzle ORM:** Manages database schema (`schema.ts`), migrations (`drizzle-kit`), and queries. Provides type safety.
- **NextAuth.js:** Handles session management and authentication flow. Middleware used for route protection.
- **Local File Storage:** Simplifies V1 setup but requires careful handling of file paths, unique naming (UUIDs), and cleanup (e.g., `fs.unlink` on delete). Secure downloads require dedicated API route with authorization.
- **Stripe Integration:** Uses Stripe Checkout for UI, relies on `checkout.session.completed` webhook for order persistence. Requires webhook signature verification.
- **Database Transactions:** Essential for operations involving multiple related database updates (e.g., order creation: create Order, OrderItems, decrement stock, create AffiliateReferral).
- **Client-Side Cart:** Uses React Context and `localStorage` for persistence within the user's browser session.
- **Environment Variables:** Used extensively for configuration (API keys, commission rates, shipping rates, DB URL).
- **Error Handling:** Server Actions return structured objects (`{ success, message?, error? }`) for frontend feedback (e.g., Toasts).
- **Authorization:** Role-based (`User.role`) and status-based (`User.status`) checks enforced within Server Actions. Ownership checks required for updates/deletes (e.g., vendor modifying own product).

## 3. Component Relationships (High-Level)

- **Pages (App Router):** Define routes and fetch initial data.
- **UI Components (Shadcn):** Used for forms, tables, modals, etc.
- **Server Actions:** Encapsulate specific backend operations triggered by UI interactions.
- **Context Providers:** Manage global state (e.g., Cart).
- **Middleware:** Protects routes based on authentication status/role.
- **API Routes:** Handle external interactions (webhooks, secure file downloads).
