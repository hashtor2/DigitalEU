// Stripe integration for scanner payments

import { supabase } from '@/lib/db'

const SCANNER_PRICE_EUR = 5 // €5 engangskjøp (ADR #12)

export interface CheckoutOptions {
  /** Gmail-adressen brukeren ønsker å skanne (lagres som metadata for manuell godkjenning) */
  gmailAddress?: string
  successUrl?: string
  cancelUrl?: string
}

/**
 * Start Stripe Checkout for the €5 scanner unlock.
 * Calls the `create-checkout` Edge Function with the signed-in user's JWT so the
 * resulting payment can be tied back to the user (entitlement granted by webhook).
 */
export async function redirectToCheckout(options: CheckoutOptions = {}) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      alert('Please sign in before purchasing scanner access.')
      window.location.href = '/auth/signin'
      return
    }

    const origin = window.location.origin
    const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        successUrl: options.successUrl || `${origin}/dashboard?checkout=success`,
        cancelUrl: options.cancelUrl || `${origin}/dashboard?checkout=cancelled`,
        gmailAddress: options.gmailAddress,
      }),
    })

    const data = await response.json()
    if (!response.ok || !data.url) {
      console.error('Checkout creation failed:', data)
      alert(data.error || 'Failed to start payment. Please try again.')
      return
    }

    window.location.href = data.url
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    alert('Failed to start payment. Please try again.')
  }
}

export { SCANNER_PRICE_EUR }

/**
 * Proton affiliate links for various product categories
 */
export const PROTON_AFFILIATES = {
  // Primary email link with 1€ promo + 40% off
  mail: 'https://go.getproton.me/SH2jh',
  // VPN default
  vpn: 'https://go.getproton.me/SH1mQ',
  // Pass with 50% off
  pass: 'https://go.getproton.me/SH1mP',
}

export function getProtonAffiliateLink(product: 'mail' | 'vpn' | 'pass' = 'mail'): string {
  return PROTON_AFFILIATES[product]
}

/**
 * Build a Proton affiliate link with custom redirect
 */
export function buildProtonLink(
  product: 'mail' | 'vpn' | 'pass' = 'mail',
  redirectPath: string = ''
): string {
  const baseUrl = PROTON_AFFILIATES[product]
  if (!redirectPath) return baseUrl
  return `${baseUrl}?redirect_url=${encodeURIComponent(window.location.origin + redirectPath)}`
}
