import type { GameSession, RunState } from '../models/session'
import { createCardInstance, deckFromDefIds, resetCardInstanceCounter } from '../models/card'
import { loadRegistry, getRegistry } from '../content/registry'
import { randomSeed, type SeededRNG } from '../rng/SeededRNG'
import { generateMap, advanceMap, getNode } from '../run/mapGen'
import { combatReducer } from '../combat/combatReducer'
import { createCombatState } from '../combat/startCombat'
import { getMaxEnergyFromRelics, getVictoryHealFromRelics, getCombatStartBlock } from '../run/relicBonuses'
import { rollCardOffers, rollGoldReward, rollRelicOffer } from '../run/rewards'
import { createShop } from '../run/shop'
import { applyRunEffects } from '../run/runEffects'
import { REGULAR_ENEMY_IDS } from '../content/act1/enemies'
import { ACT1_EVENTS, FALLBACK_EVENT_ID } from '../content/act1/events'
import { ACT1_RELICS } from '../content/act1/relics'
import type { SessionAction } from './sessionActions'
import { gainBlock } from '../combat/damage'
import type { CombatState } from '../combat/combatState'

const initialSession: GameSession = {
  phase: { kind: 'main_menu' },
  run: null,
}

export function createInitialSession(): GameSession {
  loadRegistry()
  return initialSession
}

function character() {
  return getRegistry().characters.get('arcanist')!
}

function pickEnemies(rng: SeededRNG, kind: 'battle' | 'elite' | 'boss'): string[] {
  if (kind === 'boss') return ['boss_archivist']
  if (kind === 'elite') return ['elite_sentinel']
  return [rng.pick(REGULAR_ENEMY_IDS)]
}

function startCombatPhase(run: RunState, encounter: 'battle' | 'elite' | 'boss', rng: SeededRNG): GameSession {
  const enemyDefIds = pickEnemies(rng, encounter)
  const maxEnergy = getMaxEnergyFromRelics(run.relics)
  let combat = createCombatState(run.deck, enemyDefIds, rng, maxEnergy, run.relics)
  const startBlock = getCombatStartBlock(run.relics)
  if (startBlock > 0) {
    combat = { ...combat, playerBlock: gainBlock(combat.playerBlock, startBlock) }
  }
  return {
    run,
    phase: { kind: 'combat', combat, encounter, enemyDefIds },
  }
}

function afterNodeComplete(session: GameSession): GameSession {
  const run = session.run!
  if (run.hp <= 0) {
    return { run, phase: { kind: 'game_over' } }
  }
  return { run, phase: { kind: 'map' } }
}

function collectDeckFromCombat(combat: CombatState) {
  return [...combat.drawPile, ...combat.hand, ...combat.discardPile, ...combat.exhaustPile]
}

function resolveCombatVictory(session: GameSession, rng: SeededRNG): GameSession {
  let run = session.run!
  const phase = session.phase
  if (phase.kind !== 'combat') return session

  run = { ...run, deck: collectDeckFromCombat(phase.combat) }

  const heal = getVictoryHealFromRelics(run.relics)
  run = { ...run, hp: Math.min(run.maxHp, run.hp + heal) }

  const node = run.currentNodeId ? getNode(run.map, run.currentNodeId) : null
  if (node?.type === 'boss') {
    return { run, phase: { kind: 'victory' } }
  }

  const gold = rollGoldReward(phase.encounter, rng)
  const cardOffers = rollCardOffers(character().cardPool, rng)
  const relicOffer = rollRelicOffer(
    phase.encounter,
    ACT1_RELICS.map((r) => r.id),
    run.relics,
    rng,
  )

  return {
    run: { ...run, gold: run.gold + gold },
    phase: {
      kind: 'reward',
      cardOffers,
      gold,
      relicOffer,
      encounter: phase.encounter,
      cardResolved: false,
    },
  }
}

export function sessionReducer(
  session: GameSession,
  action: SessionAction,
  rng: SeededRNG,
): GameSession {
  switch (action.type) {
    case 'NEW_RUN': {
      loadRegistry()
      resetCardInstanceCounter()
      const seed = action.seed ?? randomSeed()
      const char = character()
      const deck = deckFromDefIds(char.starterDeck)
      const map = generateMap(rng)
      const run: RunState = {
        seed,
        characterId: char.id,
        hp: char.maxHp,
        maxHp: char.maxHp,
        gold: 99,
        deck,
        relics: [],
        map,
        currentNodeId: null,
      }
      return { run, phase: { kind: 'map' } }
    }

    case 'MAP_PICK_NODE': {
      const run = session.run
      if (!run || session.phase.kind !== 'map') return session
      if (!run.map.availableNodeIds.includes(action.nodeId)) return session

      const node = getNode(run.map, action.nodeId)
      if (!node) return session

      const map = advanceMap(run.map, action.nodeId)
      let nextRun: RunState = { ...run, map, currentNodeId: action.nodeId }

      switch (node.type) {
        case 'battle':
          return startCombatPhase(nextRun, 'battle', rng)
        case 'elite':
          return startCombatPhase(nextRun, 'elite', rng)
        case 'boss':
          return startCombatPhase(nextRun, 'boss', rng)
        case 'shop': {
          const shop = createShop(rng, character().cardPool, ACT1_RELICS.map((r) => r.id))
          return { run: nextRun, phase: { kind: 'shop', shop } }
        }
        case 'rest':
          return { run: nextRun, phase: { kind: 'rest' } }
        case 'event': {
          const eventId = rng.pick(ACT1_EVENTS).id ?? FALLBACK_EVENT_ID
          return { run: nextRun, phase: { kind: 'event', eventId } }
        }
        default:
          return session
      }
    }

    case 'COMBAT': {
      if (session.phase.kind !== 'combat' || !session.run) return session
      const result = combatReducer(session.phase.combat, action.action, {
        playerHp: session.run.hp,
        playerMaxHp: session.run.maxHp,
        rng,
      })
      let run = { ...session.run, hp: result.playerHp }
      let combat = result.state

      if (combat.phase === 'won') {
        return resolveCombatVictory({ ...session, run, phase: { ...session.phase, combat } }, rng)
      }
      if (combat.phase === 'lost') {
        return { run, phase: { kind: 'game_over' } }
      }
      return {
        run,
        phase: { ...session.phase, combat },
      }
    }

    case 'REWARD_PICK_CARD': {
      if (session.phase.kind !== 'reward' || !session.run) return session
      const { cardOffers } = session.phase
      if (!cardOffers.includes(action.cardId) || session.phase.cardResolved) return session
      const run = {
        ...session.run,
        deck: [...session.run.deck, createCardInstance(action.cardId)],
      }
      const phase = { ...session.phase, cardOffers: [], cardResolved: true }
      if (!phase.relicOffer) return afterNodeComplete({ ...session, run, phase })
      return { ...session, run, phase }
    }

    case 'REWARD_SKIP_CARD':
      if (session.phase.kind !== 'reward' || !session.run || session.phase.cardResolved) return session
      {
        const phase = { ...session.phase, cardOffers: [], cardResolved: true }
        if (!phase.relicOffer) return afterNodeComplete({ ...session, phase })
        return { ...session, phase }
      }

    case 'REWARD_TAKE_RELIC': {
      if (session.phase.kind !== 'reward' || !session.run || !session.phase.relicOffer) return session
      const relicOffer = session.phase.relicOffer
      const run = {
        ...session.run,
        relics: session.run.relics.includes(relicOffer)
          ? session.run.relics
          : [...session.run.relics, relicOffer],
      }
      return afterNodeComplete({
        ...session,
        run,
        phase: { ...session.phase, relicOffer: null },
      })
    }

    case 'REWARD_CONTINUE':
      if (session.phase.kind !== 'reward' || !session.run) return session
      return afterNodeComplete(session)

    case 'SHOP_BUY': {
      if (session.phase.kind !== 'shop' || !session.run) return session
      const offer = session.phase.shop.offers[action.offerIndex]
      if (!offer || offer.purchased) return session
      if (session.run.gold < offer.price) return session

      let run = { ...session.run, gold: session.run.gold - offer.price }
      const offers = [...session.phase.shop.offers]
      offers[action.offerIndex] = { ...offer, purchased: true }

      if (offer.kind === 'card' && offer.cardId) {
        run = {
          ...run,
          deck: [...run.deck, createCardInstance(offer.cardId)],
        }
      } else if (offer.kind === 'relic' && offer.relicId && !run.relics.includes(offer.relicId)) {
        run = { ...run, relics: [...run.relics, offer.relicId] }
      }

      return {
        run,
        phase: { kind: 'shop', shop: { offers } },
      }
    }

    case 'SHOP_REMOVE_CARD': {
      if (session.phase.kind !== 'shop' || !session.run) return session
      const removeOffer = session.phase.shop.offers.find((o) => o.kind === 'remove')
      if (!removeOffer || removeOffer.purchased) return session
      if (session.run.gold < removeOffer.price) return session
      const deck = [...session.run.deck]
      if (!deck[action.deckIndex]) return session
      deck.splice(action.deckIndex, 1)
      const offers = session.phase.shop.offers.map((o) =>
        o.kind === 'remove' ? { ...o, purchased: true } : o,
      )
      return {
        run: { ...session.run, deck, gold: session.run.gold - removeOffer.price },
        phase: { kind: 'shop', shop: { offers } },
      }
    }

    case 'SHOP_LEAVE':
      if (session.phase.kind !== 'shop' || !session.run) return session
      return afterNodeComplete(session)

    case 'REST_HEAL': {
      if (session.phase.kind !== 'rest' || !session.run) return session
      const heal = Math.floor(session.run.maxHp * 0.3)
      const run = { ...session.run, hp: Math.min(session.run.maxHp, session.run.hp + heal) }
      return afterNodeComplete({ ...session, run })
    }

    case 'REST_UPGRADE': {
      if (session.phase.kind !== 'rest' || !session.run) return session
      const deck = session.run.deck.map((c) =>
        c.instanceId === action.instanceId ? { ...c, upgraded: true } : c,
      )
      const run = { ...session.run, deck }
      return afterNodeComplete({ ...session, run })
    }

    case 'REST_LEAVE':
      if (session.phase.kind !== 'rest' || !session.run) return session
      return afterNodeComplete(session)

    case 'EVENT_CHOICE': {
      if (session.phase.kind !== 'event' || !session.run) return session
      const def = getRegistry().events.get(session.phase.eventId)
      if (!def) return afterNodeComplete(session)
      const choice = def.choices[action.choiceIndex]
      if (!choice) return session

      // Pay costs upfront for gold-negative effects
      const goldCost = choice.effects
        .filter((e) => e.type === 'gold' && e.amount < 0)
        .reduce((s, e) => s + (e.type === 'gold' ? -e.amount : 0), 0)
      if (session.run.gold < goldCost) return session

      let run = applyRunEffects(session.run, choice.effects, rng)

      // Shrine pray: damage 6 for relic
      if (session.phase.eventId === 'event_shrine' && action.choiceIndex === 0) {
        run = { ...run, hp: Math.max(1, run.hp - 6) }
        if (!run.relics.includes('relic_vial')) {
          run = { ...run, relics: [...run.relics, 'relic_vial'] }
        }
      }

      if (run.hp <= 0) {
        return { run, phase: { kind: 'game_over' } }
      }
      return afterNodeComplete({ ...session, run })
    }

    case 'GO_MAIN_MENU':
      return createInitialSession()

    default:
      return session
  }
}
