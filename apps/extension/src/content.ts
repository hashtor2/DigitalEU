/**
 * Content Script (Manifest V3)
 *
 * SIKKERHET & PERSONVERN:
 * Kjører isolert i eksterne nettsider. Den skanner kun etter email-inntastingsfelt
 * og injiserer en fyll-knapp. Den lagrer ingen passord, og logger ingen personlig aktivitet.
 */

// Sjekk om siden inneholder et "endre e-post" felt
function findEmailInputFields(): HTMLInputElement[] {
  const inputs = Array.from(document.querySelectorAll("input"));
  return inputs.filter((input) => {
    const type = input.getAttribute("type")?.toLowerCase();
    const name = input.getAttribute("name")?.toLowerCase() || "";
    const id = input.getAttribute("id")?.toLowerCase() || "";
    const placeholder = input.getAttribute("placeholder")?.toLowerCase() || "";

    // Typiske mønstre for nye e-post-felter på innstillingssider
    return (
      type === "email" &&
      (name.includes("new") ||
        name.includes("confirm") ||
        id.includes("new") ||
        id.includes("confirm") ||
        placeholder.includes("new") ||
        placeholder.includes("confirm") ||
        name === "email" ||
        id === "email")
    );
  });
}

function injectAutofillButtons() {
  const targetFields = findEmailInputFields();
  if (targetFields.length === 0) return;

  chrome.storage.local.get("targetEmail", (result) => {
    const email = result.targetEmail;
    if (!email) {
      console.log("[DigitalEU Content] Ingen måladresse satt i utvidelsen ennå.");
      return;
    }

    targetFields.forEach((field) => {
      // Unngå duplikat-injisering
      if (field.dataset.digitaleuInjected === "true") return;
      field.dataset.digitaleuInjected = "true";

      // Opprett fyll-knapp element
      const btn = document.createElement("button");
      btn.type = "button";
      btn.innerText = "🇪🇺 Autofill Proton/Tuta";
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
        window.postMessage(
          { type: "DIGITALEU_AUTOFILL_COMPLETED", domain: window.location.hostname },
          "*"
        );
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
  const allowedOrigins = ["https://digitaleu.me", "http://localhost:5173"];
  if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) return;

  if (event.data?.type === "DIGITALEU_SET_TARGET" && event.data?.targetEmail) {
    const { targetEmail } = event.data;
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
