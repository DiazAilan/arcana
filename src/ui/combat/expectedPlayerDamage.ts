import type { CombatState } from '../../game/combat/combatState'
import type { EnemyInstance } from '../../game/models/enemy'
import { getCurrentIntent, previewIncomingAttackDamage } from '../../game/combat/intents'

/** Sum of attack intent damage to player before block (matches intent icons). */
export function expectedAttackDamageToPlayer(
  enemies: EnemyInstance[],
  playerPowers: CombatState['playerPowers'] = {},
): number {
  let total = 0
  for (const enemy of enemies) {
    if (enemy.hp <= 0) continue
    const intent = getCurrentIntent(enemy)
    if (intent?.kind !== 'attack') continue
    total += previewIncomingAttackDamage(intent, enemy.powers, playerPowers)
  }
  return total
}
