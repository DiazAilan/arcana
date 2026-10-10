import { describe, expect, it } from 'vitest'
import { parseDevConsoleCommand } from './parseDevConsoleCommand'

describe('parseDevConsoleCommand', () => {
  it('parses relic add', () => {
    const r = parseDevConsoleCommand('/relic add relic_vial')
    expect(r).toEqual({ ok: true, command: { kind: 'relic_add', relicId: 'relic_vial' } })
  })

  it('parses relic delete', () => {
    const r = parseDevConsoleCommand('/relic delete relic_embers')
    expect(r).toEqual({ ok: true, command: { kind: 'relic_delete', relicId: 'relic_embers' } })
  })

  it('rejects missing args', () => {
    expect(parseDevConsoleCommand('/relic add').ok).toBe(false)
  })
})
