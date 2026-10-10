import { PALETTE_LEGEND, SPRITE_REGISTRY } from '../../game/content/art/sprites'
import { PixelSprite } from '../components/PixelSprite'
import styles from './DevSpriteGallery.module.scss'

type Props = {
  onClose: () => void
}

export function DevSpriteGallery({ onClose }: Props) {
  return (
    <div className={styles.gallery}>
      <div className={styles.header}>
        <h1>Sprite gallery (16×16)</h1>
        <button type="button" className="btnGhost" onClick={onClose}>
          Back
        </button>
      </div>
      <p className={styles.hint}>
        Edit art in{' '}
        <code>src/game/content/art/literals/cardArt.ts</code> and{' '}
        <code>enemyArt.ts</code> — each line is one row, each character is a palette key below.
      </p>
      <div className={styles.legend}>
        {PALETTE_LEGEND.map(({ key, hex }) => (
          <span key={key} className={styles.swatch} title={hex}>
            <span className={styles.chip} style={{ background: hex }} />
            {key}={hex}
          </span>
        ))}
        <span className={styles.swatch}>.=transparent</span>
      </div>
      <div className={styles.grid}>
        {SPRITE_REGISTRY.map((entry) => (
          <div key={entry.id} className={styles.card}>
            <div className={styles.label}>{entry.label}</div>
            <div className={styles.preview}>
              <PixelSprite rows={entry.rows} pixelSize={8} />
            </div>
            <pre className={styles.source}>{entry.rows.map((row) => `'${row}',`).join('\n')}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
