import type { EnemyDef, EnemyInstance, IntentDef } from '../models/enemy'
import type { CombatState } from './combatState'
import { dealDamageToPlayer, gainBlock } from './damage'
import { addPower, getPower, weakMultiplier } from './powers'
import { getRegistry } from '../content/registry'

export function getCurrentIntent(enemy: EnemyInstance): IntentDef | null {
  const def = getRegistry().enemies.get(enemy.defId)
  if (!def || def.intents.length === 0) return null
  return def.intents[enemy.intentIndex % def.intents.length]!
}

export function advanceIntent(enemy: EnemyInstance, def: EnemyDef): EnemyInstance {
  return {
    ...enemy,
    intentIndex: (enemy.intentIndex + 1) % def.intents.length,
  }
}

export function executeEnemyTurn(
  state: CombatState,
  playerHp: number,
  playerMaxHp: number,
): { state: CombatState; playerHp: number } {
  let next = { ...state, phase: 'player' as const }
  let hp = playerHp
  const enemies = [...next.enemies]

  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i]!
    const def = getRegistry().enemies.get(enemy.defId)
    if (!def || enemy.hp <= 0) continue

    const intent = getCurrentIntent(enemy)
    if (intent) {
      switch (intent.kind) {
        case 'attack': {
          let dmg = intent.value + getPower(enemy.powers, 'strength')
          dmg = Math.floor(dmg * weakMultiplier(enemy.powers))
          const result = dealDamageToPlayer(next.playerBlock, hp, dmg, next.playerPowers)
          next = { ...next, playerBlock: result.block }
          hp = result.hp
          break
        }
        case 'block':
          enemy = { ...enemy, block: gainBlock(enemy.block, intent.value) }
          break
        case 'buff':
          if (intent.power) {
            enemy = {
              ...enemy,
              powers: addPower(enemy.powers, intent.power, intent.value),
            }
          }
          break
        case 'debuff':
          if (intent.power) {
            next = {
              ...next,
              playerPowers: addPower(next.playerPowers, intent.power, intent.value),
            }
          }
          break
      }
    }

    enemies[i] = advanceIntent(enemy, def)
  }

  next = {
    ...next,
    enemies,
    turn: next.turn + 1,
    energy: next.maxEnergy,
    playerBlock: next.playerBlock,
    playerPowers: next.playerPowers,
  }

  if (hp <= 0) {
    return { state: { ...next, phase: 'lost' }, playerHp: hp }
  }

  void playerMaxHp
  return { state: next, playerHp: hp }
}
