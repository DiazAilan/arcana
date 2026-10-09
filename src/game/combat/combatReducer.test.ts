import { describe, expect, it, beforeEach } from 'vitest'
import { loadRegistry } from '../content/registry'
import { SeededRNG } from '../rng/SeededRNG'
import { createCombatState } from './startCombat'
import { combatReducer } from './combatReducer'
import { deckFromDefIds, resetCardInstanceCounter } from '../models/card'

describe('combatReducer', () => {
  beforeEach(() => {
    loadRegistry()
    resetCardInstanceCounter()
  })

  it('plays strike for damage', () => {
    const deck = deckFromDefIds(['arc_strike', 'arc_defend'])
    const rng = new SeededRNG(42)
    let combat = createCombatState(deck, ['mob_slime'], rng, 3, [])
    const strikeIndex = combat.hand.findIndex((c) => c.defId === 'arc_strike')
    expect(strikeIndex).toBeGreaterThanOrEqual(0)

    const result = combatReducer(
      combat,
      { type: 'PLAY_CARD', handIndex: strikeIndex, targetEnemyIndex: 0 },
      { playerHp: 70, playerMaxHp: 70, rng },
    )

    expect(result.state.enemies[0]!.hp).toBeLessThan(36)
    expect(result.state.energy).toBe(2)
  })

  it('ends turn and enemy attacks', () => {
    const deck = deckFromDefIds(Array(10).fill('arc_defend'))
    const rng = new SeededRNG(7)
    const combat = createCombatState(deck, ['mob_slime'], rng, 3, [])
    const result = combatReducer(combat, { type: 'END_TURN' }, { playerHp: 70, playerMaxHp: 70, rng })
    expect(result.state.turn).toBe(2)
    expect(result.playerHp).toBeLessThanOrEqual(70)
  })

  it('wins when enemy hp reaches zero', () => {
    const deck = deckFromDefIds(Array(8).fill('arc_rupture'))
    const rng = new SeededRNG(1)
    let combat = createCombatState(deck, ['mob_wisp'], rng, 3, [])
    let hp = 70
    for (let step = 0; step < 20; step++) {
      if (combat.phase === 'won') break
      const idx = combat.hand.findIndex((c) => c.defId === 'arc_rupture')
      if (idx >= 0 && combat.energy >= 3) {
        const res = combatReducer(
          combat,
          { type: 'PLAY_CARD', handIndex: idx, targetEnemyIndex: 0 },
          { playerHp: hp, playerMaxHp: 70, rng },
        )
        combat = res.state
        hp = res.playerHp
        continue
      }
      const res = combatReducer(combat, { type: 'END_TURN' }, { playerHp: hp, playerMaxHp: 70, rng })
      combat = res.state
      hp = res.playerHp
    }
    expect(combat.phase).toBe('won')
  })
})
