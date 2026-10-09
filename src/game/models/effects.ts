export type CombatTarget = 'self' | 'enemy' | 'all_enemies'

export type CombatEffect =
  | { type: 'damage'; amount: number; target: CombatTarget }
  | { type: 'block'; amount: number }
  | { type: 'gain_energy'; amount: number }
  | { type: 'draw'; amount: number }
  | { type: 'apply_power'; power: PowerKind; amount: number; target: CombatTarget }
  | { type: 'heal'; amount: number }

export type RunEffect =
  | { type: 'gold'; amount: number }
  | { type: 'damage_player'; amount: number }
  | { type: 'heal_player'; amount: number }
  | { type: 'add_card'; cardId: string; upgraded?: boolean }
  | { type: 'remove_random_card' }
  | { type: 'add_relic'; relicId: string }

export type PowerKind = 'strength' | 'dexterity' | 'vulnerable' | 'weak' | 'metallicize'

export type CardType = 'attack' | 'skill' | 'power'
