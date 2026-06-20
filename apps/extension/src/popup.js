/**
 * V1 Popup controller — file upload, account queue, guided flows.
 *
 * Security: all data stays in chrome.storage.local — no network calls.
 */
import { parseUploadedFile } from "./parser";
import { matchEntries } from "./matcher";
import { readUploadedEntries, writeUploadedEntries, clearUploadedEntries, readExtensionState, } from "./storage";
import { getPlaybook } from "./playbooks";
// ──────────────────────────────────────────────
// State
// ──────────────────────────────────────────────
let pendingEntries = [];
let importedEntries = [];
let activeEntry = null;
let activeGuideType = null;
let currentStepIndex = 0;
// ──────────────────────────────────────────────
// DOM helpers
// ──────────────────────────────────────────────
function el(id) {
    return document.getElementById(id);
}
function showNotif(msg, type, durationMs = 3000) {
    const n = el("notif");
    n.className = type;
    n.textContent = msg;
    if (durationMs > 0)
        setTimeout(() => { n.className = ""; n.textContent = ""; }, durationMs);
}
// ──────────────────────────────────────────────
// Tab navigation
// ──────────────────────────────────────────────
function activateTab(tabName) {
    document.querySelectorAll(".tab").forEach((t) => {
        t.classList.toggle("active", t.dataset["tab"] === tabName);
    });
    document.querySelectorAll(".view").forEach((v) => {
        v.classList.toggle("active", v.id === `view-${tabName}`);
    });
}
// ──────────────────────────────────────────────
// Upload view
// ──────────────────────────────────────────────
function setupUploadZone() {
    const zone = el("upload-zone");
    const input = el("file-input");
    zone.addEventListener("click", () => input.click());
    zone.addEventListener("keydown", (e) => { if (e.key === "Enter")
        input.click(); });
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        const file = e.dataTransfer?.files?.[0];
        if (file)
            handleFile(file);
    });
    input.addEventListener("change", () => {
        const file = input.files?.[0];
        if (file)
            handleFile(file);
        input.value = "";
    });
}
async function handleFile(file) {
    const progress = el("parse-progress");
    const fill = el("progress-fill");
    const stats = el("parse-stats");
    const results = el("upload-results");
    const summary = el("result-summary");
    progress.classList.add("visible");
    fill.style.width = "30%";
    stats.textContent = "Parsing…";
    results.style.display = "none";
    const result = await parseUploadedFile(file);
    fill.style.width = "70%";
    stats.textContent = "Matching services…";
    if (result.warnings.length > 0 && result.accepted.length === 0) {
        progress.classList.remove("visible");
        showNotif(result.warnings[0], "error", 5000);
        return;
    }
    const matched = matchEntries(result.accepted, "txt");
    pendingEntries = matched;
    fill.style.width = "100%";
    const highCount = matched.filter((e) => e.confidence === "high").length;
    const medCount = matched.filter((e) => e.confidence === "medium").length;
    const lowCount = matched.filter((e) => e.confidence === "low").length;
    const rejCount = result.rejected.length;
    summary.innerHTML = `
    <div style="color:var(--green);margin-bottom:2px;">✓ <strong>${matched.length}</strong> entries parsed</div>
    <div style="color:var(--muted);font-size:11px;">
      <span style="color:var(--green)">${highCount} high confidence</span> ·
      <span style="color:var(--yellow)">${medCount} medium</span> ·
      <span>${lowCount} unmatched</span>
      ${rejCount > 0 ? ` · <span style="color:var(--red)">${rejCount} skipped</span>` : ""}
    </div>
    ${result.warnings.map((w) => `<div style="color:var(--yellow);font-size:10px;margin-top:4px;">⚠ ${w}</div>`).join("")}
  `;
    setTimeout(() => { progress.classList.remove("visible"); results.style.display = "block"; }, 300);
}
function setupImportButtons() {
    el("btn-confirm-import").addEventListener("click", async () => {
        if (pendingEntries.length === 0)
            return;
        importedEntries = [...importedEntries, ...pendingEntries];
        await writeUploadedEntries(importedEntries);
        pendingEntries = [];
        el("upload-results").style.display = "none";
        updateFooterCount();
        renderQueue();
        activateTab("queue");
        showNotif(`${importedEntries.length} accounts imported`, "success");
    });
    el("btn-cancel-import").addEventListener("click", () => {
        pendingEntries = [];
        el("upload-results").style.display = "none";
        el("parse-progress").classList.remove("visible");
    });
}
// ──────────────────────────────────────────────
// Queue view
// ──────────────────────────────────────────────
function renderQueue() {
    const matched = importedEntries.filter((e) => e.confidence !== "low");
    const unmatched = importedEntries.filter((e) => e.confidence === "low");
    const matchedEl = el("queue-matched");
    const reviewEl = el("queue-review");
    const reviewSection = el("queue-review-section");
    const emptyEl = el("queue-empty");
    if (importedEntries.length === 0) {
        matchedEl.innerHTML = "";
        reviewEl.innerHTML = "";
        reviewSection.style.display = "none";
        emptyEl.style.display = "block";
        return;
    }
    emptyEl.style.display = "none";
    matchedEl.innerHTML = matched.map((e) => renderAccountItem(e)).join("");
    reviewSection.style.display = unmatched.length > 0 ? "block" : "none";
    reviewEl.innerHTML = unmatched.map((e) => renderAccountItem(e)).join("");
    document.querySelectorAll(".account-item").forEach((item) => {
        item.addEventListener("click", () => {
            const id = item.dataset["id"];
            const entry = importedEntries.find((e) => e.id === id);
            if (entry)
                openGuide(entry);
        });
    });
}
function renderAccountItem(e) {
    const name = e.matchedServiceName ?? e.domain ?? e.rawValue;
    const emailLabel = e.email ?? e.domain ?? "";
    const badgeClass = e.confidence === "high" ? "badge-high" : e.confidence === "medium" ? "badge-medium" : "badge-low";
    const badgeText = e.confidence === "high" ? "✓ matched" : e.confidence === "medium" ? "~ matched" : "?";
    return `
    <div class="account-item" data-id="${e.id}">
      <div>
        <div class="account-name">${escHtml(name)}</div>
        <div class="account-email">${escHtml(emailLabel)}</div>
      </div>
      <span class="badge ${badgeClass}">${badgeText}</span>
    </div>
  `;
}
function escHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// ──────────────────────────────────────────────
// Guide view
// ──────────────────────────────────────────────
function openGuide(entry) {
    activeEntry = entry;
    activeGuideType = null;
    currentStepIndex = 0;
    el("guide-select-prompt").style.display = "none";
    el("guide-runner").style.display = "block";
    el("guide-service-name").textContent = entry.matchedServiceName ?? entry.domain ?? entry.rawValue;
    el("guide-type-label").textContent = "Choose a guide type below";
    el("guide-steps").innerHTML = "";
    el("delete-safety-gate").style.display = "none";
    el("guide-nav").style.display = "none";
    // Show/hide guide type buttons based on available playbooks
    const playbook = entry.matchedServiceId ? getPlaybook(entry.matchedServiceId) : undefined;
    const typeSelector = el("guide-type-selector");
    typeSelector.querySelectorAll("[data-guide]").forEach((btn) => {
        const type = btn.dataset["guide"];
        btn.disabled = !playbook?.guides?.[type];
        btn.title = !playbook?.guides?.[type] ? "Not available for this service" : "";
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-ghost");
    });
    activateTab("guide");
}
function loadGuideSteps(guideType) {
    if (!activeEntry?.matchedServiceId)
        return;
    const playbook = getPlaybook(activeEntry.matchedServiceId);
    const steps = playbook?.guides?.[guideType];
    if (!steps || steps.length === 0) {
        showNotif("No guide available for this service and action.", "warn");
        return;
    }
    activeGuideType = guideType;
    currentStepIndex = 0;
    const isDelete = guideType === "delete-account";
    el("guide-type-label").textContent = isDelete ? "Delete Account Guide" : "Change Email Guide";
    // Delete-account: show safety gate first, hide nav until confirmed
    if (isDelete) {
        el("delete-safety-gate").style.display = "block";
        el("guide-nav").style.display = "none";
        renderSteps(steps, -1); // all grayed out until gate passed
    }
    else {
        el("delete-safety-gate").style.display = "none";
        el("guide-nav").style.display = "flex";
        renderSteps(steps, 0);
        el("btn-step-action").textContent = "Open site & start →";
    }
}
function renderSteps(steps, currentIdx) {
    el("guide-steps").innerHTML = steps.map((s, i) => {
        const cls = i < currentIdx ? "guide-step done" : i === currentIdx ? "guide-step current" : "guide-step";
        const numContent = i < currentIdx ? "✓" : String(i + 1);
        return `
      <div class="${cls}" data-step="${i}">
        <div class="step-num">${numContent}</div>
        <div>
          <div class="step-text">${escHtml(s.title)}</div>
          ${s.fallbackInstruction ? `<div class="step-instruction">${escHtml(s.fallbackInstruction)}</div>` : ""}
        </div>
      </div>
    `;
    }).join("");
}
function advanceStep() {
    if (!activeEntry?.matchedServiceId || !activeGuideType)
        return;
    const playbook = getPlaybook(activeEntry.matchedServiceId);
    const steps = playbook?.guides?.[activeGuideType];
    if (!steps)
        return;
    currentStepIndex++;
    if (currentStepIndex >= steps.length) {
        renderSteps(steps, steps.length);
        el("guide-nav").style.display = "none";
        showNotif("Guide complete! ✓", "success", 5000);
        return;
    }
    renderSteps(steps, currentStepIndex);
    const step = steps[currentStepIndex];
    el("btn-step-action").textContent = step?.actionType === "navigate" ? "Open page →" : "Mark done →";
}
function setupGuideControls() {
    el("btn-guide-back").addEventListener("click", () => {
        el("guide-select-prompt").style.display = "block";
        el("guide-runner").style.display = "none";
        activeEntry = null;
        activeGuideType = null;
    });
    el("guide-type-selector").querySelectorAll("[data-guide]").forEach((btn) => {
        btn.addEventListener("click", () => {
            if (btn.disabled)
                return;
            el("guide-type-selector").querySelectorAll("[data-guide]").forEach((b) => {
                b.classList.remove("btn-primary");
                b.classList.add("btn-ghost");
            });
            btn.classList.remove("btn-ghost");
            btn.classList.add("btn-primary");
            loadGuideSteps(btn.dataset["guide"]);
        });
    });
    el("btn-step-action").addEventListener("click", () => {
        if (!activeEntry?.matchedServiceId || !activeGuideType)
            return;
        const playbook = getPlaybook(activeEntry.matchedServiceId);
        const step = playbook?.guides?.[activeGuideType]?.[currentStepIndex];
        if (step?.actionType === "navigate" && playbook?.loginUrl) {
            if (typeof chrome !== "undefined" && chrome.tabs?.create) {
                chrome.tabs.create({ url: playbook.loginUrl, active: true });
            }
            else {
                window.open(playbook.loginUrl, "_blank", "noopener,noreferrer");
            }
        }
        advanceStep();
    });
    el("btn-step-skip").addEventListener("click", advanceStep);
    // Safety gate checkboxes
    const safetyChecks = ["sc-1", "sc-2", "sc-3", "sc-4"].map((id) => el(id));
    const proceedBtn = el("btn-safety-proceed");
    safetyChecks.forEach((cb) => {
        cb.addEventListener("change", () => {
            proceedBtn.disabled = !safetyChecks.every((c) => c.checked);
        });
    });
    proceedBtn.addEventListener("click", () => {
        el("guide-nav").style.display = "flex";
        if (activeEntry?.matchedServiceId && activeGuideType) {
            const steps = getPlaybook(activeEntry.matchedServiceId)?.guides?.[activeGuideType] ?? [];
            renderSteps(steps, 0);
            el("btn-step-action").textContent = "Open site & start →";
        }
    });
}
// ──────────────────────────────────────────────
// Settings view
// ──────────────────────────────────────────────
function setupSettings() {
    el("btn-clear-data").addEventListener("click", async () => {
        if (!confirm("Clear all extension data? This cannot be undone."))
            return;
        await clearUploadedEntries();
        importedEntries = [];
        pendingEntries = [];
        renderQueue();
        updateFooterCount();
        el("target-email-display").textContent = "Not set";
        showNotif("All local data cleared.", "info");
    });
}
// ──────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────
function updateFooterCount() {
    const n = importedEntries.length;
    el("footer-count").textContent = n === 0 ? "0 accounts tracked" : `${n} account${n !== 1 ? "s" : ""} tracked`;
}
// ──────────────────────────────────────────────
// Init
// ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    // Tab switching
    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => activateTab(tab.dataset["tab"]));
    });
    // Load persisted entries
    importedEntries = await readUploadedEntries();
    updateFooterCount();
    renderQueue();
    // Load target email for settings view
    const state = await readExtensionState();
    el("target-email-display").textContent = state.targetEmail ?? "Not set";
    el("header-mode").textContent = state.targetEmail ? "Migration active" : "";
    setupUploadZone();
    setupImportButtons();
    setupGuideControls();
    setupSettings();
});
