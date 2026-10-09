import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { EnergyOrb } from '../components/EnergyOrb'
import { Hand } from '../components/Hand'
import { HpBar } from '../components/HpBar'
import { IntentIcon } from '../components/IntentIcon'
import { RelicBar } from '../components/RelicBar'
import styles from './CombatScreen.module.scss'

export function CombatScreen() {
  const { session, dispatch } = useGame()
  if (session.phase.kind !== 'combat' || !session.run) return null

  const { combat, encounter } = session.phase
  const run = session.run
  const canPlay = combat.phase === 'player'

  const playCard = (handIndex: number) => {
    const card = combat.hand[handIndex]
    if (!card || !canPlay) return
    const def = getRegistry().cards.get(card.defId)
    if (!def || combat.energy < def.cost) return
    dispatch({ type: 'COMBAT', action: { type: 'PLAY_CARD', handIndex, targetEnemyIndex: 0 } })
  }

  return (
    <div className={styles.combat}>
      <header className={styles.top}>
        <RelicBar relicIds={run.relics} />
        <span className={styles.encounter}>{encounter}</span>
        <EnergyOrb current={combat.energy} max={combat.maxEnergy} />
      </header>

      <div className={styles.enemies}>
        {combat.enemies.map((enemy) => {
          const def = getRegistry().enemies.get(enemy.defId)
          return (
            <div key={enemy.instanceId} className={styles.enemy}>
              <IntentIcon enemy={enemy} />
              <h3>{def?.name ?? enemy.defId}</h3>
              <HpBar hp={enemy.hp} maxHp={enemy.maxHp} />
              {enemy.block > 0 ? <span className={styles.block}>Block {enemy.block}</span> : null}
            </div>
          )
        })}
      </div>

      <div className={styles.player}>
        <HpBar hp={run.hp} maxHp={run.maxHp} label="You" />
        {combat.playerBlock > 0 ? <span className={styles.block}>Block {combat.playerBlock}</span> : null}
        <div className={styles.piles}>
          Draw {combat.drawPile.length} · Discard {combat.discardPile.length}
        </div>
        <button
          type="button"
          className="btnPrimary"
          disabled={!canPlay}
          onClick={() => dispatch({ type: 'COMBAT', action: { type: 'END_TURN' } })}
        >
          End Turn
        </button>
      </div>

      <Hand hand={combat.hand} energy={combat.energy} onPlay={playCard} canPlay={canPlay} />
    </div>
  )
}
