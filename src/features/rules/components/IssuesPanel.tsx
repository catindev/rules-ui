import type { RulesIssue } from '../types'

export function IssuesPanel({ issues }: { issues: RulesIssue[] }) {
  if (!issues.length) return <p className="app-empty-text">Проблем нет</p>

  return (
    <div className="issues-panel">
      {issues.map((issue, index) => (
        <div key={`${issue.code}-${issue.ruleId}-${index}`} className={`issue issue--${issue.level.toLowerCase()}`}>
          <div className="issue__level">{issue.level}</div>
          <div className="issue__body">
            <code>{issue.code}</code>
            <strong>{issue.message}</strong>
            <span>{issue.field || issue.ruleId}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
