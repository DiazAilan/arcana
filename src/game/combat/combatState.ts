import type { CardInstance } from '../models/card'
import type { EnemyInstance } from '../models/enemy'
import type { PowerKind } from '../models/effects'

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
}

export const HAND_SIZE = 5
