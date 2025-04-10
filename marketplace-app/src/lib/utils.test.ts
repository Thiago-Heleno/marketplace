import { describe, it, expect } from "vitest";
import { cn, generateSlug, formatPrice } from "./utils"; // Assuming utils.ts is in the same directory

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", { conditional: true })).toBe("base conditional");
    expect(cn("base", { conditional: false })).toBe("base");
  });

  it("should override conflicting Tailwind classes", () => {
    // Example: p-4 overrides p-2 when merged later
    expect(cn("p-2", "p-4")).toBe("p-4");
    // Example: text-lg overrides text-base
    expect(cn("text-base font-bold", "text-lg")).toBe("font-bold text-lg");
  });

  it("should handle various input types", () => {
    expect(
      cn("a", null, undefined, "b", { c: true, d: false }, ["e", "f"])
    ).toBe("a b c e f");
  });
});

describe("generateSlug utility function", () => {
  it("should convert basic strings to slugs", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("should handle strings with special characters", () => {
    expect(generateSlug("Product Title with $ymbols!")).toBe(
      "product-title-with-ymbols"
    );
  });

  it("should handle multiple spaces and leading/trailing spaces", () => {
    expect(generateSlug("  Extra   Spaces  ")).toBe("extra-spaces");
  });

  it("should handle empty strings", () => {
    expect(generateSlug("")).toBe("");
  });

  it("should handle strings with only special characters", () => {
    expect(generateSlug("!@#$%^&*()")).toBe("");
  });
});

describe("formatPrice utility function", () => {
  it("should format positive integers correctly", () => {
    expect(formatPrice(1999)).toBe("$19.99");
    expect(formatPrice(100)).toBe("$1.00");
    expect(formatPrice(50)).toBe("$0.50");
    expect(formatPrice(123456)).toBe("$1,234.56");
  });

  it("should format zero correctly", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  // Optional: Decide if negative prices are possible/how to handle
  // it('should handle negative integers if necessary', () => {
  //   expect(formatPrice(-500)).toBe('-$5.00');
  // });

  it("should handle large numbers", () => {
    expect(formatPrice(100000000)).toBe("$1,000,000.00");
  });
});
