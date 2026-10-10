import { describe, expect, it, beforeAll } from 'vitest'
import { loadRegistry } from '../content/registry'
import { resetCardInstanceCounter } from '../models/card'
import { formatRunEffectOutcomes } from './runEffectOutcomes'
import type { RunState } from '../models/session'
import { generateMap } from './mapGen'
import { SeededRNG } from '../rng/SeededRNG'

function baseRun(overrides: Partial<RunState> = {}): RunState {
  resetCardInstanceCounter()
  const rng = new SeededRNG(1)
  return {
    seed: 1,
    characterId: 'test',
    hp: 70,
    maxHp: 70,
    gold: 100,
    deck: [],
    relics: [],
    map: generateMap(rng),
    currentNodeId: null,
    ...overrides,
  }
}

describe('formatRunEffectOutcomes', () => {
  beforeAll(() => {
    loadRegistry()
  })
  it('describes relic and damage', () => {
    const before = baseRun({ hp: 70, relics: [] })
    const after = { ...before, hp: 62, relics: ['relic_embers'] }
    const lines = formatRunEffectOutcomes(
      [
        { type: 'damage_player', amount: 8 },
        { type: 'add_relic', relicId: 'relic_embers' },
      ],
      before,
      after,
    )
    expect(lines).toContain('Lost 8 HP.')
    expect(lines).toContain('Received Volcanic Heart-Stone.')
  })

  it('describes gold gain', () => {
    const before = baseRun({ gold: 10 })
    const after = { ...before, gold: 35 }
    const lines = formatRunEffectOutcomes([{ type: 'gold', amount: 25 }], before, after)
    expect(lines).toContain('Gained 25 gold.')
  })

  it('offers cards when deferAddCard is set', () => {
    const before = baseRun()
    const after = { ...before }
    const lines = formatRunEffectOutcomes(
      [{ type: 'add_card', cardId: 'arc_rupture' }],
      before,
      after,
      { deferAddCard: true },
    )
    expect(lines).toContain('Offered Rupture Seal.')
  })
})
