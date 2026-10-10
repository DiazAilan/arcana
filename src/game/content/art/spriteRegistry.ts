import { ACT1_CARDS } from '../act1/cards'
import { ACT1_EVENTS } from '../act1/events'
import { ACT1_RELICS } from '../act1/relics'
import { CARD_ART } from './literals/cardArt'
import { ENEMY_ART } from './literals/enemyArt'
import { DEFAULT_EVENT_ART, EVENT_ART } from './literals/eventArt'
import { DEFAULT_RELIC_ART, RELIC_ART } from './literals/relicArt'
import type { SpriteRows } from './types'

export type SpriteGroup = 'card' | 'enemy' | 'relic' | 'event'

export type SpriteEntry = {
  id: string
  label: string
  group: SpriteGroup
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
    label: id,
    group: 'enemy' as const,
    rows,
  })),
  ...ACT1_RELICS.map((relic) => ({
    id: relic.id,
    label: relic.name,
    group: 'relic' as const,
    rows: RELIC_ART[relic.id] ?? DEFAULT_RELIC_ART,
  })),
  ...ACT1_EVENTS.map((event) => ({
    id: event.id,
    label: event.title,
    group: 'event' as const,
    rows: EVENT_ART[event.id] ?? DEFAULT_EVENT_ART,
  })),
]

export function spritesForGroup(group: SpriteGroup): SpriteEntry[] {
  return SPRITE_REGISTRY.filter((entry) => entry.group === group)
}
