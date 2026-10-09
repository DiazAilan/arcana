import type { CardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import styles from './Hand.module.scss'

type Props = {
  hand: CardInstance[]
  energy: number
  onPlay: (index: number) => void
  canPlay: boolean
}

export function Hand({ hand, energy, onPlay, canPlay }: Props) {
  return (
    <div className={styles.hand}>
      {hand.map((card, index) => {
        const def = card // cost check in parent via registry in CardView - need cost here
        return (
          <div key={card.instanceId} className={styles.slot} style={{ ['--i' as string]: index }}>
            <CardView
              card={def}
              disabled={!canPlay}
              onClick={() => onPlay(index)}
            />
          </div>
        )
      })}
      <span className={styles.hint}>Energy: {energy}</span>
    </div>
  )
}
