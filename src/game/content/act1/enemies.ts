import type { EnemyDef } from '../../models/enemy'

export const ACT1_ENEMIES: EnemyDef[] = [
  {
    id: 'mob_cultist',
    name: 'Maskbound Acolyte',
    flavor: 'The whisper behind the porcelain—obedience to something you cannot grasp.',
    maxHp: 48,
    intents: [
      { kind: 'buff', value: 2, power: 'strength' },
      { kind: 'attack', value: 6 },
      { kind: 'attack', value: 6 },
    ],
  },
  {
    id: 'mob_jaw',
    name: 'Gnawing Ghoul',
    maxHp: 42,
    intents: [
      { kind: 'attack', value: 7 },
      { kind: 'attack', value: 11 },
      { kind: 'block', value: 8 },
    ],
  },
  {
    id: 'mob_slime',
    name: 'Shame Shambler',
    flavor: 'A piece of the melded horror—guilt that still crawls on borrowed legs.',
    maxHp: 36,
    intents: [
      { kind: 'attack', value: 5 },
      { kind: 'debuff', value: 1, power: 'weak' },
      { kind: 'attack', value: 8 },
    ],
  },
  {
    id: 'mob_eye',
    name: 'Wailing Banshee',
    flavor: 'Fear given a voice; it screams what you refuse to admit.',
    maxHp: 40,
    intents: [
      { kind: 'debuff', value: 2, power: 'vulnerable' },
      { kind: 'attack', value: 9 },
      { kind: 'block', value: 6 },
    ],
  },
  {
    id: 'mob_shade',
    name: 'Errant Fragment',
    flavor: 'A splinter of the Unbound—freedom with nothing left but appetite.',
    maxHp: 44,
    intents: [
      { kind: 'attack', value: 8 },
      { kind: 'attack', value: 4 },
      { kind: 'attack', value: 4 },
    ],
  },
  {
    id: 'mob_golem',
    name: 'Faceless Bulk',
    flavor: 'No features—only a black pearl where a face should be.',
    maxHp: 52,
    intents: [
      { kind: 'block', value: 10 },
      { kind: 'attack', value: 10 },
      { kind: 'buff', value: 1, power: 'strength' },
    ],
  },
  {
    id: 'mob_wisp',
    name: 'Splinter Wisp',
    flavor: 'It hums with discord—a shard that forgot it was broken off.',
    maxHp: 32,
    intents: [
      { kind: 'attack', value: 6 },
      { kind: 'debuff', value: 1, power: 'weak' },
      { kind: 'attack', value: 12 },
    ],
  },
  {
    id: 'mob_knight',
    name: 'Pearl Mask Stalker',
    flavor: 'Man-shaped, mask-bound—look too long and your heart stutters.',
    maxHp: 58,
    intents: [
      { kind: 'attack', value: 9 },
      { kind: 'block', value: 12 },
      { kind: 'attack', value: 14 },
    ],
  },
  {
    id: 'elite_sentinel',
    name: 'Splinter Colossus',
    flavor: 'Many chaos-shards stacked in one shape, still refusing any master.',
    maxHp: 95,
    intents: [
      { kind: 'block', value: 15 },
      { kind: 'attack', value: 12 },
      { kind: 'debuff', value: 2, power: 'vulnerable' },
      { kind: 'attack', value: 18 },
    ],
  },
  {
    id: 'elite_pearl_mask',
    artKey: 'elite_pearl_mask',
    name: 'Faceless Warden',
    flavor: 'Horror’s shard behind a mask—do not ask what lies beneath.',
    maxHp: 88,
    intents: [
      { kind: 'buff', value: 2, power: 'strength' },
      { kind: 'attack', value: 10 },
      { kind: 'block', value: 12 },
      { kind: 'attack', value: 16 },
    ],
  },
  {
    id: 'boss_avatar_still_waters',
    artKey: 'boss_avatar_still_waters',
    name: 'Avatar of Still Waters',
    flavor: 'Ice and silence; the sky’s scale-legends ended here.',
    maxHp: 140,
    intents: [
      { kind: 'attack', value: 10 },
      { kind: 'debuff', value: 2, power: 'weak' },
      { kind: 'attack', value: 16 },
      { kind: 'buff', value: 2, power: 'strength' },
      { kind: 'attack', value: 22 },
    ],
  },
  {
    id: 'boss_primordial_echo',
    artKey: 'boss_primordial_echo',
    name: 'Thousandfold Splinter',
    flavor: 'When chaos and horror were shattered together, not every piece stayed still.',
    maxHp: 180,
    intents: [
      { kind: 'buff', value: 3, power: 'strength' },
      { kind: 'attack', value: 14 },
      { kind: 'attack', value: 20 },
      { kind: 'debuff', value: 2, power: 'vulnerable' },
      { kind: 'attack', value: 28 },
    ],
  },
]

export const REGULAR_ENEMY_IDS = ACT1_ENEMIES.filter(
  (e) => !e.id.startsWith('elite_') && !e.id.startsWith('boss_'),
).map((e) => e.id)

export const ELITE_ENEMY_IDS = ACT1_ENEMIES.filter((e) => e.id.startsWith('elite_')).map((e) => e.id)
