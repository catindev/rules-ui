import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { JsonPanel } from '../../shared/ui/JsonPanel'
import { Tabs } from '../../shared/ui/Tabs'
import { BackLink } from '../../shared/ui/BackLink'
import type { ArtifactResponse } from './types'
import { useRulesApi } from './rules-api-context'
import { RuleDescription } from './components/RuleDescription'
import { RuleStructure } from './components/RuleStructure'
import { ConditionView } from './components/ConditionView'
import { DictionaryView } from './components/DictionaryView'
import { DiagnosticsPanel } from './components/DiagnosticsPanel'
import { RulesTree } from './components/RulesTree'
import { Icon } from './components/Icon'
import { artifactIconName, artifactKindLabel, artifactUrl } from './components/artifactDisplay'

type Tab = 'description' | 'structure' | 'raw'

export function ArtifactPage() {
  const { artifactId = '' } = useParams()
  const decodedArtifactId = decodeURIComponent(artifactId)
  const api = useRulesApi()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('description')
  const [data, setData] = useState<ArtifactResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .artifact(decodedArtifactId)
      .then((payload) => {
        if (!cancelled) {
          setData(payload)
          setTab(payload.artifact?.type === 'rule' ? 'description' : 'structure')
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Не удалось загрузить артефакт')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [api, decodedArtifactId])

  const kind = typeof data?.artifact?.type === 'string' ? data.artifact.type : 'artifact'

  function renderStructure() {
    if (!data) return null
    if (kind === 'rule') return <RuleStructure response={data} />
    if (kind === 'condition') return <ConditionView response={data} />
    if (kind === 'dictionary') return <DictionaryView response={data} />
    if (kind === 'pipeline' && data.node) return <RulesTree root={data.node} />
    return <JsonPanel value={data.artifact} />
  }

  return (
    <>
      <BackLink label="Назад" onClick={() => navigate(-1)} />
      <header className="artifact-hero">
        <Icon
          name={artifactIconName({ kind, isLibrary: decodedArtifactId.startsWith('library.') })}
          className="artifact-hero__icon"
        />
        <div className="artifact-hero__content">
          <h1 className="artifact-hero__title">{data?.presentation.title || decodedArtifactId}</h1>
          <div className="artifact-hero__subtitle">
            <strong>{artifactKindLabel(kind)}:</strong> <code>{decodedArtifactId}</code>
          </div>
        </div>
      </header>

      <Tabs<Tab>
        activeTab={tab}
        ariaLabel="Разделы артефакта"
        tabs={kind === 'rule' ? [
          { id: 'description', label: 'Описание' },
          { id: 'structure', label: 'Структура' },
          { id: 'raw', label: 'JSON' },
        ] : [
          { id: 'structure', label: 'Структура' },
          { id: 'raw', label: 'JSON' },
        ]}
        onChange={setTab}
      />

      {loading ? <p className="app-empty-text">Загрузка артефакта...</p> : null}
      {error ? <div className="app-error">{error}</div> : null}
      {data && !error ? (
        <>
          {tab === 'description' ? <RuleDescription response={data} /> : null}
          {tab === 'structure' ? renderStructure() : null}
          {tab === 'raw' ? <JsonPanel value={data.artifact} collapsed={2} /> : null}

          {data.related.dictionaries.length || data.related.usedBy.length ? (
            <div className="artifact-related">
              {data.related.dictionaries.map((item) => (
                <Link key={item.artifactId} to={artifactUrl(item.artifactId)}>
                  Справочник: {item.title}
                </Link>
              ))}
              {data.related.usedBy.slice(0, 8).map((item) => (
                <Link key={item.artifactId} to={artifactUrl(item.artifactId)}>
                  Используется в: {item.title}
                </Link>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
      <DiagnosticsPanel diagnostics={data?.diagnostics} />
    </>
  )
}
