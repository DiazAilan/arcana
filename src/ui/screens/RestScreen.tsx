import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { CardView } from '../components/CardView'
import { RunHud } from '../components/RunHud'
import { UpgradeConfirmModal } from '../components/UpgradeConfirmModal'
import styles from './RestScreen.module.scss'

export function RestScreen() {
  const { session, dispatch } = useGame()
  const [pendingUpgradeId, setPendingUpgradeId] = useState<string | null>(null)
  const [purifyMode, setPurifyMode] = useState(false)

  if (session.phase.kind !== 'rest' || !session.run) return null

  const run = session.run
  const registry = getRegistry()
  const healAmount = Math.floor(run.maxHp * 0.3)
  const afterHeal = Math.min(run.maxHp, run.hp + healAmount)
  const pendingCard = pendingUpgradeId ? run.deck.find((c) => c.instanceId === pendingUpgradeId) : null

  const cardsWithBane = run.deck.filter((c) =>
    c.influences.some((id) => registry.influences.get(id)?.polarity === 'bane'),
  )

  return (
    <div className={styles.rest}>
      <RunHud run={run} />
      <h2>Rest</h2>
      <div className={styles.options}>
        <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'REST_HEAL' })}>
          Rest — heal {healAmount} HP ({run.hp} → {afterHeal})
        </button>
        {cardsWithBane.length > 0 ? (
          <button
            type="button"
            className="btnGhost"
            onClick={() => {
              setPurifyMode(true)
              setPendingUpgradeId(null)
            }}
          >
            Purify a card (remove one bane influence)
          </button>
        ) : null}
      </div>

      {purifyMode ? (
        <>
          <p className={styles.label}>Choose a card to purify, then leave</p>
          <div className={styles.deck}>
            {cardsWithBane.map((card) => (
              <CardView
                key={card.instanceId}
                card={card}
                onClick={() => dispatch({ type: 'REST_PURIFY', instanceId: card.instanceId })}
              />
            ))}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}

      <button type="button" className="btnGhost" onClick={() => dispatch({ type: 'REST_LEAVE' })}>
        Leave
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
