import type { CardType, CombatEffect } from './effects'

export type CardDef = {
  id: string
  name: string
  type: CardType
  cost: number
  description: string
  effects: CombatEffect[]
  upgrade?: {
    description: string
    effects: CombatEffect[]
  }
}

export type CardInstance = {
  instanceId: string
  defId: string
  upgraded: boolean
}

let cardInstanceCounter = 0

export function createCardInstance(defId: string, upgraded = false): CardInstance {
  cardInstanceCounter += 1
  return { instanceId: `c-${cardInstanceCounter}`, defId, upgraded }
}

export function resetCardInstanceCounter(): void {
  cardInstanceCounter = 0
}

export function deckFromDefIds(ids: string[]): CardInstance[] {
  return ids.map((id) => createCardInstance(id))
}
