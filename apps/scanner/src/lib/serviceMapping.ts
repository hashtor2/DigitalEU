import { ALTERNATIVES } from '@digitaleu/shared'

/**
 * Maps email-sender domains (returned by the `scan-email` Edge Function) to the
 * big-tech product names used in the `replaces` field of the alternatives
 * catalog (`@digitaleu/shared`).
 *
 * Keys are bare registrable domains (without `www.`). Values are the exact
 * product-name strings that appear in `Alternative.replaces`, so we can match
 * detected services to the European alternatives that replace them.
 */
const DOMAIN_TO_PRODUCTS: Record<string, string[]> = {
  // Email
  'google.com': ['Gmail'],
  'gmail.com': ['Gmail'],
  'googlemail.com': ['Gmail'],
  'accounts.google.com': ['Gmail'],
  'outlook.com': ['Outlook'],
  'hotmail.com': ['Outlook'],
  'live.com': ['Outlook'],
  'microsoft.com': ['Outlook'],
  'microsoftonline.com': ['Outlook'],

  // Cloud storage
  'dropbox.com': ['Dropbox'],
  'dropboxmail.com': ['Dropbox'],
  'drive.google.com': ['G Drive'],

  // Office / docs
  'docs.google.com': ['G Docs'],
  'office.com': ['MS Office'],
  'office365.com': ['MS Office'],

  // Code hosting
  'github.com': ['GitHub'],
  'githubusercontent.com': ['GitHub'],
  'bitbucket.org': ['Bitbucket'],
  'atlassian.com': ['Bitbucket'],

  // Messaging / meetings
  'slack.com': ['Slack'],
  'slack-mail.com': ['Slack'],
  'zoom.us': ['Zoom'],
  'zoom.com': ['Zoom'],
  'teams.microsoft.com': ['MS Teams', 'Teams'],

  // VPN
  'nordvpn.com': ['NordVPN'],
  'expressvpn.com': ['ExpressVPN'],
  'surfshark.com': ['Surfshark'],

  // Password managers
  'lastpass.com': ['LastPass'],
  '1password.com': ['1Password'],
  'dashlane.com': ['Dashlane'],

  // Analytics
  'mailchimp.com': ['Mailchimp'],
  'mailchimpapp.com': ['Mailchimp'],
  'analytics.google.com': ['Google Analytics'],

  // Maps
  'maps.google.com': ['Google Maps'],

  // Cloud infrastructure
  'amazonaws.com': ['AWS'],
  'aws.amazon.com': ['AWS'],
  'azure.com': ['Azure'],
  'azure.microsoft.com': ['Azure'],
  'cloud.google.com': ['GCP'],
}

/** Strip a leading `www.` and lowercase a domain. */
function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase().replace(/^www\./, '')
}

/**
 * Resolve a sender domain to product names, matching either the full domain or
 * its registrable parent (e.g. `mail.github.com` -> `github.com`).
 */
function productsForDomain(domain: string): string[] {
  const normalized = normalizeDomain(domain)
  if (DOMAIN_TO_PRODUCTS[normalized]) return DOMAIN_TO_PRODUCTS[normalized]

  // Walk up subdomains: mg.mail.dropboxmail.com -> mail.dropboxmail.com -> dropboxmail.com ...
  const parts = normalized.split('.')
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join('.')
    if (DOMAIN_TO_PRODUCTS[parent]) return DOMAIN_TO_PRODUCTS[parent]
  }
  return []
}

/**
 * Map a list of detected sender domains to the IDs of European alternatives
 * (from `ALTERNATIVES`) that replace the corresponding big-tech products.
 *
 * @param domains Sender domains from the `scan-email` response (`senders`).
 * @returns Unique, sorted list of alternative IDs to pre-select.
 */
export function mapDomainsToAlternativeIds(domains: string[]): string[] {
  if (!Array.isArray(domains) || domains.length === 0) return []

  // Collect the set of detected product names (lowercased for matching).
  const detectedProducts = new Set<string>()
  for (const domain of domains) {
    for (const product of productsForDomain(domain)) {
      detectedProducts.add(product.toLowerCase())
    }
  }
  if (detectedProducts.size === 0) return []

  const alternativeIds = new Set<string>()
  for (const alt of ALTERNATIVES) {
    const matches = alt.replaces.some((name) => detectedProducts.has(name.toLowerCase()))
    if (matches) alternativeIds.add(alt.id)
  }

  return Array.from(alternativeIds).sort()
}
