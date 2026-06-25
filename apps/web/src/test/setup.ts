import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom mangler ResizeObserver, som Radix UI-komponenter bruker.
// Legg inn en minimal polyfill så komponenttester ikke krasjer ved render.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Rydd opp DOM-en mellom hver test.
afterEach(() => {
  cleanup();
});
