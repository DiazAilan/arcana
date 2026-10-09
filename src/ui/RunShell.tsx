import { useGame } from '../context/GameContext'
import { CombatScreen } from './screens/CombatScreen'
import { EventScreen } from './screens/EventScreen'
import { GameOverScreen } from './screens/GameOverScreen'
import { MainMenuScreen } from './screens/MainMenuScreen'
import { MapScreen } from './screens/MapScreen'
import { RestScreen } from './screens/RestScreen'
import { RewardScreen } from './screens/RewardScreen'
import { ShopScreen } from './screens/ShopScreen'
import { VictoryScreen } from './screens/VictoryScreen'

export function RunShell() {
  const { session } = useGame()
  const phase = session.phase.kind

  switch (phase) {
    case 'main_menu':
      return <MainMenuScreen />
    case 'map':
      return <MapScreen />
    case 'combat':
      return <CombatScreen />
    case 'reward':
      return <RewardScreen />
    case 'shop':
      return <ShopScreen />
    case 'rest':
      return <RestScreen />
    case 'event':
      return <EventScreen />
    case 'victory':
      return <VictoryScreen />
    case 'game_over':
      return <GameOverScreen />
    default:
      return null
  }
}
