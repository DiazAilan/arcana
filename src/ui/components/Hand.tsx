import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardInstance } from '../../game/models/card'
import { getRegistry } from '../../game/content/registry'
import { getCardEffects } from '../../game/combat/applyEffects'
import { requiresEnemyTarget } from '../../game/combat/cardTargeting'
import { CardView } from './CardView'
import styles from './Hand.module.scss'

const DRAG_THRESHOLD = 8

type Props = {
  hand: CardInstance[]
  energy: number
  onPlay: (index: number, targetEnemyIndex?: number) => void
  canPlay: boolean
  onDragOverEnemy: (index: number | null) => void
}

function findDropTarget(clientX: number, clientY: number): { hand: boolean; enemyIndex: number | null } {
  const el = document.elementFromPoint(clientX, clientY)
  if (!el) return { hand: false, enemyIndex: null }
  const handZone = el.closest('[data-hand-zone]')
  if (handZone) return { hand: true, enemyIndex: null }
  const enemyEl = el.closest('[data-enemy-drop]')
  if (enemyEl) {
    const idx = Number(enemyEl.getAttribute('data-enemy-drop'))
    if (!Number.isNaN(idx)) return { hand: false, enemyIndex: idx }
  }
  return { hand: false, enemyIndex: null }
}

export function Hand({ hand, energy, onPlay, canPlay, onDragOverEnemy }: Props) {
  const handRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ index: number; pointerId: number; startX: number; startY: number; active: boolean } | null>(
    null,
  )
  const suppressClickRef = useRef(false)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

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

  const finishDrag = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current
      dragRef.current = null
      setDraggingIndex(null)
      onDragOverEnemy(null)

      if (!drag || !drag.active) return
      suppressClickRef.current = true

      const card = hand[drag.index]
      if (!card) return
      const effects = getCardEffects(card.defId, card.upgraded)
      const needsTarget = requiresEnemyTarget(effects)
      const drop = findDropTarget(clientX, clientY)

      if (drop.hand) return

      if (needsTarget) {
        if (drop.enemyIndex != null) tryPlay(drag.index, drop.enemyIndex)
        return
      }

      if (!drop.hand) tryPlay(drag.index)
    },
    [hand, onDragOverEnemy, tryPlay],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) return

      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (!drag.active && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
        drag.active = true
        setDraggingIndex(drag.index)
      }

      if (drag.active) {
        const drop = findDropTarget(e.clientX, e.clientY)
        onDragOverEnemy(drop.hand ? null : drop.enemyIndex)
      }
    }

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || e.pointerId !== drag.pointerId) return
      finishDrag(e.clientX, e.clientY)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [finishDrag, onDragOverEnemy])

  const onPointerDown = (index: number) => (e: React.PointerEvent) => {
    if (!canPlay || e.button !== 0) return
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
    // Click fallback: non-target cards play; targeted cards hit first enemy.
    if (requiresEnemyTarget(effects)) tryPlay(index, 0)
    else tryPlay(index)
  }

  return (
    <div ref={handRef} className={styles.hand} data-hand-zone>
      {hand.map((card, index) => (
        <div key={card.instanceId} className={styles.slot} style={{ ['--i' as string]: index }}>
          <CardView
            card={card}
            disabled={!canPlay}
            dragging={draggingIndex === index}
            onPointerDown={onPointerDown(index)}
            onClick={() => onCardClick(index)}
          />
        </div>
      ))}
      <span className={styles.hint}>Energy: {energy} · Drag cards to play</span>
    </div>
  )
}
