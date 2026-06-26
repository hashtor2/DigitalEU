/**
 * SIKKERHET OG PERSONVERN: Dette er en statisk ordbok som kobler vanlige 
 * B2C-avsenderdomener til deres respektive tjenestenavn og innstillingssider.
 * Siden all innboksskanning skjer 100 % klientside i nettleseren, brukes denne
 * databasen utelukkende lokalt for å identifisere kontoer og fylle ut e-postadresser.
 * Ingen data sendes til eksterne servere.
 */

import type { DomainMapping } from "./types";

/**
 * Komplett database over populære B2C-tjenester, deres avsenderdomener, 
 * kategorier, og de nøyaktige URL-ene for å endre e-postadresser.
 */
export const DOMAIN_MAPPINGS: DomainMapping[] = [
    {
      "id": "gmail",
      "serviceName": "Gmail / Google Workspace",
      "domain": "gmail.com",
      "alternativeDomains": [
        "google.com",
        "googlemail.com",
        "accounts.google.com"
      ],
      "category": "email",
      "settingsUrl": "https://myaccount.google.com/email",
      "suggestedAlternativeId": "proton-mail"
    },
    {
      "id": "outlook",
      "serviceName": "Outlook / Hotmail / Microsoft 365",
      "domain": "outlook.com",
      "alternativeDomains": [
        "hotmail.com",
        "live.com",
        "microsoft.com",
        "microsoftonline.com",
        "passport.com"
      ],
      "category": "email",
      "settingsUrl": "https://account.live.com/names/Manage",
      "suggestedAlternativeId": "tuta"
    },
    {
      "id": "dropbox",
      "serviceName": "Dropbox",
      "domain": "dropbox.com",
      "alternativeDomains": [
        "dropboxmail.com",
        "dropboxstatic.com"
      ],
      "category": "cloud-storage",
      "settingsUrl": "https://www.dropbox.com/account/security",
      "suggestedAlternativeId": "proton-drive"
    },
    {
      "id": "google-drive",
      "serviceName": "Google Drive",
      "domain": "drive.google.com",
      "alternativeDomains": [
        "google.com"
      ],
      "category": "cloud-storage",
      "settingsUrl": "https://myaccount.google.com/email",
      "suggestedAlternativeId": "proton-drive"
    },
    {
      "id": "onedrive",
      "serviceName": "OneDrive",
      "domain": "onedrive.com",
      "alternativeDomains": [
        "microsoft.com"
      ],
      "category": "cloud-storage",
      "settingsUrl": "https://account.live.com/names/Manage",
      "suggestedAlternativeId": "proton-drive"
    },
    {
      "id": "icloud",
      "serviceName": "iCloud / Apple Account",
      "domain": "icloud.com",
      "alternativeDomains": [
        "apple.com",
        "id.apple.com"
      ],
      "category": "cloud-storage",
      "settingsUrl": "https://appleid.apple.com/account/manage",
      "suggestedAlternativeId": "proton-drive"
    },
    {
      "id": "lastpass",
      "serviceName": "LastPass",
      "domain": "lastpass.com",
      "alternativeDomains": [
        "lastpassmail.com"
      ],
      "category": "password-manager",
      "settingsUrl": "https://lastpass.com/my.php",
      "suggestedAlternativeId": "proton-pass"
    },
    {
      "id": "1password",
      "serviceName": "1Password",
      "domain": "1password.com",
      "alternativeDomains": [
        "1password.ca",
        "1password.eu"
      ],
      "category": "password-manager",
      "settingsUrl": "https://my.1password.com/profile",
      "suggestedAlternativeId": "proton-pass"
    },
    {
      "id": "dashlane",
      "serviceName": "Dashlane",
      "domain": "dashlane.com",
      "alternativeDomains": [],
      "category": "password-manager",
      "settingsUrl": "https://app.dashlane.com/settings",
      "suggestedAlternativeId": "proton-pass"
    },
    {
      "id": "netflix",
      "serviceName": "Netflix",
      "domain": "netflix.com",
      "alternativeDomains": [
        "info.netflix.com",
        "mail.netflix.com"
      ],
      "category": "entertainment",
      "settingsUrl": "https://www.netflix.com/YourAccount",
      "actions": {
        "changeEmailUrl": "https://www.netflix.com/YourAccount",
        "deleteAccountUrl": "https://www.netflix.com/cancelplan",
        "dataExportUrl": "https://www.netflix.com/account/getmyinfo",
        "difficulty": "medium",
        "notes": "Sletting krever først kansellering av abonnement, deretter e-postbekreftelse."
      }
    },
    {
      "id": "spotify",
      "serviceName": "Spotify",
      "domain": "spotify.com",
      "alternativeDomains": [
        "news.spotify.com",
        "mail.spotify.com"
      ],
      "category": "entertainment",
      "settingsUrl": "https://www.spotify.com/account/profile/",
      "actions": {
        "changeEmailUrl": "https://www.spotify.com/account/profile/",
        "deleteAccountUrl": "https://www.spotify.com/account/privacy/",
        "dataExportUrl": "https://www.spotify.com/account/privacy/",
        "difficulty": "medium",
        "notes": "Eksport og sletting ligger begge under Privacy-innstillingene."
      }
    },
    {
      "id": "disneyplus",
      "serviceName": "Disney+",
      "domain": "disneyplus.com",
      "alternativeDomains": [
        "disney.com",
        "mail.disneyplus.com"
      ],
      "category": "entertainment",
      "settingsUrl": "https://www.disneyplus.com/account"
    },
    {
      "id": "hbo-max",
      "serviceName": "Max / HBO Max",
      "domain": "max.com",
      "alternativeDomains": [
        "hbomax.com",
        "mail.max.com"
      ],
      "category": "entertainment",
      "settingsUrl": "https://www.max.com/account"
    },
    {
      "id": "youtube",
      "serviceName": "YouTube",
      "domain": "youtube.com",
      "alternativeDomains": [
        "google.com"
      ],
      "category": "entertainment",
      "settingsUrl": "https://myaccount.google.com/email"
    },
    {
      "id": "facebook",
      "serviceName": "Facebook",
      "domain": "facebook.com",
      "alternativeDomains": [
        "facebookmail.com"
      ],
      "category": "social",
      "settingsUrl": "https://www.facebook.com/settings?tab=account",
      "actions": {
        "changeEmailUrl": "https://www.facebook.com/settings?tab=account",
        "deleteAccountUrl": "https://www.facebook.com/help/delete_account",
        "dataExportUrl": "https://www.facebook.com/dyi/",
        "difficulty": "hard",
        "notes": "Sletting er forsinket med 30 dager. Datatransfer via \"Download Your Information\"."
      }
    },
    {
      "id": "instagram",
      "serviceName": "Instagram",
      "domain": "instagram.com",
      "alternativeDomains": [
        "mail.instagram.com"
      ],
      "category": "social",
      "settingsUrl": "https://www.instagram.com/accounts/edit/"
    },
    {
      "id": "linkedin",
      "serviceName": "LinkedIn",
      "domain": "linkedin.com",
      "alternativeDomains": [
        "messages-noreply@linkedin.com",
        "e.linkedin.com"
      ],
      "category": "social",
      "settingsUrl": "https://www.linkedin.com/psettings/email"
    },
    {
      "id": "twitter",
      "serviceName": "Twitter / X",
      "domain": "twitter.com",
      "alternativeDomains": [
        "x.com",
        "postmaster.twitter.com"
      ],
      "category": "social",
      "settingsUrl": "https://x.com/settings/email",
      "actions": {
        "changeEmailUrl": "https://x.com/settings/email",
        "deleteAccountUrl": "https://x.com/settings/deactivate",
        "dataExportUrl": "https://x.com/settings/download_your_data",
        "difficulty": "medium",
        "notes": "Konto deaktiveres først i 30 dager før permanent sletting."
      }
    },
    {
      "id": "reddit",
      "serviceName": "Reddit",
      "domain": "reddit.com",
      "alternativeDomains": [
        "redditmail.com"
      ],
      "category": "social",
      "settingsUrl": "https://www.reddit.com/settings/"
    },
    {
      "id": "slack",
      "serviceName": "Slack",
      "domain": "slack.com",
      "alternativeDomains": [
        "slackmail.com"
      ],
      "category": "collaboration",
      "settingsUrl": "https://my.slack.com/account/settings",
      "suggestedAlternativeId": "threema-work"
    },
    {
      "id": "zoom",
      "serviceName": "Zoom",
      "domain": "zoom.us",
      "alternativeDomains": [
        "zoom.com"
      ],
      "category": "collaboration",
      "settingsUrl": "https://zoom.us/profile",
      "suggestedAlternativeId": "clickmeeting"
    },
    {
      "id": "discord",
      "serviceName": "Discord",
      "domain": "discord.com",
      "alternativeDomains": [
        "discordapp.com",
        "discord.gg"
      ],
      "category": "social",
      "settingsUrl": "https://discord.com/channels/@me"
    },
    {
      "id": "amazon",
      "serviceName": "Amazon",
      "domain": "amazon.com",
      "alternativeDomains": [
        "amazon.co.uk",
        "amazon.de",
        "amazon.fr",
        "amazon.it",
        "amazon.es"
      ],
      "category": "shopping",
      "settingsUrl": "https://www.amazon.com/gp/css/homepage.html",
      "actions": {
        "changeEmailUrl": "https://www.amazon.com/gp/css/account/email/view.html",
        "deleteAccountUrl": "https://www.amazon.com/hz/contact-us/request-account-deletion",
        "dataExportUrl": "https://www.amazon.com/hz/privacy-central/data-requests/preview",
        "difficulty": "hard",
        "notes": "Kontoavslutning krever bekreftelses-e-post innen 5 dager."
      }
    },
    {
      "id": "paypal",
      "serviceName": "PayPal",
      "domain": "paypal.com",
      "alternativeDomains": [
        "paypal.co.uk",
        "paypal.de",
        "paypal.no"
      ],
      "category": "shopping",
      "settingsUrl": "https://www.paypal.com/myaccount/settings/"
    },
    {
      "id": "ebay",
      "serviceName": "eBay",
      "domain": "ebay.com",
      "alternativeDomains": [
        "ebay.co.uk",
        "ebay.de"
      ],
      "category": "shopping",
      "settingsUrl": "https://scgi.ebay.com/ws/eBayISAPI.dll?MyeBay"
    },
    {
      "id": "github",
      "serviceName": "GitHub",
      "domain": "github.com",
      "alternativeDomains": [
        "noreply.github.com"
      ],
      "category": "development",
      "settingsUrl": "https://github.com/settings/emails",
      "suggestedAlternativeId": "codeberg"
    },
    {
      "id": "adobe",
      "serviceName": "Adobe",
      "domain": "adobe.com",
      "alternativeDomains": [
        "mail.adobe.com"
      ],
      "category": "design",
      "settingsUrl": "https://account.adobe.com/profile"
    },
    {
      "id": "canva",
      "serviceName": "Canva",
      "domain": "canva.com",
      "alternativeDomains": [],
      "category": "design",
      "settingsUrl": "https://www.canva.com/settings/your-account"
    },
    {
      "id": "figma",
      "serviceName": "Figma",
      "domain": "figma.com",
      "alternativeDomains": [],
      "category": "design",
      "settingsUrl": "https://www.figma.com/settings"
    },
    {
      "id": "notion",
      "serviceName": "Notion",
      "domain": "notion.so",
      "alternativeDomains": [
        "notion.com"
      ],
      "category": "productivity",
      "settingsUrl": "https://www.notion.so/my-settings"
    },
    {
      "id": "evernote",
      "serviceName": "Evernote",
      "domain": "evernote.com",
      "alternativeDomains": [],
      "category": "productivity",
      "settingsUrl": "https://www.evernote.com/UserSettings.action"
    },
    {
      "id": "trello",
      "serviceName": "Trello",
      "domain": "trello.com",
      "alternativeDomains": [],
      "category": "productivity",
      "settingsUrl": "https://trello.com/me/profile"
    }
  ];

/**
 * Hjelpefunksjon for å finne en mapping basert på et e-post-avsenderdomene.
 * Håndterer både eksakt treff på hoveddomene og treff i alternative avsenderdomener.
 */
export function getMappingByDomain(domain: string): DomainMapping | undefined {
  const cleanDomain = domain.toLowerCase().trim();
  
  return DOMAIN_MAPPINGS.find(
    (mapping) =>
      mapping.domain === cleanDomain ||
      mapping.alternativeDomains.some(
        (alt) => alt === cleanDomain || cleanDomain.endsWith("." + alt)
      )
  );
}

/**
 * Henter URL-en der brukeren kan endre sin e-postadresse for en gitt tjeneste.
 */
export function getSettingsUrlForDomain(domain: string): string | undefined {
  const mapping = getMappingByDomain(domain);
  return mapping?.settingsUrl;
}
