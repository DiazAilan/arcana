export type SfxId = 'blockGain' | 'dealDamage' | 'takeDamage' | 'blockHit'

const SFX_PATHS: Record<SfxId, string> = {
  blockGain: '/sfx/block-gain.wav',
  dealDamage: '/sfx/deal-damage.wav',
  takeDamage: '/sfx/take-damage.wav',
  blockHit: '/sfx/block-hit.wav',
}

let volumeGetter: () => number = () => 0.7

export function setSfxVolumeGetter(getter: () => number): void {
  volumeGetter = getter
}

const cache = new Map<SfxId, HTMLAudioElement>()

function getAudio(id: SfxId): HTMLAudioElement {
  let el = cache.get(id)
  if (!el) {
    el = new Audio(SFX_PATHS[id])
    el.preload = 'auto'
    cache.set(id, el)
  }
  return el
}

export function playSfx(id: SfxId, options?: { volumeMultiplier?: number }): void {
  const master = volumeGetter()
  if (master <= 0) return

  const mult = options?.volumeMultiplier ?? 1
  const vol = Math.min(1, master * mult)
  if (vol <= 0) return

  try {
    const template = getAudio(id)
    const clip = template.cloneNode(true) as HTMLAudioElement
    clip.volume = vol
    void clip.play()
  } catch {
    // Autoplay or missing asset — ignore
  }
}

export function preloadSfx(): void {
  for (const id of Object.keys(SFX_PATHS) as SfxId[]) {
    getAudio(id).load()
  }
}
