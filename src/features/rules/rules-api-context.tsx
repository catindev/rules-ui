import { createContext, useContext } from 'react'
import type { createRulesApi } from './api'

export type RulesApi = ReturnType<typeof createRulesApi>

export const RulesApiContext = createContext<RulesApi | null>(null)

export function useRulesApi() {
  const api = useContext(RulesApiContext)
  if (!api) throw new Error('Rules API context is not configured')
  return api
}
