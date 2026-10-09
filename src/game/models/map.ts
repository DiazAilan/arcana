export type MapNodeType = 'battle' | 'elite' | 'shop' | 'rest' | 'event' | 'boss'

export type MapNode = {
  id: string
  row: number
  col: number
  type: MapNodeType
  edges: string[]
}

export type MapState = {
  nodes: MapNode[]
  startNodeId: string
  bossNodeId: string
  clearedNodeIds: string[]
  /** Nodes the player can travel to next */
  availableNodeIds: string[]
}
