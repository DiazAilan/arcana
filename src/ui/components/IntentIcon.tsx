import { getCurrentIntent } from '../../game/combat/intents'
import type { EnemyInstance } from '../../game/models/enemy'
import styles from './IntentIcon.module.scss'

type Props = { enemy: EnemyInstance }

export function IntentIcon({ enemy }: Props) {
  const intent = getCurrentIntent(enemy)
  if (!intent) return null

  const label =
    intent.kind === 'attack'
      ? `${intent.value}`
      : intent.kind === 'block'
        ? `+${intent.value}`
        : intent.kind

  return (
    <div className={`${styles.intent} ${styles[intent.kind]}`} title={intent.kind}>
      {label}
    </div>
  )
}
