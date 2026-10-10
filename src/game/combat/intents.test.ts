import { describe, expect, it } from 'vitest'
import type { CombatState } from './combatState'
import { previewIncomingAttackDamage, previewPlayerHpAfterEnemyTurn } from './intents'
import type { EnemyInstance } from '../models/enemy'

function minimalCombat(enemies: EnemyInstance[], overrides: Partial<CombatState> = {}): CombatState {
  return {
    turn: 1,
    phase: 'player',
    energy: 3,
    maxEnergy: 3,
    playerBlock: 0,
    playerPowers: {},
    drawPile: [],
    hand: [],
    discardPile: [],
    exhaustPile: [],
    enemies,
    heroicEffortUsed: false,
    heroicEffortUsesThisCombat: 0,
    survivedHitTags: [],
    ...overrides,
  }
}

describe('previewIncomingAttackDamage', () => {
  it('includes player vulnerable on displayed incoming damage', () => {
    const dmg = previewIncomingAttackDamage(
      { kind: 'attack', value: 10 },
      {},
      { vulnerable: 1 },
    )
    expect(dmg).toBe(15)
  })

  it('includes enemy strength and weak', () => {
    const dmg = previewIncomingAttackDamage(
      { kind: 'attack', value: 8 },
      { strength: 2 },
      {},
    )
    expect(dmg).toBe(10)
  })
})

describe('previewPlayerHpAfterEnemyTurn', () => {
  it('subtracts incoming attack after block', () => {
    const jaw: EnemyInstance = {
      instanceId: 'e1',
      defId: 'mob_jaw',
      hp: 40,
      maxHp: 40,
      block: 0,
      powers: {},
      intentIndex: 0,
    }
    const state = minimalCombat([jaw], { playerBlock: 3, playerPowers: { vulnerable: 1 } })
    const hp = previewPlayerHpAfterEnemyTurn(state, 59)
    expect(hp).toBe(52)
  })
})
