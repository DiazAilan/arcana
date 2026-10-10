import { GameProvider } from './context/GameContext'
import { SettingsProvider } from './context/SettingsContext'
import { RunShell } from './ui/RunShell'

export default function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <div className="appShell">
          <div className="gameFrame">
            <RunShell />
          </div>
        </div>
      </GameProvider>
    </SettingsProvider>
  )
}
