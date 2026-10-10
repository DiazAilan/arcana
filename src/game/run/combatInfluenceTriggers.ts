import { getRegistry } from '../content/registry'
import type { CombatState } from '../combat/combatState'
import type { RunState } from '../models/session'
import type { SeededRNG } from '../rng/SeededRNG'
import { addInfluenceToRelic, canAddInfluence, pickRandomDeckCardForInfluence } from './influenceApply'

export type CombatInfluenceOutcome = {
  run: RunState
  /** Card influence awaiting player pick on reward screen. */
  pendingCardInfluence: { influenceId: string; eligibleInstanceIds: string[] } | null
  messages: string[]
}

export function applyCombatInfluenceTriggers(
  run: RunState,
  combat: CombatState,
  rng: SeededRNG,
): CombatInfluenceOutcome {
  const registry = getRegistry()
  const messages: string[] = []
  let nextRun = run
  let pendingCardInfluence: CombatInfluenceOutcome['pendingCardInfluence'] = null

  for (const tag of combat.survivedHitTags) {
    for (const inf of registry.influences.values()) {
      const trigger = inf.combatTrigger
      if (!trigger?.onSurviveHit || trigger.attackTag !== tag) continue

      if (inf.relicOnly && trigger.requiresHeartDomain) {
        for (let i = 0; i < nextRun.relics.length; i++) {
          const relicInst = nextRun.relics[i]!
          const relicDef = registry.relics.get(relicInst.defId)
          if (relicDef?.heartDomain !== trigger.requiresHeartDomain) continue
          if (!canAddInfluence(relicInst.influences, inf.id)) continue
          const updated = addInfluenceToRelic(relicInst, inf.id)
          if (!updated) continue
          const relics = [...nextRun.relics]
          relics[i] = updated
          nextRun = { ...nextRun, relics }
          messages.push(`Something shifts in ${relicDef.name}.`)
        }
        continue
      }

      if (!inf.cardOnly && !inf.relicOnly) {
        const card = pickRandomDeckCardForInfluence(nextRun.deck, inf.id, rng)
        if (card) {
          const eligible = nextRun.deck
            .filter((c) => canAddInfluence(c.influences, inf.id))
            .map((c) => c.instanceId)
          pendingCardInfluence = { influenceId: inf.id, eligibleInstanceIds: eligible }
          messages.push('Something clings to your deck.')
        }
      }
    }
  }

  return { run: nextRun, pendingCardInfluence, messages }
}
