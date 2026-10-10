import { getIntentDisplay } from '../../game/combat/intents'
import type { EnemyInstance } from '../../game/models/enemy'
import styles from './IntentIcon.module.scss'

type Props = { enemy: EnemyInstance }

export function IntentIcon({ enemy }: Props) {
  const display = getIntentDisplay(enemy)
  if (!display) return null

  return (
    <div
      className={`${styles.cap} ${styles[display.family]}`}
      title={display.tooltip}
      aria-label={display.tooltip}
    >
      <span className={styles.symbol} aria-hidden>
        {display.symbol}
      </span>
      <span className={styles.value}>{display.valueLabel}</span>
    </div>
  )
}
