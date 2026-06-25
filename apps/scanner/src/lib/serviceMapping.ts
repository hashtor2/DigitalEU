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
 * Multi-part public suffixes where the registrable domain is the last THREE
 * labels (e.g. `bbc.co.uk`) rather than the last two.
 */
const MULTI_PART_TLDS = new Set([
  'co.uk', 'org.uk', 'gov.uk', 'ac.uk', 'co.jp', 'co.nz', 'co.za',
  'com.au', 'com.br', 'com.mx', 'com.tr', 'co.in', 'co.kr',
])

/**
 * Reduce a full sender host to its registrable domain, so
 * `news.e.spotify.com` and `email.spotify.com` collapse to `spotify.com`.
 */
function toRegistrableDomain(host: string): string {
  const parts = normalizeDomain(host).split('.').filter(Boolean)
  if (parts.length <= 2) return parts.join('.')

  const lastTwo = parts.slice(-2).join('.')
  const lastThree = parts.slice(-3).join('.')
  if (MULTI_PART_TLDS.has(lastTwo)) return lastThree
  return lastTwo
}

/**
 * Email-infrastructure / bulk-sending domains that represent a mail provider
 * rather than a service the user has an account with. Filtered out of the
 * detected-footprint list to reduce noise.
 */
const EMAIL_INFRA_DOMAINS = new Set([
  'amazonses.com', 'sendgrid.net', 'sendgrid.com', 'mailgun.org', 'mailgun.net',
  'mandrillapp.com', 'mcsv.net', 'mcdlv.net', 'rsgsv.net', 'sparkpostmail.com',
  'postmarkapp.com', 'mailjet.com', 'sendinblue.com', 'sendib.com', 'mailchimp.com',
  'cmail19.com', 'cmail20.com', 'createsend.com', 'klaviyomail.com', 'mailendo.com',
  'bnc3.mailjet.com', 'e.customeriomail.com', 'mailanyone.net', 'list-manage.com',
  'amazonaws.com', 'cloudfront.net', 'bounce.email', 'bounces.email',
])

/** Personal-email provider domains (not "services" to migrate). */
const PERSONAL_EMAIL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com',
  'yahoo.com', 'icloud.com', 'me.com', 'aol.com', 'proton.me', 'protonmail.com',
])

/**
 * Turn the raw sender domains from the scan into a deduplicated list of
 * registrable domains representing the services found in the inbox.
 *
 * Input order (frequency-sorted from the server) is preserved. Infrastructure
 * and personal-email domains are filtered out.
 *
 * @param domains Sender domains from the `scan-email` response (`senders`).
 * @returns Unique registrable domains, most-frequent first.
 */
export function extractDetectedServices(domains: string[]): string[] {
  if (!Array.isArray(domains)) return []

  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of domains) {
    const registrable = toRegistrableDomain(raw)
    if (!registrable || registrable.indexOf('.') === -1) continue
    if (EMAIL_INFRA_DOMAINS.has(registrable)) continue
    if (PERSONAL_EMAIL_DOMAINS.has(registrable)) continue
    if (seen.has(registrable)) continue
    seen.add(registrable)
    result.push(registrable)
  }
  return result
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
