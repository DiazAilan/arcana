import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { createCardInstance } from '../../game/models/card'
import { CardUpgradeCompareModal } from '../components/CardUpgradeCompareModal'
import { CardView } from '../components/CardView'
import { EventArt } from '../components/EventArt'
import { RunHud } from '../components/RunHud'
import styles from './EventScreen.module.scss'

export function EventScreen() {
  const { session, dispatch } = useGame()
  const [compareDefId, setCompareDefId] = useState<string | null>(null)
  if (session.phase.kind !== 'event' || !session.run) return null

  const { eventId, outcome, offeredCards, pendingCards, cardDecisions } = session.phase
  const def = getRegistry().events.get(eventId)
  if (!def) return null

  const cardsPending =
    pendingCards != null && pendingCards.length > 0
  const canContinue = outcome != null && !cardsPending

  return (
    <div className={styles.event}>
      <RunHud run={session.run} />
      <EventArt eventId={eventId} title={def.title} />
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

          {offeredCards && offeredCards.length > 0 ? (
            <div className={styles.cardOffers}>
              <p className={styles.cardOffersLabel}>Card offers</p>
              <div className={styles.cardGrid}>
                {offeredCards.map((cardId) => {
                  const pending = pendingCards?.includes(cardId) ?? false
                  const decision = cardDecisions?.[cardId]
                  return (
                    <div key={cardId} className={styles.cardOffer}>
                      <CardView
                        card={createCardInstance(cardId)}
                        disabled={!pending}
                        onContextMenu={(e) => {
                          e.preventDefault()
                          setCompareDefId(cardId)
                        }}
                      />
                      {pending ? (
                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            className="btnPrimary"
                            onClick={() =>
                              dispatch({ type: 'EVENT_CARD_DECISION', cardId, accept: true })
                            }
                          >
                            Take
                          </button>
                          <button
                            type="button"
                            className="btnGhost"
                            onClick={() =>
                              dispatch({ type: 'EVENT_CARD_DECISION', cardId, accept: false })
                            }
                          >
                            Skip
                          </button>
                        </div>
                      ) : (
                        <p className={styles.cardResolved}>
                          {decision === 'taken' ? 'Added to deck' : 'Skipped'}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
              <p className={styles.cardHint}>Right-click a card to preview upgrade</p>
            </div>
          ) : null}

          {compareDefId ? (
            <CardUpgradeCompareModal defId={compareDefId} onClose={() => setCompareDefId(null)} />
          ) : null}

          <button
            type="button"
            className="btnPrimary"
            disabled={!canContinue}
            onClick={() => dispatch({ type: 'EVENT_CONTINUE' })}
          >
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
