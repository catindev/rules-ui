import { Link } from 'react-router-dom'
import type { ArtifactResponse } from '../types'
import { artifactUrl } from './artifactDisplay'

function Property({ label, value }: { label: string; value: unknown }) {
  if (value == null || value === '') return null
  return (
    <div className="artifact-property">
      <span className="artifact-property__label">{label}</span>
      <code className="artifact-property__value">
        {typeof value === 'string' ? value : JSON.stringify(value)}
      </code>
    </div>
  )
}

function LinkProperty({ label, artifactId }: { label: string; artifactId?: string }) {
  if (!artifactId) return null
  return (
    <div className="artifact-property">
      <span className="artifact-property__label">{label}</span>
      <Link className="artifact-property__link" to={artifactUrl(artifactId)}>
        {artifactId}
      </Link>
    </div>
  )
}

export function RuleStructure({ response }: { response: ArtifactResponse }) {
  const artifact = response.artifact || {}
  const dictionaryId = (artifact.dictionary as { id?: string } | undefined)?.id

  return (
    <div className="artifact-structure">
      <div className="artifact-properties">
        <Property label="Роль" value={artifact.role === 'predicate' ? 'предикат' : 'проверка'} />
        <Property label="Уровень эскалации" value={artifact.level} />
        <Property label="Поле" value={artifact.field} />
        <Property label="Поля" value={artifact.fields || artifact.paths} />
        <Property label="Оператор" value={artifact.operator} />
        <Property label="Значение" value={artifact.value} />
        <Property label="Поле сравнения" value={artifact.value_field} />
        <LinkProperty label="Справочник" artifactId={dictionaryId} />
      </div>
      {artifact.message || artifact.code ? (
        <div className="response-format">
          <div className="response-format__title">Формат ответа</div>
          {artifact.message ? (
            <div>
              <span>Сообщение</span>
              <strong>{String(artifact.message)}</strong>
            </div>
          ) : null}
          {artifact.code ? (
            <div>
              <span>Код</span>
              <code>{String(artifact.code)}</code>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
