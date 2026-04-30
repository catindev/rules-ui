import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../shared/ui/PageHeader'
import { JsonPanel } from '../../shared/ui/JsonPanel'
import { BackLink } from '../../shared/ui/BackLink'
import type { EvaluateRulesResult, ScenarioResponse } from './types'
import { useRulesApi } from './rules-api-context'
import { IssuesPanel } from './components/IssuesPanel'
import { TracePanel } from './components/TracePanel'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function defaultRequest(pipelineId: string) {
  return JSON.stringify({
    pipelineId,
    context: { currentDate: todayIso() },
    payload: { beneficiary: {} },
    trace: 'basic',
  }, null, 2)
}

export function PlaygroundPage() {
  const { pipelineId = '' } = useParams()
  const decodedPipelineId = decodeURIComponent(pipelineId)
  const api = useRulesApi()
  const storageKey = useMemo(() => `rules-ui.playground.${decodedPipelineId}`, [decodedPipelineId])
  const resultKey = useMemo(() => `rules-ui.playground-result.${decodedPipelineId}`, [decodedPipelineId])
  const [scenario, setScenario] = useState<ScenarioResponse | null>(null)
  const [body, setBody] = useState(() => localStorage.getItem(storageKey) || defaultRequest(decodedPipelineId))
  const [result, setResult] = useState<EvaluateRulesResult | null>(() => {
    const saved = localStorage.getItem(resultKey)
    if (!saved) return null
    try {
      return JSON.parse(saved) as EvaluateRulesResult
    } catch {
      return null
    }
  })
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    api.scenario(decodedPipelineId).then(setScenario).catch(() => undefined)
  }, [api, decodedPipelineId])

  function format() {
    try {
      setBody(JSON.stringify(JSON.parse(body), null, 2))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Некорректный JSON')
    }
  }

  async function copy() {
    await navigator.clipboard?.writeText(body)
  }

  async function run() {
    setRunning(true)
    setError(null)
    try {
      const parsed = JSON.parse(body)
      const request = {
        flowId: scenario?.package.flowId,
        flowVersion: scenario?.package.flowVersion,
        pipelineId: parsed.pipelineId || decodedPipelineId,
        context: parsed.context || {},
        payload: parsed.payload || {},
        trace: parsed.trace ?? 'basic',
      }
      const payload = await api.evaluate(request)
      setResult(payload)
      localStorage.setItem(storageKey, JSON.stringify(request, null, 2))
      localStorage.setItem(resultKey, JSON.stringify(payload))
      setBody(JSON.stringify(request, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось выполнить проверки')
    } finally {
      setRunning(false)
    }
  }

  return (
    <>
      <BackLink to={`/scenarios/${encodeURIComponent(decodedPipelineId)}`} label="Структура" />
      <PageHeader
        eyebrow="Проверить"
        title={scenario?.scenario?.title || decodedPipelineId}
        subtitle={<code>{decodedPipelineId}</code>}
      />

      <div className="playground-grid">
        <section className="playground-editor">
          <div className="playground-toolbar">
            <button type="button" onClick={format}>Форматировать</button>
            <button type="button" onClick={copy}>Копировать</button>
            <button className="button-primary" type="button" onClick={run} disabled={running}>
              {running ? 'Выполняется...' : 'Выполнить проверки'}
            </button>
          </div>
          <textarea
            className="playground-textarea"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            spellCheck={false}
          />
        </section>

        <section className="playground-result">
          {error ? <div className="app-error">{error}</div> : null}
          {result ? (
            <>
              <div className={`result-status result-status--${result.status.toLowerCase()}`}>
                <strong>{result.status}</strong>
                <span>{result.control}</span>
              </div>
              <h2>Проблемы ({result.issues.length})</h2>
              <IssuesPanel issues={result.issues} />
              <h2>Trace</h2>
              <TracePanel trace={result.trace} />
              <h2>Raw response</h2>
              <JsonPanel value={result} collapsed={2} />
            </>
          ) : (
            <p className="app-empty-text">Результат появится после запуска проверки</p>
          )}
        </section>
      </div>
    </>
  )
}
