import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { preloadSfx, setSfxVolumeGetter } from '../audio/sfxPlayer'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type GameSettings,
} from '../settings/gameSettings'

type SettingsContextValue = {
  settings: GameSettings
  setSfxVolume: (volume: number) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings())

  useEffect(() => {
    setSfxVolumeGetter(() => settings.sfxVolume)
    preloadSfx()
  }, [settings.sfxVolume])

  const setSfxVolume = useCallback((volume: number) => {
    setSettings((prev) => {
      const next = { ...prev, sfxVolume: volume }
      saveSettings(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      settings,
      setSfxVolume,
    }),
    [settings, setSfxVolume],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    return {
      settings: DEFAULT_SETTINGS,
      setSfxVolume: () => {},
    }
  }
  return ctx
}
