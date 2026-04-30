import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../shared/ui/PageHeader'
import type { PackagesResponse, ScenariosResponse } from './types'
import { useRulesApi } from './rules-api-context'
import { ScenarioCard } from './components/ScenarioCard'
import { DiagnosticsPanel } from './components/DiagnosticsPanel'

export function RulesHomePage() {
  const api = useRulesApi()
  const [packages, setPackages] = useState<PackagesResponse | null>(null)
  const [scenarios, setScenarios] = useState<ScenariosResponse | null>(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([api.packages(), api.scenarios()])
      .then(([packagesPayload, scenariosPayload]) => {
        if (cancelled) return
        setPackages(packagesPayload)
        setScenarios(scenariosPayload)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Не удалось загрузить правила')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [api])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = scenarios?.scenarios || []
    if (!needle) return list
    return list.filter((scenario) =>
      [scenario.title, scenario.description, scenario.pipelineId, scenario.artifactSetId]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [query, scenarios])

  return (
    <>
      <PageHeader
        title="Сценарии проверок"
        subtitle={
          scenarios?.package
            ? `${scenarios.package.name} / ${scenarios.package.flowId}@${scenarios.package.flowVersion}`
            : 'Пакет правил процессора'
        }
      />

      {packages?.packages.length ? (
        <div className="rules-package-strip">
          {packages.packages.map((pkg) => (
            <div key={`${pkg.flowId}-${pkg.flowVersion}`} className="rules-package-pill">
              <strong>{pkg.name}</strong>
              <code>{pkg.flowId}@{pkg.flowVersion}</code>
            </div>
          ))}
        </div>
      ) : null}

      <div className="app-search">
        <label className="app-search__field">
          <span aria-hidden="true">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по сценарию, описанию или id"
          />
        </label>
      </div>

      {loading ? <p className="app-empty-text">Загрузка сценариев...</p> : null}
      {error ? <div className="app-error">{error}</div> : null}

      {!loading && !error ? (
        <div className="scenario-list">
          {filtered.map((scenario) => (
            <ScenarioCard key={scenario.pipelineId} scenario={scenario} />
          ))}
          {!filtered.length ? <p className="app-empty-text">Сценарии не найдены</p> : null}
        </div>
      ) : null}

      <DiagnosticsPanel diagnostics={scenarios?.diagnostics} />
    </>
  )
}
