import { SPRITE_PALETTE } from '../../game/content/art/palette'
import type { SpriteRows } from '../../game/content/art/sprites'
import styles from './PixelSprite.module.scss'

type Props = {
  rows: SpriteRows
  pixelSize?: number
  className?: string
}

export function PixelSprite({ rows, pixelSize = 3, className }: Props) {
  const cols = rows[0]?.length ?? 0

  return (
    <div
      className={`${styles.sprite} ${className ?? ''}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
        width: cols * pixelSize,
        height: rows.length * pixelSize,
      }}
      aria-hidden
    >
      {rows.flatMap((row, y) =>
        row.split('').map((ch, x) => (
          <div
            key={`${y}-${x}`}
            className={styles.cell}
            style={{ background: ch === '.' ? 'transparent' : (SPRITE_PALETTE[ch] ?? ch) }}
          />
        )),
      )}
    </div>
  )
}
