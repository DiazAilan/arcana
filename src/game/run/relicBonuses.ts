import { getRegistry } from '../content/registry'
import type { RelicInstance } from '../models/relicInstance'
import { aggregateRelicStats } from './resolveRelic'

export function getMaxEnergyFromRelics(relics: RelicInstance[], base = 3): number {
  return base + aggregateRelicStats(relics).energyBonus
}

export function getVictoryHealFromRelics(relics: RelicInstance[]): number {
  return aggregateRelicStats(relics).victoryHeal
}

export function getFloorGoldFromRelics(relics: RelicInstance[]): number {
  let total = 0
  const registry = getRegistry()
  for (const relic of relics) {
    const def = registry.relics.get(relic.defId)
    if (def?.floorGold) total += def.floorGold
  }
  return total
}

export function getCombatStartBlock(relics: RelicInstance[]): number {
  return aggregateRelicStats(relics).combatStartBlock
}
