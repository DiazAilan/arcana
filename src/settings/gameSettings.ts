export type GameSettings = {
  sfxVolume: number
}

const STORAGE_KEY = 'arcana.settings.v1'

export const DEFAULT_SETTINGS: GameSettings = {
  sfxVolume: 0.7,
}

function clampVolume(v: number): number {
  if (!Number.isFinite(v)) return DEFAULT_SETTINGS.sfxVolume
  return Math.min(1, Math.max(0, v))
}

export function loadSettings(): GameSettings {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_SETTINGS }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<GameSettings>
    return {
      sfxVolume: clampVolume(parsed.sfxVolume ?? DEFAULT_SETTINGS.sfxVolume),
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: GameSettings): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      sfxVolume: clampVolume(settings.sfxVolume),
    }),
  )
}
