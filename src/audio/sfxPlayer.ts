export type SfxId =
  | 'blockGain'
  | 'blockDeflect'
  | 'takeDamageT1'
  | 'takeDamageT2'
  | 'takeDamageT3'
  | 'takeDamageT4'
  | 'dealDamageT1'
  | 'dealDamageT2'
  | 'dealDamageT3'
  | 'dealDamageT4'
  | 'cardBash'
  | 'cardRupture'

/** Vite `base` is `/arcana/` on GitHub Pages — root-absolute `/sfx/...` 404s in production. */
function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL
  const rel = path.replace(/^\//, '')
  return `${base}${rel}`
}

const SFX_PATHS: Record<SfxId, string> = {
  blockGain: publicAsset('sfx/block-gain.wav'),
  blockDeflect: publicAsset('sfx/block-deflect.wav'),
  takeDamageT1: publicAsset('sfx/take-damage-t1.wav'),
  takeDamageT2: publicAsset('sfx/take-damage-t2.wav'),
  takeDamageT3: publicAsset('sfx/take-damage-t3.wav'),
  takeDamageT4: publicAsset('sfx/take-damage-t4.wav'),
  dealDamageT1: publicAsset('sfx/take-damage-t1.wav'),
  dealDamageT2: publicAsset('sfx/take-damage-t2.wav'),
  dealDamageT3: publicAsset('sfx/take-damage-t3.wav'),
  dealDamageT4: publicAsset('sfx/take-damage-t4.wav'),
  cardBash: publicAsset('sfx/card-bash.wav'),
  cardRupture: publicAsset('sfx/card-rupture.wav'),
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
  const loaded = new Set<string>()
  for (const id of Object.keys(SFX_PATHS) as SfxId[]) {
    const path = SFX_PATHS[id]
    if (loaded.has(path)) continue
    loaded.add(path)
    getAudio(id).load()
  }
}
