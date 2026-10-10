import { describe, expect, it } from 'vitest'
import { bossVictoryOutcome } from './bossVictory'
import { HEART_RELIC_IDS } from '../content/act1/relics'
import { createRelicInstance } from '../models/relicInstance'

describe('bossVictoryOutcome', () => {
  it('seals the tomb when the Avatar falls without a Heart', () => {
    expect(bossVictoryOutcome('boss_avatar_still_waters', [])).toBe('sealed')
  })

  it('offers echo combat when the Avatar falls with a Heart', () => {
    expect(
      bossVictoryOutcome('boss_avatar_still_waters', [createRelicInstance(HEART_RELIC_IDS[0]!)]),
    ).toBe('echo_combat')
  })

  it('grants true victory after the buried echo', () => {
    expect(bossVictoryOutcome('boss_primordial_echo', [])).toBe('true')
  })
})
