import { describe, expect, it } from 'vitest'

/** Proper nouns from the Book of Primordials — must not appear in player-facing strings. */
const FORBIDDEN = [
  'Asterion',
  'Macraru',
  'Sausarias',
  'Teronidas',
  'Shivat',
  'Halem',
  'Braulio',
  'Glenn',
  'Gustav',
  'Grey Ones',
  'Grey One',
]

const sources = {
  ...import.meta.glob('./**/*.ts', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('../../ui/**/*.tsx', { eager: true, query: '?raw', import: 'default' }),
} as Record<string, string>

describe('forbidden lore proper nouns', () => {
  it('does not appear in content or UI source', () => {
    const hits: string[] = []
    for (const [path, text] of Object.entries(sources)) {
      if (path.includes('.test.')) continue
      for (const name of FORBIDDEN) {
        if (text.includes(name)) {
          hits.push(`${name} in ${path}`)
        }
      }
    }
    expect(hits).toEqual([])
  })
})
