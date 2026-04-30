import { Link } from 'react-router-dom'
import type { RulesTraceEvent } from '../types'
import { JsonPanel } from '../../../shared/ui/JsonPanel'

export function TracePanel({ trace }: { trace?: RulesTraceEvent[] }) {
  if (!trace?.length) return <p className="app-empty-text">Trace отсутствует</p>

  return (
    <div className="trace-panel">
      {trace.map((event, index) => (
        <div key={`${event.artifactId}-${event.at}-${index}`} className="trace-event">
          <div className="trace-event__head">
            <span>{event.step}</span>
            <strong>{event.outcome}</strong>
            <time>{event.at ? new Date(event.at).toLocaleTimeString('ru-RU') : ''}</time>
          </div>
          {event.artifactId ? (
            <Link className="trace-event__artifact" to={`/artifacts/${encodeURIComponent(event.artifactId)}`}>
              {event.artifactId}
            </Link>
          ) : null}
          {event.details ? <JsonPanel value={event.details} collapsed={1} /> : null}
        </div>
      ))}
    </div>
  )
}
