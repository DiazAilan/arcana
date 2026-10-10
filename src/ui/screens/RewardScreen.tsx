import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { CardUpgradeCompareModal } from '../components/CardUpgradeCompareModal'
import { CardView } from '../components/CardView'
import { RunHud } from '../components/RunHud'
import { createCardInstance } from '../../game/models/card'
import styles from './RewardScreen.module.scss'

export function RewardScreen() {
  const { session, dispatch } = useGame()
  const [compareDefId, setCompareDefId] = useState<string | null>(null)
  if (session.phase.kind !== 'reward' || !session.run) return null

  const { cardOffers, gold, relicOffer, cardResolved, pendingInfluence } = session.phase
  const registry = getRegistry()

  const influenceDef = pendingInfluence
    ? registry.influences.get(pendingInfluence.influenceId)
    : null

  const canContinue = cardResolved && !relicOffer && !pendingInfluence

  const run = session.run

  return (
    <div className={styles.reward}>
      <RunHud run={run} />
      <h2>Victory</h2>
      <p className={styles.gold}>+{gold} gold</p>

      {pendingInfluence && influenceDef ? (
        <div className={styles.influence}>
          <p className={styles.label}>Something clings — choose a card to mark</p>
          <p className={styles.desc}>{influenceDef.description}</p>
          <div className={styles.cards}>
            {run.deck
              .filter((c) => pendingInfluence.eligibleInstanceIds.includes(c.instanceId))
              .map((card) => (
                <CardView
                  key={card.instanceId}
                  card={card}
                  onClick={() =>
                    dispatch({ type: 'REWARD_APPLY_INFLUENCE', instanceId: card.instanceId })
                  }
                />
              ))}
          </div>
        </div>
      ) : null}

      {!cardResolved && !pendingInfluence ? (
        <>
          <p className={styles.label}>Choose a card · right-click to preview upgrade</p>
          <div className={styles.cards}>
            {cardOffers.map((id) => (
              <CardView
                key={id}
                card={createCardInstance(id)}
                onClick={() => dispatch({ type: 'REWARD_PICK_CARD', cardId: id })}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setCompareDefId(id)
                }}
              />
            ))}
          </div>
          {compareDefId ? (
            <CardUpgradeCompareModal defId={compareDefId} onClose={() => setCompareDefId(null)} />
          ) : null}
          <button type="button" className="btnGhost" onClick={() => dispatch({ type: 'REWARD_SKIP_CARD' })}>
            Skip card
          </button>
        </>
      ) : null}

      {cardResolved && !pendingInfluence && relicOffer ? (
        <div className={styles.relic}>
          <p>Relic found: {registry.relics.get(relicOffer)?.name}</p>
          <p className={styles.desc}>{registry.relics.get(relicOffer)?.description}</p>
          <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'REWARD_TAKE_RELIC' })}>
            Take relic
          </button>
        </div>
      ) : null}

      {canContinue ? (
        <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'REWARD_CONTINUE' })}>
          Continue
        </button>
      ) : null}
    </div>
  )
}
