import type { EnemyInstance } from '../../game/models/enemy'
import { getCurrentIntent } from '../../game/combat/intents'
import { getPower, weakMultiplier } from '../../game/combat/powers'

/** Sum of attack intent damage before block (same formula as enemy turn). */
export function expectedAttackDamageToPlayer(enemies: EnemyInstance[]): number {
  let total = 0
  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue
    const intent = getCurrentIntent(enemy)
    if (intent?.kind !== 'attack') continue
    let dmg = intent.value + getPower(enemy.powers, 'strength')
    dmg = Math.floor(dmg * weakMultiplier(enemy.powers))
    total += Math.max(0, dmg)
  }
  return total
}
