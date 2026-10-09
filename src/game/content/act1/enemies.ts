import type { EnemyDef } from '../../models/enemy'

export const ACT1_ENEMIES: EnemyDef[] = [
  {
    id: 'mob_cultist',
    name: 'Hollow Cultist',
    maxHp: 48,
    intents: [
      { kind: 'buff', value: 2, power: 'strength' },
      { kind: 'attack', value: 6 },
      { kind: 'attack', value: 6 },
    ],
  },
  {
    id: 'mob_jaw',
    name: 'Glimmer Maw',
    maxHp: 42,
    intents: [
      { kind: 'attack', value: 7 },
      { kind: 'attack', value: 11 },
      { kind: 'block', value: 8 },
    ],
  },
  {
    id: 'mob_slime',
    name: 'Quicksilver Slime',
    maxHp: 36,
    intents: [
      { kind: 'attack', value: 5 },
      { kind: 'debuff', value: 1, power: 'weak' },
      { kind: 'attack', value: 8 },
    ],
  },
  {
    id: 'mob_eye',
    name: 'Wandering Eye',
    maxHp: 40,
    intents: [
      { kind: 'debuff', value: 2, power: 'vulnerable' },
      { kind: 'attack', value: 9 },
      { kind: 'block', value: 6 },
    ],
  },
  {
    id: 'mob_shade',
    name: 'Ink Shade',
    maxHp: 44,
    intents: [
      { kind: 'attack', value: 8 },
      { kind: 'attack', value: 4 },
      { kind: 'attack', value: 4 },
    ],
  },
  {
    id: 'mob_golem',
    name: 'Rune Golem',
    maxHp: 52,
    intents: [
      { kind: 'block', value: 10 },
      { kind: 'attack', value: 10 },
      { kind: 'buff', value: 1, power: 'strength' },
    ],
  },
  {
    id: 'mob_wisp',
    name: 'Fractal Wisp',
    maxHp: 32,
    intents: [
      { kind: 'attack', value: 6 },
      { kind: 'debuff', value: 1, power: 'weak' },
      { kind: 'attack', value: 12 },
    ],
  },
  {
    id: 'mob_knight',
    name: 'Fallen Signet',
    maxHp: 58,
    intents: [
      { kind: 'attack', value: 9 },
      { kind: 'block', value: 12 },
      { kind: 'attack', value: 14 },
    ],
  },
  {
    id: 'elite_sentinel',
    name: 'Vault Sentinel',
    maxHp: 95,
    intents: [
      { kind: 'block', value: 15 },
      { kind: 'attack', value: 12 },
      { kind: 'debuff', value: 2, power: 'vulnerable' },
      { kind: 'attack', value: 18 },
    ],
  },
  {
    id: 'boss_archivist',
    name: 'The Archivist',
    maxHp: 140,
    intents: [
      { kind: 'attack', value: 10 },
      { kind: 'debuff', value: 2, power: 'weak' },
      { kind: 'attack', value: 16 },
      { kind: 'buff', value: 2, power: 'strength' },
      { kind: 'attack', value: 22 },
    ],
  },
]

export const REGULAR_ENEMY_IDS = ACT1_ENEMIES.filter(
  (e) => !e.id.startsWith('elite_') && !e.id.startsWith('boss_'),
).map((e) => e.id)
