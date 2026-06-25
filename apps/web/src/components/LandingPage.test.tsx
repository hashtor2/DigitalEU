import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LandingPage } from "./LandingPage";

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
}

// The landing page is a scan funnel. It promotes the email scanner (auto-scan)
// and offers a manual path (checkbox grid of Big Tech services). The EU
// alternatives catalog lives in the menu / directory, not on this page.
describe("LandingPage", () => {
  it("shows the scan headline in English", () => {
    renderLanding();
    expect(
      screen.getByRole("heading", { level: 1, name: /scan your inbox now/i }),
    ).toBeInTheDocument();
  });

  it("offers the primary auto-scan call-to-action", () => {
    renderLanding();
    expect(
      screen.getByRole("button", { name: /auto-scan/i }),
    ).toBeInTheDocument();
  });

  it("offers the manual account-checking path", () => {
    renderLanding();
    // Manual selection section heading (the second user path).
    expect(
      screen.getByRole("heading", { name: /manual checking/i }),
    ).toBeInTheDocument();
  });

  it("shows the trust signal about data hosting in Sweden/Stockholm", () => {
    renderLanding();
    expect(screen.getAllByText(/Sweden|🇸🇪/i).length).toBeGreaterThan(0);
  });
});
