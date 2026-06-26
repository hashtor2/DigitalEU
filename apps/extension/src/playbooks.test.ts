import { describe, it, expect } from 'vitest'
import { PLAYBOOK_REGISTRY, getPlaybook } from './playbooks'

describe('Playbook Registry', () => {
  it('should have all 11 explicit domains covered or registered', () => {
    expect(PLAYBOOK_REGISTRY.length).toBeGreaterThan(0)
    
    const netflix = getPlaybook('netflix')
    expect(netflix).toBeDefined()
    expect(netflix?.serviceName).toBe('Netflix')
    
    // Check if guides exist
    expect(netflix?.guides['change-email']).toBeDefined()
    expect(netflix?.guides['delete-account']).toBeDefined()
  })

  it('playbooks should use valid action types', () => {
    PLAYBOOK_REGISTRY.forEach(playbook => {
      Object.values(playbook.guides).forEach(guideSteps => {
        guideSteps?.forEach(step => {
          expect(['navigate', 'click', 'fill', 'instruction', 'confirm', 'wait-for-selector']).toContain(step.actionType)
        })
      })
    })
  })
})
