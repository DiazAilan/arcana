import type { CardStatPreview } from '../../game/combat/cardPreview'
import type { CardInstance } from '../../game/models/card'
import { CardView } from './CardView'
import styles from './CardDragGhost.module.scss'

type Props = {
  card: CardInstance | null
  x: number
  y: number
  visible: boolean
  statPreviews?: CardStatPreview[]
}

export function CardDragGhost({ card, x, y, visible, statPreviews }: Props) {
  if (!visible || !card) return null

  return (
    <div className={styles.ghost} style={{ left: x, top: y }}>
      <CardView card={card} statMode="combat" statPreviews={statPreviews} />
    </div>
  )
}
