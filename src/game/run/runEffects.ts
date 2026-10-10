import { getRegistry } from '../content/registry'
import type { RunEffect } from '../models/effects'
import type { RunState } from '../models/session'
import { createCardInstance } from '../models/card'
import { createRelicInstance } from '../models/relicInstance'
import type { SeededRNG } from '../rng/SeededRNG'
import {
  addInfluenceToCard,
  addInfluenceToRelic,
  pickRandomDeckCardForInfluence,
  pickRandomRelicForInfluence,
  removeBaneFromCard,
  removeBaneFromRelic,
  removeInfluenceFromCard,
} from './influenceApply'

export function applyRunEffects(
  run: RunState,
  effects: RunEffect[],
  rng: SeededRNG,
): RunState {
  let next = run

  for (const effect of effects) {
    switch (effect.type) {
      case 'gold':
        next = { ...next, gold: Math.max(0, next.gold + effect.amount) }
        break
      case 'damage_player':
        next = { ...next, hp: Math.max(0, next.hp - effect.amount) }
        break
      case 'heal_player':
        next = { ...next, hp: Math.min(next.maxHp, next.hp + effect.amount) }
        break
      case 'add_card':
        next = {
          ...next,
          deck: [...next.deck, createCardInstance(effect.cardId, effect.upgraded ?? false)],
        }
        break
      case 'remove_random_card':
        if (next.deck.length > 0) {
          const idx = rng.nextInt(next.deck.length)
          const deck = [...next.deck]
          deck.splice(idx, 1)
          next = { ...next, deck }
        }
        break
      case 'add_relic': {
        const owns = next.relics.some((r) => r.defId === effect.relicId)
        if (!owns) {
          next = { ...next, relics: [...next.relics, createRelicInstance(effect.relicId)] }
        }
        break
      }
      case 'set_flag':
        next = {
          ...next,
          flags: { ...next.flags, [effect.flag]: effect.value },
        }
        break
      case 'max_hp_delta': {
        const maxHp = Math.max(1, next.maxHp + effect.amount)
        next = { ...next, maxHp, hp: Math.min(maxHp, next.hp) }
        break
      }
      case 'add_influence_random_card': {
        const card = pickRandomDeckCardForInfluence(next.deck, effect.influenceId, rng)
        if (card) {
          const updated = addInfluenceToCard(card, effect.influenceId)
          if (updated) {
            next = {
              ...next,
              deck: next.deck.map((c) => (c.instanceId === card.instanceId ? updated : c)),
            }
          }
        }
        break
      }
      case 'add_influence_card': {
        if (effect.instanceId) {
          next = {
            ...next,
            deck: next.deck.map((c) => {
              if (c.instanceId !== effect.instanceId) return c
              return addInfluenceToCard(c, effect.influenceId) ?? c
            }),
          }
        }
        break
      }
      case 'add_influence_relic': {
        if (effect.relicInstanceId) {
          next = {
            ...next,
            relics: next.relics.map((r) => {
              if (r.instanceId !== effect.relicInstanceId) return r
              return addInfluenceToRelic(r, effect.influenceId) ?? r
            }),
          }
        }
        break
      }
      case 'add_influence_random_relic': {
        const relic = pickRandomRelicForInfluence(next.relics, effect.influenceId, rng)
        if (relic) {
          const updated = addInfluenceToRelic(relic, effect.influenceId)
          if (updated) {
            next = {
              ...next,
              relics: next.relics.map((r) => (r.instanceId === relic.instanceId ? updated : r)),
            }
          }
        }
        break
      }
      case 'purify_random_bane_card': {
        const withBane = next.deck.filter((c) => removeBaneFromCard(c) != null)
        if (withBane.length > 0) {
          const pick = withBane[rng.nextInt(withBane.length)]!
          const updated = removeBaneFromCard(pick)
          if (updated) {
            next = {
              ...next,
              deck: next.deck.map((c) => (c.instanceId === pick.instanceId ? updated : c)),
            }
          }
        }
        break
      }
      case 'purify_card': {
        next = {
          ...next,
          deck: next.deck.map((c) => {
            if (c.instanceId !== effect.instanceId) return c
            const baneId = c.influences.find(
              (id) => getRegistry().influences.get(id)?.polarity === 'bane',
            )
            if (!baneId) return c
            return removeInfluenceFromCard(c, baneId) ?? c
          }),
        }
        break
      }
      case 'purify_relic': {
        next = {
          ...next,
          relics: next.relics.map((r) => {
            if (r.instanceId !== effect.instanceId) return r
            return removeBaneFromRelic(r) ?? r
          }),
        }
        break
      }
      default:
        break
    }
  }

  return next
}
