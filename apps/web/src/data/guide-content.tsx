export interface GuideService {
  name: string;
  country: string;
  tagline: string;
  pros: string[];
  cons: string[];
  price: string;
  url: string;
  isAffiliate?: boolean;
}

export interface GuideData {
  id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  intro: string;
  whySwitch: string[];
  services: GuideService[];
  verdict: string;
  faq: { q: string; a: string }[];
}

export const GUIDE_CONTENT: Record<string, GuideData> = {
  "best-european-email": {
    id: "best-european-email",
    title: "Best European Email Providers in 2026",
    metaTitle: "Best European Email Providers in 2026 — Gmail Alternatives | digitaleu.me",
    metaDescription:
      "Compare the best privacy-friendly European email providers: Proton Mail, Tuta, Mailbox.org, and Posteo. All GDPR-compliant, zero-knowledge options.",
    category: "email",
    difficulty: "Easy",
    intro:
      "Gmail is free — but you pay with your data. Google scans your inbox to build an advertising profile. European email providers offer end-to-end encryption, GDPR compliance, and servers in jurisdictions that actively protect your privacy. Here are the best options.",
    whySwitch: [
      "Gmail scans your inbox for advertising targeting",
      "Google stores data under US law (FISA 702 surveillance exposure)",
      "European providers are subject to GDPR — the world's strongest privacy law",
      "End-to-end encryption means even the provider cannot read your emails",
    ],
    services: [
      {
        name: "Proton Mail",
        country: "Switzerland 🇨🇭",
        tagline: "The gold standard for encrypted email",
        pros: [
          "Zero-knowledge end-to-end encryption by default",
          "Based in Switzerland — outside EU/US surveillance treaties",
          "Free tier with 1 GB storage",
          "Open-source, independently audited",
          "Part of a broader privacy ecosystem (VPN, Drive, Calendar)",
        ],
        cons: [
          "Free plan limited to 1 GB and one address",
          "No support for third-party email clients on free plan",
        ],
        price: "Free / from €3.99/mo",
        url: "https://proton.me/mail",
        isAffiliate: true,
      },
      {
        name: "Tuta",
        country: "Germany 🇩🇪",
        tagline: "Open-source, quantum-resistant encryption",
        pros: [
          "End-to-end encrypted by default, including subject lines",
          "Quantum-resistant encryption (post-quantum ready)",
          "Fully open-source and audited",
          "Free tier includes 1 GB",
          "Custom domain support on paid plans",
        ],
        cons: [
          "Smaller ecosystem than Proton",
          "No IMAP/SMTP on free plan",
        ],
        price: "Free / from €3/mo",
        url: "https://tuta.com",
        isAffiliate: true,
      },
      {
        name: "Mailbox.org",
        country: "Germany 🇩🇪",
        tagline: "Business-friendly, green-powered email",
        pros: [
          "Full IMAP/SMTP support — works with any email client",
          "Powered by 100% renewable energy",
          "Strong privacy policy, no advertising",
          "Includes calendar, contacts, office tools",
        ],
        cons: [
          "No end-to-end encryption by default (optional PGP)",
          "No free tier",
        ],
        price: "From €1/mo",
        url: "https://mailbox.org",
        isAffiliate: false,
      },
      {
        name: "Posteo",
        country: "Germany 🇩🇪",
        tagline: "€1/month, anonymous payment accepted",
        pros: [
          "Accepts anonymous payment (cash, bank transfer)",
          "Green energy, sustainability-focused",
          "No advertising, no tracking",
          "Full IMAP/SMTP",
        ],
        cons: [
          "No custom domains",
          "No end-to-end encryption by default",
        ],
        price: "€1/mo",
        url: "https://posteo.de",
        isAffiliate: false,
      },
    ],
    verdict:
      "For most users, Proton Mail is the best starting point — it has the strongest encryption, a free tier, and a full privacy ecosystem. If you want fully open-source with cutting-edge encryption, Tuta is an excellent alternative. For business use with standard email clients, Mailbox.org is the pragmatic choice.",
    faq: [
      {
        q: "Can I keep my Gmail address when switching?",
        a: "Yes. You can set up email forwarding from Gmail to your new address, giving you time to update accounts gradually.",
      },
      {
        q: "Is Proton Mail really private?",
        a: "Proton Mail uses end-to-end encryption, meaning even Proton cannot read your emails. It is based in Switzerland and has been independently audited.",
      },
      {
        q: "Which is better: Proton Mail or Tuta?",
        a: "Both are excellent. Proton Mail has a larger ecosystem and Swiss jurisdiction. Tuta encrypts subject lines by default and is working on post-quantum encryption. Try both free tiers.",
      },
    ],
  },

  "best-european-vpn": {
    id: "best-european-vpn",
    title: "Best European VPN Services in 2026",
    metaTitle: "Best European VPN Services in 2026 | digitaleu.me",
    metaDescription:
      "Compare the best privacy-focused European VPNs: Proton VPN, Mullvad, IVPN, and AzireVPN. No-logs, audited, GDPR-compliant.",
    category: "vpn",
    difficulty: "Easy",
    intro:
      "A VPN encrypts your internet traffic and hides your IP address. But not all VPNs are equal — many log your activity or are based in countries with weak privacy laws. European VPNs are subject to GDPR, have strong privacy traditions, and are independently audited. Here are the best.",
    whySwitch: [
      "US-based VPNs can be compelled to hand over user data under US law",
      "Many free VPNs sell your browsing data to advertisers",
      "European VPNs are covered by GDPR data minimisation requirements",
      "Independent audits verify no-logs claims",
    ],
    services: [
      {
        name: "Proton VPN",
        country: "Switzerland 🇨🇭",
        tagline: "The only free VPN with no data limits",
        pros: [
          "Genuinely free plan — no data cap, no logs",
          "Swiss jurisdiction — strong privacy law",
          "Independently audited, open-source apps",
          "Stealth protocol to bypass VPN blocks",
          "Netshield ad/malware blocker built in",
        ],
        cons: [
          "Free plan limited to 3 server locations",
          "Speeds lower on free tier",
        ],
        price: "Free / from €4.99/mo",
        url: "https://protonvpn.com",
        isAffiliate: true,
      },
      {
        name: "Mullvad",
        country: "Sweden 🇸🇪",
        tagline: "Maximum anonymity — no account required",
        pros: [
          "No email required to sign up — account number only",
          "Accepts cash and crypto payments",
          "Flat rate: €5/month, no tricks",
          "WireGuard and OpenVPN, independently audited",
          "Built-in DAITA (defence against traffic analysis)",
        ],
        cons: [
          "No free tier",
          "No split tunneling on iOS",
        ],
        price: "€5/mo flat",
        url: "https://mullvad.net",
        isAffiliate: false,
      },
      {
        name: "IVPN",
        country: "Gibraltar 🇬🇮",
        tagline: "Transparent, minimal, privacy-first",
        pros: [
          "No account email required",
          "Independently audited annually",
          "Multi-hop (cascade) connections included",
          "Clear, honest privacy policy",
        ],
        cons: [
          "Smaller server network",
          "No free tier",
        ],
        price: "From €2/week or €6/mo",
        url: "https://ivpn.net",
        isAffiliate: false,
      },
      {
        name: "AzireVPN",
        country: "Sweden 🇸🇪",
        tagline: "Diskless servers — data cannot be seized",
        pros: [
          "All servers run in RAM only — no logs possible",
          "WireGuard-only for maximum speed",
          "Very transparent company",
        ],
        cons: [
          "Limited server locations",
          "No free tier",
        ],
        price: "From €3.25/mo",
        url: "https://azirevpn.com",
        isAffiliate: false,
      },
    ],
    verdict:
      "Proton VPN is the best starting point — it has a free tier with no data limits, Swiss jurisdiction, and full audits. If you want maximum anonymity, Mullvad is the gold standard: no email, cash payments, flat pricing. Both are excellent; the choice depends on whether you need a free option.",
    faq: [
      {
        q: "Does a VPN make me completely anonymous?",
        a: "No. A VPN hides your IP and encrypts traffic from your ISP, but your VPN provider can still see your activity (unless they have a verified no-logs policy). Use Tor for stronger anonymity.",
      },
      {
        q: "Why not just use a free VPN?",
        a: "Most free VPNs monetise by selling your browsing data. Proton VPN is the only audited free VPN with no data cap.",
      },
      {
        q: "Is Mullvad still good after the police raid in 2023?",
        a: "Yes. The raid confirmed Mullvad's no-logs policy — police left with nothing because no data existed to take. It's now considered a positive endorsement.",
      },
    ],
  },

  "best-european-cloud-storage": {
    id: "best-european-cloud-storage",
    title: "Best European Cloud Storage in 2026",
    metaTitle: "Best European Cloud Storage in 2026 — Google Drive Alternatives | digitaleu.me",
    metaDescription:
      "Compare the best privacy-friendly European cloud storage: Proton Drive, pCloud, Tresorit, and Nextcloud. End-to-end encrypted, GDPR-compliant.",
    category: "cloud-storage",
    difficulty: "Easy",
    intro:
      "Google Drive, Dropbox, and OneDrive all store your files in cleartext — meaning the provider can read your files, and US authorities can request access. European cloud storage alternatives offer end-to-end encryption, meaning only you hold the keys. Here are the best options.",
    whySwitch: [
      "Google Drive scans your files and can share them with US authorities",
      "Dropbox and OneDrive are US companies subject to FISA 702 surveillance",
      "End-to-end encrypted storage means even the provider cannot read your files",
      "GDPR gives European providers much stronger data protection obligations",
    ],
    services: [
      {
        name: "Proton Drive",
        country: "Switzerland 🇨🇭",
        tagline: "Zero-knowledge cloud storage from the makers of Proton Mail",
        pros: [
          "End-to-end encrypted — Proton cannot see your files",
          "Free tier with 1 GB (5 GB with referrals)",
          "Integrates with Proton Mail, Calendar, and VPN",
          "Swiss jurisdiction — strongest privacy laws",
          "Open-source clients, independently audited",
        ],
        cons: [
          "Desktop client is newer, still maturing",
          "No collaborative document editing yet",
        ],
        price: "Free / from €3.99/mo",
        url: "https://proton.me/drive",
        isAffiliate: true,
      },
      {
        name: "pCloud",
        country: "Switzerland 🇨🇭",
        tagline: "Lifetime plans and a polished desktop experience",
        pros: [
          "Lifetime plans available — one-time payment",
          "Very fast upload/download speeds",
          "Good desktop and mobile apps",
          "10 GB free storage",
          "Client-side encryption (pCloud Encryption add-on)",
        ],
        cons: [
          "End-to-end encryption is an optional paid add-on",
          "Base plan does not encrypt server-side by default",
        ],
        price: "Free 10 GB / from €4.99/mo or lifetime from €199",
        url: "https://www.pcloud.com",
        isAffiliate: true,
      },
      {
        name: "Tresorit",
        country: "Switzerland / Hungary 🇨🇭🇭🇺",
        tagline: "Zero-knowledge, business-grade security",
        pros: [
          "Zero-knowledge encryption by default",
          "Strong business and team features",
          "Independently audited",
          "Compliance-ready (HIPAA, GDPR, ISO 27001)",
        ],
        cons: [
          "Premium pricing — aimed at business",
          "No meaningful free tier",
        ],
        price: "From €10/mo",
        url: "https://tresorit.com",
        isAffiliate: false,
      },
      {
        name: "Nextcloud",
        country: "Germany 🇩🇪",
        tagline: "Self-hosted or managed — full control",
        pros: [
          "Fully open-source",
          "Self-hostable — you own the server",
          "Managed hosting available from European providers",
          "Extensive plugin ecosystem (docs, calendar, video)",
        ],
        cons: [
          "Requires technical setup for self-hosting",
          "Encryption requires configuration",
        ],
        price: "Free (self-hosted) / managed from ~€4/mo",
        url: "https://nextcloud.com",
        isAffiliate: false,
      },
    ],
    verdict:
      "For individuals already using Proton services, Proton Drive is the natural choice — zero-knowledge encryption and the same Swiss privacy protection. If you want a great free tier with fast apps and lifetime pricing, pCloud is the pragmatic pick. For teams and business use, Tresorit sets the standard. Tech-savvy users wanting full control should look at Nextcloud.",
    faq: [
      {
        q: "Is end-to-end encrypted storage slower?",
        a: "Slightly — encryption adds a small overhead. In practice, Proton Drive and pCloud have fast enough speeds for everyday use.",
      },
      {
        q: "Can I collaborate on documents in Proton Drive?",
        a: "Proton Drive supports basic sharing. For full collaborative editing, look at Nextcloud with its built-in office integration.",
      },
      {
        q: "What is the difference between server-side and end-to-end encryption?",
        a: "Server-side encryption protects your data from third parties but the storage provider still holds the key. End-to-end (zero-knowledge) encryption means only you hold the key — the provider cannot read your files even if compelled.",
      },
    ],
  },

  "browser-wars": {
    id: "browser-wars",
    title: "Uncensored Web: Browser Privacy Compared in 2026",
    metaTitle: "Best Private Browsers in 2026 — Chrome Alternatives | digitaleu.me",
    metaDescription:
      "Compare Brave, Mullvad Browser, Firefox, LibreWolf, and Vivaldi for privacy, fingerprinting resistance, and European sovereignty. Which browser should you use?",
    category: "browser",
    difficulty: "Easy",
    intro:
      "Google Chrome has over 60% market share — and sends detailed telemetry back to Google. Your browser sees everything: every URL, every search, every form you fill. Choosing a privacy-respecting browser is one of the highest-impact changes you can make. Here is how the best alternatives compare.",
    whySwitch: [
      "Chrome reports browsing activity to Google for advertising profiling",
      "Chrome extensions can be silently updated to harvest data",
      "Browser fingerprinting lets sites identify you without cookies",
      "A privacy browser reduces tracking across the entire web — not just one site",
    ],
    services: [
      {
        name: "Brave",
        country: "USA 🇺🇸",
        tagline: "Chrome-compatible, built-in ad blocking, crypto optional",
        pros: [
          "Drops Google from Chromium — no Google telemetry",
          "Built-in ad and tracker blocker (no extension needed)",
          "Chrome extensions work natively",
          "Fast — blocks ads before loading",
          "Brave Search as default (independent index)",
        ],
        cons: [
          "US company — subject to US law",
          "Crypto/BAT features add noise if you don't want them",
          "Chromium base means Google still benefits from web platform dominance",
        ],
        price: "Free",
        url: "https://brave.com",
        isAffiliate: false,
      },
      {
        name: "Mullvad Browser",
        country: "Sweden 🇸🇪",
        tagline: "Tor Browser hardening without Tor — maximum fingerprint resistance",
        pros: [
          "Developed with Tor Project — maximum fingerprint protection",
          "All users look identical — herd privacy model",
          "No telemetry, no accounts, no sync",
          "Built-in uBlock Origin",
          "Swedish company with strong privacy track record",
        ],
        cons: [
          "Not designed for daily convenience — strict settings break some sites",
          "No extensions recommended (breaks fingerprint uniformity)",
          "No built-in sync across devices",
        ],
        price: "Free",
        url: "https://mullvad.net/browser",
        isAffiliate: false,
      },
      {
        name: "Firefox",
        country: "USA 🇺🇸",
        tagline: "The independent open-source baseline — configure it right",
        pros: [
          "Fully open-source, not based on Chromium",
          "Highly customisable with strong extensions",
          "Mozilla is a non-profit — mission-driven, not ad-driven",
          "Excellent uBlock Origin support",
          "European-friendly: Firefox is the dominant non-Google engine",
        ],
        cons: [
          "Requires hardening out of the box (telemetry on by default)",
          "Mozilla receives significant Google funding (search deal)",
          "More setup effort for maximum privacy",
        ],
        price: "Free",
        url: "https://firefox.com",
        isAffiliate: false,
      },
      {
        name: "LibreWolf",
        country: "Europe 🇪🇺",
        tagline: "Firefox, pre-hardened — privacy by default",
        pros: [
          "Firefox fork with all privacy settings configured out of the box",
          "No Mozilla telemetry, no Google as default search",
          "uBlock Origin included",
          "European community project",
          "No setup required — private from install",
        ],
        cons: [
          "Manual updates (no auto-update in some builds)",
          "Strict settings may break some sites initially",
          "Smaller community than Firefox",
        ],
        price: "Free",
        url: "https://librewolf.net",
        isAffiliate: false,
      },
    ],
    verdict:
      "For most users switching from Chrome, Brave is the easiest transition — familiar interface, instant ad blocking, no setup. For maximum fingerprint resistance, Mullvad Browser is the most technically advanced option. Firefox with uBlock Origin is the best choice if you want a non-Chromium browser with strong extension support. LibreWolf is the best option for those who want Firefox's power without the configuration work.",
    faq: [
      {
        q: "What is browser fingerprinting and why does it matter?",
        a: "Fingerprinting identifies you based on your browser's unique combination of fonts, screen size, plugins, and settings — without cookies. Mullvad Browser defeats this by making all users look identical.",
      },
      {
        q: "Should I use a European browser?",
        a: "Mullvad Browser (Sweden) and LibreWolf (European community) are the strongest European options. Firefox and Brave, despite US origins, offer strong privacy through open-source transparency and independent audits.",
      },
      {
        q: "Is Brave really private despite being US-based?",
        a: "Brave's privacy protections are technically strong and auditable. The main risk is US legal jurisdiction over the company. For threat models involving nation-state surveillance, Mullvad Browser or LibreWolf with Mullvad VPN is more robust.",
      },
    ],
  },

  "password-manager-migration": {
    id: "password-manager-migration",
    title: "Dump LastPass: Migrate to a Secure Password Manager in 2026",
    metaTitle: "Best European Password Managers in 2026 — LastPass Alternatives | digitaleu.me",
    metaDescription:
      "LastPass suffered multiple major breaches. Compare Proton Pass, Bitwarden, and KeePassXC — and follow our step-by-step export guide to migrate safely.",
    category: "password",
    difficulty: "Easy",
    intro:
      "In 2022 and 2023, LastPass suffered catastrophic security breaches — attackers stole encrypted vaults, and weaker master passwords are still being cracked today. If you are still using LastPass, your passwords may already be compromised. Here is how to migrate to a modern, trustworthy password manager.",
    whySwitch: [
      "LastPass vaults were stolen in 2022 — cracking attempts are ongoing",
      "LastPass has a history of poor security practices and delayed disclosure",
      "Modern alternatives use stronger encryption and zero-knowledge architecture",
      "European-hosted options keep your vault under GDPR jurisdiction",
    ],
    services: [
      {
        name: "Proton Pass",
        country: "Switzerland 🇨🇭",
        tagline: "Zero-knowledge, integrated with the Proton privacy ecosystem",
        pros: [
          "End-to-end encrypted — Proton cannot read your vault",
          "Swiss jurisdiction — strongest privacy laws in the world",
          "Free tier available",
          "Integrates with Proton Mail, VPN, and Drive",
          "Open-source, independently audited",
          "Encrypted aliases included",
        ],
        cons: [
          "Newer product — fewer third-party integrations",
          "Browser extension UI less polished than 1Password",
        ],
        price: "Free / from €1.99/mo",
        url: "https://proton.me/pass",
        isAffiliate: true,
      },
      {
        name: "Bitwarden",
        country: "USA 🇺🇸",
        tagline: "Open-source, self-hostable, generous free tier",
        pros: [
          "Fully open-source and independently audited",
          "Self-hostable — host your own vault in Europe",
          "Generous free tier with sync across unlimited devices",
          "Browser extensions and apps for all platforms",
          "Strong business/team features",
        ],
        cons: [
          "Cloud-hosted version is US-based (Bitwarden, Inc.)",
          "Self-hosting requires technical setup",
          "UI is functional but not the most polished",
        ],
        price: "Free / from €10/yr",
        url: "https://bitwarden.com",
        isAffiliate: false,
      },
      {
        name: "KeePassXC",
        country: "Europe 🇪🇺",
        tagline: "Offline, local-first — zero cloud dependency",
        pros: [
          "Fully offline — vault never touches any server",
          "Open-source, European community project",
          "Free forever",
          "Strong security record",
          "Sync via your own cloud (Proton Drive, Nextcloud)",
        ],
        cons: [
          "No native cloud sync — requires manual setup",
          "Mobile apps (KeePassDX) are separate projects",
          "More setup effort than cloud-based options",
        ],
        price: "Free",
        url: "https://keepassxc.org",
        isAffiliate: false,
      },
      {
        name: "1Password",
        country: "Canada 🇨🇦",
        tagline: "Premium UX, strong security, popular in teams",
        pros: [
          "Best-in-class interface and browser integration",
          "Travel Mode (hide vaults at borders)",
          "Strong business and family plans",
          "Independently audited",
        ],
        cons: [
          "No free tier",
          "Canadian company — outside EU jurisdiction",
          "Closed source (though protocols are published)",
        ],
        price: "From €2.99/mo",
        url: "https://1password.com",
        isAffiliate: false,
      },
    ],
    verdict:
      "Proton Pass is the best choice for users already in the Proton ecosystem — Swiss jurisdiction, zero-knowledge, and free tier make it the natural upgrade from LastPass. Bitwarden is the best open-source option with cloud sync. For users who want absolute local control, KeePassXC is the gold standard. All three are vastly more secure than LastPass.",
    faq: [
      {
        q: "How do I export from LastPass?",
        a: "Log in to LastPass → Advanced Options → Export → LastPass CSV file. Save it securely. Import into your new manager, then delete the CSV file immediately.",
      },
      {
        q: "Is my LastPass vault already compromised?",
        a: "If you had a weak master password (under 12 characters, dictionary word, or reused), assume yes. Change your most critical passwords immediately. A strong, unique master password gives more time.",
      },
      {
        q: "Why is Proton Pass better than LastPass if both are cloud-based?",
        a: "Proton Pass uses end-to-end encryption — Proton cannot read your vault even if breached. LastPass stored some data client-side but had architectural weaknesses that allowed attackers to steal vault data in a usable form.",
      },
    ],
  },

  "degoogle-checklist": {
    id: "degoogle-checklist",
    title: "The Step-by-Step De-Google Checklist for 2026",
    metaTitle: "How to De-Google Your Life in 2026 — Step-by-Step Guide | digitaleu.me",
    metaDescription:
      "A methodical, stress-free checklist for migrating your email, files, photos, calendar, and search away from Google. Replace every Google service with a private European alternative.",
    category: "privacy",
    difficulty: "Medium",
    intro:
      "Leaving Google entirely can feel overwhelming — you use Gmail, Drive, Photos, Maps, Chrome, and Search every day. But you do not have to do it all at once. This checklist gives you a methodical, low-stress sequence: start with email (the most important), then work outward. Each step takes under an hour.",
    whySwitch: [
      "Google builds a detailed advertising profile from your email, searches, location, and files",
      "US law (FISA 702) allows intelligence agencies to access Google's data without your knowledge",
      "Breaking Google dependency reduces your exposure to any single provider's breach or policy change",
      "European alternatives offer the same functionality — often with better privacy and GDPR protection",
    ],
    services: [
      {
        name: "Proton Mail",
        country: "Switzerland 🇨🇭",
        tagline: "Step 1: Replace Gmail — the highest-impact change you can make",
        pros: [
          "End-to-end encrypted — Google cannot read your email",
          "Free tier to get started",
          "Swiss jurisdiction — outside US surveillance treaties",
          "Integrated with Proton Drive, Calendar, VPN, and Pass",
          "Import tool for migrating Gmail easily",
        ],
        cons: [
          "Free plan limited to 1 GB",
          "Migration takes time if you have years of Gmail history",
        ],
        price: "Free / from €3.99/mo",
        url: "https://proton.me/mail",
        isAffiliate: true,
      },
      {
        name: "Proton Drive",
        country: "Switzerland 🇨🇭",
        tagline: "Step 2: Replace Google Drive and Google Photos",
        pros: [
          "Zero-knowledge encryption — Proton cannot see your files",
          "Free tier with 1 GB (more with Proton plans)",
          "Apps for desktop and mobile",
          "Integrates with Proton ecosystem",
        ],
        cons: [
          "No real-time collaborative editing (no Docs equivalent yet)",
          "Desktop client newer than competitors",
        ],
        price: "Free / from €3.99/mo (bundled with Proton Mail)",
        url: "https://proton.me/drive",
        isAffiliate: true,
      },
      {
        name: "Brave Search",
        country: "USA 🇺🇸",
        tagline: "Step 3: Replace Google Search",
        pros: [
          "Independent index — not relying on Google or Bing",
          "No tracking, no advertising profiles",
          "Available as default in Brave Browser",
          "Goggles feature lets you customise ranking",
        ],
        cons: [
          "Results still maturing — occasionally falls back to Google for edge cases",
          "US-based company",
        ],
        price: "Free",
        url: "https://search.brave.com",
        isAffiliate: false,
      },
      {
        name: "Proton Calendar",
        country: "Switzerland 🇨🇭",
        tagline: "Step 4: Replace Google Calendar",
        pros: [
          "End-to-end encrypted calendar events",
          "Integrated with Proton Mail",
          "Free with Proton account",
          "CalDAV support for third-party clients",
        ],
        cons: [
          "Fewer integrations than Google Calendar",
          "Shared calendar features still expanding",
        ],
        price: "Free (included with Proton account)",
        url: "https://proton.me/calendar",
        isAffiliate: true,
      },
    ],
    verdict:
      "Start with email — it is the most important account you have, and everything else resets via email. Once your Proton Mail is live, enable Gmail forwarding and spend 2 weeks updating accounts. Then move Drive and Photos. Search last — it is the easiest habit to change. A full migration takes 4–6 weeks done casually, not 4–6 hours rushed.",
    faq: [
      {
        q: "Do I have to do everything at once?",
        a: "No. Start with email — it protects the most. Gmail forwarding means you will not miss messages while you update accounts. Take the rest one service per week.",
      },
      {
        q: "What about Google Maps?",
        a: "OsmAnd (Europe-based, offline maps) and Organic Maps are the best Google Maps alternatives. For transit, CityMapper covers most European cities without Google. This checklist focuses on the highest-impact services first.",
      },
      {
        q: "Will I lose access to years of Gmail history?",
        a: "No. Proton Mail's import tool can migrate your full Gmail archive. You can also keep Gmail active in read-only mode for old messages while using Proton as your active address.",
      },
      {
        q: "What about Android and Google Play?",
        a: "Android de-Googling is advanced territory — covered in a separate guide. Focus on the services in this checklist first, as they work on any device regardless of OS.",
      },
    ],
  },
};
