/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Demo flag — set by `vite build` via VITE_FORGE_DEMO=true (the build:demo
  // script). Turns on the smoke-and-mirrors stub in a production build (e.g. the
  // da.live ?ref=local showtime build). Unset in a normal client:build.
  readonly VITE_FORGE_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
