# Technical Context: Multi-Vendor Marketplace

## Technologies Used

### Frontend
- **Next.js 15 (App Router)**: React framework for server and client components
- **React 19**: UI library for component-based development
- **TailwindCSS**: Utility-first CSS framework for styling
- **Shadcn UI**: Re-usable components built with Radix UI and TailwindCSS
- **TypeScript**: Strongly typed programming language

### Backend
- **Next.js Server Actions**: Server-side data mutations and processing
- **Next.js API Routes**: For specific endpoints (e.g., webhooks)
- **NextAuth.js v5**: Authentication framework
- **Node.js**: JavaScript runtime for server-side code
- **TypeScript**: Type safety for backend code

### Database
- **PostgreSQL**: Relational database for data storage
- **Drizzle ORM**: TypeScript ORM for database access and migrations

### External Services
- **Stripe**: Payment processing, checkout, and webhooks
- **Resend**: Email delivery service for transactional emails

### Storage
- **Local File System**: For storing product images and digital assets

### Testing
- **Jest**: Unit and integration testing
- **Cypress**: End-to-end testing
- **Testing Library**: Utilities for testing React components

### DevOps
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks

## Development Setup

### Environment Variables
```
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/marketplace

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend Email
RESEND_API_KEY=re_...

# Application Settings
MARKETPLACE_COMMISSION_RATE=0.20
AFFILIATE_COMMISSION_RATE=0.05
FLAT_SHIPPING_RATE_CENTS=500
```

### Folder Structure
```
├── app/
│   ├── api/                    # API routes
│   ├── dashboard/              # Protected dashboard routes
│   ├── products/               # Product pages
│   ├── search/                 # Search page
│   ├── (auth)/                 # Auth pages
│   └── ...                     # Other app routes
├── components/                 # React components
│   ├── ui/                     # Shadcn UI components
│   ├── forms/                  # Form components
│   ├── dashboard/              # Dashboard components
│   └── ...                     # Other components
├── lib/                        # Utility libraries
│   ├── actions/                # Server actions
│   ├── db/                     # Database config and schema
│   ├── auth/                   # Auth configuration
│   ├── stripe/                 # Stripe utilities
│   └── ...                     # Other utilities
├── public/                     # Static assets
│   └── uploads/                # Uploaded public images
├── uploads/                    # Protected digital assets
├── middleware.ts               # Next.js middleware
├── drizzle.config.ts           # Drizzle configuration
└── ...                         # Config files
```

### Development Workflow
1. Clone repository
2. Install dependencies: `npm install`
3. Set up PostgreSQL database
4. Create `.env.local` with required environment variables
5. Run database migrations: `npm run db:migrate`
6. Start development server: `npm run dev`
7. Run tests: `npm test` or `npm run test:e2e`

## Technical Constraints

### Security Constraints
- All Server Actions must include proper authorization checks
- All user inputs must be validated with Zod
- Digital assets must be protected from unauthorized access
- API routes must validate auth tokens or signatures
- Password reset tokens must have short expiration

### Performance Constraints
- Local file storage limits scalability
- Efficient database queries needed for product listings
- Cart data stored client-side to reduce server load
- Server actions must handle concurrent requests properly

### Deployment Constraints
- Local file storage requires special handling for deployment
- Environment variables must be configured in deployment environment
- Database migrations must be applied on deployment
- Stripe webhook endpoints must be accessible from the internet

## Dependencies

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0-beta.3",
    "drizzle-orm": "^0.29.0",
    "pg": "^8.11.3",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.290.0",
    "zod": "^3.22.4",
    "stripe": "^14.5.0",
    "resend": "^1.0.0",
    "uuid": "^9.0.1"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/react": "^19.0.0",
    "@types/node": "^20.9.0",
    "@types/pg": "^8.10.9",
    "@types/uuid": "^9.0.7",
    "drizzle-kit": "^0.20.6",
    "eslint": "^8.53.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.1.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.1.4",
    "cypress": "^13.5.1"
  }
}
``` 