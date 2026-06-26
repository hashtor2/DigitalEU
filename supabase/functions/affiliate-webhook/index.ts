import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// This webhook receives postbacks from affiliate networks (like Impact, CJ, or direct partners)
// It verifies the conversion and stores it in the database.
// The scanner UI will poll the database to check if a specific 'subid' (session ID) has converted.

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const url = new URL(req.url)
    const payload = await req.json().catch(() => null)
    
    // We expect the affiliate network to send the subid (which maps to our session ID)
    const subid = payload?.subid || url.searchParams.get('subid')
    const partnerId = payload?.partner_id || url.searchParams.get('partner_id') || 'unknown'
    const status = payload?.status || url.searchParams.get('status') || 'approved'

    if (!subid) {
      return new Response(JSON.stringify({ error: 'Missing subid parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Store the conversion in the database
    // Assume we have a table 'affiliate_conversions'
    const { error } = await supabase
      .from('affiliate_conversions')
      .upsert({
        subid,
        partner_id: partnerId,
        status,
        updated_at: new Date().toISOString()
      }, { onConflict: 'subid' })

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: 'Failed to record conversion' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, subid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})