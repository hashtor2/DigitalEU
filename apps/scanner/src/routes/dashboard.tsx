import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/db'
import { getProtonAffiliateLink, redirectToCheckout, SCANNER_PRICE_EUR } from '@/lib/stripe'
import { mapDomainsToAlternativeIds, extractDetectedServices } from '@/lib/serviceMapping'

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
  const [inboxSession, setInboxSession] = useState<{ provider: string } | null>(null)
  const [gmailInput, setGmailInput] = useState('')
  const [unlocking, setUnlocking] = useState(false)

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

      // En aktiv innbokssesjon lever kun i sessionStorage (ephemeral token,
      // aldri lagret server-side). Speil den her slik at brukeren ser om de
      // kan kjøre en skanning uten å koble til på nytt.
      const sessionToken = sessionStorage.getItem('email_access_token')
      const sessionProvider = sessionStorage.getItem('email_provider')
      const sessionExpires = sessionStorage.getItem('email_token_expires')
      const sessionExpired = sessionExpires ? Date.now() > Number(sessionExpires) : false
      if (sessionToken && sessionProvider && !sessionExpired) {
        setInboxSession({ provider: sessionProvider })
      } else {
        setInboxSession(null)
      }

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
      setGmailInput(scannerMetadataData?.gmail_address || '')

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
    const granted =
      entitlement?.access_type === 'paid' ||
      entitlement?.access_type === 'affiliate' ||
      scannerMetadata?.scanner_access_type === 'paid_stripe' ||
      scannerMetadata?.scanner_access_type === 'free_proton'
    const verified = scannerMetadata?.gmail_verified === true

    if (granted && verified) {
      const viaPayment =
        entitlement?.access_type === 'paid' ||
        scannerMetadata?.scanner_access_type === 'paid_stripe'
      return {
        label: viaPayment ? 'Unlocked via payment' : 'Unlocked via Proton',
        detail: 'Scanning is active — connect your inbox and run a scan.',
        tone: 'ok',
      }
    }

    if (granted && !verified) {
      return {
        label: 'Payment confirmed — approval pending',
        detail:
          'We are approving your Gmail for scanning. You will get an email when it is ready (usually within a day).',
        tone: 'pending',
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
      detail: 'Unlock the scanner to run an automatic inbox scan.',
      tone: 'neutral',
    }
  }, [entitlement, scannerMetadata, payments])

  // Tilgang til automatisk skanning krever to ting:
  // 1) En aktiv entitlement (betalt eller affiliate), og
  // 2) at Gmail-en er manuelt godkjent (Google test-user-grense på
  //    gmail.metadata-scopet). Begge må være på plass for å skanne.
  const hasAccessGrant =
    entitlement?.access_type === 'paid' ||
    entitlement?.access_type === 'affiliate' ||
    scannerMetadata?.scanner_access_type === 'paid_stripe' ||
    scannerMetadata?.scanner_access_type === 'free_proton'
  const gmailApproved = scannerMetadata?.gmail_verified === true
  const hasScannerAccess = hasAccessGrant && gmailApproved

  const handleUnlock = async () => {
    setActionError(null)
    const value = gmailInput.trim().toLowerCase()
    if (!value || !value.includes('@')) {
      setActionError('Enter the Gmail address you want to scan before unlocking.')
      return
    }
    setUnlocking(true)
    try {
      // Lagre Gmail først slik at den er knyttet til brukeren uansett utfall.
      await supabase
        .from('user_scanner_metadata')
        .upsert(
          { user_id: user.id, gmail_address: value, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' },
        )
      await redirectToCheckout({ gmailAddress: value })
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not start checkout.')
      setUnlocking(false)
    }
  }

  const handleStartScan = async () => {
    setActionError(null)

    // Hard gating: ingen automatisk skanning uten aktiv tilgang + godkjent Gmail.
    if (!hasScannerAccess) {
      if (!hasAccessGrant) {
        setActionError('Unlock the scanner (€' + SCANNER_PRICE_EUR + ') to run an automatic scan.')
      } else {
        setActionError(
          'Your purchase is confirmed. We are approving your Gmail for scanning and will email you when it is ready.',
        )
      }
      return
    }

    // Tokenet for innboksen lever kun i sessionStorage (ephemeral). Hvis det
    // mangler eller er utløpt, sender vi brukeren gjennom OAuth-flyten på nytt.
    const accessToken = sessionStorage.getItem('email_access_token')
    const provider = sessionStorage.getItem('email_provider')
    const tokenExpires = sessionStorage.getItem('email_token_expires')
    const isExpired = tokenExpires ? Date.now() > Number(tokenExpires) : false

    if (!accessToken || !provider || isExpired) {
      sessionStorage.removeItem('email_access_token')
      sessionStorage.removeItem('email_provider')
      sessionStorage.removeItem('email_token_expires')
      window.location.href = '/auth/signin'
      return
    }

    setScanning(true)
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const scanResponse = await fetch(`${supabaseUrl}/functions/v1/scan-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ accessToken, provider, maxResults: 500 }),
      })

      if (!scanResponse.ok) {
        throw new Error(`Scan failed (status ${scanResponse.status})`)
      }

      const scanData = await scanResponse.json()
      const senders: string[] = scanData.senders || []
      // Full footprint: every distinct service domain found in the inbox.
      const detectedDomains = extractDetectedServices(senders)
      sessionStorage.setItem('detected_domains', JSON.stringify(detectedDomains))
      // scan-email returns sender domains; map them to the European alternative
      // IDs that the home-page grid pre-selects.
      const detectedServices = mapDomainsToAlternativeIds(senders)
      sessionStorage.setItem('detected_services', JSON.stringify(detectedServices))

      // Hjemmesiden viser oppdagede tjenester og lar brukeren generere rapport.
      window.location.href = '/'
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to start scan right now.')
    } finally {
      setScanning(false)
    }
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
          <div className="animate-spin h-8 w-8 border-4 border-accent dark:border-accent border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary dark:text-dark-text-secondary font-mono">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-mono font-bold text-text-primary dark:text-dark-text-primary">Scanner dashboard</h1>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
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
        <div className="rounded-none border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-text-primary dark:text-dark-text-primary">Connected inboxes</h2>
          {connections.length === 0 && !inboxSession ? (
            <div className="space-y-3">
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">No mailbox connected yet.</p>
              <a
                href="/auth/signin"
                className="inline-flex rounded-none border border-accent bg-accent px-4 py-2 font-mono text-sm font-semibold text-white hover:bg-accent-hover transition"
              >
                Connect Gmail or Outlook
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {inboxSession && (
                <div className="flex items-center justify-between rounded-none border border-success/30 bg-success/10 dark:border-success/50 dark:bg-success/10 p-3">
                  <p className="font-mono text-sm text-text-primary dark:text-dark-text-primary">
                    {inboxSession.provider === 'gmail' ? 'Gmail' : 'Outlook'} session active
                  </p>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">this tab only</span>
                </div>
              )}
              {connections.map((conn) => (
                <div key={conn.id} className="flex items-center justify-between rounded-none border border-border dark:border-dark-border p-3">
                  <p className="font-mono text-sm text-text-primary dark:text-dark-text-primary">
                    {conn.provider === 'gmail' ? 'Gmail' : 'Outlook'} connected
                  </p>
                  <span className="text-xs text-text-secondary dark:text-dark-text-secondary">{formatDate(conn.connected_at)}</span>
                </div>
              ))}
            </div>
          )}

          {scannerMetadata?.gmail_verified && scannerMetadata.gmail_address && (
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
              Verified Gmail: {scannerMetadata.gmail_address}
            </p>
          )}
        </div>

        <div className="rounded-none border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-text-primary dark:text-dark-text-primary">Access status</h2>
          <div
            className={`rounded-none border p-3 ${
              accessState.tone === 'ok'
                ? 'border-success/30 bg-success/10 dark:border-success/50 dark:bg-success/10'
                : accessState.tone === 'pending'
                  ? 'border-warning/30 bg-warning/10 dark:border-warning/50 dark:bg-warning/10'
                  : 'border-border dark:border-dark-border bg-muted/5 dark:bg-muted/5'
            }`}
          >
            <p className="font-mono font-semibold text-text-primary dark:text-dark-text-primary">{accessState.label}</p>
            <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">{accessState.detail}</p>
          </div>

          {hasScannerAccess ? (
            <div className="flex flex-wrap gap-3">
              <a
                href="/#manual-check"
                className="rounded-none border border-border dark:border-dark-border px-4 py-2 font-mono text-sm font-semibold text-text-primary dark:text-dark-text-primary hover:bg-muted/5 dark:hover:bg-muted/5 transition"
              >
                Manual report
              </a>
            </div>
          ) : hasAccessGrant ? (
            // Betalt/affiliate, men venter på manuell Gmail-godkjenning.
            <div className="space-y-2">
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                Gmail awaiting approval: {scannerMetadata?.gmail_address || gmailInput || '—'}
              </p>
            </div>
          ) : (
            // Paywall: oppgi Gmail og lås opp for €5 (eller bruk rabattkode i checkout).
            <div className="space-y-3">
              <label className="block font-mono text-xs font-semibold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary">
                Gmail address to scan
              </label>
              <input
                type="email"
                value={gmailInput}
                onChange={(e) => setGmailInput(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full rounded-none border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas px-3 py-2 font-mono text-sm text-text-primary dark:text-dark-text-primary focus:border-accent focus:outline-none"
              />
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                After payment we manually approve this Gmail for scanning and email you when it is ready.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleUnlock}
                  disabled={unlocking}
                  className="rounded-none border border-accent bg-accent px-4 py-2 font-mono text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition"
                >
                  {unlocking ? 'Starting checkout…' : `Unlock for €${SCANNER_PRICE_EUR}`}
                </button>
                <a
                  href={getProtonAffiliateLink('mail')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-none border border-border dark:border-dark-border px-4 py-2 font-mono text-sm font-semibold text-text-primary dark:text-dark-text-primary hover:bg-muted/5 dark:hover:bg-muted/5 transition"
                >
                  Free via Proton
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-none border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6 space-y-4">
        <h2 className="text-lg font-mono font-semibold text-text-primary dark:text-dark-text-primary">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStartScan}
            disabled={scanning || !hasScannerAccess}
            className="rounded-none border border-accent bg-accent px-4 py-2 font-mono text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {scanning
              ? 'Scanning…'
              : !hasScannerAccess
                ? 'Locked — unlock to scan'
                : inboxSession
                  ? 'Start new scan'
                  : 'Connect inbox & scan'}
          </button>
          <a
            href="/#manual-check"
            className="rounded-none border border-border dark:border-dark-border px-4 py-2 font-mono text-sm font-semibold text-text-primary dark:text-dark-text-primary hover:bg-muted/5 dark:hover:bg-muted/5 transition"
          >
            Open manual checker
          </a>
          <a
            href="/cancel"
            className="rounded-none border border-border dark:border-dark-border px-4 py-2 font-mono text-sm font-semibold text-text-primary dark:text-dark-text-primary hover:bg-muted/5 dark:hover:bg-muted/5 transition"
          >
            Cancellation guides
          </a>
        </div>
      </section>

      <section className="rounded-none border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6 space-y-4">
        <h2 className="text-lg font-mono font-semibold text-text-primary dark:text-dark-text-primary">Recent scans</h2>
        {scans.length === 0 ? (
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">No scans yet. Connect your inbox and run your first scan.</p>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div key={scan.id} className="flex flex-col gap-3 rounded-none border border-border dark:border-dark-border p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="font-mono font-semibold text-text-primary dark:text-dark-text-primary">
                    {scan.scan_status === 'complete' ? 'Scan complete' : `Status: ${scan.scan_status}`}
                  </p>
                  <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Started {formatDate(scan.created_at)}</p>
                </div>
                <a
                  href={`/results/${scan.id}`}
                  className="text-sm font-mono font-semibold text-accent dark:text-accent hover:underline"
                >
                  View results →
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-none border border-border dark:border-dark-border bg-canvas dark:bg-dark-canvas p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-text-primary dark:text-dark-text-primary">Security</h2>
          <div className="rounded-none border border-border dark:border-dark-border p-3">
            <p className="font-mono text-sm text-text-primary dark:text-dark-text-primary">2FA (TOTP)</p>
            <p className="mt-1 text-xs text-text-secondary dark:text-dark-text-secondary">
              {mfaEnabled
                ? 'Enabled for this account.'
                : 'Not enabled yet. Add authenticator-based 2FA for stronger sign-in protection.'}
            </p>
          </div>
          <a
            href="/auth/signin"
            className="inline-flex rounded-none border border-border dark:border-dark-border px-4 py-2 font-mono text-sm font-semibold text-text-primary dark:text-dark-text-primary hover:bg-muted/5 dark:hover:bg-muted/5 transition"
          >
            Open 2FA setup
          </a>
        </div>

        <div className="rounded-none border border-error/30 dark:border-error/50 bg-canvas dark:bg-dark-canvas p-6 space-y-4">
          <h2 className="text-lg font-mono font-semibold text-error dark:text-error">Delete account</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            This removes your dashboard account and scanner history. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="rounded-none border border-error bg-error px-4 py-2 font-mono text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition"
          >
            {deletingAccount ? 'Deleting…' : 'Delete my account'}
          </button>
        </div>
      </section>
    </div>
  )
}

