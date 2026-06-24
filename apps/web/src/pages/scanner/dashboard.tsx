import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/db'
import { initializeGmailScan } from '@/lib/scan'
import { getProtonAffiliateLink } from '@/lib/stripe'

interface Scan {
  id: string
  scan_status: string
  created_at: string
  completed_at: string | null
  sample_size?: number
}

interface MailboxConnection {
  id: string
  provider: 'gmail' | 'outlook' | string
  connected_at: string
}

interface PaymentRecord {
  status: string
  amount_cents: number
  created_at: string
  completed_at: string | null
}

interface EntitlementRecord {
  access_type: 'paid' | 'affiliate'
  created_at: string
}

interface ScannerMetadata {
  scanner_access_type: 'free_proton' | 'paid_stripe' | null
  gmail_verified: boolean
  gmail_address: string | null
}

type AccessState = {
  label: string
  detail: string
  tone: 'ok' | 'pending' | 'neutral'
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

export default function DashboardPage() {
  const billingDataEnabled = import.meta.env.VITE_SCANNER_DASHBOARD_BILLING === 'true'

  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [connections, setConnections] = useState<MailboxConnection[]>([])
  const [scans, setScans] = useState<Scan[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [entitlement, setEntitlement] = useState<EntitlementRecord | null>(null)
  const [scannerMetadata, setScannerMetadata] = useState<ScannerMetadata | null>(null)
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        window.location.href = '/auth/signin'
        return
      }

      setUser(currentUser)

      const [connectionsRes, scansRes] = await Promise.all([
        supabase
          .from('mailbox_connections')
          .select('id, provider, connected_at')
          .eq('user_id', currentUser.id)
          .is('revoked_at', null),
        supabase
          .from('scans')
          .select('id, scan_status, created_at, completed_at, sample_size')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(3),
      ])

      let paymentsData: PaymentRecord[] = []
      let entitlementData: EntitlementRecord | null = null
      let scannerMetadataData: ScannerMetadata | null = null

      if (billingDataEnabled) {
        const [paymentsRes, entitlementRes, metadataRes] = await Promise.all([
          supabase
            .from('scanner_payments')
            .select('status, amount_cents, created_at, completed_at')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('entitlements')
            .select('access_type, created_at')
            .eq('user_id', currentUser.id)
            .maybeSingle(),
          supabase
            .from('user_scanner_metadata')
            .select('scanner_access_type, gmail_verified, gmail_address')
            .eq('user_id', currentUser.id)
            .maybeSingle(),
        ])

        paymentsData = (paymentsRes.data as PaymentRecord[]) || []
        entitlementData = (entitlementRes.data as EntitlementRecord) || null
        scannerMetadataData = (metadataRes.data as ScannerMetadata) || null
      }

      setConnections((connectionsRes.data as MailboxConnection[]) || [])
      setScans((scansRes.data as Scan[]) || [])
      setPayments(paymentsData)
      setEntitlement(entitlementData)
      setScannerMetadata(scannerMetadataData)

      try {
        const authWithMfa = supabase.auth as any
        if (authWithMfa?.mfa?.getAuthenticatorAssuranceLevel) {
          const { data } = await authWithMfa.mfa.getAuthenticatorAssuranceLevel()
          setMfaEnabled(data?.currentLevel === 'aal2' || data?.nextLevel === 'aal2')
        }
      } catch {
        setMfaEnabled(false)
      }

      setLoading(false)
    }

    loadDashboard()
  }, [])

  const accessState = useMemo<AccessState>(() => {
    if (entitlement?.access_type === 'paid' || scannerMetadata?.scanner_access_type === 'paid_stripe') {
      return {
        label: 'Unlocked via payment',
        detail: 'Your scanner features are active.',
        tone: 'ok',
      }
    }

    if (entitlement?.access_type === 'affiliate' || scannerMetadata?.scanner_access_type === 'free_proton') {
      return {
        label: 'Unlocked via Proton',
        detail: 'Free scanner access is active on your account.',
        tone: 'ok',
      }
    }

    if (payments.some((p) => p.status === 'pending')) {
      return {
        label: 'Payment pending',
        detail: 'We are still confirming your latest payment.',
        tone: 'pending',
      }
    }

    return {
      label: 'Not unlocked yet',
      detail: 'You can still run manual checks while unlock is pending.',
      tone: 'neutral',
    }
  }, [entitlement, scannerMetadata, payments])

  const handleStartScan = async () => {
    setActionError(null)
    if (!user || connections.length === 0) {
      setActionError('Connect Gmail or Outlook first, then run your scan.')
      return
    }

    setScanning(true)
    const primaryConnection = connections[0]!
    const { scanId, error } = await initializeGmailScan(primaryConnection.id, user.id)
    setScanning(false)

    if (error || !scanId) {
      setActionError(error || 'Unable to start scan right now.')
      return
    }

    window.location.href = `/results/${scanId}`
  }

  const handleDeleteAccount = async () => {
    setActionError(null)
    const confirmation = window.prompt('Type DELETE to permanently remove your account and scanner data.')
    if (confirmation !== 'DELETE') {
      return
    }

    setDeletingAccount(true)

    const { error } = await supabase.functions.invoke('delete-account', {
      body: { confirmation: 'DELETE' },
    })

    if (error) {
      setActionError(
        'Account deletion is not available yet in this environment. Contact support@digitaleu.me and we will delete your account manually.'
      )
      setDeletingAccount(false)
      return
    }

    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-14">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#c17a5c] dark:border-[#a86650] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#1a2332]/70 dark:text-[#a89d96] font-mono">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-mono font-bold text-[#1a2332] dark:text-[#f5f1ea]">Scanner dashboard</h1>
          <p className="text-sm text-[#1a2332]/70 dark:text-[#a89d96]">
            Signed in as {user?.email}
          </p>
        </div>
      </section>

      {actionError && (
        <div className="rounded-none border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
          {actionError}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Connected inboxes</h2>
          {connections.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-[#1a2332]/70 dark:text-[#a89d96]">No mailbox connected yet.</p>
              <a
                href="/auth/signin"
                className="inline-flex rounded-none border border-[#1a2332] bg-[#1a2332] px-4 py-2 font-mono text-sm font-semibold text-[#f9f7f2] hover:bg-[#2a241d] transition"
              >
                Connect Gmail or Outlook
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {connections.map((conn) => (
                <div key={conn.id} className="flex items-center justify-between rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] p-3">
                  <p className="font-mono text-sm text-[#1a2332] dark:text-[#f5f1ea]">
                    {conn.provider === 'gmail' ? 'Gmail' : 'Outlook'} connected
                  </p>
                  <span className="text-xs text-[#1a2332]/60 dark:text-[#a89d96]">{formatDate(conn.connected_at)}</span>
                </div>
              ))}
            </div>
          )}

          {scannerMetadata?.gmail_verified && scannerMetadata.gmail_address && (
            <p className="text-xs text-[#1a2332]/70 dark:text-[#a89d96]">
              Verified Gmail: {scannerMetadata.gmail_address}
            </p>
          )}
        </div>

        <div className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Access status</h2>
          <div
            className={`rounded-none border p-3 ${
              accessState.tone === 'ok'
                ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/20'
                : accessState.tone === 'pending'
                  ? 'border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20'
                  : 'border-[#1a2332]/10 bg-[#f9f7f2] dark:border-[#3a3530] dark:bg-[#1f1b16]'
            }`}
          >
            <p className="font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">{accessState.label}</p>
            <p className="mt-1 text-sm text-[#1a2332]/70 dark:text-[#a89d96]">{accessState.detail}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={getProtonAffiliateLink('mail')}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-none border border-[#1a2332] bg-[#1a2332] px-4 py-2 font-mono text-sm font-semibold text-[#f9f7f2] hover:bg-[#2a241d] transition"
            >
              Unlock options
            </a>
            <a
              href="/#manual-check"
              className="rounded-none border border-[#1a2332]/20 dark:border-[#3a3530] px-4 py-2 font-mono text-sm font-semibold text-[#1a2332] dark:text-[#f5f1ea] hover:bg-[#1a2332]/5 dark:hover:bg-[#f5f1ea]/10 transition"
            >
              Manual report
            </a>
          </div>
        </div>
      </section>

      <section className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-6 space-y-4">
        <h2 className="text-lg font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartScan}
            disabled={scanning}
            className="rounded-none border border-[#1a2332] bg-[#1a2332] px-4 py-2 font-mono text-sm font-semibold text-[#f9f7f2] hover:bg-[#2a241d] disabled:opacity-50 transition"
          >
            {scanning ? 'Scanning…' : 'Start new scan'}
          </button>
          <a
            href="/#manual-check"
            className="rounded-none border border-[#1a2332]/20 dark:border-[#3a3530] px-4 py-2 font-mono text-sm font-semibold text-[#1a2332] dark:text-[#f5f1ea] hover:bg-[#1a2332]/5 dark:hover:bg-[#f5f1ea]/10 transition"
          >
            Open manual checker
          </a>
          <a
            href="/cancel"
            className="rounded-none border border-[#1a2332]/20 dark:border-[#3a3530] px-4 py-2 font-mono text-sm font-semibold text-[#1a2332] dark:text-[#f5f1ea] hover:bg-[#1a2332]/5 dark:hover:bg-[#f5f1ea]/10 transition"
          >
            Cancellation guides
          </a>
        </div>
      </section>

      <section className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-6 space-y-4">
        <h2 className="text-lg font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Recent scans</h2>
        {scans.length === 0 ? (
          <p className="text-sm text-[#1a2332]/70 dark:text-[#a89d96]">No scans yet. Connect your inbox and run your first scan.</p>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div key={scan.id} className="flex flex-col gap-3 rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">
                    {scan.scan_status === 'complete' ? 'Scan complete' : `Status: ${scan.scan_status}`}
                  </p>
                  <p className="text-xs text-[#1a2332]/60 dark:text-[#a89d96]">Started {formatDate(scan.created_at)}</p>
                </div>
                <a
                  href={`/results/${scan.id}`}
                  className="text-sm font-mono font-semibold text-[#c17a5c] dark:text-[#a86650] hover:underline"
                >
                  View results →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Security</h2>
          <div className="rounded-none border border-[#1a2332]/10 dark:border-[#3a3530] p-3">
            <p className="font-mono text-sm text-[#1a2332] dark:text-[#f5f1ea]">2FA (TOTP)</p>
            <p className="mt-1 text-xs text-[#1a2332]/70 dark:text-[#a89d96]">
              {mfaEnabled
                ? 'Enabled for this account.'
                : 'Not enabled yet. Add authenticator-based 2FA for stronger sign-in protection.'}
            </p>
          </div>
          <a
            href="/auth/signin"
            className="inline-flex rounded-none border border-[#1a2332]/20 dark:border-[#3a3530] px-4 py-2 font-mono text-sm font-semibold text-[#1a2332] dark:text-[#f5f1ea] hover:bg-[#1a2332]/5 dark:hover:bg-[#f5f1ea]/10 transition"
          >
            Open 2FA setup
          </a>
        </div>

        <div className="rounded-none border border-red-300 dark:border-red-900 bg-white dark:bg-[#2a251f] p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-red-700 dark:text-red-400">Delete account</h2>
          <p className="text-sm text-[#1a2332]/70 dark:text-[#a89d96]">
            This removes your dashboard account and scanner history. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="rounded-none border border-red-700 bg-red-700 px-4 py-2 font-mono text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60 transition"
          >
            {deletingAccount ? 'Deleting…' : 'Delete my account'}
          </button>
        </div>
      </section>
    </div>
  )
}

