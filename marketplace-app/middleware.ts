import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextAuthConfig } from "next-auth";

// Initialize NextAuth with the shared configuration
const { auth } = NextAuth(authConfig as NextAuthConfig);

// --- Custom In-Memory Rate Limiter ---
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 1000; // 10 seconds
const RATE_LIMIT_MAX_REQUESTS = 10;

function isRateLimited(ip: string): { limited: boolean; resetTime?: number } {
  const now = Date.now();
  const timestamps = requestTimestamps.get(ip) ?? [];

  // Filter out timestamps older than the window
  const recentTimestamps = timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    // Limit exceeded
    requestTimestamps.set(ip, recentTimestamps); // Keep the recent timestamps
    const resetTime = (recentTimestamps[0] ?? now) + RATE_LIMIT_WINDOW_MS; // Estimate reset time
    return { limited: true, resetTime };
  } else {
    // Limit not exceeded
    recentTimestamps.push(now);
    requestTimestamps.set(ip, recentTimestamps);
    return { limited: false };
  }
}
// Optional: Add cleanup mechanism here if needed

// Combined Middleware Function wrapped by NextAuth's auth handler
export default auth(async (request: NextRequest) => {
  // --- Rate Limiting ---
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { limited, resetTime } = isRateLimited(ip);

  if (limited) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    const headers: Record<string, string> = {};
    if (resetTime) {
      headers["Retry-After"] = Math.ceil(
        (resetTime - Date.now()) / 1000
      ).toString(); // Seconds until reset
      headers["X-RateLimit-Reset"] = new Date(resetTime).toISOString();
    }
    return new NextResponse("Too Many Requests", { status: 429, headers });
  }

  // --- Authentication (handled by `auth()` wrapper) ---
  // If rate limit check passes, return undefined to let the `auth()` wrapper
  // proceed with its authentication logic based on `authConfig`.
  return undefined;
});

// Define which routes the middleware should apply to
export const config = {
  // Matcher updated to include API routes but exclude specific ones like Stripe webhook
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks/stripe).*)",
  ],
  // Explanation of matcher:
  // - `^`: Start of the string
  // - `/`: Match the root path
  // - `(`: Start of a group
  // - `?!`: Negative lookahead (ensure the following pattern doesn't match)
  //   - `api`: Matches `/api`
  //   - `|`: OR
  //   - `_next/static`: Matches Next.js static files
  //   - `|`: OR
  //   - `_next/image`: Matches Next.js image optimization files
  //   - `|`: OR
  //   - `favicon.ico`: Matches the favicon file
  //   - `|`: OR
  //   - `login`: Matches `/login`
  //   - `|`: OR
  //   - `register`: Matches `/register`
  // - `)`: End of the negative lookahead group
  // - `.*`: Match any character (except newline) zero or more times
  // - `)`: End of the main group
  // This effectively matches all routes EXCEPT the ones specified in the negative lookahead.
  // The `authorized` callback in auth.config.ts then specifically checks if the matched route
  // starts with `/dashboard` and if the user is logged in.
};
