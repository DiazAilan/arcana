import type { CardDef } from '../../models/card'

const strike: CardDef = {
  id: 'arc_strike',
  name: 'Strike',
  type: 'attack',
  cost: 1,
  description: 'Deal 6 damage.',
  effects: [{ type: 'damage', amount: 6, target: 'enemy' }],
  upgrade: {
    description: 'Deal 9 damage.',
    effects: [{ type: 'damage', amount: 9, target: 'enemy' }],
  },
}

const defend: CardDef = {
  id: 'arc_defend',
  name: 'Block',
  type: 'skill',
  cost: 1,
  description: 'Gain 5 Block.',
  effects: [{ type: 'block', amount: 5 }],
  upgrade: {
    description: 'Gain 8 Block.',
    effects: [{ type: 'block', amount: 8 }],
  },
}

export const ACT1_CARDS: CardDef[] = [
  strike,
  defend,
  {
    id: 'arc_bash',
    name: 'Bash',
    type: 'attack',
    cost: 2,
    description: 'Deal 8 damage. Apply 2 Vulnerable.',
    effects: [
      { type: 'damage', amount: 8, target: 'enemy' },
      { type: 'apply_power', power: 'vulnerable', amount: 2, target: 'enemy' },
    ],
    upgrade: {
      description: 'Deal 10 damage. Apply 3 Vulnerable.',
      effects: [
        { type: 'damage', amount: 10, target: 'enemy' },
        { type: 'apply_power', power: 'vulnerable', amount: 3, target: 'enemy' },
      ],
    },
  },
  {
    id: 'arc_volley',
    name: 'Shard Volley',
    type: 'attack',
    cost: 1,
    description: 'Deal 3 damage to ALL enemies.',
    effects: [{ type: 'damage', amount: 3, target: 'all_enemies' }],
    upgrade: {
      description: 'Deal 5 damage to ALL enemies.',
      effects: [{ type: 'damage', amount: 5, target: 'all_enemies' }],
    },
  },
  {
    id: 'arc_focus',
    name: 'Delver’s Focus',
    type: 'skill',
    cost: 0,
    description: 'Gain 2 Energy.',
    effects: [{ type: 'gain_energy', amount: 2 }],
    upgrade: {
      description: 'Gain 3 Energy.',
      effects: [{ type: 'gain_energy', amount: 3 }],
    },
  },
  {
    id: 'arc_draw',
    name: 'Dusty Tome',
    type: 'skill',
    cost: 1,
    description: 'Draw 2 cards.',
    effects: [{ type: 'draw', amount: 2 }],
    upgrade: {
      description: 'Draw 3 cards.',
      effects: [{ type: 'draw', amount: 3 }],
    },
  },
  {
    id: 'arc_heal',
    name: 'Bind Wounds',
    type: 'skill',
    cost: 1,
    description: 'Heal 5 HP.',
    effects: [{ type: 'heal', amount: 4 }],
    upgrade: {
      description: 'Heal 8 HP.',
      effects: [{ type: 'heal', amount: 6 }],
    },
  },
  {
    id: 'arc_iron_skin',
    name: 'Iron Prayer',
    type: 'power',
    cost: 1,
    description: 'Gain 3 Metallicize.',
    effects: [{ type: 'apply_power', power: 'metallicize', amount: 3, target: 'self' }],
    upgrade: {
      description: 'Gain 5 Metallicize.',
      effects: [{ type: 'apply_power', power: 'metallicize', amount: 5, target: 'self' }],
    },
  },
  {
    id: 'arc_might',
    name: 'Grave Might',
    type: 'power',
    cost: 2,
    description: 'Gain 2 Strength.',
    effects: [{ type: 'apply_power', power: 'strength', amount: 2, target: 'self' }],
    upgrade: {
      description: 'Gain 3 Strength.',
      effects: [{ type: 'apply_power', power: 'strength', amount: 3, target: 'self' }],
    },
  },
  {
    id: 'arc_agility',
    name: 'Fleet Step',
    type: 'power',
    cost: 1,
    description: 'Gain 1 Dexterity.',
    effects: [{ type: 'apply_power', power: 'dexterity', amount: 1, target: 'self' }],
    upgrade: {
      description: 'Gain 2 Dexterity.',
      effects: [{ type: 'apply_power', power: 'dexterity', amount: 2, target: 'self' }],
    },
  },
  {
    id: 'arc_heavy',
    name: 'Heavy Swing',
    type: 'attack',
    cost: 2,
    description: 'Deal 14 damage.',
    effects: [{ type: 'damage', amount: 14, target: 'enemy' }],
    upgrade: {
      description: 'Deal 18 damage.',
      effects: [{ type: 'damage', amount: 18, target: 'enemy' }],
    },
  },
  {
    id: 'arc_pierce',
    name: 'Needle Pierce',
    type: 'attack',
    cost: 0,
    description: 'Deal 4 damage.',
    effects: [{ type: 'damage', amount: 4, target: 'enemy' }],
    upgrade: {
      description: 'Deal 6 damage.',
      effects: [{ type: 'damage', amount: 6, target: 'enemy' }],
    },
  },
  {
    id: 'arc_shield',
    name: 'Tower Shield',
    type: 'skill',
    cost: 2,
    description: 'Gain 12 Block.',
    effects: [{ type: 'block', amount: 12 }],
    upgrade: {
      description: 'Gain 16 Block.',
      effects: [{ type: 'block', amount: 16 }],
    },
  },
  {
    id: 'arc_twin',
    name: 'Twin Cast',
    type: 'attack',
    cost: 1,
    description: 'Deal 5 damage twice.',
    effects: [
      { type: 'damage', amount: 5, target: 'enemy' },
      { type: 'damage', amount: 5, target: 'enemy' },
    ],
    upgrade: {
      description: 'Deal 7 damage twice.',
      effects: [
        { type: 'damage', amount: 7, target: 'enemy' },
        { type: 'damage', amount: 7, target: 'enemy' },
      ],
    },
  },
  {
    id: 'arc_weaken',
    name: 'Hex Touch',
    type: 'skill',
    cost: 1,
    description: 'Apply 2 Weak.',
    effects: [{ type: 'apply_power', power: 'weak', amount: 2, target: 'enemy' }],
    upgrade: {
      description: 'Apply 3 Weak.',
      effects: [{ type: 'apply_power', power: 'weak', amount: 3, target: 'enemy' }],
    },
  },
  {
    id: 'arc_surge',
    name: 'Mana Surge',
    type: 'skill',
    cost: 0,
    description: 'Gain 1 Energy. Draw 1 card.',
    effects: [{ type: 'gain_energy', amount: 1 }, { type: 'draw', amount: 1 }],
    upgrade: {
      description: 'Gain 2 Energy. Draw 1 card.',
      effects: [{ type: 'gain_energy', amount: 2 }, { type: 'draw', amount: 1 }],
    },
  },
  {
    id: 'arc_cleave',
    name: 'Wide Cleave',
    type: 'attack',
    cost: 2,
    description: 'Deal 7 damage to ALL enemies.',
    effects: [{ type: 'damage', amount: 7, target: 'all_enemies' }],
    upgrade: {
      description: 'Deal 10 damage to ALL enemies.',
      effects: [{ type: 'damage', amount: 10, target: 'all_enemies' }],
    },
  },
  {
    id: 'arc_riposte',
    name: 'Riposte',
    type: 'attack',
    cost: 1,
    description: 'Gain 4 Block. Deal 6 damage.',
    effects: [{ type: 'block', amount: 4 }, { type: 'damage', amount: 6, target: 'enemy' }],
    upgrade: {
      description: 'Gain 6 Block. Deal 8 damage.',
      effects: [{ type: 'block', amount: 6 }, { type: 'damage', amount: 8, target: 'enemy' }],
    },
  },
  {
    id: 'arc_channel',
    name: 'Channel Depths',
    type: 'skill',
    cost: 2,
    description: 'Draw 3 cards. Gain 1 Energy.',
    effects: [{ type: 'draw', amount: 3 }, { type: 'gain_energy', amount: 1 }],
    upgrade: {
      description: 'Draw 4 cards. Gain 2 Energy.',
      effects: [{ type: 'draw', amount: 4 }, { type: 'gain_energy', amount: 1 }],
    },
  },
  {
    id: 'arc_bolt',
    name: 'Static Bolt',
    type: 'attack',
    cost: 1,
    description: 'Deal 7 damage.',
    effects: [{ type: 'damage', amount: 7, target: 'enemy' }],
    upgrade: {
      description: 'Deal 10 damage.',
      effects: [{ type: 'damage', amount: 10, target: 'enemy' }],
    },
  },
  {
    id: 'arc_fortify',
    name: 'Fortify',
    type: 'skill',
    cost: 1,
    description: 'Gain 7 Block. Gain 1 Dexterity.',
    effects: [
      { type: 'block', amount: 7 },
      { type: 'apply_power', power: 'dexterity', amount: 1, target: 'self' },
    ],
    upgrade: {
      description: 'Gain 10 Block. Gain 2 Dexterity.',
      effects: [
        { type: 'block', amount: 10 },
        { type: 'apply_power', power: 'dexterity', amount: 2, target: 'self' },
      ],
    },
  },
  {
    id: 'arc_rupture',
    name: 'Rupture Seal',
    type: 'attack',
    cost: 3,
    description: 'Deal 20 damage.',
    effects: [{ type: 'damage', amount: 20, target: 'enemy' }],
    upgrade: {
      description: 'Deal 26 damage.',
      effects: [{ type: 'damage', amount: 26, target: 'enemy' }],
    },
  },
  {
    id: 'arc_mist',
    name: 'Obscuring Mist',
    type: 'skill',
    cost: 1,
    description: 'Gain 8 Block. Apply 1 Weak.',
    effects: [
      { type: 'block', amount: 8 },
      { type: 'apply_power', power: 'weak', amount: 1, target: 'enemy' },
    ],
    upgrade: {
      description: 'Gain 11 Block. Apply 2 Weak.',
      effects: [
        { type: 'block', amount: 11 },
        { type: 'apply_power', power: 'weak', amount: 2, target: 'enemy' },
      ],
    },
  },
  {
    id: 'arc_brace',
    name: 'Brace',
    type: 'skill',
    cost: 0,
    description: 'Gain 4 Block.',
    effects: [{ type: 'block', amount: 4 }],
    upgrade: {
      description: 'Gain 6 Block.',
      effects: [{ type: 'block', amount: 6 }],
    },
  },
  {
    id: 'arc_lance',
    name: 'Sapphire Lance',
    type: 'attack',
    cost: 2,
    description: 'Deal 11 damage. Apply 1 Vulnerable.',
    effects: [
      { type: 'damage', amount: 11, target: 'enemy' },
      { type: 'apply_power', power: 'vulnerable', amount: 1, target: 'enemy' },
    ],
    upgrade: {
      description: 'Deal 14 damage. Apply 2 Vulnerable.',
      effects: [
        { type: 'damage', amount: 14, target: 'enemy' },
        { type: 'apply_power', power: 'vulnerable', amount: 2, target: 'enemy' },
      ],
    },
  },
]

export const STARTER_DECK_IDS = [
  'arc_strike',
  'arc_strike',
  'arc_strike',
  'arc_strike',
  'arc_defend',
  'arc_defend',
  'arc_defend',
  'arc_defend',
  'arc_bash',
  'arc_pierce',
]
