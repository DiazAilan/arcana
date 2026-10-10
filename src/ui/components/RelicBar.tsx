import { getRegistry } from '../../game/content/registry'
import { resolveRelicInstance } from '../../game/run/resolveRelic'
import type { RelicInstance } from '../../game/models/relicInstance'
import { RelicIcon } from './RelicIcon'
import { Tooltip } from './Tooltip'
import styles from './RelicBar.module.scss'

type Props = { relics: RelicInstance[] }

export function RelicBar({ relics }: Props) {
  if (relics.length === 0) return null
  const registry = getRegistry()
  return (
    <div className={styles.bar}>
      {relics.map((inst) => {
        const relic = registry.relics.get(inst.defId)
        if (!relic) return null
        const resolved = resolveRelicInstance(inst)
        return (
          <Tooltip
            key={inst.instanceId}
            title={relic.name}
            body={`${relic.description}${resolved.descriptionSuffix}`}
            placement="bottom"
          >
            <RelicIcon relicId={resolved.artKey} size="sm" />
          </Tooltip>
        )
      })}
    </div>
  )
}
