import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardInstance } from '../../game/models/card'
import { getRegistry } from '../../game/content/registry'
import { getCardEffects } from '../../game/combat/applyEffects'
import { requiresEnemyTarget } from '../../game/combat/cardTargeting'
import { CardDragGhost } from './CardDragGhost'
import { CardView } from './CardView'
import { findDropTarget, resolveDropPlay } from './cardDrop'
import styles from './Hand.module.scss'

const DRAG_THRESHOLD = 8
const DRAW_ANIM_MS = 240

type Props = {
  hand: CardInstance[]
  energy: number
  onPlay: (index: number, targetEnemyIndex?: number) => void
  canPlay: boolean
  onDragOverEnemy: (index: number | null) => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  const tag = (target as HTMLElement)?.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON'
}

function digitToIndex(key: string): number | null {
  if (key >= '1' && key <= '5') return Number(key) - 1
  return null
}

export function Hand({ hand, energy, onPlay, canPlay, onDragOverEnemy }: Props) {
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

  const tryPlay = useCallback(
    (index: number, targetEnemyIndex?: number) => {
      const card = hand[index]
      if (!card || !canPlay) return
      const def = getRegistry().cards.get(card.defId)
      if (!def || energy < def.cost) return
      onPlay(index, targetEnemyIndex)
    },
    [hand, canPlay, energy, onPlay],
  )

  const clearDragUi = useCallback(() => {
    setDraggingIndex(null)
    setGhostVisible(false)
    onDragOverEnemy(null)
  }, [onDragOverEnemy])

  const finishDragAt = useCallback(
    (index: number, clientX: number, clientY: number) => {
      const card = hand[index]
      if (!card) return
      const effects = getCardEffects(card.defId, card.upgraded)
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
        if (keyboardDragRef.current) setGhostPos(cursorRef.current)
        return
      }

      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (!drag.active && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
        drag.active = true
        setDraggingIndex(drag.index)
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
      if (keyboardDragRef.current) setGhostPos(cursorRef.current)
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
  }, [finishPointerDrag, onDragOverEnemy])

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
      if (!def || energy < def.cost) return

      e.preventDefault()
      keyboardDragRef.current = { index: idx, code: e.code }
      setDraggingIndex(idx)
      setGhostVisible(true)
      setGhostPos(cursorRef.current)
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
  }, [canPlay, clearDragUi, energy, finishDragAt, hand])

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

  const onCardClick = (index: number) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    const card = hand[index]
    if (!card) return
    const effects = getCardEffects(card.defId, card.upgraded)
    if (requiresEnemyTarget(effects)) tryPlay(index, 0)
    else tryPlay(index)
  }

  const ghostCard = draggingIndex != null ? hand[draggingIndex] ?? null : null

  return (
    <>
      <CardDragGhost card={ghostCard} x={ghostPos.x} y={ghostPos.y} visible={ghostVisible} />
      <div ref={handRef} className={styles.hand} data-hand-zone>
        {hand.map((card, index) => (
          <div
            key={card.instanceId}
            className={`${styles.slot} ${enteringIds.has(card.instanceId) ? styles.entering : ''}`}
            style={{ ['--i' as string]: index }}
          >
            <span className={styles.slotKey}>{index + 1}</span>
            <CardView
              card={card}
              disabled={!canPlay}
              dragging={draggingIndex === index}
              onPointerDown={onPointerDown(index)}
              onClick={() => onCardClick(index)}
            />
          </div>
        ))}
        <span className={styles.hint}>Energy: {energy} · 1–5 hold & release · drag to play</span>
      </div>
    </>
  )
}
