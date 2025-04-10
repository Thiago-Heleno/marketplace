"use server";

// import { z } from "zod"; // Removed unused import
import { auth } from "../../auth";
import { db } from "@/db";
import {
  affiliateCodes,
  affiliateReferrals,
  withdrawalRequests,
} from "@/db/schema"; // Added schemas
import { eq, and, sql, inArray } from "drizzle-orm"; // Removed sum, Added sql, inArray
import { revalidatePath } from "next/cache";
import { formatPrice } from "@/lib/utils"; // Added formatPrice

// Helper to generate a random alphanumeric code
function generateCode(length = 8): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

interface AffiliateCodeResult {
  success: boolean;
  code?: string;
  message?: string;
  error?: string;
}

// --- Get Affiliate Code ---
export async function getAffiliateCode(): Promise<{ code: string | null }> {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "AFFILIATE" ||
    session.user.status !== "ACTIVE"
  ) {
    // Return null or throw error if not an active affiliate
    return { code: null };
  }
  const userId = session.user.id;

  try {
    const existingCode = await db.query.affiliateCodes.findFirst({
      where: and(
        eq(affiliateCodes.userId, userId),
        eq(affiliateCodes.isActive, true) // Only fetch active codes
      ),
      columns: { code: true },
    });
    return { code: existingCode?.code || null };
  } catch (error) {
    console.error("Failed to fetch affiliate code:", error);
    return { code: null }; // Return null on error
  }
}

// --- Get Affiliate Balance ---

export async function getAffiliateBalance() {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "AFFILIATE" ||
    session.user.status !== "ACTIVE"
  ) {
    // Return zero balance if not an active affiliate
    return {
      availableBalance: 0,
      pendingBalance: 0, // Commissions from referrals not yet confirmed
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
  const affiliateId = session.user.id;

  try {
    // 1. Calculate total confirmed earnings
    const confirmedEarningsResult = await db
      .select({
        total: sql<string>`coalesce(sum(${affiliateReferrals.commissionEarnedInCents}::integer), 0)::text`,
      })
      .from(affiliateReferrals)
      .where(
        and(
          eq(affiliateReferrals.affiliateUserId, affiliateId),
          eq(affiliateReferrals.status, "CONFIRMED") // Only confirmed commissions
        )
      )
      .groupBy(affiliateReferrals.affiliateUserId);

    const totalEarningsNet = parseInt(confirmedEarningsResult[0]?.total || "0");

    // 2. Calculate pending commissions (for info)
    const pendingEarningsResult = await db
      .select({
        total: sql<string>`coalesce(sum(${affiliateReferrals.commissionEarnedInCents}::integer), 0)::text`,
      })
      .from(affiliateReferrals)
      .where(
        and(
          eq(affiliateReferrals.affiliateUserId, affiliateId),
          eq(affiliateReferrals.status, "PENDING") // Only pending commissions
        )
      )
      .groupBy(affiliateReferrals.affiliateUserId);

    const pendingBalance = parseInt(pendingEarningsResult[0]?.total || "0");

    // 3. Calculate total amount from pending/approved withdrawal requests
    const withdrawalsResult = await db
      .select({
        total: sql<string>`coalesce(sum(${withdrawalRequests.amountInCents}::integer), 0)::text`,
      })
      .from(withdrawalRequests)
      .where(
        and(
          eq(withdrawalRequests.userId, affiliateId), // Match the affiliate user ID
          inArray(withdrawalRequests.status, ["PENDING", "APPROVED"])
        )
      )
      .groupBy(withdrawalRequests.userId);

    const pendingWithdrawals = parseInt(withdrawalsResult[0]?.total || "0");

    // 4. Calculate available balance
    const availableBalance = totalEarningsNet - pendingWithdrawals;

    return {
      availableBalance: availableBalance,
      pendingBalance: pendingBalance,
      pendingWithdrawals: pendingWithdrawals,
      totalEarnings: totalEarningsNet,
      formatted: {
        availableBalance: formatPrice(availableBalance),
        pendingBalance: formatPrice(pendingBalance),
        pendingWithdrawals: formatPrice(pendingWithdrawals),
        totalEarnings: formatPrice(totalEarningsNet),
      },
    };
  } catch (error) {
    console.error("Failed to calculate affiliate balance:", error);
    // Return zero balance on error
    return {
      availableBalance: 0,
      pendingBalance: 0,
      pendingWithdrawals: 0,
      totalEarnings: 0,
      formatted: {
        availableBalance: formatPrice(0),
        pendingBalance: formatPrice(0),
        pendingWithdrawals: formatPrice(0),
        totalEarnings: formatPrice(0),
      },
    };
  }
}

// --- Generate Affiliate Code ---
export async function generateAffiliateCode(): Promise<AffiliateCodeResult> {
  const session = await auth();
  if (
    !session?.user?.id ||
    session.user.role !== "AFFILIATE" ||
    session.user.status !== "ACTIVE"
  ) {
    return { success: false, error: "Unauthorized or inactive affiliate." };
  }
  const userId = session.user.id;

  try {
    // 1. Check if user already has an active code
    const existingCode = await db.query.affiliateCodes.findFirst({
      where: and(
        eq(affiliateCodes.userId, userId),
        eq(affiliateCodes.isActive, true)
      ),
    });

    if (existingCode) {
      return {
        success: false,
        error: "You already have an active affiliate code.",
        code: existingCode.code, // Return existing code for reference
      };
    }

    // 2. Generate a unique code
    let newCode = "";
    let attempts = 0;
    const maxAttempts = 10; // Prevent infinite loop

    while (attempts < maxAttempts) {
      newCode = generateCode();
      const codeCheck = await db.query.affiliateCodes.findFirst({
        where: eq(affiliateCodes.code, newCode),
        columns: { id: true }, // Only need to check existence
      });
      if (!codeCheck) {
        break; // Unique code found
      }
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.error(
        "Failed to generate a unique affiliate code after multiple attempts."
      );
      return {
        success: false,
        error: "Could not generate a unique code. Please try again later.",
      };
    }

    // 3. Insert the new code
    await db.insert(affiliateCodes).values({
      userId: userId,
      code: newCode,
      isActive: true,
    });

    revalidatePath("/dashboard/affiliate"); // Revalidate the affiliate dashboard

    return {
      success: true,
      code: newCode,
      message: "Affiliate code generated successfully!",
    };
  } catch (error) {
    console.error("Failed to generate affiliate code:", error);
    return {
      success: false,
      error: "Database error: Failed to generate code.",
    };
  }
}
