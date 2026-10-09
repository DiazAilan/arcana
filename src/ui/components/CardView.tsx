import { getRegistry } from '../../game/content/registry'
import type { CardInstance } from '../../game/models/card'
import styles from './CardView.module.scss'

type Props = {
  card: CardInstance
  disabled?: boolean
  onClick?: () => void
  selected?: boolean
}

export function CardView({ card, disabled, onClick, selected }: Props) {
  const def = getRegistry().cards.get(card.defId)
  if (!def) return null

  const description = card.upgraded && def.upgrade ? def.upgrade.description : def.description
  const typeClass = styles[def.type] ?? ''

  return (
    <button
      type="button"
      className={`${styles.card} ${typeClass} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.cost}>{def.cost}</div>
      <div className={styles.name}>{def.name}{card.upgraded ? '+' : ''}</div>
      <div className={styles.type}>{def.type}</div>
      <p className={styles.desc}>{description}</p>
    </button>
  )
}
