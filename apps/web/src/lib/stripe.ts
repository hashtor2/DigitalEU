// Stripe integration for scanner payments

const SCANNER_PRODUCT_ID = 'prod_Ul6F5uILTdezFq'
const SCANNER_PRICE_EUR = 5 // €5

export interface CheckoutOptions {
  sessionId?: string
  email?: string
  successUrl?: string
  cancelUrl?: string
}

/**
 * Redirect to Stripe Checkout for scanner purchase
 * Requires VITE_STRIPE_PUBLIC_KEY and VITE_STRIPE_CHECKOUT_SESSION_URL env vars
 */
export async function redirectToCheckout(options: CheckoutOptions = {}) {
  const checkoutUrl = import.meta.env.VITE_STRIPE_CHECKOUT_SESSION_URL || ''
  
  if (!checkoutUrl) {
    console.error(
      'Stripe checkout URL not configured. Set VITE_STRIPE_CHECKOUT_SESSION_URL in .env'
    )
    alert('Payment system is not configured. Please try again later.')
    return
  }

  try {
    const params = new URLSearchParams({
      productId: SCANNER_PRODUCT_ID,
      price: SCANNER_PRICE_EUR.toString(),
      ...(options.email && { email: options.email }),
      ...(options.sessionId && { metadata_reportId: options.sessionId }),
    })

    const url = `${checkoutUrl}?${params.toString()}`
    window.location.href = url
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    alert('Failed to start payment. Please try again.')
  }
}

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
