/**
 * Kuratert database over de 45 vanligste forbrukertjenestene, med sikkerhetsscorer,
 * databehandlingspraksis og EU-alternativer.
 *
 * Threat Score metodikk:
 *  HIGH   = bekreftet databrudd med brukerdata eksponert, og/eller aktivt salg av data
 *  MEDIUM = ingen store brudd men samler/deler mye data, eller bekreftet lekket metadata
 *  LOW    = relativt god historikk, begrenset datainnsamling
 *
 * Data Protection metodikk:
 *  HIGH   = sterk kryptering, GDPR-samsvar, minimal datainnsamling
 *  MEDIUM = rimelig praksis, men med forbedringspotensial
 *  LOW    = selger brukerdata, liten transparens, utenfor EU-jurisdiksjon
 */

export type ThreatLevel = "HIGH" | "MEDIUM" | "LOW";

export interface ServiceInfo {
  id: string;
  name: string;
  domain: string;
  /** Kategori for visning og filtrering */
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
  /** Korte faktapunkter vist i dashbord-rad */
  breachSummary: string;
  /** Mer detaljert forklaring for utvidet visning */
  details: string;
  /** Land der selskapet er registrert */
  ownerCountry: string;
  /** Selger eller deler data med tredjeparter */
  sellsData: boolean;
  /** URL for å slette konto */
  deleteUrl?: string;
  /** URL for å endre e-postadresse */
  changeEmailUrl?: string;
  /** ID til EU-alternativ i ALTERNATIVES-katalogen */
  euAlternativeId?: string;
  /** Direkte affiliate-lenke til anbefalt alternativ */
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
    breachSummary: "533M brukere lekket (2021), Cambridge Analytica (2018)",
    details:
      "Facebook ble avslørt i Cambridge Analytica-skandalen (2018) der 87 millioner profildata ble brukt til politisk manipulasjon uten samtykke. I 2021 ble telefonummer og personopplysninger til 533 millioner brukere publisert på et hackerforum. Facebook er kjent for å selge annonseprofiler basert på detaljert atferd.",
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
    breachSummary: "Eies av Meta, deler data med Facebook",
    details:
      "Instagram er eid av Meta og deler all innsamlet data med Facebook. I 2019 ble 49 millioner brukerprofiler eksponert via usikret database. Meta ble bøtelagt €405 millioner av irsk DPC (2022) for brudd på barns personvern på Instagram.",
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
    breachSummary: "200M e-poster lekket (2022), svekket sikkerhetskultur",
    details:
      "I desember 2022 ble e-postadresser til over 200 millioner Twitter-brukere publisert på hackerforum. Etter Elon Musks oppkjøp i 2022 ble store deler av sikkerhetsteamet sparket, og nøkkelansatte i GDPR-samsvar forlot selskapet. EU har åpnet etterforskning.",
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
    breachSummary: "Kinesisk eierskap, EU-bøter (2023), dataoverføring til Kina",
    details:
      "TikTok er eid av ByteDance med hovedkvarter i Kina. EU bøtelagt TikTok €345 millioner (2023) for brudd på barns personvern. Irsk DPC bekreftet at ansatte i Kina hadde tilgang til europeiske brukerdata. TikTok forbud innført for ansatte i EU-institusjoner og flere nasjonale regjeringer.",
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
    breachSummary: "4.6M brukere eksponert (2014), insider data-misbruk",
    details:
      "I 2014 ble 4.6 millioner brukertelefonnummer og brukernavn publisert offentlig. Snaplion var en tredjeparts app som lagret bilder som skulle forsvinne. I 2019 ble det avdekket at Snap-ansatte misbrukte et internt verktøy (SnapLion) til å spionere på brukere.",
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
    breachSummary: "2018 database-kompromittering, API-salg til AI-selskaper",
    details:
      "I 2018 ble Reddit hacket via SMS-basert 2FA. Reddit selger nå API-tilgang til AI-selskaper (Google, OpenAI) for brukerutsagn, noe mange brukere protesterte mot. Brukere uten samtykke har dermed bidratt til å trene kommersielle AI-modeller.",
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
    breachSummary: "Ingen store brudd – men brukerdataanalyse til annonser",
    details:
      "Pinterest har ikke hatt store offentlige databrudd, men samler detaljert informasjon om interesser og adferd for annonseformål. De er underlagt US-jurisdiksjon og deler data med annonseringspartnere.",
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
    breachSummary: "700M brukere scraped (2021), 117M passord lekket (2012/2016)",
    details:
      "I 2012 ble 6.5 millioner hashede passord lekket – i 2016 ble det klart at det egentlig var 117 millioner. I 2021 ble data fra 700 millioner LinkedIn-profiler scraped og solgt. LinkedIn, eid av Microsoft, bruker profildata til annonseringsformål.",
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
    breachSummary: "Eies av Google, massiv atferdsprofiling",
    details:
      "YouTube er eid av Google og bygger detaljerte atferdsprofiler basert på seerhistorikk. Google ble bøtelagt $170 millioner (2019) av FTC for ulovlig innsamling av barns data på YouTube. All seerhistorikk deles med Google Ads.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://myaccount.google.com/deleteaccount",
    changeEmailUrl: "https://myaccount.google.com/email",
    euAlternativeId: "peertube",
  },

  // ─── E-POST ───────────────────────────────────────────────────────────────
  {
    id: "gmail",
    name: "Gmail",
    domain: "gmail.com",
    category: "email",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Innholdsskanning for annonseprofiler, Google-dataøkosystem",
    details:
      "Google skannet Gmail-innhold for annonseformål frem til 2017. Selv om direkteskanning stoppet, bruker Google metadata og knytter Gmail-aktivitet til annonseprofiler. Alle data er underlagt US-jurisdiksjon og CLOUD Act, som gir amerikanske myndigheter tilgang.",
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
    breachSummary: "Microsoft-datadeling, CLOUD Act-eksponering",
    details:
      "Microsoft Exchange og Outlook ble kompromittert av Hafnium (2021) og Storm-0558 (2023), sistnevnte berørte offentlige e-postkontoer. Microsoft er underlagt CLOUD Act og kan utlevere data til US-myndigheter uten europeisk rettsordre.",
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
    breachSummary: "3 MILLIARDER kontoer lekket (2013–2016)",
    details:
      "Yahoo hadde det største databryddet i historien: 3 milliarder kontoer kompromittert mellom 2013 og 2016. Yahoo var også i 2016 tvunget av NSA til å masseovervåke bruker-e-poster. Selskapet ble kjøpt av Verizon og er nå en del av Apollo Global.",
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
    breachSummary: "Google kan lese filer, US-jurisdiksjon",
    details:
      "Google Drive-filer er kryptert, men Google besitter nøklene og kan lese innholdet. Google har utlevert brukerdata til US-myndigheter via CLOUD Act. Drive er koblet til Google Workspace-profileringen.",
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
    breachSummary: "68M passord lekket (2012), avslørte i 2016",
    details:
      "I 2012 ble 68 millioner Dropbox-kontoer kompromittert, men det ble ikke offentliggjort før i 2016. Dropbox fikk kritikk for å tilby Condoleezza Rice (styremedlem, NSA-tilknytning) plass i styret. Filene er kryptert, men Dropbox besitter nøklene.",
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
      "Microsoft ble rammet av Storm-0558-angrepet (2023) der kinesiske hackere fikk tilgang til e-post og skydokumenter hos statlige kunder. OneDrive er underlagt CLOUD Act.",
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
    breachSummary: "The Fappening (2014), Apple/Kina-server-kompromiss",
    details:
      "I 2014 ble celebrity-bilder lekket fra iCloud via phishing og bruteforce (The Fappening). Apple lagrer kinesiske brukerdata på servere i Kina eid av statskontrollert GCBD, noe som gir kinesiske myndigheter tilgang. Apple er underlagt US CLOUD Act for andre regioner.",
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
    breachSummary: "Ingen store brudd – men detaljert adferdsprofil",
    details:
      "Netflix har ikke hatt store databrudd, men bygger svært detaljerte atferdsprofiler: hva du ser, når du pauser, hva du hopper over. Disse brukes til innholds-anbefalinger og deles delvis med annonseringspartnere (ad-tier).",
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
    breachSummary: "Ingen store brudd – men stemme- og lyddata innsamles",
    details:
      "Spotify samler inn stemmeopptakene dine (via mikrofontilgang) og plasserer deg i reklameprofiler. De deler data med Facebook om du har koblet kontoene. Spotify er imidlertid et svensk selskap og underlagt EU/GDPR.",
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
    breachSummary: "Tusenvis av kontoer solgt etter kompromittering (2019)",
    details:
      "Timer etter Disney+ lansering i 2019 ble tusenvis av kontoer hacket og solgt på dark web. Disney delte brukerdata med annonsepartnere uten tilstrekkelig samtykke, noe som resulterte i rettsak i California.",
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
    breachSummary: "Intern datalekkasje (2018), Alexa-avlytting, AWS-brudd",
    details:
      "I 2018 lekket en Amazon-ansatt kundedata til tredjepartsleverandører. Alexa-stemmeopptak har blitt lyttet til av menneskelige ansatte uten brukerens viten. AWS har vært involvert i flere høyprofilerte databrudd hos kunder.",
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
    breachSummary: "Expedia Group-brudd, Marriott-brudd (500M gjester)",
    details:
      "Hotels.com er eid av Expedia Group. Marriott-bryddet (2018) eksponerte 500 millioner gjesteposter inkludert passinformasjon – en av historiens største. Hotels.com har egen deling av bestillingsdata med annonseringsnettverk. Expedia-gruppen har mottatt GDPR-bot.",
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
    breachSummary: "Phishing-kampanje rammet hoteller (2024)",
    details:
      "I 2024 ble mange Booking.com-hoteller rammet av phishing som ga hackere tilgang til hotellets systemer og kundekommunikasjon. Booking er eid av nederlandske Booking Holdings, men deler data med annonseringspartnere globalt.",
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
    breachSummary: "Ingen store brudd – men biometrisk ID-innsamling",
    details:
      "Airbnb krever i mange tilfeller biometrisk ID-bekreftelse. De samler inn og lagrer identitetsdokumenter. Airbnb deler data med utleiere og annonseringspartnere. Ingen store databrudd dokumentert, men ID-lagring er et personvernproblem.",
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
    breachSummary: "145M brukere eksponert (2014)",
    details:
      "I 2014 ble eBay hacket og data fra 145 millioner brukere eksponert, inkludert krypterte passord, navn, adresser og fødselsdatoer. eBay ventet to måneder med å varsle brukerne. De er nå del av ett større datadelings-nettverk.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://www.ebay.com/help/account/articles/closing-account",
    changeEmailUrl: "https://accountsettings.ebay.com/",
  },

  // ─── SØK ──────────────────────────────────────────────────────────────────
  {
    id: "google-search",
    name: "Google Search",
    domain: "google.com",
    category: "search",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Massiv søkeprofiling, EU-bot €8.25 mrd",
    details:
      "Google ble bøtelagt €8.25 milliarder av EU (2017–2019) for misbruk av dominerende markedsposisjon via søk. Google bygger detaljerte profiler basert på søkehistorikk, koblet til annonseprofilen din på tvers av alle Google-tjenester.",
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
    breachSummary: "Microsoft datadeling, CLOUD Act-eksponering",
    details:
      "Bing er Microsofts søkemotor. Microsoft ble i 2023 avslørt for å ha eksponert 38 terabyte intern data ved en feilkonfigurasjon. Søkedata brukes til Microsoft Advertising.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://account.microsoft.com/account/",
    changeEmailUrl: "https://account.microsoft.com/account/",
    euAlternativeId: "qwant",
  },

  // ─── PRODUKTIVITET ────────────────────────────────────────────────────────
  {
    id: "google-docs",
    name: "Google Docs / Workspace",
    domain: "docs.google.com",
    category: "productivity",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Google kan lese dokumenter, US-jurisdiksjon",
    details:
      "Google Workspace-dokumenter er ikke ende-til-ende-kryptert. Google kan lese innholdet og har gjort det på forespørsel fra US-myndigheter. Bedriftsdata er underlagt CLOUD Act.",
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
    breachSummary: "Storm-0558 (2023), statlig data eksponert",
    details:
      "Storm-0558 (kinesiske hackere) fikk i 2023 tilgang til e-post hos amerikanske myndigheter via Microsoft. Microsoft 365 bruker metadata til å forbedre AI-tjenester. Underlagt CLOUD Act.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://account.microsoft.com/account/",
    changeEmailUrl: "https://account.live.com/names/Manage",
    euAlternativeId: "nextcloud",
  },

  // ─── KOMMUNIKASJON ────────────────────────────────────────────────────────
  {
    id: "whatsapp",
    name: "WhatsApp",
    domain: "whatsapp.com",
    category: "communication",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "500M brukere eksponert (2022), Meta-datadeling",
    details:
      "I 2022 ble metadata fra 500 millioner WhatsApp-brukere lagt ut for salg. Meldinger er ende-til-ende-kryptert, men metadata (hvem du snakker med, hvor ofte, din lokasjon) deles med Meta/Facebook for annonseformål. WhatsApp i EU mottok €225 millioner GDPR-bot (2021).",
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
    breachSummary: "Spoonbot-brudd (2023), innholdsmoderatoreksponering",
    details:
      "En Discord-bot-plattform (Spoonbot) ble hacket i 2023 og eksponerte 760 millioner meldinger. Discord lagrer alle meldinger på sine servere (ikke E2E), og ansatte har tilgang til meldingsinnhold for moderering.",
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
    breachSummary: "500K kontoer solgt (2020), Zoomboming-periode",
    details:
      "I 2020 ble 500 000 Zoom-kontoer solgt på dark web. Zoom ble kritisert for å rute europeiske samtaler via kinesiske servere. Zoom ble også bøtelagt av FTC (2020) for løgn om end-to-end kryptering.",
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
    breachSummary: "Brudd med passordlekkasje (2015), Salesforce-eierskap",
    details:
      "I 2015 ble Slack hacket og brukerprofildata inkludert hashede passord eksponert. Slack brukes av Salesforce til AI-opplæring. Arbeidsgivers meldinger er tilgjengelig for administrator, og Slack-ansatte kan få tilgang til innhold ved behov.",
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
    breachSummary: "Ikke E2E som standard, Pavel Durov arrestert (2024)",
    details:
      "Telegrams vanlige chatter er IKKE ende-til-ende-kryptert – kun Secret Chats er det. Pavel Durov ble arrestert i Frankrike (2024) for manglende samarbeid med myndigheter om innholdskontroll. Telegram delte brukerdata med myndigheter etterpå.",
    ownerCountry: "AE",
    sellsData: false,
    deleteUrl: "https://my.telegram.org/",
    changeEmailUrl: "https://my.telegram.org/",
    euAlternativeId: "signal",
  },

  // ─── PASSORDBEHANDLER ─────────────────────────────────────────────────────
  {
    id: "lastpass",
    name: "LastPass",
    domain: "lastpass.com",
    category: "security",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "Hele vault-databasen stjålet (2022) – passord i risiko",
    details:
      "I august og desember 2022 ble LastPass hacket. Angriperne stjal krypterte vault-data for alle brukere. Med svake master-passord kan alle lagrede passord dekrypteres. Millioner av brukere anbefales å endre alle passord umiddelbart. LastPass løy initielt om omfanget.",
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
    breachSummary: "Okta-brudd berørte intern IT (2023) – ingen brukervaults",
    details:
      "1Password hadde i 2023 en hendelse knyttet til Okta-bryddet der en angriper fikk tilgang til IT-systemer, men ingen brukervaults ble kompromittert. 1Password bruker zero-knowledge kryptering der de ikke kan lese dine passord.",
    ownerCountry: "CA",
    sellsData: false,
    deleteUrl: "https://support.1password.com/delete-account/",
    changeEmailUrl: "https://my.1password.com/profile",
    euAlternativeId: "proton-pass",
    affiliateUrl:
      "https://go.getproton.me/SH1mP?redirect_url=https%3A%2F%2Fproton.me%2Fl%2Fpass%2Fshorter-flow-pricing",
  },

  // ─── FINANS ───────────────────────────────────────────────────────────────
  {
    id: "paypal",
    name: "PayPal",
    domain: "paypal.com",
    category: "finance",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "35K kontoer credential-stuffing (2023)",
    details:
      "I 2023 ble 35 000 PayPal-kontoer kompromittert via credential-stuffing (gjenbruk av passord fra andre lekkasjer). PayPal deler transaksjonsinformasjon med annonsepartnere og har blitt kritisert for vide datadelingsklausuler.",
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
    breachSummary: "Eid av Microsoft, Copilot trener på kode uten samtykke",
    details:
      "GitHub er eid av Microsoft. GitHub Copilot ble trent på offentlig kode uten eksplisitt samtykke fra utviklere, noe som resulterte i rettsak. Microsoft/GitHub er underlagt CLOUD Act.",
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
    breachSummary: "153M kontoer lekket (2013), AI-opplærings-kontrovers (2024)",
    details:
      "I 2013 ble 153 millioner Adobe-kontoer kompromittert inkludert krypterte passord og betalingsinformasjon. I 2024 oppdaterte Adobe brukervilkårene til å gi seg selv rett til å bruke brukerinnhold til AI-opplæring, noe som skapte stor motstand og kontraktsoppsigelser.",
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
    breachSummary: "Hele plattform-kildekode lekket (2021), Amazon-eierskap",
    details:
      "I 2021 ble Twitch hacket og hele kildekoden, utbetalingsdata for streamers og interne verktøy publisert. Twitch er eid av Amazon. Amazon bruker data på tvers av tjenestene sine til annonseformål.",
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
    breachSummary: "En server hacket (2018), avslørt 2019",
    details:
      "En av NordVPNs servere i Finland ble kompromittert i 2018 via en usikret remote management-system. NordVPN avslørte ikke dette offentlig før i 2019. NordVPN er registrert i Panama men drives fra Litauen.",
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
    breachSummary: "Kjøpt av Kzen (israelske overvåkningseksperter, 2021)",
    details:
      "ExpressVPN ble i 2021 kjøpt av Kape Technologies (tidligere Crossrider), et selskap med tilknytning til adware og israelske overvåkningsspesialister. En av de ansvarlige for VPN-tjenestene ble i 2022 siktet for å ha hjulpet UAE-myndighetene med å overvåke dissidenter.",
    ownerCountry: "BVI",
    sellsData: true,
    deleteUrl: "https://www.expressvpn.com/support/",
    changeEmailUrl: "https://www.expressvpn.com/support/",
    euAlternativeId: "proton-vpn",
    affiliateUrl:
      "https://go.getproton.me/SH1mQ?redirect_url=https%3A%2F%2Fget.protonvpn.com%2Fl%2Fspecial-partner-offer-summerdeal",
  },

  // ─── ANNET ────────────────────────────────────────────────────────────────
  {
    id: "uber",
    name: "Uber",
    domain: "uber.com",
    category: "tech",
    threatScore: "HIGH",
    dataProtection: "LOW",
    breachSummary: "57M brukere lekket (2016), Uber skjulte bruddet i 1 år",
    details:
      "I 2016 ble 57 millioner Uber-brukere og sjåfører kompromittert. Uber valgte å betale hackerne $100 000 for å slette dataene og holde tause – og skjulte bruddet fra offentligheten i over ett år. Uber ble bøtelagt $148 millioner. Lyft-konkurrenten rapporterte bruddet innen 72 timer som GDPR krever.",
    ownerCountry: "US",
    sellsData: true,
    deleteUrl: "https://help.uber.com/driving-and-delivering/article/delete-your-uber-account",
    changeEmailUrl: "https://account.uber.com/",
  },
  {
    id: "twitter-ads",
    name: "Google Ads / Ad Sense",
    domain: "google.com",
    category: "tech",
    threatScore: "MEDIUM",
    dataProtection: "LOW",
    breachSummary: "Pervasiv sporing på tvers av alle nettsteder",
    details:
      "Googles annonsenettverk sporer deg på tvers av millioner av nettsteder via cookies, fingerprinting og konverteringssporing. EU-kommisjonen har innledet multiple antitrust-undersøkelser mot Google Ads.",
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
    breachSummary: "Cloudbleed (2017) – minnelekkasje i mellomvare",
    details:
      "I 2017 hadde Cloudflare en minnelekkasje (Cloudbleed) som eksponerte sensitiv data fra nettsteder som brukte tjenesten, inkludert passord og tokens. Cloudflare fikset dette raskt og er generelt ansett som en ansvarlig aktør.",
    ownerCountry: "US",
    sellsData: false,
  },
  {
    id: "microsoft-account",
    name: "Microsoft-konto",
    domain: "microsoft.com",
    category: "productivity",
    threatScore: "MEDIUM",
    dataProtection: "MEDIUM",
    breachSummary: "Storm-0558 (2023), CLOUD Act",
    details:
      "Microsoft-kontoen er kjernen i Microsoft-tjenestene. Underlagt CLOUD Act. Storm-0558-angrepet (2023) kompromitterte e-postkontoer til sentrale US-myndighetspersoner via falske autentiseringstoken.",
    ownerCountry: "US",
    sellsData: false,
    deleteUrl: "https://account.microsoft.com/account/",
    changeEmailUrl: "https://account.live.com/names/Manage",
  },

  // ─── CRYPTO / TRADING (FROM EKSEMPELKONTOER.TXT) ──────────────────────────
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
      "In 2021, at least 6,000 Coinbase customers had funds stolen from their accounts after falling victim to a phishing campaign that bypassed the SMS-based multi-factor authentication. Coinbase is a publicly-traded US company.",
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
      "TradingView is a popular charting and social networking platform for traders. It has a good security record but collects user data for analytics and personalization. It's a US-based company.",
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
      "Provides blockchain-based domain names. As a decentralized service, the security model is different, but the central company is based in the US.",
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
    breachSummary: "Unauthorized withdrawals of $34M (2022).",
    details:
      "In January 2022, Crypto.com was hacked, leading to unauthorized withdrawals of about $15 million in ETH and $19 million in BTC from 483 user accounts. The company reimbursed the users.",
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

  // ─── TRAVEL / LIFESTYLE (FROM EKSEMPELKONTOER.TXT) ───────────────────────
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

  // ─── DEV / HOSTING (FROM EKSEMPELKONTOER.TXT) ─────────────────────────────
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
      "In April 2024, Hugging Face detected a security incident where unauthorized users gained access to secrets within their Spaces platform, potentially exposing API tokens and other credentials.",
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
      "While AWS itself is generally secure, misconfigured S3 buckets and other services by customers have led to countless data breaches. AWS is owned by Amazon and subject to US CLOUD Act.",
    ownerCountry: "US",
    sellsData: false,
  },
];
