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
          <div className="animate-spin h-8 w-8 border-4 border-green dark:border-green-dark border-t-transparent rounded-full mx-auto"></div>
          <p className="text-black/70 dark:text-slate-400">Loading guides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold mb-2 text-black dark:text-white">Cancellation guides</h1>
        <p className="text-black/70 dark:text-slate-400">Step-by-step instructions to cancel your subscriptions and switch to European alternatives.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <a
            key={guide.id}
            href={`/cancel/${guide.id}`}
            className="rounded-lg border border-black/10 dark:border-slate-700 bg-white dark:bg-navy-dark p-6 hover:shadow-lg dark:hover:shadow-lg dark:hover:shadow-slate-700/50 transition"
          >
            <h2 className="font-mono font-semibold text-lg mb-2 text-black dark:text-white">{guide.title}</h2>
            <p className="text-black/60 dark:text-slate-400 text-sm mb-4 line-clamp-2">{guide.description}</p>
            <div className="flex items-center justify-between">
              {guide.featured_eu_alternative && (
                <span className="text-xs font-mono text-[#2d3e2d] dark:text-[#6ba86b] bg-[#2d3e2d]/10 dark:bg-[#2d3e2d]/30 px-2 py-1 rounded">
                  → {guide.featured_eu_alternative}
                </span>
              )}
              <span className="text-green dark:text-green-dark font-mono text-sm">View guide →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

