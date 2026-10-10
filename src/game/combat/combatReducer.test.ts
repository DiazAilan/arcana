import { describe, expect, it, beforeEach } from 'vitest'
import { loadRegistry } from '../content/registry'
import { SeededRNG } from '../rng/SeededRNG'
import { createCombatState } from './startCombat'
import { combatReducer } from './combatReducer'
import { heroicEffortHpCost } from './combatState'
import { deckFromDefIds, resetCardInstanceCounter } from '../models/card'

describe('combatReducer', () => {
  beforeEach(() => {
    loadRegistry()
    resetCardInstanceCounter()
  })

  it('heroic effort costs HP and grants energy once per turn', () => {
    const deck = deckFromDefIds(['arc_defend'])
    const rng = new SeededRNG(42)
    const combat = createCombatState(deck, ['mob_slime'], rng, 3, [])
    const first = combatReducer(
      combat,
      { type: 'HEROIC_EFFORT' },
      { playerHp: 70, playerMaxHp: 70, rng },
    )
    expect(first.state.energy).toBe(4)
    expect(first.playerHp).toBe(70 - heroicEffortHpCost(0))
    expect(first.state.heroicEffortUsed).toBe(true)
    expect(first.state.heroicEffortUsesThisCombat).toBe(1)

    const second = combatReducer(
      first.state,
      { type: 'HEROIC_EFFORT' },
      { playerHp: first.playerHp, playerMaxHp: 70, rng },
    )
    expect(second.state.energy).toBe(4)
    expect(second.playerHp).toBe(first.playerHp)

    const cost1 = heroicEffortHpCost(0)
    const lowHp = combatReducer(
      combat,
      { type: 'HEROIC_EFFORT' },
      { playerHp: cost1, playerMaxHp: 70, rng },
    )
    expect(lowHp.state.energy).toBe(3)
    expect(lowHp.playerHp).toBe(cost1)
  })

  it('heroic effort cost escalates across turns in one combat', () => {
    const deck = deckFromDefIds(Array(10).fill('arc_defend'))
    const rng = new SeededRNG(99)
    let combat = createCombatState(deck, ['mob_slime'], rng, 3, [])
    let hp = 70

    const first = combatReducer(
      combat,
      { type: 'HEROIC_EFFORT' },
      { playerHp: hp, playerMaxHp: 70, rng },
    )
    hp = first.playerHp
    expect(hp).toBe(70 - heroicEffortHpCost(0))

    const afterTurn = combatReducer(first.state, { type: 'END_TURN' }, { playerHp: hp, playerMaxHp: 70, rng })
    combat = afterTurn.state
    hp = afterTurn.playerHp

    const second = combatReducer(
      combat,
      { type: 'HEROIC_EFFORT' },
      { playerHp: hp, playerMaxHp: 70, rng },
    )
    expect(second.playerHp).toBe(hp - heroicEffortHpCost(1))
    expect(second.state.heroicEffortUsesThisCombat).toBe(2)
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

  it('applies Weak to player attack damage', () => {
    const deck = deckFromDefIds(['arc_strike'])
    const rng = new SeededRNG(42)
    let combat = createCombatState(deck, ['mob_wisp'], rng, 3, [])
    combat = {
      ...combat,
      playerPowers: { weak: 1 },
      hand: combat.hand.filter((c) => c.defId === 'arc_strike'),
      energy: 3,
    }
    const hpBefore = combat.enemies[0]!.hp
    const result = combatReducer(
      combat,
      { type: 'PLAY_CARD', handIndex: 0, targetEnemyIndex: 0 },
      { playerHp: 70, playerMaxHp: 70, rng },
    )
    expect(hpBefore - result.state.enemies[0]!.hp).toBe(4)
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
