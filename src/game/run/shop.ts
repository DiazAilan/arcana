import type { RunState, ShopOffer, ShopState } from '../models/session'
import type { SeededRNG } from '../rng/SeededRNG'
import { getRegistry } from '../content/registry'
import { HEART_RELIC_IDS } from '../content/act1/relics'
import { CARD_INFLUENCE_POOL } from '../content/act1/influences'
const CARD_PRICE = 50
const RELIC_PRICE = 150
export const REMOVE_CARD_PRICE = 75
const INFLUENCE_CARD_PRICE = 85
const INFLUENCE_RELIC_PRICE = 120
export const PURIFY_PRICE = 60

export function createShop(
  rng: SeededRNG,
  cardPool: string[],
  relicPool: string[],
  run?: RunState,
): ShopState {
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

  const hasBaneOnDeck =
    run?.deck.some((c) =>
      c.influences.some((id) => registry.influences.get(id)?.polarity === 'bane'),
    ) ?? false
  if (hasBaneOnDeck || run?.flags.shrine_broken) {
    offers.push({ kind: 'purify', price: PURIFY_PRICE, purchased: false })
  }

  const influencePool = CARD_INFLUENCE_POOL.filter((id) => {
    const inf = registry.influences.get(id)
    return inf && inf.polarity !== 'bane'
  })
  if (influencePool.length > 0 && rng.next() < 0.55) {
    const influenceId = rng.pick(influencePool)
    const cardId = rng.pick(pool)
    offers.push({
      kind: 'influence_card',
      cardId,
      influenceId,
      price: INFLUENCE_CARD_PRICE + rng.nextInt(15),
      purchased: false,
    })
  }

  if (run?.flags.masks_angry && influencePool.length > 0 && rng.next() < 0.35) {
    const influenceId =
      registry.influences.has('inf_shop_etched') ? 'inf_shop_etched' : rng.pick(influencePool)
    const cardId = rng.pick(pool)
    offers.push({
      kind: 'influence_card',
      cardId,
      influenceId,
      price: INFLUENCE_CARD_PRICE,
      purchased: false,
    })
  }

  void INFLUENCE_RELIC_PRICE

  offers.push({ kind: 'remove', price: REMOVE_CARD_PRICE, purchased: false })

  return { offers }
}
