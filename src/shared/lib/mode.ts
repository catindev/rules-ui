export const appBaseName = (() => {
  const base = import.meta.env.BASE_URL || '/'
  const normalized = base.replace(/\/$/, '')
  return normalized === '' ? '/' : normalized
})()

export const isEmbeddedMode =
  import.meta.env.VITE_RULES_UI_MODE === 'processor' ||
  (import.meta.env.BASE_URL || '').startsWith('/rules')

export const isLocalMode = !isEmbeddedMode
