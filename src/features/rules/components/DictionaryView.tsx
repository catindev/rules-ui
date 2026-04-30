import type { ArtifactResponse } from '../types'

export function DictionaryView({ response }: { response: ArtifactResponse }) {
  const entries = Array.isArray(response.node?.entries) ? response.node.entries : []
  return (
    <div className="dictionary-view">
      <div className="dictionary-view__title">Значения:</div>
      <div className="dictionary-view__entries">
        {entries.map((entry, index) => (
          <code className="dictionary-view__entry" key={`${String(entry)}-${index}`}>
            {String(entry)}
          </code>
        ))}
      </div>
    </div>
  )
}
