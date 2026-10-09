import { GameProvider } from './context/GameContext'
import { RunShell } from './ui/RunShell'

export default function App() {
  return (
    <GameProvider>
      <div className="appShell">
        <div className="gameFrame">
          <RunShell />
        </div>
      </div>
    </GameProvider>
  )
}
