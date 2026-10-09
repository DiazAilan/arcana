import type { CombatAction } from '../combat/combatReducer'

export type SessionAction =
  | { type: 'NEW_RUN'; seed?: number }
  | { type: 'MAP_PICK_NODE'; nodeId: string }
  | { type: 'COMBAT'; action: CombatAction }
  | { type: 'REWARD_PICK_CARD'; cardId: string }
  | { type: 'REWARD_SKIP_CARD' }
  | { type: 'REWARD_TAKE_RELIC' }
  | { type: 'REWARD_CONTINUE' }
  | { type: 'SHOP_BUY'; offerIndex: number }
  | { type: 'SHOP_REMOVE_CARD'; deckIndex: number }
  | { type: 'SHOP_LEAVE' }
  | { type: 'REST_HEAL' }
  | { type: 'REST_UPGRADE'; instanceId: string }
  | { type: 'REST_LEAVE' }
  | { type: 'EVENT_CHOICE'; choiceIndex: number }
  | { type: 'GO_MAIN_MENU' }
