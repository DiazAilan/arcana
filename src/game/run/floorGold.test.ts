import { describe, expect, it, beforeAll } from 'vitest'
import { loadRegistry } from '../content/registry'
import { resetCardInstanceCounter } from '../models/card'
import { generateMap, getNode } from './mapGen'
import { SeededRNG } from '../rng/SeededRNG'
import { sessionReducer } from '../session/sessionReducer'
import type { GameSession } from '../models/session'
import { createRelicInstance, type RelicInstance } from '../models/relicInstance'

function mapSession(nodeId: string, relics: RelicInstance[] = []): GameSession {
  resetCardInstanceCounter()
  const rng = new SeededRNG(42)
  const map = generateMap(rng)
  const node = getNode(map, nodeId)
  if (!node) throw new Error(`missing node ${nodeId}`)

  const cleared = map.nodes.filter((n) => n.row < node.row).map((n) => n.id)
  const available = [nodeId]

  return {
    run: {
      seed: 42,
      characterId: 'arcanist',
      hp: 70,
      maxHp: 70,
      gold: 50,
      deck: [],
      relics,
      map: { ...map, clearedNodeIds: cleared, availableNodeIds: available },
      currentNodeId: null,
      flags: {},
    },
    phase: { kind: 'map' },
  }
}

describe('floor gold from Gilded Pouch', () => {
  beforeAll(() => {
    loadRegistry()
  })

  it('grants gold when entering a higher row', () => {
    const session = mapSession('n-1-0', [createRelicInstance('relic_pouch')])
    const next = sessionReducer(session, { type: 'MAP_PICK_NODE', nodeId: 'n-1-0' }, new SeededRNG(1))
    expect(next.run!.gold).toBe(65)
  })

  it('does not grant gold without the relic', () => {
    const session = mapSession('n-1-0', [])
    const next = sessionReducer(session, { type: 'MAP_PICK_NODE', nodeId: 'n-1-0' }, new SeededRNG(1))
    expect(next.run!.gold).toBe(50)
  })
})
