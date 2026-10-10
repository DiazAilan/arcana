import { useGame } from '../../context/GameContext'
import styles from './EndScreen.module.scss'

export function GameOverScreen() {
  const { dispatch } = useGame()

  return (
    <div className={styles.end}>
      <h1>Defeat</h1>
      <p>The tomb claims another delver. Your name will not be remembered.</p>
      <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'GO_MAIN_MENU' })}>
        Try Again
      </button>
    </div>
  )
}
