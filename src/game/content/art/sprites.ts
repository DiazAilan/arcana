export type { SpriteRows } from './types'
export { SPRITE_PALETTE, SPRITE_GRID } from './palette'
export { PALETTE_LEGEND } from './paletteLegend'
export { SPRITE_REGISTRY } from './spriteRegistry'

import type { SpriteRows } from './types'
import { CARD_ART } from './literals/cardArt'
import { ENEMY_ART } from './literals/enemyArt'

export function getCardSprite(defId: string, _cardType?: 'attack' | 'skill' | 'power'): SpriteRows {
  return CARD_ART[defId] ?? CARD_ART.arc_strike!
}

export function getEnemySprite(defId: string): SpriteRows {
  return ENEMY_ART[defId] ?? ENEMY_ART.mob_shade!
}
