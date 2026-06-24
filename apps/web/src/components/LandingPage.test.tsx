import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ALTERNATIVES } from "@digitaleu/shared";
import { LandingPage } from "./LandingPage";

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

describe("LandingPage", () => {
  it("shows the main heading in English", () => {
    renderLanding();
    expect(
      screen.getByRole("heading", { level: 1, name: /your data is in the wrong hands/i }),
    ).toBeInTheDocument();
  });

  it("links the primary call-to-action to the service selector in English", () => {
    renderLanding();
    const cta = screen.getByRole("link", { name: /check my accounts/i });
    expect(cta).toHaveAttribute("href", "/b2c");
  });

  it("shows the trust signal about data hosting in Sweden/Stockholm", () => {
    renderLanding();
    expect(screen.getAllByText(/Sweden|🇸🇪/i).length).toBeGreaterThan(0);
  });

  it("renders the preview of alternatives (first 3 of each of the first 8 categories)", () => {
    renderLanding();

    // Helper function to group alternatives by category (same as in LandingPage)
    function groupByCategory(alts: typeof ALTERNATIVES) {
      const map = new Map<string, typeof ALTERNATIVES>();
      for (const alt of alts) {
        const existing = map.get(alt.category) ?? [];
        existing.push(alt);
        map.set(alt.category, existing);
      }
      return Array.from(map.entries());
    }

    const grouped = groupByCategory(ALTERNATIVES);
    const renderedAltIds = new Set<string>();
    for (let i = 0; i < Math.min(8, grouped.length); i++) {
      const [category, alts] = grouped[i];
      for (let j = 0; j < Math.min(3, alts.length); j++) {
        renderedAltIds.add(alts[j].id);
      }
    }

    // Check that each rendered alternative is in the document
    for (const alt of ALTERNATIVES) {
      if (renderedAltIds.has(alt.id)) {
        expect(screen.getByText(alt.name)).toBeInTheDocument();
      }
    }
  });
});
