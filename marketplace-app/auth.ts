import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db"; // Drizzle instance
import { users, userStatusEnum } from "@/db/schema"; // User schema (removed unused userRoleEnum)
import { LoginSchema } from "@/lib/schemas/auth.schema"; // Zod schema for validation
import { authConfig } from "./auth.config"; // Shared config (pages, basic callbacks)

export const {
  handlers: { GET, POST }, // API route handlers
  auth, // Server-side auth access
  signIn, // Server Action for signing in
  signOut, // Server Action for signing out
  // update, // Optional: For updating session
} = NextAuth({
  ...authConfig, // Spread shared config (pages, authorized callback)
  adapter: DrizzleAdapter(db), // Use Drizzle adapter
  session: { strategy: "jwt" }, // Use JWT for session strategy (recommended)
  providers: [
    Credentials({
      // Optional: You can skip the default login form generation
      // by not providing `credentials` or returning null here.
      // We will build our own form.
      async authorize(credentials) {
        // 1. Validate credentials using Zod
        const validatedCredentials = LoginSchema.safeParse(credentials);

        if (validatedCredentials.success) {
          const { email, password } = validatedCredentials.data;

          // 2. Find user by email in the database
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          // 3. Check if user exists and password matches
          // Also check if user status is ACTIVE
          if (
            !user ||
            !user.passwordHash ||
            user.status !== userStatusEnum.enumValues[1] // 'ACTIVE'
          ) {
            console.log(
              `Login failed: User not found, no password hash, or status not ACTIVE for ${email}`
            );
            return null; // User not found, inactive, or missing hash
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (passwordsMatch) {
            console.log(`Login successful for ${email}`);
            // Return user object (must match NextAuth User type)
            // DrizzleAdapter handles mapping DB fields to standard User fields
            return user;
          }
        }
        console.log(
          `Login failed: Invalid credentials or validation failed for credentials: ${JSON.stringify(credentials)}`
        );
        return null; // Invalid credentials or validation failed
      },
    }),
    // Add other providers like Google, GitHub etc. later if needed
  ],
  callbacks: {
    ...authConfig.callbacks, // Include the authorized callback from auth.config

    // Extend JWT with user ID, role, and status
    async jwt({ token, user }) {
      // The 'user' object passed here can be the result of the authorize callback (full user)
      // or potentially the AdapterUser type in other flows.
      if (user) {
        // Safely add properties if they exist on the user object
        token.id = user.id;
        if ("role" in user) {
          token.role = user.role;
        }
        if ("status" in user) {
          token.status = user.status;
        }
      }
      // TODO: If role/status might change and need immediate reflection,
      // fetch user from DB using token.sub (user ID) here.
      // For now, assume initial role/status persists for the session.
      return token;
    },

    // Extend session object with user ID, role, and status from the JWT
    async session({ session, token }) {
      // The token contains the data added in the jwt callback
      if (token && session.user) {
        session.user.id = token.sub ?? (token.id as string); // Prefer sub if available, fallback to id
        session.user.role = token.role; // Now correctly typed via next-auth.d.ts
        session.user.status = token.status; // Now correctly typed via next-auth.d.ts
        // Add other properties from token to session if needed
      }
      return session;
    },
  },
  // Optional: Add custom event listeners
  // events: {
  //   async signIn(message) { /* Handle successful sign-in */ },
  //   async signOut(message) { /* Handle sign-out */ },
  // },
  // Optional: Configure logging
  // debug: process.env.NODE_ENV === 'development',
});
