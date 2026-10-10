import type { CardBaseStat, CardStatPreview } from '../../game/combat/cardPreview'

export type DescriptionPart =
  | { kind: 'text'; text: string }
  | {
      kind: 'stat'
      symbol: string
      value: number
      buff: boolean
      debuff: boolean
    }

function phrasesForStat(kind: CardStatPreview['kind'], base: number): string[] {
  switch (kind) {
    case 'damage':
      return [
        `Deal ${base} damage to ALL enemies`,
        `Deal ${base} damage twice`,
        `Deal ${base} damage`,
      ]
    case 'block':
      return [`Gain ${base} Block`]
    case 'heal':
      return [`Heal ${base} HP`]
    default:
      return []
  }
}

function splitPart(part: DescriptionPart, phrase: string, stat: DescriptionPart & { kind: 'stat' }): DescriptionPart[] {
  if (part.kind !== 'text') return [part]
  const idx = part.text.indexOf(phrase)
  if (idx === -1) return [part]

  const out: DescriptionPart[] = []
  if (idx > 0) out.push({ kind: 'text', text: part.text.slice(0, idx) })
  out.push(stat)
  const rest = part.text.slice(idx + phrase.length)
  if (rest.length > 0) out.push({ kind: 'text', text: rest })
  return out
}

function applyStat(parts: DescriptionPart[], preview: CardStatPreview): DescriptionPart[] {
  const statPart: DescriptionPart = {
    kind: 'stat',
    symbol: preview.symbol,
    value: preview.effective,
    buff: preview.effective > preview.base,
    debuff: preview.effective < preview.base,
  }
  for (const phrase of phrasesForStat(preview.kind, preview.base)) {
    const next = parts.flatMap((p) => splitPart(p, phrase, statPart))
    if (next.length !== parts.length || next.some((p, i) => p !== parts[i])) {
      return next
    }
  }
  return parts
}

function applyBaseStat(parts: DescriptionPart[], stat: CardBaseStat): DescriptionPart[] {
  const statPart: DescriptionPart = {
    kind: 'stat',
    symbol: stat.symbol,
    value: stat.value,
    buff: false,
    debuff: false,
  }
  for (const phrase of phrasesForStat(stat.kind, stat.value)) {
    const next = parts.flatMap((p) => splitPart(p, phrase, statPart))
    if (next.length !== parts.length || next.some((p, i) => p !== parts[i])) {
      return next
    }
  }
  return parts
}

export function descriptionWithCombatStats(description: string, previews: CardStatPreview[]): DescriptionPart[] {
  let parts: DescriptionPart[] = [{ kind: 'text', text: description }]
  for (const preview of previews) {
    parts = applyStat(parts, preview)
  }
  return parts
}

export function descriptionWithBaseStats(description: string, stats: CardBaseStat[]): DescriptionPart[] {
  let parts: DescriptionPart[] = [{ kind: 'text', text: description }]
  for (const stat of stats) {
    parts = applyBaseStat(parts, stat)
  }
  return parts
}
