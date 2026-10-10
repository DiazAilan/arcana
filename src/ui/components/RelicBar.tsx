import { getRegistry } from '../../game/content/registry'
import { RelicIcon } from './RelicIcon'
import { Tooltip } from './Tooltip'
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
          <Tooltip key={id} title={relic.name} body={relic.description} placement="bottom">
            <RelicIcon relicId={id} size="sm" />
          </Tooltip>
        )
      })}
    </div>
  )
}
