import { describe, expect, it } from 'vitest'
import { descriptionWithCombatStats } from './cardDescriptionDisplay'
import type { CardStatPreview } from '../../game/combat/cardPreview'

describe('descriptionWithCombatStats', () => {
  it('replaces damage phrase and keeps trailing text', () => {
    const previews: CardStatPreview[] = [
      { kind: 'damage', base: 8, effective: 8, label: 'Damage', symbol: '⚔' },
    ]
    const parts = descriptionWithCombatStats('Deal 8 damage. Apply 2 Vulnerable.', previews)
    expect(parts.map((p) => (p.kind === 'text' ? p.text : `${p.symbol}${p.value}`))).toEqual([
      '⚔8',
      '. Apply 2 Vulnerable.',
    ])
  })
})
