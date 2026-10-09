import { getRegistry } from '../../game/content/registry'
import styles from './RelicBar.module.scss'

type Props = { relicIds: string[] }

export function RelicBar({ relicIds }: Props) {
  if (relicIds.length === 0) return null
  const registry = getRegistry()
  return (
    <div className={styles.bar}>
      {relicIds.map((id) => {
        const relic = registry.relics.get(id)
        if (!relic) return null
        return (
          <div key={id} className={styles.relic} title={relic.description}>
            {relic.name.slice(0, 2)}
          </div>
        )
      })}
    </div>
  )
}
