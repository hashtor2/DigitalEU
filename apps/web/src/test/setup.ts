import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Rydd opp DOM-en mellom hver test.
afterEach(() => {
  cleanup();
});
