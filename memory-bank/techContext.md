# Tech Context: Multi-Vendor Marketplace

**Version:** 1.0
**Date:** 30/03/2025
**Based on:** `projectbrief.md` v1.0

## 1. Core Technologies

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI Library:** React
- **Styling:** TailwindCSS
- **Component Library:** Shadcn UI
- **Backend Logic:** Next.js Server Actions
- **Authentication:** NextAuth.js v5 (Credentials Provider - Email/Password)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Payments:** Stripe (Checkout, Webhooks)
- **File Storage:** Local Server File System (`./public/uploads/images`, `./uploads/assets`)
- **Email Service:** Resend (or similar, via API Key)
- **Testing:** Jest (Unit/Integration), Cypress (E2E)
- **Validation:** Zod (for Server Action inputs)

## 2. Development Setup & Tools

- **Package Manager:** npm (or yarn/pnpm, assumed npm unless specified otherwise)
- **Node.js Version:** Compatible with Next.js 15 (Likely Node.js 18+ or 20+)
- **Database Connection:** Via `DATABASE_URL` environment variable.
- **Migrations:** Managed by `drizzle-kit`.
- **Environment Variables:** Critical for configuration (API keys, secrets, rates). A `.env.local` file will be needed. Key variables identified in `projectbrief.md`:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `RESEND_API_KEY`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLIC_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `MARKETPLACE_COMMISSION_RATE` (e.g., 0.20)
  - `AFFILIATE_COMMISSION_RATE` (e.g., 0.05)
  - `FLAT_SHIPPING_RATE_CENTS` (e.g., 500)
- **Code Editor:** VS Code (implied by environment)
- **Version Control:** Git (assumed)

## 3. Technical Constraints & Considerations

- **Local File Storage:** Chosen for V1 simplicity. This poses challenges for scaling (cannot easily use serverless functions like Vercel) and requires careful path management and manual cleanup. Deployment requires a persistent filesystem. Future improvement: Migrate to cloud storage (S3, R2, etc.).
- **Manual Withdrawals:** PIX payouts are handled outside the application. The system only tracks requests and status updates made by the admin.
- **Single Commission/Shipping Rates:** Uses fixed rates via ENV vars, lacks flexibility for per-product or tiered rates.
- **Security:** Heavy reliance on correct implementation of authorization checks within Server Actions and secure handling of secrets/API keys. Input validation (Zod) is crucial. Webhook security depends on signature verification. Secure file download logic must be robust.
- **Testing:** Requirement to add Jest/Cypress tests alongside feature development.

## 4. Key Libraries & SDKs (To be installed)

- `next`
- `react`, `react-dom`
- `tailwindcss`, `postcss`, `autoprefixer`
- `@radix-ui/*` (dependency of Shadcn)
- `shadcn-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
- `next-auth@beta` (v5)
- `drizzle-orm`, `postgres` (node-postgres)
- `drizzle-kit` (dev dependency)
- `stripe`
- `resend`
- `zod`
- `jest`, `@types/jest`, `ts-jest` (dev dependencies)
- `cypress` (dev dependency)
- `bcryptjs`, `@types/bcryptjs` (for password hashing)
- `uuid`, `@types/uuid` (for unique filenames)
