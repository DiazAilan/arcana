import { useEffect } from 'react'
import { playSfx } from '../../audio/sfxPlayer'
import { useSettings } from '../../context/SettingsContext'
import styles from './SettingsModal.module.scss'

type Props = {
  onClose: () => void
}

export function SettingsModal({ onClose }: Props) {
  const { settings, setSfxVolume } = useSettings()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="settings-title">Settings</h2>
          <button type="button" className="btnGhost" onClick={onClose}>
            Close
          </button>
        </div>
        <label className={styles.row}>
          <span>Sound effects</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(settings.sfxVolume * 100)}
            onChange={(e) => {
              const v = Number(e.target.value) / 100
              setSfxVolume(v)
              playSfx('blockGain', { volumeMultiplier: 0.6 })
            }}
          />
          <span className={styles.value}>{Math.round(settings.sfxVolume * 100)}%</span>
        </label>
      </div>
    </div>
  )
}
