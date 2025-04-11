// vitest.setup.ts
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"; // Extends expect with DOM matchers

// Run cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Clear mock history after each test case
afterEach(() => {
  vi.clearAllMocks(); // or vi.resetAllMocks() depending on desired behavior
});
