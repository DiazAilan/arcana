import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { CardView } from '../components/CardView'
import { RunHud } from '../components/RunHud'
import { UpgradeConfirmModal } from '../components/UpgradeConfirmModal'
import styles from './RestScreen.module.scss'

export function RestScreen() {
  const { session, dispatch } = useGame()
  const [pendingUpgradeId, setPendingUpgradeId] = useState<string | null>(null)

  if (session.phase.kind !== 'rest' || !session.run) return null

  const run = session.run
  const healAmount = Math.floor(run.maxHp * 0.3)
  const afterHeal = Math.min(run.maxHp, run.hp + healAmount)
  const pendingCard = pendingUpgradeId ? run.deck.find((c) => c.instanceId === pendingUpgradeId) : null

  return (
    <div className={styles.rest}>
      <RunHud run={run} />
      <h2>Rest Site</h2>
      <div className={styles.options}>
        <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'REST_HEAL' })}>
          Rest — heal {healAmount} HP ({run.hp} → {afterHeal})
        </button>
      </div>

      <p className={styles.label}>Or upgrade a card (then leave)</p>
      <div className={styles.deck}>
        {run.deck.map((card) => (
          <CardView
            key={card.instanceId}
            card={card}
            disabled={card.upgraded}
            onClick={() => !card.upgraded && setPendingUpgradeId(card.instanceId)}
          />
        ))}
      </div>

      <button type="button" className="btnGhost" onClick={() => dispatch({ type: 'REST_LEAVE' })}>
        Leave without upgrading
      </button>

      {pendingCard ? (
        <UpgradeConfirmModal
          card={pendingCard}
          onConfirm={() => {
            dispatch({ type: 'REST_UPGRADE', instanceId: pendingCard.instanceId })
            setPendingUpgradeId(null)
          }}
          onChooseAnother={() => setPendingUpgradeId(null)}
          onRestInstead={() => {
            setPendingUpgradeId(null)
            dispatch({ type: 'REST_HEAL' })
          }}
        />
      ) : null}
    </div>
  )
}
