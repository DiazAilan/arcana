import { describe, expect, it } from 'vitest'
import { hpLossTier } from './combatSfx'

describe('hpLossTier', () => {
  it('buckets damage at 10/20/30 boundaries', () => {
    expect(hpLossTier(0)).toBe(1)
    expect(hpLossTier(10)).toBe(1)
    expect(hpLossTier(11)).toBe(2)
    expect(hpLossTier(20)).toBe(2)
    expect(hpLossTier(21)).toBe(3)
    expect(hpLossTier(30)).toBe(3)
    expect(hpLossTier(31)).toBe(4)
    expect(hpLossTier(99)).toBe(4)
  })
})
