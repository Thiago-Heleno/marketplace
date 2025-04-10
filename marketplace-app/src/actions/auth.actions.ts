"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import crypto from "crypto"; // For token generation

import { db } from "@/db";
import {
  users,
  userRoleEnum,
  userStatusEnum,
  passwordResetTokens,
} from "@/db/schema"; // Added passwordResetTokens
import {
  LoginSchema,
  RegisterSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema, // Import ResetPasswordSchema
} from "@/lib/schemas/auth.schema";
import { signIn } from "@/../auth"; // Import signIn from auth.ts
import { resend } from "@/lib/resend"; // Import resend client

// Define a more specific schema for the action input, including role
const RegisterActionSchema = RegisterSchema.extend({
  role: z.enum(userRoleEnum.enumValues), // Expect role to be passed to the action
});

interface ActionResult {
  success: boolean;
  message: string;
}

export async function registerUser(
  values: z.infer<typeof RegisterActionSchema>
): Promise<ActionResult> {
  // 1. Validate input using the extended schema
  const validatedFields = RegisterActionSchema.safeParse(values);
  if (!validatedFields.success) {
    console.error("Registration validation failed:", validatedFields.error);
    return { success: false, message: "Invalid registration details." };
  }

  const { firstName, lastName, email, password, role } = validatedFields.data;

  try {
    // 2. Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { success: false, message: "Email already in use." };
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10); // Salt rounds = 10

    // 4. Determine initial status based on role
    const initialStatus =
      role === userRoleEnum.enumValues[0] // 'CUSTOMER'
        ? userStatusEnum.enumValues[1] // 'ACTIVE'
        : userStatusEnum.enumValues[0]; // 'PENDING' for VENDOR, AFFILIATE, ADMIN

    // 5. Create user in database
    await db.insert(users).values({
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      status: initialStatus,
      // id, createdAt, updatedAt will use defaults
    });

    console.log(`User registered successfully: ${email}, Role: ${role}`);
    return {
      success: true,
      message:
        initialStatus === "PENDING"
          ? "Registration successful! Your account requires admin approval."
          : "Registration successful! You can now log in.",
    };
  } catch (error) {
    console.error("Error during user registration:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// --- Sign In Action ---

interface SignInResult {
  success: boolean;
  message: string;
  redirectTo?: string; // Optional redirect path on success
}

export async function signInWithCredentials(
  values: z.infer<typeof LoginSchema>
): Promise<SignInResult> {
  // 1. Validate input
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid login details." };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Attempt sign in using NextAuth's signIn function
    // This will internally call the `authorize` function in auth.ts
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent automatic redirect, handle it manually
    });

    // If signIn doesn't throw, it means authentication was successful
    // (or handled by the authorize callback returning null/user)
    // Note: We might not reach here if authorize throws or returns null early
    // depending on NextAuth version behavior. The error handling below is crucial.

    // Since redirect is false, we return success. The page component can handle redirect.
    return {
      success: true,
      message: "Login successful!",
      redirectTo: "/dashboard",
    };
  } catch (error) {
    // Handle specific NextAuth errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Invalid email or password." };
        case "CallbackRouteError":
          // This might indicate an issue within the authorize callback itself
          console.error("CallbackRouteError during sign in:", error.cause);
          return { success: false, message: "Login failed. Please try again." };
        default:
          console.error("Unhandled AuthError during sign in:", error);
          return {
            success: false,
            message: "An authentication error occurred.",
          };
      }
    }

    // Handle other potential errors
    console.error("Unexpected error during sign in:", error);
    // IMPORTANT: Do NOT re-throw the error here if you want the Server Action
    // to return a structured response to the client. Throwing will cause an
    // unhandled server error.
    return { success: false, message: "An unexpected error occurred." };
  }
}

// --- Password Reset Actions ---

export async function requestPasswordReset(
  values: z.infer<typeof ForgotPasswordSchema> // Use imported schema
): Promise<ActionResult> {
  // 1. Validate email
  const validatedFields = ForgotPasswordSchema.safeParse(values); // Use imported schema
  if (!validatedFields.success) {
    return { success: false, message: "Invalid email address." };
  }
  const { email } = validatedFields.data;

  try {
    // 2. Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // 3. If user doesn't exist, return success to prevent email enumeration
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    }

    // 4. Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

    // 5. Store token in database
    // Consider deleting previous tokens for the same user here
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token: token,
      expiresAt: expiresAt,
    });

    // 6. Construct reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // 7. Send email using Resend
    // TODO: Create a proper email template later (Task 1.4.4)
    const emailHtml = `<p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a><p>This link will expire in 1 hour.</p>`;

    // Ensure RESEND_API_KEY is available before attempting to send
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "Resend API Key not configured. Cannot send password reset email."
      );
      // Return success to the user, but log the error server-side
      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    }

    const { data, error: emailError } = await resend.emails.send({
      from: "Marketplace <noreply@yourdomain.com>", // Replace with your verified sender domain
      to: [email],
      subject: "Reset Your Marketplace Password",
      html: emailHtml,
    });

    if (emailError) {
      console.error("Error sending password reset email:", emailError);
      // Even if email fails, return success to prevent enumeration
      return {
        success: true,
        message:
          "If an account with this email exists, a password reset link has been sent.",
      };
    }

    console.log(
      `Password reset email sent successfully to ${email}. ID: ${data?.id}`
    );
    return {
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    // Generic success message even on internal errors to prevent enumeration
    return {
      success: true,
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  }
}

export async function resetPassword(
  values: z.infer<typeof ResetPasswordSchema> // Use imported schema
): Promise<ActionResult> {
  // 1. Validate input
  const validatedFields = ResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    // Combine multiple error messages if necessary, or take the first one
    const firstError =
      validatedFields.error.errors[0]?.message || "Invalid input.";
    return { success: false, message: firstError };
  }

  const { token, password } = validatedFields.data;

  try {
    // 2. Find the token in the database
    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    // 3. Check if token exists and hasn't expired
    if (!existingToken) {
      return { success: false, message: "Invalid or expired reset token." };
    }

    const now = new Date();
    if (existingToken.expiresAt < now) {
      // Optionally delete expired token
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
      return { success: false, message: "Reset token has expired." };
    }

    // 4. Find the associated user
    const user = await db.query.users.findFirst({
      where: eq(users.id, existingToken.userId),
    });

    if (!user) {
      // Should not happen if token exists, but good to check
      return { success: false, message: "User not found for this token." };
    }

    // 5. Hash the new password
    const newPasswordHash = await bcrypt.hash(password, 10);

    // 6. Update user's password hash
    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    // 7. Delete the used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));

    console.log(`Password reset successfully for user ${user.email}`);
    return {
      success: true,
      message:
        "Password has been reset successfully. You can now log in with your new password.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return {
      success: false,
      message: "An unexpected error occurred while resetting the password.",
    };
  }
}
