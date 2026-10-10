import { describe, expect, it, beforeAll } from 'vitest'
import { loadRegistry } from '../content/registry'
import { createEnemyInstance } from '../models/enemy'
import { getIntentDisplay } from './intents'

describe('getIntentDisplay', () => {
  beforeAll(() => {
    loadRegistry()
  })

  it('includes strength in attack damage', () => {
    const knight = createEnemyInstance('mob_knight', { maxHp: 58 })
    knight.powers = { strength: 2 }
    knight.intentIndex = 0
    const atk = getIntentDisplay(knight)
    expect(atk?.family).toBe('attack')
    expect(atk?.valueLabel).toBe('11')
  })
})
