import type { RulesDiagnostic } from '../types'

export function DiagnosticsPanel({ diagnostics }: { diagnostics?: RulesDiagnostic[] }) {
  if (!diagnostics?.length) return null

  return (
    <div className="rules-diagnostics">
      {diagnostics.map((diagnostic, index) => (
        <div key={`${diagnostic.code}-${index}`} className={`rules-diagnostic rules-diagnostic--${diagnostic.level}`}>
          <strong>{diagnostic.code}</strong>
          <span>{diagnostic.message}</span>
          {diagnostic.artifactId ? <code>{diagnostic.artifactId}</code> : null}
        </div>
      ))}
    </div>
  )
}
