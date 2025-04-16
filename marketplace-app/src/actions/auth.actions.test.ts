// marketplace-app/src/actions/auth.actions.test.ts

/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { db } from "@/db"; // Keep import for type safety if needed, but value is mocked
import { users, passwordResetTokens, userStatusEnum } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/../auth";
import {
  registerUser,
  signInWithCredentials,
  requestPasswordReset,
  resetPassword,
} from "./auth.actions";
import { AuthError } from "next-auth";
import { resend } from "@/lib/resend";

// --- Mocks ---

// --- Hoisted Mocks (Revised for Chain Assertions) ---
const {
  // Query mocks
  mockUserFindFirst,
  mockTokenFindFirst,
  // Insert chain mocks
  mockDbInsert, // vi.fn() -> insert()
  mockDbInsertValuesFn, // vi.fn() -> insert().values()
  mockDbInsertReturningFn, // vi.fn() -> insert().values().returning() (kept for potential future use)
  // Update chain mocks
  mockDbUpdate, // vi.fn() -> update()
  mockDbUpdateSetFn, // vi.fn() -> update().set()
  mockDbUpdateWhereFn, // vi.fn() -> update().set().where()
  // Delete chain mocks
  mockDbDelete, // vi.fn() -> delete()
  mockDbDeleteWhereFn, // vi.fn() -> delete().where()
} = vi.hoisted(() => {
  const mockUserFindFirst = vi.fn();
  const mockTokenFindFirst = vi.fn();
  const mockDbInsertReturningFn = vi.fn();
  const mockDbInsertValuesFn = vi.fn(() => ({
    returning: mockDbInsertReturningFn,
  })); // Mock .values() to return object with .returning()
  const mockDbInsert = vi.fn(() => ({ values: mockDbInsertValuesFn }));
  const mockDbUpdateWhereFn = vi.fn();
  const mockDbUpdateSetFn = vi.fn(() => ({ where: mockDbUpdateWhereFn }));
  const mockDbUpdate = vi.fn(() => ({ set: mockDbUpdateSetFn }));
  const mockDbDeleteWhereFn = vi.fn();
  const mockDbDelete = vi.fn(() => ({ where: mockDbDeleteWhereFn }));

  return {
    mockUserFindFirst,
    mockTokenFindFirst,
    mockDbInsert,
    mockDbInsertValuesFn,
    mockDbInsertReturningFn,
    mockDbUpdate,
    mockDbUpdateSetFn,
    mockDbUpdateWhereFn,
    mockDbDelete,
    mockDbDeleteWhereFn,
  };
});
const { mockSendEmail } = vi.hoisted(() => ({ mockSendEmail: vi.fn() }));

// --- Mock Modules ---
vi.mock("@/../auth", () => ({ signIn: vi.fn(), auth: vi.fn() }));
vi.mock("@/db", () => {
  const mockedDbObject = {
    insert: mockDbInsert,
    update: mockDbUpdate,
    delete: mockDbDelete,
    query: {
      users: { findFirst: mockUserFindFirst },
      passwordResetTokens: { findFirst: mockTokenFindFirst },
    },
    transaction: vi
      .fn()
      .mockImplementation(async (callback) => await callback(mockedDbObject)),
  };
  return { db: mockedDbObject };
});
vi.mock("bcryptjs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("bcryptjs")>();
  return {
    ...actual,
    hash: vi.fn().mockResolvedValue("mock-hashed-password"),
    compare: vi.fn().mockResolvedValue(true),
    default: {
      hash: vi.fn().mockResolvedValue("mock-hashed-password"),
      compare: vi.fn().mockResolvedValue(true),
    },
  };
});
vi.mock("@/lib/resend", () => ({
  resend: { emails: { send: mockSendEmail } },
}));

// --- Test Suite ---
describe("Authentication Actions (auth.actions.ts)", () => {
  const originalResendApiKey = process.env.RESEND_API_KEY;
  const originalNextAuthUrl = process.env.NEXTAUTH_URL;

  beforeEach(() => {
    vi.resetAllMocks(); // Resets call history and implementations to basic mocks

    // --- Set Default Mock Behaviors (Successful Paths) ---
    vi.mocked(signIn).mockResolvedValue(undefined);
    vi.mocked(mockUserFindFirst).mockResolvedValue(undefined); // Default: User not found
    vi.mocked(mockTokenFindFirst).mockResolvedValue(undefined); // Default: Token not found
    vi.mocked(mockSendEmail).mockResolvedValue({
      data: { id: "mock-email-id" },
      error: null,
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(true);
    vi.mocked(bcrypt.hash).mockResolvedValue("mock-hashed-password");

    // DB Write Operations - Default to resolving successfully
    vi.mocked(mockDbInsertValuesFn).mockClear().mockResolvedValue(undefined); // .values() often returns void promise
    vi.mocked(mockDbInsertReturningFn)
      .mockClear()
      .mockResolvedValue([{ id: "mock-new-user-id" }]); // For chains using .returning()
    vi.mocked(mockDbUpdateSetFn).mockClear(); // Clear intermediate mock
    vi.mocked(mockDbUpdateWhereFn)
      .mockClear()
      .mockResolvedValue([{ id: "mock-updated-id" }]); // .update().set().where() -> returns array
    vi.mocked(mockDbDeleteWhereFn)
      .mockClear()
      .mockResolvedValue([{ id: "deleted-token-id" }]); // .delete().where() -> returns array

    // --- Set Env Vars ---
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  });

  // Restore spies and env vars after each test
  afterEach(() => {
    vi.restoreAllMocks(); // Restore any spies (like console)
    process.env.RESEND_API_KEY = originalResendApiKey;
    process.env.NEXTAUTH_URL = originalNextAuthUrl;
  });

  // --- registerUser Tests ---
  describe("registerUser", () => {
    const validCustomerData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
      role: "CUSTOMER" as const,
    };
    const validVendorData = { ...validCustomerData, role: "VENDOR" as const };

    it("should successfully register a new CUSTOMER with ACTIVE status", async () => {
      // Arrange: User does not exist (default mock behavior)
      const result = await registerUser(validCustomerData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe(
        "Registration successful! You can now log in."
      );
      expect(mockUserFindFirst).toHaveBeenCalledWith({
        where: eq(users.email, validCustomerData.email),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(validCustomerData.password, 10);
      expect(mockDbInsert).toHaveBeenCalledWith(users);
      expect(mockDbInsertValuesFn).toHaveBeenCalledWith(
        expect.objectContaining({
          // Assert on values mock
          email: validCustomerData.email,
          passwordHash: "mock-hashed-password",
          role: "CUSTOMER",
          status: "ACTIVE",
        })
      );
      // No .returning() assertion needed here
    });

    it("should successfully register a new VENDOR with PENDING status", async () => {
      // Arrange: User does not exist (default mock behavior)
      const result = await registerUser(validVendorData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe(
        "Registration successful! Your account requires admin approval."
      );
      expect(mockUserFindFirst).toHaveBeenCalledWith({
        where: eq(users.email, validVendorData.email),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(validVendorData.password, 10);
      expect(mockDbInsert).toHaveBeenCalledWith(users);
      expect(mockDbInsertValuesFn).toHaveBeenCalledWith(
        expect.objectContaining({
          // Assert on values mock
          email: validVendorData.email,
          passwordHash: "mock-hashed-password",
          role: "VENDOR",
          status: "PENDING",
        })
      );
      // No .returning() assertion needed here
    });

    it("should return error if user already exists", async () => {
      // Arrange: User exists
      const mockExistingUser = {
        id: "existing-id",
        email: validCustomerData.email,
        passwordHash: "hash",
        role: "CUSTOMER",
        status: "ACTIVE",
      };
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockExistingUser as any);

      // Act
      const result = await registerUser(validCustomerData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Email already in use.");
      expect(mockDbInsertValuesFn).not.toHaveBeenCalled();
    });

    it("should return validation error for invalid data", async () => {
      // Arrange
      const invalidData = { ...validCustomerData, email: "not-an-email" };
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {}); // Suppress expected console error

      // Act
      const result = await registerUser(invalidData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid registration details.");
      expect(mockDbInsertValuesFn).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled(); // It should log the ZodError

      // Restore spy AFTER assertions
      consoleErrorSpy.mockRestore();
    });

    it("should return error if database insertion fails", async () => {
      // Arrange: User does not exist, but DB insert fails
      vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);
      const dbError = new Error("DB insert failed");
      // Mock the promise returned by .values() to reject
      vi.mocked(mockDbInsertValuesFn).mockRejectedValueOnce(dbError);
      // Spy BEFORE action
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      const result = await registerUser(validCustomerData);

      // Assert BEFORE restore
      expect(result.success).toBe(false); // <-- Should pass now
      expect(result.message).toBe(
        "An unexpected error occurred. Please try again."
      );
      expect(mockDbInsertValuesFn).toHaveBeenCalled(); // values() was called (and rejected)
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error during user registration:",
        dbError
      );

      // Restore AFTER assertions
      consoleErrorSpy.mockRestore();
    });
  });

  // --- signInWithCredentials Tests ---
  describe("signInWithCredentials", () => {
    const validLoginData = {
      email: "test@example.com",
      password: "password123",
    };

    it("should successfully sign in and return redirect path", async () => {
      vi.mocked(signIn).mockResolvedValue(undefined);
      const result = await signInWithCredentials(validLoginData);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Login successful!");
      expect(result.redirectTo).toBe("/dashboard");
      expect(signIn).toHaveBeenCalledWith("credentials", expect.anything());
    });

    it("should return error for invalid credentials via AuthError", async () => {
      // Arrange: Mock NextAuth signIn to reject with CredentialsSignin error
      const credentialsError = new AuthError("CredentialsSignin");
      // explicitly setting type just in case constructor isn't enough in test env
      credentialsError.type = "CredentialsSignin";
      vi.mocked(signIn).mockRejectedValue(credentialsError);
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      const result = await signInWithCredentials(validLoginData);

      // Assert BEFORE restore
      expect(result.success).toBe(false);
      // Assert specific message - this is the crucial check for the switch case
      expect(result.message).toBe("Invalid email or password.");
      expect(signIn).toHaveBeenCalledWith("credentials", expect.anything());
      // Ensure the generic error wasn't logged
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        "Unhandled AuthError during sign in:",
        expect.anything()
      );
      expect(consoleErrorSpy).not.toHaveBeenCalledWith(
        "Unexpected error during sign in:",
        expect.anything()
      );

      // Restore AFTER assertions
      consoleErrorSpy.mockRestore();
    });

    it("should return validation error for invalid input", async () => {
      const invalidData = { email: "not-an-email", password: "123" };
      const result = await signInWithCredentials(invalidData);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid login details.");
      expect(signIn).not.toHaveBeenCalled();
    });

    it("should return generic error for unexpected errors during signIn", async () => {
      // Arrange: Mock NextAuth signIn to reject with a generic error
      const genericError = new Error("Something went wrong");
      vi.mocked(signIn).mockRejectedValue(genericError);
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Act
      const result = await signInWithCredentials(validLoginData);

      // Assert BEFORE restore
      expect(result.success).toBe(false);
      expect(result.message).toBe("An unexpected error occurred.");
      expect(signIn).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Unexpected error during sign in:",
        genericError
      );

      // Restore AFTER assertions
      consoleErrorSpy.mockRestore();
    });
  });

  // --- requestPasswordReset Tests ---
  describe("requestPasswordReset", () => {
    const validEmailData = { email: "test@example.com" };
    const mockUser = {
      id: "user-123",
      email: validEmailData.email,
      firstName: "Test",
    };
    const successMessage =
      "If an account with this email exists, a password reset link has been sent.";

    it("should attempt token generation and email sending if user exists", async () => {
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockUser as any);
      const result = await requestPasswordReset(validEmailData);

      expect(result.success).toBe(true);
      expect(mockDbDeleteWhereFn).toHaveBeenCalledWith(
        eq(passwordResetTokens.userId, mockUser.id)
      );
      expect(mockDbInsertValuesFn).toHaveBeenCalledWith(
        expect.objectContaining({ userId: mockUser.id })
      );
      expect(mockSendEmail).toHaveBeenCalledOnce();
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [validEmailData.email],
          subject: "Reset Your Marketplace Password",
        })
      );
      // No .returning() assertion needed here
    });

    it("should return success without DB/email operations if user does not exist", async () => {
      vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);
      // --- Spy BEFORE action ---
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {});

      const result = await requestPasswordReset(validEmailData);

      // --- Assert BEFORE restore ---
      expect(result.success).toBe(true);
      expect(result.message).toBe(successMessage);
      expect(mockDbDelete).not.toHaveBeenCalled();
      expect(mockDbInsert).not.toHaveBeenCalled();
      expect(mockSendEmail).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Password reset requested for non-existent email"
        )
      );

      // --- Restore AFTER assertions ---
      consoleLogSpy.mockRestore();
    });

    it("should return success even if email sending fails (but logs error)", async () => {
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockUser as any);
      const emailError = { message: "Failed", name: "EmailError" };
      vi.mocked(mockSendEmail).mockResolvedValueOnce({
        data: null,
        error: emailError as any,
      });
      // --- Spy BEFORE action ---
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await requestPasswordReset(validEmailData);

      // --- Assert BEFORE restore ---
      expect(result.success).toBe(true);
      expect(mockDbInsertValuesFn).toHaveBeenCalled();
      expect(mockSendEmail).toHaveBeenCalledOnce();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error sending password reset email:",
        emailError
      );

      // --- Restore AFTER assertion ---
      consoleErrorSpy.mockRestore();
    });

    it("should return success if RESEND_API_KEY is missing (but logs error)", async () => {
      delete process.env.RESEND_API_KEY;
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockUser as any);
      // --- Spy BEFORE action ---
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await requestPasswordReset(validEmailData);

      // --- Assert BEFORE restore ---
      expect(result.success).toBe(true);
      expect(mockDbInsertValuesFn).toHaveBeenCalled();
      expect(mockSendEmail).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Resend API Key not configured")
      );

      // --- Restore AFTER assertion ---
      consoleErrorSpy.mockRestore();
    });

    it("should return validation error for invalid email", async () => {
      const invalidData = { email: "invalid" };
      const result = await requestPasswordReset(invalidData);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email address.");
    });
  });

  // --- resetPassword Tests ---
  describe("resetPassword", () => {
    const validToken = "valid-reset-token";
    const validPasswordData = {
      token: validToken,
      password: "newPassword123",
      confirmPassword: "newPassword123",
    };
    const mockToken = {
      id: "token-id",
      userId: "user-123",
      token: validToken,
      expiresAt: new Date(Date.now() + 3600 * 1000),
    };
    const mockUser = { id: "user-123", email: "test@example.com" };

    it("should successfully reset password with valid token", async () => {
      vi.mocked(mockTokenFindFirst).mockResolvedValue(mockToken as any);
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockUser as any);
      const consoleLogSpy = vi
        .spyOn(console, "log")
        .mockImplementation(() => {}); // Spy on log for success case

      const result = await resetPassword(validPasswordData);

      expect(result.success).toBe(true);
      expect(result.message).toContain("Password has been reset successfully");
      expect(mockTokenFindFirst).toHaveBeenCalledWith({
        where: eq(passwordResetTokens.token, validToken),
      });
      expect(mockUserFindFirst).toHaveBeenCalledWith({
        where: eq(users.id, mockToken.userId),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(validPasswordData.password, 10);
      expect(mockDbUpdateSetFn).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: "mock-hashed-password" })
      );
      expect(mockDbUpdateWhereFn).toHaveBeenCalledWith(
        eq(users.id, mockUser.id)
      );
      expect(mockDbDeleteWhereFn).toHaveBeenCalledWith(
        eq(passwordResetTokens.id, mockToken.id)
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Password reset successfully for user ${mockUser.email}`
        )
      );

      consoleLogSpy.mockRestore(); // Restore after assertions
    });

    it("should return error for invalid token", async () => {
      vi.mocked(mockTokenFindFirst).mockResolvedValue(undefined);
      const result = await resetPassword(validPasswordData);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid or expired reset token.");
    });

    it("should return error for expired token", async () => {
      const expiredToken = {
        ...mockToken,
        expiresAt: new Date(Date.now() - 1000),
      };
      vi.mocked(mockTokenFindFirst).mockResolvedValue(expiredToken as any);
      const result = await resetPassword(validPasswordData);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Reset token has expired.");
      expect(mockDbDeleteWhereFn).toHaveBeenCalledWith(
        eq(passwordResetTokens.id, expiredToken.id)
      );
    });

    it("should return error if user associated with token is not found", async () => {
      vi.mocked(mockTokenFindFirst).mockResolvedValue(mockToken as any);
      vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);
      const result = await resetPassword(validPasswordData);
      expect(result.success).toBe(false);
      expect(result.message).toBe("User not found for this token.");
    });

    it("should return validation error if passwords do not match", async () => {
      const invalidData = {
        ...validPasswordData,
        confirmPassword: "differentPassword",
      };
      const result = await resetPassword(invalidData);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Passwords do not match.");
    });

    it("should return error if database update fails", async () => {
      vi.mocked(mockTokenFindFirst).mockResolvedValue(mockToken as any);
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockUser as any);
      const dbError = new Error("DB update failed");
      vi.mocked(mockDbUpdateWhereFn).mockRejectedValueOnce(dbError);
      // --- Spy BEFORE action ---
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await resetPassword(validPasswordData);

      // --- Assert BEFORE restore ---
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred while resetting the password."
      );
      expect(mockDbUpdateWhereFn).toHaveBeenCalled(); // where() was called (and rejected)
      expect(mockDbDelete).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error resetting password:",
        dbError
      );

      // --- Restore AFTER assertions ---
      consoleErrorSpy.mockRestore();
    });
  });
});
