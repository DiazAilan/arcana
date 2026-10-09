import { useGame } from '../../context/GameContext'
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

export function MapScreen() {
  const { session, dispatch } = useGame()
  const run = session.run!
  const { map } = run

  return (
    <div className={styles.map}>
      <RunHud run={run} />

      <p className={styles.prompt}>Choose your path</p>

      <div className={styles.grid}>
        {map.nodes.map((node) => {
          const available = map.availableNodeIds.includes(node.id)
          const cleared = map.clearedNodeIds.includes(node.id)
          return (
            <button
              key={node.id}
              type="button"
              className={`${styles.node} ${styles[node.type]} ${available ? styles.available : ''} ${cleared ? styles.cleared : ''}`}
              style={{ gridRow: node.row + 1, gridColumn: node.col + 1 }}
              disabled={!available}
              onClick={() => dispatch({ type: 'MAP_PICK_NODE', nodeId: node.id })}
            >
              {NODE_LABEL[node.type]}
            </button>
          )
        })}
      </div>

      {run.currentNodeId ? (
        <p className={styles.footer}>At: {getNode(map, run.currentNodeId)?.type ?? '—'}</p>
      ) : null}
    </div>
  )
}
