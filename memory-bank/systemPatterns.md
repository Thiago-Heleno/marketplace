# System Patterns: Multi-Vendor Marketplace

## System Architecture

The multi-vendor marketplace follows a modern web application architecture using Next.js 15 with the App Router:

```
┌─── Client Side ───┐     ┌─── Server Side ───┐     ┌─── External Services ───┐
│                   │     │                   │     │                         │
│  React Components │◄───►│  Server Actions   │◄───►│  Stripe                 │
│  Client Context   │     │  API Routes       │     │  Resend Email           │
│  UI Components    │     │  Next.js Routes   │     │                         │
│                   │     │                   │     │                         │
└───────────────────┘     └─────────┬─────────┘     └─────────────────────────┘
                                    │
                                    ▼
                          ┌─── Data Layer ───┐       ┌─── File Storage ───┐
                          │                  │       │                    │
                          │  PostgreSQL DB   │       │  Public Images     │
                          │  Drizzle ORM     │       │  Protected Assets  │
                          │                  │       │                    │
                          └──────────────────┘       └────────────────────┘
```

## Key Technical Decisions

1. **Next.js App Router**
   - Server Components for initial rendering and data fetching
   - Client Components for interactive elements
   - Metadata API for SEO optimization

2. **Server Actions for Backend Logic**
   - Secure server-side mutations with proper validation and error handling
   - Consistent pattern returning `{ success, data, error }` objects
   - Authorization checks on all protected operations

3. **Authentication with NextAuth.js v5**
   - Email/Password authentication only
   - Role-based access control (`CUSTOMER`, `VENDOR`, `AFFILIATE`, `ADMIN`)
   - Status-based access control (`PENDING`, `ACTIVE`, `REJECTED`)

4. **Database Access with Drizzle ORM**
   - Type-safe database schema definition
   - Migrations for schema versioning
   - Transactions for atomic operations (e.g., order creation)

5. **Local File Storage**
   - Public images in `./public/uploads/images`
   - Protected digital assets in `./uploads/assets`
   - File management handled via Node.js `fs` module

6. **Payment Processing with Stripe**
   - Checkout Sessions for secure payment handling
   - Webhooks for order confirmation and processing
   - Direct integration with order creation flow

7. **Email Service with Resend**
   - Password reset functionality
   - Order confirmations
   - Service notifications

## Design Patterns

1. **Repository Pattern**
   - Database access abstracted through repository functions
   - Centralized query logic for each entity

2. **Service Layer Pattern**
   - Business logic separated from data access and presentation
   - Services orchestrate repository calls and external API interactions

3. **React Context for State Management**
   - Shopping cart maintained in client-side context + localStorage
   - Auth context for user session information

4. **Server Action Pattern**
   - Form submissions handled by server actions
   - Consistent error handling and response structure
   - Authorization checks at the beginning of each action

5. **Middleware Pattern**
   - Route protection via Next.js middleware
   - Role and status-based access control

## Component Relationships

### User Management
- `User` entity with role and status fields
- Role-specific dashboards and features
- Status transitions controlled by admin actions

### Product System
- `Product` as primary entity with variants, images, and assets
- Products linked to vendors
- Categories for organization
- Review and Q&A functionality

### Order System
- `Order` as primary entity with line items
- Order items linked to products, variants, and vendors
- Status transitions for order fulfillment
- Digital asset access tied to order status

### Financial System
- Commission calculations based on order fulfillment
- Withdrawal requests with approval workflow
- Affiliate referrals linked to orders

### File Management
- Consistent file naming and storage strategy
- Secure access control for protected assets
- Cleanup routines for deleted products 