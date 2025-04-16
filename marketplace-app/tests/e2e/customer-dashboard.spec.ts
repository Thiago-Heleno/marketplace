import { test, expect } from "@playwright/test";

// TODO: Implement proper authentication state management or global setup
// For now, we log in manually in each test or describe block.

test.describe("Customer Dashboard Flows", () => {
  // Login helper or beforeAll/beforeEach hook could be used here
  test.beforeEach(async ({ page }) => {
    // Log in as a test customer before each test in this suite
    await page.goto("/login");
    await page.getByLabel("Email").fill("testcustomer@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();
    // Wait for navigation to dashboard
    await page.waitForURL(/.*dashboard/);
    await expect(
      page.getByRole("heading", { name: /dashboard/i, level: 1 })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display the main customer dashboard page", async ({ page }) => {
    // Already logged in via beforeEach
    await expect(page).toHaveURL(/.*dashboard/);

    // Check for elements specific to the main customer dashboard
    // Adjust locators based on actual dashboard content
    // Example: Check for profile link, orders link etc.
    await expect(page.getByRole("link", { name: /profile/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /orders/i })).toBeVisible();
    // Add more specific checks based on the actual dashboard layout
  });

  test("should display the order history page", async ({ page }) => {
    // Already logged in via beforeEach
    // Navigate to the orders page (assuming a link exists on the main dashboard)
    await page.getByRole("link", { name: /orders/i }).click();

    // Wait for navigation and check URL
    await page.waitForURL(/.*\/dashboard\/orders/);
    await expect(page).toHaveURL(/.*\/dashboard\/orders/);

    // Check for the heading on the orders page
    await expect(
      page.getByRole("heading", { name: "My Orders", level: 1 })
    ).toBeVisible();

    // Optional: Check for order cards or a "no orders" message
    const orderCardLocator = page.locator("div[class*='space-y-6'] > div"); // Adjust locator based on actual structure
    const noOrdersLocator = page.getByText(/haven't placed any orders yet/i);
    await expect(orderCardLocator.first().or(noOrdersLocator)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should display the profile page with form and addresses", async ({
    page,
  }) => {
    // Already logged in via beforeEach
    // Navigate to the profile page
    await page.getByRole("link", { name: /profile/i }).click();

    // Wait for navigation and check URL
    await page.waitForURL(/.*\/dashboard\/profile/);
    await expect(page).toHaveURL(/.*\/dashboard\/profile/);

    // Check for the main heading
    await expect(
      page.getByRole("heading", { name: "My Profile", level: 1 })
    ).toBeVisible();

    // Check for the profile update form elements
    await expect(
      page.getByRole("heading", { name: "Update Profile" })
    ).toBeVisible();
    // Use data-testid for profile form elements
    await expect(page.getByTestId("profile-firstname-input")).toBeVisible();
    await expect(page.getByTestId("profile-lastname-input")).toBeVisible();
    await expect(page.getByTestId("profile-save-button")).toBeVisible();

    // Check for the address management section
    await expect(
      page.getByRole("heading", { name: "Manage Addresses" })
    ).toBeVisible();
    // Use data-testid for Add New Address button
    await expect(page.getByTestId("add-new-address-button")).toBeVisible();
    // Check for existing addresses or the "no addresses" message using data-testid (already updated)
    const addressCardLocator = page.getByTestId(/address-card-.+/);
    const noAddressLocator = page.getByText(/no saved addresses/i);
    await expect(addressCardLocator.first().or(noAddressLocator)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should allow updating profile details", async ({ page }) => {
    // Already logged in and on dashboard via beforeEach
    await page.goto("/dashboard/profile"); // Ensure we are on the profile page

    const newFirstName = `TestUpdated_${Date.now()}`;
    const newLastName = "CustomerUpdated";

    // Fill in new details using data-testid
    await page.getByTestId("profile-firstname-input").fill(newFirstName);
    await page.getByTestId("profile-lastname-input").fill(newLastName);

    // Click save using data-testid
    await page.getByTestId("profile-save-button").click();

    // Check for success toast
    await expect(page.getByText("Profile updated successfully.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the input fields retain the new values after update using data-testid
    await expect(page.getByTestId("profile-firstname-input")).toHaveValue(
      newFirstName
    );
    await expect(page.getByTestId("profile-lastname-input")).toHaveValue(
      newLastName
    );
  });

  test("should allow adding a new address", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Click the "Add New Address" button using data-testid
    const addAddressButton = page.getByTestId("add-new-address-button");
    await expect(addAddressButton).toBeVisible();
    await addAddressButton.click();

    // Wait for the dialog to appear and fill the form
    const dialogLocator = page.getByRole("dialog"); // Use role locator for dialog
    await expect(dialogLocator).toBeVisible();
    await expect(
      dialogLocator.getByRole("heading", { name: "Add New Address" })
    ).toBeVisible();

    const street = `123 Test St ${Date.now()}`; // Unique street
    const city = "Testville";
    const state = "TS";
    const postalCode = "12345";
    const country = "Testland";

    // Use data-testid for dialog inputs
    await dialogLocator.getByTestId("address-street-input").fill(street);
    await dialogLocator.getByTestId("address-city-input").fill(city);
    await dialogLocator.getByTestId("address-state-input").fill(state);
    await dialogLocator
      .getByTestId("address-postalcode-input")
      .fill(postalCode);
    await dialogLocator.getByTestId("address-country-input").fill(country);

    // Submit the address form within the dialog using data-testid (already updated)
    await dialogLocator.getByTestId("address-form-submit-button").click();

    // Check for success toast
    await expect(page.getByText("Address added successfully.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the dialog closes
    await expect(dialogLocator).not.toBeVisible();

    // Verify the new address appears in the list on the profile page using data-testid (TODO 11)
    const newAddressCard = page
      .getByTestId(/address-card-.+/)
      .filter({ hasText: street });
    await expect(newAddressCard).toBeVisible();
    await expect(
      newAddressCard.filter({ hasText: `${city}, ${state} ${postalCode}` })
    ).toBeVisible();
    await expect(newAddressCard.filter({ hasText: country })).toBeVisible();
  });

  test("should allow editing an existing address", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Find the non-default seeded address card and its edit button using data-testid (TODO 11 & 12)
    // Assuming the second seeded address (456 Oak Ave) is the non-default one
    const nonDefaultAddressCard = page
      .getByTestId(/address-card-.+/)
      .filter({ hasText: "456 Oak Ave" });
    await expect(nonDefaultAddressCard).toBeVisible({ timeout: 10000 });
    const editButton = nonDefaultAddressCard.getByTestId(
      /address-edit-button-.+/
    );
    await expect(editButton).toBeVisible();
    await editButton.click();

    // Wait for the dialog and fill in updated details
    const dialogLocator = page.getByRole("dialog"); // Use role locator
    await expect(dialogLocator).toBeVisible();
    await expect(
      dialogLocator.getByRole("heading", { name: "Edit Address" })
    ).toBeVisible();

    const updatedStreet = `456 Updated Ave ${Date.now()}`;
    const updatedCity = "Newville";

    // Use data-testid for dialog inputs (TODO 11)
    await dialogLocator.getByTestId("address-street-input").fill(updatedStreet);
    await dialogLocator.getByTestId("address-city-input").fill(updatedCity);
    // Keep other fields the same or update them too if needed

    // Submit the updated address using data-testid (already updated)
    await dialogLocator.getByTestId("address-form-submit-button").click();

    // Check for success toast
    await expect(page.getByText("Address updated successfully.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the dialog closes
    await expect(dialogLocator).not.toBeVisible();

    // Verify the updated address details appear on the page
    await expect(page.getByText(updatedStreet)).toBeVisible();
    await expect(page.getByText(new RegExp(updatedCity))).toBeVisible(); // Use regex for city check
  });

  test("should allow deleting an address (non-default)", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Seeding ensures two addresses exist (TODO 12)

    // Find the non-default address card using data-testid (TODO 11 & 12)
    // Assuming the second seeded address (456 Oak Ave) is the non-default one
    const nonDefaultCard = page
      .getByTestId(/address-card-.+/)
      .filter({ hasText: "456 Oak Ave" });
    await expect(nonDefaultCard).toBeVisible({ timeout: 10000 });

    // Get text content to verify deletion later
    const addressText = await nonDefaultCard.textContent();
    expect(addressText).not.toBeNull();

    // Click the delete button within that card using data-testid (TODO 11)
    const deleteButton = nonDefaultCard.getByTestId(/address-delete-button-.+/);
    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toBeEnabled(); // Ensure it's not the default one
    await deleteButton.click();

    // Handle confirmation if any (current implementation doesn't seem to have one)
    // page.on('dialog', dialog => dialog.accept()); // Example if using window.confirm

    // Check for success toast
    await expect(page.getByText("Address deleted successfully.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the address card is removed from the page
    // Check that the specific text content of the deleted address is no longer visible
    await expect(page.getByText(addressText!)).not.toBeVisible();
  });

  test("should allow setting an address as default", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Seeding ensures two addresses exist (TODO 12)
    const addressCards = page.getByTestId(/address-card-.+/);
    await expect(addressCards.nth(1)).toBeVisible({ timeout: 10000 }); // Wait for at least 2 addresses

    // Find the current default address card (seeded: 123 Main St) using data-testid (TODO 11 & 12)
    const currentDefaultCard = addressCards.filter({ hasText: "123 Main St" });
    await expect(currentDefaultCard.getByText("Default")).toBeVisible();

    // Find the non-default address card (seeded: 456 Oak Ave) using data-testid (TODO 11 & 12)
    const nonDefaultCard = addressCards.filter({ hasText: "456 Oak Ave" });
    await expect(nonDefaultCard).toBeVisible();
    await expect(nonDefaultCard.getByText("Default")).not.toBeVisible();

    // Click the "Set as Default" button on the non-default card using data-testid (TODO 11)
    const setDefaultButton = nonDefaultCard.getByTestId(
      /address-set-default-button-.+/
    );
    await expect(setDefaultButton).toBeVisible();
    await setDefaultButton.click();

    // Check for success toast
    await expect(page.getByText("Default address updated.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the clicked card (456 Oak Ave) now has the "Default" badge
    await expect(nonDefaultCard.getByText("Default")).toBeVisible();

    // Verify the previous default card (123 Main St) no longer has the badge
    await expect(currentDefaultCard.getByText("Default")).not.toBeVisible();
  });

  test("should allow downloading a purchased digital asset", async ({
    page,
  }) => {
    // 1. Navigate to the order history page
    await page.goto("/dashboard/orders");
    await expect(page).toHaveURL(/.*\/dashboard\/orders/);
    await expect(
      page.getByRole("heading", { name: "My Orders", level: 1 })
    ).toBeVisible();

    // 2. Find the order card containing the seeded digital product
    // Seed script creates 'Seeded Digital Product'
    const digitalOrderCard = page
      .locator("div[class*='space-y-6'] > div") // Assuming Card structure
      .filter({ hasText: /Seeded Digital Product/i });
    await expect(digitalOrderCard).toBeVisible({ timeout: 10000 });

    // 3. Find the download button/link within that card
    // The link points to /api/download/[assetId]
    const downloadLink = digitalOrderCard.locator("a[href*='/api/download/']");
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toContainText("Download");

    // 4. Initiate download and wait for the event
    const downloadPromise = page.waitForEvent("download");
    await downloadLink.click();

    // 5. Assert download occurred and check suggested filename (optional)
    const download = await downloadPromise;
    // The filename depends on what's seeded. Let's assume it contains 'seeded-digital'
    // If the seed script changes the asset name, update this assertion.
    // For now, we'll just check if *a* download happened.
    expect(download).toBeTruthy();
    // Optional: Check filename if it's deterministic from seeding
    // expect(download.suggestedFilename()).toContain('seeded-digital-asset'); // Example filename check
  });

  test("should show validation errors for address form", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Click the "Add New Address" button
    await page.getByTestId("add-new-address-button").click();

    // Wait for the dialog to appear
    const dialogLocator = page.getByRole("dialog");
    await expect(dialogLocator).toBeVisible();
    await expect(
      dialogLocator.getByRole("heading", { name: "Add New Address" })
    ).toBeVisible();

    // Attempt to submit the empty form
    await dialogLocator.getByTestId("address-form-submit-button").click();

    // Check for validation messages within the dialog
    await expect(
      dialogLocator.locator(
        '[data-testid="address-street-input"] + [id$="-form-item-message"]'
      )
    ).toContainText(/Street is required/i);
    await expect(
      dialogLocator.locator(
        '[data-testid="address-city-input"] + [id$="-form-item-message"]'
      )
    ).toContainText(/City is required/i);
    await expect(
      dialogLocator.locator(
        '[data-testid="address-state-input"] + [id$="-form-item-message"]'
      )
    ).toContainText(/State\/Province is required/i);
    await expect(
      dialogLocator.locator(
        '[data-testid="address-postalcode-input"] + [id$="-form-item-message"]'
      )
    ).toContainText(/Postal code is required/i);
    await expect(
      dialogLocator.locator(
        '[data-testid="address-country-input"] + [id$="-form-item-message"]'
      )
    ).toContainText(/Country is required/i);

    // Ensure no success toast appeared
    await expect(
      page.getByText("Address added successfully.")
    ).not.toBeVisible();
  });

  test("should prevent deleting the default address", async ({ page }) => {
    await page.goto("/dashboard/profile");

    // Find the default address card (seeded: 123 Main St)
    const defaultAddressCard = page
      .getByTestId(/address-card-.+/)
      .filter({ hasText: "123 Main St" });
    await expect(defaultAddressCard).toBeVisible({ timeout: 10000 });
    await expect(defaultAddressCard.getByText("Default")).toBeVisible();

    // Find the delete button within that card
    const deleteButton = defaultAddressCard.getByTestId(
      /address-delete-button-.+/
    );
    await expect(deleteButton).toBeVisible();

    // Assert the delete button is disabled
    await expect(deleteButton).toBeDisabled();

    // Optional: Attempt to click (though it shouldn't do anything if disabled)
    // await deleteButton.click({ force: true }); // Use force only if needed for test stability

    // Ensure no deletion success/error toast appeared specifically for this action
    await expect(
      page.getByText("Address deleted successfully.")
    ).not.toBeVisible();
  });
});
