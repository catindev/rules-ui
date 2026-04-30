import { Link } from 'react-router-dom'
import type { ScenarioSummary } from '../types'
import { Icon } from './Icon'

export function ScenarioCard({ scenario }: { scenario: ScenarioSummary }) {
  return (
    <Link className="scenario-card" to={`/scenarios/${encodeURIComponent(scenario.pipelineId)}`}>
      <div className="scenario-card__icon">
        <Icon name="pipeline" />
      </div>
      <div className="scenario-card__body">
        <div className="scenario-card__title">{scenario.title}</div>
        <div className="scenario-card__description">{scenario.description}</div>
        <div className="scenario-card__meta">
          <code>{scenario.pipelineId}</code>
          <span>{scenario.artifactSetId}@{scenario.artifactSetVersion}</span>
        </div>
      </div>
      <span className="scenario-card__chevron" aria-hidden="true">›</span>
    </Link>
  )
}
