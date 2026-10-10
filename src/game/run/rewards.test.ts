import { describe, expect, it } from 'vitest'
import { rollRelicOffer } from './rewards'
import { SeededRNG } from '../rng/SeededRNG'
import { HEART_RELIC_IDS } from '../content/act1/relics'

describe('rollRelicOffer heart weighting', () => {
  const pool = [...HEART_RELIC_IDS, 'relic_crystal', 'relic_pouch']

  it('can offer Hearts on boss rewards with fixed seeds', () => {
    let heartOffers = 0
    for (let seed = 0; seed < 200; seed++) {
      const rng = new SeededRNG(seed)
      const offer = rollRelicOffer('boss', pool, [], rng)
      if (offer && HEART_RELIC_IDS.includes(offer)) heartOffers++
    }
    expect(heartOffers).toBeGreaterThan(20)
    expect(heartOffers).toBeLessThan(120)
  })
})
