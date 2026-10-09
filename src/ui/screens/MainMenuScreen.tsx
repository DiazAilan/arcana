import { useGame } from '../../context/GameContext'
import styles from './MainMenuScreen.module.scss'

export function MainMenuScreen() {
  const { dispatch } = useGame()

  return (
    <div className={styles.menu}>
      <h1 className={styles.title}>Arcana</h1>
      <p className={styles.tagline}>Climb the spire of ink and ember. One run. One deck.</p>
      <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'NEW_RUN' })}>
        New Run
      </button>
    </div>
  )
}
