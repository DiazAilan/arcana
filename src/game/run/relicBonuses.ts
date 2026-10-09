import { getRegistry } from '../content/registry'

export function getMaxEnergyFromRelics(relicIds: string[], base = 3): number {
  let max = base
  const registry = getRegistry()
  for (const id of relicIds) {
    const relic = registry.relics.get(id)
    if (relic?.energyBonus) max += relic.energyBonus
  }
  return max
}

export function getVictoryHealFromRelics(relicIds: string[]): number {
  let heal = 0
  const registry = getRegistry()
  for (const id of relicIds) {
    const relic = registry.relics.get(id)
    if (relic?.victoryHeal) heal += relic.victoryHeal
  }
  return heal
}

export function getStartingGoldBonus(relicIds: string[]): number {
  if (relicIds.includes('relic_pouch')) return 20
  return 0
}

export function getCombatStartBlock(relicIds: string[]): number {
  if (relicIds.includes('relic_sigil')) return 4
  return 0
}
