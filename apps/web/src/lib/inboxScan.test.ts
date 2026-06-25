import { describe, expect, it } from 'vitest'
import { matchDomainsToResults } from './inboxScan'

describe('matchDomainsToResults', () => {
  it('matches primary and alternative sender domains', () => {
    const matched = matchDomainsToResults({
      'netflix.com': 3,
      'info.netflix.com': 2,
      'unknown-vendor.example': 1,
    })

    const netflix = matched.find((item) => item.serviceId === 'netflix')
    expect(netflix).toBeDefined()
    expect(netflix?.detectedCount).toBe(5)
    expect(netflix?.sampleSenders).toContain('netflix.com')
    expect(netflix?.sampleSenders).toContain('info.netflix.com')
    expect(matched.some((item) => item.serviceId === 'unknown-vendor.example')).toBe(false)
  })

  it('matches subdomains against parent service domains', () => {
    const matched = matchDomainsToResults({
      'mail.spotify.com': 1,
    })

    expect(matched.some((item) => item.serviceId === 'spotify')).toBe(true)
  })
})
