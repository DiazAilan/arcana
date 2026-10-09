import type { PowerKind } from '../../game/models/effects'
import { PowerBadge } from './PowerBadge'
import { POWER_DISPLAY_ORDER } from './powerMeta'
import styles from './PowerBadge.module.scss'

type Props = {
  powers: Partial<Record<PowerKind, number>>
  emptyLabel?: string
}

export function PowerRow({ powers, emptyLabel }: Props) {
  const entries = POWER_DISPLAY_ORDER.filter((k) => (powers[k] ?? 0) > 0)

  if (entries.length === 0) {
    return emptyLabel ? <span className={styles.empty}>{emptyLabel}</span> : null
  }

  return (
    <div className={styles.row}>
      {entries.map((kind) => (
        <PowerBadge key={kind} kind={kind} stacks={powers[kind]!} />
      ))}
    </div>
  )
}
