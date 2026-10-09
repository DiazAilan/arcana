/** One character = one pixel; `.` = transparent */

export const SPRITE_PALETTE: Record<string, string> = {
  r: '#e85d5d',
  R: '#ff8a8a',
  b: '#6eb5ff',
  B: '#9ec5ff',
  g: '#5de89a',
  G: '#8ef0bc',
  y: '#e8c547',
  Y: '#ffe680',
  p: '#7b68ee',
  P: '#a898ff',
  w: '#f0eef8',
  k: '#252336',
  K: '#0f0e17',
  o: '#c87840',
  m: '#9a96ad',
}

export type SpriteRows = string[]

const strike: SpriteRows = [
  '...kk...',
  '..kRk...',
  '..kRk...',
  '...R....',
  '..kRk...',
  '.kRRRk..',
  '..kRk...',
  '...k....',
]

const shield: SpriteRows = [
  '..bbbb..',
  '.bbbbbb.',
  '.bbbbbb.',
  '.bbbbbb.',
  '..bbbb..',
  '...bb...',
  '...bb...',
  '........',
]

const bolt: SpriteRows = [
  '...yy...',
  '..yyy...',
  '..yy....',
  '.yyy....',
  '..yy....',
  '..yyy...',
  '...yy...',
  '........',
]

const power: SpriteRows = [
  '...yy...',
  '..yYy...',
  '.yYYYy.',
  '..yYy...',
  '...y....',
  '..y.y...',
  '.y...y..',
  '........',
]

const CARD_BASE: Record<string, SpriteRows> = {
  attack: strike,
  skill: shield,
  power: power,
}

const CARD_OVERRIDES: Record<string, SpriteRows> = {
  arc_bash: [
    '...RR...',
    '..RRR...',
    '.RRRRR..',
    '..RRR...',
    '...R....',
    '..kRk...',
    '.k...k..',
    '........',
  ],
  arc_volley: bolt,
  arc_bolt: bolt,
  arc_heal: [
    '..g..g..',
    '.gggggg.',
    '.gggggg.',
    '..gggg..',
    '...gg...',
    '....g...',
    '........',
    '........',
  ],
  arc_weaken: [
    '..mmmm..',
    '.mmmmmm.',
    '.mm..mm.',
    '.mm..mm.',
    '.mmmmmm.',
    '..mmmm..',
    '...mm...',
    '........',
  ],
}

export function getCardSprite(defId: string, cardType: 'attack' | 'skill' | 'power'): SpriteRows {
  if (CARD_OVERRIDES[defId]) return CARD_OVERRIDES[defId]
  const base = CARD_BASE[cardType] ?? strike
  return tintRows(base, hashShift(defId))
}

function hashShift(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h) % 3
}

function tintRows(rows: SpriteRows, shift: number): SpriteRows {
  if (shift === 0) return rows
  const map =
    shift === 1
      ? { r: 'o', R: 'y', b: 'p', B: 'P', g: 'y', y: 'o' }
      : { r: 'p', R: 'P', b: 'g', B: 'G', g: 'b', y: 'p' }
  return rows.map((row) =>
    row
      .split('')
      .map((c) => (map[c as keyof typeof map] ?? c))
      .join(''),
  )
}

const ENEMY_SPRITES: Record<string, SpriteRows> = {
  mob_cultist: [
    '..kkkk..',
    '.kwwwwk.',
    '.kwppwk.',
    '..kwwk..',
    '...kk...',
    '..k..k..',
    '.k....k.',
    '........',
  ],
  mob_jaw: [
    '...kk...',
    '..kRRk..',
    '.kRRRRk.',
    'kRRwwRRk',
    '.kRRRRk.',
    '..kRRk..',
    '...kk...',
    '........',
  ],
  mob_slime: [
    '........',
    '..gggg..',
    '.gggggg.',
    'gggggggg',
    'gggggggg',
    '.gggggg.',
    '..gggg..',
    '........',
  ],
  mob_eye: [
    '..bbbb..',
    '.bwwwwb.',
    '.bwppwb.',
    '.bwwwwb.',
    '..bbbb..',
    '...bb...',
    '..b..b..',
    '........',
  ],
  mob_shade: [
    '...kk...',
    '..kkkk..',
    '.kkkkkk.',
    '.kkkkkk.',
    '..kkkk..',
    '...kk...',
    '..k..k..',
    '........',
  ],
  mob_golem: [
    '.kkkkkk.',
    'kwwwwwwk',
    'kwkkkkwk',
    'kwkkkkwk',
    'kwwwwwwk',
    '.kkkkkk.',
    '..k..k..',
    '........',
  ],
  mob_wisp: [
    '...yy...',
    '..yYYy..',
    '.yYYYYy.',
    '..yYYy..',
    '...yy...',
    '..y..y..',
    '.y....y.',
    '........',
  ],
  mob_knight: [
    '..yyyy..',
    '.ywwwwy.',
    '.ywwwwy.',
    '.ywwwwy.',
    '..yyyy..',
    '..y..y..',
    '.y....y.',
    '........',
  ],
  elite_sentinel: [
    '.yyyyyy.',
    'ywwwwwwy',
    'ywkkkkwy',
    'ywkkkkwy',
    'ywwwwwwy',
    '.yyyyyy.',
    '..y..y..',
    '........',
  ],
  boss_archivist: [
    '.pppppp.',
    'pwwwwwwp',
    'pwppppwp',
    'pwyyppwp',
    'pwwwwwwp',
    '.pppppp.',
    '..p..p..',
    '........',
  ],
}

export function getEnemySprite(defId: string): SpriteRows {
  return ENEMY_SPRITES[defId] ?? ENEMY_SPRITES.mob_shade!
}
