export type CharacterDef = {
  id: string
  name: string
  maxHp: number
  starterDeck: string[]
  /** Card ids offered in rewards / shop pool */
  cardPool: string[]
}
