import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { DevSpriteGallery } from './DevSpriteGallery'
import styles from './MainMenuScreen.module.scss'

export function MainMenuScreen() {
  const { dispatch } = useGame()
  const [showGallery, setShowGallery] = useState(false)

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
      {import.meta.env.DEV ? (
        <button type="button" className="btnGhost" onClick={() => setShowGallery(true)}>
          Sprite gallery
        </button>
      ) : null}
    </div>
  )
}
