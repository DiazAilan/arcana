import type { CombatEffect } from './effects'

export type InfluencePolarity = 'boon' | 'bane' | 'neutral'

export type AttackTag = 'fire' | 'cold' | 'madness' | 'chaos' | 'pearl' | 'shard'

export type InfluenceModifier =
  | { kind: 'cost_delta'; amount: number }
  | { kind: 'damage_delta'; amount: number }
  | { kind: 'block_delta'; amount: number }
  | { kind: 'draw_delta'; amount: number }
  | { kind: 'heal_delta'; amount: number }
  | { kind: 'gain_energy_delta'; amount: number }
  | { kind: 'apply_power_delta'; amount: number }
  | { kind: 'relic_energy_bonus'; amount: number }
  | { kind: 'relic_victory_heal'; amount: number }
  | { kind: 'relic_combat_start_draw'; amount: number }
  | { kind: 'relic_combat_start_block'; amount: number }

export type InfluenceCombatTrigger = {
  onSurviveHit: true
  attackTag: AttackTag
  /** Match Heart domain on eligible relic (internal). */
  requiresHeartDomain?: 'creation' | 'chaos' | 'madness' | 'life' | 'passion' | 'still'
}

export type InfluenceDef = {
  id: string
  name: string
  description: string
  polarity: InfluencePolarity
  artSuffix?: string
  modifiers: InfluenceModifier[]
  cardOnly?: boolean
  relicOnly?: boolean
  combatTrigger?: InfluenceCombatTrigger
}

export const MAX_INFLUENCES_PER_ITEM = 2

export function patchEffectsWithModifiers(
  effects: CombatEffect[],
  modifiers: InfluenceModifier[],
): CombatEffect[] {
  let next = effects.map((e) => ({ ...e })) as CombatEffect[]

  for (const mod of modifiers) {
    switch (mod.kind) {
      case 'damage_delta':
        next = next.map((e) =>
          e.type === 'damage' ? { ...e, amount: Math.max(0, e.amount + mod.amount) } : e,
        )
        break
      case 'block_delta':
        next = next.map((e) =>
          e.type === 'block' ? { ...e, amount: Math.max(0, e.amount + mod.amount) } : e,
        )
        break
      case 'draw_delta':
        next = next.map((e) =>
          e.type === 'draw' ? { ...e, amount: Math.max(0, e.amount + mod.amount) } : e,
        )
        break
      case 'heal_delta':
        next = next.map((e) =>
          e.type === 'heal' ? { ...e, amount: Math.max(0, e.amount + mod.amount) } : e,
        )
        break
      case 'gain_energy_delta':
        next = next.map((e) =>
          e.type === 'gain_energy' ? { ...e, amount: Math.max(0, e.amount + mod.amount) } : e,
        )
        break
      case 'apply_power_delta':
        next = next.map((e) =>
          e.type === 'apply_power'
            ? { ...e, amount: Math.max(0, e.amount + mod.amount) }
            : e,
        )
        break
      default:
        break
    }
  }

  return next
}
