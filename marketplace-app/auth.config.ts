import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login", // Custom login page path
    // error: '/auth/error', // Optional: Custom error page
    // newUser: '/auth/new-user' // Optional: Redirect new users
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true; // Allow access if logged in
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Optional: Redirect logged-in users from auth pages like /login or /register
        // if (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')) {
        //   return Response.redirect(new URL('/dashboard', nextUrl));
        // }
      }
      // Allow access to all other pages by default
      return true;
    },
    // Add other callbacks like jwt, session as needed later
  },
  providers: [], // Add providers in the main auth.ts file
} satisfies NextAuthConfig;
