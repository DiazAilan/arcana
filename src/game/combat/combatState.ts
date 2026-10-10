import type { CardInstance } from '../models/card'
import type { EnemyInstance } from '../models/enemy'
import type { PowerKind } from '../models/effects'
import type { AttackTag } from '../models/influence'

export type CombatPhase = 'player' | 'enemy' | 'won' | 'lost'

export type CombatState = {
  turn: number
  phase: CombatPhase
  energy: number
  maxEnergy: number
  playerBlock: number
  playerPowers: Partial<Record<PowerKind, number>>
  drawPile: CardInstance[]
  hand: CardInstance[]
  discardPile: CardInstance[]
  exhaustPile: CardInstance[]
  enemies: EnemyInstance[]
  /** Once per player turn: pay HP for +1 energy. */
  heroicEffortUsed: boolean
  /** Times Push yourself was used this combat (escalates HP cost). */
  heroicEffortUsesThisCombat: number
  /** Attack tags that damaged the player this combat (for Influence triggers). */
  survivedHitTags: AttackTag[]
}

export const HAND_SIZE = 5

/** First Push yourself HP cost this combat; each prior use adds STEP. */
export const HEROIC_EFFORT_HP_BASE = 5
export const HEROIC_EFFORT_HP_STEP = 3

export function heroicEffortHpCost(usesThisCombat: number): number {
  return HEROIC_EFFORT_HP_BASE + HEROIC_EFFORT_HP_STEP * usesThisCombat
}
