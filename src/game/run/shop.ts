import type { ShopOffer, ShopState } from '../models/session'
import type { SeededRNG } from '../rng/SeededRNG'
import { getRegistry } from '../content/registry'

const CARD_PRICE = 50
const RELIC_PRICE = 150
export const REMOVE_CARD_PRICE = 75

export function createShop(rng: SeededRNG, cardPool: string[], relicPool: string[]): ShopState {
  const registry = getRegistry()
  const pool = [...cardPool]
  const offers: ShopOffer[] = []

  for (let i = 0; i < 5; i++) {
    const cardId = rng.pick(pool)
    offers.push({ kind: 'card', cardId, price: CARD_PRICE + rng.nextInt(20), purchased: false })
  }

  const relicIds = rng.shuffle([...relicPool]).slice(0, 2)
  for (const relicId of relicIds) {
    if (registry.relics.has(relicId)) {
      const price = registry.relics.get(relicId)?.shopPrice ?? RELIC_PRICE
      offers.push({ kind: 'relic', relicId, price, purchased: false })
    }
  }

  offers.push({ kind: 'remove', price: REMOVE_CARD_PRICE, purchased: false })

  return { offers }
}
