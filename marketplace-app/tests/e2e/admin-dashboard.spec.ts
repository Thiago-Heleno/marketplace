import { test, expect } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load admin credentials from .env.local
dotenv.config({ path: path.resolve(__dirname, "..", ".env.local") }); // Adjust path relative to test file location

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

// Basic check for admin credentials
if (!adminEmail || !adminPassword) {
  throw new Error(
    "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local for admin tests."
  );
}

// TODO: Implement proper authentication state management or global setup

test.describe("Admin Dashboard Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Log in as admin before each test
    await page.goto("/login");
    await page.getByLabel("Email").fill(adminEmail);
    await page.getByLabel("Password").fill(adminPassword);
    await page.getByRole("button", { name: "Login" }).click();
    // Wait for navigation to the main dashboard first
    await page.waitForURL(/.*dashboard/);
    // Navigate specifically to the admin approvals section
    await page.goto("/dashboard/admin/approvals");
    await expect(page).toHaveURL(/.*\/dashboard\/admin\/approvals/);
    await expect(
      page.getByRole("heading", { name: "User Approvals (Admin)", level: 1 })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display the admin user approvals page", async ({ page }) => {
    // Already logged in and on approvals page via beforeEach
    await expect(page).toHaveURL(/.*\/dashboard\/admin\/approvals/);

    // Check for key elements
    await expect(
      page.getByRole("heading", { name: "User Approvals (Admin)", level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Pending Approvals" })
    ).toBeVisible();

    // Check for the list of pending users or the "no users" message using data-testid
    const userCardLocator = page.getByTestId(/approval-card-.+/);
    const noUsersMessage = page.getByTestId("admin-approvals-empty-message");
    await expect(userCardLocator.first().or(noUsersMessage)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should allow approving a pending user", async ({ page }) => {
    await page.goto("/dashboard/admin/approvals"); // Ensure we are on the correct page

    // Find the specific seeded pending vendor card using data-testid (TODO 22 & 24)
    const userEmail = "pendingvendor@example.com";
    const userCard = page
      .getByTestId(/approval-card-.+/)
      .filter({ hasText: userEmail });
    await expect(userCard).toBeVisible({ timeout: 10000 }); // Ensure seeded user exists

    // Find and click the Approve button within that card using data-testid (TODO 22)
    const approveButton = userCard.getByTestId(/approve-user-button-.+/);
    await expect(approveButton).toBeVisible();
    await approveButton.click();

    // Check for success toast
    await expect(page.getByText("User approved successfully.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the user card is no longer visible (using the specific locator)
    await expect(userCard).not.toBeVisible();
  });

  test("should allow rejecting a pending user", async ({ page }) => {
    await page.goto("/dashboard/admin/approvals"); // Ensure we are on the correct page

    // Find the specific seeded pending affiliate card using data-testid (TODO 22 & 24)
    // Use the other pending user for this test
    const userEmail = "pendingaffiliate@example.com";
    const userCard = page
      .getByTestId(/approval-card-.+/)
      .filter({ hasText: userEmail });
    await expect(userCard).toBeVisible({ timeout: 10000 }); // Ensure seeded user exists

    // Find and click the Reject button within that card using data-testid (TODO 22)
    const rejectButton = userCard.getByTestId(/reject-user-button-.+/);
    await expect(rejectButton).toBeVisible();
    await rejectButton.click();

    // Check for success toast
    await expect(page.getByText("User rejected successfully.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the user card is no longer visible
    await expect(userCard).not.toBeVisible();
  });

  test("should display the admin withdrawals management page", async ({
    page,
  }) => {
    await page.goto("/dashboard/admin/withdrawals");
    await expect(page).toHaveURL(/.*\/dashboard\/admin\/withdrawals/);

    // Check for page heading
    await expect(
      page.getByRole("heading", { name: "Manage Withdrawals" })
    ).toBeVisible();

    // Check for the withdrawals table or the "no requests" message using data-testid
    const withdrawalTable = page.locator("table");
    const noRequestsMessage = page.getByTestId(
      "admin-withdrawals-empty-message"
    );
    await expect(withdrawalTable.or(noRequestsMessage)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should allow approving a pending withdrawal request", async ({
    page,
  }) => {
    await page.goto("/dashboard/admin/withdrawals");

    // Find the specific seeded PENDING withdrawal row using data-testid (TODO 22 & 24)
    // Seeded pending request is for testvendor@example.com
    const pendingRow = page
      .getByTestId(/withdrawal-row-.+/)
      .filter({ hasText: /testvendor@example.com/i })
      .filter({ hasText: /PENDING/i });
    await expect(pendingRow).toBeVisible({ timeout: 10000 }); // Ensure row exists

    // Click the Approve button using data-testid (TODO 22)
    const approveButton = pendingRow.getByTestId(
      /withdrawal-approve-button-.+/
    );
    await expect(approveButton).toBeVisible();
    await approveButton.click();

    // Check for success toast
    await expect(page.getByText("Withdrawal approved.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the status badge changes to 'APPROVED' using data-testid (TODO 22)
    await expect(
      pendingRow.getByTestId(/withdrawal-status-cell-.+/)
    ).toHaveText(/APPROVED/i);
  });

  test("should allow rejecting a pending withdrawal request", async ({
    page,
  }) => {
    await page.goto("/dashboard/admin/withdrawals");

    // Find the specific seeded PENDING withdrawal row using data-testid (TODO 22 & 24)
    // Seeded pending request is for testvendor@example.com
    const pendingRow = page
      .getByTestId(/withdrawal-row-.+/)
      .filter({ hasText: /testvendor@example.com/i })
      .filter({ hasText: /PENDING/i });
    await expect(pendingRow).toBeVisible({ timeout: 10000 }); // Ensure row exists

    // Click the Reject button trigger using data-testid (TODO 22)
    const rejectTriggerButton = pendingRow.getByTestId(
      /withdrawal-reject-button-.+/
    );
    await expect(rejectTriggerButton).toBeVisible();
    await rejectTriggerButton.click();

    // Handle the rejection dialog
    const dialogLocator = page.getByRole("alertdialog"); // Use role locator
    await expect(dialogLocator).toBeVisible();
    await expect(
      dialogLocator.getByRole("heading", { name: /Reject Withdrawal/i })
    ).toBeVisible();

    // Fill reason and confirm using data-testid
    const reason = "Test rejection reason";
    await dialogLocator
      .getByTestId("withdrawal-reject-dialog-reason-input")
      .fill(reason);
    await dialogLocator
      .getByTestId("withdrawal-reject-dialog-confirm-button")
      .click();

    // Check for success toast
    await expect(page.getByText("Withdrawal rejected.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the status badge changes to 'REJECTED' using data-testid (TODO 22)
    await expect(
      pendingRow.getByTestId(/withdrawal-status-cell-.+/)
    ).toHaveText(/REJECTED/i);
    // Optional: Verify admin note is displayed if table shows it
    // await expect(pendingRow.getByText(reason)).toBeVisible();
  });

  test("should allow marking an approved withdrawal as paid", async ({
    page,
  }) => {
    await page.goto("/dashboard/admin/withdrawals");

    // Find the specific seeded APPROVED withdrawal row using data-testid (TODO 22 & 24)
    // Seeded approved request is for testaffiliate@example.com
    const approvedRow = page
      .getByTestId(/withdrawal-row-.+/)
      .filter({ hasText: /testaffiliate@example.com/i })
      .filter({ hasText: /APPROVED/i });
    await expect(approvedRow).toBeVisible({ timeout: 10000 }); // Ensure row exists

    // Click the 'Mark Paid' button using data-testid (TODO 22)
    const markPaidButton = approvedRow.getByTestId(
      /withdrawal-mark-paid-button-.+/
    );
    await expect(markPaidButton).toBeVisible();
    await markPaidButton.click();

    // Check for success toast
    await expect(page.getByText("Withdrawal marked as paid.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the status badge changes to 'PAID' using data-testid (TODO 22)
    await expect(
      approvedRow.getByTestId(/withdrawal-status-cell-.+/)
    ).toHaveText(/PAID/i);
  });
});
