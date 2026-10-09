import { useGame } from '../../context/GameContext'
import { CardView } from '../components/CardView'
import styles from './RestScreen.module.scss'

export function RestScreen() {
  const { session, dispatch } = useGame()
  if (session.phase.kind !== 'rest' || !session.run) return null

  const run = session.run

  return (
    <div className={styles.rest}>
      <h2>Rest Site</h2>
      <div className={styles.options}>
        <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'REST_HEAL' })}>
          Rest — heal 30% HP
        </button>
      </div>

      <p className={styles.label}>Or upgrade a card (then leave)</p>
      <div className={styles.deck}>
        {run.deck.map((card) => (
          <CardView
            key={card.instanceId}
            card={card}
            disabled={card.upgraded}
            onClick={() =>
              !card.upgraded && dispatch({ type: 'REST_UPGRADE', instanceId: card.instanceId })
            }
          />
        ))}
      </div>

      <button type="button" className="btnGhost" onClick={() => dispatch({ type: 'REST_LEAVE' })}>
        Leave without upgrading
      </button>
    </div>
  )
}
