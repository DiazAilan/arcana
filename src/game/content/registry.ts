import type { CardDef } from '../models/card'
import type { CharacterDef } from '../models/character'
import type { EnemyDef } from '../models/enemy'
import type { EventDef } from '../models/event'
import type { RelicDef } from '../models/relic'
import type { InfluenceDef } from '../models/influence'
import { ACT1_CARDS } from './act1/cards'
import { ACT1_INFLUENCES } from './act1/influences'
import { ARCANIST } from './act1/character'
import { ACT1_ENEMIES } from './act1/enemies'
import { ACT1_EVENTS } from './act1/events'
import { ACT1_RELICS } from './act1/relics'

export type ContentRegistry = {
  cards: Map<string, CardDef>
  enemies: Map<string, EnemyDef>
  relics: Map<string, RelicDef>
  influences: Map<string, InfluenceDef>
  events: Map<string, EventDef>
  characters: Map<string, CharacterDef>
}

let registry: ContentRegistry | null = null

function toMap<T extends { id: string }>(items: T[]): Map<string, T> {
  const map = new Map<string, T>()
  for (const item of items) {
    if (map.has(item.id)) {
      throw new Error(`Duplicate content id: ${item.id}`)
    }
    map.set(item.id, item)
  }
  return map
}

export function loadRegistry(): ContentRegistry {
  registry = {
    cards: toMap(ACT1_CARDS),
    enemies: toMap(ACT1_ENEMIES),
    relics: toMap(ACT1_RELICS),
    influences: toMap(ACT1_INFLUENCES),
    events: toMap(ACT1_EVENTS),
    characters: toMap([ARCANIST]),
  }
  return registry
}

export function getRegistry(): ContentRegistry {
  if (!registry) return loadRegistry()
  return registry
}
