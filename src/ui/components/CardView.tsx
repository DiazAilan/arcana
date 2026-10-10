import { getRegistry } from '../../game/content/registry'
import { getCardSprite } from '../../game/content/art/sprites'
import type { CardBaseStat, CardStatPreview } from '../../game/combat/cardPreview'
import type { CardInstance } from '../../game/models/card'
import { CardDescriptionText } from './CardDescriptionText'
import { descriptionWithBaseStats, descriptionWithCombatStats } from './cardDescriptionDisplay'
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
  onContextMenu?: (e: React.MouseEvent) => void
  statMode?: 'combat' | 'base' | 'none'
  statPreviews?: CardStatPreview[]
  baseStats?: CardBaseStat[]
}

export function CardView({
  card,
  disabled,
  onClick,
  selected,
  dragging,
  onPointerDown,
  onContextMenu,
  statMode = 'none',
  statPreviews,
  baseStats,
}: Props) {
  const def = getRegistry().cards.get(card.defId)
  if (!def) return null

  const description = card.upgraded && def.upgrade ? def.upgrade.description : def.description
  const typeClass = styles[def.type] ?? ''
  const artKey = def.artKey ?? def.id
  const sprite = getCardSprite(artKey, def.type)

  const descContent =
    statMode === 'combat' && statPreviews && statPreviews.length > 0 ? (
      <CardDescriptionText parts={descriptionWithCombatStats(description, statPreviews)} />
    ) : statMode === 'base' && baseStats && baseStats.length > 0 ? (
      <CardDescriptionText parts={descriptionWithBaseStats(description, baseStats)} />
    ) : (
      <p className={styles.desc}>{description}</p>
    )

  return (
    <button
      type="button"
      className={`${styles.card} ${typeClass} ${selected ? styles.selected : ''} ${disabled ? styles.disabled : ''} ${dragging ? styles.dragging : ''}`}
      onClick={onClick}
      disabled={disabled}
      onPointerDown={onPointerDown}
      onContextMenu={onContextMenu}
    >
      <div className={styles.costRow}>
        <div className={styles.cost} aria-label={`Cost ${def.cost}`}>
          {def.cost}
        </div>
      </div>
      <div className={styles.art}>
        <PixelSprite rows={sprite} pixelSize={3} />
      </div>
      <div className={styles.name}>{def.name}{card.upgraded ? '+' : ''}</div>
      <div className={styles.type}>{def.type}</div>
      {descContent}
    </button>
  )
}
