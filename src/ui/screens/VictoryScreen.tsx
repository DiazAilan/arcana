import { useGame } from '../../context/GameContext'
import styles from './EndScreen.module.scss'

export function VictoryScreen() {
  const { dispatch } = useGame()

  return (
    <div className={styles.end}>
      <h1>Victory</h1>
      <p>The Archivist falls silent. Act I is yours.</p>
      <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'GO_MAIN_MENU' })}>
        Main Menu
      </button>
    </div>
  )
}
