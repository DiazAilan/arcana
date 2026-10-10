import { getRegistry } from '../content/registry'
import type { CardInstance } from '../models/card'
import { MAX_INFLUENCES_PER_ITEM } from '../models/influence'
import type { RelicInstance } from '../models/relicInstance'

export function canAddInfluence(current: string[], influenceId: string): boolean {
  if (current.includes(influenceId)) return false
  if (current.length >= MAX_INFLUENCES_PER_ITEM) return false
  const def = getRegistry().influences.get(influenceId)
  if (!def) return false
  return true
}

export function addInfluenceToCard(card: CardInstance, influenceId: string): CardInstance | null {
  const def = getRegistry().influences.get(influenceId)
  if (!def || def.relicOnly) return null
  if (!canAddInfluence(card.influences, influenceId)) return null
  return { ...card, influences: [...card.influences, influenceId] }
}

export function addInfluenceToRelic(relic: RelicInstance, influenceId: string): RelicInstance | null {
  const registry = getRegistry()
  const inf = registry.influences.get(influenceId)
  if (!inf || inf.cardOnly) return null
  const relicDef = registry.relics.get(relic.defId)
  if (!relicDef?.influenceEligible && !relicDef?.isHeart) return null
  if (!canAddInfluence(relic.influences, influenceId)) return null
  return { ...relic, influences: [...relic.influences, influenceId] }
}

/** Remove one influence by id (purification). */
export function removeInfluenceFromCard(card: CardInstance, influenceId: string): CardInstance | null {
  if (!card.influences.includes(influenceId)) return null
  return {
    ...card,
    influences: card.influences.filter((id) => id !== influenceId),
  }
}

export function removeBaneFromCard(card: CardInstance): CardInstance | null {
  const registry = getRegistry()
  const baneId = card.influences.find((id) => registry.influences.get(id)?.polarity === 'bane')
  if (!baneId) return null
  return removeInfluenceFromCard(card, baneId)
}

export function removeBaneFromRelic(relic: RelicInstance): RelicInstance | null {
  const registry = getRegistry()
  const baneId = relic.influences.find((id) => registry.influences.get(id)?.polarity === 'bane')
  if (!baneId) return null
  return {
    ...relic,
    influences: relic.influences.filter((id) => id !== baneId),
  }
}

export function pickRandomDeckCardForInfluence(
  deck: CardInstance[],
  influenceId: string,
  rng: { nextInt(n: number): number },
): CardInstance | null {
  const eligible = deck.filter((c) => canAddInfluence(c.influences, influenceId))
  if (eligible.length === 0) return null
  return eligible[rng.nextInt(eligible.length)] ?? null
}

export function pickRandomRelicForInfluence(
  relics: RelicInstance[],
  influenceId: string,
  rng: { nextInt(n: number): number },
): RelicInstance | null {
  const eligible = relics.filter((r) => addInfluenceToRelic(r, influenceId) != null)
  if (eligible.length === 0) return null
  return eligible[rng.nextInt(eligible.length)] ?? null
}
