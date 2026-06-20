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
      screen.getByRole("heading", { level: 1, name: /how private are your online accounts/i }),
    ).toBeInTheDocument();
  });

  it("links the primary call-to-action to the service selector in English", () => {
    renderLanding();
    const cta = screen.getByRole("link", { name: /check my privacy/i });
    expect(cta).toHaveAttribute("href", "/select");
  });

  it("shows the trust signal about data hosting in Switzerland/Zürich", () => {
    renderLanding();
    expect(screen.getAllByText(/sveits|zürich/i).length).toBeGreaterThan(0);
  });

  it("renders one card per alternative from the catalogue", () => {
    renderLanding();
    for (const alt of ALTERNATIVES) {
      expect(screen.getByText(alt.name)).toBeInTheDocument();
    }
  });
});
