import { test, expect } from "@playwright/test";

// TODO: Implement proper authentication state management or global setup
// Assumes 'testvendor@example.com' with password 'password123' exists and is ACTIVE.

test.describe("Vendor Dashboard Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Log in as an active test vendor before each test
    await page.goto("/login");
    await page.getByLabel("Email").fill("testvendor@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();
    // Wait for navigation to the main dashboard first
    await page.waitForURL(/.*dashboard/);
    // Navigate specifically to the vendor section if not default
    // Assuming the main dashboard might show links or redirect
    // For now, let's assume direct access or navigation happens correctly
    // We might need to add explicit navigation to /dashboard/vendor if needed
    await expect(
      page.getByRole("heading", { name: /dashboard/i, level: 1 })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should display the main vendor dashboard page", async ({ page }) => {
    // Navigate explicitly if beforeEach doesn't land directly on vendor page
    await page.goto("/dashboard/vendor");
    await expect(page).toHaveURL(/.*\/dashboard\/vendor/);

    // Check for elements specific to the vendor dashboard
    await expect(
      page.getByRole("heading", { name: "Vendor Dashboard", level: 1 })
    ).toBeVisible();
    // Check for key sections/links like Products, Orders, Balance/Withdrawal
    await expect(page.getByRole("link", { name: /products/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /orders/i })).toBeVisible();
    await expect(page.getByText(/Available Balance/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Request Withdrawal/i })
    ).toBeVisible();
  });

  test("should display the vendor products page", async ({ page }) => {
    // Navigate from main dashboard to products page
    await page.goto("/dashboard/vendor/products"); // Or click link if reliable locator exists
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/products/);

    // Check for page heading and key elements
    await expect(
      page.getByRole("heading", { name: "Manage Products" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Add New Product" })
    ).toBeVisible();

    // Check for the product table or the "No products found" message using data-testid
    const productTable = page.locator("table");
    const noProductsMessage = page.getByTestId("vendor-products-empty-message");
    await expect(productTable.or(noProductsMessage)).toBeVisible({
      timeout: 10000,
    });
    // Check filter input exists
    await expect(
      page.getByTestId("vendor-products-filter-input")
    ).toBeVisible();
  });

  test("should allow creating a new physical product", async ({ page }) => {
    await page.goto("/dashboard/vendor/products/new");
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/products\/new/);

    // Check for page heading
    await expect(
      page.getByRole("heading", { name: "Add New Product" })
    ).toBeVisible();

    // Fill in the form using data-testid
    const uniqueTitle = `Test Physical Product ${Date.now()}`;
    await page.getByTestId("product-title-input").fill(uniqueTitle);
    await page
      .getByTestId("product-description-textarea")
      .fill("This is a test physical product description.");
    await page.getByTestId("product-price-input").fill("2999"); // $29.99
    await page.getByTestId("product-stock-input").fill("50");
    // Assuming category selection is optional or has a default
    // await page.getByTestId("product-category-select").click(); ... select item ...
    await page.getByTestId("product-tags-input").fill("test, physical, e2e");

    // Ensure Physical is checked (should be default) and Digital is not using data-testid
    await expect(page.getByTestId("product-physical-checkbox")).toBeChecked();
    await expect(
      page.getByTestId("product-digital-checkbox")
    ).not.toBeChecked();

    // Simulate file upload for the image using data-testid
    await page.getByTestId("product-image-input").setInputFiles({
      name: "test-image.png",
      mimeType: "image/png",
      buffer: Buffer.from("dummy png data"), // Simple buffer
    });

    // Submit the form using data-testid
    await page.getByTestId("product-form-submit-button").click();

    // Check for success toast
    await expect(page.getByText("Product created successfully!")).toBeVisible({
      timeout: 15000, // Allow time for upload and processing
    });

    // Verify redirection back to the product list
    await page.waitForURL(/.*\/dashboard\/vendor\/products/);
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/products/);

    // Verify the new product appears in the table
    await expect(page.getByRole("cell", { name: uniqueTitle })).toBeVisible();
  });

  test("should allow creating a new digital product", async ({ page }) => {
    await page.goto("/dashboard/vendor/products/new");
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/products\/new/);

    // Check for page heading
    await expect(
      page.getByRole("heading", { name: "Add New Product" })
    ).toBeVisible();

    // Fill in the form using data-testid
    const uniqueTitle = `Test Digital Product ${Date.now()}`;
    await page.getByTestId("product-title-input").fill(uniqueTitle);
    await page
      .getByTestId("product-description-textarea")
      .fill("This is a test digital product description.");
    await page.getByTestId("product-price-input").fill("1499"); // $14.99
    await page.getByTestId("product-stock-input").fill("999"); // Stock might be less relevant for digital
    await page
      .getByTestId("product-tags-input")
      .fill("test, digital, e2e, download");

    // Check Digital Product and uncheck Physical Product using data-testid
    await page.getByTestId("product-digital-checkbox").check();
    await page.getByTestId("product-physical-checkbox").uncheck();
    await expect(page.getByTestId("product-digital-checkbox")).toBeChecked();
    await expect(
      page.getByTestId("product-physical-checkbox")
    ).not.toBeChecked();

    // Simulate file upload for the image using data-testid
    await page.getByTestId("product-image-input").setInputFiles({
      name: "test-digital-image.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.from("dummy jpg data"),
    });

    // Simulate file upload for the digital asset using data-testid
    await page.getByTestId("product-asset-input").setInputFiles({
      name: "test-asset.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("dummy pdf file content"),
    });

    // Submit the form using data-testid
    await page.getByTestId("product-form-submit-button").click();

    // Check for success toast
    await expect(page.getByText("Product created successfully!")).toBeVisible({
      timeout: 15000, // Allow time for uploads and processing
    });

    // Verify redirection back to the product list
    await page.waitForURL(/.*\/dashboard\/vendor\/products/);
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/products/);

    // Verify the new product appears in the table
    await expect(page.getByRole("cell", { name: uniqueTitle })).toBeVisible();
  });

  test("should allow editing an existing product", async ({ page }) => {
    await page.goto("/dashboard/vendor/products");

    // Find the row for the seeded product (TODO 13 & 14)
    const productRow = page
      .locator("tr")
      .filter({ hasText: "Seeded Simple Product" });
    await expect(productRow).toBeVisible({ timeout: 10000 });

    // Find and click the actions trigger within that row using data-testid (TODO 13)
    const actionsTrigger = productRow.getByTestId(/product-actions-trigger-.+/);
    await expect(actionsTrigger).toBeVisible();
    await actionsTrigger.click();

    // Find and click the edit menu item using data-testid (TODO 13)
    const editMenuItem = page.getByTestId(/product-edit-action-.+/); // Menu items are usually attached to body
    await expect(editMenuItem).toBeVisible();
    const productEditUrl = await editMenuItem.getAttribute("href"); // Get href from the Link inside
    expect(productEditUrl).not.toBeNull();

    // Navigate to edit page by clicking the menu item
    await editMenuItem.click();
    await page.waitForURL(`**${productEditUrl}`);
    await expect(page).toHaveURL(productEditUrl!);

    // Check for edit page heading
    await expect(
      page.getByRole("heading", { name: "Edit Product" })
    ).toBeVisible();

    // Update title and description using data-testid
    const updatedTitle = `Edited Product ${Date.now()}`;
    const updatedDescription = "This product description has been updated.";
    await page.getByTestId("product-title-input").fill(updatedTitle);
    await page
      .getByTestId("product-description-textarea")
      .fill(updatedDescription);

    // Optional: Simulate changing the image using data-testid
    // await page.getByTestId("product-image-input").setInputFiles(...)

    // Submit the changes using data-testid
    await page.getByTestId("product-form-submit-button").click();

    // Check for success toast
    await expect(page.getByText("Product updated successfully!")).toBeVisible({
      timeout: 15000, // Allow time for potential upload and processing
    });

    // Verify redirection back to the product list
    await page.waitForURL(/.*\/dashboard\/vendor\/products/);
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/products/);

    // Verify the updated product title appears in the table
    await expect(page.getByRole("cell", { name: updatedTitle })).toBeVisible();
  });

  test("should allow deleting an existing product", async ({ page }) => {
    await page.goto("/dashboard/vendor/products");

    // Find the row for the seeded product (TODO 13 & 14)
    const productRow = page
      .locator("tr")
      .filter({ hasText: "Seeded Simple Product" });
    await expect(productRow).toBeVisible({ timeout: 10000 });

    // Get the title of the product to be deleted
    const productTitle = "Seeded Simple Product"; // Use known title

    // Find and click the actions trigger within that row using data-testid (TODO 13)
    const actionsTrigger = productRow.getByTestId(/product-actions-trigger-.+/);
    await expect(actionsTrigger).toBeVisible();
    await actionsTrigger.click();

    // Find the delete menu item using data-testid (TODO 13)
    const deleteMenuItem = page.getByTestId(/product-delete-action-.+/); // Menu items are usually attached to body
    await expect(deleteMenuItem).toBeVisible();

    // Handle the confirmation dialog automatically (TODO 15 - assuming window.confirm for now)
    page.on("dialog", (dialog) => dialog.accept());

    // Click the delete menu item
    await deleteMenuItem.click();

    // Check for success toast
    await expect(page.getByText("Product deleted successfully!")).toBeVisible({
      timeout: 10000,
    });

    // Verify the product row with that title is no longer visible
    await expect(
      page.locator("tr").filter({ hasText: productTitle })
    ).not.toBeVisible();
  });

  test("should display the vendor order items page", async ({ page }) => {
    await page.goto("/dashboard/vendor/orders");
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/orders/);

    // Check for page heading
    await expect(
      page.getByRole("heading", { name: "My Order Items" })
    ).toBeVisible();

    // Check for the order items table or the "no order items" message using data-testid
    const orderTable = page.locator("table");
    const noOrdersMessage = page.getByTestId("vendor-orders-empty-message");
    await expect(orderTable.or(noOrdersMessage)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should allow updating order item status", async ({ page }) => {
    await page.goto("/dashboard/vendor/orders");
    await expect(page).toHaveURL(/.*\/dashboard\/vendor\/orders/);

    // Find the seeded order item row (TODO 14)
    // Assuming the seeded item is for 'Seeded Simple Product'
    const orderItemRow = page
      .locator("table tbody tr")
      .filter({ hasText: /Seeded Simple Product/i });
    await expect(orderItemRow).toBeVisible({ timeout: 10000 }); // Ensure row exists
    // Verify initial status is PENDING_FULFILLMENT
    await expect(
      orderItemRow.getByTestId(/order-item-status-badge-.+/)
    ).toHaveText(/Pending Fulfillment/i);

    // Click the actions menu for that row
    const actionsButton = orderItemRow.getByRole("button", {
      name: "Open menu",
    });
    await actionsButton.click();
    // Removed duplicate declaration and incorrect reference below

    // Click the 'Mark as Shipped' menu item
    const markShippedButton = page.getByRole("menuitem", {
      name: "Mark as Shipped",
    });
    await expect(markShippedButton).toBeVisible();
    await markShippedButton.click();

    // Check for success toast
    await expect(page.getByText("Order item status updated.")).toBeVisible({
      timeout: 10000,
    });

    // Verify the status badge in the same row now shows 'Shipped' using data-testid (TODO 17)
    await expect(
      orderItemRow.getByTestId(/order-item-status-badge-.+/)
    ).toHaveText(/Shipped/i);
  });

  test("should allow requesting a withdrawal", async ({ page }) => {
    await page.goto("/dashboard/vendor"); // Go to main vendor dashboard

    // Find the withdrawal request card using data-testid (TODO 16)
    const withdrawalCard = page.getByTestId("withdrawal-request-card");
    await expect(withdrawalCard).toBeVisible();

    // Find the amount input and submit button within the card using data-testid
    const amountInput = withdrawalCard.getByTestId("withdrawal-amount-input");
    const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");

    await expect(amountInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    // Assume PIX key is set and balance is sufficient for the test amount
    await expect(submitButton).toBeEnabled();

    // Enter withdrawal amount (e.g., $10.00)
    await amountInput.fill("10.00");

    // Click the request button
    await submitButton.click();

    // Check for success toast
    await expect(
      page.getByText("Withdrawal request submitted successfully.")
    ).toBeVisible({ timeout: 10000 });

    // Verify the amount input is cleared (due to form reset on success)
    await expect(amountInput).toHaveValue("");
  });

  test("should allow answering a product question", async ({ page }) => {
    // 1. Navigate to the product page where the question was seeded
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);

    // 2. Find the specific question seeded
    const questionText = "What are the dimensions of this product?";
    const questionItem = page
      .locator("[data-testid^='qa-item-']")
      .filter({ hasText: questionText });
    await expect(questionItem).toBeVisible({ timeout: 10000 }); // Wait for Q&A to load

    // 3. Find the answer textarea and submit button within that question item
    const answerTextarea = questionItem.locator(
      "[data-testid^='qa-answer-textarea-']"
    );
    const submitAnswerButton = questionItem.locator(
      "[data-testid^='qa-answer-submit-button-']"
    );

    await expect(answerTextarea).toBeVisible();
    await expect(submitAnswerButton).toBeVisible();
    await expect(submitAnswerButton).toBeDisabled(); // Should be disabled initially

    // 4. Fill in the answer
    const answerText = `The dimensions are 10x5x2 inches. Test Answer ${Date.now()}`;
    await answerTextarea.fill(answerText);
    await expect(submitAnswerButton).toBeEnabled(); // Should be enabled now

    // 5. Submit the answer
    await submitAnswerButton.click();

    // 6. Check for success toast
    await expect(page.getByText("Answer submitted successfully!")).toBeVisible({
      timeout: 10000,
    });

    // 7. Verify the answer form is gone and the answer text is displayed
    await expect(answerTextarea).not.toBeVisible();
    await expect(submitAnswerButton).not.toBeVisible();
    await expect(questionItem.getByText(answerText)).toBeVisible();
    // Optional: Check for the "Answered by" text
    await expect(questionItem.getByText(/A: Test Vendor/i)).toBeVisible();
  });

  test("should show validation errors for product form", async ({ page }) => {
    await page.goto("/dashboard/vendor/products/new");
    await expect(
      page.getByRole("heading", { name: "Add New Product" })
    ).toBeVisible();

    // Attempt to submit empty form
    await page.getByTestId("product-form-submit-button").click();

    // Check for validation messages (using FormMessage convention)
    await expect(
      page.locator(
        '[data-testid="product-title-input"] + [id$="-form-item-message"]'
      ) // Assuming FormMessage follows input
    ).toContainText(/Title must be at least 3 characters/i);
    await expect(
      page.locator(
        '[data-testid="product-price-input"] + * [id$="-form-item-message"]'
      ) // Price has description, so check sibling's child
    ).toContainText(/Price must be positive/i);
    await expect(
      page.locator(
        '[data-testid="product-stock-input"] + * [id$="-form-item-message"]'
      ) // Stock has description
    ).toContainText(/Stock cannot be negative/i); // Or similar based on schema

    // Fill title, but invalid price
    await page.getByTestId("product-title-input").fill("Valid Title");
    await page.getByTestId("product-price-input").fill("-100");
    await page.getByTestId("product-form-submit-button").click();
    await expect(
      page.locator(
        '[data-testid="product-price-input"] + * [id$="-form-item-message"]'
      )
    ).toContainText(/Price must be positive/i);

    // Fill valid price, but missing image
    await page.getByTestId("product-price-input").fill("1999");
    await page.getByTestId("product-form-submit-button").click();
    // Check for toast message about missing image (as file input validation is harder)
    await expect(page.getByText("Product image is required.")).toBeVisible();

    // Check missing asset for digital product
    await page.getByTestId("product-digital-checkbox").check();
    await page.getByTestId("product-physical-checkbox").uncheck();
    // Upload image but not asset
    await page.getByTestId("product-image-input").setInputFiles({
      name: "test-image.png",
      mimeType: "image/png",
      buffer: Buffer.from("dummy png data"),
    });
    await page.getByTestId("product-form-submit-button").click();
    await expect(
      page.getByText("Digital asset file is required for digital products.")
    ).toBeVisible();

    // Ensure no success toast appeared during these failures
    await expect(
      page.getByText("Product created successfully!")
    ).not.toBeVisible();
  });

  test("should show validation errors for withdrawal form", async ({
    page,
  }) => {
    await page.goto("/dashboard/vendor"); // Go to main vendor dashboard

    const withdrawalCard = page.getByTestId("withdrawal-request-card");
    const amountInput = withdrawalCard.getByTestId("withdrawal-amount-input");
    const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");

    // Test non-numeric input
    await amountInput.fill("abc");
    await submitButton.click();
    await expect(
      withdrawalCard.locator('[id$="-form-item-message"]') // Find FormMessage within card
    ).toContainText(/Please enter a valid amount/i);

    // Test negative input
    await amountInput.fill("-10.00");
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
    await page.goto("/dashboard/vendor");

    const withdrawalCard = page.getByTestId("withdrawal-request-card");
    const amountInput = withdrawalCard.getByTestId("withdrawal-amount-input");
    const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");

    // Assume balance is less than $9999.99 for test vendor
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
    // Log out the default vendor and log in as the vendor without PIX key
    await page.getByTestId("navbar-logout-button").click();
    await page.waitForURL("/");

    await page.goto("/login");
    await page.getByLabel("Email").fill("vendor-no-pix@example.com"); // Seeded user without PIX
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL(/.*dashboard/);

    // Navigate to vendor dashboard
    await page.goto("/dashboard/vendor");
    await expect(page).toHaveURL(/.*\/dashboard\/vendor/);

    const withdrawalCard = page.getByTestId("withdrawal-request-card");
    const amountInput = withdrawalCard.getByTestId("withdrawal-amount-input");
    const submitButton = withdrawalCard.getByTestId("withdrawal-submit-button");
    const noPixWarning = withdrawalCard.getByTestId(
      "withdrawal-no-pix-warning"
    );

    // Verify warning message is shown and button is disabled
    await expect(noPixWarning).toBeVisible();
    await expect(noPixWarning).toContainText(/PIX Key not set/i);
    await expect(submitButton).toBeDisabled();

    // Attempt to fill amount (should still be disabled)
    await amountInput.fill("10.00");
    await expect(submitButton).toBeDisabled();
  });
});
