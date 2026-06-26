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
  const senderCounts: Record<string, number> = {}
  let scannedCount = 0

  const extractDomain = (email: string) => {
    const match = email.match(/@([\w.-]+\.[a-zA-Z]{2,})/)
    return match ? match[1].toLowerCase() : null
  }

  if (provider === 'outlook') {
    let url = `https://graph.microsoft.com/v1.0/me/messages?$select=sender&$top=100`
    while (url && scannedCount < maxResults) {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || '2'
        await new Promise((resolve) => setTimeout(resolve, parseInt(retryAfter) * 1000))
        continue
      }

      if (!response.ok) {
        throw new Error(`Outlook API error: ${response.statusText}`)
      }

      const data = await response.json()
      for (const msg of data.value || []) {
        if (scannedCount >= maxResults) break
        const email = msg.sender?.emailAddress?.address
        if (email) {
          const domain = extractDomain(email)
          if (domain) {
            senderCounts[domain] = (senderCounts[domain] || 0) + 1
          }
        }
        scannedCount++
      }
      url = data['@odata.nextLink'] || null
    }
  } else if (provider === 'gmail') {
    // 1. Fetch message IDs
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`
    const listRes = await fetch(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    
    if (!listRes.ok) {
      throw new Error(`Gmail API error: ${listRes.statusText}`)
    }
    
    const listData = await listRes.json()
    const messages = listData.messages || []
    
    // 2. Batch requests in chunks of 100
    const chunkSize = 100
    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize)
      
      const boundary = 'batch_boundary'
      let body = ''
      
      chunk.forEach((msg: any, index: number) => {
        body += `--${boundary}\r\n`
        body += 'Content-Type: application/http\r\n'
        body += `Content-ID: <item${index}>\r\n\r\n`
        body += `GET /gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From HTTP/1.1\r\n\r\n`
      })
      body += `--${boundary}--\r\n`

      const batchRes = await fetch('https://gmail.googleapis.com/batch/gmail/v1', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/mixed; boundary=${boundary}`,
        },
        body,
      })

      if (!batchRes.ok) {
        throw new Error(`Gmail Batch API error: ${batchRes.statusText}`)
      }

      const batchText = await batchRes.text()
      
      // Extremely simple multipart parser for metadata extraction
      const parts = batchText.split('--batch_')
      for (const part of parts) {
        if (!part.includes('HTTP/1.1 200 OK')) continue
        
        // Find the JSON payload
        const jsonMatch = part.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const msgData = JSON.parse(jsonMatch[0])
            const headers = msgData.payload?.headers || []
            const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')
            if (fromHeader && fromHeader.value) {
              const domain = extractDomain(fromHeader.value)
              if (domain) {
                senderCounts[domain] = (senderCounts[domain] || 0) + 1
              }
            }
            scannedCount++
          } catch (e) {
            // Ignore parsing errors for individual messages
          }
        }
      }
    }
  }

  return {
    senders: Object.keys(senderCounts),
    senderCounts,
    count: Object.keys(senderCounts).length,
    scannedCount,
    provider,
  }
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
