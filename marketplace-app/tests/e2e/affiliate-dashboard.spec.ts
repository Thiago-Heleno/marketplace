import { test, expect } from "@playwright/test";

// TODO: Implement proper authentication state management or global setup
// Assumes 'testaffiliate@example.com' with password 'password123' exists and is ACTIVE.

test.describe("Affiliate Dashboard Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Log in as an active test affiliate before each test
    await page.goto("/login");
    await page.getByLabel("Email").fill("testaffiliate@example.com");
    await page.getByLabel("Password").fill("password123");
    // Target the submit button specifically within the form
    await page.locator("form").getByRole("button", { name: "Login" }).click();
    // Wait for navigation to the main dashboard first
    await page.waitForURL(/.*dashboard/);
    // Navigate specifically to the affiliate section if not default
    await page.goto("/dashboard/affiliate");
    await expect(page).toHaveURL(/.*\/dashboard\/affiliate/);
    await expect(
      page.getByRole("heading", { name: "Affiliate Dashboard", level: 1 })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display the main affiliate dashboard page", async ({ page }) => {
    // Already logged in and on affiliate dashboard via beforeEach
    await expect(page).toHaveURL(/.*\/dashboard\/affiliate/);

    // Check for key elements
    await expect(
      page.getByRole("heading", { name: "Affiliate Dashboard", level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Your Affiliate Code" })
    ).toBeVisible();
    await expect(page.getByText(/Available Balance/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Request Withdrawal/i })
    ).toBeVisible();
    // Check for either the code input or the generate button using data-testid
    const codeInput = page.getByTestId("affiliate-code-input");
    const generateButton = page.getByTestId("generate-code-button");
    await expect(codeInput.or(generateButton)).toBeVisible();
  });

  test("should allow generating an affiliate code if none exists", async ({
    page,
  }) => {
    // This test assumes the test affiliate starts without a code.
    // This test assumes the test affiliate starts without a code.
    // The seeding script should handle this by using the 'affiliate-no-code@example.com' user.
    // Log in as the specific user for this test
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("affiliate-no-code@example.com");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();
    await page.waitForURL(/.*dashboard\/affiliate/); // Wait for redirect

    const generateButton = page.getByTestId("generate-code-button");
    const codeInput = page.getByTestId("affiliate-code-input");

    // Ensure the generate button is visible and code input is not (initially)
    await expect(generateButton).toBeVisible();
    await expect(codeInput).not.toBeVisible();

    // Click generate
    await generateButton.click();

    // Check for success toast
    await expect(
      page.getByText("Affiliate code generated successfully!")
    ).toBeVisible({ timeout: 10000 });

    // Verify the generate button is gone and the code input is now visible
    await expect(generateButton).not.toBeVisible();
    await expect(codeInput).toBeVisible();

    // Verify the input has a value (the generated code)
    await expect(codeInput).not.toHaveValue("");
    const generatedCode = await codeInput.inputValue();
    expect(generatedCode.length).toBeGreaterThan(5); // Basic check for code format
  });

  test("should allow requesting a withdrawal", async ({ page }) => {
    await page.goto("/dashboard/affiliate"); // Ensure we are on the affiliate dashboard

    // Find the withdrawal request card using data-testid (TODO 20)
    const withdrawalCard = page.getByTestId("withdrawal-request-card");
    await expect(withdrawalCard).toBeVisible();

    // Find the amount input and submit button within the card using data-testid
    const amountInput = withdrawalCard.getByTestId("withdrawal-amount-input");
    const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");

    await expect(amountInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    // Assume PIX key is set and balance is sufficient for the test amount (handled by seeding)
    await expect(submitButton).toBeEnabled();

    // Enter withdrawal amount (e.g., $5.00)
    await amountInput.fill("5.00");

    // Click the request button
    await submitButton.click();

    // Check for success toast
    await expect(
      page.getByText("Withdrawal request submitted successfully.")
    ).toBeVisible({ timeout: 10000 });

    // Verify the amount input is cleared (due to form reset on success)
    await expect(amountInput).toHaveValue("");
  });

  // TODO: Add test for viewing referral history (when implemented)

  test("should show validation errors for withdrawal form", async ({
    page,
  }) => {
    await page.goto("/dashboard/affiliate"); // Ensure we are on the affiliate dashboard

    const withdrawalCard = page.getByTestId("withdrawal-request-card");
    const amountInput = withdrawalCard.getByTestId("withdrawal-amount-input");
    const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");

    // Test non-numeric input
    await amountInput.fill("xyz");
    await submitButton.click();
    await expect(
      withdrawalCard.locator('[id$="-form-item-message"]')
    ).toContainText(/Please enter a valid amount/i);

    // Test negative input
    await amountInput.fill("-5.00");
    await submitButton.click();
    await expect(
      withdrawalCard.locator('[id$="-form-item-message"]')
    ).toContainText(/Withdrawal amount must be positive/i);

    // Test zero input
    await amountInput.fill("0");
    await submitButton.click();
    await expect(
      withdrawalCard.locator('[id$="-form-item-message"]')
    ).toContainText(/Withdrawal amount must be positive/i);

    // Ensure no success toast appeared
    await expect(
      page.getByText("Withdrawal request submitted successfully.")
    ).not.toBeVisible();
  });

  test("should show error when requesting withdrawal with insufficient funds", async ({
    page,
  }) => {
    await page.goto("/dashboard/affiliate");

    const withdrawalCard = page.getByTestId("withdrawal-request-card");
    const amountInput = withdrawalCard.getByTestId("withdrawal-amount-input");
    const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");

    // Assume balance is less than $9999.99 for test affiliate
    const excessiveAmount = "9999.99";
    await amountInput.fill(excessiveAmount);
    await submitButton.click();

    // Check for error toast indicating insufficient balance
    await expect(
      page.getByText(/Withdrawal amount exceeds available balance/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("should show error and disable button when PIX key is not set", async ({
    page,
  }) => {
    // Log out the default affiliate and log in as an affiliate without PIX key
    // Need to seed an affiliate without a PIX key first.
    // For now, let's assume the main test affiliate has one, and skip this.
    // If 'affiliate-no-pix@example.com' is seeded later, this test can be enabled.
    test.skip(
      true,
      "Test skipped: Requires seeding an affiliate user without a PIX key."
    );

    // Example steps if user existed:
    // await page.getByTestId("navbar-logout-button").click();
    // await page.waitForURL("/");
    // await page.goto("/login");
    // await page.getByLabel("Email").fill("affiliate-no-pix@example.com");
    // await page.getByLabel("Password").fill("password123");
    // await page.getByRole("button", { name: "Login" }).click();
    // await page.waitForURL(/.*dashboard\/affiliate/);

    // const withdrawalCard = page.getByTestId("withdrawal-request-card");
    // const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");
    // const noPixWarning = withdrawalCard.getByTestId("withdrawal-no-pix-warning");

    // await expect(noPixWarning).toBeVisible();
    // await expect(submitButton).toBeDisabled();
  });
});
