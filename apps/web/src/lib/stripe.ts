// Stripe integration for scanner payments

import { supabase } from '@/lib/db'

export const SCANNER_PRICE_EUR = 5 // €5 one-time unlock

export interface CheckoutOptions {
  sessionId?: string
  email?: string
  successUrl?: string
  cancelUrl?: string
}

function getCheckoutEndpoint(): string | null {
  return (
    import.meta.env.VITE_STRIPE_CHECKOUT_SESSION_URL ||
    (import.meta.env.VITE_SUPABASE_URL
      ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`
      : null)
  )
}

async function getCheckoutAuthHeaders(): Promise<Record<string, string> | null> {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return null
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
    ...(anonKey ? { apikey: anonKey } : {}),
  }
}

/**
 * Redirect to Stripe Checkout via the Supabase Edge Function create-checkout.
 * Requires an authenticated Supabase session (create-checkout validates JWT).
 */
export async function redirectToCheckout(options: CheckoutOptions = {}) {
  const checkoutUrl = getCheckoutEndpoint()

  if (!checkoutUrl) {
    console.error(
      'Stripe checkout URL not configured. Set VITE_SUPABASE_URL or VITE_STRIPE_CHECKOUT_SESSION_URL.'
    )
    alert('Payment system is not configured. Please try again later.')
    return
  }

  const headers = await getCheckoutAuthHeaders()
  if (!headers) {
    alert('Please sign in before starting payment.')
    return
  }

  try {
    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        successUrl:
          options.successUrl || `${window.location.origin}/emailscanner?scanner_unlocked=true`,
        cancelUrl: options.cancelUrl || `${window.location.origin}/emailscanner`,
        ...(options.email && { email: options.email }),
        ...(options.sessionId && { metadata_reportId: options.sessionId }),
      }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const message =
        typeof errorBody.error === 'string'
          ? errorBody.error
          : 'Failed to create checkout session'
      throw new Error(message)
    }

    const { url } = await response.json()
    if (url) {
      window.location.href = url
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    alert(
      error instanceof Error ? error.message : 'Failed to start payment. Please try again.'
    )
  }
}
