import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

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

  it("viser dashbord-overskriften og demo-kontoer", () => {
    renderDashboard();
    expect(screen.getByRole("heading", { name: /ditt dashbord/i })).toBeInTheDocument();
    expect(screen.getByText("Gmail")).toBeInTheDocument();
  });

  it("starter i Gjestemodus med personvern-melding", () => {
    renderDashboard();
    expect(screen.getByText(/gjestemodus/i)).toBeInTheDocument();
  });

  it("oppdaterer status og fremdrift når en konto markeres som byttet", async () => {
    const user = userEvent.setup();
    renderDashboard();

    const gmailRow = screen.getByText("Gmail").closest("li")!;
    await user.click(within(gmailRow).getByRole("button", { name: /^byttet$/i }));

    // Etter klikk finnes "Byttet" både som status-badge OG som knapp i raden.
    expect(within(gmailRow).getAllByText(/^byttet$/i).length).toBe(2);
  });

  it("viser at Profilmodus ikke er konfigurert", async () => {
    const user = userEvent.setup();
    renderDashboard();
    await user.click(screen.getByRole("button", { name: /^profil$/i }));
    expect(screen.getByText(/ikke konfigurert/i)).toBeInTheDocument();
  });
});
