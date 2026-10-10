export type RunOutcome = 'victory' | 'game_over' | 'abandoned'

export type EnemyEncounterRecord = {
  defId: string
  playerDied: boolean
}

export type CompletedRunRecord = {
  id: string
  seed: number
  startedAt: number
  endedAt: number
  outcome: RunOutcome
  cardPlays: Record<string, number>
  deckDefIds: string[]
  relicIds: string[]
  enemyEncounters: EnemyEncounterRecord[]
}

export type AnalyticsBlob = {
  version: 1
  runs: CompletedRunRecord[]
}

export type CardAggregateRow = {
  defId: string
  name: string
  plays: number
  deckRuns: number
  wins: number
  winRate: number
}

export type RelicAggregateRow = {
  relicId: string
  name: string
  runs: number
  wins: number
  winRate: number
}

export type EnemyAggregateRow = {
  defId: string
  name: string
  encounters: number
  playerDeaths: number
  killRate: number
}

export type PlayerAggregate = {
  totalRuns: number
  victories: number
  defeats: number
  abandoned: number
  /** Victories / (victories + defeats); 0 if no finished runs */
  winRate: number
}
