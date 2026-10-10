import type { EventDef } from '../../models/event'

export const ACT1_EVENTS: EventDef[] = [
  {
    id: 'event_shrine',
    title: 'Forgotten Shrine',
    body: 'A cracked altar hums with leftover spellwork. Something may respond to an offering—or a theft.',
    choices: [
      {
        label: 'Pray (lose 6 HP)',
        effects: [
          { type: 'damage_player', amount: 6 },
          { type: 'add_relic', relicId: 'relic_vial' },
        ],
      },
      {
        label: 'Smash the altar (take 6 damage)',
        effects: [{ type: 'gold', amount: 45 }, { type: 'damage_player', amount: 6 }],
      },
      {
        label: 'Leave',
        effects: [],
      },
    ],
  },
  {
    id: 'event_merchant',
    title: 'Wandering Scribe',
    body: 'A scribe offers a forbidden page in exchange for coin—or blood.',
    choices: [
      {
        label: 'Pay 50 gold',
        effects: [{ type: 'gold', amount: -50 }, { type: 'add_card', cardId: 'arc_rupture' }],
      },
      {
        label: 'Offer blood (lose 10 HP)',
        effects: [{ type: 'damage_player', amount: 10 }, { type: 'add_card', cardId: 'arc_channel' }],
      },
      {
        label: 'Decline',
        effects: [],
      },
    ],
  },
  {
    id: 'event_mirror',
    title: 'Mirror Pool',
    body: 'Your reflection moves a heartbeat late. It might share a secret—for a price.',
    choices: [
      {
        label: 'Reach into the water',
        effects: [{ type: 'add_card', cardId: 'arc_might' }, { type: 'add_card', cardId: 'arc_weaken' }],
      },
      {
        label: 'Shatter the mirror',
        effects: [{ type: 'gold', amount: 30 }],
      },
    ],
  },
  {
    id: 'event_camp',
    title: 'Ashen Campfire',
    body: 'Embers still warm. Rest could steady your hands—or you could push onward.',
    choices: [
      {
        label: 'Rest by the fire',
        effects: [{ type: 'heal_player', amount: 15 }],
      },
      {
        label: 'Forage the camp',
        effects: [{ type: 'gold', amount: 25 }],
      },
    ],
  },
  {
    id: 'event_vault',
    title: 'Locked Vault',
    body: 'A rune lock clicks when you approach. Force, finesse, or walk away.',
    choices: [
      {
        label: 'Force it (lose 8 HP)',
        effects: [{ type: 'damage_player', amount: 8 }, { type: 'add_relic', relicId: 'relic_embers' }],
      },
      {
        label: 'Pick the lock (lose a random card)',
        effects: [{ type: 'remove_random_card' }, { type: 'gold', amount: 60 }],
      },
      {
        label: 'Walk away',
        effects: [],
      },
    ],
  },
]

export const FALLBACK_EVENT_ID = 'event_camp'
