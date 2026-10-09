import type { CombatEffect } from '../models/effects'
import type { CombatState } from './combatState'
import { getRegistry } from '../content/registry'
import { dealDamageToEnemy, gainBlock } from './damage'
import { addPower, getPower } from './powers'
import { drawCards } from './deck'

export type EffectContext = {
  targetEnemyIndex?: number
  playerMaxHp?: number
}

function damageAmount(state: CombatState, base: number): number {
  return base + getPower(state.playerPowers, 'strength')
}

function blockAmount(state: CombatState, base: number): number {
  return base + getPower(state.playerPowers, 'dexterity')
}

export function applyCombatEffects(
  state: CombatState,
  effects: CombatEffect[],
  ctx: EffectContext,
  playerHp: number,
): { state: CombatState; playerHp: number } {
  let next = state
  let hp = playerHp

  for (const effect of effects) {
    switch (effect.type) {
      case 'damage': {
        const dmg = damageAmount(next, effect.amount)
        if (effect.target === 'enemy' || effect.target === 'self') {
          const idx = ctx.targetEnemyIndex ?? 0
          if (next.enemies[idx]) {
            const enemies = [...next.enemies]
            enemies[idx] = dealDamageToEnemy(enemies[idx]!, dmg)
            next = { ...next, enemies }
          }
        } else if (effect.target === 'all_enemies') {
          next = {
            ...next,
            enemies: next.enemies.map((e) => dealDamageToEnemy(e, dmg)),
          }
        }
        break
      }
      case 'block':
        next = { ...next, playerBlock: gainBlock(next.playerBlock, blockAmount(next, effect.amount)) }
        break
      case 'gain_energy':
        next = { ...next, energy: next.energy + effect.amount }
        break
      case 'draw': {
        const drawn = drawCards(next, effect.amount)
        next = drawn.state
        break
      }
      case 'apply_power': {
        const amount = effect.amount
        if (effect.target === 'self') {
          next = {
            ...next,
            playerPowers: addPower(next.playerPowers, effect.power, amount),
          }
        } else {
          const idx = ctx.targetEnemyIndex ?? 0
          const enemies = [...next.enemies]
          const enemy = enemies[idx]
          if (enemy) {
            enemies[idx] = {
              ...enemy,
              powers: addPower(enemy.powers, effect.power, amount),
            }
            next = { ...next, enemies }
          }
        }
        break
      }
      case 'heal': {
        const cap = ctx.playerMaxHp ?? hp + effect.amount
        hp = Math.min(hp + effect.amount, cap)
        break
      }
      default:
        break
    }
  }

  return { state: next, playerHp: hp }
}

export function getCardEffects(defId: string, upgraded: boolean): CombatEffect[] {
  const def = getRegistry().cards.get(defId)
  if (!def) return []
  if (upgraded && def.upgrade) return def.upgrade.effects
  return def.effects
}
