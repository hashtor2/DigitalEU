export interface GdprTemplate {
  serviceId: string
  serviceName: string
  companyLegalName: string
  dpoEmail: string
  registeredAddress: string
  selfServeUrl?: string
}

export const GDPR_TEMPLATES: GdprTemplate[] = [
  {
    serviceId: "google",
    serviceName: "Google / Gmail",
    companyLegalName: "Google LLC",
    dpoEmail: "support-legal@google.com",
    registeredAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
    selfServeUrl: "https://myaccount.google.com/delete-services-or-account",
  },
  {
    serviceId: "gmail",
    serviceName: "Gmail",
    companyLegalName: "Google LLC",
    dpoEmail: "support-legal@google.com",
    registeredAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
    selfServeUrl: "https://myaccount.google.com/delete-services-or-account",
  },
  {
    serviceId: "facebook",
    serviceName: "Facebook / Meta",
    companyLegalName: "Meta Platforms Ireland Ltd.",
    dpoEmail: "privacy@support.facebook.com",
    registeredAddress: "4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Ireland",
    selfServeUrl: "https://www.facebook.com/help/contact/140410099945839",
  },
  {
    serviceId: "instagram",
    serviceName: "Instagram",
    companyLegalName: "Meta Platforms Ireland Ltd.",
    dpoEmail: "privacy@support.facebook.com",
    registeredAddress: "4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Ireland",
    selfServeUrl: "https://help.instagram.com/contact/448893632022798",
  },
  {
    serviceId: "whatsapp",
    serviceName: "WhatsApp",
    companyLegalName: "WhatsApp Ireland Ltd.",
    dpoEmail: "privacy@whatsapp.com",
    registeredAddress: "4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Ireland",
    selfServeUrl: "https://www.whatsapp.com/legal/privacy-policy#privacy-rights",
  },
  {
    serviceId: "microsoft",
    serviceName: "Microsoft / Outlook",
    companyLegalName: "Microsoft Ireland Operations Ltd.",
    dpoEmail: "msieuprivacy@microsoft.com",
    registeredAddress: "One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Ireland",
    selfServeUrl: "https://account.microsoft.com/privacy",
  },
  {
    serviceId: "outlook",
    serviceName: "Outlook",
    companyLegalName: "Microsoft Ireland Operations Ltd.",
    dpoEmail: "msieuprivacy@microsoft.com",
    registeredAddress: "One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Ireland",
    selfServeUrl: "https://account.microsoft.com/privacy",
  },
  {
    serviceId: "linkedin",
    serviceName: "LinkedIn",
    companyLegalName: "LinkedIn Ireland Unlimited Company",
    dpoEmail: "DPO@linkedin.com",
    registeredAddress: "Wilton Plaza, Wilton Place, Dublin 2, Ireland",
    selfServeUrl: "https://www.linkedin.com/psettings/member-data",
  },
  {
    serviceId: "twitter",
    serviceName: "X / Twitter",
    companyLegalName: "Twitter International Unlimited Company",
    dpoEmail: "privacy@twitter.com",
    registeredAddress: "One Cumberland Place, Fenian Street, Dublin 2, D02 AX07, Ireland",
    selfServeUrl: "https://twitter.com/settings/your_twitter_data/account",
  },
  {
    serviceId: "netflix",
    serviceName: "Netflix",
    companyLegalName: "Netflix International B.V.",
    dpoEmail: "privacy@netflix.com",
    registeredAddress: "Wesertoren, Weena 690, 3012 CN Rotterdam, The Netherlands",
    selfServeUrl: "https://www.netflix.com/account/getmyinfo",
  },
  {
    serviceId: "spotify",
    serviceName: "Spotify",
    companyLegalName: "Spotify AB",
    dpoEmail: "privacy@spotify.com",
    registeredAddress: "Regeringsgatan 19, 111 53 Stockholm, Sweden",
    selfServeUrl: "https://www.spotify.com/account/privacy",
  },
  {
    serviceId: "amazon",
    serviceName: "Amazon",
    companyLegalName: "Amazon Europe Core S.a r.l.",
    dpoEmail: "aws-gdpr-deletion@amazon.com",
    registeredAddress: "38 avenue John F. Kennedy, L-1855, Luxembourg",
    selfServeUrl: "https://www.amazon.com/gp/privacyprefs/deletionrequest",
  },
  {
    serviceId: "apple",
    serviceName: "Apple",
    companyLegalName: "Apple Distribution International Ltd.",
    dpoEmail: "privacy@apple.com",
    registeredAddress: "Hollyhill Industrial Estate, Cork, Ireland",
    selfServeUrl: "https://privacy.apple.com/account",
  },
  {
    serviceId: "dropbox",
    serviceName: "Dropbox",
    companyLegalName: "Dropbox International Unlimited Company",
    dpoEmail: "privacy@dropbox.com",
    registeredAddress: "One Park Place, Upper Hatch Street, Dublin 2, Ireland",
    selfServeUrl: "https://www.dropbox.com/account/security",
  },
  {
    serviceId: "notion",
    serviceName: "Notion",
    companyLegalName: "Notion Labs, Inc.",
    dpoEmail: "privacy@makenotion.com",
    registeredAddress: "2300 Harrison Street, San Francisco, CA 94110, USA",
    selfServeUrl: "https://www.notion.so/help/contact-support",
  },
  {
    serviceId: "slack",
    serviceName: "Slack",
    companyLegalName: "Slack Technologies Limited",
    dpoEmail: "privacy@slack.com",
    registeredAddress: "4th Floor, 85 Bolsover Street, London W1W 5QE, UK",
    selfServeUrl: "https://slack.com/intl/en-gb/help/articles/360000380986",
  },
  {
    serviceId: "adobe",
    serviceName: "Adobe",
    companyLegalName: "Adobe Systems Software Ireland Limited",
    dpoEmail: "DPO@adobe.com",
    registeredAddress: "4-6 Riverwalk, Citywest Business Campus, Dublin 24, Ireland",
    selfServeUrl: "https://www.adobe.com/privacy/privacy-contact.html",
  },
  {
    serviceId: "paypal",
    serviceName: "PayPal",
    companyLegalName: "PayPal (Europe) S.a r.l. et Cie, S.C.A.",
    dpoEmail: "DPO@paypal.com",
    registeredAddress: "22-24 Boulevard Royal, L-2449 Luxembourg",
    selfServeUrl: "https://www.paypal.com/myaccount/privacy/privacyhub",
  },
  {
    serviceId: "github",
    serviceName: "GitHub",
    companyLegalName: "GitHub, Inc.",
    dpoEmail: "privacy@github.com",
    registeredAddress: "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA",
    selfServeUrl: "https://github.com/settings/admin",
  },
  {
    serviceId: "youtube",
    serviceName: "YouTube",
    companyLegalName: "Google LLC",
    dpoEmail: "support-legal@google.com",
    registeredAddress: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
    selfServeUrl: "https://myaccount.google.com/delete-services-or-account",
  },
]

export function getGdprTemplate(serviceId: string): GdprTemplate | undefined {
  const id = serviceId.toLowerCase()
  return GDPR_TEMPLATES.find((t) => t.serviceId === id)
}

export function generateErasureLetter(opts: {
  template: GdprTemplate
  yourName: string
  yourEmail: string
  today?: string
}): string {
  const { template, yourName, yourEmail } = opts
  const today =
    opts.today ??
    new Date().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const selfServeNote = template.selfServeUrl
    ? "\n\nI have also initiated the self-service deletion at:\n" + template.selfServeUrl
    : ""

  return (
    today +
    "\n\nData Protection Officer\n" +
    template.companyLegalName +
    "\n" +
    template.registeredAddress +
    "\n\nVia email: " +
    template.dpoEmail +
    "\n\nSubject: Request for Erasure of Personal Data - Article 17 GDPR\n\nDear Data Protection Officer,\n\nI am writing to exercise my right to erasure under Article 17 of the General Data Protection Regulation (EU) 2016/679.\n\nMy details:\n  Full name:    " +
    yourName +
    "\n  Email address used on your service: " +
    yourEmail +
    "\n\nI hereby request that you permanently erase all personal data you hold about me, including but not limited to: account information, usage data, communications, and any data shared with third-party processors.\n\nPlease confirm in writing (to " +
    yourEmail +
    ") that:\n1. All personal data has been erased, and\n2. Any third parties to whom the data was disclosed have been informed.\n\nI expect a response within 30 days as required by Article 12(3) GDPR." +
    selfServeNote +
    "\n\nYours sincerely,\n" +
    yourName +
    "\n" +
    yourEmail
  )
}
