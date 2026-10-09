import type { PowerKind } from './effects'

export type IntentKind = 'attack' | 'block' | 'buff' | 'debuff'

export type IntentDef = {
  kind: IntentKind
  /** Attack damage, block amount, or power stacks */
  value: number
  power?: PowerKind
}

export type EnemyDef = {
  id: string
  name: string
  maxHp: number
  intents: IntentDef[]
}

export type EnemyInstance = {
  instanceId: string
  defId: string
  hp: number
  maxHp: number
  block: number
  powers: Partial<Record<PowerKind, number>>
  intentIndex: number
}

let enemyInstanceCounter = 0

export function createEnemyInstance(defId: string, def: { maxHp: number }): EnemyInstance {
  enemyInstanceCounter += 1
  return {
    instanceId: `e-${enemyInstanceCounter}`,
    defId,
    hp: def.maxHp,
    maxHp: def.maxHp,
    block: 0,
    powers: {},
    intentIndex: 0,
  }
}

export function resetEnemyInstanceCounter(): void {
  enemyInstanceCounter = 0
}
