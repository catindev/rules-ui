import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../shared/ui/PageHeader'
import { Tabs } from '../../shared/ui/Tabs'
import { BackLink } from '../../shared/ui/BackLink'
import { isLocalMode } from '../../shared/lib/mode'
import type { ScenarioResponse } from './types'
import { useRulesApi } from './rules-api-context'
import { RulesTree } from './components/RulesTree'
import { DiagnosticsPanel } from './components/DiagnosticsPanel'

export function ScenarioPage() {
  const { pipelineId = '' } = useParams()
  const decodedPipelineId = decodeURIComponent(pipelineId)
  const api = useRulesApi()
  const navigate = useNavigate()
  const [data, setData] = useState<ScenarioResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api
      .scenario(decodedPipelineId)
      .then((payload) => {
        if (!cancelled) setData(payload)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Не удалось загрузить сценарий')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [api, decodedPipelineId])

  return (
    <>
      <BackLink to="/" label="Все сценарии" />
      <PageHeader
        eyebrow={data?.package ? `${data.package.artifactSetId}@${data.package.artifactSetVersion}` : undefined}
        title={data?.scenario?.title || decodedPipelineId}
        subtitle={<code>{decodedPipelineId}</code>}
      />
      <Tabs
        activeTab="structure"
        ariaLabel="Разделы сценария"
        tabs={isLocalMode ? [
          { id: 'structure', label: 'Структура' },
          { id: 'playground', label: 'Проверить' },
        ] : [{ id: 'structure', label: 'Структура' }]}
        onChange={(tab) => {
          if (tab === 'playground') navigate(`/scenarios/${encodeURIComponent(decodedPipelineId)}/playground`)
        }}
      />

      {loading ? <p className="app-empty-text">Загрузка дерева...</p> : null}
      {error ? <div className="app-error">{error}</div> : null}
      {data && !error ? <RulesTree root={data.tree} showRoot={false} /> : null}
      <DiagnosticsPanel diagnostics={data?.diagnostics} />
    </>
  )
}
