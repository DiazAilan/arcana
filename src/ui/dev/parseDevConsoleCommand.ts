export type DevConsoleCommand =
  | { kind: 'relic_add'; relicId: string }
  | { kind: 'relic_delete'; relicId: string }

export type ParseResult =
  | { ok: true; command: DevConsoleCommand }
  | { ok: false; message: string }

export function parseDevConsoleCommand(input: string): ParseResult {
  const trimmed = input.trim()
  if (!trimmed.startsWith('/')) {
    return { ok: false, message: 'Commands start with / (e.g. /relic add relic_embers).' }
  }

  const parts = trimmed.split(/\s+/).filter(Boolean)
  const head = parts[0]?.toLowerCase()

  if (head === '/relic' || head === '/relics') {
    const sub = parts[1]?.toLowerCase()
    const relicId = parts[2]
    if (!sub || !relicId) {
      return { ok: false, message: 'Usage: /relic add RELIC_ID  or  /relic delete RELIC_ID' }
    }
    if (sub === 'add') return { ok: true, command: { kind: 'relic_add', relicId } }
    if (sub === 'delete' || sub === 'remove' || sub === 'del') {
      return { ok: true, command: { kind: 'relic_delete', relicId } }
    }
    return { ok: false, message: 'Unknown /relic subcommand. Use add or delete.' }
  }

  return { ok: false, message: `Unknown command: ${parts[0]}` }
}
