import { getRegistry } from '../content/registry'
import type { CardInstance } from '../models/card'
import type { CombatEffect } from '../models/effects'
import { patchEffectsWithModifiers } from '../models/influence'

export type ResolvedCard = {
  cost: number
  description: string
  effects: CombatEffect[]
  artKey: string
  influenceNames: string[]
}

export function resolveCard(card: Pick<CardInstance, 'defId' | 'upgraded' | 'influences'>): ResolvedCard {
  const registry = getRegistry()
  const def = registry.cards.get(card.defId)
  if (!def) {
    return { cost: 0, description: '', effects: [], artKey: card.defId, influenceNames: [] }
  }

  const baseDesc = card.upgraded && def.upgrade ? def.upgrade.description : def.description
  let effects: CombatEffect[] =
    card.upgraded && def.upgrade ? [...def.upgrade.effects] : [...def.effects]
  let cost =
    card.upgraded && def.upgrade?.cost != null ? def.upgrade.cost : def.cost

  const influenceNames: string[] = []
  let artKey = def.artKey ?? def.id
  let artSuffix: string | undefined

  for (const infId of card.influences) {
    const inf = registry.influences.get(infId)
    if (!inf || inf.relicOnly) continue
    influenceNames.push(inf.name)
    effects = patchEffectsWithModifiers(effects, inf.modifiers)
    for (const mod of inf.modifiers) {
      if (mod.kind === 'cost_delta') cost = Math.max(0, cost + mod.amount)
    }
    if (inf.artSuffix) artSuffix = inf.artSuffix
  }

  if (artSuffix) {
    const variantKey = `${artKey}_${artSuffix}`
    artKey = variantKey
  }

  return { cost, description: baseDesc, effects, artKey, influenceNames }
}

/** Card stats/effects as if influences were stripped (for UI diffs). */
export function resolveCardWithoutInfluences(
  card: Pick<CardInstance, 'defId' | 'upgraded' | 'influences'>,
): ResolvedCard {
  return resolveCard({ ...card, influences: [] })
}

export function resolveCardArtKey(card: Pick<CardInstance, 'defId' | 'influences'>): string {
  const registry = getRegistry()
  const def = registry.cards.get(card.defId)
  let artKey = def?.artKey ?? card.defId
  for (const infId of card.influences) {
    const inf = registry.influences.get(infId)
    if (inf?.artSuffix) artKey = `${def?.artKey ?? card.defId}_${inf.artSuffix}`
  }
  return artKey
}
