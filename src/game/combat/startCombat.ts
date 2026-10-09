import type { CardInstance } from '../models/card'
import type { CombatState } from './combatState'
import { HAND_SIZE } from './combatState'
import { createEnemyInstance, resetEnemyInstanceCounter } from '../models/enemy'
import { getRegistry } from '../content/registry'
import { SeededRNG } from '../rng/SeededRNG'
import { shuffleIntoDraw, drawCards } from './deck'
import { getPower } from './powers'
import { gainBlock } from './damage'

export function createCombatState(
  deck: CardInstance[],
  enemyDefIds: string[],
  rng: SeededRNG,
  maxEnergy: number,
  relicIds: string[],
): CombatState {
  resetEnemyInstanceCounter()
  const registry = getRegistry()
  const enemies = enemyDefIds.map((id) => {
    const def = registry.enemies.get(id)!
    return createEnemyInstance(id, def)
  })

  let drawPile = shuffleIntoDraw([...deck], rng)
  const state: CombatState = {
    turn: 1,
    phase: 'player',
    energy: maxEnergy,
    maxEnergy,
    playerBlock: 0,
    playerPowers: {},
    drawPile,
    hand: [],
    discardPile: [],
    exhaustPile: [],
    enemies,
  }

  let next = state
  for (const relicId of relicIds) {
    const relic = registry.relics.get(relicId)
    if (relic?.combatStartDraw) {
      const drawn = drawCards(next, relic.combatStartDraw, rng)
      next = drawn.state
    }
  }

  const afterDraw = drawCards(next, HAND_SIZE, rng)
  return afterDraw.state
}

export function applyMetallicize(state: CombatState): CombatState {
  const stacks = getPower(state.playerPowers, 'metallicize')
  if (stacks <= 0) return state
  return { ...state, playerBlock: gainBlock(state.playerBlock, stacks) }
}

export function checkCombatOutcome(state: CombatState): CombatState {
  if (state.enemies.every((e) => e.hp <= 0)) {
    return { ...state, phase: 'won' }
  }
  return state
}
