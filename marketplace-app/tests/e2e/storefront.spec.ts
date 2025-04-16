import { test, expect } from "@playwright/test";

test.describe("Storefront Flows", () => {
  // Clear cart before each test in this suite (TODO 8)
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => localStorage.removeItem("marketplaceCart"));
  });

  test("Products page should load and display products", async ({ page }) => {
    await page.goto("/products");

    // Check for the main heading
    await expect(
      page.getByRole("heading", { name: "All Products", level: 1 })
    ).toBeVisible();

    // Check for the presence of product cards using data-testid (TODO 4)
    const productCardLocator = page.getByTestId(/product-card-.+/);

    // Wait for at least one product card to appear
    await expect(productCardLocator.first()).toBeVisible({ timeout: 15000 }); // Increased timeout for potential data loading

    // Check if there are multiple product cards (adjust count as needed)
    const count = await productCardLocator.count();
    expect(count).toBeGreaterThan(0);

    // Optional: Check details within the first card
    const firstCard = productCardLocator.first();
    await expect(firstCard.getByRole("heading")).toBeVisible(); // Check for title
    await expect(firstCard.getByText(/\$/)).toBeVisible(); // Check for price format
  });

  test("should display a single product page correctly", async ({ page }) => {
    await page.goto("/products");

    // Find the first product card using data-testid (TODO 4)
    const firstProductCard = page.getByTestId(/product-card-.+/).first();
    await expect(firstProductCard).toBeVisible({ timeout: 15000 });

    // Find the link within the card to get the href
    const firstProductLink = firstProductCard.locator("a[href*='/products/']");
    await expect(firstProductLink).toBeVisible();

    // Get the expected slug from the href
    const productHref = await firstProductLink.getAttribute("href");
    expect(productHref).not.toBeNull(); // Ensure href exists

    // Click the link to navigate
    await firstProductLink.click();

    // Wait for navigation and verify URL
    await page.waitForURL(`**${productHref}`); // Wait for the specific product URL
    await expect(page).toHaveURL(productHref!); // Assert the final URL

    // Check for key elements on the product detail page
    await expect(page.locator("h1")).toBeVisible(); // Product Title
    await expect(page.getByText(/\$/)).toBeVisible(); // Price
    await expect(page.getByText(/Description/i)).toBeVisible(); // Description section (or check content)
    await expect(
      page.getByRole("button", { name: /Add to Cart/i })
    ).toBeVisible(); // Add to Cart button
    await expect(
      page.getByRole("heading", { name: /Customer Reviews/i })
    ).toBeVisible(); // Reviews section
    await expect(
      page.getByRole("heading", { name: /Questions & Answers/i })
    ).toBeVisible(); // Q&A section
  });

  // --- Removed duplicate test block for "should allow searching for a known product" ---

  test("should display a category page correctly", async ({ page }) => {
    const categorySlug = "seeded-category"; // Use seeded slug (TODO 5)
    await page.goto(`/categories/${categorySlug}`);

    // Check for the category heading using seeded name (TODO 5)
    await expect(
      page.getByRole("heading", {
        name: /Category: Seeded Category/i,
        level: 1,
      })
    ).toBeVisible({ timeout: 10000 }); // Wait for potential data load

    // Check for product cards within this category using data-testid (TODO 4)
    const productCardLocator = page.getByTestId(/product-card-.+/);
    const noResultsLocator = page.getByText(
      /No products found in this category/i
    );

    await expect(productCardLocator.first().or(noResultsLocator)).toBeVisible({
      timeout: 15000,
    }); // Wait for either products or no results message
  });

  test("should allow adding a product to the cart", async ({ page }) => {
    // Navigate to the seeded simple product page (using its known slug)
    // Assuming generateSlug('Seeded Simple Product') -> 'seeded-simple-product'
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);

    // Find the Add to Cart button and click it
    const addToCartButton = page.getByRole("button", { name: /Add to Cart/i });
    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled(); // Ensure it's not disabled (e.g., out of stock)
    await addToCartButton.click();

    // Check for toast message (optional but good feedback)
    await expect(page.getByText("Item added to cart!")).toBeVisible();

    // Verify the cart count indicator in the navbar updates
    // Assuming the cart count is in a span within the cart button/link
    const cartIcon = page.getByTestId("navbar-cart-button"); // Use data-testid
    await expect(cartIcon.locator("span")).toHaveText("1");

    // Optional: Open cart sheet and verify item
    // await cartIcon.click();
    // await expect(page.locator('.cart-item-title')).toContainText('Product Title'); // Adjust locator
  });

  test("should allow adding a product with variants to the cart", async ({
    page,
  }) => {
    // Navigate to the seeded product page known to have variants (TODO 6)
    // Assuming generateSlug('Seeded Product With Variants') -> 'seeded-product-with-variants'
    const variantProductSlug = "seeded-product-with-variants";
    await page.goto(`/products/${variantProductSlug}`);
    await page.waitForURL(`**/products/${variantProductSlug}`);

    // Wait for page elements to load
    await expect(page.locator("h1")).toContainText(
      "Seeded Product With Variants"
    ); // Check title
    const addToCartButton = page.getByRole("button", { name: /Add to Cart/i });
    await expect(addToCartButton).toBeVisible();

    // Find the variant selector and select the first available variant using data-testid
    const firstVariantLabel = page.getByTestId(/variant-option-.+/).first();
    await expect(firstVariantLabel).toBeVisible();
    await firstVariantLabel.click();

    // Verify the button is enabled after selection (if it wasn't already)
    await expect(addToCartButton).toBeEnabled();

    // Click Add to Cart
    await addToCartButton.click();

    // Check for toast message
    await expect(page.getByText("Item added to cart!")).toBeVisible();

    // Verify cart count update using data-testid
    const cartIcon = page.getByTestId("navbar-cart-button");
    // The count might be 1 or more depending on previous tests/state,
    // so check it's greater than 0 or matches expected state.
    // For simplicity, let's assume it becomes '1' if the cart was empty.
    // A more robust test might clear the cart first using localStorage manipulation or UI.
    await expect(cartIcon.locator("span")).toHaveText("1"); // Adjust expected count if needed
  });

  test("should allow updating item quantity in cart", async ({ page }) => {
    // 1. Add the seeded simple product to the cart first
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);
    const addToCartButton = page.getByRole("button", { name: /Add to Cart/i });
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    await expect(page.getByText("Item added to cart!")).toBeVisible();
    const cartIcon = page.getByTestId("navbar-cart-button"); // Use data-testid
    await expect(cartIcon.locator("span")).toHaveText("1");

    // 2. Open the cart sheet
    await cartIcon.click();
    await expect(
      page.getByRole("heading", { name: "Shopping Cart" })
    ).toBeVisible();

    // 3. Find the quantity input for the first item using data-testid (TODO 9)
    // We need the variant ID. Since we added the simple product, it has no variant ID in the cart context.
    // Let's assume the cart context uses the product ID if variant ID is null.
    // We need to get the product ID from the seeded data or the URL.
    // const simpleProductId = simpleProductSlug.replace( // Removed unused variable
    //   "seeded-simple-product",
    //   ""
    // ); // Assuming slug matches ID part
    // This is fragile. A better approach would be to get the actual ID from the seeding script or context.
    // For now, let's assume the first item corresponds to the simple product.
    const firstCartItem = page.locator("[data-testid^='cart-item-']").first();
    const quantityInput = firstCartItem.locator(
      "[data-testid^='cart-item-quantity-input-']"
    );
    await expect(quantityInput).toBeVisible();
    await quantityInput.fill("3");

    // 4. Verify the cart count updates (might need a short wait for context update)
    await expect(cartIcon.locator("span")).toHaveText("3", { timeout: 5000 }); // Wait up to 5s for update

    // Optional: Verify subtotal updates if possible
  });

  test("should allow removing an item from the cart", async ({ page }) => {
    // 1. Add the seeded simple product to the cart first
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);
    const addToCartButton = page.getByRole("button", { name: /Add to Cart/i });
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    await expect(page.getByText("Item added to cart!")).toBeVisible();
    const cartIcon = page.getByTestId("navbar-cart-button"); // Use data-testid
    await expect(cartIcon.locator("span")).toHaveText("1");

    // 2. Open the cart sheet
    await cartIcon.click();
    await expect(
      page.getByRole("heading", { name: "Shopping Cart" })
    ).toBeVisible();

    // 3. Verify the item is present using data-testid (TODO 9)
    const firstCartItem = page.locator("[data-testid^='cart-item-']").first();
    await expect(firstCartItem).toBeVisible();
    // Optionally check title within the item
    await expect(firstCartItem.locator("a[href*='/products/']")).toContainText(
      /Seeded Simple Product/i
    );

    // 4. Find and click the remove button for that item using data-testid (TODO 9)
    const removeButton = firstCartItem.locator(
      "[data-testid^='cart-item-remove-button-']"
    );
    await expect(removeButton).toBeVisible();
    await removeButton.click();

    // 5. Verify the item is removed and empty cart message appears
    await expect(firstCartItem).not.toBeVisible();
    await expect(page.getByText("Your cart is empty.")).toBeVisible();

    // 6. Verify the cart count indicator is gone or shows 0
    // Playwright might not distinguish between 0 and hidden, check for non-existence
    await expect(cartIcon.locator("span")).not.toBeVisible();
  });

  // --- Phase 3: New Test Scenarios ---

  test("should allow searching for a known product", async ({ page }) => {
    // Assuming search input is available on the homepage or navbar
    await page.goto("/");
    const searchInput = page.locator('header input[type="search"]'); // Adjust if needed
    // TODO: Add data-testid to search input in Navbar.tsx
    await expect(searchInput).toBeVisible();

    const searchTerm = "Seeded Simple Product"; // Use a seeded product title
    await searchInput.fill(searchTerm);
    await searchInput.press("Enter");

    await page.waitForURL(`/search?q=${encodeURIComponent(searchTerm)}`);
    await expect(
      page.getByRole("heading", { name: `Search Results for: ${searchTerm}` })
    ).toBeVisible();

    // Verify the seeded product card is displayed using data-testid
    const productCard = page
      .getByTestId(/product-card-.+/)
      .filter({ hasText: searchTerm });
    await expect(productCard).toBeVisible();
  });

  test("should show 'no results' message for non-existent search term", async ({
    page,
  }) => {
    await page.goto("/");
    const searchInput = page.locator('header input[type="search"]'); // Adjust if needed
    await expect(searchInput).toBeVisible();

    const searchTerm = "NonExistentProductXYZ123";
    await searchInput.fill(searchTerm);
    await searchInput.press("Enter");

    await page.waitForURL(`/search?q=${encodeURIComponent(searchTerm)}`);
    await expect(
      page.getByRole("heading", { name: `Search Results for: ${searchTerm}` })
    ).toBeVisible();

    // Verify the "no results" message is displayed
    const noResultsLocator = page.getByText(/No products found matching/i);
    await expect(noResultsLocator).toBeVisible();
    await expect(page.getByTestId(/product-card-.+/)).not.toBeVisible();
  });

  test("should allow adding affiliate code in cart", async ({ page }) => {
    // 1. Add item to cart
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.getByTestId("add-to-cart-button").click();
    await expect(page.getByText("Item added to cart!")).toBeVisible();

    // 2. Open cart sheet
    await page.getByTestId("navbar-cart-button").click();
    await expect(
      page.getByRole("heading", { name: "Shopping Cart" })
    ).toBeVisible();

    // 3. Enter affiliate code
    const affiliateInput = page.getByTestId("cart-sheet-affiliate-code-input");
    await expect(affiliateInput).toBeVisible();
    await affiliateInput.fill("TESTCODE10"); // Example code
    await expect(affiliateInput).toHaveValue("TESTCODE10");
    // Note: No specific success/error assertion here unless the UI provides feedback on code validity
  });

  test("should redirect to Stripe checkout", async ({ page }) => {
    // 1. Add item to cart
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.getByTestId("add-to-cart-button").click();
    await expect(page.getByText("Item added to cart!")).toBeVisible();

    // 2. Open cart sheet
    await page.getByTestId("navbar-cart-button").click();
    await expect(
      page.getByRole("heading", { name: "Shopping Cart" })
    ).toBeVisible();

    // 3. Click Proceed to Checkout
    const checkoutButton = page.getByTestId("cart-sheet-checkout-button");
    await expect(checkoutButton).toBeEnabled();

    // Start waiting for the navigation to Stripe before clicking
    const navigationPromise = page.waitForURL(
      /https:\/\/checkout\.stripe\.com/
    );
    await checkoutButton.click();

    // Wait for the navigation to complete
    await navigationPromise;

    // Verify the URL is a Stripe checkout URL
    expect(page.url()).toContain("https://checkout.stripe.com/");
  });

  test("should show 'Out of Stock' for product with zero stock", async ({
    page: _page, // Prefix unused variable
  }) => {
    const outOfStockSlug = "seeded-out-of-stock-product"; // Use seeded slug
    await _page.goto(`/products/${outOfStockSlug}`); // Use _page
    await _page.waitForURL(`**/${outOfStockSlug}`); // Use _page

    await expect(_page.getByText("Out of Stock")).toBeVisible(); // Use _page
    const addToCartButton = _page.getByTestId("add-to-cart-button"); // Use _page
    await expect(addToCartButton).toBeDisabled();
  });

  test("should disable variant selection and add to cart for out-of-stock variant", async ({
    page,
  }) => {
    // Navigate to the seeded product with variants
    const variantProductSlug = "seeded-product-with-variants";
    await page.goto(`/products/${variantProductSlug}`);
    await page.waitForURL(`**/products/${variantProductSlug}`);

    // Find the out-of-stock variant ('Blue' was seeded with stock: 0)
    const outOfStockVariantLabel = page
      .getByTestId(/variant-option-.+/)
      .filter({ hasText: "Blue" }); // Find the 'Blue' variant label
    await expect(outOfStockVariantLabel).toBeVisible();

    // Check if the label or its associated radio button indicates disabled state
    // Option 1: Check label opacity (Tailwind class)
    await expect(outOfStockVariantLabel).toHaveClass(/opacity-50/);
    // Option 2: Check radio button disabled attribute (if applicable)
    // const radioInput = page.locator(`input[type="radio"][value="${variantId}"]`); // Need variant ID
    // await expect(radioInput).toBeDisabled();

    // Attempt to click the disabled variant (should not change selection state if truly disabled)
    // This might be hard to assert directly, focus on Add to Cart button state

    // Select the IN-STOCK variant first ('Red')
    const inStockVariantLabel = page
      .getByTestId(/variant-option-.+/)
      .filter({ hasText: "Red" });
    await inStockVariantLabel.click();
    const addToCartButton = page.getByTestId("add-to-cart-button");
    await expect(addToCartButton).toBeEnabled(); // Should be enabled for in-stock variant

    // Now attempt to select the OUT-OF-STOCK variant
    // Clicking the label might not work if fully disabled, but we check button state
    await outOfStockVariantLabel.click({ force: true }); // Use force if needed, though ideally it's visually disabled

    // Verify the Add to Cart button becomes disabled or shows "Out of Stock"
    // The button text/state might depend on implementation details
    await expect(addToCartButton).toBeDisabled();
    // OR await expect(addToCartButton).toContainText("Out of Stock");
  });

  test("should allow submitting a review", async ({ page }) => {
    // 1. Log in as customer first
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("testcustomer@example.com");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();
    await page.waitForURL(/.*dashboard/);

    // 2. Navigate to a product page
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);

    // 3. Fill and submit the review form
    await page.getByTestId("review-rating-stars").locator("svg").nth(3).click(); // Click 4th star (index 3) for 4 stars
    await page
      .getByTestId("review-comment-textarea")
      .fill("This is a test review comment.");
    await page.getByTestId("review-submit-button").click();

    // 4. Check for success toast
    await expect(page.getByText("Review submitted successfully!")).toBeVisible({
      timeout: 10000,
    });

    // 5. Optional: Verify review appears in the list (might need wait/reload)
    // await page.waitForTimeout(500); // Small delay for potential DOM update
    // await expect(page.getByTestId(/review-.+/).filter({ hasText: "This is a test review comment." })).toBeVisible();
  });

  test("should allow submitting a question", async ({ page }) => {
    // 1. Log in as customer first
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("testcustomer@example.com");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();
    await page.waitForURL(/.*dashboard/);

    // 2. Navigate to a product page
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);

    // 3. Fill and submit the question form
    const questionText = `This is a test question? ${Date.now()}`;
    await page.getByTestId("question-textarea").fill(questionText);
    await page.getByTestId("question-submit-button").click();

    // 4. Check for success toast
    await expect(
      page.getByText("Question submitted successfully!")
    ).toBeVisible({ timeout: 10000 });

    // 5. Optional: Verify question appears in the list (might need wait/reload)
    // await page.waitForTimeout(500);
    // await expect(page.getByTestId(/qa-item-.+/).filter({ hasText: questionText })).toBeVisible();
  });

  test("should show validation errors for review form", async ({ page }) => {
    // Log in first
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("testcustomer@example.com");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();
    await page.waitForURL(/.*dashboard/);

    // Navigate to product page
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);

    // Attempt to submit without selecting rating
    await page.getByTestId("review-submit-button").click();
    // Check for toast message (as rating is client-side state checked on submit)
    await expect(page.getByText("Please select a rating.")).toBeVisible();

    // Ensure no success toast appeared
    await expect(
      page.getByText("Review submitted successfully!")
    ).not.toBeVisible();
  });

  test("should show validation errors for question form", async ({ page }) => {
    // Log in first
    await page.goto("/login");
    await page
      .getByTestId("login-email-input")
      .fill("testcustomer@example.com");
    await page.getByTestId("login-password-input").fill("password123");
    await page.getByTestId("login-submit-button").click();
    await page.waitForURL(/.*dashboard/);

    // Navigate to product page
    const simpleProductSlug = "seeded-simple-product";
    await page.goto(`/products/${simpleProductSlug}`);
    await page.waitForURL(`**/products/${simpleProductSlug}`);

    // Attempt to submit empty question
    await page.getByTestId("question-submit-button").click();
    // Check for validation message below textarea
    await expect(
      page.locator(
        '[data-testid="question-textarea"] + [id$="-form-item-message"]'
      )
    ).toContainText(/Question must be at least 5 characters/i);

    // Attempt to submit short question
    await page.getByTestId("question-textarea").fill("Why?");
    await page.getByTestId("question-submit-button").click();
    await expect(
      page.locator(
        '[data-testid="question-textarea"] + [id$="-form-item-message"]'
      )
    ).toContainText(/Question must be at least 5 characters/i);

    // Ensure no success toast appeared
    await expect(
      page.getByText("Question submitted successfully!")
    ).not.toBeVisible();
  });
});
