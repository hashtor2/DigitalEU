import { supabase } from '@/lib/db'
import {
  runInboxScan,
  type InboxProvider,
  type MatchedScanResult,
} from '@/lib/inboxScan'
import { DOMAIN_MAPPINGS, ALTERNATIVES } from '@digitaleu/shared'

interface CancellationStep {
  step: number
  title: string
  description: string
}

export interface CancellationGuide {
  id: string
  service_id: string
  title: string
  slug: string
  description: string
  seo_meta_description: string
  canonical_url: string
  how_to_cancel_steps: CancellationStep[]
  hero_image_url: string
  og_image_url: string
  featured_eu_alternative: string
  service?: {
    id: string
    name: string
    website_url: string
    logo_url: string
  }
}

export interface EnrichedScanResult {
  service_id: string
  detected_count: number
  confidence: number
  sample_senders: string[]
  service: {
    id: string
    name: string
    category: string
    website_url: string
    logo_url: string
  }
}

function enrichMatchedResults(matched: MatchedScanResult[]): EnrichedScanResult[] {
  return matched.map((result) => {
    const mapping = DOMAIN_MAPPINGS.find((m) => m.id === result.serviceId)
    const alternative = result.suggestedAlternativeId
      ? ALTERNATIVES.find((a) => a.id === result.suggestedAlternativeId)
      : undefined

    return {
      service_id: result.serviceId,
      detected_count: result.detectedCount,
      confidence: 0.95,
      sample_senders: result.sampleSenders,
      service: {
        id: result.serviceId,
        name: result.serviceName,
        category: result.category,
        website_url: mapping?.settingsUrl ?? alternative?.url ?? '',
        logo_url: '',
      },
    }
  })
}

function groupResultsByCategory(results: EnrichedScanResult[]) {
  return results.reduce(
    (acc, result) => {
      const category = result.service?.category || 'other'
      if (!acc[category]) acc[category] = []
      acc[category].push(result)
      return acc
    },
    {} as Record<string, EnrichedScanResult[]>
  )
}

export async function initializeInboxScan(
  mailboxConnectionId: string,
  userId: string,
  accessToken: string,
  provider: InboxProvider,
  sampleSize = 500
): Promise<{ scanId: string; error?: string }> {
  try {
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        mailbox_connection_id: mailboxConnectionId,
        scan_status: 'processing',
        sample_size: sampleSize,
      })
      .select()
      .single()

    if (scanError || !scan) {
      return { scanId: '', error: 'Failed to create scan record' }
    }

    try {
      const { matched } = await runInboxScan(accessToken, provider, {
        maxResults: sampleSize,
      })

      if (matched.length > 0) {
        const resultsToInsert = matched.map((result) => ({
          scan_id: scan.id,
          service_id: result.serviceId,
          detected_count: result.detectedCount,
          confidence: 0.95,
          sample_senders: result.sampleSenders,
        }))

        const { error: insertError } = await supabase
          .from('scan_results')
          .insert(resultsToInsert)

        if (insertError) {
          throw new Error(insertError.message)
        }
      }

      await supabase
        .from('scans')
        .update({
          scan_status: 'complete',
          completed_at: new Date().toISOString(),
        })
        .eq('id', scan.id)

      await supabase
        .from('mailbox_connections')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', mailboxConnectionId)

      return { scanId: scan.id }
    } catch (scanFailure) {
      const message =
        scanFailure instanceof Error ? scanFailure.message : 'Scan failed'

      await supabase
        .from('scans')
        .update({
          scan_status: 'failed',
          error_message: message,
          completed_at: new Date().toISOString(),
        })
        .eq('id', scan.id)

      return { scanId: scan.id, error: message }
    }
  } catch (error) {
    console.error('Error initializing inbox scan:', error)
    return {
      scanId: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getScanResults(scanId: string, userId: string) {
  try {
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('id', scanId)
      .eq('user_id', userId)
      .single()

    if (scanError || !scan) {
      return { results: null, error: 'Scan not found' }
    }

    const { data: rawResults, error: resultsError } = await supabase
      .from('scan_results')
      .select('*')
      .eq('scan_id', scanId)

    if (resultsError) {
      return { results: null, error: 'Failed to fetch results' }
    }

    const enriched = (rawResults ?? []).map((result) => {
      const mapping = DOMAIN_MAPPINGS.find((m) => m.id === result.service_id)
      const alternative = mapping?.suggestedAlternativeId
        ? ALTERNATIVES.find((a) => a.id === mapping.suggestedAlternativeId)
        : undefined

      return {
        service_id: result.service_id,
        detected_count: result.detected_count ?? 1,
        confidence: result.confidence ?? 0.9,
        sample_senders: result.sample_senders ?? [],
        service: {
          id: result.service_id,
          name: mapping?.serviceName ?? result.service_id,
          category: mapping?.category ?? 'other',
          website_url: mapping?.settingsUrl ?? alternative?.url ?? '',
          logo_url: '',
        },
      } satisfies EnrichedScanResult
    })

    const grouped = groupResultsByCategory(enriched)

    return {
      results: {
        scan,
        grouped,
        total: enriched.length,
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

export async function getCancellationGuides() {
  try {
    const { data: guides, error } = await supabase
      .from('cancellation_guides')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      return { guides: null, error: 'Failed to fetch guides' }
    }

    return { guides: (guides || []) as CancellationGuide[] }
  } catch (error) {
    console.error('Error fetching cancellation guides:', error)
    return {
      guides: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getCancellationGuide(id: string) {
  try {
    const { data: guide, error } = await supabase
      .from('cancellation_guides')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !guide) {
      return { guide: null, error: 'Guide not found' }
    }

    return { guide: guide as CancellationGuide }
  } catch (error) {
    console.error('Error fetching cancellation guide:', error)
    return {
      guide: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export { enrichMatchedResults, groupResultsByCategory }
