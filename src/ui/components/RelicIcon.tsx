import { getRelicSprite } from '../../game/content/art/sprites'
import { PixelSprite } from './PixelSprite'
import styles from './RelicIcon.module.scss'

type Props = {
  relicId: string
  size?: 'sm' | 'md' | 'lg'
  title?: string
}

const PIXEL: Record<NonNullable<Props['size']>, number> = {
  sm: 2,
  md: 3,
  lg: 4,
}

export function RelicIcon({ relicId, size = 'sm', title }: Props) {
  const sprite = getRelicSprite(relicId)
  return (
    <div className={`${styles.frame} ${styles[size]}`} title={title}>
      <PixelSprite rows={sprite} pixelSize={PIXEL[size]} />
    </div>
  )
}
