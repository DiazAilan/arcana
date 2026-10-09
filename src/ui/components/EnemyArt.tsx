import { getEnemySprite } from '../../game/content/art/sprites'
import { PixelSprite } from './PixelSprite'
import styles from './EnemyArt.module.scss'

type Props = {
  defId: string
  artKey?: string
}

export function EnemyArt({ defId, artKey }: Props) {
  const key = artKey ?? defId
  const rows = getEnemySprite(key)
  return (
    <div className={styles.wrap}>
      <PixelSprite rows={rows} pixelSize={10} />
    </div>
  )
}
