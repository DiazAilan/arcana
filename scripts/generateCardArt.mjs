/**
 * One-off generator for CARD_ART literals. Run: node scripts/generateCardArt.mjs
 * Output: src/game/content/art/literals/cardArt.ts
 */
import { writeFileSync } from 'node:fs'

const S = 16
const g = () => Array.from({ length: S }, () => '.'.repeat(S))

function set(grid, x, y, c) {
  if (y < 0 || y >= S || x < 0 || x >= S) return
  const row = grid[y].split('')
  row[x] = c
  grid[y] = row.join('')
}

function rect(grid, x, y, w, h, c) {
  for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) set(grid, x + dx, y + dy, c)
}

function sym(grid, cx, pts) {
  for (const [dx, y, c] of pts) {
    set(grid, cx + dx, y, c)
    if (dx) set(grid, cx - dx, y, c)
  }
}

function ellipse(grid, cx, cy, rx, ry, c) {
  for (let y = cy - ry; y <= cy + ry; y++)
    for (let x = cx - rx; x <= cx + rx; x++) {
      const nx = (x - cx) / rx
      const ny = (y - cy) / ry
      if (nx * nx + ny * ny <= 1) set(grid, x, y, c)
    }
}

const builders = {
  arc_strike: () => {
    const s = g()
    sym(s, 8, [
      [0, 1, '7'],
      [0, 2, 'd'],
      [1, 2, 'c'],
      [0, 3, 'd'],
      [1, 3, 'b'],
      [0, 4, 'c'],
      [1, 4, 'b'],
      [0, 5, 'c'],
      [1, 5, 'b'],
      [0, 6, 'c'],
      [1, 6, 'b'],
      [0, 7, 'd'],
      [1, 7, 'c'],
      [0, 8, '9'],
      [1, 8, '8'],
    ])
    rect(s, 4, 9, 8, 2, 'h')
    rect(s, 5, 9, 6, 1, 'j')
    rect(s, 7, 11, 2, 3, '3')
    rect(s, 6, 14, 4, 1, 'h')
    return s
  },
  arc_defend: () => {
    const s = g()
    for (let row = 0; row < 8; row++) {
      const inset = row < 4 ? 3 - row : row - 4
      const w = 10 - inset * 2
      const x = 3 + inset
      rect(s, x, 2 + row, w, 1, row % 2 ? 'b' : 'c')
    }
    rect(s, 6, 3, 4, 4, 'd')
    set(s, 7, 4, '7')
    set(s, 8, 5, 'w')
    rect(s, 7, 10, 2, 3, '4')
    rect(s, 6, 13, 4, 1, 'b')
    return s
  },
  arc_bash: () => {
    const s = g()
    ellipse(s, 8, 6, 5, 4, '9')
    ellipse(s, 8, 5, 3, 2, 'a')
    rect(s, 5, 9, 6, 2, '2')
    sym(s, 8, [
      [2, 10, '3'],
      [3, 11, '2'],
      [4, 12, '1'],
    ])
    return s
  },
  arc_volley: () => {
    const s = g()
    for (const [ox, oy] of [
      [-4, 4],
      [0, 2],
      [4, 4],
    ]) {
      for (let i = 0; i < 5; i++) set(s, 8 + ox + i, oy + i, 'c')
      set(s, 8 + ox + 5, oy + 5, '7')
    }
    rect(s, 6, 12, 4, 1, '4')
    return s
  },
  arc_focus: () => {
    const s = g()
    ellipse(s, 8, 8, 5, 5, 'k')
    ellipse(s, 8, 8, 3, 3, 'l')
    set(s, 8, 8, '7')
    rect(s, 7, 2, 2, 1, 'i')
    rect(s, 7, 13, 2, 1, 'i')
    set(s, 4, 7, 'i')
    set(s, 11, 7, 'i')
    return s
  },
  arc_draw: () => {
    const s = g()
    for (let i = 0; i < 3; i++) {
      rect(s, 5 + i, 4 + i, 6, 8, i === 0 ? '6' : i === 1 ? '5' : '4')
      rect(s, 6 + i, 5 + i, 4, 6, '2')
    }
    rect(s, 8, 6, 2, 4, 'k')
    set(s, 8, 7, 'l')
    return s
  },
  arc_heal: () => {
    const s = g()
    rect(s, 7, 3, 2, 10, 'f')
    rect(s, 5, 7, 6, 2, 'g')
    rect(s, 6, 6, 4, 4, '7')
    ellipse(s, 8, 8, 5, 5, 'e')
    return s
  },
  arc_iron_skin: () => {
    const s = g()
    rect(s, 4, 3, 8, 10, 't')
    rect(s, 5, 4, 6, 8, 's')
    rect(s, 6, 5, 4, 6, 'r')
    for (let y = 6; y <= 9; y++) {
      set(s, 6, y, '6')
      set(s, 9, y, '6')
    }
    rect(s, 5, 2, 6, 1, '4')
    return s
  },
  arc_might: () => {
    const s = g()
    ellipse(s, 6, 9, 3, 4, 'p')
    ellipse(s, 10, 9, 3, 4, 'p')
    rect(s, 5, 5, 6, 5, '8')
    rect(s, 6, 4, 4, 2, '9')
    set(s, 7, 6, '7')
    set(s, 8, 6, '7')
    rect(s, 7, 2, 2, 2, 'h')
    return s
  },
  arc_agility: () => {
    const s = g()
    sym(s, 8, [
      [0, 3, 'v'],
      [1, 4, 'w'],
      [2, 5, 'v'],
      [3, 6, 'w'],
      [4, 7, 'v'],
      [3, 8, 'w'],
      [2, 9, 'v'],
      [1, 10, 'w'],
      [0, 11, 'v'],
    ])
    ellipse(s, 8, 7, 2, 2, '7')
    return s
  },
  arc_heavy: () => {
    const s = g()
    rect(s, 5, 2, 6, 4, 't')
    rect(s, 6, 3, 4, 2, 's')
    rect(s, 7, 6, 2, 6, '4')
    rect(s, 4, 12, 8, 3, 'h')
    rect(s, 5, 12, 6, 1, 'j')
    set(s, 7, 1, '7')
    return s
  },
  arc_pierce: () => {
    const s = g()
    for (let y = 2; y <= 13; y++) {
      set(s, 8, y, y < 10 ? '5' : '4')
      set(s, 7, y, '6')
    }
    set(s, 8, 1, '7')
    set(s, 7, 2, '6')
    set(s, 9, 2, '6')
    return s
  },
  arc_shield: () => {
    const s = g()
    rect(s, 5, 2, 6, 12, 'b')
    rect(s, 6, 3, 4, 10, 'c')
    rect(s, 7, 4, 2, 8, 'd')
    set(s, 7, 7, '7')
    rect(s, 4, 13, 8, 2, '4')
    return s
  },
  arc_twin: () => {
    const s = g()
    sym(s, 6, [
      [0, 4, 'l'],
      [0, 5, 'k'],
      [0, 6, 'l'],
      [0, 7, '7'],
      [0, 8, 'k'],
    ])
    sym(s, 10, [
      [0, 4, 'w'],
      [0, 5, 'v'],
      [0, 6, 'w'],
      [0, 7, '7'],
      [0, 8, 'v'],
    ])
    set(s, 8, 10, 'k')
    return s
  },
  arc_weaken: () => {
    const s = g()
    ellipse(s, 8, 7, 6, 5, '4')
    rect(s, 5, 6, 2, 4, '6')
    rect(s, 9, 6, 2, 4, '6')
    set(s, 7, 8, 'n')
    set(s, 8, 8, 'n')
    return s
  },
  arc_surge: () => {
    const s = g()
    rect(s, 6, 8, 4, 5, 'x')
    rect(s, 7, 9, 2, 3, 'c')
    set(s, 7, 4, 'i')
    set(s, 8, 5, 'j')
    set(s, 7, 6, '7')
    set(s, 6, 3, 'w')
    set(s, 9, 2, 'i')
    return s
  },
  arc_cleave: () => {
    const s = g()
    for (let x = 2; x <= 13; x++) {
      const y = 8 + Math.abs(x - 8) / 2
      set(s, x, Math.floor(y), '9')
      set(s, x, Math.floor(y) + 1, '8')
    }
    rect(s, 7, 4, 2, 4, '4')
    return s
  },
  arc_riposte: () => {
    const s = g()
    rect(s, 4, 6, 4, 6, 'c')
    set(s, 4, 8, '7')
    sym(s, 10, [
      [0, 5, 'd'],
      [0, 6, 'c'],
      [0, 7, 'b'],
      [0, 8, '9'],
    ])
    rect(s, 5, 11, 6, 1, 'h')
    return s
  },
  arc_channel: () => {
    const s = g()
    ellipse(s, 8, 5, 4, 2, 'l')
    for (let y = 6; y <= 12; y++) {
      set(s, 7, y, 'k')
      set(s, 8, y, 'l')
      set(s, 9, y, 'k')
    }
    ellipse(s, 8, 13, 3, 2, 'm')
    return s
  },
  arc_bolt: () => {
    const s = g()
    set(s, 7, 2, 'j')
    set(s, 8, 3, 'i')
    set(s, 7, 4, 'j')
    set(s, 6, 5, 'h')
    set(s, 7, 6, 'i')
    set(s, 8, 7, '7')
    set(s, 7, 8, 'i')
    set(s, 7, 9, 'h')
    set(s, 8, 10, 'j')
    set(s, 7, 11, 'i')
    set(s, 5, 6, 'w')
    return s
  },
  arc_fortify: () => {
    const s = g()
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 4; col++) rect(s, 3 + col * 3, 4 + row * 2, 2, 1, (row + col) % 2 ? 'r' : 't')
    rect(s, 5, 12, 6, 2, 'u')
    return s
  },
  arc_rupture: () => {
    const s = g()
    ellipse(s, 8, 8, 6, 6, 'm')
    ellipse(s, 8, 8, 4, 4, 'k')
    set(s, 6, 7, '9')
    set(s, 9, 6, '9')
    set(s, 10, 9, 'a')
    set(s, 5, 10, 'a')
    set(s, 8, 8, '7')
    return s
  },
  arc_mist: () => {
    const s = g()
    ellipse(s, 6, 9, 4, 3, '5')
    ellipse(s, 10, 8, 4, 3, '4')
    ellipse(s, 8, 7, 5, 3, '6')
    set(s, 5, 8, 'n')
    set(s, 11, 9, 'n')
    return s
  },
  arc_brace: () => {
    const s = g()
    rect(s, 6, 7, 4, 5, 'c')
    rect(s, 7, 8, 2, 3, 'd')
    set(s, 7, 9, '7')
    rect(s, 5, 6, 6, 1, 'b')
    return s
  },
  arc_lance: () => {
    const s = g()
    for (let y = 4; y <= 14; y++) {
      set(s, 8, y, '4')
      set(s, 7, y, '3')
    }
    set(s, 8, 2, 'l')
    set(s, 7, 3, 'k')
    set(s, 9, 3, 'k')
    set(s, 8, 3, '7')
    set(s, 6, 14, 'h')
    set(s, 10, 14, 'h')
    return s
  },
}

const art = {}
for (const [id, fn] of Object.entries(builders)) art[id] = fn()

let out =
  '/**\n * Per-card pixel art (16×16). One entry per card def id.\n * `.` = transparent; palette keys 1-9, a-x — see palette.ts or Sprite gallery.\n */\n' +
  "import type { SpriteRows } from '../types'\n\n" +
  'export const CARD_ART: Record<string, SpriteRows> = {\n'
for (const [id, rows] of Object.entries(art)) {
  out += `  ${id}: [\n${rows.map((r) => `    '${r}',`).join('\n')}\n  ],\n`
}
out += `}\n`

writeFileSync('src/game/content/art/literals/cardArt.ts', out)
console.log('Wrote', Object.keys(art).length, 'card sprites')
