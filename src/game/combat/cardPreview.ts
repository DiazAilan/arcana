import type { CombatEffect } from '../models/effects'
import type { EnemyInstance } from '../models/enemy'
import type { CombatState } from './combatState'
import { dealDamageToEnemy } from './damage'
import { getPower, vulnerableMultiplier, weakMultiplier } from './powers'

export type CardStatKind = 'damage' | 'block' | 'heal'

export type CardStatPreview = {
  kind: CardStatKind
  base: number
  effective: number
  label: string
  symbol: string
}

export type CardBaseStat = {
  kind: CardStatKind
  value: number
  label: string
  symbol: string
}

export type CardPreviewOptions = {
  targetEnemyIndex?: number
}

const STAT_META: Record<CardStatKind, { label: string; symbol: string }> = {
  damage: { label: 'Damage', symbol: '⚔' },
  block: { label: 'Block', symbol: '🛡' },
  heal: { label: 'Heal', symbol: '♥' },
}

export function outgoingDamageRaw(state: Pick<CombatState, 'playerPowers'>, base: number): number {
  const boosted = base + getPower(state.playerPowers, 'strength')
  return Math.floor(boosted * weakMultiplier(state.playerPowers))
}

export function previewBlockAmount(state: Pick<CombatState, 'playerPowers'>, base: number): number {
  return base + getPower(state.playerPowers, 'dexterity')
}

function effectiveDamageOnTarget(
  state: Pick<CombatState, 'playerPowers' | 'enemies'>,
  base: number,
  targetEnemyIndex?: number,
): number {
  const raw = outgoingDamageRaw(state, base)
  if (targetEnemyIndex == null) return raw
  const enemy = state.enemies[targetEnemyIndex]
  if (!enemy) return raw
  return Math.floor(raw * vulnerableMultiplier(enemy.powers))
}

export function previewEnemyHpAfterCard(
  enemy: EnemyInstance,
  state: Pick<CombatState, 'playerPowers' | 'enemies'>,
  effects: CombatEffect[],
  _targetEnemyIndex: number,
): number {
  let sim = enemy
  for (const effect of effects) {
    if (effect.type !== 'damage') continue
    if (effect.target === 'enemy') {
      const raw = outgoingDamageRaw(state, effect.amount)
      sim = dealDamageToEnemy(sim, raw)
    } else if (effect.target === 'all_enemies') {
      const raw = outgoingDamageRaw(state, effect.amount)
      sim = dealDamageToEnemy(sim, raw)
    }
  }
  return sim.hp
}

export function getCardStatPreviews(
  state: Pick<CombatState, 'playerPowers' | 'enemies'>,
  effects: CombatEffect[],
  options?: CardPreviewOptions,
): CardStatPreview[] {
  const target = options?.targetEnemyIndex
  const out: CardStatPreview[] = []

  for (const effect of effects) {
    switch (effect.type) {
      case 'damage': {
        if (effect.target === 'self') break
        const base = effect.amount
        const effective = effectiveDamageOnTarget(state, base, target)
        out.push({ kind: 'damage', base, effective, ...STAT_META.damage })
        break
      }
      case 'block': {
        const base = effect.amount
        const effective = previewBlockAmount(state, base)
        out.push({ kind: 'block', base, effective, ...STAT_META.block })
        break
      }
      case 'heal': {
        const base = effect.amount
        out.push({ kind: 'heal', base, effective: base, ...STAT_META.heal })
        break
      }
      default:
        break
    }
  }

  return out
}

export function getCardBaseStats(effects: CombatEffect[]): CardBaseStat[] {
  const out: CardBaseStat[] = []
  for (const effect of effects) {
    switch (effect.type) {
      case 'damage':
        if (effect.target === 'self') break
        out.push({ kind: 'damage', value: effect.amount, ...STAT_META.damage })
        break
      case 'block':
        out.push({ kind: 'block', value: effect.amount, ...STAT_META.block })
        break
      case 'heal':
        out.push({ kind: 'heal', value: effect.amount, ...STAT_META.heal })
        break
      default:
        break
    }
  }
  return out
}

export function cardHasEnemyTargetDamage(effects: CombatEffect[]): boolean {
  return effects.some((e) => e.type === 'damage' && (e.target === 'enemy' || e.target === 'all_enemies'))
}
