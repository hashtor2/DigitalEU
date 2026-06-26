# Store Deployment & Operational Guidelines

This document outlines the final operational steps required to publish the DigitalEU LMO extension to the Chrome Web Store and Firefox AMO, as well as the verification process for Microsoft OAuth.

## 1. Microsoft Publisher Verification

Because our Outlook inbox scanner uses the `Mail.ReadBasic` scope to access user data, Microsoft requires the Azure App Registration to be tied to a Verified Publisher via the Microsoft Partner Network (MPN).

### Steps to Verify:
1. **Join Microsoft Partner Network (MPN):**
   - Go to [Microsoft Partner Center](https://partner.microsoft.com/) and create a Developer or Partner account.
   - You will need to verify your business identity (legal name, address, and domain ownership).
2. **Link MPN to Azure AD:**
   - Log into the [Azure Portal](https://portal.azure.com/).
   - Navigate to **Azure Active Directory** -> **App registrations** -> Select the `DigitalEU Scanner` app.
   - Go to **Branding & properties**.
   - Under "Publisher verification", click **Add MPN ID to verify publisher**.
   - Enter your verified MPN ID.
3. **Verify Consent Screen:**
   - Once the publisher is verified, a blue "Verified" checkmark will appear on the OAuth consent screen when users connect their Outlook inbox.
   - *Note:* Without this, users will see a scary "Unverified app" warning which will severely hurt conversion rates.

## 2. Store Asset Requirements

Before submitting the built extension (from `apps/extension/dist/` for Chrome and `apps/extension/dist-firefox/` for Firefox), you need the following assets.

### Icons
- **Sizes required:** 16x16, 48x48, 128x128 (PNG format).
- **Location:** Place these in `apps/extension/public/assets/` replacing the current placeholders before running `npm run build`.
- **Design:** Should clearly represent the DigitalEU brand (e.g., the terracotta accent or emerald green from the new unified design system).

### Promotional Screenshots
- **Dimensions:** 1280x800 or 640x400 pixels (JPEG or PNG).
- **Required amount:** At least 1 (Chrome Web Store recommends 3-5).
- **Content suggestions:**
  1. *Screenshot 1:* The popup showing the "Waiting for target email" or active status.
  2. *Screenshot 2:* The Autofill button injected successfully into a settings page (e.g., Netflix).
  3. *Screenshot 3:* A demonstration of the privacy focus (e.g., highlighting that it runs locally).

### Privacy Policy Update
- **URL:** The store listings must link to `https://www.digitaleu.me/privacy`.
- **Required Copy:** You must explicitly state the following in your privacy policy regarding the extension:
  > *"The DigitalEU Autofill & Migrator extension operates entirely locally on your device (Local Migration Orchestrator architecture). It does not collect, transmit, or store your passwords, browsing history, or personal data on our servers. The target email address used for autofill is stored only in your browser's encrypted local storage and is never sent to our backend."*

---

Once these operational steps are complete, zip the respective `dist` folders and upload them to the Chrome Developer Dashboard and Mozilla Add-on Developer Hub.