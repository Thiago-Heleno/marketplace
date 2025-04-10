import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  // Provide a default dummy URL for initial setup if needed,
  // but ideally, the user should create .env.local first.
  // Throwing an error is safer to ensure configuration is correct.
  console.warn(
    'DATABASE_URL environment variable is not set. Please create a .env.local file with DATABASE_URL="postgresql://user:password@host:port/db"'
  );
  // Using a placeholder to allow initial generation without a real DB connection yet
  // process.env.DATABASE_URL = 'postgresql://user:password@host:port/db_placeholder';
  throw new Error(
    "DATABASE_URL environment variable is required in .env.local"
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts", // Path to the schema file (will be created in Task 1.2)
  out: "./src/db/migrations", // Directory to output migration files
  dialect: "postgresql", // Specify the database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true, // Enable verbose logging during migrations
  strict: true, // Enable strict mode for schema checking
});
