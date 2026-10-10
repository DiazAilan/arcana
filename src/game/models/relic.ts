export type RelicHook =
  | 'onCombatStart'
  | 'onTurnStart'
  | 'onVictory'
  | 'onCardPlayed'
  | 'maxEnergyBonus'

export type RelicDef = {
  id: string
  name: string
  description: string
  hooks: RelicHook[]
  /** Flat bonus max energy if hook includes maxEnergyBonus */
  energyBonus?: number
  /** Heal on victory */
  victoryHeal?: number
  /** Extra draw on combat start */
  combatStartDraw?: number
  /** Shop price override (default 150) */
  shopPrice?: number
  /** Gold when descending to a new map row */
  floorGold?: number
}
