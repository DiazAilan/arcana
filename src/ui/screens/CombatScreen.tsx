import { useEffect, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { BlockBadge } from '../components/BlockBadge'
import { EnemyArt } from '../components/EnemyArt'
import { EnergyOrb } from '../components/EnergyOrb'
import { Hand } from '../components/Hand'
import { HitParticles } from '../components/HitParticles'
import { HpBar } from '../components/HpBar'
import { IntentIcon } from '../components/IntentIcon'
import { PowerRow } from '../components/PowerRow'
import { RunHud } from '../components/RunHud'
import styles from './CombatScreen.module.scss'

export function CombatScreen() {
  const { session, dispatch } = useGame()
  const [dragOverEnemy, setDragOverEnemy] = useState<number | null>(null)
  const [hitFlash, setHitFlash] = useState(false)
  const [damageFloat, setDamageFloat] = useState<number | null>(null)
  const [enemyHit, setEnemyHit] = useState<{ id: string; seed: number } | null>(null)
  const [drawPileFlash, setDrawPileFlash] = useState(false)
  const prevHpRef = useRef<number | null>(null)
  const prevEnemyHpRef = useRef<Map<string, number>>(new Map())
  const prevDrawPileLenRef = useRef<number | null>(null)

  const phase = session.phase
  const inCombat = phase.kind === 'combat' && session.run != null
  const combat = phase.kind === 'combat' ? phase.combat : null
  const encounter = phase.kind === 'combat' ? phase.encounter : null
  const run = session.run
  const canPlay = combat?.phase === 'player'

  const hp = run?.hp ?? 0

  useEffect(() => {
    if (!inCombat || !run) return
    const prev = prevHpRef.current
    prevHpRef.current = run.hp
    if (prev == null || run.hp >= prev) return

    const delta = prev - run.hp
    setHitFlash(true)
    setDamageFloat(delta)
    const t1 = window.setTimeout(() => setHitFlash(false), 450)
    const t2 = window.setTimeout(() => setDamageFloat(null), 900)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [hp, inCombat, run])

  useEffect(() => {
    if (!combat) return

    const prevMap = prevEnemyHpRef.current
    for (const enemy of combat.enemies) {
      const prevHp = prevMap.get(enemy.instanceId)
      if (prevHp != null && enemy.hp < prevHp) {
        setEnemyHit({ id: enemy.instanceId, seed: Date.now() })
        window.setTimeout(() => setEnemyHit((h) => (h?.id === enemy.instanceId ? null : h)), 400)
      }
      prevMap.set(enemy.instanceId, enemy.hp)
    }
  }, [combat])

  useEffect(() => {
    if (!combat) return
    const len = combat.drawPile.length
    const prev = prevDrawPileLenRef.current
    prevDrawPileLenRef.current = len
    if (prev != null && len < prev && combat.hand.length > 0) {
      setDrawPileFlash(true)
      const t = window.setTimeout(() => setDrawPileFlash(false), 240)
      return () => window.clearTimeout(t)
    }
  }, [combat])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return
      if (!canPlay) return
      e.preventDefault()
      dispatch({ type: 'COMBAT', action: { type: 'END_TURN' } })
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canPlay, dispatch])

  if (!inCombat || !combat || !encounter || !run) return null

  const playCard = (handIndex: number, targetEnemyIndex?: number) => {
    const card = combat.hand[handIndex]
    if (!card || !canPlay) return
    const def = getRegistry().cards.get(card.defId)
    if (!def || combat.energy < def.cost) return
    dispatch({
      type: 'COMBAT',
      action: { type: 'PLAY_CARD', handIndex, targetEnemyIndex: targetEnemyIndex ?? 0 },
    })
  }

  return (
    <div className={`${styles.combat} ${hitFlash ? styles.hitFlash : ''}`}>
      <RunHud
        run={run}
        center={<span className={styles.encounter}>{encounter}</span>}
        trailing={<EnergyOrb current={combat.energy} max={combat.maxEnergy} />}
      />

      <div className={styles.enemies}>
        {combat.enemies.map((enemy, enemyIndex) => {
          const def = getRegistry().enemies.get(enemy.defId)
          const isDropTarget = dragOverEnemy === enemyIndex
          const shaking = enemyHit?.id === enemy.instanceId
          return (
            <div
              key={enemy.instanceId}
              className={`${styles.enemy} ${isDropTarget ? styles.enemyDropTarget : ''} ${shaking ? styles.enemyShake : ''}`}
              data-enemy-drop={enemyIndex}
            >
              <IntentIcon enemy={enemy} />
              <HitParticles active={shaking} seed={enemyHit?.seed ?? 0} />
              <EnemyArt defId={enemy.defId} artKey={def?.artKey} />
              <h3>{def?.name ?? enemy.defId}</h3>
              <HpBar hp={enemy.hp} maxHp={enemy.maxHp} />
              <BlockBadge block={enemy.block} />
              <PowerRow powers={enemy.powers} />
            </div>
          )
        })}
      </div>

      <div className={styles.playerDock}>
        <div className={`${styles.playerZone} ${hitFlash ? styles.playerShake : ''}`}>
          <div className={styles.playerMain}>
            <HpBar hp={run.hp} maxHp={run.maxHp} label="You" />
            {damageFloat != null ? <span className={styles.damageFloat}>−{damageFloat}</span> : null}
            <PowerRow powers={combat.playerPowers} />
            <div className={`${styles.piles} ${drawPileFlash ? styles.pilesFlash : ''}`}>
              Draw {combat.drawPile.length} · Discard {combat.discardPile.length}
            </div>
            <button
              type="button"
              className="btnPrimary"
              disabled={!canPlay}
              onClick={() => dispatch({ type: 'COMBAT', action: { type: 'END_TURN' } })}
            >
              End Turn (Space)
            </button>
          </div>
          <div className={styles.playerBlockWrap}>
            <BlockBadge block={combat.playerBlock} size="large" />
          </div>
        </div>

        <Hand
          hand={combat.hand}
          energy={combat.energy}
          onPlay={playCard}
          canPlay={canPlay}
          onDragOverEnemy={setDragOverEnemy}
        />
      </div>
    </div>
  )
}
