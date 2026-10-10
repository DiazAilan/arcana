import { getCardEffects } from '../../game/combat/applyEffects'
import { getCardBaseStats } from '../../game/combat/cardPreview'
import type { CardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import styles from './UpgradeConfirmModal.module.scss'

type Props = {
  card: CardInstance
  onConfirm: () => void
  onChooseAnother: () => void
  onRestInstead: () => void
}

export function UpgradeConfirmModal({ card, onConfirm, onChooseAnother, onRestInstead }: Props) {
  const preview: CardInstance = { ...card, upgraded: true }
  const baseStats = getCardBaseStats(getCardEffects(card.defId, false))
  const upgradedStats = getCardBaseStats(getCardEffects(card.defId, true))

  return (
    <div className={styles.backdrop} role="presentation" onClick={onChooseAnother}>
      <div className={styles.panel} role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Upgrade this card?</h2>
        <div className={styles.cards}>
          <div className={styles.col}>
            <span>Current</span>
            <CardView card={card} statMode="base" baseStats={baseStats} />
          </div>
          <div className={styles.col}>
            <span>Upgraded</span>
            <CardView
              card={preview}
              statMode="upgradeCompare"
              baseStats={upgradedStats}
              upgradeCompareBaseStats={baseStats}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className="btnPrimary" onClick={onConfirm}>
            Confirm upgrade
          </button>
          <button type="button" className="btnGhost" onClick={onChooseAnother}>
            Choose another
          </button>
          <button type="button" className="btnGhost" onClick={onRestInstead}>
            Rest instead
          </button>
        </div>
      </div>
    </div>
  )
}
