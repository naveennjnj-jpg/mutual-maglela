/// <reference types="node" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Deliberately a *separate* file from vite.config.ts (which stays
// untouched). `vitest` looks for vitest.config.ts before vite.config.ts,
// so this is picked up automatically when you run `npm test` — it never
// changes what `npm run dev` / `npm run build` do.
//
// Crucially, this file lives at the project root, so `npm install` here
// gives every test the SAME node_modules that src/ itself resolves
// against. That's what fixes the "two copies of React" / axios-mock-
// never-firing bug you hit when the test tooling lived in its own
// nested node_modules — Vitest externalizes real npm packages (loads
// them via plain `require`), which walks up from the importing file and
// must land on the same node_modules the app already uses.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Same alias as vite.config.ts, so src's "@/..." imports resolve
      // identically under test.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Your app's real postcss/tailwind v4 pipeline (@tailwindcss/postcss)
  // is already installed here, so it would work in tests too — but
  // nothing under test imports CSS, so we skip it for faster, simpler
  // runs. Safe no-op either way.
  css: {
    postcss: {
      plugins: [],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: [
      fileURLToPath(new URL("./unit-tests/setup/setupTests.ts", import.meta.url)),
    ],
    css: false,
    include: ["unit-tests/__tests__/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/main.tsx", "src/vite-env.d.ts"],
    },
  },
});
