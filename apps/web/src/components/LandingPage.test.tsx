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
  it("viser hovedoverskriften", () => {
    renderLanding();
    expect(
      screen.getByRole("heading", { level: 1, name: /digitale livet/i }),
    ).toBeInTheDocument();
  });

  it("lenker den primære call-to-action til dashbordet", () => {
    renderLanding();
    const cta = screen.getByRole("link", { name: /skann innboksen min/i });
    expect(cta).toHaveAttribute("href", "/dashboard");
  });

  it("viser tillitssignalet om datalagring i Sveits/Zürich", () => {
    renderLanding();
    expect(screen.getAllByText(/sveits|zürich/i).length).toBeGreaterThan(0);
  });

  it("rendrer et kort per alternativ fra katalogen", () => {
    renderLanding();
    for (const alt of ALTERNATIVES) {
      expect(screen.getByText(alt.name)).toBeInTheDocument();
    }
  });
});
