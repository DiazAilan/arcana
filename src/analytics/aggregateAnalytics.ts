import { getRegistry } from '../game/content/registry'
import type {
  AnalyticsBlob,
  CardAggregateRow,
  EnemyAggregateRow,
  PlayerAggregate,
  RelicAggregateRow,
} from './types'

export function aggregatePlayer(blob: AnalyticsBlob): PlayerAggregate {
  let victories = 0
  let defeats = 0
  let abandoned = 0
  for (const run of blob.runs) {
    switch (run.outcome) {
      case 'victory':
        victories++
        break
      case 'game_over':
        defeats++
        break
      case 'abandoned':
        abandoned++
        break
    }
  }
  const finished = victories + defeats
  return {
    totalRuns: blob.runs.length,
    victories,
    defeats,
    abandoned,
    winRate: finished > 0 ? victories / finished : 0,
  }
}

export function aggregateCards(blob: AnalyticsBlob): CardAggregateRow[] {
  const registry = getRegistry()
  const plays = new Map<string, number>()
  const deckRuns = new Map<string, number>()
  const wins = new Map<string, number>()

  for (const run of blob.runs) {
    for (const [defId, count] of Object.entries(run.cardPlays)) {
      plays.set(defId, (plays.get(defId) ?? 0) + count)
    }
    const inDeck = new Set(run.deckDefIds)
    for (const defId of inDeck) {
      deckRuns.set(defId, (deckRuns.get(defId) ?? 0) + 1)
      if (run.outcome === 'victory') {
        wins.set(defId, (wins.get(defId) ?? 0) + 1)
      }
    }
  }

  const ids = new Set([...plays.keys(), ...deckRuns.keys()])
  const rows: CardAggregateRow[] = []
  for (const defId of ids) {
    const dr = deckRuns.get(defId) ?? 0
    const w = wins.get(defId) ?? 0
    rows.push({
      defId,
      name: registry.cards.get(defId)?.name ?? defId,
      plays: plays.get(defId) ?? 0,
      deckRuns: dr,
      wins: w,
      winRate: dr > 0 ? w / dr : 0,
    })
  }
  return rows.sort((a, b) => b.plays - a.plays)
}

export function aggregateRelics(blob: AnalyticsBlob): RelicAggregateRow[] {
  const registry = getRegistry()
  const runs = new Map<string, number>()
  const wins = new Map<string, number>()

  for (const run of blob.runs) {
    for (const relicId of run.relicIds) {
      runs.set(relicId, (runs.get(relicId) ?? 0) + 1)
      if (run.outcome === 'victory') {
        wins.set(relicId, (wins.get(relicId) ?? 0) + 1)
      }
    }
  }

  const rows: RelicAggregateRow[] = []
  for (const [relicId, count] of runs) {
    const w = wins.get(relicId) ?? 0
    rows.push({
      relicId,
      name: registry.relics.get(relicId)?.name ?? relicId,
      runs: count,
      wins: w,
      winRate: count > 0 ? w / count : 0,
    })
  }
  return rows.sort((a, b) => b.runs - a.runs)
}

export function aggregateEnemies(blob: AnalyticsBlob): EnemyAggregateRow[] {
  const registry = getRegistry()
  const encounters = new Map<string, number>()
  const deaths = new Map<string, number>()

  for (const run of blob.runs) {
    for (const enc of run.enemyEncounters) {
      encounters.set(enc.defId, (encounters.get(enc.defId) ?? 0) + 1)
      if (enc.playerDied) {
        deaths.set(enc.defId, (deaths.get(enc.defId) ?? 0) + 1)
      }
    }
  }

  const rows: EnemyAggregateRow[] = []
  for (const [defId, count] of encounters) {
    const d = deaths.get(defId) ?? 0
    rows.push({
      defId,
      name: registry.enemies.get(defId)?.name ?? defId,
      encounters: count,
      playerDeaths: d,
      killRate: count > 0 ? d / count : 0,
    })
  }
  return rows.sort((a, b) => b.encounters - a.encounters)
}
