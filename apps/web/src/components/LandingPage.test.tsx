import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SERVICES } from "@digitaleu/shared";
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
      screen.getByRole("heading", { level: 1, name: /scan your inbox now/i }),
    ).toBeInTheDocument();
  });

  it("shows the primary auto-scan call-to-action", () => {
    renderLanding();
    expect(
      screen.getByRole("button", { name: /start auto-scan/i }),
    ).toBeInTheDocument();
  });

  it("shows the trust signal about data hosting in Sweden/Stockholm", () => {
    renderLanding();
    expect(screen.getAllByText(/Sweden|🇸🇪/i).length).toBeGreaterThan(0);
  });

  it("renders services in the manual selection grid", () => {
    renderLanding();

    for (const service of SERVICES.slice(0, 5)) {
      expect(screen.getAllByText(service.name).length).toBeGreaterThan(0);
    }
  });
});
