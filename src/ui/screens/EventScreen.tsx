import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import styles from './EventScreen.module.scss'

export function EventScreen() {
  const { session, dispatch } = useGame()
  if (session.phase.kind !== 'event' || !session.run) return null

  const def = getRegistry().events.get(session.phase.eventId)
  if (!def) return null

  return (
    <div className={styles.event}>
      <h2>{def.title}</h2>
      <p className={styles.body}>{def.body}</p>
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
    </div>
  )
}
