import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getScanResults } from '@/lib/scan'
import { supabase } from '@/lib/db'
import { ScanResultsView } from '@/components/scanner/ScanResultsView'

export default function ResultsPage() {
  const { scanId } = useParams<{ scanId: string }>()
  const [grouped, setGrouped] = useState<Record<string, import('@/lib/scan').EnrichedScanResult[]> | null>(null)
  const [scannedCount, setScannedCount] = useState<number | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser || !scanId) {
        window.location.href = '/scanner/dashboard'
        return
      }

      const { results: scanResults, error: resultsError } = await getScanResults(
        scanId,
        currentUser.id
      )

      if (resultsError || !scanResults) {
        setError(resultsError || 'Failed to load results')
        setLoading(false)
        return
      }

      setGrouped(scanResults.grouped)
      setScannedCount(scanResults.scan.sample_size)
      setLoading(false)
    }

    loadResults()
  }, [scanId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary dark:text-dark-text-secondary">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-sm border border-error/30 bg-error/10 p-6">
          <h2 className="mb-2 text-lg font-mono font-semibold text-error">Error loading results</h2>
          <p className="text-sm text-error/80 mb-4">{error}</p>
          <a href="/scanner/dashboard" className="inline-block text-sm text-accent hover:underline">
            Back to dashboard
          </a>
        </div>
      </div>
    )
  }

  if (!grouped || Object.keys(grouped).length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-sm border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6 text-center">
          <h2 className="mb-2 text-lg font-mono font-semibold text-text-primary dark:text-dark-text-primary">
            No services detected
          </h2>
          <p className="text-text-secondary dark:text-dark-text-secondary mb-4">
            We didn&apos;t find any recognizable services in your inbox.
          </p>
          <a href="/scanner/dashboard" className="inline-block text-sm text-accent hover:underline">
            Back to dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <ScanResultsView
      grouped={grouped}
      scannedCount={scannedCount}
      backHref="/scanner/dashboard"
      showExport
    />
  )
}
