import type { CardType, CombatEffect } from './effects'

export type CardDef = {
  id: string
  /** Sprite lookup key; defaults to id */
  artKey?: string
  name: string
  type: CardType
  cost: number
  description: string
  effects: CombatEffect[]
  upgrade?: {
    description: string
    effects: CombatEffect[]
    cost?: number
  }
}

export type CardInstance = {
  instanceId: string
  defId: string
  upgraded: boolean
  /** Influence def ids (max 2, append-only until purified). */
  influences: string[]
}

let cardInstanceCounter = 0

export function createCardInstance(
  defId: string,
  upgraded = false,
  influences: string[] = [],
): CardInstance {
  cardInstanceCounter += 1
  return { instanceId: `c-${cardInstanceCounter}`, defId, upgraded, influences: [...influences] }
}

export function resetCardInstanceCounter(): void {
  cardInstanceCounter = 0
}

export function deckFromDefIds(ids: string[]): CardInstance[] {
  return ids.map((id) => createCardInstance(id))
}
