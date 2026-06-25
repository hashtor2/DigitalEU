import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Radix UI (e.g. Header dropdowns) expects ResizeObserver in jsdom.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub;

// Rydd opp DOM-en mellom hver test.
afterEach(() => {
  cleanup();
});
