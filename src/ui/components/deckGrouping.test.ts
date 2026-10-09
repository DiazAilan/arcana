import { describe, expect, it, beforeAll } from 'vitest'
import { loadRegistry } from '../../game/content/registry'
import { createCardInstance } from '../../game/models/card'
import { groupDeck } from './deckGrouping'

describe('groupDeck', () => {
  beforeAll(() => {
    loadRegistry()
  })

  it('groups identical cards', () => {
    const deck = [
      createCardInstance('arc_strike'),
      createCardInstance('arc_strike'),
      createCardInstance('arc_defend'),
    ]
    const groups = groupDeck(deck)
    expect(groups).toHaveLength(2)
    const strike = groups.find((g) => g.defId === 'arc_strike')
    expect(strike?.count).toBe(2)
  })
})
