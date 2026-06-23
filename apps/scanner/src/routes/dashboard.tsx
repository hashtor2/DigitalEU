import { useEffect, useState } from 'react'
import { supabase } from '@/lib/db'
import { initializeGmailScan } from '@/lib/scan'

interface Scan {
  id: string
  scan_status: string
  created_at: string
  completed_at: string | null
}

interface MailboxConnection {
  id: string
  provider: string
  connected_at: string
}

export default function DashboardPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [connections, setConnections] = useState<MailboxConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!currentUser) {
        window.location.href = '/auth/signin'
        return
      }

      setUser(currentUser)

      // Load user's connections
      const { data: connectionsData } = await supabase
        .from('mailbox_connections')
        .select('*')
        .eq('user_id', currentUser.id)
        .is('revoked_at', null)

      setConnections(connectionsData || [])

      // Load user's scans
      const { data: scansData } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })

      setScans(scansData || [])
      setLoading(false)
    }

    loadDashboard()
  }, [])

  const handleConnectGmail = async () => {
    setScanning(true)

    if (!user || !connections.length) {
      alert('Please sign in with Gmail first')
      setScanning(false)
      return
    }

    const connection = connections[0]!
    const { scanId, error } = await initializeGmailScan(connection.id, user.id)

    if (error) {
      alert(`Scan failed: ${error}`)
      setScanning(false)
      return
    }

    // Redirect to results page
    window.location.href = `/results/${scanId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-[#c17a5c] dark:border-[#a86650] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[#1a2332]/70 dark:text-[#a89d96]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold text-[#1a2332] dark:text-[#f5f1ea]">Your dashboard</h1>
          <p className="text-[#1a2332]/70 dark:text-[#a89d96] mt-1">Signed in as {user?.email}</p>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => (window.location.href = '/'))}
          className="px-4 py-2 rounded border border-[#1a2332]/20 dark:border-[#3a3530] text-[#1a2332] dark:text-[#f5f1ea] font-mono font-semibold hover:bg-[#1a2332]/5 dark:hover:bg-[#f5f1ea]/10 transition"
        >
          Sign out
        </button>
      </div>

      <div className="rounded-lg border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-6">
        <h2 className="text-xl font-mono font-semibold mb-4 text-[#1a2332] dark:text-[#f5f1ea]">Mailbox connections</h2>
        <p className="text-[#1a2332]/70 dark:text-[#a89d96] mb-4">Connect your Gmail or Outlook account to scan for subscriptions.</p>

        {connections.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-[#1a2332]/60 dark:text-[#a89d96]">No connections yet</p>
            <a
              href="/auth/signin"
              className="inline-block px-4 py-2 rounded bg-[#c17a5c] dark:bg-[#a86650] font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 dark:hover:bg-[#a86650]/90 transition"
            >
              Connect Gmail via OAuth
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((conn) => (
              <div key={conn.id} className="flex items-center justify-between rounded bg-[#1a2332]/5 dark:bg-[#f5f1ea]/5 p-3">
                <span className="font-mono text-sm text-[#1a2332] dark:text-[#f5f1ea]">
                  {conn.provider === 'gmail' ? '✓ Gmail' : '✓ Outlook'} connected
                </span>
                <button
                  onClick={handleConnectGmail}
                  disabled={scanning}
                  className="px-4 py-2 rounded bg-[#c17a5c] dark:bg-[#a86650] font-mono font-semibold text-[#f9f7f2] hover:bg-[#c17a5c]/90 dark:hover:bg-[#a86650]/90 disabled:opacity-50 transition"
                >
                  {scanning ? 'Scanning...' : 'Start scan'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {scans.length === 0 ? (
        <div className="rounded-lg border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-6 text-center">
          <p className="text-[#1a2332]/70 dark:text-[#a89d96]">No scans yet. Connect your email to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">Recent scans</h2>
          {scans.map((scan) => (
            <div key={scan.id} className="rounded-lg border border-[#1a2332]/10 dark:border-[#3a3530] bg-white dark:bg-[#2a251f] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-semibold text-[#1a2332] dark:text-[#f5f1ea]">
                    {scan.scan_status === 'complete' ? '✓ Scan complete' : `Status: ${scan.scan_status}`}
                  </p>
                  <p className="text-sm text-[#1a2332]/60 dark:text-[#a89d96]">
                    {new Date(scan.created_at).toLocaleDateString()}
                  </p>
                </div>
                <a href={`/results/${scan.id}`} className="text-[#c17a5c] dark:text-[#a86650] font-mono font-semibold hover:underline">
                  View results →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

