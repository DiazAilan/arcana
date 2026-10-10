import type { GameSession } from '../game/models/session'
import type { SessionAction } from '../game/session/sessionActions'
import { appendCompletedRun } from './storage'
import type { CompletedRunRecord, RunOutcome } from './types'

type ActiveRun = {
  id: string
  seed: number
  startedAt: number
  cardPlays: Record<string, number>
  enemyEncounters: { defId: string; playerDied: boolean }[]
  lastCombatEncounterStart: number | null
}

let active: ActiveRun | null = null

function newRunId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function finalize(outcome: RunOutcome, session: GameSession): void {
  if (!active || !session.run) {
    active = null
    return
  }

  const deckDefIds = [...new Set(session.run.deck.map((c) => c.defId))]
  const record: CompletedRunRecord = {
    id: active.id,
    seed: active.seed,
    startedAt: active.startedAt,
    endedAt: Date.now(),
    outcome,
    cardPlays: { ...active.cardPlays },
    deckDefIds,
    relicIds: session.run.relics.map((r) => r.defId),
    enemyEncounters: [...active.enemyEncounters],
  }
  appendCompletedRun(record)
  active = null
}

function startActiveRun(seed: number): void {
  active = {
    id: newRunId(),
    seed,
    startedAt: Date.now(),
    cardPlays: {},
    enemyEncounters: [],
    lastCombatEncounterStart: null,
  }
}

function markCurrentCombatDeath(): void {
  if (!active || active.lastCombatEncounterStart == null) return
  for (let i = active.lastCombatEncounterStart; i < active.enemyEncounters.length; i++) {
    active.enemyEncounters[i]!.playerDied = true
  }
}

function registerCombatEnemies(enemyDefIds: string[]): void {
  if (!active) return
  active.lastCombatEncounterStart = active.enemyEncounters.length
  for (const defId of enemyDefIds) {
    active.enemyEncounters.push({ defId, playerDied: false })
  }
}

export function recordAnalytics(
  prev: GameSession,
  action: SessionAction,
  next: GameSession,
): void {
  if (action.type === 'NEW_RUN') {
    if (active && prev.run) {
      finalize('abandoned', prev)
    }
    const seed = action.seed ?? Date.now()
    startActiveRun(seed)
    return
  }

  if (!active) return

  if (action.type === 'COMBAT' && action.action.type === 'PLAY_CARD') {
    if (next.phase.kind === 'combat') {
      const card = next.phase.combat.hand[action.action.handIndex]
      if (card) {
        active.cardPlays[card.defId] = (active.cardPlays[card.defId] ?? 0) + 1
      }
    }
  }

  if (prev.phase.kind === 'map' && action.type === 'MAP_PICK_NODE') {
    if (next.phase.kind === 'combat') {
      registerCombatEnemies(next.phase.enemyDefIds)
    }
  }

  if (prev.phase.kind === 'combat' && next.phase.kind === 'combat') {
    if (prev.phase.combat.phase !== 'lost' && next.phase.combat.phase === 'lost') {
      markCurrentCombatDeath()
    }
  }

  if (prev.phase.kind === 'combat' && next.phase.kind === 'game_over') {
    markCurrentCombatDeath()
  }

  if (next.phase.kind === 'victory' && next.run) {
    finalize('victory', next)
  } else if (next.phase.kind === 'game_over' && next.run) {
    finalize('game_over', next)
  }
}

/** @internal test helper */
export function resetAnalyticsRecorder(): void {
  active = null
}
