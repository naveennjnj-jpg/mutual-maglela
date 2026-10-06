import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

const ASSET_RE = /\.(png|jpe?g|svg|webp|gif|avif|ico|mp4|webm|pdf)$/i;

// Resolve any image/media import that is missing on disk to a stub string,
// so tests don't fail on assets that aren't part of the checkout.
const stubMissingAssets = () => ({
  name: "stub-missing-assets",
  enforce: "pre" as const,
  resolveId(id: string, importer?: string) {
    if (!ASSET_RE.test(id)) return null;
    const file = id.startsWith("@/")
      ? path.resolve(__dirname, "src", id.slice(2))
      : importer
        ? path.resolve(path.dirname(importer), id)
        : id;
    return fs.existsSync(file) ? null : "\0stub-asset:" + id;
  },
  load(id: string) {
    return id.startsWith("\0stub-asset:") ? 'export default "test-file-stub";' : null;
  },
});

const hasRealUi = fs.existsSync(path.resolve(__dirname, "src/components/ui"));

export default defineConfig({
  plugins: [stubMissingAssets(), react()],
  resolve: {
    alias: [
      // Only used when src/components/ui is not present (e.g. partial checkout)
      ...(hasRealUi
        ? []
        : [
            { find: /^@\/components\/ui\/(.*)$/, replacement: path.resolve(__dirname, "unit-tests/mocks/ui/$1.tsx") },
            { find: /^(\.\.\/)+components\/ui\/(.*)$/, replacement: path.resolve(__dirname, "unit-tests/mocks/ui/$2.tsx") },
            { find: /^\.\.\/ui\/(.*)$/, replacement: path.resolve(__dirname, "unit-tests/mocks/ui/$1.tsx") },
          ]),
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./unit-tests/setup/setup.ts", "./unit-tests/setup/commonMocks.tsx"],
    include: ["unit-tests/**/*.test.{ts,tsx}"],
    css: false,
    assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.svg", "**/*.webp"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/vite-env.d.ts", "src/**/*.d.ts"],
      reporter: ["text", "html"],
    },
  },
});