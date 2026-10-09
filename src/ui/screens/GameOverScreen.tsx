import { useGame } from '../../context/GameContext'
import styles from './EndScreen.module.scss'

export function GameOverScreen() {
  const { dispatch } = useGame()

  return (
    <div className={styles.end}>
      <h1>Defeat</h1>
      <p>Your run ends in the vaults below.</p>
      <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'GO_MAIN_MENU' })}>
        Try Again
      </button>
    </div>
  )
}
