export type { SpriteRows } from './types'
export { SPRITE_PALETTE, SPRITE_GRID } from './palette'
export { PALETTE_LEGEND } from './paletteLegend'
export { SPRITE_REGISTRY, spritesForGroup, type SpriteGroup } from './spriteRegistry'

import type { SpriteRows } from './types'
import { CARD_ART } from './literals/cardArt'
import { ENEMY_ART } from './literals/enemyArt'
import { DEFAULT_EVENT_ART, EVENT_ART } from './literals/eventArt'
import { DEFAULT_RELIC_ART, RELIC_ART } from './literals/relicArt'
import { normalizeSpriteRows } from './upscale'

function lookupCardArt(artKey: string): SpriteRows {
  return CARD_ART[artKey] ?? CARD_ART[artKey.split('_')[0] ?? ''] ?? CARD_ART.arc_strike!
}

export function getCardSprite(artKey: string, _cardType?: 'attack' | 'skill' | 'power'): SpriteRows {
  return normalizeSpriteRows(lookupCardArt(artKey))
}

export function getEnemySprite(defId: string): SpriteRows {
  return normalizeSpriteRows(ENEMY_ART[defId] ?? ENEMY_ART.mob_shade!)
}

export function getRelicSprite(relicId: string): SpriteRows {
  const base = RELIC_ART[relicId] ?? RELIC_ART[relicId.split('_')[0] ?? ''] ?? DEFAULT_RELIC_ART
  return normalizeSpriteRows(base)
}

export function getEventSprite(eventId: string): SpriteRows {
  return normalizeSpriteRows(EVENT_ART[eventId] ?? DEFAULT_EVENT_ART)
}
