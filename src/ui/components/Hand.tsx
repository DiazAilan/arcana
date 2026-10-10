import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardInstance } from '../../game/models/card'
import type { CombatState } from '../../game/combat/combatState'
import { getRegistry } from '../../game/content/registry'
import { getCardEffectsForInstance, getResolvedCardCost } from '../../game/combat/applyEffects'
import { getCardStatPreviews } from '../../game/combat/cardPreview'
import { requiresEnemyTarget } from '../../game/combat/cardTargeting'
import { CardDragGhost } from './CardDragGhost'
import { CardInspectModal } from './CardInspectModal'
import { CardView } from './CardView'
import { findDropTarget, resolveDropPlay } from './cardDrop'
import styles from './Hand.module.scss'

const DRAG_THRESHOLD = 8
const DRAW_ANIM_MS = 240

type Props = {
  hand: CardInstance[]
  energy: number
  combat: Pick<CombatState, 'playerPowers' | 'enemies'>
  dragOverEnemy: number | null
  onPlay: (index: number, targetEnemyIndex?: number) => void
  canPlay: boolean
  onDragOverEnemy: (index: number | null) => void
  onDraggingIndexChange: (index: number | null) => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  const tag = (target as HTMLElement)?.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON'
}

const MAX_HAND_HOTKEY_INDEX = 9

function digitToIndex(key: string): number | null {
  if (key >= '1' && key <= '9') return Number(key) - 1
  if (key === '0') return MAX_HAND_HOTKEY_INDEX
  return null
}

function handSlotKeyLabel(index: number): string {
  if (index === MAX_HAND_HOTKEY_INDEX) return '0'
  return String(index + 1)
}

export function Hand({
  hand,
  energy,
  combat,
  dragOverEnemy,
  onPlay,
  canPlay,
  onDragOverEnemy,
  onDraggingIndexChange,
}: Props) {
  const handRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ index: number; pointerId: number; startX: number; startY: number; active: boolean } | null>(
    null,
  )
  const keyboardDragRef = useRef<{ index: number; code: string } | null>(null)
  const suppressClickRef = useRef(false)
  const cursorRef = useRef({ x: 0, y: 0 })
  const prevHandIdsRef = useRef<string[]>([])

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 })
  const [ghostVisible, setGhostVisible] = useState(false)
  const [enteringIds, setEnteringIds] = useState<Set<string>>(new Set())
  const [inspectCard, setInspectCard] = useState<CardInstance | null>(null)

  const previewTarget =
    draggingIndex != null && dragOverEnemy != null ? dragOverEnemy : undefined

  const statPreviewsFor = useCallback(
    (card: CardInstance) => {
      const effects = getCardEffectsForInstance(card)
      return getCardStatPreviews(combat, effects, {
        targetEnemyIndex: previewTarget,
      })
    },
    [combat, previewTarget],
  )

  const setDragIndex = useCallback(
    (index: number | null) => {
      setDraggingIndex(index)
      onDraggingIndexChange(index)
    },
    [onDraggingIndexChange],
  )

  const tryPlay = useCallback(
    (index: number, targetEnemyIndex?: number) => {
      const card = hand[index]
      if (!card || !canPlay) return
      const def = getRegistry().cards.get(card.defId)
      if (!def || energy < getResolvedCardCost(card)) return
      onPlay(index, targetEnemyIndex)
    },
    [hand, canPlay, energy, onPlay],
  )

  const syncHoverFromCursor = useCallback(
    (clientX: number, clientY: number) => {
      const drop = findDropTarget(clientX, clientY)
      onDragOverEnemy(drop.hand ? null : drop.enemyIndex)
    },
    [onDragOverEnemy],
  )

  const clearDragUi = useCallback(() => {
    setDragIndex(null)
    setGhostVisible(false)
    onDragOverEnemy(null)
  }, [onDragOverEnemy, setDragIndex])

  const finishDragAt = useCallback(
    (index: number, clientX: number, clientY: number) => {
      const card = hand[index]
      if (!card) return
      const effects = getCardEffectsForInstance(card)
      const drop = findDropTarget(clientX, clientY)
      const result = resolveDropPlay(effects, drop)
      if (result.action === 'play') {
        suppressClickRef.current = true
        tryPlay(index, result.targetEnemyIndex)
      }
    },
    [hand, tryPlay],
  )

  const finishPointerDrag = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current
      dragRef.current = null
      if (!drag || !drag.active) {
        clearDragUi()
        return
      }
      finishDragAt(drag.index, clientX, clientY)
      clearDragUi()
    },
    [clearDragUi, finishDragAt],
  )

  useEffect(() => {
    if (!inspectCard) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectCard(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inspectCard])

  useEffect(() => {
    const prev = prevHandIdsRef.current
    const nextIds = hand.map((c) => c.instanceId)
    const added = nextIds.filter((id) => !prev.includes(id))
    prevHandIdsRef.current = nextIds

    if (added.length === 0) return
    setEnteringIds((s) => new Set([...s, ...added]))
    const t = window.setTimeout(() => {
      setEnteringIds((s) => {
        const n = new Set(s)
        for (const id of added) n.delete(id)
        return n
      })
    }, DRAW_ANIM_MS)
    return () => window.clearTimeout(t)
  }, [hand])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) {
        if (keyboardDragRef.current) {
          setGhostPos(cursorRef.current)
          syncHoverFromCursor(e.clientX, e.clientY)
        }
        return
      }

      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (!drag.active && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
        drag.active = true
        setDragIndex(drag.index)
        setGhostVisible(true)
        setGhostPos({ x: e.clientX, y: e.clientY })
      }

      if (drag.active) {
        setGhostPos({ x: e.clientX, y: e.clientY })
        const drop = findDropTarget(e.clientX, e.clientY)
        onDragOverEnemy(drop.hand ? null : drop.enemyIndex)
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
      if (keyboardDragRef.current) {
        setGhostPos(cursorRef.current)
        syncHoverFromCursor(e.clientX, e.clientY)
      }
    }

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) return
      finishPointerDrag(e.clientX, e.clientY)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [finishPointerDrag, onDragOverEnemy, setDragIndex, syncHoverFromCursor])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!canPlay || isTypingTarget(e.target)) return
      if (dragRef.current?.active) return

      const idx = digitToIndex(e.key)
      if (idx == null) return
      if (keyboardDragRef.current || e.repeat) return

      const card = hand[idx]
      if (!card) return
      const def = getRegistry().cards.get(card.defId)
      if (!def || energy < getResolvedCardCost(card)) return

      e.preventDefault()
      keyboardDragRef.current = { index: idx, code: e.code }
      setDragIndex(idx)
      setGhostVisible(true)
      setGhostPos(cursorRef.current)
      syncHoverFromCursor(cursorRef.current.x, cursorRef.current.y)
    }

    const onKeyUp = (e: KeyboardEvent) => {
      const hold = keyboardDragRef.current
      if (!hold || e.code !== hold.code) return

      e.preventDefault()
      keyboardDragRef.current = null
      finishDragAt(hold.index, cursorRef.current.x, cursorRef.current.y)
      clearDragUi()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [canPlay, clearDragUi, energy, finishDragAt, hand, setDragIndex, syncHoverFromCursor])

  const onPointerDown = (index: number) => (e: React.PointerEvent) => {
    if (!canPlay || e.button !== 0 || keyboardDragRef.current) return
    dragRef.current = {
      index,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      active: false,
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onContextMenu = (card: CardInstance) => (e: React.MouseEvent) => {
    if (draggingIndex != null || dragRef.current?.active) return
    e.preventDefault()
    setInspectCard(card)
  }

  const onCardClick = (index: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    const card = hand[index]
    if (!card) return
    const effects = getCardEffectsForInstance(card)
    if (requiresEnemyTarget(effects)) tryPlay(index, 0)
    else tryPlay(index)
  }

  const ghostCard = draggingIndex != null ? hand[draggingIndex] ?? null : null
  const ghostPreviews = ghostCard ? statPreviewsFor(ghostCard) : undefined

  return (
    <>
      <CardDragGhost
        card={ghostCard}
        x={ghostPos.x}
        y={ghostPos.y}
        visible={ghostVisible}
        statPreviews={ghostPreviews}
      />
      {inspectCard ? <CardInspectModal card={inspectCard} onClose={() => setInspectCard(null)} /> : null}
      <div ref={handRef} className={styles.handZone} data-hand-zone>
        <div className={styles.cardRow}>
          {hand.map((card, index) => (
            <div
              key={card.instanceId}
              className={`${styles.slot} ${enteringIds.has(card.instanceId) ? styles.entering : ''}`}
              style={{ ['--i' as string]: index }}
            >
              <span className={styles.slotKey}>{handSlotKeyLabel(index)}</span>
              <CardView
                card={card}
                disabled={!canPlay}
                dragging={draggingIndex === index}
                onPointerDown={onPointerDown(index)}
                onContextMenu={onContextMenu(card)}
                onClick={() => onCardClick(index)}
                statMode="combat"
                statPreviews={statPreviewsFor(card)}
              />
            </div>
          ))}
        </div>
        <span className={styles.hint}>
          Energy: {energy} · 1–9, 0=10th · hold & release · drag to play · right-click: base card
        </span>
      </div>
    </>
  )
}
