import { getEventSprite } from '../../game/content/art/sprites'
import { PixelSprite } from './PixelSprite'
import styles from './EventArt.module.scss'

type Props = {
  eventId: string
  title?: string
}

export function EventArt({ eventId, title }: Props) {
  const sprite = getEventSprite(eventId)
  return (
    <div className={styles.frame} title={title}>
      <PixelSprite rows={sprite} pixelSize={1} />
    </div>
  )
}
