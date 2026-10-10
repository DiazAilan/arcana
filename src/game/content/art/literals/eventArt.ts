/**
 * Event scene art — 64×64 (16×16 source upscaled 4×). `.` transparent.
 */
import type { SpriteRows } from '../types'

const EVENT_GRID = 64

function upscale4x(rows16: SpriteRows): SpriteRows {
  const out: SpriteRows = []
  for (const row of rows16) {
    const wide = row
      .split('')
      .flatMap((ch) => [ch, ch, ch, ch])
      .join('')
    for (let i = 0; i < 4; i++) out.push(wide)
  }
  while (out.length < EVENT_GRID) out.push('.'.repeat(EVENT_GRID))
  return out.slice(0, EVENT_GRID).map((row) => row.padEnd(EVENT_GRID, '.').slice(0, EVENT_GRID))
}

const shrine16: SpriteRows = [
  '................',
  '......lll.......',
  '.....lkkkl......',
  '....lkllklk.....',
  '....k.....k.....',
  '...lk..i..kl....',
  '...lk..i..kl....',
  '...lk.....kl....',
  '....lkllklk.....',
  '.....lkkkl......',
  '......uuu.......',
  '.....uuuuu......',
  '....uuuuuuu.....',
  '................',
  '................',
  '................',
]

const merchant16: SpriteRows = [
  '................',
  '.......6........',
  '......6666......',
  '......6556......',
  '.....655556.....',
  '.....355553.....',
  '......5555......',
  '......6666......',
  '.....666666.....',
  '....66665566....',
  '....66666666....',
  '.....666666.....',
  '......2222......',
  '......2..2......',
  '................',
  '................',
]

const mirror16: SpriteRows = [
  '................',
  '......cccc......',
  '.....cdddc......',
  '....cdddddc.....',
  '...cddddd7dc....',
  '...cddddd7dc....',
  '...cddddd7dc....',
  '....cdddddc.....',
  '.....cdddc......',
  '......ccc.......',
  '.....cccccc.....',
  '....cccccccc....',
  '.....cccccc.....',
  '......cccc......',
  '................',
  '................',
]

const camp16: SpriteRows = [
  '................',
  '........p.......',
  '.......ppp......',
  '......piiip.....',
  '.....piiiiip....',
  '....piiiiiiip...',
  '....phhhhhhhp...',
  '....ph7777hp....',
  '....ph7777hp....',
  '.....phhhhp.....',
  '......ppp.......',
  '.....rrrrr......',
  '....rrrrrrr.....',
  '.....rrrrr......',
  '................',
  '................',
]

const vault16: SpriteRows = [
  '................',
  '.....mmmmmm.....',
  '....mllllllm....',
  '....ml....lm....',
  '....ml....lm....',
  '....ml..k.lm....',
  '....ml..k.lm....',
  '....ml....lm....',
  '....ml....lm....',
  '....mllllllm....',
  '.....mmmmmm.....',
  '......uuu.......',
  '.....uuuuu......',
  '....uuuuuuu.....',
  '................',
  '................',
]

export const EVENT_GRID_SIZE = EVENT_GRID

export const EVENT_ART: Record<string, SpriteRows> = {
  event_shrine: upscale4x(shrine16),
  event_merchant: upscale4x(merchant16),
  event_mirror: upscale4x(mirror16),
  event_camp: upscale4x(camp16),
  event_vault: upscale4x(vault16),
}

export const DEFAULT_EVENT_ART: SpriteRows = EVENT_ART.event_camp!
