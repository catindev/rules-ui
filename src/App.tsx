import { useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProcessorClient, getStoredProcessorBaseUrl } from './shared/api/processor-client'
import { PageLayout } from './shared/ui/PageLayout'
import { createRulesApi } from './features/rules/api'
import { RulesApiContext } from './features/rules/rules-api-context'
import { RulesHomePage } from './features/rules/RulesHomePage'
import { ScenarioPage } from './features/rules/ScenarioPage'
import { ArtifactPage } from './features/rules/ArtifactPage'
import { PlaygroundPage } from './features/rules/PlaygroundPage'
import { isEmbeddedMode } from './shared/lib/mode'

export function App() {
  const [processorBaseUrl, setProcessorBaseUrl] = useState(getStoredProcessorBaseUrl)
  const api = useMemo(() => {
    const client = new ProcessorClient(() => processorBaseUrl)
    return createRulesApi(client)
  }, [processorBaseUrl])

  return (
    <RulesApiContext.Provider value={api}>
      <PageLayout onServerChange={setProcessorBaseUrl}>
        <Routes>
          <Route path="/" element={<RulesHomePage />} />
          <Route path="/scenarios/:pipelineId" element={<ScenarioPage />} />
          <Route
            path="/scenarios/:pipelineId/playground"
            element={isEmbeddedMode ? <Navigate to="/" replace /> : <PlaygroundPage />}
          />
          <Route path="/artifacts/:artifactId" element={<ArtifactPage />} />
          <Route path="/rules/:artifactId" element={<ArtifactPage />} />
          <Route path="/conditions/:artifactId" element={<ArtifactPage />} />
          <Route path="/dictionaries/:artifactId" element={<ArtifactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageLayout>
    </RulesApiContext.Provider>
  )
}
