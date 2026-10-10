import { ACT1_CARDS } from '../act1/cards'
import { CARD_ART } from './literals/cardArt'
import { ENEMY_ART } from './literals/enemyArt'
import type { SpriteRows } from './types'

export type SpriteEntry = {
  id: string
  label: string
  group: 'card' | 'enemy'
  rows: SpriteRows
}

export const SPRITE_REGISTRY: SpriteEntry[] = [
  ...ACT1_CARDS.map((card) => ({
    id: card.id,
    label: card.name,
    group: 'card' as const,
    rows: CARD_ART[card.id] ?? CARD_ART.arc_strike!,
  })),
  ...Object.entries(ENEMY_ART).map(([id, rows]) => ({
    id,
    label: `Enemy — ${id}`,
    group: 'enemy' as const,
    rows,
  })),
]
