import { GameProvider } from './context/GameContext'
import { SettingsProvider } from './context/SettingsContext'
import { DevConsole } from './ui/components/DevConsole'
import { RunShell } from './ui/RunShell'

export default function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <div className="appShell">
          <div className="gameFrame">
            <RunShell />
          </div>
          {import.meta.env.DEV ? <DevConsole /> : null}
        </div>
      </GameProvider>
    </SettingsProvider>
  )
}
