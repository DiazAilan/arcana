import { describe, expect, it, beforeAll } from 'vitest'
import { loadRegistry } from '../content/registry'
import { resetCardInstanceCounter } from '../models/card'
import { sessionReducer } from './sessionReducer'
import type { GameSession } from '../models/session'
import { generateMap } from '../run/mapGen'
import { SeededRNG } from '../rng/SeededRNG'

function eventSession(eventId: string): GameSession {
  resetCardInstanceCounter()
  const rng = new SeededRNG(1)
  return {
    run: {
      seed: 1,
      characterId: 'arcanist',
      hp: 70,
      maxHp: 70,
      gold: 100,
      deck: [],
      relics: [],
      map: generateMap(rng),
      currentNodeId: 'n1',
    },
    phase: {
      kind: 'event',
      eventId,
      outcome: null,
      offeredCards: null,
      pendingCards: null,
      cardDecisions: null,
    },
  }
}

describe('event card offers', () => {
  beforeAll(() => {
    loadRegistry()
  })

  it('defers add_card until accepted', () => {
    let session = eventSession('event_merchant')
    session = sessionReducer(session, { type: 'EVENT_CHOICE', choiceIndex: 1 }, new SeededRNG(2))
    expect(session.phase.kind).toBe('event')
    if (session.phase.kind !== 'event') return
    expect(session.phase.pendingCards).toEqual(['arc_channel'])
    expect(session.run!.deck).toHaveLength(0)

    session = sessionReducer(
      session,
      { type: 'EVENT_CARD_DECISION', cardId: 'arc_channel', accept: true },
      new SeededRNG(2),
    )
    expect(session.run!.deck).toHaveLength(1)
    expect(session.run!.deck[0]?.defId).toBe('arc_channel')
    if (session.phase.kind !== 'event') return
    expect(session.phase.pendingCards).toBeNull()
  })

  it('skip removes pending without adding card', () => {
    let session = eventSession('event_merchant')
    session = sessionReducer(session, { type: 'EVENT_CHOICE', choiceIndex: 0 }, new SeededRNG(3))
    if (session.phase.kind !== 'event') return
    expect(session.phase.pendingCards).toEqual(['arc_rupture'])

    session = sessionReducer(
      session,
      { type: 'EVENT_CARD_DECISION', cardId: 'arc_rupture', accept: false },
      new SeededRNG(3),
    )
    expect(session.run!.deck).toHaveLength(0)
  })
})
