/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPOTIFY_ID: string
  readonly VITE_SPOTIFY_SECRET: string
  readonly VITE_API_PREFIX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
