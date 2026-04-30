import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { appBaseName } from './shared/lib/mode'
import './styles/tokens.css'
import './styles/base.css'
import './styles/rules-ui.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={appBaseName === '/' ? undefined : appBaseName}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
