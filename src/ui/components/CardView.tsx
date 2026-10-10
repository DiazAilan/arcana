import { getRegistry } from '../../game/content/registry'
import { getCardSprite } from '../../game/content/art/sprites'
import { getCardEffectStats } from '../../game/combat/cardPreview'
import { resolveCard, resolveCardWithoutInfluences } from '../../game/combat/resolveCard'
import type { CardBaseStat, CardStatPreview } from '../../game/combat/cardPreview'
import type { CardInstance } from '../../game/models/card'
import { CardDescriptionText } from './CardDescriptionText'
import {
  descriptionWithBaseStats,
  descriptionWithCombatStats,
  descriptionWithEffectHighlight,
  descriptionWithUpgradeHighlight,
} from './cardDescriptionDisplay'
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
  statMode?: 'combat' | 'base' | 'none' | 'upgradeCompare'
  statPreviews?: CardStatPreview[]
  baseStats?: CardBaseStat[]
  /** Base card stats when statMode is upgradeCompare */
  upgradeCompareBaseStats?: CardBaseStat[]
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
  upgradeCompareBaseStats,
}: Props) {
  const def = getRegistry().cards.get(card.defId)
  if (!def) return null

  const resolved = resolveCard(card)
  const uninfluenced = resolveCardWithoutInfluences(card)
  const description = resolved.description
  const displayCost = resolved.cost
  const baseCost = uninfluenced.cost
  const costImproved = displayCost < baseCost
  const costWorsened = displayCost > baseCost
  const typeClass = styles[def.type] ?? ''
  const sprite = getCardSprite(resolved.artKey, def.type)
  const hasInfluence = card.influences.length > 0
  const influencedStats = getCardEffectStats(resolved.effects)
  const baseEffectStats = getCardEffectStats(uninfluenced.effects)
  const influenceMechanics =
    hasInfluence &&
    (displayCost !== baseCost ||
      JSON.stringify(resolved.effects) !== JSON.stringify(uninfluenced.effects))

  const descContent =
    statMode === 'combat' && statPreviews && statPreviews.length > 0 ? (
      <CardDescriptionText parts={descriptionWithCombatStats(description, statPreviews)} />
    ) : statMode === 'base' && baseStats && baseStats.length > 0 ? (
      <CardDescriptionText parts={descriptionWithBaseStats(description, baseStats)} />
    ) : statMode === 'upgradeCompare' &&
      baseStats &&
      baseStats.length > 0 &&
      upgradeCompareBaseStats &&
      upgradeCompareBaseStats.length > 0 ? (
      <CardDescriptionText
        parts={descriptionWithUpgradeHighlight(description, baseStats, upgradeCompareBaseStats)}
      />
    ) : influenceMechanics ? (
      <CardDescriptionText
        parts={descriptionWithEffectHighlight(description, influencedStats, baseEffectStats)}
      />
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
        <div
          className={`${styles.cost} ${costImproved ? styles.costImproved : ''} ${costWorsened ? styles.costWorsened : ''}`}
          aria-label={`Cost ${displayCost}`}
        >
          {displayCost}
        </div>
      </div>
      <div className={styles.art}>
        <PixelSprite rows={sprite} pixelSize={3} />
      </div>
      <div className={styles.name}>
        {def.name}
        {card.upgraded ? '+' : ''}
      </div>
      {hasInfluence ? (
        <div className={styles.influenceLine}>{resolved.influenceNames.join(' · ')}</div>
      ) : null}
      <div className={styles.type}>{def.type}</div>
      {descContent}
    </button>
  )
}
