import { runHasHeart } from '../content/act1/relics'

export type BossVictoryOutcome = 'sealed' | 'true' | 'echo_combat'

/** After winning a boss combat on the map boss node. */
export function bossVictoryOutcome(bossEnemyId: string, relicIds: string[]): BossVictoryOutcome {
  if (bossEnemyId === 'boss_avatar_still_waters') {
    return runHasHeart(relicIds) ? 'echo_combat' : 'sealed'
  }
  if (bossEnemyId === 'boss_primordial_echo') {
    return 'true'
  }
  return 'sealed'
}
