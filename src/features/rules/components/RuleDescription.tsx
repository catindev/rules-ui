import { Link } from 'react-router-dom'
import type { ArtifactResponse } from '../types'
import { artifactUrl } from './artifactDisplay'

function Value({ children }: { children: string }) {
  return <span className="human-value">{children}</span>
}

export function RuleDescription({ response }: { response: ArtifactResponse }) {
  const artifact = response.artifact || {}
  const presentation = response.presentation
  const fields = presentation.fields || []
  const role = artifact.role === 'predicate' ? 'predicate' : 'check'
  const operator = presentation.operatorTitle || String(artifact.operator || '')
  const value = artifact.value !== undefined
    ? typeof artifact.value === 'string' ? artifact.value : JSON.stringify(artifact.value)
    : null
  const valueField = typeof artifact.value_field === 'string' ? artifact.value_field : null
  const dictionaryId = (artifact.dictionary as { id?: string } | undefined)?.id
  const dictionaryTitle = presentation.dictionaryTitle

  return (
    <div className="human-desc">
      <p className="human-line">
        <span className="human-kw">Если</span>
        {fields.length ? (
          fields.map((field, index) => (
            <span key={field.field}>
              {index > 0 ? <span className="human-kw">, </span> : null}
              <span className="human-field" title={field.field}>{field.title}</span>
            </span>
          ))
        ) : (
          <span className="human-field">значение</span>
        )}
        <span className="human-op">{operator}</span>
        {dictionaryTitle && dictionaryId ? (
          <Link className="human-value" to={artifactUrl(dictionaryId)}>
            {dictionaryTitle}
          </Link>
        ) : dictionaryTitle ? <Value>{dictionaryTitle}</Value> : null}
        {value ? <Value>{value}</Value> : null}
        {valueField ? <Value>{valueField}</Value> : null}
      </p>
      {role === 'check' ? (
        <>
          <p className="human-line">
            <span className="human-kw">то вернуть</span>
            <span className="human-ok">OK</span>
          </p>
          <p className="human-line">
            <span className="human-kw">иначе вернуть</span>
            <span className="human-error">{String(artifact.level || 'ERROR')}</span>
            {typeof artifact.message === 'string' ? (
              <>
                <span className="human-kw">с сообщением</span>
                <span className="human-message">{artifact.message}</span>
              </>
            ) : null}
          </p>
          {typeof artifact.code === 'string' ? (
            <p className="human-line">
              <span className="human-kw">и кодом ошибки</span>
              <span className="human-code">{artifact.code}</span>
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className="human-line"><span className="human-kw">то вернуть</span><span className="human-ok">true</span></p>
          <p className="human-line"><span className="human-kw">иначе вернуть</span><span className="human-error">false</span></p>
        </>
      )}
    </div>
  )
}
