import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/db'
import { ScanResultsView } from '@/components/scanner/ScanResultsView'
import {
  loadGuestScanResults,
  saveGuestScanResults,
  clearEmailSessionTokens,
  matchDomainsToResults,
  type GuestScanPayload,
  type InboxProvider,
  type MatchedScanResult
} from '@/lib/inboxScan'
import { enrichMatchedResults, groupResultsByCategory } from '@/lib/scan'

export default function GuestResultsPage() {
  const navigate = useNavigate()
  const [payload, setPayload] = useState<GuestScanPayload | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState('')
  const [matchedResults, setMatchedResults] = useState<MatchedScanResult[]>([])
  const [scannedCount, setScannedCount] = useState(0)
  const [toolkitUnlocked, setToolkitUnlocked] = useState(false)
  const providerLabel = payload?.provider === 'gmail' ? 'Gmail' : payload?.provider === 'outlook' ? 'Outlook' : 'Email'

  const hasStartedScan = useRef(false)

  useEffect(() => {
    // Check toolkit entitlement if user is signed in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('entitlements')
        .select('access_type')
        .eq('user_id', user.id)
        .eq('access_type', 'paid')
        .maybeSingle()
        .then(({ data }) => setToolkitUnlocked(!!data))
    })
  }, [])

  useEffect(() => {
    // Check for existing results first
    const guestScan = loadGuestScanResults()
    if (guestScan) {
      setPayload(guestScan)
      setMatchedResults(guestScan.matched)
      setScannedCount(guestScan.scannedCount)
      return
    }

    // Check if we have an active token to scan with
    const token = sessionStorage.getItem('email_access_token')
    const provider = sessionStorage.getItem('email_provider') as InboxProvider | null

    if (!token || !provider) {
      navigate('/scanner', { replace: true })
      return
    }

    if (hasStartedScan.current) return
    hasStartedScan.current = true

    // Start progressive scan
    const runProgressiveScan = async () => {
      setScanning(true)
      setScanStatus('Reading initial messages...')
      
      try {
        const senderCounts: Record<string, number> = {}
        let totalScanned = 0
        const maxResults = 500

        const extractDomain = (email: string) => {
          const match = email.match(/@([\w.-]+\.[a-zA-Z]{2,})/)
          return match ? match[1].toLowerCase() : null
        }

        if (provider === 'outlook') {
          let url = `https://graph.microsoft.com/v1.0/me/messages?$select=sender&$top=100`
          while (url && totalScanned < maxResults) {
            setScanStatus(`Scanning messages (${totalScanned}/${maxResults})...`)
            const response = await fetch(url, {
              headers: { Authorization: `Bearer ${token}` },
            })

            if (response.status === 429) {
              const retryAfter = response.headers.get('Retry-After') || '2'
              await new Promise((resolve) => setTimeout(resolve, parseInt(retryAfter) * 1000))
              continue
            }

            if (!response.ok) throw new Error(`Outlook API error: ${response.statusText}`)

            const data = await response.json()
            for (const msg of data.value || []) {
              if (totalScanned >= maxResults) break
              const email = msg.sender?.emailAddress?.address
              if (email) {
                const domain = extractDomain(email)
                if (domain) {
                  senderCounts[domain] = (senderCounts[domain] || 0) + 1
                }
              }
              totalScanned++
            }
            
            // Update UI incrementally
            const currentMatches = matchDomainsToResults(senderCounts)
            setMatchedResults(currentMatches)
            setScannedCount(totalScanned)
            
            url = data['@odata.nextLink'] || null
          }
        } else if (provider === 'gmail') {
          setScanStatus('Fetching message list...')
          const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`
          const listRes = await fetch(listUrl, { headers: { Authorization: `Bearer ${token}` } })
          if (!listRes.ok) throw new Error(`Gmail API error`)
          
          const listData = await listRes.json()
          const messages = listData.messages || []
          
          const chunkSize = 100
          for (let i = 0; i < messages.length; i += chunkSize) {
            setScanStatus(`Scanning messages (${totalScanned}/${messages.length})...`)
            const chunk = messages.slice(i, i + chunkSize)
            const boundary = 'batch_boundary'
            let body = ''
            
            chunk.forEach((msg: any, index: number) => {
              body += `--${boundary}\r\nContent-Type: application/http\r\nContent-ID: <item${index}>\r\n\r\n`
              body += `GET /gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From HTTP/1.1\r\n\r\n`
            })
            body += `--${boundary}--\r\n`

            const batchRes = await fetch('https://gmail.googleapis.com/batch/gmail/v1', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': `multipart/mixed; boundary=${boundary}`,
              },
              body,
            })

            if (!batchRes.ok) throw new Error(`Gmail Batch API error`)
            const batchText = await batchRes.text()
            
            const parts = batchText.split('--batch_')
            for (const part of parts) {
              if (!part.includes('HTTP/1.1 200 OK')) continue
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
                  totalScanned++
                } catch (e) {}
              }
            }

            // Update UI incrementally
            const currentMatches = matchDomainsToResults(senderCounts)
            setMatchedResults(currentMatches)
            setScannedCount(totalScanned)
          }
        }

        // Done
        setScanning(false)
        setScanStatus('Scan complete!')
        const finalMatches = matchDomainsToResults(senderCounts)
        const finalPayload: GuestScanPayload = {
          provider,
          scannedCount: totalScanned,
          matched: finalMatches,
          createdAt: Date.now()
        }
        setPayload(finalPayload)
        saveGuestScanResults(finalPayload)
        clearEmailSessionTokens()

      } catch (err) {
        console.error('Progressive scan failed:', err)
        setScanStatus('Scan failed.')
        setScanning(false)
      }
    }

    runProgressiveScan()
  }, [navigate])

  if (!payload && !scanning) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary dark:text-dark-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  const enriched = enrichMatchedResults(matchedResults)
  const grouped = groupResultsByCategory(enriched)

  return (
    <div className="space-y-4">
      {scanning && (
        <div className="rounded-sm border border-accent/20 bg-accent/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full"></div>
            <p className="text-sm font-mono text-accent">{scanStatus}</p>
          </div>
          <p className="text-xs font-mono text-text-secondary dark:text-dark-text-secondary">
            {scannedCount} emails scanned
          </p>
        </div>
      )}

      {enriched.length === 0 && !scanning ? (
        <div className="mx-auto max-w-2xl space-y-4 mt-8">
          <div className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6 text-center">
            <h2 className="mb-2 text-lg font-mono font-semibold text-text-primary dark:text-dark-text-primary">
              No services detected
            </h2>
            <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
              We scanned your inbox but didn&apos;t find recognizable services in our catalog.
            </p>
            <a href="/scanner" className="inline-block text-sm text-accent hover:underline">
              Back to scanner
            </a>
          </div>
        </div>
      ) : (
        <ScanResultsView
          grouped={grouped}
          scannedCount={scannedCount}
          providerLabel={providerLabel}
          backHref="/scanner"
          backLabel="Back to scanner"
          toolkitUnlocked={toolkitUnlocked}
        />
      )}
    </div>
  )
}
