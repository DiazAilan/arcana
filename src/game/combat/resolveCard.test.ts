import { describe, expect, it, beforeEach } from 'vitest'
import { loadRegistry } from '../content/registry'
import { createCardInstance, resetCardInstanceCounter } from '../models/card'
import { resolveCard } from './resolveCard'

describe('resolveCard', () => {
  beforeEach(() => {
    loadRegistry()
    resetCardInstanceCounter()
  })

  it('applies influence cost and damage modifiers', () => {
    const card = createCardInstance('arc_strike', false, ['inf_scorched', 'inf_ember_kissed'])
    const resolved = resolveCard(card)
    expect(resolved.cost).toBe(2)
    expect(resolved.effects.find((e) => e.type === 'damage')?.amount).toBe(8)
    expect(resolved.influenceNames).toEqual(['Scorched', 'Ember-kissed'])
  })

  it('etched buffs power cards', () => {
    const card = createCardInstance('arc_might', false, ['inf_shop_etched'])
    const resolved = resolveCard(card)
    const power = resolved.effects.find((e) => e.type === 'apply_power')
    expect(power?.amount).toBe(3)
    expect(resolved.description).toBe('Gain 2 Strength.')
  })
})
