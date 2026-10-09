import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { CardView } from '../components/CardView'
import { createCardInstance } from '../../game/models/card'
import styles from './RewardScreen.module.scss'

export function RewardScreen() {
  const { session, dispatch } = useGame()
  if (session.phase.kind !== 'reward' || !session.run) return null

  const { cardOffers, gold, relicOffer, cardResolved } = session.phase
  const registry = getRegistry()

  const canContinue = cardResolved && !relicOffer

  return (
    <div className={styles.reward}>
      <h2>Victory</h2>
      <p className={styles.gold}>+{gold} gold</p>

      {!cardResolved ? (
        <>
          <p className={styles.label}>Choose a card</p>
          <div className={styles.cards}>
            {cardOffers.map((id) => (
              <CardView
                key={id}
                card={createCardInstance(id)}
                onClick={() => dispatch({ type: 'REWARD_PICK_CARD', cardId: id })}
              />
            ))}
          </div>
          <button type="button" className="btnGhost" onClick={() => dispatch({ type: 'REWARD_SKIP_CARD' })}>
            Skip card
          </button>
        </>
      ) : null}

      {cardResolved && relicOffer ? (
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
