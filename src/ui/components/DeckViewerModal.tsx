import { getRegistry } from '../../game/content/registry'
import type { CardInstance } from '../../game/models/card'
import type { RelicInstance } from '../../game/models/relicInstance'
import { resolveRelicInstance } from '../../game/run/resolveRelic'
import { CardView } from './CardView'
import { groupDeck } from './deckGrouping'
import { RelicIcon } from './RelicIcon'
import styles from './DeckViewerModal.module.scss'

type Props = {
  deck: CardInstance[]
  relics: RelicInstance[]
  onClose: () => void
  footerNote?: string
}

export function DeckViewerModal({ deck, relics, onClose, footerNote }: Props) {
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
            {relics.length === 0 ? (
              <p className={styles.empty}>No relics yet.</p>
            ) : (
              <ul className={styles.relicList}>
                {relics.map((inst) => {
                  const relic = registry.relics.get(inst.defId)
                  if (!relic) return null
                  const resolved = resolveRelicInstance(inst)
                  return (
                    <li key={inst.instanceId} className={styles.relicItem}>
                      <RelicIcon relicId={resolved.artKey} size="md" />
                      <div className={styles.relicText}>
                        <span className={styles.relicName}>{relic.name}</span>
                        <p className={styles.relicDesc}>
                          {relic.description}
                          {resolved.descriptionSuffix}
                        </p>
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
          {relics.length} relic{relics.length === 1 ? '' : 's'} · {deck.length} cards
        </p>
      </div>
    </div>
  )
}
