import type {
  ArtifactResponse,
  EvaluateRulesResult,
  PackagesResponse,
  ScenarioResponse,
  ScenariosResponse,
} from './types'
import type { ProcessorClient } from '../../shared/api/processor-client'

export function createRulesApi(client: ProcessorClient) {
  return {
    packages() {
      return client.get<PackagesResponse>('/api/rules/packages')
    },
    scenarios() {
      return client.get<ScenariosResponse>('/api/rules/scenarios')
    },
    scenario(pipelineId: string) {
      return client.get<ScenarioResponse>(
        `/api/rules/scenarios/${encodeURIComponent(pipelineId)}`,
      )
    },
    artifact(artifactId: string) {
      return client.get<ArtifactResponse>(
        `/api/rules/artifacts/${encodeURIComponent(artifactId)}`,
      )
    },
    evaluate(body: {
      flowId?: string
      flowVersion?: string
      pipelineId: string
      context: Record<string, unknown>
      payload: Record<string, unknown>
      trace: false | 'basic' | 'verbose'
    }) {
      return client.post<EvaluateRulesResult>('/api/rules/evaluate', body)
    },
  }
}
