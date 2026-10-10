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
  showInventory?: boolean
  inventoryOpen?: boolean
  onInventoryOpenChange?: (open: boolean) => void
  /** Shown in inventory modal footer (e.g. during combat). */
  inventoryFooterNote?: string
}

export function RunHud({
  run,
  center,
  trailing,
  showInventory = true,
  inventoryOpen: inventoryOpenProp,
  onInventoryOpenChange,
  inventoryFooterNote,
}: Props) {
  const [inventoryOpenInternal, setInventoryOpenInternal] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const inventoryOpen = inventoryOpenProp ?? inventoryOpenInternal

  const setInventoryOpen = (open: boolean) => {
    onInventoryOpenChange?.(open)
    if (inventoryOpenProp === undefined) setInventoryOpenInternal(open)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.code === 'KeyI' && showInventory) {
        e.preventDefault()
        setInventoryOpen(!inventoryOpen)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [inventoryOpen, showInventory])

  return (
    <>
      <header className={styles.hud}>
        <HpBar hp={run.hp} maxHp={run.maxHp} label="HP" />
        <span className={styles.gold}>{run.gold} gold</span>
        <RelicBar relicIds={run.relics} />
        {center}
        <div className={styles.right}>
          {showInventory ? (
            <button type="button" className="btnGhost" onClick={() => setInventoryOpen(!inventoryOpen)}>
              Inventory · I
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
      {inventoryOpen ? (
        <DeckViewerModal
          deck={run.deck}
          relicIds={run.relics}
          footerNote={inventoryFooterNote}
          onClose={() => setInventoryOpen(false)}
        />
      ) : null}
      {settingsOpen ? <SettingsModal onClose={() => setSettingsOpen(false)} /> : null}
    </>
  )
}
