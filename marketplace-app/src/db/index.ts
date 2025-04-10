import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Import all exports from schema.ts

// Ensure DATABASE_URL is set (it should be loaded via .env.local by Next.js)
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please check your .env.local file."
  );
}

// Create the connection client
const client = postgres(process.env.DATABASE_URL);

// Create the Drizzle instance
// Pass the schema to the drizzle function
export const db = drizzle(client, { schema });

// Optionally, export the schema itself if needed elsewhere directly
export * as dbSchema from "./schema";
