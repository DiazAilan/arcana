import styles from './DeckViewerModal.module.scss'
import cardBackStyles from './DrawPileModal.module.scss'

type Props = {
  count: number
  onClose: () => void
}

function CardBack() {
  return <div className={cardBackStyles.back} aria-hidden />
}

export function DrawPileModal({ count, onClose }: Props) {
  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal
        aria-labelledby="draw-pile-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="draw-pile-title">Draw pile</h2>
          <button type="button" className="btnGhost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.body}>
          <p className={cardBackStyles.hint}>Order and identities are hidden.</p>
          <div className={styles.grid}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className={styles.item}>
                <CardBack />
              </div>
            ))}
          </div>
        </div>
        <p className={styles.footer}>{count} cards to draw</p>
      </div>
    </div>
  )
}
