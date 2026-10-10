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
  | { type: 'REST_PURIFY'; instanceId: string }
  | { type: 'REST_LEAVE' }
  | { type: 'REWARD_APPLY_INFLUENCE'; instanceId: string }
  | { type: 'SHOP_PURIFY_CARD'; instanceId: string }
  | { type: 'EVENT_CHOICE'; choiceIndex: number }
  | { type: 'EVENT_CARD_DECISION'; cardId: string; accept: boolean }
  | { type: 'EVENT_CONTINUE' }
  | { type: 'GO_MAIN_MENU' }
  | { type: 'DEV_RELIC_ADD'; relicId: string }
  | { type: 'DEV_RELIC_DELETE'; relicId: string }
  | { type: 'DEV_SET_FLY'; enabled: boolean }
