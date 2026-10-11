import type { CardBaseStat, CardEffectStat, CardStatPreview } from '../../game/combat/cardPreview'
import type { PowerKind } from '../../game/models/effects'

export type DescriptionPart =
  | { kind: 'text'; text: string }
  | {
      kind: 'stat'
      symbol: string
      value: number
      buff: boolean
      debuff: boolean
    }

function powerPhrases(power: PowerKind, base: number): string[] {
  const label = {
    strength: 'Strength',
    dexterity: 'Dexterity',
    metallicize: 'Metallicize',
    vulnerable: 'Vulnerable',
    weak: 'Weak',
  }[power]
  if (power === 'vulnerable' || power === 'weak') {
    return [`Apply ${base} ${label}`]
  }
  return [`Gain ${base} ${label}`]
}

function phrasesForEffectStat(stat: CardEffectStat): string[] {
  switch (stat.kind) {
    case 'damage':
      return [
        `Deal ${stat.value} damage to ALL enemies`,
        `Deal ${stat.value} damage twice`,
        `Deal ${stat.value} damage`,
      ]
    case 'block':
      return [`Gain ${stat.value} Block`]
    case 'heal':
      return [`Heal ${stat.value} HP`]
    case 'power':
      return stat.power ? powerPhrases(stat.power, stat.value) : []
    case 'energy':
      return [`Gain ${stat.value} Energy`]
    case 'draw':
      return [`Draw ${stat.value} card`, `Draw ${stat.value} cards`]
    default:
      return []
  }
}

function phrasesForStat(kind: CardStatPreview['kind'], base: number): string[] {
  return phrasesForEffectStat({ kind, value: base, label: '', symbol: '' })
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

function statMatchKey(stat: CardEffectStat): string {
  if (stat.kind === 'power' && stat.power) return `power:${stat.power}`
  return stat.kind
}

function baseStatValueForEffect(
  baseStats: CardEffectStat[],
  stat: CardEffectStat,
  kindIndex: number,
): number | undefined {
  const key = statMatchKey(stat)
  let seen = 0
  for (const base of baseStats) {
    if (statMatchKey(base) !== key) continue
    if (seen === kindIndex) return base.value
    seen += 1
  }
  return undefined
}

function applyUpgradeCompareStat(
  parts: DescriptionPart[],
  stat: CardEffectStat,
  baseStats: CardEffectStat[],
  kindIndex: number,
): DescriptionPart[] {
  const baseVal = baseStatValueForEffect(baseStats, stat, kindIndex)
  const improved = baseVal != null && stat.value > baseVal
  const worsened = baseVal != null && stat.value < baseVal
  const statPart: DescriptionPart = {
    kind: 'stat',
    symbol: stat.symbol,
    value: stat.value,
    buff: improved,
    debuff: worsened,
  }
  for (const phrase of phrasesForEffectStat(stat)) {
    const next = parts.flatMap((p) => splitPart(p, phrase, statPart))
    if (next.length !== parts.length || next.some((p, i) => p !== parts[i])) {
      return next
    }
  }
  // Also try matching base-value phrasing so upgraded/influenced numbers highlight.
  if (baseVal != null && baseVal !== stat.value) {
    for (const phrase of phrasesForEffectStat({ ...stat, value: baseVal })) {
      const next = parts.flatMap((p) => splitPart(p, phrase, statPart))
      if (next.length !== parts.length || next.some((p, i) => p !== parts[i])) {
        return next
      }
    }
  }
  return parts
}

/** Highlight upgraded stat numbers that beat the base card (green/bold via CardDescriptionText). */
export function descriptionWithUpgradeHighlight(
  upgradedDescription: string,
  upgradedStats: CardBaseStat[],
  baseStats: CardBaseStat[],
): DescriptionPart[] {
  return descriptionWithEffectHighlight(
    upgradedDescription,
    upgradedStats as CardEffectStat[],
    baseStats as CardEffectStat[],
  )
}

/** Green/red stat highlights vs uninfluenced card. */
export function descriptionWithEffectHighlight(
  description: string,
  currentStats: CardEffectStat[],
  baseStats: CardEffectStat[],
): DescriptionPart[] {
  let parts: DescriptionPart[] = [{ kind: 'text', text: description }]
  const kindCounters: Record<string, number> = {}
  for (const stat of currentStats) {
    const key = statMatchKey(stat)
    const idx = kindCounters[key] ?? 0
    kindCounters[key] = idx + 1
    parts = applyUpgradeCompareStat(parts, stat, baseStats, idx)
  }
  return parts
}
