"use strict";
/**
 * Popup Script (Manifest V3)
 *
 * SIKKERHET & PERSONVERN:
 * Henter og viser KUN de lagrede statistikkene og måladressen lokalt fra
 * chrome.storage.local. Ingen telemetri, ingen ekstern logging.
 */
document.addEventListener("DOMContentLoaded", () => {
    const sessionMode = document.getElementById("session-mode");
    const sessionSync = document.getElementById("session-sync");
    // Hent lagrede verdier fra utvidelsens lokale lagring
    chrome.storage.local.get(["targetEmail"], (result) => {
        if (result.targetEmail) {
            if (sessionMode) {
                sessionMode.innerText = "Migration Active 🚀";
                sessionMode.className = "font-semibold text-emerald-400";
            }
            if (sessionSync) {
                sessionSync.innerText = result.targetEmail;
                sessionSync.className = "font-mono text-emerald-300 font-bold text-[10px] break-all";
            }
        }
        else {
            if (sessionMode) {
                sessionMode.innerText = "Waiting for Target...";
                sessionMode.className = "font-semibold text-slate-500";
            }
            if (sessionSync) {
                sessionSync.innerText = "No secure email linked";
                sessionSync.className = "font-mono text-slate-500 text-[10px]";
            }
        }
    });
});
