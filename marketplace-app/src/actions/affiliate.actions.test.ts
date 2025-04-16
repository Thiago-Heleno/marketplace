// marketplace-app/src/actions/affiliate.actions.test.ts

/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// Removed unused import: import { db } from "@/db";
import {
  affiliateCodes,
  affiliateReferrals,
  withdrawalRequests,
} from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm"; // Removed unused sql
import { auth } from "@/../auth";
import { revalidatePath } from "next/cache";
import {
  getAffiliateCode,
  getAffiliateBalance,
  generateAffiliateCode,
} from "./affiliate.actions";
import { formatPrice } from "@/lib/utils"; // Used in balance calculations

// --- Mocks ---

// --- Hoisted Mocks (Refined Structure) ---
const {
  // Query mocks
  mockAffiliateCodeFindFirst,
  // Select chain mocks
  mockDbSelect,
  // Removed unused mockDbSelectFromFn
  mockDbSelectWhereFn,
  mockDbSelectGroupByFn,
  // Insert chain mocks
  mockDbInsert,
  mockDbInsertValuesFn,
} = vi.hoisted(() => {
  const mockAffiliateCodeFindFirst = vi.fn();
  const mockDbSelectGroupByFn = vi.fn();
  const mockDbSelectWhereFn = vi.fn(() => ({ groupBy: mockDbSelectGroupByFn }));
  // Removed unused mockDbSelectFromFn: const mockDbSelectFromFn = vi.fn(() => ({ where: mockDbSelectWhereFn }));
  const mockDbSelect = vi.fn(() => ({ where: mockDbSelectWhereFn })); // Adjusted mockDbSelect to chain directly to where
  const mockDbInsertValuesFn = vi.fn();
  const mockDbInsert = vi.fn(() => ({ values: mockDbInsertValuesFn }));

  return {
    mockAffiliateCodeFindFirst,
    mockDbSelect,
    // Removed unused mockDbSelectFromFn
    mockDbSelectWhereFn,
    mockDbSelectGroupByFn,
    mockDbInsert,
    mockDbInsertValuesFn,
  };
});

// Mock NextAuth auth function
vi.mock("@/../auth", () => ({
  auth: vi.fn(),
}));

// Mock Drizzle ORM db instance
vi.mock("@/db", () => {
  const mockedDbObject = {
    insert: mockDbInsert,
    select: mockDbSelect, // Add select mock
    query: {
      affiliateCodes: { findFirst: mockAffiliateCodeFindFirst },
    },
    // Mock transaction if it were used
    // transaction: vi.fn().mockImplementation(async (callback) => await callback(mockedDbObject)),
  };
  return {
    db: mockedDbObject,
  };
});

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// --- Test Suite ---
describe("Affiliate Actions (affiliate.actions.ts)", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // --- Default Mock Behaviors ---
    vi.mocked(auth).mockResolvedValue(null); // Default: No session
    vi.mocked(mockAffiliateCodeFindFirst).mockResolvedValue(undefined); // Default: Code not found
    // Default for balance queries: return empty results (zero balance)
    vi.mocked(mockDbSelectGroupByFn).mockResolvedValue([]);

    // Default for DB insert: resolve successfully
    vi.mocked(mockDbInsertValuesFn).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore any spies (like console)
  });

  // --- getAffiliateCode Tests ---
  describe("getAffiliateCode", () => {
    const affiliateUser = {
      user: { id: "affiliate-123", role: "AFFILIATE", status: "ACTIVE" },
    };
    const inactiveAffiliateUser = {
      user: { id: "affiliate-456", role: "AFFILIATE", status: "PENDING" },
    };
    const customerUser = {
      user: { id: "customer-789", role: "CUSTOMER", status: "ACTIVE" },
    };

    it("should return null if user is not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);
      const result = await getAffiliateCode();
      expect(result.code).toBeNull();
    });

    it("should return null if user is not an AFFILIATE", async () => {
      vi.mocked(auth).mockResolvedValue(customerUser as any);
      const result = await getAffiliateCode();
      expect(result.code).toBeNull();
    });

    it("should return null if affiliate user is not ACTIVE", async () => {
      vi.mocked(auth).mockResolvedValue(inactiveAffiliateUser as any);
      const result = await getAffiliateCode();
      expect(result.code).toBeNull();
    });

    it("should return null if an active affiliate has no code", async () => {
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);
      vi.mocked(mockAffiliateCodeFindFirst).mockResolvedValue(undefined);
      const result = await getAffiliateCode();
      expect(result.code).toBeNull();
      expect(mockAffiliateCodeFindFirst).toHaveBeenCalledWith({
        where: and(
          eq(affiliateCodes.userId, affiliateUser.user.id),
          eq(affiliateCodes.isActive, true)
        ),
        columns: { code: true },
      });
    });

    it("should return the code if an active affiliate has an active code", async () => {
      const mockCode = { code: "TESTCODE123" };
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);
      vi.mocked(mockAffiliateCodeFindFirst).mockResolvedValue(mockCode);
      const result = await getAffiliateCode();
      expect(result.code).toBe("TESTCODE123");
      expect(mockAffiliateCodeFindFirst).toHaveBeenCalledWith({
        where: and(
          eq(affiliateCodes.userId, affiliateUser.user.id),
          eq(affiliateCodes.isActive, true)
        ),
        columns: { code: true },
      });
    });

    it("should return null and log error if DB query fails", async () => {
      const dbError = new Error("DB Query Failed");
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);
      vi.mocked(mockAffiliateCodeFindFirst).mockRejectedValue(dbError);
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await getAffiliateCode();

      expect(result.code).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch affiliate code:",
        dbError
      );

      consoleErrorSpy.mockRestore(); // Restore after assertion
    });
  });

  // --- getAffiliateBalance Tests ---
  describe("getAffiliateBalance", () => {
    const affiliateUser = {
      user: { id: "affiliate-123", role: "AFFILIATE", status: "ACTIVE" },
    };
    const defaultZeroBalance = {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: "$0.00",
        pendingBalance: "$0.00",
        pendingWithdrawals: "$0.00",
        totalEarnings: "$0.00",
      },
    };

    it("should return zero balance if user is not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue(null);
      const result = await getAffiliateBalance();
      expect(result).toEqual(defaultZeroBalance);
    });

    it("should return zero balance if user is not an active affiliate", async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { id: "other-user", role: "CUSTOMER", status: "ACTIVE" },
      } as any);
      const result = await getAffiliateBalance();
      expect(result).toEqual(defaultZeroBalance);
    });

    // REMOVED tests related to missing/invalid commission rate ENV VAR as the action doesn't use it.

    it("should calculate balances correctly based on DB data (no commission applied here)", async () => {
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);

      // Mock DB results:
      // Confirmed Referrals Total: 10000 cents
      // Pending Referrals Total: 2000 cents
      // Pending Withdrawals Total: 1500 cents
      vi.mocked(mockDbSelectGroupByFn)
        .mockResolvedValueOnce([{ total: "10000" }]) // Confirmed earnings query (affiliateReferrals status = 'CONFIRMED')
        .mockResolvedValueOnce([{ total: "2000" }]) // Pending earnings query (affiliateReferrals status = 'PENDING')
        .mockResolvedValueOnce([{ total: "1500" }]); // Pending withdrawals query (withdrawalRequests status = 'PENDING' or 'APPROVED')

      const result = await getAffiliateBalance();

      // Calculations based on DIRECT sums from DB:
      expect(result.totalEarnings).toBe(10000);
      expect(result.pendingBalance).toBe(2000);
      expect(result.pendingWithdrawals).toBe(1500);
      expect(result.availableBalance).toBe(8500); // 10000 - 1500
      expect(result.formatted.totalEarnings).toBe(formatPrice(10000));
      expect(result.formatted.pendingBalance).toBe(formatPrice(2000));
      expect(result.formatted.pendingWithdrawals).toBe(formatPrice(1500));
      expect(result.formatted.availableBalance).toBe(formatPrice(8500));

      // Check if correct queries were made
      expect(mockDbSelect).toHaveBeenCalledTimes(3);
      // Check filters for confirmed earnings (affiliateReferrals)
      expect(mockDbSelectWhereFn).toHaveBeenCalledWith(
        and(
          eq(affiliateReferrals.affiliateUserId, affiliateUser.user.id),
          eq(affiliateReferrals.status, "CONFIRMED")
        )
      );
      // Check filters for pending earnings (affiliateReferrals)
      expect(mockDbSelectWhereFn).toHaveBeenCalledWith(
        and(
          eq(affiliateReferrals.affiliateUserId, affiliateUser.user.id),
          eq(affiliateReferrals.status, "PENDING")
        )
      );
      // Check filters for pending withdrawals (withdrawalRequests)
      expect(mockDbSelectWhereFn).toHaveBeenCalledWith(
        and(
          eq(withdrawalRequests.userId, affiliateUser.user.id),
          inArray(withdrawalRequests.status, ["PENDING", "APPROVED"])
        )
      );
    });

    it("should return zero balance and log error if a DB query fails", async () => {
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);
      const dbError = new Error("DB Select Failed");
      vi.mocked(mockDbSelectGroupByFn).mockRejectedValueOnce(dbError); // Make the first query fail
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await getAffiliateBalance();

      expect(result).toEqual(defaultZeroBalance);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to calculate affiliate balance:",
        dbError
      );

      consoleErrorSpy.mockRestore();
    });
  }); // End describe getAffiliateBalance

  // --- generateAffiliateCode (Server Action) Tests ---
  describe("generateAffiliateCode (Server Action)", () => {
    const affiliateUser = {
      user: { id: "affiliate-123", role: "AFFILIATE", status: "ACTIVE" },
    };
    const existingCode = {
      id: "code-abc",
      userId: affiliateUser.user.id,
      code: "EXISTING",
      isActive: true,
    };

    it("should return error if user is not an active affiliate", async () => {
      vi.mocked(auth).mockResolvedValue({
        user: { id: "other", role: "CUSTOMER", status: "ACTIVE" },
      } as any);
      const result = await generateAffiliateCode();
      expect(result.success).toBe(false);
      expect(result.error).toContain("Unauthorized or inactive affiliate");
    });

    it("should return error and existing code if user already has an active code", async () => {
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);
      vi.mocked(mockAffiliateCodeFindFirst).mockResolvedValue(existingCode); // User has code

      const result = await generateAffiliateCode();

      expect(result.success).toBe(false);
      expect(result.error).toBe("You already have an active affiliate code.");
      expect(result.code).toBe(existingCode.code);
      expect(mockDbInsertValuesFn).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should generate, insert, and return a new code if none exists", async () => {
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);
      vi.mocked(mockAffiliateCodeFindFirst).mockResolvedValue(undefined); // No existing code
      // Mock insert to succeed (default behavior)
      // Mock revalidatePath to succeed (default behavior)

      const result = await generateAffiliateCode();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Affiliate code generated successfully!");
      expect(result.code).toBeDefined();
      expect(result.code).toHaveLength(8);
      expect(result.code).toMatch(/^[A-Z0-9]+$/);

      expect(mockAffiliateCodeFindFirst).toHaveBeenCalledTimes(2); // Initial check + uniqueness check
      expect(mockDbInsert).toHaveBeenCalledWith(affiliateCodes);
      expect(mockDbInsertValuesFn).toHaveBeenCalledWith({
        userId: affiliateUser.user.id,
        code: result.code,
        isActive: true,
      });
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/affiliate");
    });

    // Test for uniqueness loop failure (optional, simpler to skip unless crucial)
    // it("should return error if unique code generation fails repeatedly", async () => { ... });

    it("should return error if database insertion fails", async () => {
      vi.mocked(auth).mockResolvedValue(affiliateUser as any);
      vi.mocked(mockAffiliateCodeFindFirst).mockResolvedValue(undefined); // No existing code
      const dbError = new Error("Insert failed");
      vi.mocked(mockDbInsertValuesFn).mockRejectedValueOnce(dbError); // Mock insert failure
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await generateAffiliateCode();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Database error: Failed to generate code.");
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to generate affiliate code:",
        dbError
      );

      consoleErrorSpy.mockRestore();
    });
  }); // End describe generateAffiliateCode
}); // End main describe block
