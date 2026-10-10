import type { CardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import styles from './DeckViewerModal.module.scss'

type Props = {
  discardPile: CardInstance[]
  onClose: () => void
}

export function DiscardPileModal({ discardPile, onClose }: Props) {
  const ordered = [...discardPile].reverse()

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal
        aria-labelledby="discard-pile-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="discard-pile-title">Discard pile</h2>
          <button type="button" className="btnGhost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.body}>
          {ordered.length === 0 ? (
            <p className={styles.footer}>Empty</p>
          ) : (
            <div className={styles.grid}>
              {ordered.map((card, i) => (
                <div key={`${card.instanceId}-${i}`} className={styles.item}>
                  <CardView card={card} />
                </div>
              ))}
            </div>
          )}
        </div>
        <p className={styles.footer}>{discardPile.length} cards discarded</p>
      </div>
    </div>
  )
}
