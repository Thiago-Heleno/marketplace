// vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()], // Resolves tsconfig.json path aliases like @/lib [6, 8, 10],
  test: {
    environment: "jsdom", // Simulates browser environment for DOM APIs [1, 5, 6]
    globals: true, // Makes describe, it, expect, vi globally available [1, 5, 6]
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"], // Default pattern for test files [2, 6]
    setupFiles: ["./vitest.setup.ts"], // Specifies global setup file [1, 5, 6]
    server: {
      deps: {
        inline: ["next"],
      },
    },
  },
});
