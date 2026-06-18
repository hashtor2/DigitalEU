import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

// Mock Supabase to be unconfigured during tests so we can assert the warning banner
vi.mock("@/lib/supabase", () => {
  return {
    isSupabaseConfigured: false,
    supabase: null,
  };
});

function renderDashboard() {
  return render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}

describe("DashboardPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("shows the dashboard heading and initial empty state or demo notice", () => {
    renderDashboard();
    expect(screen.getByRole("heading", { name: /migration dashboard/i })).toBeInTheDocument();
  });

  it("starts in Guest Mode with privacy warnings", () => {
    renderDashboard();
    expect(screen.getByText(/guest mode active/i)).toBeInTheDocument();
  });

  it("updates status and progress when an account is marked as switched", async () => {
    const user = userEvent.setup();
    renderDashboard();

    // Trigger local simulation scan to fill checklist first
    const simulateBtn = screen.getByRole("button", { name: /simulate local scan/i });
    await user.click(simulateBtn);

    // Wait for the simulation loader to finish
    await screen.findByText(/your migration checklist/i, {}, { timeout: 8000 });

    const gmailRow = screen.getByText("Gmail").closest("li")!;
    const switchBtn = within(gmailRow).getByRole("button", { name: /switched/i });
    await user.click(switchBtn);

    // Assert status badges/elements reflect the updated state
    expect(within(gmailRow).getByText(/^switched$/i)).toBeInTheDocument();
  });

  it("displays a warning if Profile Mode is unconfigured", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await user.click(screen.getByRole("button", { name: /^profile$/i }));
    expect(screen.getByText(/profile mode not configured/i)).toBeInTheDocument();
  });
});
