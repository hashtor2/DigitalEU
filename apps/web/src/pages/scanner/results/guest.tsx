import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanResultsView } from '@/components/scanner/ScanResultsView'
import {
  loadGuestScanResults,
  type GuestScanPayload,
} from '@/lib/inboxScan'
import { enrichMatchedResults, groupResultsByCategory } from '@/lib/scan'

export default function GuestResultsPage() {
  const navigate = useNavigate()
  const [payload, setPayload] = useState<GuestScanPayload | null>(null)

  useEffect(() => {
    const guestScan = loadGuestScanResults()
    if (!guestScan) {
      navigate('/scanner', { replace: true })
      return
    }
    setPayload(guestScan)
  }, [navigate])

  if (!payload) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary dark:text-dark-text-secondary">Loading your results...</p>
        </div>
      </div>
    )
  }

  const enriched = enrichMatchedResults(payload.matched)
  const grouped = groupResultsByCategory(enriched)
  const providerLabel = payload.provider === 'gmail' ? 'Gmail' : 'Outlook'

  if (enriched.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
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
    )
  }

  return (
    <ScanResultsView
      grouped={grouped}
      scannedCount={payload.scannedCount}
      providerLabel={providerLabel}
      backHref="/scanner"
      backLabel="Back to scanner"
    />
  )
}
