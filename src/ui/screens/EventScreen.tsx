import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { RunHud } from '../components/RunHud'
import styles from './EventScreen.module.scss'

export function EventScreen() {
  const { session, dispatch } = useGame()
  if (session.phase.kind !== 'event' || !session.run) return null

  const { eventId, outcome } = session.phase
  const def = getRegistry().events.get(eventId)
  if (!def) return null

  return (
    <div className={styles.event}>
      <RunHud run={session.run} />
      <h2>{def.title}</h2>
      <p className={styles.body}>{def.body}</p>

      {outcome ? (
        <div className={styles.outcome}>
          <p className={styles.outcomeLabel}>Result</p>
          <ul className={styles.outcomeList}>
            {outcome.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'EVENT_CONTINUE' })}>
            Continue
          </button>
        </div>
      ) : (
        <div className={styles.choices}>
          {def.choices.map((choice, index) => (
            <button
              key={index}
              type="button"
              className="btnPrimary"
              onClick={() => dispatch({ type: 'EVENT_CHOICE', choiceIndex: index })}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
