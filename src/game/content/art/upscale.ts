import type { SpriteRows } from './types'
import { SPRITE_GRID } from './palette'

/** Double each pixel and row (16×16 → 32×32) for legacy literals. */
export function upscaleSprite2x(rows: SpriteRows): SpriteRows {
  const doubledRows = rows.flatMap((row) => {
    const wide = row
      .split('')
      .map((ch) => `${ch}${ch}`)
      .join('')
    return [wide, wide]
  })
  return doubledRows
}

export function normalizeSpriteRows(rows: SpriteRows): SpriteRows {
  const h = rows.length
  const w = rows[0]?.length ?? 0
  if (h === SPRITE_GRID && w === SPRITE_GRID) return rows
  if (h === 16 && w === 16) return upscaleSprite2x(rows)
  return rows
}
