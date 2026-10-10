import { useEffect, useState, type ReactNode } from 'react'
import type { RunState } from '../../game/models/session'
import { HpBar } from './HpBar'
import { RelicBar } from './RelicBar'
import { DeckViewerModal } from './DeckViewerModal'
import styles from './RunHud.module.scss'

type Props = {
  run: RunState
  center?: ReactNode
  trailing?: ReactNode
  showDeck?: boolean
  deckOpen?: boolean
  onDeckOpenChange?: (open: boolean) => void
}

export function RunHud({
  run,
  center,
  trailing,
  showDeck = true,
  deckOpen: deckOpenProp,
  onDeckOpenChange,
}: Props) {
  const [deckOpenInternal, setDeckOpenInternal] = useState(false)
  const deckOpen = deckOpenProp ?? deckOpenInternal

  const setDeckOpen = (open: boolean) => {
    onDeckOpenChange?.(open)
    if (deckOpenProp === undefined) setDeckOpenInternal(open)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'KeyD' || e.repeat) return
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
              Deck ({run.deck.length}) · D
            </button>
          ) : null}
          {trailing}
        </div>
      </header>
      {deckOpen ? <DeckViewerModal deck={run.deck} onClose={() => setDeckOpen(false)} /> : null}
    </>
  )
}
