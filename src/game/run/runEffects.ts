import type { RunEffect } from '../models/effects'
import type { RunState } from '../models/session'
import { createCardInstance } from '../models/card'
import type { SeededRNG } from '../rng/SeededRNG'

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
      case 'add_relic':
        if (!next.relics.includes(effect.relicId)) {
          next = { ...next, relics: [...next.relics, effect.relicId] }
        }
        break
      default:
        break
    }
  }

  return next
}
