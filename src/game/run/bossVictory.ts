import { runHasHeart } from '../content/act1/relics'
import type { RelicInstance } from '../models/relicInstance'
import { relicDefIds } from '../models/relicInstance'

export type BossVictoryOutcome = 'sealed' | 'true' | 'echo_combat'

/** After winning a boss combat on the map boss node. */
export function bossVictoryOutcome(bossEnemyId: string, relics: RelicInstance[]): BossVictoryOutcome {
  const ids = relicDefIds(relics)
  if (bossEnemyId === 'boss_avatar_still_waters') {
    return runHasHeart(ids) ? 'echo_combat' : 'sealed'
  }
  if (bossEnemyId === 'boss_primordial_echo') {
    return 'true'
  }
  return 'sealed'
}
