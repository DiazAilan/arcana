import type { CardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import { groupDeck } from './deckGrouping'
import styles from './DeckViewerModal.module.scss'
import pileStyles from './DrawPileModal.module.scss'

type Props = {
  drawPile: CardInstance[]
  onClose: () => void
}

export function DrawPileModal({ drawPile, onClose }: Props) {
  const groups = groupDeck(drawPile)

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
          {drawPile.length === 0 ? (
            <p className={styles.footer}>Empty</p>
          ) : (
            <>
              <p className={pileStyles.hint}>Draw order is hidden; cards are grouped by name.</p>
              <div className={styles.grid}>
                {groups.map((g) => (
                  <div key={g.key} className={styles.item}>
                    {g.count > 1 ? <span className={styles.count}>×{g.count}</span> : null}
                    <CardView card={g.sample} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <p className={styles.footer}>{drawPile.length} cards to draw</p>
      </div>
    </div>
  )
}
