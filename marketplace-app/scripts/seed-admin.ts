import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { users } from "../src/db/schema";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const {
  DATABASE_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
} = process.env;

async function seedAdmin() {
  console.log("Starting admin user seeding...");

  // Validate environment variables
  if (
    !DATABASE_URL ||
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD ||
    !ADMIN_FIRST_NAME ||
    !ADMIN_LAST_NAME
  ) {
    console.error(
      "Error: Missing required environment variables (DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME)"
    );
    process.exit(1);
  }

  let client;
  try {
    // Establish database connection
    client = postgres(DATABASE_URL, { max: 1 }); // Use max: 1 for scripts
    const db = drizzle(client, { schema });

    console.log("Database connection established.");

    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.email, ADMIN_EMAIL),
    });

    if (existingAdmin) {
      console.log(`Admin user with email ${ADMIN_EMAIL} already exists.`);
      process.exit(0); // Exit gracefully if admin exists
    }

    console.log(`Admin user ${ADMIN_EMAIL} not found, creating...`);

    // Hash the admin password
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    console.log("Password hashed.");

    // Insert the new admin user
    const [newAdmin] = await db
      .insert(users)
      .values({
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        email: ADMIN_EMAIL,
        passwordHash: passwordHash,
        role: "ADMIN",
        status: "ACTIVE", // Admins are active immediately
      })
      .returning();

    console.log("Admin user created successfully:");
    console.log(JSON.stringify(newAdmin, null, 2));

    process.exit(0); // Success
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1); // Exit with error code
  } finally {
    // Ensure the database connection is closed
    if (client) {
      await client.end();
      console.log("Database connection closed.");
    }
  }
}

seedAdmin();
