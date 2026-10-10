import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from './gameSettings'

const KEY = 'arcana.settings.v1'

describe('gameSettings', () => {
  const store = new Map<string, string>()

  beforeEach(() => {
    store.clear()
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store.set(k, v)
      },
      removeItem: (k: string) => {
        store.delete(k)
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('round-trips sfx volume', () => {
    saveSettings({ sfxVolume: 0.42 })
    expect(loadSettings().sfxVolume).toBe(0.42)
  })

  it('clamps volume to 0–1', () => {
    saveSettings({ sfxVolume: 2 })
    expect(loadSettings().sfxVolume).toBe(1)
    saveSettings({ sfxVolume: -1 })
    expect(loadSettings().sfxVolume).toBe(0)
  })

  it('returns defaults when storage empty', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS)
    expect(store.has(KEY)).toBe(false)
  })
})
