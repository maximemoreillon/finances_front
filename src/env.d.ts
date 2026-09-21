/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FINANCES_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  // Injected at container start by env.js
  __ENV__?: Partial<ImportMetaEnv>
}
