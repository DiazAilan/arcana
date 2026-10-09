import type { PowerKind } from '../models/effects'

export function getPower(stacks: Partial<Record<PowerKind, number>>, kind: PowerKind): number {
  return stacks[kind] ?? 0
}

export function addPower(
  stacks: Partial<Record<PowerKind, number>>,
  kind: PowerKind,
  amount: number,
): Partial<Record<PowerKind, number>> {
  const next = { ...stacks }
  next[kind] = (next[kind] ?? 0) + amount
  if (next[kind]! <= 0) delete next[kind]
  return next
}

/** Damage multiplier from vulnerable (take 50% more) */
export function vulnerableMultiplier(stacks: Partial<Record<PowerKind, number>>): number {
  return getPower(stacks, 'vulnerable') > 0 ? 1.5 : 1
}

/** Outgoing attack multiplier from weak */
export function weakMultiplier(stacks: Partial<Record<PowerKind, number>>): number {
  return getPower(stacks, 'weak') > 0 ? 0.75 : 1
}

export function tickDownTurnPowers(stacks: Partial<Record<PowerKind, number>>): Partial<
  Record<PowerKind, number>
> {
  const next = { ...stacks }
  for (const kind of ['vulnerable', 'weak'] as const) {
    if (next[kind]) {
      next[kind]! -= 1
      if (next[kind]! <= 0) delete next[kind]
    }
  }
  return next
}
