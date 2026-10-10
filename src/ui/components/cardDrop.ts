import type { CombatEffect } from '../../game/models/effects'
import { requiresEnemyTarget } from '../../game/combat/cardTargeting'

export type DropTarget = { hand: boolean; enemyIndex: number | null }

export function findDropTarget(clientX: number, clientY: number): DropTarget {
  const el = document.elementFromPoint(clientX, clientY)
  if (!el) return { hand: false, enemyIndex: null }
  const handZone = el.closest('[data-hand-zone]')
  if (handZone) return { hand: true, enemyIndex: null }
  const enemyEl = el.closest('[data-enemy-drop]')
  if (enemyEl) {
    const idx = Number(enemyEl.getAttribute('data-enemy-drop'))
    if (!Number.isNaN(idx)) return { hand: false, enemyIndex: idx }
  }
  return { hand: false, enemyIndex: null }
}

export type DropPlayResult = { action: 'cancel' } | { action: 'play'; targetEnemyIndex?: number }

export function resolveDropPlay(effects: CombatEffect[], drop: DropTarget): DropPlayResult {
  if (drop.hand) return { action: 'cancel' }
  if (requiresEnemyTarget(effects)) {
    if (drop.enemyIndex != null) return { action: 'play', targetEnemyIndex: drop.enemyIndex }
    return { action: 'cancel' }
  }
  return { action: 'play' }
}
