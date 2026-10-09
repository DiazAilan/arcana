import { useState, type ReactNode } from 'react'
import type { RunState } from '../../game/models/session'
import { HpBar } from './HpBar'
import { RelicBar } from './RelicBar'
import { DeckViewerModal } from './DeckViewerModal'
import styles from './RunHud.module.scss'

type Props = {
  run: RunState
  /** Optional center content (e.g. encounter label, screen title) */
  center?: ReactNode
  /** Optional trailing content (e.g. energy orb in combat) */
  trailing?: ReactNode
  /** Hide deck button when deck viewer is not needed */
  showDeck?: boolean
}

export function RunHud({ run, center, trailing, showDeck = true }: Props) {
  const [deckOpen, setDeckOpen] = useState(false)

  return (
    <>
      <header className={styles.hud}>
        <HpBar hp={run.hp} maxHp={run.maxHp} label="HP" />
        <span className={styles.gold}>{run.gold} gold</span>
        <RelicBar relicIds={run.relics} />
        {center}
        <div className={styles.right}>
          {showDeck ? (
            <button type="button" className="btnGhost" onClick={() => setDeckOpen(true)}>
              Deck ({run.deck.length})
            </button>
          ) : null}
          {trailing}
        </div>
      </header>
      {deckOpen ? <DeckViewerModal deck={run.deck} onClose={() => setDeckOpen(false)} /> : null}
    </>
  )
}
