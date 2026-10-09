import type { PowerKind } from '../../game/models/effects'
import { POWER_META } from './powerMeta'
import styles from './PowerBadge.module.scss'

type Props = {
  kind: PowerKind
  stacks: number
}

export function PowerBadge({ kind, stacks }: Props) {
  const meta = POWER_META[kind]
  const title = `${meta.label} ${stacks}: ${meta.description}`

  return (
    <span className={`${styles.badge} ${styles[meta.variant]}`} title={title}>
      {meta.shortLabel} {stacks}
    </span>
  )
}
