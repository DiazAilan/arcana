import type { RelicDef } from '../../models/relic'

export const ACT1_RELICS: RelicDef[] = [
  {
    id: 'relic_embers',
    name: 'Volcanic Heart-Stone',
    description: 'Start each combat with +1 Energy. Warmth from a sleeping wyrm’s ash.',
    hooks: ['maxEnergyBonus'],
    energyBonus: 1,
    shopPrice: 160,
    isHeart: true,
    heartDomain: 'passion',
  },
  {
    id: 'relic_pages',
    name: 'Locket Diamond',
    description: 'At the start of combat, draw 1 additional card. A gem kept close to the chest.',
    hooks: ['onCombatStart'],
    combatStartDraw: 1,
    isHeart: true,
    heartDomain: 'life',
  },
  {
    id: 'relic_vial',
    name: 'Black Pearl Heart',
    description: 'Heal 6 HP after winning combat. It weighs like guilt.',
    hooks: ['onVictory'],
    victoryHeal: 6,
    isHeart: true,
    heartDomain: 'madness',
  },
  {
    id: 'relic_pouch',
    name: 'Delver’s Satchel',
    description: 'Gain 15 gold when you descend to a new stratum.',
    hooks: [],
    floorGold: 15,
  },
  {
    id: 'relic_sigil',
    name: 'Globe Heart',
    description: 'Start combat with 4 Block. A miniature sky the First Builder left behind.',
    hooks: ['onCombatStart'],
    isHeart: true,
    heartDomain: 'creation',
  },
  {
    id: 'relic_ring',
    name: 'Unbound Shard',
    description: 'The first Skill you play each turn costs 0. Chaos with no master.',
    hooks: ['onCardPlayed'],
    isHeart: true,
    heartDomain: 'chaos',
  },
  {
    id: 'relic_feather',
    name: 'Sapphire Shard Heart',
    description: 'When you would die, heal to 30% HP once per run. Still seas, still sky.',
    hooks: [],
    isHeart: true,
    heartDomain: 'still',
  },
  {
    id: 'relic_crystal',
    name: 'Twinheart Lens',
    description: 'Start each combat with +1 max Energy and draw 1 card.',
    hooks: ['maxEnergyBonus', 'onCombatStart'],
    energyBonus: 1,
    combatStartDraw: 1,
  },
]

/** Relic ids flagged as Hearts (run gating for true ending). */
export const HEART_RELIC_IDS = ACT1_RELICS.filter((r) => r.isHeart).map((r) => r.id)

export function runHasHeart(relicIds: string[]): boolean {
  return relicIds.some((id) => HEART_RELIC_IDS.includes(id))
}
