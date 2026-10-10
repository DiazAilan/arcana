import type { CharacterDef } from '../../models/character'
import { ACT1_CARDS, STARTER_DECK_IDS } from './cards'

/** Internal id `arcanist` kept for save/test compatibility. */
export const ARCANIST: CharacterDef = {
  id: 'arcanist',
  name: 'Tomb Delver',
  maxHp: 70,
  starterDeck: STARTER_DECK_IDS,
  cardPool: ACT1_CARDS.map((c) => c.id),
}
