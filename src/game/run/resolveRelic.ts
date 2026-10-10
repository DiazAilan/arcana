import { getRegistry } from '../content/registry'
import type { RelicInstance } from '../models/relicInstance'
import type { InfluenceModifier } from '../models/influence'

export type ResolvedRelicStats = {
  energyBonus: number
  victoryHeal: number
  combatStartDraw: number
  combatStartBlock: number
  descriptionSuffix: string
  artKey: string
}

function applyRelicModifiers(base: ResolvedRelicStats, modifiers: InfluenceModifier[]): ResolvedRelicStats {
  let next = { ...base }
  for (const mod of modifiers) {
    switch (mod.kind) {
      case 'relic_energy_bonus':
        next.energyBonus += mod.amount
        break
      case 'relic_victory_heal':
        next.victoryHeal += mod.amount
        break
      case 'relic_combat_start_draw':
        next.combatStartDraw += mod.amount
        break
      case 'relic_combat_start_block':
        next.combatStartBlock += mod.amount
        break
      default:
        break
    }
  }
  return next
}

export function resolveRelicInstance(relic: RelicInstance): ResolvedRelicStats {
  const registry = getRegistry()
  const def = registry.relics.get(relic.defId)
  const names: string[] = []
  let artKey = relic.defId
  let artSuffix: string | undefined

  let stats: ResolvedRelicStats = {
    energyBonus: def?.energyBonus ?? 0,
    victoryHeal: def?.victoryHeal ?? 0,
    combatStartDraw: def?.combatStartDraw ?? 0,
    combatStartBlock: relic.defId === 'relic_sigil' ? 4 : 0,
    descriptionSuffix: '',
    artKey,
  }

  for (const infId of relic.influences) {
    const inf = registry.influences.get(infId)
    if (!inf || inf.cardOnly) continue
    names.push(inf.name)
    stats = applyRelicModifiers(stats, inf.modifiers)
    if (inf.artSuffix) artSuffix = inf.artSuffix
  }

  if (artSuffix) artKey = `${relic.defId}_${artSuffix}`
  stats.artKey = artKey
  if (names.length > 0) {
    stats.descriptionSuffix = `\nInfluenced: ${names.join(', ')}.`
  }
  return stats
}

export function aggregateRelicStats(relics: RelicInstance[]): ResolvedRelicStats {
  let total: ResolvedRelicStats = {
    energyBonus: 0,
    victoryHeal: 0,
    combatStartDraw: 0,
    combatStartBlock: 0,
    descriptionSuffix: '',
    artKey: '',
  }
  for (const relic of relics) {
    const r = resolveRelicInstance(relic)
    total.energyBonus += r.energyBonus
    total.victoryHeal += r.victoryHeal
    total.combatStartDraw += r.combatStartDraw
    total.combatStartBlock += r.combatStartBlock
  }
  return total
}
