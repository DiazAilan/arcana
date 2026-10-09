import type { EnemyInstance } from '../models/enemy'
import { vulnerableMultiplier } from './powers'

export function dealDamageToEnemy(enemy: EnemyInstance, raw: number): EnemyInstance {
  const mult = vulnerableMultiplier(enemy.powers)
  let dmg = Math.floor(raw * mult)
  let block = enemy.block
  if (block > 0) {
    const absorbed = Math.min(block, dmg)
    block -= absorbed
    dmg -= absorbed
  }
  return {
    ...enemy,
    block,
    hp: Math.max(0, enemy.hp - dmg),
  }
}

export function dealDamageToPlayer(
  block: number,
  hp: number,
  raw: number,
  playerPowers: Parameters<typeof vulnerableMultiplier>[0],
): { block: number; hp: number } {
  const mult = vulnerableMultiplier(playerPowers)
  let dmg = Math.floor(raw * mult)
  let b = block
  if (b > 0) {
    const absorbed = Math.min(b, dmg)
    b -= absorbed
    dmg -= absorbed
  }
  return { block: b, hp: Math.max(0, hp - dmg) }
}

export function gainBlock(current: number, amount: number): number {
  return current + amount
}
