import type { CombatEffect } from '../models/effects'

export function requiresEnemyTarget(effects: CombatEffect[]): boolean {
  return effects.some(
    (e) =>
      (e.type === 'damage' && e.target === 'enemy') ||
      (e.type === 'apply_power' && e.target === 'enemy'),
  )
}

export function canPlayWithoutTarget(effects: CombatEffect[]): boolean {
  return !requiresEnemyTarget(effects)
}
