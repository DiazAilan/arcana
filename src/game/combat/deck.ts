import type { CardInstance } from '../models/card'
import type { CombatState } from './combatState'
import { SeededRNG } from '../rng/SeededRNG'

export function drawCards(
  state: CombatState,
  count: number,
  rng?: SeededRNG,
): { state: CombatState; drawn: CardInstance[] } {
  let drawPile = [...state.drawPile]
  let discardPile = [...state.discardPile]
  const hand = [...state.hand]
  const drawn: CardInstance[] = []

  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      if (discardPile.length === 0) break
      const shuffler = rng ?? new SeededRNG(Date.now())
      drawPile = shuffler.shuffle(discardPile)
      discardPile = []
    }
    const card = drawPile.pop()
    if (!card) break
    hand.push(card)
    drawn.push(card)
  }

  return {
    state: { ...state, drawPile, discardPile, hand },
    drawn,
  }
}

export function shuffleIntoDraw(pile: CardInstance[], rng: SeededRNG): CardInstance[] {
  return rng.shuffle(pile)
}
