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
      "affiliateUrl": "https://plausible.io",
      "longDescription": "Plausible Analytics is an Estonia-based, lightweight, and open-source web analytics tool. It is built to be cookie-less and fully GDPR/CCPA compliant out-of-the-box, meaning you do not need to display intrusive cookie consent banners to visitors. Operating on EU-owned cloud infrastructure, Plausible collects zero personal data, anonymizes IP addresses, and has a footprint under 3 KB—making your website load significantly faster than with Google Analytics.",
      "features": [
        "Cookie-less tracking out-of-the-box",
        "Lightweight script under 3 KB (17x smaller than GA)",
        "Fully GDPR, CCPA, and PECR compliant",
        "All data processed on sovereign EU servers",
        "No cookie banners required for analytics"
      ],
      "pricing": "Free trial, then from €9.00/month",
      "dataLocation": "Estonia / Germany (EU)"
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
      "affiliateUrl": "https://mullvad.net/browser",
      "longDescription": "The Mullvad Browser is a privacy-focused web browser developed in collaboration with the Tor Project. Operating on the philosophy of 'hiding in the crowd,' it creates a standardized digital fingerprint for all users, making individual tracking and browser fingerprinting mathematically impractical. It strips away all telemetry, blocks third-party cookies and trackers by default, and operates permanently in private browsing mode. Designed to be paired with a trustworthy VPN rather than the high-latency Tor network, it delivers rapid, secure, tracker-free web access.",
      "features": [
        "Developed in collaboration with Tor Project",
        "Aggressive anti-fingerprinting defaults",
        "No browser telemetry or trackers",
        "Defaults to private browsing mode",
        "Optimized for VPN usage"
      ],
      "pricing": "Free (Open-source)",
      "dataLocation": "Local (Sweden)",
      "verifiedAffiliate": true
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
      "affiliateUrl": "https://codeberg.org",
      "longDescription": "Codeberg is a non-profit, community-driven platform for hosting software source code. Headquartered in Berlin, Germany, it operates on the open-source Forgejo forge (a community fork of Gitea). Codeberg is hosted on sovereign European server infrastructure and governed strictly by EU privacy regulations. Unlike commercial code repositories owned by US corporate conglomerates, Codeberg does not claim rights to your code, forces no telemetry, and maintains full commitment to software freedom.",
      "features": [
        "Non-profit, member-supported association",
        "Built on 100% open-source Forgejo",
        "Hosted on German servers under GDPR",
        "No hidden telemetry or copyright waivers",
        "Compatible with GitHub Actions CI workflows"
      ],
      "pricing": "Free (Donation-based model)",
      "dataLocation": "Germany (Berlin)"
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
      "affiliateUrl": "https://go.getproton.me/SH1mR",
      "longDescription": "Proton Mail is a secure email service based in Geneva, Switzerland, that utilizes open-source OpenPGP end-to-end encryption. Because it operates under strict Swiss privacy laws, user data remains insulated from mass surveillance networks and foreign intelligence requests. Unlike ad-supported mainstream email services, Proton Mail cannot read your messages or mine your metadata for profit. All messages sent between Proton accounts are encrypted automatically, and unencrypted mail sent to other hosts is encrypted on disk at rest. Proton has built a comprehensive privacy ecosystem, integrating Calendar, Drive, and Pass to replace US tech giants entirely.",
      "features": [
        "Zero-access encryption on disk",
        "E2EE auto-encryption for Proton users",
        "Protected by Swiss Federal Act on Data Protection",
        "Completely open-source and audited",
        "Integrated Calendar, Drive, and Password Manager"
      ],
      "pricing": "Free or €3.99/month",
      "dataLocation": "Switzerland (Geneva)",
      "verifiedAffiliate": true
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
      "affiliateUrl": "https://go.getproton.me/SH2jp",
      "longDescription": "Proton VPN is a Swiss-based, privacy-focused virtual private network that channels your traffic through secure, encrypted tunnels. Born from the same team that created Proton Mail, it operates under strict Swiss jurisdiction. Proton VPN maintains a strict no-logs policy, meaning they cannot record your browsing history or track your connection metadata. The service features unique Secure Core architecture, which routes traffic through multiple servers in privacy-friendly nations like Switzerland, Iceland, and Sweden before exiting to prevent network-level snooping.",
      "features": [
        "Strict Swiss no-logs policy",
        "Secure Core server architecture",
        "NetShield Ad-blocker & Malware filter",
        "Tor over VPN integration",
        "Fully open-source and independently audited"
      ],
      "pricing": "Free or €4.99/month",
      "dataLocation": "Switzerland, Iceland, Sweden",
      "verifiedAffiliate": true
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
      "affiliateUrl": "https://go.getproton.me/SH1mP",
      "longDescription": "Proton Pass is a zero-knowledge password manager designed to secure your passwords, notes, credit card credentials, and two-factor authentication (2FA) codes. Built with end-to-end encryption in Switzerland, Proton Pass encrypts all fields—including usernames, URLs, and passwords—before leaving your device. It integrates with Proton's aliasing engine, allowing you to generate unique, random email addresses for every site you register, keeping your true identity completely shielded from data breaches and cross-site tracking.",
      "features": [
        "Zero-knowledge end-to-end encryption",
        "Encrypts all metadata (including URLs)",
        "Integrated email aliasing (SimpleLogin)",
        "Built-in 2FA authenticator",
        "Syncs securely across all devices"
      ],
      "pricing": "Free or €1.99/month",
      "dataLocation": "Switzerland (Geneva)",
      "verifiedAffiliate": true
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
      "affiliateUrl": "https://tuta.com",
      "longDescription": "Tuta (formerly Tutanota) is a German secure email and calendar provider based in Hanover. It represents a major advancement in email security by implementing hybrid post-quantum cryptography under its TutaCrypt protocol (combining AES-256 and Kyber-1024). Unlike standard PGP-based email which leaves email headers and subject lines unencrypted during transport, Tuta encrypts your entire mailbox at rest—including calendars, address books, and subject lines. Operating strictly under German BDSG and EU GDPR laws, Tuta supports fully anonymous registration with zero tracker scripts, and operates on 100% renewable energy.",
      "features": [
        "Post-quantum hybrid encryption (Kyber)",
        "Fully encrypted subject lines & metadata",
        "100% open-source and self-funded",
        "Zero third-party trackers or ads",
        "Hosted on green-energy German servers"
      ],
      "pricing": "Free or €3.00/month",
      "dataLocation": "Germany (Hanover)",
      "verifiedAffiliate": true
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
      "affiliateUrl": "https://www.passbolt.com",
      "longDescription": "Passbolt is an open-source, extensible password manager engineered specifically for DevOps teams and collaborative work environments. Headquartered in Luxembourg, it utilizes an asymmetric OpenPGP encryption model. Every user possesses their own private key, and password credentials are encrypted locally on the user's browser before transfer. Passbolt can be hosted on sovereign cloud servers or deployed fully on-premises (on air-gapped systems), providing complete credential sovereignty.",
      "features": [
        "Asymmetric OpenPGP encryption protocol",
        "Zero-knowledge team sharing system",
        "Self-hostable and ready for air-gapped setups",
        "Granular access controls and audit logging",
        "100% open-source and security audited"
      ],
      "pricing": "Free (Community) or €20/user/year",
      "dataLocation": "Luxembourg / On-premises"
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
      "country": "CH",
      "category": "messaging",
      "replaces": ["WhatsApp", "Telegram", "Viber"],
      "url": "https://threema.ch/",
      "description": "Zero-knowledge messenger from Switzerland. No phone number required.",
      "monetization": "other",
      "longDescription": "Threema is an end-to-end encrypted messaging service based in Switzerland. It is engineered from the ground up for data minimization: it allows fully anonymous account creation without requiring an email address or a phone number. All communications—including text messages, voice calls, group chats, and media—are encrypted locally on the device using the NaCl cryptography library. Threema hosts its own server infrastructure in state-of-the-art Swiss data centers, ensuring your social graph and communication metadata remain isolated from external intelligence agencies.",
      "features": [
        "100% anonymous (no phone number/email needed)",
        "End-to-end encrypted group chats and calls",
        "Self-owned servers in Swiss data centers",
        "Symmetric encryption via NaCl library",
        "Strict Swiss jurisdiction"
      ],
      "pricing": "€4.99 one-time payment",
      "dataLocation": "Switzerland (Zürich)"
    },
    {
      "id": "simplex-chat",
      "name": "SimpleX Chat",
      "country": "EU",
      "category": "messaging",
      "replaces": ["WhatsApp", "Signal", "Telegram"],
      "url": "https://simplex.chat/",
      "description": "The first messaging platform without user identifiers. Absolute metadata protection.",
      "monetization": "other",
      "longDescription": "SimpleX Chat is a decentralized messaging protocol that eliminates metadata tracking by operating without any global user identifiers—no phone numbers, no email addresses, and no randomized user IDs. It utilizes the SimpleX Messaging Protocol (SMP) to create temporary, unidirectional communication queues between contacts. Traffic is routed through onion-routing mechanisms, preventing server operators from mapping your social graph. Post-quantum cryptographic resistance is integrated through crystals-kyber keys, offering absolute future-proof security.",
      "features": [
        "No user identifiers of any kind",
        "Unidirectional temporary message queues",
        "Onion-routed traffic to mask IP and social graph",
        "Post-quantum resistant cryptography (Kyber)",
        "100% open-source and peer-reviewed"
      ],
      "pricing": "Free (Open-source)",
      "dataLocation": "Decentralized (Onion-routed)"
    },
    {
      "id": "olvid",
      "name": "Olvid",
      "country": "FR",
      "category": "messaging",
      "replaces": ["WhatsApp", "Signal", "Teams"],
      "url": "https://olvid.io/",
      "description": "French government-mandated zero-trust messenger. ANSSI certified security.",
      "monetization": "other",
      "longDescription": "Olvid is a French secure messaging platform that uses a zero-trust model to authenticate users without relying on a centralized contact directory or server-side trust. All encryption keys are exchanged peer-to-peer directly between devices. Olvid encrypts both content and communication metadata on-device, ensuring that even a compromised server operator cannot read messages or reconstruct users' social graphs. In 2023, the French government officially mandated Olvid for all ministries to replace US platforms, backed by a First-Level Security Certification (CSPN) from the national agency ANSSI.",
      "features": [
        "Zero-trust peer-to-peer key exchange",
        "ANSSI CSPN certified architecture",
        "Mandated for French government ministries",
        "Zero centralized server directory",
        "Encrypted metadata and content"
      ],
      "pricing": "Free or €4.99/month (enterprise features)",
      "dataLocation": "France / Local"
    },
    {
      "id": "wire",
      "name": "Wire",
      "country": "CH",
      "category": "messaging",
      "replaces": ["Slack", "Microsoft Teams", "WhatsApp"],
      "url": "https://wire.com/",
      "description": "Secure collaboration platform with Swiss jurisdiction and MLS encryption.",
      "monetization": "other",
      "longDescription": "Wire is an end-to-end encrypted collaboration and messaging platform headquartered in Switzerland. Engineered for enterprise environments and remote teams, Wire integrates the Messaging Layer Security (MLS) protocol to ensure efficient, secure communication across large groups. It secures chat, video calls, files, and screen sharing. Unlike foreign alternatives, Wire can be hosted on sovereign European clouds or deployed completely on-premises for maximum data control.",
      "features": [
        "End-to-end encryption via MLS protocol",
        "On-premises or sovereign cloud hosting options",
        "Secure group video calls and screen sharing",
        "Swiss data residency and jurisdiction",
        "Open-source client code"
      ],
      "pricing": "Free or €5.83/month (enterprise)",
      "dataLocation": "Switzerland / EU / On-premises"
    },
    {
      "id": "delta-chat",
      "name": "Delta Chat",
      "country": "DE",
      "category": "messaging",
      "replaces": ["WhatsApp", "Telegram"],
      "url": "https://delta.chat/",
      "description": "Serverless messaging over standard email servers.",
      "monetization": "other",
      "longDescription": "Delta Chat is a serverless, decentralized messaging app that does not use its own servers, but instead uses the most massive and diverse open communication system in existence: email. Delta Chat runs E2EE chat communications via Autocrypt keys using standard IMAP/SMTP protocols. This means you do not need a phone number, registration, or a separate service provider—it works with your existing secure email account.",
      "features": [
        "Serverless architecture using existing email IMAP/SMTP",
        "Autocrypt end-to-end encryption standard",
        "No new registration, usernames, or phone numbers needed",
        "Completely open-source and community governed",
        "Fully decentralized and independent of chat corporations"
      ],
      "pricing": "Free (Open-source)",
      "dataLocation": "Decentralized (Your email host)"
    },
    {
      "id": "element-matrix",
      "name": "Element / Matrix",
      "country": "GB",
      "category": "messaging",
      "replaces": ["Slack", "Discord", "Microsoft Teams"],
      "url": "https://element.io/",
      "description": "Decentralized, federated secure communication platform built on Matrix.",
      "monetization": "other",
      "longDescription": "Element is the flagship client for Matrix, an open, decentralized network protocol for real-time secure communications. Matrix operates as a federated system: rather than relying on a single company's servers, users can join any server in the federation or host their own, communicating seamlessly across the entire network. Element encrypts chats, video calls, and files by default using the Olm and Megolm cryptographic ratchets. It serves as a standard tool for digital sovereignty in the German public sector, French government (Tchap), and Swedish healthcare systems.",
      "features": [
        "Decentralized federated architecture",
        "End-to-end encryption via Megolm protocol",
        "Sovereign hosting on-premises or EU cloud",
        "Bridging capabilities to Slack, Discord, WhatsApp",
        "Chosen by major European governments"
      ],
      "pricing": "Free or €3.00/month (enterprise hosting)",
      "dataLocation": "Decentralized / EU / Germany / UK"
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
      "category": "office",
      "replaces": ["Cisco Webex", "Zoom", "Microsoft Teams"],
      "url": "https://www.pexip.com/",
      "description": "Enterprise-grade, self-hostable video conferencing from Norway.",
      "monetization": "other",
      "longDescription": "Pexip is a secure video conferencing and collaboration platform based in Oslo, Norway. Engineered to provide a 'fortress' communications model, Pexip is designed for government agencies, military organizations, healthcare systems, and highly regulated enterprises. It can be deployed in sovereign private clouds, on-premises, or in completely air-gapped secure zones. Pexip adheres to strict zero-trust principles, supports role-based and attribute-based access controls, and holds certifications including DISA, FIPS 140-3, and ISO 27001.",
      "features": [
        "Fully self-hostable and deployable in air-gapped zones",
        "Zero data/metadata collection when self-hosted",
        "Sovereign Norwegian jurisdiction and GDPR compliant",
        "DISA and FIPS 140-3 security certifications",
        "Seamless interoperability with legacy systems"
      ],
      "pricing": "Custom enterprise pricing",
      "dataLocation": "Norway / EU / On-premises"
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
      "category": "office",
      "replaces": ["Google Drive", "Dropbox", "Microsoft 365", "Google Workspace"],
      "url": "https://nextcloud.com/",
      "description": "German self-hostable suite for file sync, calendar, mail and collaboration.",
      "monetization": "other",
      "longDescription": "Nextcloud is an open-source, self-hostable collaboration platform headquartered in Germany. It replaces Google Workspace and Microsoft 365 by unifying file storage, document editing, email, calendars, task management, and video conferencing in a single hub. Unlike US cloud suites, Nextcloud can be hosted on your own server or on sovereign European hostings (OVHcloud, Hetzner), ensuring you maintain absolute ownership of your data, free from US CLOUD Act surveillance. It is the gold standard for public sector bodies, education networks, and enterprises seeking compliance and zero vendor lock-in.",
      "features": [
        "100% self-hostable or sovereign EU hosted",
        "Full suite: Files, Mail, Talk, Calendar, Office",
        "GDPR-compliant collaboration without vendor telemetry",
        "Relational security with complete audit logs",
        "Open-source license (no user pricing escalations)"
      ],
      "pricing": "Free (Self-hosted) or Hosted from €3/user/month",
      "dataLocation": "Self-hosted / Germany / EU"
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
      "affiliateUrl": "https://go.getproton.me/SH1mO",
      "longDescription": "Proton Drive is a secure, end-to-end encrypted cloud storage service that safeguards your files, photos, and folders. Unlike traditional cloud drives, Proton Drive encrypts file contents and vital metadata—including file names, folder structures, and file sizes—on your device before uploading. This zero-knowledge approach ensures that Proton, hackers, and foreign agencies can never read your files. Integrated with Swiss law, Proton Drive provides a robust space for collaboration and backup without vendor surveillance.",
      "features": [
        "Zero-knowledge end-to-end encryption",
        "Metadata encryption (filenames & folder tree)",
        "Secure, encrypted link sharing",
        "Automatic photo backups",
        "Strict Swiss jurisdiction"
      ],
      "pricing": "Free or €1.99/month",
      "dataLocation": "Switzerland (Geneva)",
      "verifiedAffiliate": true
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
      "monetization": "other",
      "longDescription": "Jottacloud is a cloud storage and backup provider headquartered in Oslo, Norway. It operates green server infrastructure deep inside the Norwegian mountains, cooled by seawater and powered entirely by renewable hydropower. Because Jottacloud is wholly based in Norway, it is governed strictly by Norwegian privacy laws and the GDPR, removing it from US jurisdiction and the CLOUD Act. It offers unlimited cloud backup plans for consumers, automatic photo synchronization, and privacy-respecting local machine learning models for image search without third-party data processing.",
      "features": [
        "100% Norwegian jurisdiction (outside US CLOUD Act)",
        "Unlimited storage plans for personal backup",
        "Green server facilities powered by hydropower",
        "Local privacy-safe AI photo searching",
        "Fully GDPR compliant storage"
      ],
      "pricing": "Free or €9.90/month (unlimited)",
      "dataLocation": "Norway (Stavanger/Oslo)"
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
      "replaces": ["Google Docs", "Google Sheets", "Miro", "Confluence"],
      "url": "https://cryptpad.fr/",
      "description": "French zero-knowledge collaborative office suite. Browser-side encryption.",
      "monetization": "other",
      "longDescription": "CryptPad is a private, zero-knowledge collaborative office suite developed in France. It encrypts all documents, spreadsheets, slides, and Kanban boards directly in the user's browser before transmission. The decryption keys are stored in the URL fragment (#), meaning the server hosting the files receives only encrypted blobs and never has access to the document contents. CryptPad is fully open-source, respects user privacy by refusing to compile behavioral tracking profiles, and is funded by research grants and donations.",
      "features": [
        "Zero-knowledge browser-side encryption",
        "Decryption keys stored locally in URL fragment",
        "Collaborative real-time spreadsheets, docs, and pads",
        "No email or personal details required to sign up",
        "Open-source and hostable on-premises"
      ],
      "pricing": "Free or €5.00/month",
      "dataLocation": "France (Paris)"
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
    },
    {
      "id": "signicat",
      "name": "Signicat",
      "country": "NO",
      "category": "security",
      "replaces": ["DocuSign", "Jumio"],
      "url": "https://www.signicat.com/",
      "description": "Norwegian Qualified Trust Service Provider (QTSP) for identity verification.",
      "monetization": "other",
      "longDescription": "Signicat is a premier European digital identity service provider based in Trondheim, Norway. Operating as an eIDAS Qualified Trust Service Provider, Signicat offers secure electronic signatures, identity verification, and customer onboarding. It integrates more than 35 national electronic IDs (e.g. BankID, MitID) across Europe into a single secure interface, enabling businesses in highly regulated sectors (fintech, banking, healthcare) to conduct automated AML and KYC checks under strict GDPR compliance.",
      "features": [
        "Qualified Trust Service Provider (QTSP) under eIDAS",
        "Aggregation of 35+ national eIDs under one API",
        "Deepfake-resistant optical identity verification",
        "Strict compliance with PSD2 and AML regulations",
        "Sovereign Norwegian and EU data residency"
      ],
      "pricing": "Custom enterprise pricing",
      "dataLocation": "Norway / EU"
    },
    {
      "id": "dealbuilder",
      "name": "Dealbuilder",
      "country": "NO",
      "category": "office",
      "replaces": ["DocuSign", "PandaDoc"],
      "url": "https://dealbuilder.io/",
      "description": "Norwegian contract lifecycle and e-signature platform.",
      "monetization": "other",
      "longDescription": "Dealbuilder is a Norwegian contract lifecycle management and electronic signature platform. It streamlines proposal generation, document editing, and legally binding e-signatures under eIDAS and GDPR rules. Because all document vaults and server logs are kept within the EEA under Norwegian jurisdiction, corporate agreements and employee records remain isolated from foreign surveillance or unauthorized intelligence access requests.",
      "features": [
        "Contract proposal builder and e-signature flow",
        "Strict GDPR compliance with data hosted in the EU/EEA",
        "Legally binding signatures matching eIDAS regulations",
        "No transfer of corporate data to third countries",
        "Clean, modern user experience designed for sales teams"
      ],
      "pricing": "From €29/month",
      "dataLocation": "Norway / EU"
    },
    {
      "id": "n8n",
      "name": "n8n",
      "country": "DE",
      "category": "project-management",
      "replaces": ["Zapier", "Make"],
      "url": "https://n8n.io/",
      "description": "Fair-code workflow automation. Keep your API keys and data local.",
      "monetization": "other",
      "longDescription": "n8n is a fair-code, extendable workflow automation tool based in Berlin, Germany. It serves as a secure alternative to Zapier, allowing enterprises to connect various software tools and APIs. By self-hosting n8n, organizations ensure that sensitive customer data, corporate credentials, and internal databases never traverse third-party servers. n8n's open-source node system allows deep flexibility while preserving complete data residency, making it highly suitable for compliance-sensitive operations.",
      "features": [
        "Self-hostable node-based automation platform",
        "Prevents API credential leakage to third parties",
        "Granular data flow governance and custom node building",
        "EU-based enterprise support and compliance audits",
        "No transaction execution limits when self-hosted"
      ],
      "pricing": "Free (Self-hosted) or Hosted from €20/month",
      "dataLocation": "Self-hosted / Germany / EU"
    },
    {
      "id": "baserow",
      "name": "Baserow",
      "country": "NL",
      "category": "project-management",
      "replaces": ["Airtable"],
      "url": "https://baserow.io/",
      "description": "Dutch open-source no-code database built on PostgreSQL.",
      "monetization": "other",
      "longDescription": "Baserow is an open-source, no-code database and collaborative spreadsheet platform headquartered in Amsterdam, Netherlands. Built on robust relational technology (PostgreSQL and Django), Baserow lets teams manage complex datasets without vendor lock-in. Unlike US-based Airtable, Baserow can be self-hosted, removing row limitations and ensuring total data residency under GDPR. It is SOC 2 Type II certified and complies fully with HIPAA requirements, making it ideal for government and healthcare teams.",
      "features": [
        "Self-hostable with unlimited rows and tables",
        "Relational database architecture built on PostgreSQL",
        "SOC 2 Type II, HIPAA, and GDPR compliant",
        "Rich REST API and developer-first design",
        "100% open-source and customizable"
      ],
      "pricing": "Free (Self-hosted) or Hosted from €5/user/month",
      "dataLocation": "Self-hosted / Netherlands / EU"
    },
    {
      "id": "black-forest-labs",
      "name": "Black Forest Labs",
      "country": "DE",
      "category": "ai",
      "replaces": ["Midjourney", "OpenAI DALL-E"],
      "url": "https://blackforestlabs.ai/",
      "description": "German AI lab; creators of the state-of-the-art FLUX model family.",
      "monetization": "other",
      "longDescription": "Black Forest Labs is a frontier artificial intelligence research lab based in Germany, founded by the original architects of Stable Diffusion. The lab developed FLUX, a state-of-the-art family of open-weight text-to-image models. Utilizing 'Flow Matching' technology, FLUX predicts optimal transport paths from noise, leading to superior prompt adherence, text rendering, and high-fidelity generation. By hosting FLUX weights on local GPU rigs or using European API endpoints, creative teams keep their generative assets and IP fully within EU jurisdictions.",
      "features": [
        "Advanced Flow Matching image generation technology",
        "State-of-the-art text rendering and spatial reasoning",
        "Open-weight models (FLUX.1 Schnell) under Apache 2.0",
        "Can be run 100% locally on sovereign GPU infrastructure",
        "Strictly complies with the upcoming EU AI Act"
      ],
      "pricing": "Free (Open-weight) or API per-image pricing",
      "dataLocation": "Local / Germany / EU"
    },
    {
      "id": "kyutai",
      "name": "Kyutai",
      "country": "FR",
      "category": "ai",
      "replaces": ["OpenAI Voice Mode"],
      "url": "https://kyutai.org/",
      "description": "French open-science AI laboratory; creators of the Moshi real-time voice model.",
      "monetization": "other",
      "longDescription": "Kyutai is an open-science artificial intelligence laboratory headquartered in Paris, France. Financed by sovereign European investments, Kyutai developed Moshi, a speech-to-speech AI model that operates in full-duplex mode. Unlike US models which stack separate speech-to-text, LLM, and text-to-speech stages, Moshi processes audio directly with under 300 milliseconds of latency, understanding emotional tones and backchannel signals. Kyutai releases its models as openweights to ensure European AI sovereignty.",
      "features": [
        "Speech-native multimodal modeling (no text bridge)",
        "Ultra-low latency under 300ms (full-duplex conversation)",
        "Open-science weight releases for public deployment",
        "Independent European funding and corporate structure",
        "Zero vendor lock-in or telemetry enforcement"
      ],
      "pricing": "Free (Open-source weights)",
      "dataLocation": "Local / France (EU)"
    },
    {
      "id": "floka",
      "name": "Floka",
      "country": "NO",
      "category": "ai",
      "replaces": ["OpenAI Enterprise Assistants"],
      "url": "https://floka.ai/",
      "description": "Norwegian AI assistant (Solvei) connecting to sovereign business systems.",
      "monetization": "other",
      "longDescription": "Floka is a Norwegian artificial intelligence integrator that bridges advanced language models with localized business systems. Their signature AI assistant, Solvei, connects securely to ERP, CRM, and accounting programs within the EEA. Floka prioritizes strict privacy and data minimization, ensuring that sensitive corporate files are never exported to foreign cloud hosts or used to train third-party models.",
      "features": [
        "Privacy-first integration with localized ERP/CRM systems",
        "Solvei assistant designed specifically for Nordic SMBs",
        "Ensures company IP is never ingested by foreign LLM trainers",
        "Sovereign hosting in Norwegian data centers",
        "Full compliance with GDPR and EEA rules"
      ],
      "pricing": "Custom contract pricing",
      "dataLocation": "Norway / EU"
    }
  ];
