import { supabase } from '@/lib/db'

interface GmailScanResult {
  scanned_count: number
  detected_services: Array<{
    service_id: string
    sender: string
    detected_at: string
  }>
}

export async function initializeGmailScan(
  mailboxConnectionId: string,
  userId: string
): Promise<{ scanId: string; error?: string }> {
  try {
    // 1. Create scan record with 'processing' status
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        mailbox_connection_id: mailboxConnectionId,
        scan_status: 'processing',
        sample_size: 500,
      })
      .select()
      .single()

    if (scanError || !scan) {
      return { scanId: '', error: 'Failed to create scan record' }
    }

    // 2. Call Gmail connector Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    const functionUrl = `${supabaseUrl}/functions/v1/gmail-scan`

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        mailbox_connection_id: mailboxConnectionId,
        user_id: userId,
        sample_size: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gmail scan error:', error)

      // Mark scan as failed
      await supabase
        .from('scans')
        .update({
          scan_status: 'failed',
          error_message: `Gmail API error: ${response.statusText}`,
          completed_at: new Date().toISOString(),
        })
        .eq('id', scan.id)

      return { scanId: scan.id, error: 'Failed to scan inbox' }
    }

    const result: GmailScanResult = await response.json()

    // 3. Store detected services in scan_results
    if (result.detected_services && result.detected_services.length > 0) {
      const resultsToInsert = result.detected_services.map((service) => ({
        scan_id: scan.id,
        service_id: service.service_id,
        detected_count: 1,
        confidence: 0.95,
        sample_senders: [service.sender],
      }))

      await supabase.from('scan_results').insert(resultsToInsert)
    }

    // 4. Mark scan as complete
    await supabase
      .from('scans')
      .update({
        scan_status: 'complete',
        completed_at: new Date().toISOString(),
      })
      .eq('id', scan.id)

    return { scanId: scan.id }
  } catch (error) {
    console.error('Error initializing Gmail scan:', error)
    return {
      scanId: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getScanResults(scanId: string, userId: string) {
  try {
    // Verify scan belongs to user
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .eq('user_id', userId)
      .single()

    if (scanError || !scan) {
      return { results: null, error: 'Scan not found' }
    }

    // Fetch scan results with service details
    const { data: results, error: resultsError } = await supabase
      .from('scan_results')
      .select(
        `
        *,
        service:services_catalog!service_id (
          id,
          name,
          category,
          domain_patterns,
          website_url,
          logo_url
        )
      `
      )
      .eq('scan_id', scanId)

    if (resultsError) {
      return { results: null, error: 'Failed to fetch results' }
    }

    // Group results by category
    const grouped = (results || []).reduce(
      (acc, result) => {
        const category = result.service?.category || 'other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(result)
        return acc
      },
      {} as Record<string, typeof results>
    )

    return {
      results: {
        scan,
        grouped,
        total: results?.length || 0,
      },
    }
  } catch (error) {
    console.error('Error fetching scan results:', error)
    return {
      results: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
