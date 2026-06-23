import { useEffect, useState } from 'react'
import { getCancellationGuides } from '@/lib/scan'
import type { CancellationGuide } from '@/lib/scan'

export default function CancellationIndexPage() {
  const [guides, setGuides] = useState<CancellationGuide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGuides = async () => {
      const { guides: data } = await getCancellationGuides()
      setGuides(data || [])
      setLoading(false)
    }

    loadGuides()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#c17a5c] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#1a2332]/70">Loading guides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold mb-2">Cancellation guides</h1>
        <p className="text-[#1a2332]/70">Step-by-step instructions to cancel your subscriptions and switch to European alternatives.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <a
            key={guide.id}
            href={`/cancel/${guide.id}`}
            className="rounded-lg border border-[#1a2332]/10 bg-white p-6 hover:shadow-lg transition"
          >
            <h2 className="font-mono font-semibold text-lg mb-2">{guide.title}</h2>
            <p className="text-[#1a2332]/60 text-sm mb-4 line-clamp-2">{guide.description}</p>
            <div className="flex items-center justify-between">
              {guide.featured_eu_alternative && (
                <span className="text-xs font-mono text-[#2d3e2d] bg-[#2d3e2d]/10 px-2 py-1 rounded">
                  → {guide.featured_eu_alternative}
                </span>
              )}
              <span className="text-[#c17a5c] font-mono text-sm">View guide →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
