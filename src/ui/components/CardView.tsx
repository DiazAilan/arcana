import { getRegistry } from '../../game/content/registry'
import { getCardSprite } from '../../game/content/art/sprites'
import type { CardInstance } from '../../game/models/card'
import { PixelSprite } from './PixelSprite'
import styles from './CardView.module.scss'

type Props = {
  card: CardInstance
  disabled?: boolean
  onClick?: () => void
  selected?: boolean
  /** Lifted visually while dragging */
  dragging?: boolean
  onPointerDown?: (e: React.PointerEvent) => void
}

export function CardView({ card, disabled, onClick, selected, dragging, onPointerDown }: Props) {
  const def = getRegistry().cards.get(card.defId)
  if (!def) return null

  const description = card.upgraded && def.upgrade ? def.upgrade.description : def.description
  const typeClass = styles[def.type] ?? ''
  const artKey = def.artKey ?? def.id
  const sprite = getCardSprite(artKey, def.type)

  return (
    <button
      type="button"
      className={`${styles.card} ${typeClass} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''} ${dragging ? styles.dragging : ''}`}
      onClick={onClick}
      disabled={disabled}
      onPointerDown={onPointerDown}
    >
      <div className={styles.art}>
        <PixelSprite rows={sprite} pixelSize={5} />
      </div>
      <div className={styles.cost}>{def.cost}</div>
      <div className={styles.name}>{def.name}{card.upgraded ? '+' : ''}</div>
      <div className={styles.type}>{def.type}</div>
      <p className={styles.desc}>{description}</p>
    </button>
  )
}
