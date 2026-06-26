import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/db'
import { AFFILIATE_LINKS } from '@digitaleu/shared'
import { loadGuestScanResults } from '@/lib/inboxScan'
import { enrichMatchedResults } from '@/lib/scan'
import type { EnrichedScanResult } from '@/lib/scan'
import { ProgressTracker } from './ActionCard'
import { GdprGenerator } from './GdprGenerator'
import { loadProgress, saveProgress, type Progress, type ProgressEntry } from './types'

function ToolkitTeaser({ checkoutUrl }: { checkoutUrl: string }) {
  const features = [
    ['Action Cards', 'Step-by-step migration guide for every detected service'],
    ['Progress Tracker', 'Tick off services as you migrate'],
    ['GDPR Generator', 'Ready-to-send erasure letters for Big Tech'],
  ]

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">
          Migration Toolkit
        </p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Your personal migration plan</h1>
        <p className="text-slate-400 mt-2 max-w-xl">
          The scanner showed you the scale of the problem. The Toolkit gives you everything to act on it.
        </p>
      </div>

      <div className="relative">
        <div className="grid gap-4 md:grid-cols-2 opacity-40 pointer-events-none select-none blur-sm">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-5 space-y-3 h-40">
              <div className="h-4 bg-[#2d4a6e] rounded w-3/4" />
              <div className="h-3 bg-[#2d4a6e] rounded w-1/2" />
              <div className="h-1 bg-[#2d4a6e] rounded-full w-full mt-4" />
              <div className="h-3 bg-[#2d4a6e] rounded w-2/3" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg border border-emerald-500/40 bg-[#0d1117]/90 backdrop-blur-sm p-8 text-center max-w-sm space-y-5">
            <div className="text-4xl">🔒</div>
            <div>
              <p className="text-lg font-bold text-white">Unlock the Migration Toolkit</p>
              <p className="text-sm text-slate-400 mt-1">One-time payment. No subscription.</p>
            </div>
            <ul className="space-y-2 text-left">
              {features.map(([title, desc]) => (
                <li key={title} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-emerald-400 flex-shrink-0">✓</span>
                  <span>
                    <span className="font-semibold text-white">{title}</span> — {desc}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={checkoutUrl}
              className="block w-full rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-white text-center hover:bg-emerald-600 transition-colors"
            >
              Unlock for €5
            </a>
            <p className="text-xs text-slate-500">Secure payment via Stripe. GDPR-compliant.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ToolkitPage() {
  const [loading, setLoading] = useState(true)
  const [entitled, setEntitled] = useState(false)
  const [results, setResults] = useState<EnrichedScanResult[]>([])
  const [progress, setProgress] = useState<Progress>(loadProgress())
  const [activeTab, setActiveTab] = useState<'actions' | 'gdpr'>('actions')

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: ent } = await supabase
          .from('entitlements')
          .select('access_type')
          .eq('user_id', user.id)
          .eq('access_type', 'paid')
          .maybeSingle()
        setEntitled(!!ent)
      }

      const guestScan = loadGuestScanResults()
      if (guestScan?.matched?.length) {
        setResults(enrichMatchedResults(guestScan.matched))
      }

      setLoading(false)
    }
    init()
  }, [])

  const handleProgressChange = (id: string, entry: ProgressEntry) => {
    const next = { ...progress, [id]: entry }
    setProgress(next)
    saveProgress(next)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-mono text-slate-400">Loading toolkit...</p>
        </div>
      </div>
    )
  }

  const checkoutUrl = '/scanner/auth/signin?next=/scanner/toolkit'

  if (!entitled) {
    return <ToolkitTeaser checkoutUrl={checkoutUrl} />
  }

  const hasResults = results.length > 0

  return (
    <div className="space-y-12">
      <div className="border-b border-[#2d4a6e] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">
          Migration Toolkit — Unlocked
        </p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Your migration plan</h1>
        {!hasResults && (
          <p className="text-sm text-amber-400 mt-2">
            No scan results in this session.{' '}
            <Link to="/scanner" className="underline hover:text-amber-300">
              Run a scan
            </Link>{' '}
            to populate your Action Cards.
          </p>
        )}
      </div>

      <div className="flex gap-1 border-b border-[#2d4a6e]">
        {(['actions', 'gdpr'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'actions' ? 'Action Cards & Progress' : 'GDPR Generator'}
          </button>
        ))}
      </div>

      {activeTab === 'actions' &&
        (hasResults ? (
          <ProgressTracker results={results} progress={progress} onProgressChange={handleProgressChange} />
        ) : (
          <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-8 text-center space-y-4">
            <p className="text-slate-400">
              Run an inbox scan first so we can generate Action Cards for your detected services.
            </p>
            <Link
              to="/scanner"
              className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition-colors"
            >
              Scan my inbox
            </Link>
          </div>
        ))}

      {activeTab === 'gdpr' && <GdprGenerator results={hasResults ? results : []} />}

      <section className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Recommended European alternatives</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Editorial picks — we only recommend services we would use ourselves.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {(
            [
              ['proton-mail', 'Proton Mail', 'Encrypted email'],
              ['proton-drive', 'Proton Drive', 'Zero-knowledge storage'],
              ['proton-vpn', 'Proton VPN', 'Privacy-first VPN'],
              ['pcloud', 'pCloud', 'European cloud storage'],
            ] as const
          ).map(([id, name, desc]) => {
            const link = AFFILIATE_LINKS[id]
            if (!link) return null
            return (
              <a
                key={id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#2d4a6e] bg-[#0f2040] p-4 hover:border-emerald-500/40 transition-colors"
              >
                <p className="font-semibold text-sm text-white">{name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </a>
            )
          })}
        </div>
        <p className="text-xs text-slate-600">
          Links may earn us a small commission if you sign up — at no extra cost to you.
        </p>
      </section>
    </div>
  )
}
