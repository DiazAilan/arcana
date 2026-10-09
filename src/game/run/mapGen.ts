import type { MapNode, MapNodeType, MapState } from '../models/map'
import type { SeededRNG } from '../rng/SeededRNG'

const ROWS = 8
const COLS = 3

function nodeId(row: number, col: number): string {
  return `n-${row}-${col}`
}

function pickType(row: number, col: number, rng: SeededRNG): MapNodeType {
  if (row === 0) return 'battle'
  if (row === ROWS - 1) return 'boss'
  if (row === 3 && col === 1) return 'elite'
  if (row === 5 && col === 1) return 'rest'
  const roll = rng.next()
  if (roll < 0.22) return 'shop'
  if (roll < 0.38) return 'rest'
  if (roll < 0.52) return 'event'
  if (roll < 0.72) return 'elite'
  return 'battle'
}

/** Build a branching map: each node connects to 1–2 nodes in the next row. */
export function generateMap(rng: SeededRNG): MapState {
  const nodes: MapNode[] = []

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = nodeId(row, col)
      const type = pickType(row, col, rng)
      nodes.push({ id, row, col, type, edges: [] })
    }
  }

  for (let row = 0; row < ROWS - 1; row++) {
    for (let col = 0; col < COLS; col++) {
      const from = nodes.find((n) => n.row === row && n.col === col)!
      const candidates = nodes.filter((n) => n.row === row + 1 && Math.abs(n.col - col) <= 1)
      const targetCols = new Set<number>()
      targetCols.add(col)
      if (rng.next() < 0.45 && col > 0) targetCols.add(col - 1)
      if (rng.next() < 0.45 && col < COLS - 1) targetCols.add(col + 1)
      for (const c of targetCols) {
        const target = candidates.find((n) => n.col === c)
        if (target) from.edges.push(target.id)
      }
      if (from.edges.length === 0 && candidates[0]) {
        from.edges.push(candidates[Math.min(col, candidates.length - 1)]!.id)
      }
    }
  }

  // Ensure boss reachable: link any orphan row 7 nodes to boss
  const bossNodeId = nodeId(ROWS - 1, 1)
  const boss = nodes.find((n) => n.id === bossNodeId)!
  boss.type = 'boss'

  const startNodeId = nodeId(0, rng.nextInt(COLS))
  const start = nodes.find((n) => n.id === startNodeId)!
  start.type = 'battle'

  return {
    nodes,
    startNodeId: start.id,
    bossNodeId: boss.id,
    clearedNodeIds: [],
    availableNodeIds: [start.id],
  }
}

export function getNode(map: MapState, id: string): MapNode | undefined {
  return map.nodes.find((n) => n.id === id)
}

export function advanceMap(map: MapState, chosenNodeId: string): MapState {
  const node = getNode(map, chosenNodeId)
  if (!node || !map.availableNodeIds.includes(chosenNodeId)) return map

  const clearedNodeIds = map.clearedNodeIds.includes(chosenNodeId)
    ? map.clearedNodeIds
    : [...map.clearedNodeIds, chosenNodeId]

  const availableNodeIds = node.edges.filter((id) => !clearedNodeIds.includes(id))
  const nextAvailable =
    availableNodeIds.length > 0 ? availableNodeIds : node.edges.length ? node.edges : []

  return {
    ...map,
    clearedNodeIds,
    availableNodeIds: nextAvailable,
  }
}
