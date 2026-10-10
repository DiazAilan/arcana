import { useState } from 'react'
import {
  PALETTE_LEGEND,
  spritesForGroup,
  type SpriteGroup,
} from '../../game/content/art/sprites'
import { PixelSprite } from '../components/PixelSprite'
import styles from './DevSpriteGallery.module.scss'

type Props = {
  onClose: () => void
}

const TABS: { id: SpriteGroup; label: string; file: string }[] = [
  { id: 'card', label: 'Cards', file: 'cardArt.ts' },
  { id: 'enemy', label: 'Enemies', file: 'enemyArt.ts' },
  { id: 'relic', label: 'Relics', file: 'relicArt.ts' },
]

export function DevSpriteGallery({ onClose }: Props) {
  const [tab, setTab] = useState<SpriteGroup>('card')
  const active = TABS.find((t) => t.id === tab)!
  const entries = spritesForGroup(tab)

  return (
    <div className={styles.gallery}>
      <div className={styles.header}>
        <h1>Sprite gallery (16×16)</h1>
        <button type="button" className="btnGhost" onClick={onClose}>
          Back
        </button>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Sprite categories">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <span className={styles.tabCount}>{spritesForGroup(t.id).length}</span>
          </button>
        ))}
      </div>

      <p className={styles.hint}>
        Edit art in{' '}
        <code>src/game/content/art/literals/{active.file}</code> — each line is one row, each
        character is a palette key below.
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
      <div className={styles.grid} role="tabpanel">
        {entries.map((entry) => (
          <div key={entry.id} className={styles.card}>
            <div className={styles.label}>
              {entry.label}
              <span className={styles.id}>{entry.id}</span>
            </div>
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
