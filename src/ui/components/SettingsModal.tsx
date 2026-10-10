import { useEffect, useMemo } from 'react'
import { downloadAnalyticsCsv } from '../../analytics/exportAnalyticsCsv'
import { loadAnalyticsBlob } from '../../analytics/storage'
import { playSfx } from '../../audio/sfxPlayer'
import { useSettings } from '../../context/SettingsContext'
import styles from './SettingsModal.module.scss'

type Props = {
  onClose: () => void
}

export function SettingsModal({ onClose }: Props) {
  const { settings, setSfxVolume } = useSettings()
  const runCount = useMemo(() => loadAnalyticsBlob().runs.length, [])

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
        <div className={styles.reportSection}>
          <p className={styles.reportLead}>
            Download a CSV of your run history (cards, relics, enemies). Data stays on this device
            until you export it—you can send the file to the developer to help balance the game and
            improve the experience.
          </p>
          <p className={styles.reportMeta}>
            {runCount === 0
              ? 'No completed runs recorded yet.'
              : `${runCount} run${runCount === 1 ? '' : 's'} in your local report.`}
          </p>
          <button
            type="button"
            className="btnPrimary"
            onClick={() => downloadAnalyticsCsv(loadAnalyticsBlob())}
          >
            Create report
          </button>
        </div>
      </div>
    </div>
  )
}
