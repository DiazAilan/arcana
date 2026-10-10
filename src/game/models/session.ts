import type { CardInstance } from './card'
import type { CombatState } from '../combat/combatState'
import type { MapState } from './map'

export type EncounterKind = 'battle' | 'elite' | 'boss'

export type ShopOffer = {
  kind: 'card' | 'relic' | 'remove'
  cardId?: string
  relicId?: string
  price: number
  purchased: boolean
}

export type ShopState = {
  offers: ShopOffer[]
}

export type GamePhase =
  | { kind: 'main_menu' }
  | { kind: 'map' }
  | {
      kind: 'combat'
      combat: CombatState
      encounter: EncounterKind
      enemyDefIds: string[]
    }
  | {
      kind: 'reward'
      cardOffers: string[]
      gold: number
      relicOffer: string | null
      encounter: EncounterKind
      cardResolved: boolean
    }
  | { kind: 'shop'; shop: ShopState }
  | { kind: 'rest' }
  | {
      kind: 'event'
      eventId: string
      outcome: string[] | null
      /** Card defIds from this choice; shown until Continue */
      offeredCards: string[] | null
      /** Subset still awaiting take/skip; null when none or all resolved */
      pendingCards: string[] | null
      cardDecisions: Record<string, 'taken' | 'skipped'> | null
    }
  | { kind: 'victory' }
  | { kind: 'game_over' }

export type RunState = {
  seed: number
  characterId: string
  hp: number
  maxHp: number
  gold: number
  deck: CardInstance[]
  relics: string[]
  map: MapState
  currentNodeId: string | null
}

export type GameSession = {
  phase: GamePhase
  run: RunState | null
}
