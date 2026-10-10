import { useGame } from '../../context/GameContext'
import styles from './EndScreen.module.scss'

export function VictoryScreen() {
  const { session, dispatch } = useGame()
  const variant = session.phase.kind === 'victory' ? session.phase.variant : 'sealed'
  const isTrue = variant === 'true'

  return (
    <div className={styles.end}>
      <h1>{isTrue ? 'The Buried Stir' : 'Tomb Sealed'}</h1>
      <p>
        {isTrue
          ? 'The Avatar of Still Waters shatters. With a Heart in hand, you glimpse what sleeps below— and leave it undisturbed, for now.'
          : 'The Avatar of Still Waters falls silent. Without a Heart, the deepest chamber stays closed. The scale-legends remain forgotten.'}
      </p>
      <button type="button" className="btnPrimary" onClick={() => dispatch({ type: 'GO_MAIN_MENU' })}>
        Main Menu
      </button>
    </div>
  )
}
