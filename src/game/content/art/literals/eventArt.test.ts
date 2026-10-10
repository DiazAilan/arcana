import { describe, expect, it } from 'vitest'
import { ACT1_EVENTS } from '../../act1/events'
import { EVENT_ART, EVENT_GRID_SIZE } from './eventArt'

describe('eventArt', () => {
  it('each act1 event has 64×64 art', () => {
    for (const event of ACT1_EVENTS) {
      const rows = EVENT_ART[event.id]
      expect(rows, event.id).toBeDefined()
      expect(rows!.length, event.id).toBe(EVENT_GRID_SIZE)
      for (const row of rows!) {
        expect(row.length, event.id).toBe(EVENT_GRID_SIZE)
      }
    }
  })
})
