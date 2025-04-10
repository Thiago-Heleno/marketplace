/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from "vitest"; // Explicit imports
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/../auth";
import { registerUser } from "./auth.actions"; // Removed ActionResult import

// --- Mocks ---

// Mock next/server (needed by next-auth internals in test env)
// Keep this mock
// Keep this mock

// Mock NextAuth functions
vi.mock("@/../auth", () => ({
  auth: vi.fn(),
}));

// Mock Drizzle ORM db instance and query methods
// Keep mocks, but simplify beforeEach assignments below

// Mock bcrypt
vi.mock("bcryptjs", () => ({
  hash: vi.fn().mockResolvedValue("mock-hashed-password"),
  compare: vi.fn().mockResolvedValue(true), // mockResolvedValue should be fine for async
}));

// Mock Resend (Keep commented out)
// Keep commented out
// Keep commented out

// Mock Zod schemas (Keep commented out)
// Keep commented out

// --- Test Suite ---

describe("Authentication Actions (auth.actions.ts)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simplify auth mock setup
    // Assign mocks directly
    (auth as vi.Mock).mockResolvedValue(null);
    (db.query.users.findFirst as vi.Mock).mockResolvedValue(undefined);
    (db.query.passwordResetTokens.findFirst as vi.Mock).mockResolvedValue(
      undefined
    );
    (bcrypt.compare as vi.Mock).mockResolvedValue(true);
  });

  // --- registerUser Tests ---
  // Remove unused ErrorResult type definition

  describe("registerUser", () => {
    const validUserData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password123",
      role: "CUSTOMER" as const,
    };

    it("should successfully register a new user", async () => {
      // Arrange
      (db.query.users.findFirst as vi.Mock).mockResolvedValue(undefined);
      const insertValuesMock = vi
        .fn()
        .mockResolvedValue([{ id: "new-user-id" }]);
      (db.insert as vi.Mock).mockReturnValue({ values: insertValuesMock });

      // Act
      const result = await registerUser(validUserData); // Infer type or use {success: boolean, message?: string}

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe(
        "User registered successfully. Check email for verification if applicable."
      ); // Adjust message if needed
      expect(db.query.users.findFirst).toHaveBeenCalledWith({
        where: eq(users.email, validUserData.email),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
      expect(insertValuesMock).toHaveBeenCalledWith(
        // Correct variable name here
        expect.objectContaining({
          email: validUserData.email,
          firstName: validUserData.firstName,
          lastName: validUserData.lastName,
          passwordHash: "mock-hashed-password",
          role: validUserData.role,
          status: "ACTIVE", // Assuming CUSTOMER defaults to ACTIVE
        })
      );
    });

    it("should return error if user already exists", async () => {
      // Arrange
      const mockExistingUser = {
        // Define mock inline
        id: "existing-user-id",
        email: validUserData.email,
      };
      (db.query.users.findFirst as vi.Mock).mockResolvedValue(mockExistingUser);

      // Act
      const result = await registerUser(validUserData); // Use inferred type + ErrorResult union

      // Assert
      expect(result.success).toBe(false);
      // Use type guard and check message
      if (!result.success) {
        expect(result.message).toBe("Email already in use."); // Check message from action
      } else {
        expect(result.success).toBe(false);
      }
      expect(db.insert).not.toHaveBeenCalled();
    });

    it("should return validation error for invalid data", async () => {
      const invalidData = { ...validUserData, email: "" };
      const result = await registerUser(invalidData); // Use inferred type + ErrorResult union

      // Assert
      expect(result.success).toBe(false);
      // Use type guard and check message
      if (!result.success) {
        expect(result.message).toBe("Invalid registration details."); // Check message from action
      } else {
        expect(result.success).toBe(false); // Fail test if success is true
      }
      expect(db.insert).not.toHaveBeenCalled();
    });

    // Keep existing VENDOR test, adjust mock setup

    // Keep existing VENDOR test

    // Add tests for VENDOR/AFFILIATE registration setting status to PENDING
    // (Keep existing VENDOR test)
    it("should set status to PENDING for VENDOR role", async () => {
      const vendorData = { ...validUserData, role: "VENDOR" as const };
      // Arrange
      (db.query.users.findFirst as vi.Mock).mockResolvedValue(undefined);
      const insertValuesMock = vi
        .fn()
        .mockResolvedValue([{ id: "new-user-id" }]);
      (db.insert as vi.Mock).mockReturnValue({ values: insertValuesMock });

      await registerUser(vendorData);

      expect(insertValuesMock).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "VENDOR",
          status: "PENDING",
        })
      );
    });
  });

  // --- signInWithCredentials Tests ---
  describe("signInWithCredentials", () => {
    // TODO: Add tests
  });

  // --- requestPasswordReset Tests ---
  describe("requestPasswordReset", () => {
    // TODO: Add tests
  });

  // --- resetPassword Tests ---
  describe("resetPassword", () => {
    // TODO: Add tests
  });
});
