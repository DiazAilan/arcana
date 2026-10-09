import type { CardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import { groupDeck } from './deckGrouping'
import styles from './DeckViewerModal.module.scss'

type Props = {
  deck: CardInstance[]
  onClose: () => void
}

export function DeckViewerModal({ deck, onClose }: Props) {
  const groups = groupDeck(deck)

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal
        aria-labelledby="deck-viewer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="deck-viewer-title">Your Deck</h2>
          <button type="button" className="btnGhost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.grid}>
            {groups.map((g) => (
              <div key={g.key} className={styles.item}>
                {g.count > 1 ? <span className={styles.count}>×{g.count}</span> : null}
                <CardView card={g.sample} />
              </div>
            ))}
          </div>
        </div>
        <p className={styles.footer}>{deck.length} cards total</p>
      </div>
    </div>
  )
}
