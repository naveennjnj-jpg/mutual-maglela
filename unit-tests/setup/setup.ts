import "@testing-library/jest-dom/vitest";

import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

// ---- Suppress expected test warnings ----

const originalConsoleError = console.error;

beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation((...args) => {
    const message = args
      .map((arg) => (typeof arg === "string" ? arg : String(arg)))
      .join(" ");

    // React act() warnings
    if (message.includes("not wrapped in act")) {
      return;
    }

    // React Router warnings for intentionally tested/missing routes
    if (message.includes("No routes matched location")) {
      return;
    }

    // Keep all other console.error messages visible
    originalConsoleError(...args);
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ---- jsdom gaps ----

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}

(globalThis as any).ResizeObserver =
  (globalThis as any).ResizeObserver || RO;

(globalThis as any).IntersectionObserver =
  (globalThis as any).IntersectionObserver || IO;

window.scrollTo = vi.fn() as any;

Element.prototype.scrollIntoView = vi.fn();

(Element.prototype as any).hasPointerCapture = () => false;

(Element.prototype as any).releasePointerCapture = () => {};

URL.createObjectURL = vi.fn(() => "blob:mock");

URL.revokeObjectURL = vi.fn();

// Silence noisy app console.log output in test runs
vi.spyOn(console, "log").mockImplementation(() => {});