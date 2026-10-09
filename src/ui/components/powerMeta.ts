import type { PowerKind } from '../../game/models/effects'

export type PowerMeta = {
  label: string
  shortLabel: string
  description: string
  variant: 'buff' | 'debuff' | 'neutral'
}

export const POWER_META: Record<PowerKind, PowerMeta> = {
  strength: {
    label: 'Strength',
    shortLabel: 'Str',
    description: 'Increases attack damage.',
    variant: 'buff',
  },
  dexterity: {
    label: 'Dexterity',
    shortLabel: 'Dex',
    description: 'Increases Block gained from cards.',
    variant: 'buff',
  },
  vulnerable: {
    label: 'Vulnerable',
    shortLabel: 'Vuln',
    description: 'Take 50% more damage from attacks.',
    variant: 'debuff',
  },
  weak: {
    label: 'Weak',
    shortLabel: 'Weak',
    description: 'Deal 25% less attack damage.',
    variant: 'debuff',
  },
  metallicize: {
    label: 'Metallicize',
    shortLabel: 'Metal',
    description: 'Gain Block at the end of your turn.',
    variant: 'buff',
  },
}

export const POWER_DISPLAY_ORDER: PowerKind[] = [
  'strength',
  'dexterity',
  'metallicize',
  'vulnerable',
  'weak',
]
