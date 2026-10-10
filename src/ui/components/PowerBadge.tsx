import type { PowerKind } from '../../game/models/effects'
import { POWER_META } from './powerMeta'
import { Tooltip } from './Tooltip'
import styles from './PowerBadge.module.scss'

type Props = {
  kind: PowerKind
  stacks: number
}

export function PowerBadge({ kind, stacks }: Props) {
  const meta = POWER_META[kind]

  return (
    <Tooltip title={`${meta.label} ${stacks}`} body={meta.description}>
      <span className={`${styles.badge} ${styles[meta.variant]}`}>
        {meta.shortLabel} {stacks}
      </span>
    </Tooltip>
  )
}
