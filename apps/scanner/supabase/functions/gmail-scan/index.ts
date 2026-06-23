import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2'

interface GmailScanRequest {
  mailbox_connection_id: string
  user_id: string
  sample_size?: number
}

interface GmailMessage {
  id: string
  threadId: string
  internalDate: string
  headers?: {
    name: string
    value: string
  }[]
}

interface DetectedService {
  service_id: string
  sender: string
  detected_at: string
}

// Initialize Supabase client with service role (server-only)
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Gmail API configuration
const GMAIL_API_URL = 'https://www.googleapis.com/gmail/v1'

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders() })
  }

  try {
    const { mailbox_connection_id, user_id, sample_size = 500 }: GmailScanRequest = await req.json()

    if (!mailbox_connection_id || !user_id) {
      return errorResponse('Missing required fields', 400)
    }

    // 1. Fetch encrypted OAuth token from database
    const { data: connection, error: fetchError } = await supabase
      .from('mailbox_connections')
      .select('*')
      .eq('id', mailbox_connection_id)
      .eq('user_id', user_id)
      .single()

    if (fetchError || !connection) {
      return errorResponse('Mailbox connection not found', 404)
    }

    if (connection.revoked_at || !connection.oauth_token_encrypted) {
      return errorResponse('Connection revoked or invalid', 403)
    }

    // 2. Decrypt OAuth token (for MVP, assume it's already decrypted by client)
    // TODO: Implement proper encryption/decryption
    const accessToken = connection.oauth_token_encrypted

    // 3. Call Gmail API to fetch recent messages (metadata only)
    const messages = await fetchGmailMessages(accessToken, sample_size)

    if (!messages || messages.length === 0) {
      return jsonResponse({
        scanned_count: 0,
        detected_services: [],
      })
    }

    // 4. Extract sender domains from message headers
    const senders = extractSendersFromMessages(messages)

    // 5. Match senders against services catalog
    const detectedServices = await matchSendersToServices(senders)

    // 6. Update mailbox connection with last_used_at
    await supabase
      .from('mailbox_connections')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', mailbox_connection_id)

    return jsonResponse({
      scanned_count: messages.length,
      detected_services: detectedServices,
    })
  } catch (error) {
    console.error('Error in gmail-scan:', error)
    return errorResponse(error instanceof Error ? error.message : 'Internal server error', 500)
  }
})

async function fetchGmailMessages(accessToken: string, limit: number): Promise<GmailMessage[]> {
  try {
    // Fetch message IDs (headers only, no bodies)
    const listResponse = await fetch(
      `${GMAIL_API_URL}/users/me/messages?maxResults=${Math.min(limit, 500)}&fields=messages(id,internalDate)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!listResponse.ok) {
      throw new Error(`Gmail API error: ${listResponse.statusText}`)
    }

    const listData = await listResponse.json() as { messages?: { id: string }[] }
    const messageIds = listData.messages?.map((m) => m.id) || []

    if (messageIds.length === 0) {
      return []
    }

    // Fetch full message headers (sender, subject, date) for each ID
    const messages: GmailMessage[] = []
    for (const messageId of messageIds) {
      const msgResponse = await fetch(
        `${GMAIL_API_URL}/users/me/messages/${messageId}?format=metadata&metadataHeaders=From,Subject,Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (msgResponse.ok) {
        const msg = await msgResponse.json() as GmailMessage
        messages.push(msg)
      }
    }

    return messages
  } catch (error) {
    console.error('Error fetching Gmail messages:', error)
    throw error
  }
}

function extractSendersFromMessages(messages: GmailMessage[]): string[] {
  const senders = new Set<string>()

  for (const message of messages) {
    if (!message.headers) continue

    const fromHeader = message.headers.find((h) => h.name === 'From')
    if (fromHeader?.value) {
      // Extract email domain from "Name <email@domain.com>" format
      const emailMatch = fromHeader.value.match(/<(.+?)>|^([^\s]+@[^\s]+)/)
      const email = emailMatch?.[1] || emailMatch?.[2]

      if (email) {
        const domain = email.split('@')[1]?.toLowerCase()
        if (domain) {
          senders.add(domain)
        }
      }
    }
  }

  return Array.from(senders)
}

async function matchSendersToServices(senders: string[]): Promise<DetectedService[]> {
  if (senders.length === 0) {
    return []
  }

  // Fetch services catalog with domain patterns
  const { data: services, error } = await supabase
    .from('services_catalog')
    .select('id, domain_patterns, name')

  if (error || !services) {
    console.error('Error fetching services catalog:', error)
    return []
  }

  const detected: DetectedService[] = []

  for (const sender of senders) {
    for (const service of services) {
      const patterns = (service.domain_patterns || []) as string[]

      // Check if sender matches any domain pattern for this service
      if (patterns.some((pattern) => sender.includes(pattern) || pattern.includes(sender))) {
        detected.push({
          service_id: service.id,
          sender,
          detected_at: new Date().toISOString(),
        })
        break // Move to next sender after finding a match
      }
    }
  }

  return detected
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  })
}

function errorResponse(message: string, status: number) {
  return jsonResponse({ error: message }, status)
}
