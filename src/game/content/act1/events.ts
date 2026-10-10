/** Player copy: no Primordial/hero proper names — see forbiddenLoreNames.test.ts */
import type { EventDef } from '../../models/event'

export const ACT1_EVENTS: EventDef[] = [
  {
    id: 'event_shrine',
    title: 'Collapsed Chapel',
    body: 'Star-maps crack the ceiling. Votive wax still burns though no one remembers who lit it. Offer, steal, or walk away.',
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
    title: 'Black Pearl Shrine',
    body: 'A faceless statue cradles a dark orb. A hooded figure offers forbidden knowledge—for coin or blood.',
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
    title: 'Wall of Masks',
    body: 'Hundreds of empty faces stare back. One moves a heartbeat late. Reach through—or break the wall.',
    choices: [
      {
        label: 'Reach into the hollow',
        effects: [{ type: 'add_card', cardId: 'arc_might' }, { type: 'add_card', cardId: 'arc_weaken' }],
      },
      {
        label: 'Shatter the masks',
        effects: [{ type: 'gold', amount: 30 }],
      },
    ],
  },
  {
    id: 'event_camp',
    title: 'Venting Forge',
    body: 'Heat rises from a crack in the floor—storm and ember trapped below. Rest here, or sift the slag for coin.',
    choices: [
      {
        label: 'Rest by the vent',
        effects: [{ type: 'heal_player', amount: 15 }],
      },
      {
        label: 'Sift the slag',
        effects: [{ type: 'gold', amount: 25 }],
      },
    ],
  },
  {
    id: 'event_vault',
    title: 'Royal Locket Niche',
    body: 'A diamond glints in a rusted locket. The lock hums when you approach—force, finesse, or retreat.',
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
