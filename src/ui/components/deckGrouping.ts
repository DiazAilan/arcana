import type { CardInstance } from '../../game/models/card'
import { getRegistry } from '../../game/content/registry'

export type DeckGroup = {
  key: string
  defId: string
  upgraded: boolean
  count: number
  sample: CardInstance
}

export function groupDeck(deck: CardInstance[]): DeckGroup[] {
  const map = new Map<string, DeckGroup>()

  for (const card of deck) {
    const key = `${card.defId}:${card.upgraded ? '1' : '0'}`
    const existing = map.get(key)
    if (existing) {
      existing.count += 1
    } else {
      map.set(key, {
        key,
        defId: card.defId,
        upgraded: card.upgraded,
        count: 1,
        sample: card,
      })
    }
  }

  const registry = getRegistry()
  return [...map.values()].sort((a, b) => {
    const defA = registry.cards.get(a.defId)
    const defB = registry.cards.get(b.defId)
    const typeOrder = { attack: 0, skill: 1, power: 2 }
    const ta = defA ? typeOrder[defA.type] : 9
    const tb = defB ? typeOrder[defB.type] : 9
    if (ta !== tb) return ta - tb
    const na = defA?.name ?? a.defId
    const nb = defB?.name ?? b.defId
    return na.localeCompare(nb)
  })
}
