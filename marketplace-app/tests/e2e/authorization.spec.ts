import { test, expect } from "@playwright/test";

test.describe("Authorization & Access Control", () => {
  // --- Guest Access ---
  test("guest should be redirected from dashboard pages", async ({ page }) => {
    const dashboardPages = [
      "/dashboard",
      "/dashboard/profile",
      "/dashboard/orders",
      "/dashboard/vendor",
      "/dashboard/vendor/products",
      "/dashboard/vendor/orders",
      "/dashboard/affiliate",
      "/dashboard/admin/approvals",
      "/dashboard/admin/withdrawals",
      // Add other protected routes as needed
    ];

    for (const path of dashboardPages) {
      await page.goto(path);
      // Expect redirection to login page
      await page.waitForURL(/.*\/login/);
      await expect(page).toHaveURL(/.*\/login/);
    }
  });

  test("guest should be able to access public pages", async ({ page }) => {
    const publicPages = [
      "/",
      "/products",
      "/products/seeded-simple-product", // Example product page
      "/categories/seeded-category", // Example category page
      "/login",
      "/register",
      "/forgot-password",
      "/about",
      "/terms",
      "/privacy",
    ];

    for (const path of publicPages) {
      await page.goto(path);
      // Expect NOT to be redirected to login
      await expect(page).not.toHaveURL(/.*\/login/);
      // Check for a common element or title to ensure page loaded
      await expect(page.locator("body")).toBeVisible(); // Basic check
    }
  });

  // --- Customer Access ---
  test.describe("Customer Role", () => {
    test.beforeEach(async ({ page }) => {
      // Log in as customer
      await page.goto("/login");
      await page.getByLabel("Email").fill("testcustomer@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Login" }).click();
      await page.waitForURL(/.*dashboard/);
    });

    test("customer should access their dashboard, profile, orders", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/.*dashboard/);
      await page.goto("/dashboard/profile");
      await expect(page).toHaveURL(/.*\/dashboard\/profile/);
      await page.goto("/dashboard/orders");
      await expect(page).toHaveURL(/.*\/dashboard\/orders/);
    });

    test("customer should NOT access vendor, affiliate, or admin pages", async ({
      page,
    }) => {
      const forbiddenPages = [
        "/dashboard/vendor",
        "/dashboard/vendor/products",
        "/dashboard/vendor/orders",
        "/dashboard/affiliate",
        "/dashboard/admin/approvals",
        "/dashboard/admin/withdrawals",
      ];

      for (const path of forbiddenPages) {
        await page.goto(path);
        // Expect redirection (e.g., back to main dashboard or home)
        // Or check for a "Forbidden" message if implemented that way
        await page.waitForURL((url) => !url.pathname.startsWith(path)); // Wait until URL changes
        await expect(page).not.toHaveURL(new RegExp(`.*${path}`));
        // Add specific check for where they land (e.g., /dashboard)
        await expect(page).toHaveURL(/.*dashboard/);
      }
    });
  });

  // --- Vendor Access ---
  test.describe("Vendor Role", () => {
    test.beforeEach(async ({ page }) => {
      // Log in as vendor
      await page.goto("/login");
      await page.getByLabel("Email").fill("testvendor@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Login" }).click();
      await page.waitForURL(/.*dashboard/);
    });

    test("vendor should access their dashboard, profile, products, orders", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/.*dashboard/);
      await page.goto("/dashboard/profile");
      await expect(page).toHaveURL(/.*\/dashboard\/profile/);
      await page.goto("/dashboard/vendor/products");
      await expect(page).toHaveURL(/.*\/dashboard\/vendor\/products/);
      await page.goto("/dashboard/vendor/orders");
      await expect(page).toHaveURL(/.*\/dashboard\/vendor\/orders/);
    });

    test("vendor should NOT access affiliate or admin pages", async ({
      page,
    }) => {
      const forbiddenPages = [
        "/dashboard/affiliate",
        "/dashboard/admin/approvals",
        "/dashboard/admin/withdrawals",
      ];

      for (const path of forbiddenPages) {
        await page.goto(path);
        await page.waitForURL((url) => !url.pathname.startsWith(path));
        await expect(page).not.toHaveURL(new RegExp(`.*${path}`));
        await expect(page).toHaveURL(/.*dashboard/); // Redirect to main dashboard
      }
    });
  });

  // --- Affiliate Access ---
  test.describe("Affiliate Role", () => {
    test.beforeEach(async ({ page }) => {
      // Log in as affiliate
      await page.goto("/login");
      await page.getByLabel("Email").fill("testaffiliate@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Login" }).click();
      await page.waitForURL(/.*dashboard/);
    });

    test("affiliate should access their dashboard, profile", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/.*dashboard/);
      await page.goto("/dashboard/profile");
      await expect(page).toHaveURL(/.*\/dashboard\/profile/);
      await page.goto("/dashboard/affiliate");
      await expect(page).toHaveURL(/.*\/dashboard\/affiliate/);
    });

    test("affiliate should NOT access vendor or admin pages", async ({
      page,
    }) => {
      const forbiddenPages = [
        "/dashboard/vendor",
        "/dashboard/vendor/products",
        "/dashboard/vendor/orders",
        "/dashboard/admin/approvals",
        "/dashboard/admin/withdrawals",
      ];

      for (const path of forbiddenPages) {
        await page.goto(path);
        await page.waitForURL((url) => !url.pathname.startsWith(path));
        await expect(page).not.toHaveURL(new RegExp(`.*${path}`));
        await expect(page).toHaveURL(/.*dashboard/); // Redirect to main dashboard
      }
    });
  });

  // --- Admin Access ---
  test.describe("Admin Role", () => {
    test.beforeEach(async ({ page }) => {
      // Log in as admin
      await page.goto("/login");
      const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "adminpass";
      await page.getByLabel("Email").fill(adminEmail);
      await page.getByLabel("Password").fill(adminPassword);
      await page.getByRole("button", { name: "Login" }).click();
      await page.waitForURL(/.*dashboard/);
    });

    test("admin should access all dashboard pages", async ({ page }) => {
      const allDashboardPages = [
        "/dashboard",
        "/dashboard/profile", // Admins might have a profile too
        "/dashboard/orders", // Admins might view customer orders
        "/dashboard/vendor", // Admins might view vendor dashboards
        "/dashboard/vendor/products",
        "/dashboard/vendor/orders",
        "/dashboard/affiliate", // Admins might view affiliate dashboards
        "/dashboard/admin/approvals",
        "/dashboard/admin/withdrawals",
        // Add other admin-specific pages here
      ];

      for (const path of allDashboardPages) {
        await page.goto(path);
        await page.waitForURL(new RegExp(`.*${path}`)); // Wait for the specific URL
        await expect(page).toHaveURL(new RegExp(`.*${path}`));
        // Add a check for a common dashboard element to ensure it loaded
        await expect(
          page.getByRole("heading", { name: /dashboard/i })
        ).toBeVisible();
      }
    });
  });
});
