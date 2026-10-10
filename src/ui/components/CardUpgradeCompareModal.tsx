import { useEffect } from 'react'
import { getCardEffects } from '../../game/combat/applyEffects'
import { getCardBaseStats } from '../../game/combat/cardPreview'
import type { CardInstance } from '../../game/models/card'
import { createCardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import styles from './UpgradeConfirmModal.module.scss'

type Props = {
  defId: string
  onClose: () => void
  title?: string
}

export function CardUpgradeCompareModal({ defId, onClose, title = 'Base vs upgraded' }: Props) {
  const baseCard: CardInstance = createCardInstance(defId, false)
  const upgradedCard: CardInstance = { ...baseCard, upgraded: true }
  const baseStats = getCardBaseStats(getCardEffects(defId, false))
  const upgradedStats = getCardBaseStats(getCardEffects(defId, true))

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div className={styles.panel} role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.cards}>
          <div className={styles.col}>
            <span>Base</span>
            <CardView card={baseCard} statMode="base" baseStats={baseStats} />
          </div>
          <div className={styles.col}>
            <span>Upgraded</span>
            <CardView
              card={upgradedCard}
              statMode="upgradeCompare"
              baseStats={upgradedStats}
              upgradeCompareBaseStats={baseStats}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="button" className="btnGhost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
