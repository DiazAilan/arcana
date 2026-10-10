import type { EncounterKind } from '../models/session'
import type { SeededRNG } from '../rng/SeededRNG'
import { HEART_RELIC_IDS } from '../content/act1/relics'

export function rollGoldReward(encounter: EncounterKind, rng: SeededRNG): number {
  switch (encounter) {
    case 'battle':
      return 15 + rng.nextInt(11)
    case 'elite':
      return 35 + rng.nextInt(16)
    case 'boss':
      return 95 + rng.nextInt(21)
    default:
      return 10
  }
}

export function rollCardOffers(cardPool: string[], rng: SeededRNG, count = 3): string[] {
  const pool = [...cardPool]
  const picks: string[] = []
  for (let i = 0; i < count; i++) {
    picks.push(rng.pick(pool))
  }
  return picks
}

export function rollRelicOffer(
  encounter: EncounterKind,
  relicPool: string[],
  owned: string[],
  rng: SeededRNG,
): string | null {
  if (encounter === 'battle') return null
  const chance = encounter === 'boss' ? 1 : 0.4
  if (rng.next() > chance) return null
  const available = relicPool.filter((id) => !owned.includes(id))
  if (available.length === 0) return null
  const hearts = available.filter((id) => HEART_RELIC_IDS.includes(id))
  const mundane = available.filter((id) => !HEART_RELIC_IDS.includes(id))
  const heartChance = encounter === 'boss' ? 0.35 : 0.12
  if (hearts.length > 0 && rng.next() < heartChance) {
    return rng.pick(hearts)
  }
  return rng.pick(mundane.length > 0 ? mundane : available)
}
