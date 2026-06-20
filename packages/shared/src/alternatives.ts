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
      "id": "proton-vpn",
      "name": "Proton VPN",
      "country": "CH",
      "category": "vpn",
      "replaces": [
        "NordVPN",
        "ExpressVPN",
        "Surfshark"
      ],
      "url": "https://protonvpn.com",
      "description": "No-logs VPN from Switzerland. Free tier available, 70% off with World Cup promo.",
      "monetization": "affiliate",
      "affiliateUrl": "https://go.getproton.me/SH2jp"
    },
    {
      "id": "proton-pass",
      "name": "Proton Pass",
      "country": "CH",
      "category": "password-manager",
      "replaces": [
        "LastPass",
        "1Password",
        "Dashlane"
      ],
      "url": "https://proton.me/pass",
      "description": "End-to-end encrypted password manager with built-in 2FA. 50% off.",
      "monetization": "affiliate",
      "affiliateUrl": "https://go.getproton.me/SH1mP"
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
    },
    // PARSED FROM USER MARKDOWN
    {
      "id": "gitlab",
      "name": "GitLab",
      "country": "NL",
      "category": "code-hosting",
      "replaces": ["GitHub"],
      "url": "https://about.gitlab.com/",
      "description": "Full DevOps platform, EU-rooted",
      "monetization": "other"
    },
    {
      "id": "forgejo-gitea",
      "name": "Forgejo / Gitea",
      "country": "EU",
      "category": "code-hosting",
      "replaces": ["GitHub"],
      "url": "https://forgejo.org/",
      "description": "Lightweight self-hosted Git",
      "monetization": "other"
    },
    {
      "id": "sourcehut",
      "name": "SourceHut",
      "country": "EU",
      "category": "code-hosting",
      "replaces": ["GitHub"],
      "url": "https://sourcehut.org/",
      "description": "Minimalist, email-driven workflow",
      "monetization": "other"
    },
    {
      "id": "jetbrains",
      "name": "JetBrains (IntelliJ, PyCharm, WebStorm)",
      "country": "CZ",
      "category": "code-hosting",
      "replaces": ["VS Code", "Visual Studio"],
      "url": "https://www.jetbrains.com/",
      "description": "Czech-built professional IDEs (IntelliJ, PyCharm, WebStorm) for serious software development.",
      "monetization": "other"
    },
    {
      "id": "bluej",
      "name": "BlueJ",
      "country": "GB",
      "category": "code-hosting",
      "replaces": ["Eclipse"],
      "url": "https://www.bluej.org/",
      "description": "Educational Java IDE",
      "monetization": "other"
    },
    {
      "id": "hetzner",
      "name": "Hetzner",
      "country": "DE",
      "category": "cloud-infra",
      "replaces": ["AWS", "Azure", "GCP"],
      "url": "https://www.hetzner.com",
      "description": "Best cost/compute ratio, BSI C5 certified",
      "monetization": "other"
    },
    {
      "id": "exoscale",
      "name": "Exoscale",
      "country": "EU",
      "category": "cloud-infra",
      "replaces": ["AWS EC2", "Heroku"],
      "url": "https://www.exoscale.com/",
      "description": "*CH/DE/AT/HR datacenters",
      "monetization": "other"
    },
    {
      "id": "ionos",
      "name": "IONOS",
      "country": "DE",
      "category": "cloud-infra",
      "replaces": ["AWS", "GoDaddy"],
      "url": "https://www.ionos.com/",
      "description": "Hosting, domains, VPS",
      "monetization": "other"
    },
    {
      "id": "cloudscale-ch",
      "name": "cloudscale.ch",
      "country": "EU",
      "category": "cloud-infra",
      "replaces": ["AWS EC2"],
      "url": "https://www.cloudscale.ch/",
      "description": "Per-second billing, GPU instances",
      "monetization": "other"
    },
    {
      "id": "dcxv",
      "name": "DCXV",
      "country": "CY",
      "category": "cloud-infra",
      "replaces": ["AWS", "Azure"],
      "url": "https://dcxv.com/",
      "description": "Tier III DCs in Prague/Vilnius/Covilhã",
      "monetization": "other"
    },
    {
      "id": "open-telekom-cloud",
      "name": "Open Telekom Cloud (Deutsche Telekom)",
      "country": "DE",
      "category": "cloud-infra",
      "replaces": ["AWS", "Azure"],
      "url": "https://open-telekom-cloud.com/",
      "description": "OpenStack-based",
      "monetization": "other"
    },
    {
      "id": "elastx",
      "name": "Elastx",
      "country": "SE",
      "category": "cloud-infra",
      "replaces": ["AWS"],
      "url": "https://elastx.se/",
      "description": "Fully managed, sustainability focus",
      "monetization": "other"
    },
    {
      "id": "fuga-cloud",
      "name": "Fuga Cloud",
      "country": "NL",
      "category": "cloud-infra",
      "replaces": ["AWS", "GCP"],
      "url": "https://fuga.cloud/",
      "description": "OpenStack",
      "monetization": "other"
    },
    {
      "id": "gridscale",
      "name": "gridscale",
      "country": "DE",
      "category": "cloud-infra",
      "replaces": ["DigitalOcean", "Heroku"],
      "url": "https://gridscale.io/",
      "description": "German IaaS/PaaS provider for cloud servers, managed Kubernetes and storage.",
      "monetization": "other"
    },
    {
      "id": "seeweb",
      "name": "Seeweb",
      "country": "IT",
      "category": "cloud-infra",
      "replaces": ["AWS"],
      "url": "https://www.seeweb.com/",
      "description": "Italian cloud provider offering GPU, compute and S3-compatible storage in EU data centres.",
      "monetization": "other"
    },
    {
      "id": "stackit",
      "name": "STACKIT",
      "country": "DE",
      "category": "cloud-infra",
      "replaces": ["AWS", "GCP"],
      "url": "https://www.stackit.de/",
      "description": "Built for public sector",
      "monetization": "other"
    },
    {
      "id": "manitu-tldhost",
      "name": "manitu, TLDHost",
      "country": "DE",
      "category": "cloud-infra",
      "replaces": ["DigitalOcean"],
      "url": "https://www.manitu.de/",
      "description": "Budget VPS",
      "monetization": "other"
    },
    {
      "id": "matomo",
      "name": "Matomo",
      "country": "FR",
      "category": "analytics",
      "replaces": ["Google Analytics"],
      "url": "https://matomo.org/",
      "description": "Full open-source, self-hostable",
      "monetization": "other"
    },
    {
      "id": "piwik-pro",
      "name": "Piwik PRO",
      "country": "PL",
      "category": "analytics",
      "replaces": ["Google Analytics 360"],
      "url": "https://piwik.pro/",
      "description": "Enterprise + consent mgmt",
      "monetization": "other"
    },
    {
      "id": "etracker",
      "name": "etracker",
      "country": "DE",
      "category": "analytics",
      "replaces": ["Google Analytics"],
      "url": "https://www.etracker.com/",
      "description": "Cookie-free",
      "monetization": "other"
    },
    {
      "id": "friendly-analytics",
      "name": "Friendly Analytics",
      "country": "EU",
      "category": "analytics",
      "replaces": ["Google Analytics"],
      "url": "https://friendly.ch/",
      "description": "* (CH)",
      "monetization": "other"
    },
    {
      "id": "cleverreach",
      "name": "CleverReach",
      "country": "DE",
      "category": "analytics",
      "replaces": ["Mailchimp"],
      "url": "https://www.cleverreach.com/",
      "description": "German email-marketing platform with GDPR-compliant newsletters and automation.",
      "monetization": "other"
    },
    {
      "id": "folk-twenty",
      "name": "Folk, Twenty (OSS)",
      "country": "FR",
      "category": "analytics",
      "replaces": ["HubSpot CRM", "Salesforce"],
      "url": "https://www.folk.app/",
      "description": "French CRMs — folk's lightweight relationship manager and the open-source Twenty.",
      "monetization": "other"
    },
    {
      "id": "salesflare",
      "name": "Salesflare",
      "country": "BE",
      "category": "analytics",
      "replaces": ["Pipedrive", "HubSpot"],
      "url": "https://salesflare.com/",
      "description": "Belgian CRM that auto-builds contact timelines from your inbox and calendar.",
      "monetization": "other"
    },
    {
      "id": "customermates",
      "name": "Customermates",
      "country": "DE",
      "category": "analytics",
      "replaces": ["Pipedrive"],
      "url": "https://customermates.de/",
      "description": "Self-hosted, Docker",
      "monetization": "other"
    },
    {
      "id": "napoleoncat",
      "name": "NapoleonCat",
      "country": "PL",
      "category": "analytics",
      "replaces": ["Hootsuite", "Sprout Social"],
      "url": "https://napoleoncat.com/",
      "description": "Polish social-media management and analytics suite for teams.",
      "monetization": "other"
    },
    {
      "id": "crisp",
      "name": "Crisp",
      "country": "FR",
      "category": "analytics",
      "replaces": ["Intercom", "Zendesk Chat"],
      "url": "https://crisp.chat/",
      "description": "French customer-messaging platform with shared inbox, chatbot and helpdesk.",
      "monetization": "other"
    },
    {
      "id": "helpspace",
      "name": "HelpSpace",
      "country": "DE",
      "category": "analytics",
      "replaces": ["Zendesk", "Help Scout"],
      "url": "https://helpspace.com/",
      "description": "German helpdesk and shared-inbox tool for customer support teams.",
      "monetization": "other"
    },
    {
      "id": "tally-formbricks",
      "name": "Tally, Formbricks",
      "country": "BE",
      "category": "analytics",
      "replaces": ["Typeform"],
      "url": "https://tally.so/",
      "description": "Privacy-friendly form builders — Tally's no-code forms and the open-source Formbricks.",
      "monetization": "other"
    },
    {
      "id": "odoo",
      "name": "Odoo",
      "country": "BE",
      "category": "analytics",
      "replaces": ["SAP", "NetSuite"],
      "url": "https://www.odoo.com/",
      "description": "Full ERP",
      "monetization": "other"
    },
    {
      "id": "mollie-adyen",
      "name": "Mollie, Adyen",
      "country": "NL",
      "category": "analytics",
      "replaces": ["Stripe"],
      "url": "https://www.mollie.com/",
      "description": "Dutch payment processors for online checkout and subscriptions across Europe.",
      "monetization": "other"
    },
    {
      "id": "przelewy24",
      "name": "Przelewy24",
      "country": "PL",
      "category": "analytics",
      "replaces": ["Stripe (Poland)"],
      "url": "https://www.przelewy24.pl/",
      "description": "Polish online payment gateway covering local bank transfers and cards.",
      "monetization": "other"
    },
    {
      "id": "cal-com",
      "name": "Cal.com",
      "country": "EU",
      "category": "analytics",
      "replaces": ["Calendly"],
      "url": "https://cal.com/",
      "description": "OSS, self-hostable",
      "monetization": "other"
    },
    {
      "id": "shopware",
      "name": "Shopware",
      "country": "DE",
      "category": "analytics",
      "replaces": ["Shopify"],
      "url": "https://www.shopware.com/",
      "description": "German open-source e-commerce platform for building online stores.",
      "monetization": "other"
    },
    {
      "id": "mailbox-org",
      "name": "Mailbox.org",
      "country": "DE",
      "category": "email",
      "replaces": ["Gmail", "Outlook"],
      "url": "https://mailbox.org/",
      "description": "Email + office tools",
      "monetization": "other"
    },
    {
      "id": "mailfence",
      "name": "Mailfence",
      "country": "BE",
      "category": "email",
      "replaces": ["Gmail"],
      "url": "https://mailfence.com/",
      "description": "PGP, docs, calendar",
      "monetization": "other"
    },
    {
      "id": "posteo",
      "name": "Posteo",
      "country": "DE",
      "category": "email",
      "replaces": ["Gmail"],
      "url": "https://posteo.de/",
      "description": "Anonymous, no affiliate/ads",
      "monetization": "other"
    },
    {
      "id": "runbox",
      "name": "Runbox",
      "country": "NO",
      "category": "email",
      "replaces": ["Gmail"],
      "url": "https://runbox.com/",
      "description": "Renewable energy hosted",
      "monetization": "other"
    },
    {
      "id": "dismail",
      "name": "Dismail",
      "country": "DE",
      "category": "email",
      "replaces": ["Gmail"],
      "url": "https://dismail.de/",
      "description": "German non-profit email and groupware provider focused on privacy.",
      "monetization": "other"
    },
    {
      "id": "la-poste-mail",
      "name": "La Poste mail",
      "country": "FR",
      "category": "email",
      "replaces": ["Gmail"],
      "url": "https://www.laposte.net/",
      "description": "State postal-service email",
      "monetization": "other"
    },
    {
      "id": "betterbird",
      "name": "Betterbird",
      "country": "DE",
      "category": "email",
      "replaces": ["Thunderbird", "Outlook"],
      "url": "https://www.betterbird.eu/",
      "description": "German community fork of Thunderbird with extra fixes and features.",
      "monetization": "other"
    },
    {
      "id": "threema",
      "name": "Threema",
      "country": "EU",
      "category": "email",
      "replaces": ["WhatsApp", "Telegram"],
      "url": "https://threema.ch/",
      "description": "*(CH)No phone number required",
      "monetization": "other"
    },
    {
      "id": "wire-delta-chat-ginlo-olvid-skred",
      "name": "Wire, Delta Chat, Ginlo, Olvid, SKRED",
      "country": "CH",
      "category": "email",
      "replaces": ["WhatsApp", "Signal"],
      "url": "https://wire.com/",
      "description": "Various E2E messengers",
      "monetization": "other"
    },
    {
      "id": "element-matrix",
      "name": "Element/Matrix",
      "country": "GB",
      "category": "email",
      "replaces": ["Slack", "Discord", "WhatsApp"],
      "url": "https://element.io/",
      "description": "Federated, decentralized",
      "monetization": "other"
    },
    {
      "id": "fleep",
      "name": "Fleep",
      "country": "EE",
      "category": "email",
      "replaces": ["Slack"],
      "url": "https://fleep.io/",
      "description": "Estonian team-messaging app blending chat with email-style threads.",
      "monetization": "other"
    },
    {
      "id": "stackfield",
      "name": "Stackfield",
      "country": "DE",
      "category": "email",
      "replaces": ["Slack", "MS Teams"],
      "url": "https://www.stackfield.com/",
      "description": "German encryption",
      "monetization": "other"
    },
    {
      "id": "whereby",
      "name": "Whereby",
      "country": "NO",
      "category": "email",
      "replaces": ["Zoom", "Meet"],
      "url": "https://whereby.com/",
      "description": "Browser-based, no install",
      "monetization": "other"
    },
    {
      "id": "pexip",
      "name": "Pexip",
      "country": "NO",
      "category": "email",
      "replaces": ["Cisco Webex", "Zoom"],
      "url": "https://www.pexip.com/",
      "description": "Enterprise, self-hostable",
      "monetization": "other"
    },
    {
      "id": "infomaniak-kmeet",
      "name": "Infomaniak kMeet",
      "country": "EU",
      "category": "email",
      "replaces": ["Zoom", "MS Teams"],
      "url": "https://www.infomaniak.com/kmeet",
      "description": "*(CH)Free, Jitsi-based",
      "monetization": "other"
    },
    {
      "id": "nextcloud-talk",
      "name": "Nextcloud Talk",
      "country": "DE",
      "category": "email",
      "replaces": ["MS Teams", "Zoom"],
      "url": "https://nextcloud.com/talk/",
      "description": "Self-hosted",
      "monetization": "other"
    },
    {
      "id": "jitsi-meet",
      "name": "Jitsi Meet",
      "country": "FR",
      "category": "email",
      "replaces": ["Zoom", "Meet"],
      "url": "https://meet.jit.si/",
      "description": "OSS, no account needed",
      "monetization": "other"
    },
    {
      "id": "livestorm",
      "name": "Livestorm",
      "country": "FR",
      "category": "email",
      "replaces": ["Zoom Webinars"],
      "url": "https://livestorm.co/",
      "description": "French browser-based platform for webinars and video meetings.",
      "monetization": "other"
    },
    {
      "id": "digital-samba",
      "name": "Digital Samba",
      "country": "ES",
      "category": "email",
      "replaces": ["Zoom SDK"],
      "url": "https://www.digitalsamba.com/",
      "description": "GDPR video API/SDK",
      "monetization": "other"
    },
    {
      "id": "nextcloud",
      "name": "Nextcloud",
      "country": "DE",
      "category": "cloud-storage",
      "replaces": ["Google Drive", "Dropbox"],
      "url": "https://nextcloud.com/",
      "description": "German self-hostable suite for file sync, calendar, mail and collaboration.",
      "monetization": "other"
    },
    {
      "id": "tresorit",
      "name": "Tresorit",
      "country": "EU",
      "category": "cloud-storage",
      "replaces": ["Box", "Dropbox"],
      "url": "https://tresorit.com/",
      "description": "*(CH)/🇭🇺",
      "monetization": "other"
    },
    {
      "id": "proton-drive",
      "name": "Proton Drive",
      "country": "CH",
      "category": "cloud-storage",
      "replaces": ["Google Drive", "Dropbox"],
      "url": "https://proton.me/drive",
      "description": "200 GB end-to-end encrypted cloud storage for €1. Swiss privacy.",
      "monetization": "affiliate",
      "affiliateUrl": "https://go.getproton.me/SH1mO"
    },
    {
      "id": "internxt",
      "name": "Internxt",
      "country": "ES",
      "category": "cloud-storage",
      "replaces": ["Google Drive", "Dropbox"],
      "url": "https://internxt.com/",
      "description": "Spanish zero-knowledge encrypted cloud storage and file sharing.",
      "monetization": "other"
    },
    {
      "id": "kdrive-infomaniak",
      "name": "kDrive (Infomaniak)",
      "country": "EU",
      "category": "cloud-storage",
      "replaces": ["Google Drive", "OneDrive"],
      "url": "https://www.infomaniak.com/kdrive",
      "description": "*(CH)",
      "monetization": "other"
    },
    {
      "id": "jottacloud",
      "name": "Jottacloud",
      "country": "NO",
      "category": "cloud-storage",
      "replaces": ["Dropbox", "iCloud", "Google Photos"],
      "url": "https://www.jottacloud.com/",
      "description": "Norwegian unlimited-backup cloud storage under strong privacy laws.",
      "monetization": "other"
    },
    {
      "id": "koofr",
      "name": "Koofr",
      "country": "SI",
      "category": "cloud-storage",
      "replaces": ["Dropbox", "Box"],
      "url": "https://koofr.eu/",
      "description": "Slovenian privacy-focused cloud storage that unifies your existing accounts.",
      "monetization": "other"
    },
    {
      "id": "leviia",
      "name": "Leviia",
      "country": "FR",
      "category": "cloud-storage",
      "replaces": ["Amazon S3"],
      "url": "https://www.leviia.com/",
      "description": "French sovereign cloud storage with S3-compatible object storage.",
      "monetization": "other"
    },
    {
      "id": "cloudu",
      "name": "Cloudu",
      "country": "DE",
      "category": "cloud-storage",
      "replaces": ["Google Drive (managed Nextcloud)"],
      "url": "https://cloudu.de/",
      "description": "German managed Nextcloud hosting as a Google Drive alternative.",
      "monetization": "other"
    },
    {
      "id": "bewcloud",
      "name": "bewCloud",
      "country": "EU",
      "category": "cloud-storage",
      "replaces": ["Personal cloud"],
      "url": "https://bewcloud.com/",
      "description": "Open-source, self-hostable personal cloud for files and notes.",
      "monetization": "other"
    },
    {
      "id": "zeitkapsl",
      "name": "zeitkapsl",
      "country": "AT",
      "category": "cloud-storage",
      "replaces": ["Google Photos"],
      "url": "https://zeitkapsl.com/",
      "description": "Austrian end-to-end encrypted photo and video storage.",
      "monetization": "other"
    },
    {
      "id": "peergos",
      "name": "Peergos",
      "country": "GB",
      "category": "cloud-storage",
      "replaces": ["Dropbox (P2P)"],
      "url": "https://peergos.org/",
      "description": "Peer-to-peer, end-to-end encrypted storage and social platform (UK).",
      "monetization": "other"
    },
    {
      "id": "opencloud",
      "name": "OpenCloud",
      "country": "DE",
      "category": "cloud-storage",
      "replaces": ["Google Drive"],
      "url": "https://opencloud.de/",
      "description": "German open-source file platform and content collaboration (ownCloud successor).",
      "monetization": "other"
    },
    {
      "id": "librewolf",
      "name": "LibreWolf",
      "country": "DE",
      "category": "security",
      "replaces": ["Google Chrome"],
      "url": "https://librewolf.net/",
      "description": "Privacy-hardened, telemetry-free fork of Firefox.",
      "monetization": "other"
    },
    {
      "id": "falkon",
      "name": "Falkon",
      "country": "DE",
      "category": "security",
      "replaces": ["Google Chrome"],
      "url": "https://www.falkon.org/",
      "description": "Lightweight KDE web browser built on Qt WebEngine.",
      "monetization": "other"
    },
    {
      "id": "otter-browser",
      "name": "Otter Browser (Opera-12 style)",
      "country": "PL",
      "category": "security",
      "replaces": ["Google Chrome"],
      "url": "https://otter-browser.org/",
      "description": "Open-source browser recreating the classic Opera 12 experience.",
      "monetization": "other"
    },
    {
      "id": "ecosia-browser",
      "name": "Ecosia Browser",
      "country": "DE",
      "category": "security",
      "replaces": ["Google Chrome"],
      "url": "https://www.ecosia.org/browser",
      "description": "Chromium-based browser from Ecosia that funds tree-planting.",
      "monetization": "other"
    },
    {
      "id": "waterfox",
      "name": "Waterfox",
      "country": "GB",
      "category": "security",
      "replaces": ["Firefox", "Chrome"],
      "url": "https://www.waterfox.net/",
      "description": "Independent Firefox-based browser tuned for privacy and user control.",
      "monetization": "other"
    },
    {
      "id": "qwant",
      "name": "Qwant",
      "country": "FR",
      "category": "security",
      "replaces": ["Google Search", "Bing"],
      "url": "https://www.qwant.com/",
      "description": "French privacy search engine that doesn't track or profile users.",
      "monetization": "other"
    },
    {
      "id": "ecosia",
      "name": "Ecosia (tree-planting)",
      "country": "DE",
      "category": "security",
      "replaces": ["Google Search", "Bing"],
      "url": "https://www.ecosia.org/",
      "description": "German search engine that uses ad profits to plant trees.",
      "monetization": "other"
    },
    {
      "id": "startpage",
      "name": "Startpage (NL jurisdiction, US-owned — caveat)",
      "country": "NL",
      "category": "security",
      "replaces": ["Google Search"],
      "url": "https://www.startpage.com/",
      "description": "Dutch private search delivering Google results without tracking (note: US-owned).",
      "monetization": "other"
    },
    {
      "id": "swisscows",
      "name": "Swisscows",
      "country": "EU",
      "category": "security",
      "replaces": ["Google Search"],
      "url": "https://swisscows.com/",
      "description": "*(CH)",
      "monetization": "other"
    },
    {
      "id": "uruky",
      "name": "Uruky",
      "country": "FR",
      "category": "security",
      "replaces": ["Google Search"],
      "url": "https://uruky.com/",
      "description": "French privacy-respecting search engine.",
      "monetization": "other"
    },
    {
      "id": "e-os-murena",
      "name": "/e/OS (Murena)",
      "country": "FR",
      "category": "hardware",
      "replaces": ["Android", "iOS"],
      "url": "https://murena.com/",
      "description": "French de-Googled Android (/e/OS) and Murena devices and cloud.",
      "monetization": "other"
    },
    {
      "id": "fairphone",
      "name": "Fairphone",
      "country": "NL",
      "category": "hardware",
      "replaces": ["Android", "iOS"],
      "url": "https://www.fairphone.com/",
      "description": "Dutch ethical, repairable and long-life smartphones.",
      "monetization": "other"
    },
    {
      "id": "ubports-ubuntu-touch",
      "name": "UBports / Ubuntu Touch",
      "country": "DE",
      "category": "hardware",
      "replaces": ["Android", "iOS"],
      "url": "https://ubports.com/",
      "description": "Community-maintained Linux phone OS (Ubuntu Touch).",
      "monetization": "other"
    },
    {
      "id": "sailfish-os-jolla",
      "name": "Sailfish OS (Jolla)",
      "country": "FI",
      "category": "hardware",
      "replaces": ["Android"],
      "url": "https://sailfishos.org/",
      "description": "Finnish independent mobile OS with Android app support.",
      "monetization": "other"
    },
    {
      "id": "zorin-os",
      "name": "Zorin OS",
      "country": "IE",
      "category": "hardware",
      "replaces": ["Windows", "macOS"],
      "url": "https://zorin.com/os/",
      "description": "Irish Linux distribution designed as a friendly Windows/macOS replacement.",
      "monetization": "other"
    },
    {
      "id": "canonical-ubuntu",
      "name": "Canonical/Ubuntu",
      "country": "GB",
      "category": "hardware",
      "replaces": ["Windows", "RHEL"],
      "url": "https://ubuntu.com/",
      "description": "UK-based Canonical's Ubuntu — the widely used Linux desktop and server OS.",
      "monetization": "other"
    },
    {
      "id": "suse-linux",
      "name": "SUSE Linux",
      "country": "DE",
      "category": "hardware",
      "replaces": ["RHEL"],
      "url": "https://www.suse.com/",
      "description": "German enterprise Linux (SLES) and the openSUSE distributions.",
      "monetization": "other"
    },
    {
      "id": "kde-plasma",
      "name": "KDE/Plasma",
      "country": "DE",
      "category": "hardware",
      "replaces": ["Windows desktop shell"],
      "url": "https://kde.org/plasma-desktop/",
      "description": "Free, customizable Linux desktop environment from the KDE community.",
      "monetization": "other"
    },
    {
      "id": "shiftphone",
      "name": "Shiftphone",
      "country": "DE",
      "category": "hardware",
      "replaces": ["iPhone"],
      "url": "https://www.shiftphones.com/",
      "description": "German fair-trade, modular and repairable smartphones.",
      "monetization": "other"
    },
    {
      "id": "hmd-global",
      "name": "HMD Global",
      "country": "FI",
      "category": "hardware",
      "replaces": ["Samsung", "Motorola"],
      "url": "https://www.hmd.com/",
      "description": "Finnish maker of Nokia-branded and increasingly repairable phones.",
      "monetization": "other"
    },
    {
      "id": "mudita-hammer",
      "name": "Mudita, Hammer",
      "country": "PL",
      "category": "hardware",
      "replaces": ["Minimalist phones"],
      "url": "https://mudita.com/",
      "description": "Polish minimalist, low-distraction and rugged phones.",
      "monetization": "other"
    },
    {
      "id": "home-assistant",
      "name": "Home Assistant",
      "country": "DE",
      "category": "hardware",
      "replaces": ["Google Home", "HomeKit"],
      "url": "https://www.home-assistant.io/",
      "description": "Open-source, local-first smart-home hub that runs without the cloud.",
      "monetization": "other"
    },
    {
      "id": "shelly",
      "name": "Shelly",
      "country": "BG",
      "category": "hardware",
      "replaces": ["Smart relays"],
      "url": "https://www.shelly.com/",
      "description": "Bulgarian Wi-Fi smart relays and sensors with local control.",
      "monetization": "other"
    },
    {
      "id": "netatmo",
      "name": "Netatmo",
      "country": "FR",
      "category": "hardware",
      "replaces": ["Ring", "Nest"],
      "url": "https://www.netatmo.com/",
      "description": "French smart-home cameras, thermostats and weather stations.",
      "monetization": "other"
    },
    {
      "id": "nuki",
      "name": "Nuki",
      "country": "AT",
      "category": "hardware",
      "replaces": ["August Smart Lock"],
      "url": "https://nuki.io/",
      "description": "Austrian smart locks that retrofit existing doors.",
      "monetization": "other"
    },
    {
      "id": "here-wego",
      "name": "HERE WeGo",
      "country": "NL",
      "category": "hardware",
      "replaces": ["Google Maps"],
      "url": "https://wego.here.com/",
      "description": "Dutch HERE maps and navigation as a Google Maps alternative.",
      "monetization": "other"
    },
    {
      "id": "mistral-ai-le-chat",
      "name": "Mistral AI / Le Chat",
      "country": "FR",
      "category": "ai",
      "replaces": ["ChatGPT", "Claude"],
      "url": "https://mistral.ai/",
      "description": "French frontier AI lab; Le Chat assistant and open-weight LLMs.",
      "monetization": "other"
    },
    {
      "id": "aleph-alpha",
      "name": "Aleph Alpha",
      "country": "DE",
      "category": "ai",
      "replaces": ["OpenAI GPT"],
      "url": "https://www.aleph-alpha.com/",
      "description": "German sovereign LLM provider for enterprise and public sector.",
      "monetization": "other"
    },
    {
      "id": "poolside",
      "name": "Poolside",
      "country": "FR",
      "category": "ai",
      "replaces": ["GitHub Copilot"],
      "url": "https://poolside.ai/",
      "description": "French AI lab building code-generation models for developers.",
      "monetization": "other"
    },
    {
      "id": "h-company",
      "name": "H Company",
      "country": "FR",
      "category": "ai",
      "replaces": ["Adept AI"],
      "url": "https://www.h.company/",
      "description": "French AI startup building autonomous computer-use agents.",
      "monetization": "other"
    },
    {
      "id": "kyutai-moshi",
      "name": "Kyutai (Moshi)",
      "country": "FR",
      "category": "ai",
      "replaces": ["Google DeepMind (voice)"],
      "url": "https://www.kyutai.org/",
      "description": "French non-profit AI lab behind the Moshi real-time voice model.",
      "monetization": "other"
    },
    {
      "id": "silo-ai",
      "name": "Silo AI (now AMD-owned)",
      "country": "FI",
      "category": "ai",
      "replaces": ["OpenAI"],
      "url": "https://www.silo.ai/",
      "description": "Finnish AI lab (now AMD-owned) building European language models.",
      "monetization": "other"
    },
    {
      "id": "eurollm",
      "name": "EuroLLM",
      "country": "EU",
      "category": "ai",
      "replaces": ["GPT-4 (multilingual)"],
      "url": "https://www.eurollm.com/",
      "description": "EU-funded open multilingual LLM covering all official EU languages.",
      "monetization": "other"
    },
    {
      "id": "black-forest-labs-flux",
      "name": "Black Forest Labs (FLUX)",
      "country": "DE",
      "category": "ai",
      "replaces": ["Midjourney", "DALL-E"],
      "url": "https://www.blackforestlabs.ai/",
      "description": "German image-generation lab behind the FLUX models.",
      "monetization": "other"
    },
    {
      "id": "stability-ai",
      "name": "Stability AI (Stable Diffusion)",
      "country": "GB",
      "category": "ai",
      "replaces": ["Midjourney"],
      "url": "https://stability.ai/",
      "description": "UK lab behind the Stable Diffusion open image models.",
      "monetization": "other"
    },
    {
      "id": "jina-ai",
      "name": "Jina AI",
      "country": "DE",
      "category": "ai",
      "replaces": ["OpenAI Embeddings"],
      "url": "https://jina.ai/",
      "description": "German provider of embeddings, rerankers and neural search models.",
      "monetization": "other"
    },
    {
      "id": "deepl",
      "name": "DeepL",
      "country": "DE",
      "category": "ai",
      "replaces": ["Google Translate"],
      "url": "https://www.deepl.com/",
      "description": "German neural machine translation known for high-quality output.",
      "monetization": "other"
    },
    {
      "id": "etranslation",
      "name": "eTranslation (EU official)",
      "country": "BE",
      "category": "ai",
      "replaces": ["Google Translate"],
      "url": "https://webgate.ec.europa.eu/etranslation/",
      "description": "The European Commission's official machine-translation service.",
      "monetization": "other"
    },
    {
      "id": "reverso",
      "name": "Reverso",
      "country": "FR",
      "category": "ai",
      "replaces": ["Google Translate"],
      "url": "https://www.reverso.net/",
      "description": "French translation and language tools with real-world context examples.",
      "monetization": "other"
    },
    {
      "id": "unbabel-widn-ai",
      "name": "Unbabel, Widn.ai",
      "country": "PT",
      "category": "ai",
      "replaces": ["Google Translate"],
      "url": "https://unbabel.com/",
      "description": "Portuguese AI translation (Unbabel) and the Widn.ai model platform.",
      "monetization": "other"
    },
    {
      "id": "openproject",
      "name": "OpenProject",
      "country": "DE",
      "category": "project-management",
      "replaces": ["Jira", "Asana", "Monday"],
      "url": "https://www.openproject.org/",
      "description": "German open-source project management with Gantt, boards and agile.",
      "monetization": "other"
    },
    {
      "id": "meistertask",
      "name": "MeisterTask",
      "country": "AT",
      "category": "project-management",
      "replaces": ["Trello", "Asana"],
      "url": "https://www.meistertask.com/",
      "description": "Austrian Kanban task management with clean, visual boards.",
      "monetization": "other"
    },
    {
      "id": "zenkit",
      "name": "Zenkit",
      "country": "DE",
      "category": "project-management",
      "replaces": ["ClickUp", "Trello"],
      "url": "https://zenkit.com/",
      "description": "German flexible workspace for tasks, databases and wikis.",
      "monetization": "other"
    },
    {
      "id": "awork",
      "name": "awork",
      "country": "DE",
      "category": "project-management",
      "replaces": ["Monday", "Asana"],
      "url": "https://www.awork.com/",
      "description": "German work-management and time-tracking for teams and agencies.",
      "monetization": "other"
    },
    {
      "id": "projektron-bcs",
      "name": "Projektron BCS",
      "country": "DE",
      "category": "project-management",
      "replaces": ["MS Project"],
      "url": "https://www.projektron.de/",
      "description": "German web-based project management for planning and billing.",
      "monetization": "other"
    },
    {
      "id": "tella",
      "name": "Tella",
      "country": "PT",
      "category": "project-management",
      "replaces": ["Loom"],
      "url": "https://www.tella.tv/",
      "description": "Portuguese browser-based screen and video recorder.",
      "monetization": "other"
    },
    {
      "id": "n26",
      "name": "N26",
      "country": "DE",
      "category": "fintech",
      "replaces": ["Revolut", "Chase"],
      "url": "https://n26.com/",
      "description": "German mobile-first bank offering EU current accounts.",
      "monetization": "other"
    },
    {
      "id": "bunq",
      "name": "Bunq",
      "country": "NL",
      "category": "fintech",
      "replaces": ["Standard banks"],
      "url": "https://www.bunq.com/",
      "description": "Dutch app-based bank with a privacy and sustainability focus.",
      "monetization": "other"
    },
    {
      "id": "klarna",
      "name": "Klarna",
      "country": "SE",
      "category": "fintech",
      "replaces": ["PayPal Credit", "Affirm"],
      "url": "https://www.klarna.com/",
      "description": "Swedish payments and buy-now-pay-later provider.",
      "monetization": "other"
    },
    {
      "id": "adyen-mollie",
      "name": "Adyen, Mollie",
      "country": "NL",
      "category": "fintech",
      "replaces": ["Stripe", "PayPal"],
      "url": "https://www.adyen.com/",
      "description": "Dutch payment platforms for global cards and local payment methods.",
      "monetization": "other"
    },
    {
      "id": "sproof",
      "name": "Sproof",
      "country": "AT",
      "category": "fintech",
      "replaces": ["DocuSign", "Adobe Sign"],
      "url": "https://sproof.io/",
      "description": "Austrian qualified e-signature platform (eIDAS-compliant).",
      "monetization": "other"
    },
    {
      "id": "scrive",
      "name": "Scrive",
      "country": "SE",
      "category": "fintech",
      "replaces": ["DocuSign", "Adobe Sign"],
      "url": "https://www.scrive.com/",
      "description": "Swedish e-signature and digital identity platform (eIDAS).",
      "monetization": "other"
    },
    {
      "id": "mastodon",
      "name": "Mastodon",
      "country": "DE",
      "category": "social",
      "replaces": ["X", "Twitter"],
      "url": "https://joinmastodon.org/",
      "description": "Federated microblogging",
      "monetization": "other"
    },
    {
      "id": "w-social",
      "name": "W Social",
      "country": "SE",
      "category": "social",
      "replaces": ["X", "Twitter"],
      "url": "https://wsocial.com/",
      "description": "Launched May 2026",
      "monetization": "other"
    },
    {
      "id": "pixelfed",
      "name": "Pixelfed",
      "country": "EU",
      "category": "social",
      "replaces": ["Instagram"],
      "url": "https://pixelfed.org/",
      "description": "Federated, photo-first",
      "monetization": "other"
    },
    {
      "id": "monnett",
      "name": "Monnett",
      "country": "LU",
      "category": "social",
      "replaces": ["Instagram"],
      "url": "https://monnett.com/",
      "description": "Non-AI, ad-light, paid tier",
      "monetization": "other"
    },
    {
      "id": "leafplaza",
      "name": "LeafPlaza",
      "country": "EU",
      "category": "social",
      "replaces": ["Reddit", "Facebook"],
      "url": "https://leafplaza.com/",
      "description": "Decentralized",
      "monetization": "other"
    },
    {
      "id": "flixbus",
      "name": "FlixBus",
      "country": "DE",
      "category": "transport",
      "replaces": ["Greyhound"],
      "url": "https://www.flixbus.com/",
      "description": "German long-distance coach network across Europe.",
      "monetization": "other"
    },
    {
      "id": "blablacar",
      "name": "BlaBlaCar",
      "country": "FR",
      "category": "transport",
      "replaces": ["Uber"],
      "url": "https://www.blablacar.com/",
      "description": "French long-distance carpooling marketplace.",
      "monetization": "other"
    },
    {
      "id": "peertube",
      "name": "PeerTube",
      "country": "FR",
      "category": "social",
      "replaces": ["YouTube", "Twitch"],
      "url": "https://joinpeertube.org/",
      "description": "French federated video hosting — self-host or join an instance. No ads, no tracking.",
      "monetization": "other"
    },
    {
      "id": "lemmy",
      "name": "Lemmy",
      "country": "DE",
      "category": "social",
      "replaces": ["Reddit"],
      "url": "https://join-lemmy.org/",
      "description": "German-developed federated link aggregator and discussion platform. Open-source, self-hostable.",
      "monetization": "other"
    },
    {
      "id": "xing",
      "name": "XING",
      "country": "DE",
      "category": "social",
      "replaces": ["LinkedIn"],
      "url": "https://www.xing.com/",
      "description": "German professional network, strong in DACH region. GDPR-native alternative to LinkedIn.",
      "monetization": "other"
    },
    {
      "id": "bolt",
      "name": "Bolt",
      "country": "EE",
      "category": "transport",
      "replaces": ["Uber"],
      "url": "https://bolt.eu/",
      "description": "Estonian ride-hailing, e-scooters and food delivery — Europe's challenger to Uber.",
      "monetization": "other"
    },
    {
      "id": "happn",
      "name": "happn",
      "country": "FR",
      "category": "social",
      "replaces": ["Tinder", "Bumble", "Hinge"],
      "url": "https://www.happn.com/",
      "description": "French proximity-based dating app — GDPR-native, no data sold to third parties.",
      "monetization": "other"
    },
    {
      "id": "penpot",
      "name": "Penpot",
      "country": "ES",
      "category": "office",
      "replaces": ["Figma", "Adobe XD", "Canva"],
      "url": "https://penpot.app/",
      "description": "Spanish open-source design tool — self-hostable Figma alternative with open SVG-based files.",
      "monetization": "other"
    },
    {
      "id": "babbel",
      "name": "Babbel",
      "country": "DE",
      "category": "analytics",
      "replaces": ["Duolingo"],
      "url": "https://www.babbel.com/",
      "description": "German language-learning app — subscription-based, no ads, linguist-designed, GDPR-compliant.",
      "monetization": "other"
    },
    {
      "id": "komoot",
      "name": "Komoot",
      "country": "DE",
      "category": "transport",
      "replaces": ["Strava"],
      "url": "https://www.komoot.com/",
      "description": "German outdoor route planning and GPS navigation — privacy-respecting Strava alternative.",
      "monetization": "other"
    },
    {
      "id": "bitpanda",
      "name": "Bitpanda",
      "country": "AT",
      "category": "fintech",
      "replaces": ["Coinbase", "Kraken", "Binance"],
      "url": "https://www.bitpanda.com/",
      "description": "Austrian regulated crypto and investment platform — EU MiCA-compliant, GDPR-native.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.bitpanda.com/"
    },
    {
      "id": "gitpod",
      "name": "Gitpod",
      "country": "DE",
      "category": "code-hosting",
      "replaces": ["Replit", "GitHub Codespaces"],
      "url": "https://www.gitpod.io/",
      "description": "German cloud development environment — open-source, self-hostable browser IDE.",
      "monetization": "other"
    },
    {
      "id": "tier",
      "name": "TIER Mobility",
      "country": "DE",
      "category": "transport",
      "replaces": ["Lime", "Bird"],
      "url": "https://www.tier.app/",
      "description": "German micro-mobility operator — e-scooters and e-bikes across European cities.",
      "monetization": "other"
    },
    {
      "id": "cryptpad",
      "name": "CryptPad",
      "country": "FR",
      "category": "office",
      "replaces": ["Notion", "Google Docs"],
      "url": "https://cryptpad.fr/",
      "description": "French zero-knowledge encrypted collaboration suite — open-source, self-hostable.",
      "monetization": "other"
    },
    {
      "id": "bunny-cdn",
      "name": "BunnyCDN",
      "country": "SI",
      "category": "cloud-infra",
      "replaces": ["Cloudflare"],
      "url": "https://bunny.net/",
      "description": "Slovenian CDN and edge infrastructure provider — privacy-respecting Cloudflare alternative.",
      "monetization": "affiliate",
      "affiliateUrl": "https://bunny.net/"
    },
    {
      "id": "vaultwarden",
      "name": "Vaultwarden",
      "country": "EU",
      "category": "password-manager",
      "replaces": ["Bitwarden (cloud)", "LastPass"],
      "url": "https://github.com/dani-garcia/vaultwarden",
      "description": "Open-source self-hosted Bitwarden-compatible server — full sovereignty over your password vault.",
      "monetization": "other"
    },
    {
      "id": "mullvad",
      "name": "Mullvad VPN",
      "country": "SE",
      "category": "vpn",
      "replaces": ["NordVPN", "ExpressVPN"],
      "url": "https://mullvad.net/",
      "description": "Swedish no-logs VPN — no email required, cash/crypto accepted, 2023 police raid proved zero data.",
      "monetization": "other"
    },
    {
      "id": "holidu",
      "name": "Holidu",
      "country": "DE",
      "category": "social",
      "replaces": ["Airbnb", "Vrbo"],
      "url": "https://www.holidu.com/",
      "description": "German holiday rental search engine — aggregates EU properties, GDPR-native.",
      "monetization": "affiliate",
      "affiliateUrl": "https://www.holidu.com/"
    },
    {
      "id": "booking-nl",
      "name": "Booking.com",
      "country": "NL",
      "category": "social",
      "replaces": ["Hotels.com", "Expedia"],
      "url": "https://www.booking.com/",
      "description": "Dutch-headquartered accommodation platform — Amsterdam HQ, GDPR-compliant.",
      "monetization": "other"
    },
    {
      "id": "gog",
      "name": "GOG.com",
      "country": "PL",
      "category": "social",
      "replaces": ["Steam", "Epic Games Store"],
      "url": "https://www.gog.com/",
      "description": "Polish DRM-free game store by CD Projekt — European-owned gaming marketplace.",
      "monetization": "other"
    },
    {
      "id": "wolt",
      "name": "Wolt",
      "country": "FI",
      "category": "social",
      "replaces": ["Uber Eats", "DoorDash"],
      "url": "https://wolt.com/",
      "description": "Finnish food delivery platform — European-founded, strong GDPR practices.",
      "monetization": "other"
    },
    {
      "id": "hellofresh",
      "name": "HelloFresh",
      "country": "DE",
      "category": "social",
      "replaces": ["Blue Apron"],
      "url": "https://www.hellofresh.com/",
      "description": "German meal-kit delivery company — Berlin-listed, EU-regulated.",
      "monetization": "other"
    },
    {
      "id": "deezer",
      "name": "Deezer",
      "country": "FR",
      "category": "social",
      "replaces": ["Spotify", "Apple Music", "Tidal"],
      "url": "https://www.deezer.com/",
      "description": "French music streaming platform — EU-based alternative to US streaming services.",
      "monetization": "other"
    },
    {
      "id": "vinted",
      "name": "Vinted",
      "country": "LT",
      "category": "social",
      "replaces": ["Poshmark", "ThredUp"],
      "url": "https://www.vinted.com/",
      "description": "Lithuanian fashion resale marketplace — Europe's largest secondhand clothing platform.",
      "monetization": "other"
    },
    {
      "id": "zalando",
      "name": "Zalando",
      "country": "DE",
      "category": "social",
      "replaces": ["ASOS", "Boohoo"],
      "url": "https://www.zalando.com/",
      "description": "German fashion e-commerce platform — EU-regulated, GDPR-compliant.",
      "monetization": "other"
    },
    {
      "id": "norwegian-air",
      "name": "Norwegian Air",
      "country": "NO",
      "category": "transport",
      "replaces": ["Ryanair (non-EU)"],
      "url": "https://www.norwegian.com/",
      "description": "Norwegian low-cost airline — EEA-regulated, GDPR-compliant, strong privacy practices.",
      "monetization": "other"
    },
    {
      "id": "vipps",
      "name": "Vipps",
      "country": "NO",
      "category": "fintech",
      "replaces": ["PayPal", "Venmo"],
      "url": "https://vipps.no/",
      "description": "Norwegian mobile payment platform — bank-consortium owned, strict EEA financial regulation.",
      "monetization": "other"
    },
    {
      "id": "finn-no",
      "name": "FINN.no",
      "country": "NO",
      "category": "social",
      "replaces": ["Craigslist", "Facebook Marketplace"],
      "url": "https://www.finn.no/",
      "description": "Norway's largest online marketplace — Schibsted-owned, GDPR-compliant.",
      "monetization": "other"
    },
    {
      "id": "dnb",
      "name": "DNB Bank",
      "country": "NO",
      "category": "fintech",
      "replaces": ["HSBC", "Barclays"],
      "url": "https://www.dnb.no/",
      "description": "Norway's largest bank — state-partially-owned, strictly regulated under EEA/GDPR.",
      "monetization": "other"
    },
    {
      "id": "elkjop",
      "name": "Elkjøp",
      "country": "NO",
      "category": "social",
      "replaces": ["Best Buy"],
      "url": "https://www.elkjop.no/",
      "description": "Leading Nordic consumer electronics retailer across Scandinavia.",
      "monetization": "other"
    },
    {
      "id": "just-eat",
      "name": "Just Eat Takeaway",
      "country": "NL",
      "category": "social",
      "replaces": ["Uber Eats", "DoorDash"],
      "url": "https://www.justeattakeaway.com/",
      "description": "Dutch-headquartered food delivery platform — EU-registered, GDPR-compliant.",
      "monetization": "other"
    }
  ];
