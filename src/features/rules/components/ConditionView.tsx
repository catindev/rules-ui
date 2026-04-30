import type { ArtifactResponse } from '../types'
import { ConditionDetails } from './ConditionBlock'

export function ConditionView({ response }: { response: ArtifactResponse }) {
  const node = response.node
  if (!node) return null
  return <ConditionDetails node={node} />
}
