import type { RelicDef } from '../../models/relic'

export const ACT1_RELICS: RelicDef[] = [
  {
    id: 'relic_embers',
    name: 'Ember Lens',
    description: 'Start each combat with +1 Energy.',
    hooks: ['maxEnergyBonus'],
    energyBonus: 1,
  },
  {
    id: 'relic_pages',
    name: 'Loose Pages',
    description: 'At the start of combat, draw 1 additional card.',
    hooks: ['onCombatStart'],
    combatStartDraw: 1,
  },
  {
    id: 'relic_vial',
    name: 'Crimson Vial',
    description: 'Heal 6 HP after winning combat.',
    hooks: ['onVictory'],
    victoryHeal: 6,
  },
  {
    id: 'relic_pouch',
    name: 'Gilded Pouch',
    description: 'Gain 20 Gold at the start of the run.',
    hooks: [],
  },
  {
    id: 'relic_sigil',
    name: 'Ward Sigil',
    description: 'Start combat with 4 Block.',
    hooks: ['onCombatStart'],
  },
  {
    id: 'relic_ring',
    name: 'Ring of Echoes',
    description: 'The first Skill you play each turn costs 0.',
    hooks: ['onCardPlayed'],
  },
  {
    id: 'relic_feather',
    name: 'Phoenix Feather',
    description: 'When you would die, heal to 30% HP once per run.',
    hooks: [],
  },
  {
    id: 'relic_crystal',
    name: 'Focus Crystal',
    description: 'Start each combat with +1 max Energy and draw 1 card.',
    hooks: ['maxEnergyBonus', 'onCombatStart'],
    energyBonus: 1,
    combatStartDraw: 1,
  },
]
