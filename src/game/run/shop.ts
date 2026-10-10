import type { ShopOffer, ShopState } from '../models/session'
import type { SeededRNG } from '../rng/SeededRNG'
import { getRegistry } from '../content/registry'
import { HEART_RELIC_IDS } from '../content/act1/relics'

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

  const pickShopRelic = (): string => {
    const hearts = relicPool.filter((id) => HEART_RELIC_IDS.includes(id))
    const mundane = relicPool.filter((id) => !HEART_RELIC_IDS.includes(id))
    if (hearts.length > 0 && rng.next() < 0.18) {
      return rng.pick(hearts)
    }
    return rng.pick(mundane.length > 0 ? mundane : relicPool)
  }

  const relicIds: string[] = []
  for (let i = 0; i < 2; i++) {
    relicIds.push(pickShopRelic())
  }
  for (const relicId of relicIds) {
    if (registry.relics.has(relicId)) {
      const price = registry.relics.get(relicId)?.shopPrice ?? RELIC_PRICE
      offers.push({ kind: 'relic', relicId, price, purchased: false })
    }
  }

  offers.push({ kind: 'remove', price: REMOVE_CARD_PRICE, purchased: false })

  return { offers }
}
