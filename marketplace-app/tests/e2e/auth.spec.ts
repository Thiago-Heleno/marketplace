import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("Login page should load correctly", async ({ page }) => {
    await page.goto("/login");

    // Check if the main elements of the login form are visible using data-testid
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
    await expect(page.getByTestId("login-email-input")).toBeVisible();
    await expect(page.getByTestId("login-password-input")).toBeVisible();
    await expect(page.getByTestId("login-submit-button")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Forgot password?" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
  });

  test("should allow a customer to log in successfully", async ({ page }) => {
    await page.goto("/login");

    // Fill in the form using data-testid
    await page
      .getByTestId("login-email-input")
      .fill("testcustomer@example.com");
    await page.getByTestId("login-password-input").fill("password123");

    // Click the login button using data-testid
    await page.getByTestId("login-submit-button").click();

    // Wait for navigation to the dashboard and check for a dashboard element
    // Using a broad check for now, refine later if needed
    await expect(
      page.getByRole("heading", { name: /dashboard/i, level: 1 })
    ).toBeVisible({ timeout: 10000 }); // Wait up to 10 seconds for redirect/load
    await expect(page).toHaveURL(/.*dashboard/); // Check if URL contains /dashboard
  });

  test("should show error on failed login", async ({ page }) => {
    await page.goto("/login");

    // Fill in the form with incorrect password using data-testid
    await page
      .getByTestId("login-email-input")
      .fill("testcustomer@example.com");
    await page.getByTestId("login-password-input").fill("wrongpassword");

    // Click the login button using data-testid
    await page.getByTestId("login-submit-button").click();

    // Check for the error message display using data-testid (already updated)
    const errorLocator = page.getByTestId("login-error-message");
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(/Invalid email or password/i); // Check for specific text

    // Ensure the user is still on the login page
    await expect(page).toHaveURL(/.*login/);
    await expect(
      page.getByRole("heading", { name: /dashboard/i, level: 1 })
    ).not.toBeVisible();
  });

  test("should allow a new customer to register successfully", async ({
    page,
  }) => {
    await page.goto("/register");

    // Generate unique email for this test run
    const uniqueEmail = `testcustomer_${Date.now()}@example.com`;

    // Fill in the registration form using data-testid
    await page.getByTestId("register-firstname-input").fill("Test");
    await page.getByTestId("register-lastname-input").fill("Customer");
    await page.getByTestId("register-email-input").fill(uniqueEmail);
    await page.getByTestId("register-password-input").fill("password123");

    // Select the 'Customer' role using data-testid
    await page.getByTestId("register-role-select").click(); // Open the select dropdown
    await page.getByRole("option", { name: "Customer" }).click();

    // Submit the form using data-testid
    await page.getByTestId("register-submit-button").click();

    // Check for the success message using data-testid (already updated)
    const successLocator = page.getByTestId("register-success-message");
    await expect(successLocator).toBeVisible({ timeout: 10000 }); // Wait for action
    await expect(successLocator).toContainText(
      /Registration successful! You can now log in./i
    );

    // Ensure the form fields might be cleared or the user stays on the page
    await expect(page.getByTestId("register-email-input")).toHaveValue(""); // Check if email field is cleared
  });

  test("should allow a logged-in user to log out", async ({ page }) => {
    // 1. Log in first using data-testid
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("testcustomer@example.com");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();

    // Wait for dashboard redirect
    await expect(
      page.getByRole("heading", { name: /dashboard/i, level: 1 })
    ).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Click the Logout button using data-testid from Navbar
    await page.getByTestId("navbar-logout-button").click();

    // 3. Verify redirection (e.g., back to login or home page)
    // Wait for navigation to complete, check URL is NOT dashboard anymore
    await page.waitForURL((url) => !url.pathname.includes("/dashboard"), {
      timeout: 10000,
    });
    // Check if redirected to home page (TODO 3)
    await expect(page).toHaveURL("/");

    // 4. Verify dashboard elements are gone and potentially check for a homepage element
    await expect(
      page.getByRole("heading", { name: /dashboard/i, level: 1 })
    ).not.toBeVisible();
    // Instead of checking for Login heading, check for a known homepage element
    await expect(
      page.getByRole("heading", { name: /Featured Products/i }) // Example: Assuming homepage has this
    ).toBeVisible();
  });

  test("should allow a new vendor to register successfully (pending approval)", async ({
    page,
  }) => {
    await page.goto("/register");

    // Generate unique email for this test run
    const uniqueEmail = `testvendor_${Date.now()}@example.com`;

    // Fill in the registration form using data-testid
    await page.getByTestId("register-firstname-input").fill("Test");
    await page.getByTestId("register-lastname-input").fill("Vendor");
    await page.getByTestId("register-email-input").fill(uniqueEmail);
    await page.getByTestId("register-password-input").fill("password123");

    // Select the 'Vendor' role using data-testid
    await page.getByTestId("register-role-select").click(); // Open the select dropdown
    await page.getByRole("option", { name: "Vendor" }).click();

    // Submit the form using data-testid
    await page.getByTestId("register-submit-button").click();

    // Check for the success message indicating pending approval using data-testid (already updated)
    const successLocator = page.getByTestId("register-success-message");
    await expect(successLocator).toBeVisible({ timeout: 10000 }); // Wait for action
    await expect(successLocator).toContainText(
      /Registration successful! Your account requires admin approval./i
    );

    // Ensure the form fields might be cleared
    await expect(page.getByTestId("register-email-input")).toHaveValue(""); // Check if email field is cleared
  });

  test("should allow a new affiliate to register successfully (pending approval)", async ({
    page,
  }) => {
    await page.goto("/register");

    // Generate unique email for this test run
    const uniqueEmail = `testaffiliate_${Date.now()}@example.com`;

    // Fill in the registration form using data-testid
    await page.getByTestId("register-firstname-input").fill("Test");
    await page.getByTestId("register-lastname-input").fill("Affiliate");
    await page.getByTestId("register-email-input").fill(uniqueEmail);
    await page.getByTestId("register-password-input").fill("password123");

    // Select the 'Affiliate' role using data-testid
    await page.getByTestId("register-role-select").click(); // Open the select dropdown
    await page.getByRole("option", { name: "Affiliate" }).click();

    // Submit the form using data-testid
    await page.getByTestId("register-submit-button").click();

    // Check for the success message indicating pending approval using data-testid (already updated)
    const successLocator = page.getByTestId("register-success-message");
    await expect(successLocator).toBeVisible({ timeout: 10000 }); // Wait for action
    await expect(successLocator).toContainText(
      /Registration successful! Your account requires admin approval./i
    );

    // Ensure the form fields might be cleared
    await expect(page.getByTestId("register-email-input")).toHaveValue(""); // Check if email field is cleared
  });

  test("should allow requesting a password reset", async ({ page }) => {
    await page.goto("/forgot-password");

    // Check page elements using data-testid
    await expect(
      page.getByRole("heading", { name: "Forgot Password" })
    ).toBeVisible();
    await expect(page.getByTestId("forgot-password-email-input")).toBeVisible();
    await expect(
      page.getByTestId("forgot-password-submit-button")
    ).toBeVisible();

    // Fill in email and submit using data-testid
    await page
      .getByTestId("forgot-password-email-input")
      .fill("testcustomer@example.com"); // Use an existing test user email
    await page.getByTestId("forgot-password-submit-button").click();

    // Check for the generic success message using data-testid
    const successLocator = page.getByTestId("forgot-password-success-message");
    await expect(successLocator).toBeVisible({ timeout: 10000 });
    await expect(successLocator).toContainText(
      /If an account with this email exists, a password reset link has been sent./i
    );

    // Check if email field is cleared (based on ForgotPasswordForm behavior)
    await expect(page.getByTestId("forgot-password-email-input")).toHaveValue(
      ""
    );
  });

  // TODO: Add tests for the actual password reset using a token (more complex setup needed)

  // --- Phase 3: New Test Scenarios ---

  test("should show error on login attempt with PENDING user", async ({
    page,
  }) => {
    await page.goto("/login");

    // Use seeded pending vendor email
    await page
      .getByTestId("login-email-input")
      .fill("pendingvendor@example.com");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();

    // Check for specific error message related to pending status
    const errorLocator = page.getByTestId("login-error-message");
    await expect(errorLocator).toBeVisible();
    // TODO: Adjust expected text based on actual error message implemented in auth.actions
    await expect(errorLocator).toContainText(
      /Account pending approval|Invalid credentials/i
    );
    await expect(page).toHaveURL(/.*login/); // Stay on login page
  });

  test("should show error on registration with existing email", async ({
    page,
  }) => {
    await page.goto("/register");

    // Use an existing seeded email
    const existingEmail = "testcustomer@example.com";

    await page.getByTestId("register-firstname-input").fill("Another");
    await page.getByTestId("register-lastname-input").fill("User");
    await page.getByTestId("register-email-input").fill(existingEmail);
    await page.getByTestId("register-password-input").fill("password123");
    await page.getByTestId("register-role-select").click();
    await page.getByRole("option", { name: "Customer" }).click();
    await page.getByTestId("register-submit-button").click();

    // Check for specific error message related to existing email
    const errorLocator = page.getByTestId("register-error-message");
    await expect(errorLocator).toBeVisible({ timeout: 10000 });
    // TODO: Adjust expected text based on actual error message implemented in auth.actions
    await expect(errorLocator).toContainText(/Email already in use/i);
  });

  test("should show validation error on registration with short password", async ({
    page,
  }) => {
    await page.goto("/register");

    await page.getByTestId("register-firstname-input").fill("Test");
    await page.getByTestId("register-lastname-input").fill("ShortPass");
    await page
      .getByTestId("register-email-input")
      .fill(`shortpass_${Date.now()}@example.com`);
    await page.getByTestId("register-password-input").fill("123"); // Short password
    await page.getByTestId("register-role-select").click();
    await page.getByRole("option", { name: "Customer" }).click();
    await page.getByTestId("register-submit-button").click();

    // Check for validation message below the password field
    // Assuming FormMessage is rendered correctly by Shadcn form component
    const passwordField = page.getByTestId("register-password-input");
    // Locate the FormMessage associated with the password input
    // This might need adjustment based on exact DOM structure
    const errorMessage = passwordField.locator(
      "xpath=ancestor::*[contains(@class, 'FormItem')]//p[contains(@id, '-form-item-message')]"
    );

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(
      /Password must be at least 6 characters/i // Based on Zod schema
    );
  });

  test("should show validation error on login with invalid email format", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByTestId("login-email-input").fill("invalid-email");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();

    // Check for validation message below the email field
    const emailField = page.getByTestId("login-email-input");
    const errorMessage = emailField.locator(
      "xpath=ancestor::*[contains(@class, 'FormItem')]//p[contains(@id, '-form-item-message')]"
    );

    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Invalid email/i); // Based on Zod schema
  });

  test("should show validation errors for reset password form", async ({
    page,
  }) => {
    // Need a valid token to reach the form, but we can test client-side validation
    // without needing a *real* token from the backend for this specific test.
    const fakeToken = "fake-test-token-12345";
    await page.goto(`/reset-password?token=${fakeToken}`);

    // Check page loaded
    await expect(
      page.getByRole("heading", { name: "Reset Password" })
    ).toBeVisible();

    const passwordInput = page.getByTestId("reset-password-password-input");
    const confirmInput = page.getByTestId("reset-password-confirm-input");
    const submitButton = page.getByTestId("reset-password-submit-button");

    // Attempt submit with empty fields
    await submitButton.click();
    await expect(
      passwordInput.locator(
        "xpath=ancestor::*[contains(@class, 'FormItem')]//p[contains(@id, '-form-item-message')]"
      )
    ).toContainText(/Password must be at least 8 characters/i);

    // Enter short password
    await passwordInput.fill("12345");
    await submitButton.click();
    await expect(
      passwordInput.locator(
        "xpath=ancestor::*[contains(@class, 'FormItem')]//p[contains(@id, '-form-item-message')]"
      )
    ).toContainText(/Password must be at least 8 characters/i);

    // Enter non-matching passwords
    await passwordInput.fill("newValidPassword");
    await confirmInput.fill("differentPassword");
    await submitButton.click();
    await expect(
      confirmInput.locator(
        "xpath=ancestor::*[contains(@class, 'FormItem')]//p[contains(@id, '-form-item-message')]"
      )
    ).toContainText(/Passwords do not match/i);

    // Ensure no success toast appeared
    await expect(
      page.getByText("Password has been reset successfully.")
    ).not.toBeVisible();
  });

  test("should show error on login attempt with REJECTED user", async ({
    page,
  }) => {
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("rejectedvendor@example.com"); // Use seeded rejected user
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();

    const errorLocator = page.getByTestId("login-error-message");
    await expect(errorLocator).toBeVisible();
    // TODO: Adjust expected text based on actual error message implemented
    await expect(errorLocator).toContainText(
      /Account rejected|Invalid credentials/i
    );
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show error on login attempt with SUSPENDED user", async ({
    page,
  }) => {
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("suspendedcustomer@example.com"); // Use seeded suspended user
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();

    const errorLocator = page.getByTestId("login-error-message");
    await expect(errorLocator).toBeVisible();
    // TODO: Adjust expected text based on actual error message implemented
    await expect(errorLocator).toContainText(
      /Account suspended|Invalid credentials/i
    );
    await expect(page).toHaveURL(/.*login/);
  });

  // Note: Full password reset flow test requires interacting with the database
  // or mocking email to retrieve the token. This is complex for pure E2E.
  // A more robust approach might involve a dedicated testing endpoint or DB query helper.
  // Skipping the full flow test for now due to complexity.
  test.skip("should complete the password reset flow", async () => {
    // 1. Request reset for testcustomer@example.com
    // 2. Retrieve token (e.g., via DB query in test setup or mock)
    // 3. Navigate to /reset-password?token=...
    // 4. Fill ResetPasswordForm with new password
    // 5. Verify success
    // 6. Log out if necessary
    // 7. Log in with new password
    // 8. Attempt to use old token again, verify failure
  });
});
