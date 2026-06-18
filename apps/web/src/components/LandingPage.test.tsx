import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ALTERNATIVES } from "@digitaleu/shared";
import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("viser hovedoverskriften", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /digitale livet/i }),
    ).toBeInTheDocument();
  });

  it("viser den primære call-to-action-knappen", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("button", { name: /skann innboksen min/i }),
    ).toBeInTheDocument();
  });

  it("rendrer et kort per alternativ fra katalogen", () => {
    render(<LandingPage />);
    for (const alt of ALTERNATIVES) {
      expect(screen.getByText(alt.name)).toBeInTheDocument();
    }
  });
});
