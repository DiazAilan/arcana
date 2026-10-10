import type { CardInstance } from '../../game/models/card'
import { getCardBaseStats } from '../../game/combat/cardPreview'
import { getCardEffects } from '../../game/combat/applyEffects'
import { CardView } from './CardView'
import styles from './CardInspectModal.module.scss'

type Props = {
  card: CardInstance
  onClose: () => void
}

export function CardInspectModal({ card, onClose }: Props) {
  const effects = getCardEffects(card.defId, card.upgraded)
  const baseStats = getCardBaseStats(effects)

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div className={styles.panel} role="dialog" aria-modal aria-label="Base card" onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Base card</h2>
        <p className={styles.sub}>Printed values — no combat modifiers</p>
        <CardView card={card} statMode="base" baseStats={baseStats} disabled />
        <button type="button" className="btnGhost" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
