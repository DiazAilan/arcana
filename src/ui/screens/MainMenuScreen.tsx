import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { SettingsModal } from '../components/SettingsModal'
import { DevSpriteGallery } from './DevSpriteGallery'
import styles from './MainMenuScreen.module.scss'

export function MainMenuScreen() {
  const { dispatch } = useGame()
  const [showGallery, setShowGallery] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  if (showGallery) {
    return <DevSpriteGallery onClose={() => setShowGallery(false)} />
  }

  return (
    <div className={styles.menu}>
      <h1 className={styles.title}>Arcana</h1>
      <p className={styles.tagline}>Climb the spire of ink and ember. One run. One deck.</p>
      <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'NEW_RUN' })}>
        New Run
      </button>
      <button type="button" className="btnGhost" onClick={() => setShowSettings(true)}>
        Settings
      </button>
      {showSettings ? <SettingsModal onClose={() => setShowSettings(false)} /> : null}
      {import.meta.env.DEV ? (
        <button type="button" className="btnGhost" onClick={() => setShowGallery(true)}>
          Sprite gallery
        </button>
      ) : null}
    </div>
  )
}
