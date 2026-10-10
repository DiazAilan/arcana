import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { GameSession } from '../game/models/session'
import { SeededRNG } from '../game/rng/SeededRNG'
import { recordAnalytics } from '../analytics/recorder'
import type { SessionAction } from '../game/session/sessionActions'
import { createInitialSession, sessionReducer } from '../game/session/sessionReducer'

type GameContextValue = {
  session: GameSession
  dispatch: (action: SessionAction) => void
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GameSession>(() => createInitialSession())
  const rngRef = useRef(new SeededRNG(1))

  const dispatch = useCallback((action: SessionAction) => {
    if (action.type === 'NEW_RUN') {
      const seed = action.seed ?? Date.now()
      rngRef.current = new SeededRNG(seed)
      setSession((prev) => {
        const next = sessionReducer(prev, { type: 'NEW_RUN', seed }, rngRef.current)
        recordAnalytics(prev, { type: 'NEW_RUN', seed }, next)
        return next
      })
      return
    }
    setSession((prev) => {
      const next = sessionReducer(prev, action, rngRef.current)
      recordAnalytics(prev, action, next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ session, dispatch }), [session, dispatch])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
