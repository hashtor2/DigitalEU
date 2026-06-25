import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

// Header pulls migration state from Supabase; keep it unconfigured in tests.
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}

describe("DashboardPage (privacy report)", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows the privacy-report heading and intro badge", () => {
    renderDashboard();
    expect(
      screen.getByRole("heading", { name: /these are your accounts/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Your Privacy Report", { exact: true })).toBeInTheDocument();
  });

  it("filters the table to the services selected on the selector page", () => {
    sessionStorage.setItem(
      "digitaleu_selected",
      JSON.stringify(["facebook", "instagram"]),
    );
    renderDashboard();

    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();

    // The "Total Services" summary card should reflect the 2-service selection.
    const totalCard = screen.getByText(/total services/i).closest("div")!;
    expect(totalCard).toHaveTextContent("2");
  });

  it("warns about services with a HIGH threat score", () => {
    sessionStorage.setItem(
      "digitaleu_selected",
      JSON.stringify(["facebook", "instagram"]),
    );
    renderDashboard();
    expect(screen.getByText(/with high threat score/i)).toBeInTheDocument();
  });

  it("links back to the selector and over to the EU alternatives directory", () => {
    renderDashboard();
    expect(
      screen.getByRole("link", { name: /change selection/i }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("link", { name: /browse eu alternatives/i }),
    ).toHaveAttribute("href", "/directory");
  });
});
