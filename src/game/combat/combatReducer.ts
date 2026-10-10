import type { CombatState } from './combatState'
import { HAND_SIZE, heroicEffortHpCost } from './combatState'
import { getRegistry } from '../content/registry'
import { applyCombatEffects, getCardEffectsForInstance, getResolvedCardCost } from './applyEffects'
import { drawCards } from './deck'
import { executeEnemyTurn } from './intents'
import { applyMetallicize, checkCombatOutcome } from './startCombat'
import { tickDownTurnPowers } from './powers'
import type { SeededRNG } from '../rng/SeededRNG'

export type CombatAction =
  | { type: 'PLAY_CARD'; handIndex: number; targetEnemyIndex?: number }
  | { type: 'END_TURN' }
  | { type: 'HEROIC_EFFORT' }

export type CombatReducerContext = {
  playerHp: number
  playerMaxHp: number
  rng: SeededRNG
}

export type CombatReducerResult = {
  state: CombatState
  playerHp: number
}

export function combatReducer(
  state: CombatState,
  action: CombatAction,
  ctx: CombatReducerContext,
): CombatReducerResult {
  if (state.phase !== 'player' && (action.type === 'PLAY_CARD' || action.type === 'HEROIC_EFFORT')) {
    return { state, playerHp: ctx.playerHp }
  }

  switch (action.type) {
    case 'HEROIC_EFFORT': {
      if (state.phase !== 'player' || state.heroicEffortUsed) {
        return { state, playerHp: ctx.playerHp }
      }
      const hpCost = heroicEffortHpCost(state.heroicEffortUsesThisCombat)
      if (ctx.playerHp <= hpCost) {
        return { state, playerHp: ctx.playerHp }
      }
      return {
        state: {
          ...state,
          energy: state.energy + 1,
          heroicEffortUsed: true,
          heroicEffortUsesThisCombat: state.heroicEffortUsesThisCombat + 1,
        },
        playerHp: ctx.playerHp - hpCost,
      }
    }

    case 'PLAY_CARD': {
      if (state.phase !== 'player') return { state, playerHp: ctx.playerHp }
      const card = state.hand[action.handIndex]
      if (!card) return { state, playerHp: ctx.playerHp }

      const def = getRegistry().cards.get(card.defId)
      if (!def) return { state, playerHp: ctx.playerHp }
      const cardCost = getResolvedCardCost(card)
      if (state.energy < cardCost) return { state, playerHp: ctx.playerHp }

      const hand = [...state.hand]
      hand.splice(action.handIndex, 1)
      const isPower = def.type === 'power'
      const discardPile = isPower ? state.discardPile : [...state.discardPile, card]
      const exhaustPile = isPower ? [...state.exhaustPile, card] : state.exhaustPile

      let next: CombatState = {
        ...state,
        hand,
        discardPile,
        exhaustPile,
        energy: state.energy - cardCost,
      }

      const effects = getCardEffectsForInstance(card)
      const applied = applyCombatEffects(
        next,
        effects,
        {
          targetEnemyIndex: action.targetEnemyIndex ?? 0,
          playerMaxHp: ctx.playerMaxHp,
        },
        ctx.playerHp,
      )
      next = checkCombatOutcome(applied.state)
      const hp = applied.playerHp

      if (next.phase === 'won') {
        return { state: next, playerHp: hp }
      }

      return { state: next, playerHp: hp }
    }

    case 'END_TURN': {
      if (state.phase !== 'player') return { state, playerHp: ctx.playerHp }

      let next: CombatState = {
        ...state,
        phase: 'enemy',
        hand: [],
        discardPile: [...state.discardPile, ...state.hand],
      }

      next = applyMetallicize(next)

      let hp = ctx.playerHp
      const enemyResult = executeEnemyTurn(next, hp, ctx.playerMaxHp)
      next = enemyResult.state
      hp = enemyResult.playerHp

      if (next.phase === 'lost') {
        return { state: next, playerHp: hp }
      }

      next = {
        ...next,
        playerPowers: tickDownTurnPowers(next.playerPowers),
        enemies: next.enemies.map((e) => ({
          ...e,
          powers: tickDownTurnPowers(e.powers),
          block: 0,
        })),
        playerBlock: 0,
      }

      const drawn = drawCards(next, HAND_SIZE, ctx.rng)
      next = drawn.state

      return { state: next, playerHp: hp }
    }

    default:
      return { state, playerHp: ctx.playerHp }
  }
}
