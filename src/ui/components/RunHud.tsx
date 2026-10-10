import { useEffect, useState, type ReactNode } from 'react'
import type { RunState } from '../../game/models/session'
import { HpBar } from './HpBar'
import { RelicBar } from './RelicBar'
import { DeckViewerModal } from './DeckViewerModal'
import { SettingsModal } from './SettingsModal'
import styles from './RunHud.module.scss'

type Props = {
  run: RunState
  center?: ReactNode
  trailing?: ReactNode
  showDeck?: boolean
  deckOpen?: boolean
  onDeckOpenChange?: (open: boolean) => void
  /** Shown in deck modal footer (e.g. during combat). */
  deckFooterNote?: string
}

export function RunHud({
  run,
  center,
  trailing,
  showDeck = true,
  deckOpen: deckOpenProp,
  onDeckOpenChange,
  deckFooterNote,
}: Props) {
  const [deckOpenInternal, setDeckOpenInternal] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const deckOpen = deckOpenProp ?? deckOpenInternal

  const setDeckOpen = (open: boolean) => {
    onDeckOpenChange?.(open)
    if (deckOpenProp === undefined) setDeckOpenInternal(open)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'KeyI' || e.repeat) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (!showDeck) return
      e.preventDefault()
      setDeckOpen(!deckOpen)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [deckOpen, showDeck])

  return (
    <>
      <header className={styles.hud}>
        <HpBar hp={run.hp} maxHp={run.maxHp} label="HP" />
        <span className={styles.gold}>{run.gold} gold</span>
        <RelicBar relicIds={run.relics} />
        {center}
        <div className={styles.right}>
          {showDeck ? (
            <button type="button" className="btnGhost" onClick={() => setDeckOpen(!deckOpen)}>
              Deck ({run.deck.length}) · I
            </button>
          ) : null}
          <button
            type="button"
            className={styles.settingsBtn}
            aria-label="Settings"
            onClick={() => setSettingsOpen(true)}
          >
            ⚙
          </button>
          {trailing}
        </div>
      </header>
      {deckOpen ? (
        <DeckViewerModal
          deck={run.deck}
          footerNote={deckFooterNote}
          onClose={() => setDeckOpen(false)}
        />
      ) : null}
      {settingsOpen ? <SettingsModal onClose={() => setSettingsOpen(false)} /> : null}
    </>
  )
}
