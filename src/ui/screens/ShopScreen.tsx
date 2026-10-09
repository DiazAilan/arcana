import { useGame } from '../../context/GameContext'
import { getRegistry } from '../../game/content/registry'
import { createCardInstance } from '../../game/models/card'
import { CardView } from '../components/CardView'
import styles from './ShopScreen.module.scss'

export function ShopScreen() {
  const { session, dispatch } = useGame()
  if (session.phase.kind !== 'shop' || !session.run) return null

  const { shop } = session.phase
  const run = session.run
  const registry = getRegistry()

  return (
    <div className={styles.shop}>
      <header>
        <h2>Relic Market</h2>
        <span>{run.gold} gold</span>
      </header>

      <div className={styles.offers}>
        {shop.offers.map((offer, index) => {
          if (offer.purchased) return null
          if (offer.kind === 'card' && offer.cardId) {
            return (
              <div key={index} className={styles.offer}>
                <CardView card={createCardInstance(offer.cardId)} disabled />
                <button
                  type="button"
                  className="btnPrimary"
                  disabled={run.gold < offer.price}
                  onClick={() => dispatch({ type: 'SHOP_BUY', offerIndex: index })}
                >
                  Buy {offer.price}g
                </button>
              </div>
            )
          }
          if (offer.kind === 'relic' && offer.relicId) {
            const relic = registry.relics.get(offer.relicId)
            return (
              <div key={index} className={styles.offer}>
                <div className={styles.relic}>{relic?.name}</div>
                <p className={styles.desc}>{relic?.description}</p>
                <button
                  type="button"
                  className="btnPrimary"
                  disabled={run.gold < offer.price}
                  onClick={() => dispatch({ type: 'SHOP_BUY', offerIndex: index })}
                >
                  Buy {offer.price}g
                </button>
              </div>
            )
          }
          if (offer.kind === 'remove') {
            return (
              <div key={index} className={styles.remove}>
                <h3>Remove a card ({offer.price}g)</h3>
                <div className={styles.deck}>
                  {run.deck.map((card, deckIndex) => (
                    <CardView
                      key={card.instanceId}
                      card={card}
                      disabled={run.gold < offer.price}
                      onClick={() => dispatch({ type: 'SHOP_REMOVE_CARD', deckIndex })}
                    />
                  ))}
                </div>
              </div>
            )
          }
          return null
        })}
      </div>

      <button type="button" className="btnGhost" onClick={() => dispatch({ type: 'SHOP_LEAVE' })}>
        Leave shop
      </button>
    </div>
  )
}
