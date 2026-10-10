import { playSfx, type SfxId } from './sfxPlayer'

export type ShakeIntensity = 'none' | 'light' | 'medium' | 'heavy' | 'max'

export function hpLossTier(hpLost: number): 1 | 2 | 3 | 4 {
  if (hpLost <= 0) return 1
  if (hpLost <= 10) return 1
  if (hpLost <= 20) return 2
  if (hpLost <= 30) return 3
  return 4
}

function tierSfxId(prefix: 'takeDamage' | 'dealDamage', tier: 1 | 2 | 3 | 4): SfxId {
  const map: Record<1 | 2 | 3 | 4, SfxId> = {
    1: `${prefix}T1` as SfxId,
    2: `${prefix}T2` as SfxId,
    3: `${prefix}T3` as SfxId,
    4: `${prefix}T4` as SfxId,
  }
  return map[tier]
}

export function shakeIntensityForTier(tier: number): ShakeIntensity {
  switch (tier) {
    case 0:
      return 'none'
    case 1:
      return 'light'
    case 2:
      return 'medium'
    case 3:
      return 'heavy'
    default:
      return 'max'
  }
}

export function playIncomingDamageSfx(hpLost: number): void {
  if (hpLost <= 0) return
  const tier = hpLossTier(hpLost)
  playSfx(tierSfxId('takeDamage', tier), { volumeMultiplier: 0.85 + tier * 0.05 })
}

export function playBlockDeflectSfx(): void {
  playSfx('blockDeflect', { volumeMultiplier: 0.75 })
}

export function playCardBashSfx(): void {
  playSfx('cardBash', { volumeMultiplier: 0.9 })
}

export function playerShakeClass(intensity: ShakeIntensity): string {
  switch (intensity) {
    case 'none':
      return 'playerShakeNone'
    case 'light':
      return 'playerShakeLight'
    case 'medium':
      return 'playerShakeMedium'
    case 'heavy':
      return 'playerShakeHeavy'
    default:
      return 'playerShakeMax'
  }
}

export function enemyShakeClass(intensity: ShakeIntensity): string {
  switch (intensity) {
    case 'none':
    case 'light':
      return 'enemyShakeLight'
    case 'medium':
      return 'enemyShakeMedium'
    case 'heavy':
      return 'enemyShakeHeavy'
    default:
      return 'enemyShakeMax'
  }
}

export function playOutgoingDamageSfx(hpLost: number, cardDefId?: string): void {
  if (hpLost <= 0) return
  if (cardDefId === 'arc_rupture') {
    playSfx('cardRupture', { volumeMultiplier: 1 })
    return
  }
  const tier = hpLossTier(hpLost)
  playSfx(tierSfxId('dealDamage', tier), { volumeMultiplier: 0.85 + tier * 0.05 })
}
