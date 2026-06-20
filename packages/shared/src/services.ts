/**
 * Curated database of the 45 most common consumer services, with security scores,
 * data handling practices, and EU alternatives.
 *
 * Threat Score methodology:
 *  HIGH   = confirmed data breach with user data exposed, and/or active data selling
 *  MEDIUM = no major breaches but collects/shares significant data, or confirmed metadata leak
 *  LOW    = relatively good track record, limited data collection
 *
 * Data Protection methodology:
 *  HIGH   = strong encryption, GDPR-compliant, minimal data collection
 *  MEDIUM = reasonable practices, but with room for improvement
 *  LOW    = sells user data, limited transparency, outside EU jurisdiction
 */

export type ThreatLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ServiceInfo {
  id: string;
  name: string;
  domain: string;
  /** Category for display and filtering */
  category:
    | "social"
    | "email"
    | "cloud"
    | "streaming"
    | "shopping"
    | "search"
    | "productivity"
    | "communication"
    | "finance"
    | "security"
    | "travel"
    | "tech";
  threatScore: ThreatLevel;
  dataProtection: ThreatLevel;
  /** Short facts shown in dashboard row */
  breachSummary: string;
  /** More detailed explanation for expanded view */
  details: string;
  /** Country where the company is registered */
  ownerCountry: string;
  /** Sells or shares data with third parties */
  sellsData: boolean;
  /** URL for deleting account */
  deleteUrl?: string;
  /** URL for changing email address */
  changeEmailUrl?: string;
  /** ID of EU alternative in ALTERNATIVES catalogue */
  euAlternativeId?: string;
  /** Direct affiliate link to recommended alternative */
  affiliateUrl?: string;
}

export const SERVICES: ServiceInfo[] = [
  // ─── SOCIAL ───────────────────────────────────────────────────────────────
  {
    id: "facebook",
    name: "Facebook",
    domain: "facebook.com",
    category: "social",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "533M users leaked (2021), Cambridge Analytica (2018)",
    details:
      "Facebook was exposed in the Cambridge Analytica scandal (2018), where 87 million user profiles were used for political manipulation without consent. In 2021, phone numbers and personal data of 533 million users were published on a hacker forum. Facebook is known for selling ad profiles based on detailed user behaviour.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.facebook.com/help/delete_account",
    changeEmailUrl: "https://www.facebook.com/settings?tab=account",
    euAlternativeId: "mastodon",
  },
  {
    id: "instagram",
    name: "Instagram",
    domain: "instagram.com",
    category: "social",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "Owned by Meta, shares data with Facebook",
    details:
      "Instagram is owned by Meta and shares all collected data with Facebook. In 2019, 49 million user profiles were exposed via an unsecured database. Meta was fined €405 million by the Irish DPC (2022) for violating children's privacy on Instagram.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.instagram.com/accounts/remove/request/permanent/",
    changeEmailUrl: "https://www.instagram.com/accounts/edit/",
    euAlternativeId: "pixelfed",
  },
  {
    id: "twitter-x",
    name: "X (Twitter)",
    domain: "x.com",
    category: "social",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "200M email addresses leaked (2022), weakened security culture",
    details:
      "In December 2022, email addresses of over 200 million Twitter users were published on hacker forums. After Elon Musk's acquisition in 2022, much of the security team was fired, and key GDPR compliance staff left the company. The EU has opened an investigation.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://twitter.com/settings/account/confirm_deactivation",
    changeEmailUrl: "https://twitter.com/settings/email",
    euAlternativeId: "mastodon",
  },
  {
    id: "tiktok",
    name: "TikTok",
    domain: "tiktok.com",
    category: "social",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "Chinese ownership, EU fines (2023), data transfers to China",
    details:
      "TikTok is owned by ByteDance, headquartered in China. The EU fined TikTok €345 million (2023) for violations of children's privacy. The Irish DPC confirmed that employees in China had access to European user data. TikTok bans have been imposed for staff at EU institutions and several national governments.",
    ownerCountry: "CN",
    sellsData: true,
    deleteUrl: "https://www.tiktok.com/setting/delete-account",
    changeEmailUrl: "https://www.tiktok.com/setting/",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    domain: "snapchat.com",
    category: "social",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "4.6M users exposed (2014), insider data abuse",
    details:
      "In 2014, 4.6 million user phone numbers and usernames were published publicly. Snaplion was a third-party app that stored images that were supposed to disappear. In 2019, it was revealed that Snap employees misused an internal tool (SnapLion) to spy on users.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://accounts.snapchat.com/accounts/delete_account",
    changeEmailUrl: "https://accounts.snapchat.com/accounts/settings",
  },
  {
    id: "reddit",
    name: "Reddit",
    domain: "reddit.com",
    category: "social",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "2018 database compromise, API data sold to AI companies",
    details:
      "In 2018, Reddit was hacked via SMS-based 2FA. Reddit now sells API access to AI companies (Google, OpenAI) for user content, which many users protested. Users have thus contributed to training commercial AI models without consent.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.reddit.com/settings/",
    changeEmailUrl: "https://www.reddit.com/settings/",
    euAlternativeId: "lemmy",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    domain: "pinterest.com",
    category: "social",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches – but user data analysed for ads",
    details:
      "Pinterest has not had major public data breaches, but collects detailed information about interests and behaviour for advertising purposes. They are subject to US jurisdiction and share data with advertising partners.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.pinterest.com/settings/",
    changeEmailUrl: "https://www.pinterest.com/settings/",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    domain: "linkedin.com",
    category: "social",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "700M users scraped (2021), 117M passwords leaked (2012/2016)",
    details:
      "In 2012, 6.5 million hashed passwords were leaked — in 2016 it became clear it was actually 117 million. In 2021, data from 700 million LinkedIn profiles was scraped and sold. LinkedIn, owned by Microsoft, uses profile data for advertising purposes.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.linkedin.com/psettings/account",
    changeEmailUrl: "https://www.linkedin.com/psettings/email",
  },
  {
    id: "youtube",
    name: "YouTube",
    domain: "youtube.com",
    category: "social",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Owned by Google, massive behavioural profiling",
    details:
      "YouTube is owned by Google and builds detailed behavioural profiles based on viewing history. Google was fined $170 million (2019) by the FTC for illegally collecting children's data on YouTube. All viewing history is shared with Google Ads.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://myaccount.google.com/deleteaccount",
    changeEmailUrl: "https://myaccount.google.com/email",
    euAlternativeId: "peertube",
  },

  // ─── EMAIL ────────────────────────────────────────────────────────────────
  {
    id: "gmail",
    name: "Gmail",
    domain: "gmail.com",
    category: "email",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Content scanning for ad profiles, Google data ecosystem",
    details:
      "Google scanned Gmail content for advertising purposes until 2017. Although direct scanning stopped, Google uses metadata and links Gmail activity to ad profiles. All data is subject to US jurisdiction and the CLOUD Act, which gives US authorities access.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://myaccount.google.com/deleteaccount",
    changeEmailUrl: "https://myaccount.google.com/email",
    euAlternativeId: "proton-mail",
    affiliateUrl:
      "https://go.getproton.me/SH2jh?redirect_url=https%3A%2F%2Fget.proton.me%2Fl%2Fmail-plans-aff-intro-offer",
  },
  {
    id: "outlook",
    name: "Outlook / Hotmail",
    domain: "outlook.com",
    category: "email",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Microsoft data sharing, CLOUD Act exposure",
    details:
      "Microsoft Exchange and Outlook were compromised by Hafnium (2021) and Storm-0558 (2023), the latter affecting government email accounts. Microsoft is subject to the CLOUD Act and can hand over data to US authorities without a European court order.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://account.live.com/closeAccount.aspx",
    changeEmailUrl: "https://account.live.com/names/Manage",
    euAlternativeId: "tuta",
  },
  {
    id: "yahoo-mail",
    name: "Yahoo Mail",
    domain: "yahoo.com",
    category: "email",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "3 BILLION accounts leaked (2013–2016)",
    details:
      "Yahoo had the largest data breach in history: 3 billion accounts compromised between 2013 and 2016. In 2016, Yahoo was also compelled by the NSA to mass-surveil user emails. The company was acquired by Verizon and is now part of Apollo Global.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://login.yahoo.com/account/delete-account",
    changeEmailUrl: "https://edit.yahoo.com/config/eval_profile",
    euAlternativeId: "proton-mail",
    affiliateUrl:
      "https://go.getproton.me/SH2jh?redirect_url=https%3A%2F%2Fget.proton.me%2Fl%2Fmail-plans-aff-intro-offer",
  },

  // ─── CLOUD STORAGE ────────────────────────────────────────────────────────
  {
    id: "google-drive",
    name: "Google Drive",
    domain: "drive.google.com",
    category: "cloud",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Google can read files, US jurisdiction",
    details:
      "Google Drive files are encrypted, but Google holds the keys and can read the content. Google has handed over user data to US authorities via the CLOUD Act. Drive is linked to Google Workspace profiling.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://myaccount.google.com/deleteaccount",
    changeEmailUrl: "https://myaccount.google.com/email",
    euAlternativeId: "proton-drive",
    affiliateUrl:
      "https://go.getproton.me/SH1mO?redirect_url=https%3A%2F%2Fget.proton.me%2Fl%2Fprivate-cloud-storage-aff-intro-offer",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    domain: "dropbox.com",
    category: "cloud",
    threatScore: "HIGH",
    dataProtection: "MEDIUM",
    breachSummary: "68M passwords leaked (2012), disclosed in 2016",
    details:
      "In 2012, 68 million Dropbox accounts were compromised, but it was not publicly disclosed until 2016. Dropbox received criticism for offering Condoleezza Rice (board member with NSA ties) a seat on its board. Files are encrypted, but Dropbox holds the keys.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://www.dropbox.com/account/delete_account_email",
    changeEmailUrl: "https://www.dropbox.com/account/personal#email",
    euAlternativeId: "proton-drive",
    affiliateUrl:
      "https://go.getproton.me/SH1mO?redirect_url=https%3A%2F%2Fget.proton.me%2Fl%2Fprivate-cloud-storage-aff-intro-offer",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    domain: "onedrive.com",
    category: "cloud",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Microsoft Storm-0558 (2023), CLOUD Act",
    details:
      "Microsoft was hit by the Storm-0558 attack (2023) where Chinese hackers gained access to emails and cloud documents at government customers. OneDrive is subject to the CLOUD Act.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://account.microsoft.com/account/",
    changeEmailUrl: "https://account.live.com/names/Manage",
    euAlternativeId: "proton-drive",
    affiliateUrl:
      "https://go.getproton.me/SH1mO?redirect_url=https%3A%2F%2Fget.proton.me%2Fl%2Fprivate-cloud-storage-aff-intro-offer",
  },
  {
    id: "icloud",
    name: "iCloud",
    domain: "icloud.com",
    category: "cloud",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "The Fappening (2014), Apple/China server compromise",
    details:
      "In 2014, celebrity photos were leaked from iCloud via phishing and brute force (The Fappening). Apple stores Chinese user data on servers in China owned by state-controlled GCBD, giving Chinese authorities access. Apple is subject to the US CLOUD Act for other regions.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://appleid.apple.com/account/manage",
    changeEmailUrl: "https://appleid.apple.com/account/manage",
    euAlternativeId: "proton-drive",
    affiliateUrl:
      "https://go.getproton.me/SH1mO?redirect_url=https%3A%2F%2Fget.proton.me%2Fl%2Fprivate-cloud-storage-aff-intro-offer",
  },

  // ─── STREAMING ────────────────────────────────────────────────────────────
  {
    id: "netflix",
    name: "Netflix",
    domain: "netflix.com",
    category: "streaming",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches – but detailed behavioural profiling",
    details:
      "Netflix has not had major data breaches, but builds extremely detailed behavioural profiles: what you watch, when you pause, what you skip. These are used for content recommendations and partially shared with advertising partners (ad tier).",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://www.netflix.com/cancelplan",
    changeEmailUrl: "https://www.netflix.com/youraccount",
  },
  {
    id: "spotify",
    name: "Spotify",
    domain: "spotify.com",
    category: "streaming",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches – but voice and audio data collected",
    details:
      "Spotify collects your voice recordings (via microphone access) and places you in advertising profiles. They share data with Facebook if you have linked the accounts. However, Spotify is a Swedish company subject to EU/GDPR.",
    ownerCountry: "SE",
    sellsData: true,
    deleteUrl: "https://support.spotify.com/article/close-account/",
    changeEmailUrl: "https://www.spotify.com/account/overview/",
  },
  {
    id: "disney-plus",
    name: "Disney+",
    domain: "disneyplus.com",
    category: "streaming",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Thousands of accounts sold after compromise (2019)",
    details:
      "Hours after Disney+ launched in 2019, thousands of accounts were hacked and sold on the dark web. Disney shared user data with advertising partners without adequate consent, resulting in a lawsuit in California.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.disneyplus.com/account",
    changeEmailUrl: "https://www.disneyplus.com/account",
  },

  // ─── SHOPPING ─────────────────────────────────────────────────────────────
  {
    id: "amazon",
    name: "Amazon",
    domain: "amazon.com",
    category: "shopping",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Internal data leak (2018), Alexa eavesdropping, AWS breaches",
    details:
      "In 2018, an Amazon employee leaked customer data to third-party vendors. Alexa voice recordings have been listened to by human employees without users' knowledge. AWS has been involved in several high-profile data breaches at customer organisations.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.amazon.com/gp/help/customer/display.html?nodeId=GDK92DNLSGWTV6MP",
    changeEmailUrl: "https://www.amazon.com/gp/customer-media/upload.html",
  },
  {
    id: "hotels-com",
    name: "Hotels.com",
    domain: "hotels.com",
    category: "travel",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "Expedia Group breach, Marriott breach (500M guests)",
    details:
      "Hotels.com is owned by Expedia Group. The Marriott breach (2018) exposed 500 million guest records including passport information — one of the largest in history. Hotels.com shares booking data with advertising networks. The Expedia Group has received a GDPR fine.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.hotels.com/account/",
    changeEmailUrl: "https://www.hotels.com/account/",
    euAlternativeId: "booking",
  },
  {
    id: "booking-com",
    name: "Booking.com",
    domain: "booking.com",
    category: "travel",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Phishing campaign targeted hotels (2024)",
    details:
      "In 2024, many Booking.com hotels were targeted by phishing that gave hackers access to hotel systems and customer communications. Booking is owned by Dutch Booking Holdings but shares data with advertising partners globally.",
    ownerCountry: "NL",
    sellsData: true,
    deleteUrl: "https://account.booking.com/mysettings/",
    changeEmailUrl: "https://account.booking.com/mysettings/",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    domain: "airbnb.com",
    category: "travel",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches – but biometric ID collection",
    details:
      "Airbnb in many cases requires biometric ID verification. They collect and store identity documents. Airbnb shares data with hosts and advertising partners. No major data breaches documented, but ID storage is a privacy concern.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://www.airbnb.com/help/article/186",
    changeEmailUrl: "https://www.airbnb.com/account-settings",
  },
  {
    id: "ebay",
    name: "eBay",
    domain: "ebay.com",
    category: "shopping",
    threatScore: "HIGH",
    dataProtection: "MEDIUM",
    breachSummary: "145M users exposed (2014)",
    details:
      "In 2014, eBay was hacked and data from 145 million users was exposed, including encrypted passwords, names, addresses and dates of birth. eBay waited two months before notifying users. They are now part of a larger data-sharing network.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.ebay.com/help/account/articles/closing-account",
    changeEmailUrl: "https://accountsettings.ebay.com/",
  },

  // ─── SEARCH ───────────────────────────────────────────────────────────────
  {
    id: "google-search",
    name: "Google Search",
    domain: "google.com",
    category: "search",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Massive search profiling, EU fine €8.25bn",
    details:
      "Google was fined €8.25 billion by the EU (2017–2019) for abuse of its dominant market position via search. Google builds detailed profiles based on search history, linked to your ad profile across all Google services.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://myaccount.google.com/deleteaccount",
    changeEmailUrl: "https://myaccount.google.com/email",
    euAlternativeId: "ecosia",
  },
  {
    id: "bing",
    name: "Bing",
    domain: "bing.com",
    category: "search",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Microsoft data sharing, CLOUD Act exposure",
    details:
      "Bing is Microsoft's search engine. In 2023, Microsoft was found to have exposed 38 terabytes of internal data through a misconfiguration. Search data is used for Microsoft Advertising.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://account.microsoft.com/account/",
    changeEmailUrl: "https://account.microsoft.com/account/",
    euAlternativeId: "qwant",
  },

  // ─── PRODUCTIVITY ─────────────────────────────────────────────────────────
  {
    id: "google-docs",
    name: "Google Docs / Workspace",
    domain: "docs.google.com",
    category: "productivity",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Google can read documents, US jurisdiction",
    details:
      "Google Workspace documents are not end-to-end encrypted. Google can read the content and has done so at the request of US authorities. Business data is subject to the CLOUD Act.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://myaccount.google.com/deleteaccount",
    changeEmailUrl: "https://myaccount.google.com/email",
    euAlternativeId: "nextcloud",
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    domain: "microsoft.com",
    category: "productivity",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Storm-0558 (2023), government data exposed",
    details:
      "Storm-0558 (Chinese hackers) gained access in 2023 to emails at US government agencies via Microsoft. Microsoft 365 uses metadata to improve AI services. Subject to the CLOUD Act.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://account.microsoft.com/account/",
    changeEmailUrl: "https://account.live.com/names/Manage",
    euAlternativeId: "nextcloud",
  },

  // ─── COMMUNICATION ────────────────────────────────────────────────────────
  {
    id: "whatsapp",
    name: "WhatsApp",
    domain: "whatsapp.com",
    category: "communication",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "500M users exposed (2022), Meta data sharing",
    details:
      "In 2022, metadata from 500 million WhatsApp users was put up for sale. Messages are end-to-end encrypted, but metadata (who you talk to, how often, your location) is shared with Meta/Facebook for advertising purposes. WhatsApp in the EU received a €225 million GDPR fine (2021).",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://faq.whatsapp.com/general/account-and-profile/how-to-delete-your-account/",
    changeEmailUrl: "https://faq.whatsapp.com/",
    euAlternativeId: "signal",
  },
  {
    id: "discord",
    name: "Discord",
    domain: "discord.com",
    category: "communication",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Spoonbot breach (2023), content moderator exposure",
    details:
      "A Discord bot platform (Spoonbot) was hacked in 2023, exposing 760 million messages. Discord stores all messages on its servers (not E2E encrypted), and employees have access to message content for moderation.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://support.discord.com/hc/en-us/articles/212500837",
    changeEmailUrl: "https://discord.com/settings/account",
    euAlternativeId: "matrix",
  },
  {
    id: "zoom",
    name: "Zoom",
    domain: "zoom.us",
    category: "communication",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "500K accounts sold (2020), Zoomboming period",
    details:
      "In 2020, 500,000 Zoom accounts were sold on the dark web. Zoom was criticised for routing European calls through Chinese servers. Zoom was also fined by the FTC (2020) for lying about end-to-end encryption.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://support.zoom.us/hc/en-us/articles/201363243",
    changeEmailUrl: "https://zoom.us/profile",
    euAlternativeId: "jitsi",
  },
  {
    id: "slack",
    name: "Slack",
    domain: "slack.com",
    category: "communication",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Breach with password leak (2015), Salesforce ownership",
    details:
      "In 2015, Slack was hacked and user profile data including hashed passwords was exposed. Slack is used by Salesforce for AI training. Employer messages are accessible to administrators, and Slack employees can access content when needed.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://slack.com/help/articles/203953148",
    changeEmailUrl: "https://slack.com/help/articles/207262907",
    euAlternativeId: "element",
  },
  {
    id: "telegram",
    name: "Telegram",
    domain: "telegram.org",
    category: "communication",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Not E2E encrypted by default, Pavel Durov arrested (2024)",
    details:
      "Telegram's regular chats are NOT end-to-end encrypted — only Secret Chats are. Pavel Durov was arrested in France (2024) for failing to cooperate with authorities on content control. Telegram subsequently shared user data with authorities.",
    ownerCountry: "AE",
    sellsData: false,
    deleteUrl: "https://my.telegram.org/",
    changeEmailUrl: "https://my.telegram.org/",
    euAlternativeId: "signal",
  },

  // ─── PASSWORD MANAGERS ────────────────────────────────────────────────────
  {
    id: "lastpass",
    name: "LastPass",
    domain: "lastpass.com",
    category: "security",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "Entire vault database stolen (2022) – passwords at risk",
    details:
      "In August and December 2022, LastPass was hacked. Attackers stole encrypted vault data for all users. With weak master passwords, all stored passwords can be decrypted. Millions of users are advised to change all their passwords immediately. LastPass initially lied about the extent of the breach.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://lastpass.com/my.php",
    changeEmailUrl: "https://lastpass.com/my.php",
    euAlternativeId: "proton-pass",
    affiliateUrl:
      "https://go.getproton.me/SH1mP?redirect_url=https%3A%2F%2Fproton.me%2Fl%2Fpass%2Fshorter-flow-pricing",
  },
  {
    id: "1password",
    name: "1Password",
    domain: "1password.com",
    category: "security",
    threatScore: "LOW",
    dataProtection: "HIGH",
    breachSummary: "Okta breach affected internal IT (2023) – no user vaults",
    details:
      "1Password had an incident in 2023 related to the Okta breach where an attacker gained access to IT systems, but no user vaults were compromised. 1Password uses zero-knowledge encryption where they cannot read your passwords.",
    ownerCountry: "CA",
    sellsData: false,
    deleteUrl: "https://support.1password.com/delete-account/",
    changeEmailUrl: "https://my.1password.com/profile",
    euAlternativeId: "proton-pass",
    affiliateUrl:
      "https://go.getproton.me/SH1mP?redirect_url=https%3A%2F%2Fproton.me%2Fl%2Fpass%2Fshorter-flow-pricing",
  },

  // ─── FINANCE ──────────────────────────────────────────────────────────────
  {
    id: "paypal",
    name: "PayPal",
    domain: "paypal.com",
    category: "finance",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "35K accounts credential-stuffed (2023)",
    details:
      "In 2023, 35,000 PayPal accounts were compromised via credential stuffing (reuse of passwords from other leaks). PayPal shares transaction information with advertising partners and has been criticised for broad data-sharing clauses.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.paypal.com/myaccount/closeAccount/",
    changeEmailUrl: "https://www.paypal.com/myaccount/settings/",
  },

  // ─── TECH / DEV ───────────────────────────────────────────────────────────
  {
    id: "github",
    name: "GitHub",
    domain: "github.com",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "Owned by Microsoft, Copilot trains on code without consent",
    details:
      "GitHub is owned by Microsoft. GitHub Copilot was trained on public code without explicit consent from developers, resulting in a lawsuit. Microsoft/GitHub is subject to the CLOUD Act.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://github.com/settings/admin",
    changeEmailUrl: "https://github.com/settings/emails",
    euAlternativeId: "codeberg",
  },
  {
    id: "adobe",
    name: "Adobe (CC/Acrobat)",
    domain: "adobe.com",
    category: "tech",
    threatScore: "HIGH",
    dataProtection: "MEDIUM",
    breachSummary: "153M accounts leaked (2013), AI training controversy (2024)",
    details:
      "In 2013, 153 million Adobe accounts were compromised including encrypted passwords and payment information. In 2024, Adobe updated its terms of service to give itself the right to use user content for AI training, which caused significant backlash and contract cancellations.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://account.adobe.com/",
    changeEmailUrl: "https://account.adobe.com/",
  },
  {
    id: "twitch",
    name: "Twitch",
    domain: "twitch.tv",
    category: "streaming",
    threatScore: "HIGH",
    dataProtection: "MEDIUM",
    breachSummary: "Entire platform source code leaked (2021), Amazon ownership",
    details:
      "In 2021, Twitch was hacked and the entire source code, streamer payout data and internal tools were published. Twitch is owned by Amazon. Amazon uses data across its services for advertising purposes.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://www.twitch.tv/settings/profile",
    changeEmailUrl: "https://www.twitch.tv/settings/profile",
  },

  // ─── VPN ──────────────────────────────────────────────────────────────────
  {
    id: "nordvpn",
    name: "NordVPN",
    domain: "nordvpn.com",
    category: "security",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "One server hacked (2018), disclosed in 2019",
    details:
      "One of NordVPN's servers in Finland was compromised in 2018 via an unsecured remote management system. NordVPN did not publicly disclose this until 2019. NordVPN is registered in Panama but operated from Lithuania.",
    ownerCountry: "PA",
    sellsData: false,
    deleteUrl: "https://my.nordaccount.com/dashboard/",
    changeEmailUrl: "https://my.nordaccount.com/dashboard/",
    euAlternativeId: "proton-vpn",
    affiliateUrl:
      "https://go.getproton.me/SH1mQ?redirect_url=https%3A%2F%2Fget.protonvpn.com%2Fl%2Fspecial-partner-offer-summerdeal",
  },
  {
    id: "expressvpn",
    name: "ExpressVPN",
    domain: "expressvpn.com",
    category: "security",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "Acquired by Kape (Israeli surveillance experts, 2021)",
    details:
      "ExpressVPN was acquired in 2021 by Kape Technologies (formerly Crossrider), a company with ties to adware and Israeli surveillance specialists. One executive was charged in 2022 for having helped UAE authorities surveil dissidents.",
    ownerCountry: "BVI",
    sellsData: true,
    deleteUrl: "https://www.expressvpn.com/support/",
    changeEmailUrl: "https://www.expressvpn.com/support/",
    euAlternativeId: "proton-vpn",
    affiliateUrl:
      "https://go.getproton.me/SH1mQ?redirect_url=https%3A%2F%2Fget.protonvpn.com%2Fl%2Fspecial-partner-offer-summerdeal",
  },

  // ─── OTHER ────────────────────────────────────────────────────────────────
  {
    id: "uber",
    name: "Uber",
    domain: "uber.com",
    category: "tech",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "57M users leaked (2016), Uber concealed breach for 1 year",
    details:
      "In 2016, 57 million Uber users and drivers were compromised. Uber chose to pay the hackers $100,000 to delete the data and stay silent — and concealed the breach from the public for over a year. Uber was fined $148 million. Competitor Lyft reported its breach within 72 hours as required by GDPR.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://help.uber.com/driving-and-delivering/article/delete-your-uber-account",
    changeEmailUrl: "https://account.uber.com/",
  },
  {
    id: "twitter-ads",
    name: "Google Ads / AdSense",
    domain: "google.com",
    category: "tech",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Pervasive cross-site tracking",
    details:
      "Google's ad network tracks you across millions of websites via cookies, fingerprinting and conversion tracking. The European Commission has launched multiple antitrust investigations against Google Ads.",
    ownerCountry: "US",
    sellsData: true,
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    domain: "cloudflare.com",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "Cloudbleed (2017) – memory leak in middleware",
    details:
      "In 2017, Cloudflare had a memory leak (Cloudbleed) that exposed sensitive data from websites using the service, including passwords and tokens. Cloudflare fixed this quickly and is generally considered a responsible actor.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "microsoft-account",
    name: "Microsoft Account",
    domain: "microsoft.com",
    category: "productivity",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Storm-0558 (2023), CLOUD Act",
    details:
      "The Microsoft account is the core of Microsoft services. Subject to the CLOUD Act. The Storm-0558 attack (2023) compromised email accounts of senior US government officials via forged authentication tokens.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://account.microsoft.com/account/",
    changeEmailUrl: "https://account.live.com/names/Manage",
  },

  // ─── CRYPTO / TRADING ─────────────────────────────────────────────────────
  {
    id: "kraken",
    name: "Kraken",
    domain: "kraken.com",
    category: "finance",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "No major public breaches, but a target for phishing.",
    details:
      "Kraken is a major US-based cryptocurrency exchange. While it has a decent security track record, user accounts are frequent targets of phishing and social engineering attacks. Data is subject to US jurisdiction.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "coinbase",
    name: "Coinbase",
    domain: "coinbase.com",
    category: "finance",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Credential stuffing attack affected 6,000 users (2021).",
    details:
      "In 2021, at least 6,000 Coinbase customers had funds stolen from their accounts after falling victim to a phishing campaign that bypassed SMS-based multi-factor authentication. Coinbase is a publicly-traded US company.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "nexo",
    name: "Nexo",
    domain: "nexo.io",
    category: "finance",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major public breaches reported.",
    details:
      "Nexo is a platform for lending and borrowing against crypto assets. It has not suffered major public security breaches, but operates in a complex regulatory environment. Registered in Switzerland, but with global operations.",
    ownerCountry: "CH",
    sellsData: false,
  },
  {
    id: "bitmex",
    name: "BitMEX",
    domain: "bitmex.com",
    category: "finance",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "User email addresses leaked (2019).",
    details:
      "In 2019, BitMEX accidentally leaked a large number of its users' email addresses by using the 'To' field instead of 'Bcc' in a mass email. The platform has also faced regulatory scrutiny in several countries.",
    ownerCountry: "SC", // Seychelles
    sellsData: false,
  },
  {
    id: "tradingview",
    name: "TradingView",
    domain: "tradingview.com",
    category: "finance",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major public breaches reported.",
    details:
      "TradingView is a popular charting and social networking platform for traders. It has a good security record but collects user data for analytics and personalisation. It's a US-based company.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "unstoppable-domains",
    name: "Unstoppable Domains",
    domain: "unstoppabledomains.com",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major public breaches reported.",
    details:
      "Provides blockchain-based domain names. As a decentralised service, the security model is different, but the central company is based in the US.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "moonpay",
    name: "MoonPay",
    domain: "moonpay.com",
    category: "finance",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches, but processes sensitive payment data.",
    details:
      "MoonPay is a financial technology company that builds payments infrastructure for crypto. It handles sensitive user and payment information, making it a high-value target.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "crypto-com",
    name: "Crypto.com",
    domain: "crypto.com",
    category: "finance",
    threatScore: "HIGH",
    dataProtection: "MEDIUM",
    breachSummary: "Unauthorised withdrawals of $34M (2022).",
    details:
      "In January 2022, Crypto.com was hacked, leading to unauthorised withdrawals of about $15 million in ETH and $19 million in BTC from 483 user accounts. The company reimbursed the users.",
    ownerCountry: "SG", // Singapore
    sellsData: false,
  },
  {
    id: "okx",
    name: "OKX",
    domain: "okx.com",
    category: "finance",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Users targeted by sophisticated social engineering.",
    details:
      "OKX is a global cryptocurrency exchange. While the platform itself has not reported major breaches, its users are frequently targeted by advanced phishing and social engineering attacks.",
    ownerCountry: "SC", // Seychelles
    sellsData: false,
  },
  {
    id: "bybit",
    name: "Bybit",
    domain: "bybit.com",
    category: "finance",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "No major public breaches reported.",
    details:
      "Bybit is a cryptocurrency derivatives exchange. It has avoided major public hacks but operates in a high-risk sector and has faced regulatory warnings in some jurisdictions.",
    ownerCountry: "AE", // UAE (Dubai)
    sellsData: false,
  },

  // ─── TRAVEL / LIFESTYLE ───────────────────────────────────────────────────
  {
    id: "lime",
    name: "Lime",
    domain: "li.me",
    category: "travel",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "Collects location and travel data.",
    details:
      "Lime, the scooter and bike rental service, collects detailed location and travel history data. While not breached, this data provides a comprehensive picture of user movements. US-based company.",
    ownerCountry: "US",
    sellsData: true,
  },
  {
    id: "finn",
    name: "FINN.no",
    domain: "finn.no",
    category: "shopping",
    threatScore: "LOW",
    dataProtection: "HIGH",
    breachSummary: "No major breaches, owned by Schibsted (NO).",
    details:
      "FINN.no is Norway's largest online marketplace. Owned by Schibsted, it is subject to Norwegian law and GDPR. It has a strong security record.",
    ownerCountry: "NO",
    sellsData: false,
  },

  // ─── DEV / HOSTING ────────────────────────────────────────────────────────
  {
    id: "supabase",
    name: "Supabase",
    domain: "supabase.com",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches, but holds sensitive developer data.",
    details:
      "Supabase provides a backend-as-a-service platform. While it has a good security reputation, it holds potentially sensitive data and API keys for many applications. US-based company.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "netlify",
    name: "Netlify",
    domain: "netlify.com",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches, but a critical part of web infrastructure.",
    details:
      "Netlify is a popular platform for hosting modern web applications. It has a strong security focus but is a high-value target due to its central role for many businesses. US-based.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "vercel",
    name: "Vercel",
    domain: "vercel.com",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches, hosts critical web applications.",
    details:
      "Vercel, the company behind Next.js, is a leading platform for frontend development and hosting. Like Netlify, it's a critical infrastructure provider with a strong security posture. US-based.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "sentry",
    name: "Sentry",
    domain: "sentry.io",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major breaches, but processes application error data.",
    details:
      "Sentry is an error tracking platform that can process potentially sensitive user data from applications. It has a good security record. US-based.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "namecheap",
    name: "Namecheap",
    domain: "namecheap.com",
    category: "tech",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Third-party email provider breached (2023), leading to phishing.",
    details:
      "In February 2023, Namecheap's third-party email system was compromised, leading to phishing emails being sent to its customers. The core domain registration system was not affected. US-based.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "godaddy",
    name: "GoDaddy",
    domain: "godaddy.com",
    category: "tech",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "Multiple breaches over several years (2020-2023).",
    details:
      "GoDaddy has suffered a series of breaches. In 2020, 28,000 hosting accounts were compromised. In 2021, 1.2 million WordPress customers had data exposed. In 2023, they revealed a multi-year breach where malware was installed on their servers.",
    ownerCountry: "US",
    sellsData: true,
  },
  {
    id: "replit",
    name: "Replit",
    domain: "replit.com",
    category: "tech",
    threatScore: "LOW",
    dataProtection: "MEDIUM",
    breachSummary: "No major public breaches reported.",
    details:
      "Replit is an online IDE. It has a good security track record but hosts user code and secrets, making it a potential target. US-based.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "hugging-face",
    name: "Hugging Face",
    domain: "huggingface.co",
    category: "tech",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "API tokens for Spaces secrets were compromised (2024).",
    details:
      "In April 2024, Hugging Face detected a security incident where unauthorised users gained access to secrets within their Spaces platform, potentially exposing API tokens and other credentials.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "aws",
    name: "AWS",
    domain: "aws.amazon.com",
    category: "tech",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Customer misconfigurations are a major source of leaks.",
    details:
      "While AWS itself is generally secure, misconfigured S3 buckets and other services by customers have led to countless data breaches. AWS is owned by Amazon and subject to the US CLOUD Act.",
    ownerCountry: "US",
    sellsData: false,
  },
];
