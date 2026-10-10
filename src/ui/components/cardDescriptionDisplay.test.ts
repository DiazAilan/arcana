import { describe, expect, it } from 'vitest'
import { descriptionWithCombatStats, descriptionWithUpgradeHighlight } from './cardDescriptionDisplay'
import type { CardBaseStat } from '../../game/combat/cardPreview'
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

describe('descriptionWithUpgradeHighlight', () => {
  it('marks improved damage in green/buff style', () => {
    const base: CardBaseStat[] = [{ kind: 'damage', value: 5, label: 'Damage', symbol: '⚔' }]
    const upgraded: CardBaseStat[] = [{ kind: 'damage', value: 7, label: 'Damage', symbol: '⚔' }]
    const parts = descriptionWithUpgradeHighlight('Deal 7 damage.', upgraded, base)
    const stat = parts.find((p) => p.kind === 'stat')
    expect(stat).toMatchObject({ value: 7, buff: true })
  })

  it('leaves unchanged stats neutral', () => {
    const stats: CardBaseStat[] = [{ kind: 'block', value: 5, label: 'Block', symbol: '🛡' }]
    const parts = descriptionWithUpgradeHighlight('Gain 5 Block.', stats, stats)
    const stat = parts.find((p) => p.kind === 'stat')
    expect(stat).toMatchObject({ value: 5, buff: false })
  })
})
