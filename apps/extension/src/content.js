import { z } from 'zod';
/**
 * Content Script (Manifest V3)
 *
 * SIKKERHET & PERSONVERN:
 * Kjører isolert i eksterne nettsider. Den skanner kun etter email-inntastingsfelt
 * og injiserer en fyll-knapp. Den lagrer ingen passord, og logger ingen personlig aktivitet.
 */
// Zod-skjema for Web-Bridge validering
const SetTargetSchema = z.object({
    type: z.literal("DIGITALEU_SET_TARGET"),
    targetEmail: z.string().email(),
});
// Sjekk om siden inneholder et "endre e-post" felt via SPE (Semantic Playbook Engine) - V1
function findEmailInputFields(hints) {
    const inputs = Array.from(document.querySelectorAll("input"));
    // 1. Explicit Selector
    if (hints?.selector) {
        const matched = Array.from(document.querySelectorAll(hints.selector));
        if (matched.length > 0)
            return matched;
    }
    return inputs.filter((input) => {
        const type = input.getAttribute("type")?.toLowerCase();
        const name = input.getAttribute("name")?.toLowerCase() || "";
        const id = input.getAttribute("id")?.toLowerCase() || "";
        const placeholder = input.getAttribute("placeholder")?.toLowerCase() || "";
        const ariaLabel = input.getAttribute("aria-label")?.toLowerCase() || "";
        const ariaLabelledBy = input.getAttribute("aria-labelledby") || "";
        // 2. ARIA Compliance
        if (hints?.ariaLabelHint) {
            const hint = hints.ariaLabelHint.toLowerCase();
            if (ariaLabel.includes(hint))
                return true;
            if (ariaLabelledBy) {
                const labelEl = document.getElementById(ariaLabelledBy);
                if (labelEl && labelEl.textContent?.toLowerCase().includes(hint))
                    return true;
            }
        }
        // 3. Semantic Context (Label matching)
        if (hints?.textContentHint && id) {
            const hint = hints.textContentHint.toLowerCase();
            const labels = Array.from(document.querySelectorAll(`label[for="${id}"]`));
            if (labels.some(l => l.textContent?.toLowerCase().includes(hint)))
                return true;
        }
        // 4. Attribute Querying (Fallback Heuristics)
        return (type === "email" &&
            (name.includes("new") ||
                name.includes("confirm") ||
                id.includes("new") ||
                id.includes("confirm") ||
                placeholder.includes("new") ||
                placeholder.includes("confirm") ||
                name === "email" ||
                id === "email"));
    });
}
function injectAutofillButtons(hints) {
    const targetFields = findEmailInputFields(hints);
    if (targetFields.length === 0)
        return;
    chrome.storage.local.get("targetEmail", (result) => {
        const email = result.targetEmail;
        if (!email) {
            console.log("[DigitalEU Content] Ingen måladresse satt i utvidelsen ennå.");
            return;
        }
        targetFields.forEach((field) => {
            // Unngå duplikat-injisering
            if (field.dataset.digitaleuInjected === "true")
                return;
            field.dataset.digitaleuInjected = "true";
            // Opprett fyll-knapp element
            const btn = document.createElement("button");
            btn.type = "button";
            btn.innerText = "🇪🇺 Autofill European Alternative";
            btn.title = `Fill in your new secure email: ${email}`;
            btn.style.marginLeft = "8px";
            btn.style.padding = "6px 12px";
            btn.style.backgroundColor = "#0ea5e9";
            btn.style.color = "#ffffff";
            btn.style.border = "none";
            btn.style.borderRadius = "6px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "12px";
            btn.style.fontWeight = "600";
            btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.15)";
            btn.style.transition = "background-color 0.2s";
            btn.addEventListener("mouseover", () => {
                btn.style.backgroundColor = "#38bdf8";
            });
            btn.addEventListener("mouseout", () => {
                btn.style.backgroundColor = "#0ea5e9";
            });
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                // Fyll feltet og fyr av events så React/Vue-apper oppdaterer staten sin
                field.value = email;
                field.dispatchEvent(new Event("input", { bubbles: true }));
                field.dispatchEvent(new Event("change", { bubbles: true }));
                // Vis en liten suksess-notifikasjon over feltet
                btn.innerText = "Filled ✓";
                btn.style.backgroundColor = "#10b981";
                // Rapporter suksess til bakgrunnen for statistikk-tracking
                chrome.runtime.sendMessage({ type: "ACCOUNT_SWITCHED_SUCCESS", domain: window.location.hostname });
                // Hvis portal-fanen vår er åpen, forsøk å koble til den for å oppdatere sjekklisten
                window.postMessage({ type: "DIGITALEU_AUTOFILL_COMPLETED", domain: window.location.hostname }, "*");
            });
            // Legg knappen rett ved siden av input-feltet
            if (field.parentNode) {
                field.parentNode.insertBefore(btn, field.nextSibling);
            }
        });
    });
}
// Sikker meldingsoverføring fra web-dashboardet til utvidelsen via Content Script
window.addEventListener("message", (event) => {
    // Sikkerhet: Godta kun meldinger fra godkjente domener under utvikling/produksjon
    const allowedOrigins = ["https://digitaleu.me", "https://www.digitaleu.me", "http://localhost:5173"];
    if (!allowedOrigins.some(origin => event.origin.startsWith(origin)))
        return;
    if (event.data?.type === "DIGITALEU_SET_TARGET") {
        const parseResult = SetTargetSchema.safeParse(event.data);
        if (!parseResult.success) {
            console.warn("[DigitalEU Extension] Ugyldig payload fra dashboard:", parseResult.error);
            return;
        }
        const { targetEmail } = parseResult.data;
        chrome.storage.local.set({ targetEmail }, () => {
            console.log("[DigitalEU Extension] Mål-epost synkronisert fra dashboard:", targetEmail);
        });
    }
});
// Kjør scanningen på mount og ved dynamiske DOM-endringer (SPAs)
injectAutofillButtons();
const observer = new MutationObserver(() => {
    injectAutofillButtons();
});
observer.observe(document.body, { childList: true, subtree: true });
