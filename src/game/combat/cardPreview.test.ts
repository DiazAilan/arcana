import { describe, expect, it } from 'vitest'
import {
  getCardBaseStats,
  getCardStatPreviews,
  outgoingDamageRaw,
  previewEnemyHpAfterCard,
} from './cardPreview'
import type { CombatEffect } from '../models/effects'
import type { EnemyInstance } from '../models/enemy'

const emptyPowers = {}

function enemy(overrides: Partial<EnemyInstance> = {}): EnemyInstance {
  return {
    instanceId: 'e1',
    defId: 'mob_slime',
    hp: 30,
    maxHp: 30,
    block: 0,
    powers: {},
    intentIndex: 0,
    ...overrides,
  }
}

const strikeEffects: CombatEffect[] = [{ type: 'damage', amount: 6, target: 'enemy' }]
const bashEffects: CombatEffect[] = [
  { type: 'damage', amount: 8, target: 'enemy' },
  { type: 'apply_power', power: 'vulnerable', amount: 2, target: 'enemy' },
]

describe('cardPreview', () => {
  it('5 damage + 1 Strength → effective 6', () => {
    const previews = getCardStatPreviews(
      { playerPowers: { strength: 1 }, enemies: [enemy()] },
      [{ type: 'damage', amount: 5, target: 'enemy' }],
    )
    expect(previews[0]?.effective).toBe(6)
    expect(previews[0]?.base).toBe(5)
  })

  it('6 damage + player Weak → effective 4', () => {
    const previews = getCardStatPreviews(
      { playerPowers: { weak: 1 }, enemies: [enemy()] },
      strikeEffects,
    )
    expect(previews[0]?.effective).toBe(4)
  })

  it('6 damage + 1 Strength + Weak → effective 5', () => {
    const previews = getCardStatPreviews(
      { playerPowers: { strength: 1, weak: 1 }, enemies: [enemy()] },
      strikeEffects,
    )
    expect(previews[0]?.effective).toBe(5)
  })

  it('6 damage + 1 Strength, Vulnerable target → effective 10', () => {
    const previews = getCardStatPreviews(
      { playerPowers: { strength: 1 }, enemies: [enemy({ powers: { vulnerable: 1 } })] },
      strikeEffects,
      { targetEnemyIndex: 0 },
    )
    expect(previews[0]?.effective).toBe(10)
  })

  it('6 damage + 1 Strength + Weak, Vulnerable target → effective 7', () => {
    const previews = getCardStatPreviews(
      { playerPowers: { strength: 1, weak: 1 }, enemies: [enemy({ powers: { vulnerable: 1 } })] },
      strikeEffects,
      { targetEnemyIndex: 0 },
    )
    expect(previews[0]?.effective).toBe(7)
  })

  it('ghost HP respects enemy block', () => {
    const e = enemy({ hp: 20, block: 5 })
    const hp = previewEnemyHpAfterCard(
      e,
      { playerPowers: emptyPowers, enemies: [e] },
      strikeEffects,
      0,
    )
    expect(hp).toBe(19)
  })

  it('bash damage preview ignores vulnerable applied later on same card', () => {
    const previews = getCardStatPreviews(
      { playerPowers: emptyPowers, enemies: [enemy()] },
      bashEffects,
      { targetEnemyIndex: 0 },
    )
    expect(previews[0]?.effective).toBe(8)
  })

  it('getCardBaseStats returns printed strike damage', () => {
    const stats = getCardBaseStats(strikeEffects)
    expect(stats[0]?.value).toBe(6)
  })

  it('outgoingDamageRaw matches formula', () => {
    expect(outgoingDamageRaw({ playerPowers: { strength: 1, weak: 1 } }, 6)).toBe(5)
  })
})
