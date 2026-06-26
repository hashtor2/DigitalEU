import { z } from 'zod';
// Zod-skjemaer for Web-Bridge validering
const SetMigrationTargetSchema = z.object({
    type: z.literal("SET_MIGRATION_TARGET"),
    targetEmail: z.string().email(),
});
const GetExtensionStatusSchema = z.object({
    type: z.literal("GET_EXTENSION_STATUS"),
});
const AllowedOrigins = ["https://digitaleu.me", "https://www.digitaleu.me", "http://localhost:5173"];
// Lytter på meldinger fra både web-dashboardet (eksterne meldinger) og content-scripts (interne meldinger)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    // Sikkerhetssjekk: Verifiser at forespørselen kommer fra vår egen portal
    if (!sender.url || !AllowedOrigins.some(origin => sender.url.startsWith(origin))) {
        console.warn("[background] Avvist melding fra uautorisert origin:", sender.url);
        sendResponse({ success: false, error: "Unauthorized origin" });
        return;
    }
    if (message.type === "SET_MIGRATION_TARGET") {
        const parseResult = SetMigrationTargetSchema.safeParse(message);
        if (!parseResult.success) {
            console.warn("[background] Ugyldig payload for SET_MIGRATION_TARGET:", parseResult.error);
            sendResponse({ success: false, error: "Invalid payload schema" });
            return;
        }
        const { targetEmail } = parseResult.data;
        chrome.storage.local.set({ targetEmail }, () => {
            console.log("[background] Mål-epost lagret i utvidelsen:", targetEmail);
            sendResponse({ success: true, targetEmail });
        });
        return true; // Asynkron sendResponse
    }
    if (message.type === "GET_EXTENSION_STATUS") {
        const parseResult = GetExtensionStatusSchema.safeParse(message);
        if (!parseResult.success) {
            sendResponse({ success: false, error: "Invalid payload schema" });
            return;
        }
        chrome.storage.local.get(["targetEmail", "switchedCount"], (result) => {
            sendResponse({
                success: true,
                active: true,
                targetEmail: result.targetEmail || null,
                switchedCount: result.switchedCount || 0
            });
        });
        return true;
    }
    return true; // Holder svar-kanalen åpen for andre asynkrone kall
});
// Intern kommunikasjon
const AccountSwitchedSuccessSchema = z.object({
    type: z.literal("ACCOUNT_SWITCHED_SUCCESS"),
});
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "ACCOUNT_SWITCHED_SUCCESS") {
        const parseResult = AccountSwitchedSuccessSchema.safeParse(message);
        if (parseResult.success) {
            chrome.storage.local.get("switchedCount", (result) => {
                const currentCount = result.switchedCount || 0;
                chrome.storage.local.set({ switchedCount: currentCount + 1 }, () => {
                    console.log("[background] Incrementert antall byttede kontoer:", currentCount + 1);
                    sendResponse({ success: true });
                });
            });
            return true;
        }
    }
});
