import { SPRITE_PALETTE } from './palette'

/** Human-readable palette for the sprite gallery and editing reference. */
export const PALETTE_LEGEND: { key: string; hex: string }[] = Object.entries(SPRITE_PALETTE)
  .filter(([k]) => k !== '.')
  .map(([key, hex]) => ({ key, hex }))
