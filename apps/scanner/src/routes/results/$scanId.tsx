import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getScanResults } from '@/lib/scan'
import { supabase } from '@/lib/db'

interface Service {
  id: string
  name: string
  category: string
  website_url: string
  logo_url: string
}

interface ScanResult {
  service_id: string
  detected_count: number
  confidence: number
  sample_senders: string[]
  service: Service
}

export default function ResultsPage() {
  const { scanId } = useParams<{ scanId: string }>()
  const [results, setResults] = useState<{ [key: string]: ScanResult[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadResults = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser || !scanId) {
        window.location.href = '/dashboard'
        return
      }

      setUser(currentUser)

      const { results: scanResults, error: resultsError } = await getScanResults(scanId, currentUser.id)

      if (resultsError || !scanResults) {
        setError(resultsError || 'Failed to load results')
        setLoading(false)
        return
      }

      setResults(scanResults.grouped)
      setLoading(false)
    }

    loadResults()
  }, [scanId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#c17a5c] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#1a2332]/70">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-lg border border-red-300 bg-red-50 p-6">
          <h2 className="mb-2 text-lg font-mono font-semibold text-red-900">Error loading results</h2>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <a href="/dashboard" className="inline-block text-sm text-[#c17a5c] hover:underline">
            Back to dashboard
          </a>
        </div>
      </div>
    )
  }

  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="rounded-lg border border-[#1a2332]/10 bg-white p-6 text-center">
          <h2 className="mb-2 text-lg font-mono font-semibold">No services detected</h2>
          <p className="text-[#1a2332]/70 mb-4">We didn't find any recognizable services in your inbox.</p>
          <a href="/dashboard" className="inline-block text-sm text-[#c17a5c] hover:underline">
            Back to dashboard
          </a>
        </div>
      </div>
    )
  }

  const categoryLabels: Record<string, string> = {
    email: '📧 Email Services',
    streaming: '🎬 Streaming',
    music: '🎵 Music',
    storage: '☁️ Cloud Storage',
    ai: '🤖 AI Tools',
    productivity: '📝 Productivity',
    communication: '💬 Communication',
    development: '👨‍💻 Development',
    ecommerce: '🛍️ E-commerce',
    creative: '🎨 Creative',
    design: '✏️ Design',
    other: '📦 Other',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold mb-2">Your digital footprint</h1>
        <p className="text-[#1a2332]/70">
          We found {Object.values(results).flat().length} services you're subscribed to. Here's how you can switch to European alternatives.
        </p>
      </div>

      {Object.entries(results).map(([category, services]) => (
        <section key={category} className="space-y-4">
          <h2 className="text-2xl font-mono font-semibold">{categoryLabels[category] || category}</h2>

          <div className="grid gap-4 md:grid-cols-2">
            {services.map((result) => (
              <div key={result.service_id} className="rounded-lg border border-[#1a2332]/10 bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-mono font-semibold text-lg">{result.service?.name}</h3>
                    <p className="text-sm text-[#1a2332]/60 mt-1">
                      Detected from {result.sample_senders?.length || 1} sender{result.sample_senders?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block rounded-full bg-[#c17a5c]/10 px-3 py-1">
                      <span className="text-sm font-mono font-semibold text-[#c17a5c]">
                        {Math.round((result.confidence || 0.9) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={result.service?.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-[#1a2332]/60 hover:text-[#1a2332] truncate"
                  >
                    {result.service?.website_url}
                  </a>

                  <a
                    href={`/cancel/${result.service_id}`}
                    className="inline-block rounded bg-[#2d3e2d]/10 px-3 py-2 text-sm font-mono font-semibold text-[#2d3e2d] hover:bg-[#2d3e2d]/20 transition"
                  >
                    How to cancel →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="rounded-lg border border-[#1a2332]/10 bg-[#f9f7f2] p-6">
        <h3 className="font-mono font-semibold mb-3">Next steps</h3>
        <ol className="space-y-2 text-[#1a2332]/70">
          <li className="flex gap-3">
            <span className="font-mono font-bold text-[#c17a5c]">1</span>
            <span>Review the European alternatives for each service.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-[#c17a5c]">2</span>
            <span>Follow the cancellation guides to migrate your data.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono font-bold text-[#c17a5c]">3</span>
            <span>Update your email subscriptions to your new European service.</span>
          </li>
        </ol>
      </div>

      <div className="flex gap-4 justify-center">
        <a href="/dashboard" className="px-6 py-2 rounded border border-[#1a2332]/20 font-mono font-semibold hover:bg-[#1a2332]/5 transition">
          Back to dashboard
        </a>
        <button className="px-6 py-2 rounded bg-[#c17a5c] font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 transition">
          Export results
        </button>
      </div>
    </div>
  )
}
