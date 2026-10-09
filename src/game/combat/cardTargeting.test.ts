import { describe, expect, it } from 'vitest'
import { canPlayWithoutTarget, requiresEnemyTarget } from './cardTargeting'

describe('cardTargeting', () => {
  it('requires enemy when single-target damage', () => {
    expect(requiresEnemyTarget([{ type: 'damage', amount: 6, target: 'enemy' }])).toBe(true)
    expect(canPlayWithoutTarget([{ type: 'damage', amount: 6, target: 'enemy' }])).toBe(false)
  })

  it('does not require enemy for block-only', () => {
    expect(requiresEnemyTarget([{ type: 'block', amount: 5 }])).toBe(false)
    expect(canPlayWithoutTarget([{ type: 'block', amount: 5 }])).toBe(true)
  })

  it('does not require enemy for all_enemies', () => {
    expect(requiresEnemyTarget([{ type: 'damage', amount: 4, target: 'all_enemies' }])).toBe(false)
  })
})
