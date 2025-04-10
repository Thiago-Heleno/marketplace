import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    server: {
      deps: {
        inline: ["next"],
      },
    },
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/tests/setup.ts"], // Add the setup file here
    // Optionally configure coverage
    // coverage: {
    //   provider: 'v8', // or 'istanbul'
    //   reporter: ['text', 'json', 'html'],
    // },
  },
});
