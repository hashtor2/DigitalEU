import type { Alternative } from "./types";

/**
 * Autogenerert katalog over europeiske alternativer, parsed direkte fra
 * forskningsrapporten i prosjektroten.
 *
 * SIKKERHET OG PERSONVERN: Katalogen er helt statisk og leveres i koden.
 * Dette sikrer superrask innlasting og fullstendig offline-kapabilitet.
 */
export const ALTERNATIVES: Alternative[] = [
    {
      "id": "brevo",
      "name": "Brevo",
      "country": "FR",
      "category": "analytics",
      "replaces": [
        "Mailchimp"
      ],
      "url": "https://www.brevo.com",
      "description": "EU data residency, unified CRM and transactional email.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.brevo.com"
    },
    {
      "id": "getresponse",
      "name": "GetResponse",
      "country": "PL",
      "category": "analytics",
      "replaces": [
        "Mailchimp"
      ],
      "url": "https://www.getresponse.com",
      "description": "Comprehensive email automation, funnels, EU compliance.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.getresponse.com"
    },
    {
      "id": "mailerlite",
      "name": "MailerLite",
      "country": "EU",
      "category": "analytics",
      "replaces": [
        "Mailchimp"
      ],
      "url": "https://www.google.com/search?q=MailerLite",
      "description": "Clean interface, robust automation tools, GDPR compliant.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.google.com/search?q=MailerLite"
    },
    {
      "id": "pirsch-analytics",
      "name": "Pirsch Analytics",
      "country": "DE",
      "category": "analytics",
      "replaces": [
        "Google Analytics"
      ],
      "url": "https://pirsch.io",
      "description": "Cookie-free, hosted in Germany, GA data import.",
      "monetization": "affiliate",
      "affiliateUrl": "https://pirsch.io"
    },
    {
      "id": "plausible-analytics",
      "name": "Plausible Analytics",
      "country": "EE",
      "category": "analytics",
      "replaces": [
        "Google Analytics"
      ],
      "url": "https://plausible.io",
      "description": "Cookie-less, 2.5 KB script, processed on EU infrastructure.",
      "monetization": "affiliate",
      "affiliateUrl": "https://plausible.io"
    },
    {
      "id": "simple-analytics",
      "name": "Simple Analytics",
      "country": "NL",
      "category": "analytics",
      "replaces": [
        "Google Analytics"
      ],
      "url": "https://simpleanalytics.com",
      "description": "Privacy-friendly, cookie-free, hosted in the EU.",
      "monetization": "affiliate",
      "affiliateUrl": "https://simpleanalytics.com"
    },
    {
      "id": "mullvad-browser",
      "name": "Mullvad Browser",
      "country": "SE",
      "category": "browser",
      "replaces": [
        "Google Chrome"
      ],
      "url": "https://mullvad.net/browser",
      "description": "Developed with Tor Project, advanced fingerprinting blocks.",
      "monetization": "affiliate",
      "affiliateUrl": "https://mullvad.net/browser"
    },
    {
      "id": "vivaldi",
      "name": "Vivaldi",
      "country": "NO",
      "category": "browser",
      "replaces": [
        "Google Chrome"
      ],
      "url": "https://vivaldi.com",
      "description": "High customizability, integrated ad-blocking.",
      "monetization": "affiliate",
      "affiliateUrl": "https://vivaldi.com"
    },
    {
      "id": "hetzner-online",
      "name": "Hetzner Online",
      "country": "DE",
      "category": "cloud-infra",
      "replaces": [
        "AWS",
        "Azure",
        "GCP"
      ],
      "url": "https://www.hetzner.com",
      "description": "Exceptional compute-to-cost ratio, BSI C5 certified.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.hetzner.com"
    },
    {
      "id": "ovhcloud",
      "name": "OVHcloud",
      "country": "FR",
      "category": "cloud-infra",
      "replaces": [
        "AWS",
        "Azure",
        "GCP"
      ],
      "url": "https://www.ovhcloud.com",
      "description": "SecNumCloud and HDS certified, vast private cloud options.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.ovhcloud.com"
    },
    {
      "id": "repocloud",
      "name": "RepoCloud",
      "country": "EU",
      "category": "cloud-infra",
      "replaces": [
        "AWS",
        "Azure",
        "GCP"
      ],
      "url": "https://repocloud.io",
      "description": "Low-cost containerized app deployments.",
      "monetization": "affiliate",
      "affiliateUrl": "https://repocloud.io"
    },
    {
      "id": "scaleway",
      "name": "Scaleway",
      "country": "FR",
      "category": "cloud-infra",
      "replaces": [
        "AWS",
        "Azure",
        "GCP"
      ],
      "url": "https://www.scaleway.com",
      "description": "GPU-powered AI compute, 4.8x value over AWS, free egress.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.scaleway.com"
    },
    {
      "id": "upcloud",
      "name": "UpCloud",
      "country": "FI",
      "category": "cloud-infra",
      "replaces": [
        "AWS",
        "Azure",
        "GCP"
      ],
      "url": "https://upcloud.com",
      "description": "High-performance MaxIOPS storage, global network.",
      "monetization": "affiliate",
      "affiliateUrl": "https://upcloud.com"
    },
    {
      "id": "pcloud",
      "name": "pCloud",
      "country": "CH",
      "category": "cloud-storage",
      "replaces": [
        "Dropbox",
        "G Drive"
      ],
      "url": "https://pcloud.com",
      "description": "Client-side encryption, lifetime storage plans.",
      "monetization": "affiliate",
      "affiliateUrl": "https://partner.pcloud.com/r/82103"
    },
    {
      "id": "codeberg",
      "name": "Codeberg",
      "country": "DE",
      "category": "code-hosting",
      "replaces": [
        "GitHub",
        "Bitbucket"
      ],
      "url": "https://codeberg.org",
      "description": "Fully Open Source (Forgejo)",
      "monetization": "affiliate",
      "affiliateUrl": "https://codeberg.org"
    },
    {
      "id": "rhodecode",
      "name": "RhodeCode",
      "country": "DE",
      "category": "code-hosting",
      "replaces": [
        "GitHub",
        "Bitbucket"
      ],
      "url": "https://rhodecode.com",
      "description": "Proprietary / Free Tier Available",
      "monetization": "affiliate",
      "affiliateUrl": "https://rhodecode.com"
    },
    {
      "id": "proton-mail",
      "name": "Proton Mail",
      "country": "CH",
      "category": "email",
      "replaces": [
        "Gmail",
        "Outlook"
      ],
      "url": "https://proton.me/mail",
      "description": "Zero-access encryption, comprehensive privacy suite.",
      "monetization": "affiliate",
      "affiliateUrl": "https://go.getproton.me/SH1mR"
    },
    {
      "id": "tuta",
      "name": "Tuta",
      "country": "DE",
      "category": "email",
      "replaces": [
        "Gmail",
        "Outlook"
      ],
      "url": "https://tuta.com",
      "description": "Quantum-resistant encryption, 100% green energy.",
      "monetization": "affiliate",
      "affiliateUrl": "https://tuta.com"
    },
    {
      "id": "volla-phone",
      "name": "Volla Phone",
      "country": "DE",
      "category": "hardware",
      "replaces": [
        "Android",
        "iOS"
      ],
      "url": "https://volla.online",
      "description": "Decoupled from Google, security mode, Volla OS.",
      "monetization": "affiliate",
      "affiliateUrl": "https://volla.online"
    },
    {
      "id": "threema-work",
      "name": "Threema Work",
      "country": "CH",
      "category": "messaging",
      "replaces": [
        "Slack",
        "MS Teams"
      ],
      "url": "https://work.threema.ch",
      "description": "Meta-data minimization, zero personal data required.",
      "monetization": "affiliate",
      "affiliateUrl": "https://work.threema.ch"
    },
    {
      "id": "clickmeeting",
      "name": "ClickMeeting",
      "country": "PL",
      "category": "office",
      "replaces": [
        "Zoom",
        "Teams"
      ],
      "url": "https://clickmeeting.com",
      "description": "Browser-based, GDPR compliant, automated webinars.",
      "monetization": "affiliate",
      "affiliateUrl": "https://clickmeeting.com"
    },
    {
      "id": "onlyoffice",
      "name": "ONLYOFFICE",
      "country": "LV",
      "category": "office",
      "replaces": [
        "MS Office",
        "G Docs"
      ],
      "url": "https://www.onlyoffice.com",
      "description": "Advanced real-time collaboration, native XML rendering.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.onlyoffice.com"
    },
    {
      "id": "passbolt",
      "name": "Passbolt",
      "country": "LU",
      "category": "password-manager",
      "replaces": [
        "1Password",
        "LastPass"
      ],
      "url": "https://www.passbolt.com",
      "description": "Open-source, OpenPGP encrypted, designed for dev teams.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.passbolt.com"
    },
    {
      "id": "organic-maps",
      "name": "Organic Maps",
      "country": "EE",
      "category": "search",
      "replaces": [
        "Google Maps"
      ],
      "url": "https://organicmaps.app",
      "description": "Fully offline, zero tracker telemetry, OpenStreetMap data.",
      "monetization": "affiliate",
      "affiliateUrl": "https://organicmaps.app"
    }
  ];
