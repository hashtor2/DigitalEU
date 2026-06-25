import { DOMAIN_MAPPINGS, type DetectedAccount } from '@digitaleu/shared'

export type InboxProvider = 'gmail' | 'outlook'

export interface ScanEmailResponse {
  senders: string[]
  senderCounts: Record<string, number>
  count: number
  scannedCount: number
  provider: InboxProvider
}

export interface MatchedScanResult {
  serviceId: string
  serviceName: string
  domain: string
  category: string
  detectedCount: number
  sampleSenders: string[]
  suggestedAlternativeId?: string
}

export interface GuestScanPayload {
  provider: InboxProvider
  scannedCount: number
  matched: MatchedScanResult[]
  createdAt: number
}

export const GUEST_SCAN_STORAGE_KEY = 'scanner_guest_scan'

export function matchDomainsToResults(
  senderCounts: Record<string, number>
): MatchedScanResult[] {
  const byServiceId = new Map<string, MatchedScanResult>()

  for (const [domain, count] of Object.entries(senderCounts)) {
    const normalizedDomain = domain.toLowerCase()
    const mapping = DOMAIN_MAPPINGS.find(
      (m) =>
        m.domain === normalizedDomain ||
        m.alternativeDomains.includes(normalizedDomain) ||
        normalizedDomain.endsWith(`.${m.domain}`)
    )

    if (!mapping) continue

    const existing = byServiceId.get(mapping.id)
    if (existing) {
      existing.detectedCount += count
      if (!existing.sampleSenders.includes(domain)) {
        existing.sampleSenders.push(domain)
      }
      continue
    }

    byServiceId.set(mapping.id, {
      serviceId: mapping.id,
      serviceName: mapping.serviceName,
      domain: mapping.domain,
      category: mapping.category,
      detectedCount: count,
      sampleSenders: [domain],
      suggestedAlternativeId: mapping.suggestedAlternativeId,
    })
  }

  return Array.from(byServiceId.values()).sort(
    (a, b) => b.detectedCount - a.detectedCount
  )
}

export function toDetectedAccounts(matched: MatchedScanResult[]): DetectedAccount[] {
  return matched.map((result) => ({
    id: result.serviceId,
    domain: result.domain,
    serviceName: result.serviceName,
    status: 'detected',
    suggestedAlternativeId: result.suggestedAlternativeId,
  }))
}

export async function callScanEmail(
  accessToken: string,
  provider: InboxProvider,
  maxResults = 500
): Promise<ScanEmailResponse> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const functionUrl = `${supabaseUrl}/functions/v1/scan-email`

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({
      accessToken,
      provider,
      maxResults,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message =
      typeof errorBody.error === 'string'
        ? errorBody.error
        : `Scan failed (${response.status})`
    throw new Error(message)
  }

  return response.json() as Promise<ScanEmailResponse>
}

export async function runInboxScan(
  accessToken: string,
  provider: InboxProvider,
  options?: {
    maxResults?: number
    onProgress?: (percent: number, step: string) => void
  }
): Promise<{
  matched: MatchedScanResult[]
  scannedCount: number
  provider: InboxProvider
}> {
  const onProgress = options?.onProgress
  const maxResults = options?.maxResults ?? 500

  onProgress?.(15, 'Connecting to your inbox securely...')
  onProgress?.(40, 'Reading sender metadata (no email bodies)...')

  const scanResult = await callScanEmail(accessToken, provider, maxResults)

  onProgress?.(80, 'Matching services against our catalog...')
  const matched = matchDomainsToResults(scanResult.senderCounts)
  onProgress?.(100, 'Scan complete.')

  return {
    matched,
    scannedCount: scanResult.scannedCount,
    provider: scanResult.provider,
  }
}

export function saveGuestScanResults(payload: GuestScanPayload): void {
  sessionStorage.setItem(GUEST_SCAN_STORAGE_KEY, JSON.stringify(payload))
}

export function loadGuestScanResults(): GuestScanPayload | null {
  const raw = sessionStorage.getItem(GUEST_SCAN_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as GuestScanPayload
  } catch {
    return null
  }
}

export function clearGuestScanResults(): void {
  sessionStorage.removeItem(GUEST_SCAN_STORAGE_KEY)
}

export function clearEmailSessionTokens(): void {
  sessionStorage.removeItem('email_access_token')
  sessionStorage.removeItem('email_provider')
  sessionStorage.removeItem('email_token_expires')
}
