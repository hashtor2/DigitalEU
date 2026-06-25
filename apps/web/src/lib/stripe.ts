// Stripe integration for scanner payments

export const SCANNER_PRICE_EUR = 5 // €5 one-time unlock

export interface CheckoutOptions {
  sessionId?: string
  email?: string
  successUrl?: string
  cancelUrl?: string
}

/**
 * Redirect to Stripe Checkout via the Supabase Edge Function create-checkout.
 * Requires VITE_STRIPE_CHECKOUT_SESSION_URL (or falls back to VITE_SUPABASE_URL).
 */
export async function redirectToCheckout(options: CheckoutOptions = {}) {
  const checkoutUrl =
    import.meta.env.VITE_STRIPE_CHECKOUT_SESSION_URL ||
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`

  if (!checkoutUrl) {
    console.error('Stripe checkout URL not configured. Set VITE_STRIPE_CHECKOUT_SESSION_URL in .env')
    alert('Payment system is not configured. Please try again later.')
    return
  }

  try {
    const response = await fetch(checkoutUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        successUrl: options.successUrl || `${window.location.origin}/emailscanner?scanner_unlocked=true`,
        cancelUrl: options.cancelUrl || `${window.location.origin}/emailscanner`,
        ...(options.email && { email: options.email }),
        ...(options.sessionId && { metadata_reportId: options.sessionId }),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { url } = await response.json()
    if (url) {
      window.location.href = url
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    alert('Failed to start payment. Please try again.')
  }
}
