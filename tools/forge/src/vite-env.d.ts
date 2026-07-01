/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Mock flag — set via FORGE_MOCK=true (e.g. the build:demo script).
  // Turns on the smoke-and-mirrors stub (no real backend needed).
  // Unset in a normal client:build → real server used.
  readonly FORGE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
