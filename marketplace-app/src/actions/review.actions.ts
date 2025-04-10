"use server";

import { z } from "zod";
import { auth } from "../../auth";
import { db } from "@/db";
import { reviews, questionAnswers } from "@/db/schema"; // Removed unused 'products'
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Submit Review Action ---

export const SubmitReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID."),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5."),
  comment: z.string().optional(),
});

interface SubmitReviewResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitReview(
  formData: z.infer<typeof SubmitReviewSchema>
): Promise<SubmitReviewResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized. Please log in to submit a review.",
    };
  }
  const userId = session.user.id;

  const validatedFields = SubmitReviewSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid review data." };
  }
  const { productId, rating, comment } = validatedFields.data;

  try {
    // TODO: Check if user has purchased this product before allowing review?
    // This requires checking the orders/orderItems table. Skipping for V1 simplicity.

    // Check if user already reviewed this product
    const existingReview = await db.query.reviews.findFirst({
      where: and(eq(reviews.productId, productId), eq(reviews.userId, userId)),
    });

    if (existingReview) {
      return {
        success: false,
        error: "You have already reviewed this product.",
      };
    }

    // Insert new review
    await db.insert(reviews).values({
      productId,
      userId,
      rating,
      comment: comment || null, // Store null if comment is empty
    });

    revalidatePath(`/products/${productId}`); // Revalidate product page

    return { success: true, message: "Review submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return {
      success: false,
      error: "Database error: Failed to submit review.",
    };
  }
}

// --- Submit Question Action ---

export const SubmitQuestionSchema = z.object({
  productId: z.string().uuid("Invalid product ID."),
  question: z.string().min(5, "Question must be at least 5 characters long."),
});

interface SubmitQuestionResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitQuestion(
  formData: z.infer<typeof SubmitQuestionSchema>
): Promise<SubmitQuestionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized. Please log in to ask a question.",
    };
  }
  const userId = session.user.id;

  const validatedFields = SubmitQuestionSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid question data." };
  }
  const { productId, question } = validatedFields.data;

  try {
    // Insert new question
    await db.insert(questionAnswers).values({
      productId,
      userId,
      question,
    });

    revalidatePath(`/products/${productId}`); // Revalidate product page

    return { success: true, message: "Question submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit question:", error);
    return {
      success: false,
      error: "Database error: Failed to submit question.",
    };
  }
}

// --- Submit Answer Action ---

export const SubmitAnswerSchema = z.object({
  questionId: z.string().uuid("Invalid question ID."),
  answer: z.string().min(1, "Answer cannot be empty."),
});

interface SubmitAnswerResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function submitAnswer(
  formData: z.infer<typeof SubmitAnswerSchema>
): Promise<SubmitAnswerResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized." };
  }
  const userId = session.user.id;
  const userRole = session.user.role;

  const validatedFields = SubmitAnswerSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { success: false, error: "Invalid answer data." };
  }
  const { questionId, answer } = validatedFields.data;

  try {
    // Fetch the question to verify ownership (if vendor) or admin role
    const questionData = await db.query.questionAnswers.findFirst({
      where: eq(questionAnswers.id, questionId),
      columns: { id: true, productId: true },
      with: {
        product: { columns: { vendorId: true } },
      },
    });

    if (!questionData) {
      return { success: false, error: "Question not found." };
    }

    // Authorization check: Must be ADMIN or the VENDOR who owns the product
    const isVendorOwner =
      userRole === "VENDOR" && questionData.product?.vendorId === userId;
    if (userRole !== "ADMIN" && !isVendorOwner) {
      return { success: false, error: "Unauthorized to answer this question." };
    }

    // Update the question with the answer
    await db
      .update(questionAnswers)
      .set({
        answer: answer,
        answeredByUserId: userId,
        answeredAt: new Date(),
      })
      .where(eq(questionAnswers.id, questionId));

    revalidatePath(`/products/${questionData.productId}`); // Revalidate product page

    return { success: true, message: "Answer submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit answer:", error);
    return {
      success: false,
      error: "Database error: Failed to submit answer.",
    };
  }
}
