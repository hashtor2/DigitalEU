/**
 * Background Service Worker (Manifest V3)
 *
 * SIKKERHET & PERSONVERN:
 * Bakgrunnsarbeideren lytter etter meldinger fra godkjente origins (digitaleu.me eller localhost under utvikling).
 * Den lagrer KUN den midlertidige måladressen (f.eks. bruker@proton.me) lokalt i nettleserens
 * krypterte lagring (chrome.storage.local). Ingen data sendes eksternt.
 */

interface StorageData {
  targetEmail?: string;
  switchedCount?: number;
}

// Lytter på meldinger fra både web-dashboardet (eksterne meldinger) og content-scripts (interne meldinger)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  // Sikkerhetssjekk: Verifiser at forespørselen kommer fra vår egen portal
  const allowedOrigins = ["https://digitaleu.me", "http://localhost:5173"];
  if (!sender.url || !allowedOrigins.some(origin => sender.url!.startsWith(origin))) {
    console.warn("[background] Avvist melding fra uautorisert origin:", sender.url);
    sendResponse({ success: false, error: "Unauthorized origin" });
    return;
  }

  if (message.type === "SET_MIGRATION_TARGET") {
    const { targetEmail } = message;
    if (targetEmail && targetEmail.includes("@")) {
      chrome.storage.local.set({ targetEmail }, () => {
        console.log("[background] Mål-epost lagret i utvidelsen:", targetEmail);
        sendResponse({ success: true, targetEmail });
      });
    } else {
      sendResponse({ success: false, error: "Invalid email format" });
    }
  }

  if (message.type === "GET_EXTENSION_STATUS") {
    chrome.storage.local.get(["targetEmail", "switchedCount"], (result: StorageData) => {
      sendResponse({
        success: true,
        active: true,
        targetEmail: result.targetEmail || null,
        switchedCount: result.switchedCount || 0
      });
    });
  }

  return true; // Holder svar-kanalen åpen for asynkrone kall
});

// Intern kommunikasjon (fra content script når en konto markeres som byttet)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "ACCOUNT_SWITCHED_SUCCESS") {
    chrome.storage.local.get("switchedCount", (result: StorageData) => {
      const currentCount = result.switchedCount || 0;
      chrome.storage.local.set({ switchedCount: currentCount + 1 }, () => {
        console.log("[background] Incrementert antall byttede kontoer:", currentCount + 1);
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
