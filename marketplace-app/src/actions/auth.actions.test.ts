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

// --- Revised Hoisted Mocks ---
// Expose intermediate and final mock functions for better control
const {
  // Query mocks
  mockUserFindFirst,
  mockTokenFindFirst,
  // Insert chain mocks
  mockDbInsert, // vi.fn() -> insert()
  mockDbInsertValuesFn, // vi.fn() -> insert().values()
  mockDbInsertReturningFn, // vi.fn() -> insert().values().returning()
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
  }));
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

// Hoist mock for Resend send method
const { mockSendEmail } = vi.hoisted(() => {
  return { mockSendEmail: vi.fn() };
});

// Mock NextAuth functions
vi.mock("@/../auth", () => ({
  signIn: vi.fn(),
  auth: vi.fn(),
}));

// Mock Drizzle ORM db instance
vi.mock("@/db", () => {
  const mockedDbObject = {
    insert: mockDbInsert,
    update: mockDbUpdate,
    delete: mockDbDelete,
    query: {
      users: { findFirst: mockUserFindFirst },
      passwordResetTokens: { findFirst: mockTokenFindFirst },
    },
    transaction: vi.fn().mockImplementation(async (callback) => {
      // Pass the mockedDbObject itself to the callback
      return await callback(mockedDbObject);
    }),
  };
  return {
    db: mockedDbObject,
  };
});

// Mock bcryptjs
vi.mock("bcryptjs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("bcryptjs")>();
  return {
    ...actual,
    hash: vi.fn().mockResolvedValue("mock-hashed-password"),
    compare: vi.fn().mockResolvedValue(true),
    default: {
      // Ensure default is also mocked if used like `import bcrypt from 'bcryptjs'`
      hash: vi.fn().mockResolvedValue("mock-hashed-password"),
      compare: vi.fn().mockResolvedValue(true),
    },
  };
});

// Mock Resend
vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: mockSendEmail,
    },
  },
}));

// --- Test Suite ---

describe("Authentication Actions (auth.actions.ts)", () => {
  const originalResendApiKey = process.env.RESEND_API_KEY;
  const originalNextAuthUrl = process.env.NEXTAUTH_URL;

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    // Reset specific mock implementations/return values
    vi.mocked(signIn).mockResolvedValue(undefined);
    vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);
    vi.mocked(mockTokenFindFirst).mockResolvedValue(undefined);
    vi.mocked(mockSendEmail).mockResolvedValue({
      data: { id: "mock-email-id" },
      error: null,
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(true);
    vi.mocked(bcrypt.hash).mockResolvedValue("mock-hashed-password"); // Ensure hash mock is reset too
    // Reset DB chain mocks
    vi.mocked(mockDbInsertReturningFn).mockResolvedValue([
      { id: "mock-new-user-id" },
    ]);
    vi.mocked(mockDbUpdateWhereFn).mockResolvedValue([
      { id: "mock-updated-id" },
    ]);
    vi.mocked(mockDbDeleteWhereFn).mockResolvedValue([
      { id: "deleted-token-id" },
    ]);

    // Set default required environment variables
    process.env.RESEND_API_KEY = "test-resend-key";
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  });

  afterEach(() => {
    // Restore original environment variables
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
      // Arrange: User does not exist
      vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);

      const result = await registerUser(validCustomerData);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        "Registration successful! You can now log in."
      );
      expect(mockUserFindFirst).toHaveBeenCalledWith({
        where: eq(users.email, validCustomerData.email),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(validCustomerData.password, 10);
      expect(mockDbInsert).toHaveBeenCalledWith(users);
      // --- Assert on the correct mock ---
      expect(mockDbInsertValuesFn).toHaveBeenCalledWith(
        expect.objectContaining({
          // <-- Assert on values mock
          email: validCustomerData.email,
          passwordHash: "mock-hashed-password",
          role: "CUSTOMER",
          status: "ACTIVE",
        })
      );
      expect(mockDbInsertReturningFn).toHaveBeenCalled(); // Ensure returning was called
    });

    it("should successfully register a new VENDOR with PENDING status", async () => {
      // Arrange: User does not exist
      vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);

      const result = await registerUser(validVendorData);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        "Registration successful! Your account requires admin approval."
      );
      expect(mockUserFindFirst).toHaveBeenCalledWith({
        where: eq(users.email, validVendorData.email),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(validVendorData.password, 10);
      expect(mockDbInsert).toHaveBeenCalledWith(users);
      // --- Assert on the correct mock ---
      expect(mockDbInsertValuesFn).toHaveBeenCalledWith(
        expect.objectContaining({
          // <-- Assert on values mock
          email: validVendorData.email,
          passwordHash: "mock-hashed-password",
          role: "VENDOR",
          status: "PENDING",
        })
      );
      expect(mockDbInsertReturningFn).toHaveBeenCalled(); // Ensure returning was called
    });

    it("should return error if user already exists", async () => {
      const mockExistingUser = {
        id: "existing-id",
        email: validCustomerData.email,
        passwordHash: "hash",
        role: "CUSTOMER",
        status: "ACTIVE",
      };
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockExistingUser as any);

      const result = await registerUser(validCustomerData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email already in use.");
      expect(mockDbInsert).not.toHaveBeenCalled();
    });

    it("should return validation error for invalid data", async () => {
      const invalidData = { ...validCustomerData, email: "not-an-email" };
      // Suppress console error for expected validation failure
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const result = await registerUser(invalidData);
      consoleErrorSpy.mockRestore(); // Restore console.error

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid registration details.");
      expect(mockDbInsert).not.toHaveBeenCalled();
    });

    it("should return error if database insertion fails", async () => {
      // Arrange: User does not exist, but DB insert fails
      vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);
      const dbError = new Error("DB insert failed");
      // --- Mock the final step to reject ---
      vi.mocked(mockDbInsertReturningFn).mockRejectedValueOnce(dbError); // <-- Mock returning to reject
      // Suppress console error for expected DB failure
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await registerUser(validCustomerData);

      consoleErrorSpy.mockRestore(); // Restore console.error

      expect(result.success).toBe(false); // <-- Assertion should now pass
      expect(result.message).toBe(
        "An unexpected error occurred. Please try again."
      );
      expect(mockUserFindFirst).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockDbInsert).toHaveBeenCalledWith(users);
      expect(mockDbInsertValuesFn).toHaveBeenCalled(); // values() should have been called
      expect(mockDbInsertReturningFn).toHaveBeenCalled(); // returning() should have been called (and rejected)
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
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: validLoginData.email,
        password: validLoginData.password,
        redirect: false,
      });
    });

    it("should return error for invalid credentials via AuthError", async () => {
      const credentialsError = new AuthError("CredentialsSignin");
      vi.mocked(signIn).mockRejectedValue(credentialsError);
      // Suppress console error for expected AuthError
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await signInWithCredentials(validLoginData);

      consoleErrorSpy.mockRestore(); // Restore console.error

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email or password."); // <-- Assertion should now pass
      expect(signIn).toHaveBeenCalledWith("credentials", expect.anything());
    });

    it("should return validation error for invalid input", async () => {
      const invalidData = { email: "not-an-email", password: "123" };
      const result = await signInWithCredentials(invalidData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid login details.");
      expect(signIn).not.toHaveBeenCalled();
    });

    it("should return generic error for unexpected errors during signIn", async () => {
      const genericError = new Error("Something went wrong");
      vi.mocked(signIn).mockRejectedValue(genericError);
      // Suppress console error for expected generic error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await signInWithCredentials(validLoginData);

      consoleErrorSpy.mockRestore(); // Restore console.error

      expect(result.success).toBe(false);
      expect(result.message).toBe("An unexpected error occurred.");
      expect(signIn).toHaveBeenCalled();
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
      // Ensure delete mock resolves (default in beforeEach is fine)
      // Ensure insert mock resolves (default in beforeEach is fine)
      // Ensure email mock resolves (default in beforeEach is fine)

      const result = await requestPasswordReset(validEmailData);

      expect(result.success).toBe(true);
      expect(result.message).toBe(successMessage);
      expect(mockDbDelete).toHaveBeenCalledWith(passwordResetTokens);
      expect(mockDbDeleteWhereFn).toHaveBeenCalledWith(
        eq(passwordResetTokens.userId, mockUser.id)
      );
      expect(mockDbInsert).toHaveBeenCalledWith(passwordResetTokens);
      // --- Assert on the correct mock ---
      expect(mockDbInsertValuesFn).toHaveBeenCalledWith(
        expect.objectContaining({
          // <-- Assert on values mock
          userId: mockUser.id,
          token: expect.any(String),
          expiresAt: expect.any(Date),
        })
      );
      expect(mockDbInsertReturningFn).toHaveBeenCalled(); // Ensure returning was called (even if result unused)
      expect(mockSendEmail).toHaveBeenCalledOnce();
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [validEmailData.email],
          subject: "Reset Your Marketplace Password",
          html: expect.stringContaining(
            "http://localhost:3000/reset-password?token="
          ),
        })
      );
    });

    it("should return success without DB/email operations if user does not exist", async () => {
      vi.mocked(mockUserFindFirst).mockResolvedValue(undefined);

      const result = await requestPasswordReset(validEmailData);

      expect(result.success).toBe(true);
      expect(result.message).toBe(successMessage);
      expect(mockDbDelete).not.toHaveBeenCalled();
      expect(mockDbInsert).not.toHaveBeenCalled();
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return success even if email sending fails (but logs error)", async () => {
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockUser as any);
      const emailError = { message: "Failed", name: "EmailError" };
      vi.mocked(mockSendEmail).mockResolvedValueOnce({
        data: null,
        error: emailError as any,
      }); // Cast error type if needed
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await requestPasswordReset(validEmailData);

      consoleErrorSpy.mockRestore();

      expect(result.success).toBe(true);
      expect(result.message).toBe(successMessage);
      expect(mockDbDelete).toHaveBeenCalled();
      expect(mockDbInsert).toHaveBeenCalled(); // Insert should still be called
      // --- Assert on the correct mock ---
      expect(mockDbInsertValuesFn).toHaveBeenCalled(); // <-- Assert on values mock
      expect(mockSendEmail).toHaveBeenCalledOnce();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error sending password reset email:",
        emailError
      );
    });

    it("should return success if RESEND_API_KEY is missing (but logs error)", async () => {
      delete process.env.RESEND_API_KEY;
      vi.mocked(mockUserFindFirst).mockResolvedValue(mockUser as any);
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await requestPasswordReset(validEmailData);

      consoleErrorSpy.mockRestore();

      expect(result.success).toBe(true);
      expect(result.message).toBe(successMessage);
      expect(mockDbDelete).toHaveBeenCalled();
      expect(mockDbInsert).toHaveBeenCalled(); // Insert should still be called
      // --- Assert on the correct mock ---
      expect(mockDbInsertValuesFn).toHaveBeenCalled(); // <-- Assert on values mock
      expect(mockSendEmail).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Resend API Key not configured")
      );
    });

    it("should return validation error for invalid email", async () => {
      const invalidData = { email: "invalid" };
      const result = await requestPasswordReset(invalidData);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email address.");
      expect(mockUserFindFirst).not.toHaveBeenCalled();
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
      // Ensure update/delete mocks resolve (default is fine)

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
      expect(mockDbUpdate).toHaveBeenCalledWith(users);
      // --- Assert on the correct mocks ---
      expect(mockDbUpdateSetFn).toHaveBeenCalledWith(
        expect.objectContaining({
          // <-- Assert on set mock
          passwordHash: "mock-hashed-password",
          updatedAt: expect.any(Date),
        })
      );
      expect(mockDbUpdateWhereFn).toHaveBeenCalledWith(
        eq(users.id, mockUser.id)
      ); // <-- Assert on where mock
      expect(mockDbDelete).toHaveBeenCalledWith(passwordResetTokens);
      expect(mockDbDeleteWhereFn).toHaveBeenCalledWith(
        eq(passwordResetTokens.id, mockToken.id)
      ); // <-- Assert on where mock
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
      expect(mockDbDelete).toHaveBeenCalledWith(passwordResetTokens); // Ensure delete was called
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
      // --- Mock the final step of update to reject ---
      vi.mocked(mockDbUpdateWhereFn).mockRejectedValueOnce(dbError); // <-- Mock where to reject
      // Suppress console error for expected DB failure
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = await resetPassword(validPasswordData);

      consoleErrorSpy.mockRestore(); // Restore console.error

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred while resetting the password."
      );
      expect(mockDbUpdate).toHaveBeenCalledWith(users);
      expect(mockDbUpdateSetFn).toHaveBeenCalled(); // set() should have been called
      expect(mockDbUpdateWhereFn).toHaveBeenCalled(); // where() should have been called (and rejected)
      expect(mockDbDelete).not.toHaveBeenCalled(); // Token deletion shouldn't happen
    });
  });
});
