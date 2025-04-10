import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug from a string.
 * @param str The string to slugify.
 * @returns The slugified string.
 */
export function generateSlug(str: string): string {
  if (!str) return ""; // Handle empty or null input

  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove invalid chars (keep spaces and hyphens)
    .trim() // Trim leading/trailing whitespace (including spaces converted from invalid chars)
    .replace(/\s+/g, "-") // Replace sequences of spaces with a single hyphen
    .replace(/-+/g, "-"); // Replace sequences of hyphens with a single hyphen
}

/**
 * Formats a price in cents into a currency string (e.g., $10.50).
 * Assumes USD for simplicity, adjust locale and currency as needed.
 * @param priceInCents The price in cents.
 * @returns The formatted price string.
 */
export function formatPrice(priceInCents: number): string {
  const priceInDollars = priceInCents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInDollars);
}
