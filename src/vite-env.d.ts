/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROCESSOR_BASE_URL?: string
  readonly VITE_RULES_UI_MODE?: 'local' | 'processor'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
