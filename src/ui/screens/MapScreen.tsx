import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'
import type { MapState } from '../../game/models/map'
import { getNode } from '../../game/run/mapGen'
import type { MapNodeType } from '../../game/models/map'
import { RunHud } from '../components/RunHud'
import styles from './MapScreen.module.scss'

const NODE_LABEL: Record<MapNodeType, string> = {
  battle: 'Fight',
  elite: 'Elite',
  shop: 'Shop',
  rest: 'Rest',
  event: '?',
  boss: 'Boss',
}

type LineSegment = {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
  bright: boolean
}

type Point = { x: number; y: number }

function rectCenter(rect: DOMRect, gridRect: DOMRect): Point {
  return {
    x: rect.left + rect.width / 2 - gridRect.left,
    y: rect.top + rect.height / 2 - gridRect.top,
  }
}

/** Grid-local point where the ray from rect center toward `target` meets the rect border. */
function borderToward(rect: DOMRect, gridRect: DOMRect, target: Point): Point {
  const cx = rect.left + rect.width / 2 - gridRect.left
  const cy = rect.top + rect.height / 2 - gridRect.top
  const dx = target.x - cx
  const dy = target.y - cy
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) return { x: cx, y: cy }

  const hw = rect.width / 2
  const hh = rect.height / 2
  const scale = Math.min(
    Math.abs(dx) > 1e-6 ? hw / Math.abs(dx) : Number.POSITIVE_INFINITY,
    Math.abs(dy) > 1e-6 ? hh / Math.abs(dy) : Number.POSITIVE_INFINITY,
  )
  return { x: cx + dx * scale, y: cy + dy * scale }
}

function edgeIsHighlighted(map: MapState, fromId: string, toId: string): boolean {
  if (map.availableNodeIds.includes(fromId)) return true
  if (map.clearedNodeIds.includes(fromId) && map.clearedNodeIds.includes(toId)) return true
  if (map.clearedNodeIds.includes(fromId) && map.availableNodeIds.includes(toId)) return true
  return false
}

function isStartPhase(map: MapState): boolean {
  return map.clearedNodeIds.length === 0
}

export function MapScreen() {
  const { session, dispatch } = useGame()
  const run = session.run!
  const { map } = run

  const gridRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>())
  const [lines, setLines] = useState<LineSegment[]>([])
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 })

  const registerNodeRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) nodeRefs.current.set(id, el)
    else nodeRefs.current.delete(id)
  }, [])

  const edgeList = useMemo(() => {
    const out: { key: string; fromId: string; toId: string; bright: boolean }[] = []
    for (const node of map.nodes) {
      for (const targetId of node.edges) {
        const target = getNode(map, targetId)
        if (!target || target.row !== node.row + 1) continue
        out.push({
          key: `${node.id}-${targetId}`,
          fromId: node.id,
          toId: targetId,
          bright: edgeIsHighlighted(map, node.id, targetId),
        })
      }
    }
    return out
  }, [map])

  useLayoutEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const measure = () => {
      const gridRect = grid.getBoundingClientRect()
      setSvgSize({ w: gridRect.width, h: gridRect.height })
      if (gridRect.width === 0 || gridRect.height === 0) {
        setLines([])
        return
      }

      const next: LineSegment[] = []
      for (const edge of edgeList) {
        const fromEl = nodeRefs.current.get(edge.fromId)
        const toEl = nodeRefs.current.get(edge.toId)
        if (!fromEl || !toEl) continue

        const fromRect = fromEl.getBoundingClientRect()
        const toRect = toEl.getBoundingClientRect()
        const fromCenter = rectCenter(fromRect, gridRect)
        const toCenter = rectCenter(toRect, gridRect)
        const start = borderToward(fromRect, gridRect, toCenter)
        const end = borderToward(toRect, gridRect, fromCenter)
        next.push({
          key: edge.key,
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          bright: edge.bright,
        })
      }
      setLines(next)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(grid)
    return () => ro.disconnect()
  }, [edgeList, map])

  const atStart = isStartPhase(map)

  return (
    <div className={styles.map}>
      <RunHud run={run} />

      <p className={styles.prompt}>
        {atStart ? 'Pick a starting node (top row)' : 'Choose your path'}
      </p>

      <div className={styles.gridWrap}>
        <div className={styles.grid} ref={gridRef}>
          {svgSize.w > 0 && svgSize.h > 0 ? (
            <svg
              className={styles.edges}
              width={svgSize.w}
              height={svgSize.h}
              aria-hidden
            >
              {lines.map((edge) => (
                <line
                  key={edge.key}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  className={edge.bright ? styles.edgeBright : styles.edgeDim}
                />
              ))}
            </svg>
          ) : null}
          {map.nodes.map((node) => {
            const available = map.availableNodeIds.includes(node.id)
            const cleared = map.clearedNodeIds.includes(node.id)
            const startOption = atStart && available
            return (
              <button
                key={node.id}
                ref={(el) => registerNodeRef(node.id, el)}
                type="button"
                className={`${styles.node} ${styles[node.type]} ${available ? styles.available : ''} ${cleared ? styles.cleared : ''} ${startOption ? styles.startOption : ''}`}
                style={{ gridRow: node.row + 1, gridColumn: node.col + 1 }}
                disabled={!available}
                onClick={() => dispatch({ type: 'MAP_PICK_NODE', nodeId: node.id })}
              >
                {NODE_LABEL[node.type]}
              </button>
            )
          })}
        </div>
      </div>

      {run.currentNodeId ? (
        <p className={styles.footer}>At: {getNode(map, run.currentNodeId)?.type ?? '—'}</p>
      ) : null}
    </div>
  )
}
