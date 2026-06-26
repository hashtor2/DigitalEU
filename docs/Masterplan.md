[26.06.2026 01:22] Hermes: Understood. This is the definitive blueprint.

I have synthesized all our discussions and the critical findings from your two research documents into this V3 specification. It is structured as a complete technical and product guide, designed to be reviewed by a mentor and to serve as the foundational document for development.

Here is the full specification.

---

DigitalEU - V3 Product & Architectural Specification

 Version: 3.0 (Final for Review)
 Date: 2026-06-25
 Status: This document supersedes all previous versions. It outlines the de-risked, policy-compliant, and technically feasible architecture for the DigitalEU platform. Development will proceed from this specification.

Executive Summary

DigitalEU is a privacy-first toolkit that empowers European consumers to discover their digital footprint and migrate their accounts from Big Tech to privacy-respecting European alternatives. The platform consists of two core products: a 100% client-side Email Scanner for discovery and a local-first Browser Extension for execution.

This V3 specification represents a critical architectural pivot based on deep technical and regulatory analysis. The previous server-side architecture has been deprecated to resolve three existential threats:
1.  Google's CASA Tier 2 Audit: A mandatory, expensive, and time-consuming security assessment, which a client-side architecture completely bypasses.
2.  Chrome Web Store's "Blue Argon" Policy: A ban on remote code execution, which our previous plan for dynamic "Playbooks" would have violated.
3.  GDPR Compliance Risk: A server-side model would classify DigitalEU as a "Data Controller" for highly sensitive "special category data," creating immense legal liability.

The new architecture redefines the product as a Local Migration Orchestrator. It is a zero-knowledge toolkit that runs entirely on the user's machine, ensuring the highest level of privacy and trust. This document provides the complete technical blueprint required for development.

Glossary of Terms

**LMO**
• Definition: Local Migration Orchestrator. The core product model. DigitalEU does not migrate data in the cloud; it orchestrates the process locally on the user's machine.

**SPE**
• Definition: Semantic Playbook Engine. The redesigned extension engine that uses heuristics and semantic analysis, not brittle CSS selectors, to guide users.

**CASA**
• Definition: Cloud Application Security Assessment. A mandatory Google audit for apps using restricted scopes with server-side processing. A key driver for our client-side pivot.

**MV3**
• Definition: Manifest V3. The current standard for browser extensions, which imposes strict security limitations (e.g., no remote code).

**Offscreen Document**
• Definition: An MV3 API for running long-duration client-side tasks without the background service worker being terminated. Critical for the scanner.

---

1. Product Vision: The Local Migration Orchestrator

The mission of DigitalEU is to make digital sovereignty accessible. We are not a "magic button" service that moves data for the user. We are an empowerment tool. Our product is a trusted, expert assistant that runs locally on the user's computer, providing them with the discovery, the plan, and the specific tools to execute their own migration securely and confidently.

Our value is not in replacing the user, but in guiding them through a complex process with clarity and privacy at its core.

2. Core Products & Unified Workflow

2.1. The Email Scanner (Discovery)
A web-based tool at digitaleu.me/scanner that connects to a user's inbox via OAuth and discovers their digital footprint.

2.2. The Browser Extension (Execution)
A Manifest V3 browser extension ("DigitalEU Autofill & Migrator") that receives the discovered account list and provides guided, service-specific workflows for migration and deletion.

2.3. The Handoff: The Core User Experience
[26.06.2026 01:22] Hermes: The unified workflow is the product's primary competitive moat.

1.  User runs the client-side scan.
2.  On the results page, they see a button: "Send to Extension".
3.  Clicking it securely transfers the entire discovered account list to the extension.
4.  The extension's "Queue" is now pre-populated with a personalized checklist.

This eliminates all manual data entry, turning a daunting administrative task into a seamless, guided process.

---

3. The Email Scanner: V3 Architecture (100% Client-Side)

3.1. Architectural Rationale: Why Client-Side is Non-Negotiable
The previous server-side architecture is abandoned for three critical reasons discovered during the technical audit:
1.  GDPR Compliance: A server-side scanner makes us a "Data Controller" for "special category data" (GDPR Article 9). This creates untenable legal risk and compliance overhead (DPAs, audit logs). A client-side model avoids this classification.
2.  Google CASA Audit: Using restricted scopes (gmail.metadata) with a server component triggers a mandatory, recurring CASA Tier 2 audit ($540-$1000/yr, 4-8 weeks delay). A 100% client-side architecture is explicitly exempt from this audit.
3.  User Trust: A client-side, zero-data-transit model is the only way to honestly deliver on our core promise of privacy.

3.2. V3 Technical Architecture

**OAuth Flow**
• Implementation Detail: 100% Client-Side JavaScript using a library like oauth-pkce or native fetch to handle the full Authorization Code Flow with PKCE. The browser communicates directly with Google/Microsoft identity endpoints.
• Status: ⏳ Priority 1

**Inbox Scan**
• Implementation Detail: Executed within an Offscreen Document (chrome.offscreen). This prevents the MV3 service worker from being terminated during long-running scans.
• Status: ⏳ Priority 2

**API Throttling**
• Implementation Detail: The client-side scanning logic must implement:<ul><li>Google: multipart/mixed batching to group 100 API calls per HTTP request.</li><li>Microsoft: A queue that respects the 4 concurrent request limit and handles 429 responses by implementing exponential backoff based on the Retry-After header.</li></ul>
• Status: ⏳

**Monetization**
• Implementation Detail: 1. Affiliate: A backend webhook listener must be built to receive conversion postbacks from affiliate networks. The UI will poll this backend to verify a subid before unlocking. <br> 2. Stripe: Unchanged.
• Status: ⏳

**DEPRECATED**
• Implementation Detail: The scan-email and exchange-email-code Supabase Edge Functions.
• Status: 🟡 To be deleted.

3.3. UX: Progressive Loading
The scan will not be a monolithic loading bar. It will be a progressive-loading UI. The first 100 emails are scanned immediately, and results populate the UI within seconds. The scan continues paginating in the background (up to a 400+ email target), with newly discovered accounts dynamically added to the list. This provides immediate value while completing the deep scan as promised.

---

4. The Browser Extension: V3 Architecture (Hardened & Semantic)

4.1. Architectural Rationale: Hardening for Policy & Reality
1.  Chrome Web Store Policy ("Blue Argon"): Manifest V3 strictly prohibits executing remotely fetched code. Our previous idea of dynamic playbooks is a direct violation that would lead to a ban. Therefore, all playbooks must be bundled.
2.  Review Speed: Broad host permissions like <all_urls> trigger slow, invasive manual reviews. Therefore, we must use an explicit list of domains.
3.  DOM Fragility: Modern web apps use obfuscated CSS. Relying on CSS selectors is a losing battle. Therefore, the execution engine must be semantic.

4.2. V3 Technical Architecture

| Component | Implementation Detail | Status |
| :--- | :--- | :--- |
[26.06.2026 01:22] Hermes: | Manifest | manifest.json will be updated to:<ul><li>Use the name "DigitalEU Autofill & Migrator".</li><li>Remove <all_urls> and declare an explicit list of 11 host_permissions (e.g., *://*.netflix.com/*).</li><li>Include icons for the store listing.</li></ul> | ⏳ |
| Playbook Engine | The Semantic Playbook Engine (SPE). This is a new, heuristic-based engine that finds elements using a weighted, cascading search instead of a single CSS selector. See Appendix B. | ⏳ Priority 3 |
| Migration Model| The Local Migration Orchestrator. We do not promise impossible cloud-to-cloud migrations. The extension provides specific, local tools. See section 4.3. | ⏳ |
| Web Bridge | The postMessage handoff is architecturally sound. It will be hardened with rigorous Zod or TypeScript schema validation on all incoming payloads in the background worker. | ⏳ |

4.3. The Local Migration Orchestrator Model

This is the core of the extension's "Guide" tab. We provide the right tool for the right job, based on the target platform's architecture.

**Proton / Tuta**
• Migration Method: Their zero-knowledge crypto makes programmatic import impossible. The extension will guide the user to Proton's native "Easy Switch" tool or Tuta's manual import, providing a clear checklist.

**Mailbox.org**
• Migration Method: It supports open standards. The extension will use a WebAssembly-compiled imapsync instance to run a secure, local, client-side transfer between IMAP servers.

**Nextcloud**
• Migration Method: The extension will locally generate a user.nextcloud_export archive containing the user's contacts, calendars, etc., ready for one-click import into their new instance.

4.4. Security: Finalized Posture
-   Execution: Local-first, zero backend calls.
-   Playbooks: Bundled, not remote. Patches are delivered via store updates.
-   Permissions: Minimal and explicit, not broad.
-   Web Bridge: Hardened with schema validation.

---

5. V3 Development Roadmap

Phase 1: Foundation & De-Risking (The Pivot)
Goal: Implement the core architectural changes required for a viable product.
1.  Refactor Scanner to 100% Client-Side:
    *   Delete scan-email and exchange-email-code Edge Functions.
    *   Build the client-side OAuth (PKCE) flow.
    *   Build the scanner logic inside an Offscreen Document in the extension (or as a pure-web implementation for the initial MVP).
2.  Implement API Throttling Logic: Add Gmail batching and Microsoft Graph Retry-After handling.
3.  Harden Extension Manifest: Replace <all_urls> with the 11 explicit domains.
4.  Merge Test & Security Fixes: Merge the fix/tests-and-oauth-debug branch into main to establish a green, secure baseline.

Phase 2: Core Product MVP
Goal: A user can complete the full discovery-to-handoff workflow.
1.  Implement Progressive Loading UI for the scanner results.
2.  Implement Server-to-Server Affiliate Verification webhook.
3.  Harden the Web-to-Extension Bridge with schema validation.
4.  Build V1 of the Semantic Playbook Engine: Start with the heuristic cascade for fill actions (email fields).

Phase 3: Launch Readiness
Goal: Prepare the product for public release.
1.  Complete Microsoft Publisher Verification.
2.  Port to Firefox: Create the Firefox-specific build.
3.  Add Extension Tests: Cover the parser, matcher, and playbook logic.
4.  Integrate into CI: Automate builds and tests for the extension.
5.  Prepare Store Assets: Create screenshots, icons, and privacy policy for Chrome Web Store and AMO listings.

---

Appendix A: Final manifest.json Structure (for feat/browser-extension)

```json
{
  "manifest_version": 3,
  "name": "DigitalEU Autofill & Migrator",
  "version": "1.0.0",
  "description": "Discover your Big Tech accounts and migrate to European alternatives with guided, privacy-first tools.",
[26.06.2026 01:22] Hermes: "permissions": ["storage", "tabs", "offscreen"],
  "host_permissions": [
    "://.netflix.com/*",
    "://.spotify.com/*",
    "://.facebook.com/*",
    "://.instagram.com/*",
    "://.linkedin.com/*",
    "://.x.com/*",
    "://.twitter.com/*",
    "://.dropbox.com/*",
    "://.lastpass.com/*",
    "://.reddit.com/*",
    "://.discord.com/*"
  ],
  "externally_connectable": {
    "matches": ["https://digitaleu.me/", "https://www.digitaleu.me/", "http://localhost:5173/*"]
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "DigitalEU"
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_end"
    }
  ],
  "icons": {
    "16": "assets/icon16.png",
    "48": "assets/icon48.png",
    "128": "assets/icon128.png"
  }
}

## Appendix B: Semantic Playbook Engine (SPE) - V1 Design

The SPE replaces brittle CSS selectors with a resilient, multi-faceted search cascade.

**Playbook Step Schema (Unchanged):**
typescript
export interface PlaybookStep {
  id: string;
  title: string;
  actionType: "navigate" | "click" | "fill" | "instruction" | "confirm";
  // Selector is now a 'hint' or one of many strategies, not the only one.
  selector?: string; 
  // NEW: Add semantic hints
  textContentHint?: string; // e.g., "Cancel Subscription"
  ariaLabelHint?: string; // e.g., "Email address"
  fallbackInstruction: string;
}
``

**Execution Logic for actionType: 'fill':**
The engine will attempt to find the target input element by trying these strategies *in order*, stopping at the first success:
1.  **Explicit Selector:** Try the selector hint if provided.
2.  **Attribute Querying:** Look for input[type="email"], input[name="email"], [autocomplete="username"].
3.  **ARIA Compliance:** Look for inputs with an aria-label or aria-labelledby that matches a hint (e.g., "Email").
4.  **Semantic Context:** Find a <label> element whose text content matches a hint and is associated with an input via the for` attribute.

This makes the extension robust against the constant UI churn of modern web apps.