export type { SpriteRows } from './types'
export { SPRITE_PALETTE, SPRITE_GRID } from './palette'
export { PALETTE_LEGEND } from './paletteLegend'
export { SPRITE_REGISTRY, spritesForGroup, type SpriteGroup } from './spriteRegistry'

import type { SpriteRows } from './types'
import { CARD_ART } from './literals/cardArt'
import { ENEMY_ART } from './literals/enemyArt'
import { DEFAULT_RELIC_ART, RELIC_ART } from './literals/relicArt'

export function getCardSprite(defId: string, _cardType?: 'attack' | 'skill' | 'power'): SpriteRows {
  return CARD_ART[defId] ?? CARD_ART.arc_strike!
}

export function getEnemySprite(defId: string): SpriteRows {
  return ENEMY_ART[defId] ?? ENEMY_ART.mob_shade!
}

export function getRelicSprite(relicId: string): SpriteRows {
  return RELIC_ART[relicId] ?? DEFAULT_RELIC_ART
}
