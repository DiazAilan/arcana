import { getRegistry } from '../../game/content/registry'
import type { CardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import { groupDeck } from './deckGrouping'
import { RelicIcon } from './RelicIcon'
import styles from './DeckViewerModal.module.scss'

type Props = {
  deck: CardInstance[]
  relicIds: string[]
  onClose: () => void
  footerNote?: string
}

export function DeckViewerModal({ deck, relicIds, onClose, footerNote }: Props) {
  const groups = groupDeck(deck)
  const registry = getRegistry()

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal
        aria-labelledby="inventory-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="inventory-title">Inventory</h2>
          <button type="button" className="btnGhost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Relics</h3>
            {relicIds.length === 0 ? (
              <p className={styles.empty}>No relics yet.</p>
            ) : (
              <ul className={styles.relicList}>
                {relicIds.map((id) => {
                  const relic = registry.relics.get(id)
                  if (!relic) return null
                  return (
                    <li key={id} className={styles.relicItem}>
                      <RelicIcon relicId={id} size="md" />
                      <div className={styles.relicText}>
                        <span className={styles.relicName}>{relic.name}</span>
                        <p className={styles.relicDesc}>{relic.description}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Deck</h3>
            <div className={styles.grid}>
              {groups.map((g) => (
                <div key={g.key} className={styles.item}>
                  {g.count > 1 ? <span className={styles.count}>×{g.count}</span> : null}
                  <CardView card={g.sample} />
                </div>
              ))}
            </div>
          </section>
        </div>
        <p className={styles.footer}>
          {footerNote ? `${footerNote} · ` : null}
          {relicIds.length} relic{relicIds.length === 1 ? '' : 's'} · {deck.length} cards
        </p>
      </div>
    </div>
  )
}
