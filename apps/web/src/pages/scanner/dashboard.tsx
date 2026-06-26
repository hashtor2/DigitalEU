import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/db'

interface Scan {
  id: string
  scan_status: string
  created_at: string
  completed_at: string | null
  sample_size?: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${active ? 'bg-emerald-500' : 'bg-slate-500'}`}
    />
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [scans, setScans] = useState<Scan[]>([])
  const [toolkitUnlocked, setToolkitUnlocked] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deletingAccount, setDeletingAccount] = useState(false)

  // LMO architecture: read ephemeral token from sessionStorage (never stored server-side)
  const emailToken = sessionStorage.getItem('email_access_token')
  const emailProvider = sessionStorage.getItem('email_provider') as 'gmail' | 'outlook' | null
  const hasActiveToken = !!emailToken && !!emailProvider

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        window.location.href = '/scanner/auth/signin'
        return
      }

      setUser(currentUser)

      // Check toolkit entitlement
      const { data: ent } = await supabase
        .from('entitlements')
        .select('access_type')
        .eq('user_id', currentUser.id)
        .eq('access_type', 'paid')
        .maybeSingle()
      setToolkitUnlocked(!!ent)

      // Only fetch scan history metadata — no tokens, no inbox data stored server-side
      const { data: scansData } = await supabase
        .from('scans')
        .select('id, scan_status, created_at, completed_at, sample_size')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setScans((scansData as Scan[]) || [])
      setLoading(false)
    }

    loadDashboard()
  }, [])

  const handleStartScan = () => {
    setActionError(null)
    if (!hasActiveToken) {
      setActionError('Connect Gmail or Outlook first to run a scan.')
      return
    }
    // LMO: navigate to progressive client-side scan page (sessionStorage token used there)
    navigate('/scanner/results/guest')
  }

  const handleDeleteAccount = async () => {
    setActionError(null)
    const confirmation = window.prompt(
      'Type DELETE to permanently remove your account and all scanner data.'
    )
    if (confirmation !== 'DELETE') return

    setDeletingAccount(true)

    const { error } = await supabase.functions.invoke('delete-account', {
      body: { confirmation: 'DELETE' },
    })

    if (error) {
      setActionError(
        'Account deletion failed. Contact support@digitaleu.me and we will delete your account manually.'
      )
      setDeletingAccount(false)
      return
    }

    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-mono text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="border-b border-[#2d4a6e] pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-1">
          Scanner Dashboard
        </p>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400 mt-1">Signed in as {user?.email}</p>
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {actionError}
        </div>
      )}

      {/* Primary action cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Inbox connection */}
        <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Inbox Connection</h2>
            <StatusDot active={hasActiveToken} />
          </div>

          {hasActiveToken ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <StatusDot active />
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    {emailProvider === 'gmail' ? 'Gmail' : 'Outlook'} connected
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Token active (session only — zero-knowledge)
                  </p>
                </div>
              </div>
              <button
                onClick={handleStartScan}
                className="w-full rounded-lg border border-emerald-500/40 bg-emerald-500 px-4 py-2.5 font-semibold text-white text-sm hover:bg-emerald-600 transition"
              >
                Start new scan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                No active inbox session. Connect Gmail or Outlook to start scanning.
              </p>
              <a
                href="/scanner/auth/signin"
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#2d4a6e] bg-[#0f2040] px-4 py-2.5 font-semibold text-sm text-slate-200 hover:border-emerald-500/50 hover:text-emerald-300 transition"
              >
                Connect Gmail or Outlook
              </a>
            </div>
          )}
        </div>

        {/* Migration Toolkit */}
        <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Migration Toolkit</h2>
            <span
              className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                toolkitUnlocked
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-700 text-slate-400 border border-slate-600'
              }`}
            >
              {toolkitUnlocked ? 'Unlocked' : 'Locked'}
            </span>
          </div>

          {toolkitUnlocked ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-sm font-semibold text-emerald-300">Toolkit active</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Action Cards, Progress Tracker, and GDPR Generator are available.
                </p>
              </div>
              <Link
                to="/scanner/toolkit"
                className="inline-flex items-center rounded-lg border border-emerald-500/40 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
              >
                Open Toolkit →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlock your personal migration plan: Action Cards, Progress Tracker, and GDPR erasure letters for every detected service.
              </p>
              <ul className="space-y-1 text-xs text-slate-400">
                {['Action Cards', 'Progress Tracker', 'GDPR Generator'].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-emerald-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/scanner/toolkit"
                className="inline-flex items-center rounded-lg border border-emerald-500/40 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition"
              >
                Unlock for €5
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartScan}
            disabled={!hasActiveToken}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Start new scan
          </button>
          <a
            href="/scanner/cancel"
            className="rounded-lg border border-[#2d4a6e] px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 transition"
          >
            Cancellation guides
          </a>
          <a
            href="/directory"
            className="rounded-lg border border-[#2d4a6e] px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 transition"
          >
            Browse EU alternatives
          </a>
        </div>
        {!hasActiveToken && (
          <p className="text-xs text-amber-400">
            Connect your inbox above to enable scanning.
          </p>
        )}
      </div>

      {/* Recent scans */}
      <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Recent scans</h2>
        {scans.length === 0 ? (
          <p className="text-sm text-slate-400">
            No scans yet. Connect your inbox and run your first scan above.
          </p>
        ) : (
          <div className="space-y-2">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="flex flex-col gap-3 rounded-lg border border-[#2d4a6e] bg-[#0f2040] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusDot active={scan.scan_status === 'complete'} />
                    <p className="font-semibold text-sm text-white">
                      {scan.scan_status === 'complete' ? 'Scan complete' : `Status: ${scan.scan_status}`}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 pl-4">
                    {formatDate(scan.created_at)}
                    {scan.sample_size ? ` · ${scan.sample_size} messages analyzed` : ''}
                  </p>
                </div>
                <a
                  href={`/scanner/results/${scan.id}`}
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  View results →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security & account */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[#2d4a6e] bg-[#1e293b] p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Security</h2>
          <div className="rounded-lg border border-[#2d4a6e] bg-[#0f2040] p-4 space-y-1">
            <p className="text-sm font-semibold text-white">Zero-knowledge architecture</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your inbox token is stored only in your browser session. We never see your emails.
            </p>
          </div>
          <a
            href="/privacy"
            className="inline-flex text-sm text-emerald-400 hover:text-emerald-300 transition underline underline-offset-2"
          >
            Read our privacy policy →
          </a>
        </div>

        <div className="rounded-lg border border-red-500/20 bg-[#1e293b] p-6 space-y-4">
          <h2 className="text-base font-semibold text-red-400">Delete account</h2>
          <p className="text-sm text-slate-400">
            Removes your dashboard account and all scan history. This cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-60 transition"
          >
            {deletingAccount ? 'Deleting...' : 'Delete my account'}
          </button>
        </div>
      </div>
    </div>
  )
}
