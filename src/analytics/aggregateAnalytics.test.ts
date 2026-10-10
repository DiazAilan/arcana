import { describe, expect, it, beforeAll } from 'vitest'
import { loadRegistry } from '../game/content/registry'
import { aggregateCards, aggregateEnemies, aggregatePlayer, aggregateRelics } from './aggregateAnalytics'
import type { AnalyticsBlob } from './types'

const blob: AnalyticsBlob = {
  version: 1,
  runs: [
    {
      id: '1',
      seed: 1,
      startedAt: 0,
      endedAt: 1,
      outcome: 'victory',
      cardPlays: { arc_strike: 5 },
      deckDefIds: ['arc_strike', 'arc_defend'],
      relicIds: ['relic_embers'],
      enemyEncounters: [
        { defId: 'mob_slime', playerDied: false },
        { defId: 'mob_jaw', playerDied: false },
      ],
    },
    {
      id: '2',
      seed: 2,
      startedAt: 0,
      endedAt: 1,
      outcome: 'game_over',
      cardPlays: { arc_strike: 2 },
      deckDefIds: ['arc_strike'],
      relicIds: [],
      enemyEncounters: [{ defId: 'mob_slime', playerDied: true }],
    },
  ],
}

describe('aggregateAnalytics', () => {
  beforeAll(() => {
    loadRegistry()
  })

  it('aggregates player win rate', () => {
    const player = aggregatePlayer(blob)
    expect(player.totalRuns).toBe(2)
    expect(player.victories).toBe(1)
    expect(player.defeats).toBe(1)
    expect(player.winRate).toBe(0.5)
  })

  it('aggregates card plays and deck win rate', () => {
    const cards = aggregateCards(blob)
    const strike = cards.find((c) => c.defId === 'arc_strike')
    expect(strike?.plays).toBe(7)
    expect(strike?.deckRuns).toBe(2)
    expect(strike?.wins).toBe(1)
    expect(strike?.winRate).toBe(0.5)
  })

  it('aggregates relic runs', () => {
    const relics = aggregateRelics(blob)
    const embers = relics.find((r) => r.relicId === 'relic_embers')
    expect(embers?.runs).toBe(1)
    expect(embers?.winRate).toBe(1)
  })

  it('aggregates enemy kill rate', () => {
    const enemies = aggregateEnemies(blob)
    const slime = enemies.find((e) => e.defId === 'mob_slime')
    expect(slime?.encounters).toBe(2)
    expect(slime?.playerDeaths).toBe(1)
    expect(slime?.killRate).toBe(0.5)
  })
})
