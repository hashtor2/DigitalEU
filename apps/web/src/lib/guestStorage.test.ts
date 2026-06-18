import { describe, it, expect, beforeEach } from "vitest";
import {
  loadGuestState,
  saveGuestState,
  clearGuestState,
  EMPTY_MIGRATION_STATE,
  type MigrationState,
} from "./guestStorage";

describe("guestStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returnerer tom state når ingenting er lagret", () => {
    expect(loadGuestState()).toEqual(EMPTY_MIGRATION_STATE);
  });

  it("lagrer og laster tilbake samme state (round-trip)", () => {
    const state: MigrationState = {
      accounts: [
        { id: "gmail", domain: "gmail.com", serviceName: "Gmail", status: "switched" },
      ],
    };
    saveGuestState(state);
    expect(loadGuestState()).toEqual(state);
  });

  it("tømmer state", () => {
    saveGuestState({ accounts: [{ id: "x", domain: "x.com", serviceName: "X", status: "detected" }] });
    clearGuestState();
    expect(loadGuestState()).toEqual(EMPTY_MIGRATION_STATE);
  });

  it("krasjer ikke på korrupt JSON", () => {
    sessionStorage.setItem("digitaleu:migration-state", "{ikke gyldig json");
    expect(loadGuestState()).toEqual(EMPTY_MIGRATION_STATE);
  });
});
