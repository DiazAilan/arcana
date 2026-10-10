import { getRegistry } from '../content/registry'
import type { RunEffect } from '../models/effects'
import type { RunState } from '../models/session'

function removedCardName(runBefore: RunState, runAfter: RunState): string | undefined {
  const afterIds = new Set(runAfter.deck.map((c) => c.instanceId))
  const removed = runBefore.deck.filter((c) => !afterIds.has(c.instanceId))
  if (removed.length !== 1) return undefined
  return getRegistry().cards.get(removed[0]!.defId)?.name
}

export function formatRunEffectOutcomes(
  effects: RunEffect[],
  runBefore: RunState,
  runAfter: RunState,
  options?: { deferAddCard?: boolean },
): string[] {
  const lines: string[] = []
  const registry = getRegistry()

  for (const effect of effects) {
    switch (effect.type) {
      case 'gold':
        if (effect.amount > 0) lines.push(`Gained ${effect.amount} gold.`)
        else if (effect.amount < 0) lines.push(`Spent ${-effect.amount} gold.`)
        break
      case 'damage_player':
        lines.push(`Lost ${effect.amount} HP.`)
        break
      case 'heal_player':
        lines.push(`Healed ${effect.amount} HP.`)
        break
      case 'add_card': {
        const name = registry.cards.get(effect.cardId)?.name ?? effect.cardId
        if (options?.deferAddCard) {
          lines.push(`Offered ${name}.`)
        } else {
          lines.push(`Added ${name} to your deck.`)
        }
        break
      }
      case 'add_relic': {
        const relic = registry.relics.get(effect.relicId)
        lines.push(`Received ${relic?.name ?? effect.relicId}.`)
        break
      }
      case 'remove_random_card': {
        const name = removedCardName(runBefore, runAfter)
        lines.push(name ? `Removed ${name} from your deck.` : 'Removed a card from your deck.')
        break
      }
      default:
        break
    }
  }

  const hpDelta = runAfter.hp - runBefore.hp
  if (effects.every((e) => e.type !== 'heal_player' && e.type !== 'damage_player') && hpDelta !== 0) {
    if (hpDelta > 0) lines.push(`Healed ${hpDelta} HP.`)
    else lines.push(`Lost ${-hpDelta} HP.`)
  }

  return lines
}
