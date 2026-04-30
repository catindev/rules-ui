const SERVER_STORAGE_KEY = 'rules-ui.processor-base-url'

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

export function defaultProcessorBaseUrl() {
  if ((import.meta.env.BASE_URL || '').startsWith('/rules')) {
    return ''
  }
  if (import.meta.env.VITE_PROCESSOR_BASE_URL) {
    return trimTrailingSlash(import.meta.env.VITE_PROCESSOR_BASE_URL)
  }
  return 'http://localhost:3000'
}

export function getStoredProcessorBaseUrl() {
  try {
    return localStorage.getItem(SERVER_STORAGE_KEY) || defaultProcessorBaseUrl()
  } catch {
    return defaultProcessorBaseUrl()
  }
}

export function setStoredProcessorBaseUrl(value: string) {
  const normalized = trimTrailingSlash(value.trim())
  try {
    if (normalized) localStorage.setItem(SERVER_STORAGE_KEY, normalized)
    else localStorage.removeItem(SERVER_STORAGE_KEY)
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

export class ProcessorClient {
  constructor(private readonly getBaseUrl: () => string) {}

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'GET' })
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const baseUrl = trimTrailingSlash(this.getBaseUrl())
    const response = await fetch(`${baseUrl}${path}`, init)
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      const message =
        payload?.error?.message ||
        payload?.message ||
        `Processor API returned HTTP ${response.status}`
      throw new Error(message)
    }
    return payload as T
  }
}
