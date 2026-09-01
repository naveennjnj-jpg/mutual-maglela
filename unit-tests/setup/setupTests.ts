import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount rendered components between tests so effects/subscriptions
// from one test don't leak into the next.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement matchMedia. ThemeContext relies on it for the
// "system" theme, so provide a minimal deterministic mock.
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated API, some libs still call it
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );

  // Start every test with a clean localStorage so auth/theme state
  // doesn't bleed between tests.
  window.localStorage.clear();
});
