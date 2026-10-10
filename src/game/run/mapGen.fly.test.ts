import { describe, expect, it } from 'vitest'
import { SeededRNG } from '../rng/SeededRNG'
import { advanceMapFly, availableNodesFromPath, generateMap, getNode } from './mapGen'

describe('map fly helpers', () => {
  it('advanceMapFly unlocks all uncleared nodes', () => {
    const map = generateMap(new SeededRNG(42))
    const startId = map.startNodeId
    const far = map.nodes.find((n) => n.row === map.nodes.reduce((m, x) => Math.max(m, x.row), 0))!
    expect(far.id).not.toBe(startId)

    const next = advanceMapFly(map, far.id)
    expect(next.clearedNodeIds).toContain(far.id)
    expect(next.availableNodeIds).not.toContain(far.id)
    expect(next.availableNodeIds.length).toBe(map.nodes.length - 1)
  })

  it('availableNodesFromPath restores row-0 options at run start', () => {
    const map = generateMap(new SeededRNG(1))
    const ids = availableNodesFromPath(map, null)
    expect(ids.every((id) => getNode(map, id)?.row === 0)).toBe(true)
  })
})
