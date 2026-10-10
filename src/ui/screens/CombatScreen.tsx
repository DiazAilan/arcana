import { useEffect, useRef, useState } from 'react'
import {
  enemyShakeClass,
  hpLossTier,
  playBlockDeflectSfx,
  playCardBashSfx,
  playIncomingDamageSfx,
  playOutgoingDamageSfx,
  playerShakeClass,
  shakeIntensityForTier,
  type ShakeIntensity,
} from '../../audio/combatSfx'
import { playSfx } from '../../audio/sfxPlayer'
import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import type { CombatState } from '../../game/combat/combatState'
import { getCardEffectsForInstance, getResolvedCardCost } from '../../game/combat/applyEffects'
import { cardHasEnemyTargetDamage, previewEnemyHpAfterCard } from '../../game/combat/cardPreview'
import { previewPlayerHpAfterEnemyTurn } from '../../game/combat/intents'
import { BlockBadge } from '../components/BlockBadge'
import { DiscardPileModal } from '../components/DiscardPileModal'
import { DrawPileModal } from '../components/DrawPileModal'
import { EnemyArt } from '../components/EnemyArt'
import { EnergyOrb } from '../components/EnergyOrb'
import { Hand } from '../components/Hand'
import { HitParticles } from '../components/HitParticles'
import { HpBar } from '../components/HpBar'
import { IntentIcon } from '../components/IntentIcon'
import { PowerRow } from '../components/PowerRow'
import { RunHud } from '../components/RunHud'
import type { EnemyInstance } from '../../game/models/enemy'
import { expectedAttackDamageToPlayer } from '../combat/expectedPlayerDamage'
import { heroicEffortHpCost } from '../../game/combat/combatState'
import { Tooltip } from '../components/Tooltip'
import styles from './CombatScreen.module.scss'

function isTypingTarget(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement)?.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON'
}

export function CombatScreen() {
  const { session, dispatch } = useGame()
  const [dragOverEnemy, setDragOverEnemy] = useState<number | null>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [hitFlash, setHitFlash] = useState(false)
  const [damageFloat, setDamageFloat] = useState<number | null>(null)
  const [enemyHit, setEnemyHit] = useState<{
    id: string
    seed: number
    shake: ShakeIntensity
  } | null>(null)
  const [playerShake, setPlayerShake] = useState<ShakeIntensity | null>(null)
  const lastPlayedCardRef = useRef<string | null>(null)
  const prevPlayerPowersRef = useRef<CombatState['playerPowers'] | null>(null)
  const [drawPileFlash, setDrawPileFlash] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [drawOpen, setDrawOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)

  const prevHpSfxRef = useRef<number | null>(null)
  const prevHpVisualRef = useRef<number | null>(null)
  const prevEnemyHpRef = useRef<Map<string, number>>(new Map())
  const prevDrawPileLenRef = useRef<number | null>(null)
  const prevBlockRef = useRef<number | null>(null)
  const prevTurnRef = useRef<number | null>(null)
  const prevEnemiesRef = useRef<EnemyInstance[] | null>(null)

  const phase = session.phase
  const inCombat = phase.kind === 'combat' && session.run != null
  const combat = phase.kind === 'combat' ? phase.combat : null
  const encounter = phase.kind === 'combat' ? phase.encounter : null
  const run = session.run
  const canPlay = combat?.phase === 'player'

  const hp = run?.hp ?? 0

  useEffect(() => {
    if (!inCombat || !run || !combat) return

    const prevHp = prevHpSfxRef.current
    const prevBlock = prevBlockRef.current
    const prevTurn = prevTurnRef.current
    const prevEnemies = prevEnemiesRef.current

    if (prevTurn != null && combat.turn > prevTurn && prevHp != null && prevBlock != null && prevEnemies) {
      const hpLost = prevHp - run.hp
      const playerPowersBefore = prevPlayerPowersRef.current ?? combat.playerPowers
      if (hpLost > 0) {
        const tier = hpLossTier(hpLost)
        playIncomingDamageSfx(hpLost)
        setPlayerShake(shakeIntensityForTier(tier))
        window.setTimeout(() => setPlayerShake(null), 600)
      } else if (
        hpLost === 0 &&
        expectedAttackDamageToPlayer(prevEnemies, playerPowersBefore) > 0
      ) {
        playBlockDeflectSfx()
        setPlayerShake(shakeIntensityForTier(0))
        window.setTimeout(() => setPlayerShake(null), 280)
      }
    } else if (
      prevBlock != null &&
      combat.playerBlock > prevBlock &&
      prevTurn === combat.turn &&
      combat.phase === 'player'
    ) {
      playSfx('blockGain')
    }

    prevHpSfxRef.current = run.hp
    prevBlockRef.current = combat.playerBlock
    prevTurnRef.current = combat.turn
    prevEnemiesRef.current = combat.enemies
    prevPlayerPowersRef.current = combat.playerPowers
  }, [combat, hp, inCombat, run])

  useEffect(() => {
    if (!inCombat || !run) return
    const prev = prevHpVisualRef.current
    prevHpVisualRef.current = run.hp
    if (prev == null || run.hp >= prev) return

    const delta = prev - run.hp
    setHitFlash(true)
    setDamageFloat(delta)
    const tier = hpLossTier(delta)
    setPlayerShake(shakeIntensityForTier(tier))
    window.setTimeout(() => setPlayerShake(null), 600)
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
      const prevEnemyHp = prevMap.get(enemy.instanceId)
      if (prevEnemyHp != null && enemy.hp < prevEnemyHp) {
        const hpLost = prevEnemyHp - enemy.hp
        const cardDefId = lastPlayedCardRef.current ?? undefined
        playOutgoingDamageSfx(hpLost, cardDefId)
        lastPlayedCardRef.current = null
        const tier = hpLossTier(hpLost)
        const shake = shakeIntensityForTier(tier)
        setEnemyHit({ id: enemy.instanceId, seed: Date.now(), shake })
        window.setTimeout(() => setEnemyHit((h) => (h?.id === enemy.instanceId ? null : h)), 450)
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
      if (isTypingTarget(e)) return

      if (e.code === 'Space' || e.key === ' ') {
        if (!canPlay) return
        e.preventDefault()
        dispatch({ type: 'COMBAT', action: { type: 'END_TURN' } })
        return
      }

      if (!inCombat) return

      if (e.code === 'KeyD' && !e.repeat) {
        e.preventDefault()
        setInventoryOpen(false)
        setDiscardOpen(false)
        setDrawOpen((open) => !open)
        return
      }

      if (e.code === 'KeyF' && !e.repeat) {
        e.preventDefault()
        setInventoryOpen(false)
        setDrawOpen(false)
        setDiscardOpen((open) => !open)
        return
      }

      if (e.key === 'Escape') {
        if (drawOpen || discardOpen || inventoryOpen) {
          e.preventDefault()
          setDrawOpen(false)
          setDiscardOpen(false)
          setInventoryOpen(false)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canPlay, inventoryOpen, discardOpen, dispatch, drawOpen, inCombat])

  useEffect(() => {
    if (!inCombat) {
      setDrawOpen(false)
      setDiscardOpen(false)
    }
  }, [inCombat])

  if (!inCombat || !combat || !encounter || !run) return null

  const playCard = (handIndex: number, targetEnemyIndex?: number) => {
    const card = combat.hand[handIndex]
    if (!card || !canPlay) return
    const def = getRegistry().cards.get(card.defId)
    if (!def || combat.energy < getResolvedCardCost(card)) return
    lastPlayedCardRef.current = card.defId
    if (card.defId === 'arc_bash') {
      playCardBashSfx()
    }
    dispatch({
      type: 'COMBAT',
      action: { type: 'PLAY_CARD', handIndex, targetEnemyIndex: targetEnemyIndex ?? 0 },
    })
  }

  const draggedCard = draggingIndex != null ? combat.hand[draggingIndex] : null
  const draggedEffects = draggedCard ? getCardEffectsForInstance(draggedCard) : []
  const showHpGhost =
    draggedCard != null &&
    dragOverEnemy != null &&
    cardHasEnemyTargetDamage(draggedEffects)

  const enemyHpPreview = (enemyIndex: number) => {
    if (!showHpGhost || dragOverEnemy !== enemyIndex) return null
    const enemy = combat.enemies[enemyIndex]
    if (!enemy) return null
    return previewEnemyHpAfterCard(enemy, combat, draggedEffects, enemyIndex)
  }

  const playerHpAfterTurn =
    canPlay ? previewPlayerHpAfterEnemyTurn(combat, run.hp) : null

  const openDraw = () => {
    setInventoryOpen(false)
    setDiscardOpen(false)
    setDrawOpen(true)
  }

  const openDiscard = () => {
    setInventoryOpen(false)
    setDrawOpen(false)
    setDiscardOpen(true)
  }

  const onInventoryOpenChange = (open: boolean) => {
    if (open) {
      setDrawOpen(false)
      setDiscardOpen(false)
    }
    setInventoryOpen(open)
  }

  const playerShakeStyle =
    playerShake != null
      ? styles[playerShakeClass(playerShake) as keyof typeof styles]
      : hitFlash
        ? styles.playerShakeMedium
        : ''

  return (
    <div className={`${styles.combat} ${hitFlash ? styles.hitFlash : ''}`}>
      <RunHud
        run={run}
        center={<span className={styles.encounter}>{encounter}</span>}
        inventoryOpen={inventoryOpen}
        onInventoryOpenChange={onInventoryOpenChange}
        inventoryFooterNote="Master deck — cards split across draw, hand, and discard during combat"
      />

      <div className={styles.enemies}>
        {combat.enemies.map((enemy, enemyIndex) => {
          const def = getRegistry().enemies.get(enemy.defId)
          const isDropTarget = dragOverEnemy === enemyIndex
          const shaking = enemyHit?.id === enemy.instanceId
          const enemyShakeStyle = shaking
            ? styles[enemyShakeClass(enemyHit.shake) as keyof typeof styles]
            : ''
          return (
            <div
              key={enemy.instanceId}
              className={`${styles.enemy} ${isDropTarget ? styles.enemyDropTarget : ''} ${enemyShakeStyle}`}
              data-enemy-drop={enemyIndex}
            >
              <IntentIcon enemy={enemy} playerPowers={combat.playerPowers} />
              <HitParticles active={shaking} seed={enemyHit?.seed ?? 0} />
              <EnemyArt defId={enemy.defId} artKey={def?.artKey} />
              <h3>{def?.name ?? enemy.defId}</h3>
              <HpBar hp={enemy.hp} maxHp={enemy.maxHp} previewHp={enemyHpPreview(enemyIndex)} />
              <BlockBadge block={enemy.block} />
              <PowerRow powers={enemy.powers} />
            </div>
          )
        })}
      </div>

      <div className={styles.playerBottom}>
        <div className={styles.playerHudBand}>
          <BlockBadge block={combat.playerBlock} size="large" />
          <div className={styles.playerEnergySlot}>
            <EnergyOrb
              current={combat.energy}
              max={combat.maxEnergy}
              size="combat"
              showTooltip
            />
            <Tooltip
              body={`Once per turn: lose HP to gain 1 Energy. Cost rises each time you push this fight (${combat.heroicEffortUsesThisCombat} used).`}
              placement="top"
            >
              <button
                type="button"
                className={styles.heroicEffortBtn}
                disabled={
                  !canPlay ||
                  combat.heroicEffortUsed ||
                  run.hp <= heroicEffortHpCost(combat.heroicEffortUsesThisCombat)
                }
                onClick={() => dispatch({ type: 'COMBAT', action: { type: 'HEROIC_EFFORT' } })}
              >
                Push yourself (−{heroicEffortHpCost(combat.heroicEffortUsesThisCombat)} HP)
              </button>
            </Tooltip>
          </div>
        </div>

        <div className={styles.playerDock}>
        <div className={`${styles.playerZone} ${playerShakeStyle}`}>
          <div className={styles.playerMain}>
            <HpBar
              hp={run.hp}
              maxHp={run.maxHp}
              label="You"
              previewHp={playerHpAfterTurn}
              size="large"
            />
            {damageFloat != null ? <span className={styles.damageFloat}>−{damageFloat}</span> : null}
            <PowerRow powers={combat.playerPowers} />
            <div className={`${styles.piles} ${drawPileFlash ? styles.pilesFlash : ''}`}>
              <button type="button" className={styles.pileBtn} onClick={openDraw}>
                Draw {combat.drawPile.length} · D
              </button>
              <span className={styles.pileSep}>·</span>
              <button type="button" className={styles.pileBtn} onClick={openDiscard}>
                Discard {combat.discardPile.length} · F
              </button>
            </div>
          </div>
          <button
            type="button"
            className={`btnPrimary ${styles.endTurnBtn}`}
            disabled={!canPlay}
            onClick={() => dispatch({ type: 'COMBAT', action: { type: 'END_TURN' } })}
          >
            End Turn (Space)
          </button>
        </div>

        <Hand
          hand={combat.hand}
          energy={combat.energy}
          combat={combat}
          dragOverEnemy={dragOverEnemy}
          onPlay={playCard}
          canPlay={canPlay}
          onDragOverEnemy={setDragOverEnemy}
          onDraggingIndexChange={setDraggingIndex}
        />
        </div>
      </div>

      {drawOpen ? (
        <DrawPileModal drawPile={combat.drawPile} onClose={() => setDrawOpen(false)} />
      ) : null}
      {discardOpen ? (
        <DiscardPileModal discardPile={combat.discardPile} onClose={() => setDiscardOpen(false)} />
      ) : null}
    </div>
  )
}
