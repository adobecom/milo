import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { cpSync, existsSync } from 'fs';
import react from '@vitejs/plugin-react';
import macros from 'unplugin-parcel-macros';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  // Demo build (VITE_FORGE_DEMO=true) ships the smoke-and-mirrors stub. It can run
  // two ways: inside the real DA editor (da.live ?ref=local — real SDK present) OR
  // on plain localhost:3000 (no real SDK). To make BOTH work, the demo build also
  // aliases the DA SDK to the dev-stub — harmless inside DA (we don't depend on the
  // real context for a stubbed run) and essential on bare localhost.
  const isDemo = process.env.VITE_FORGE_DEMO === 'true';
  const stubDaSdk = mode === 'development' || isDemo;
  const daSdkUrl = 'https://da.live/nx/utils/sdk.js';
  const daStubPath = resolve(__dirname, 'src/da/dev-stub.ts');

  return {
  // Redirect the DA SDK import to the local stub in dev + demo builds.
  //
  // NOTE: resolve.alias does NOT rewrite a full `https://` specifier in the Vite
  // DEV SERVER — alias runs after the dev server has already marked the URL as an
  // external/optimized import, so dev kept loading the REAL sdk.js. On bare
  // localhost (not embedded in the DA editor) the real SDK's default export never
  // resolves — it waits for a DA-parent handshake that never arrives — so the first
  // thing to `await DA_SDK` (Send to Authoring → deploySession → refreshDaSdk)
  // hangs forever ("Sending…" stuck). The `daSdkStub` plugin below (enforce:'pre')
  // resolves the URL to the stub in dev; the alias still covers the rollup build.
  resolve: {
    alias: stubDaSdk ? [
      {
        find: daSdkUrl,
        replacement: daStubPath,
      },
    ] : [],
  },

  // Source root — Vite dev server serves files from here.
  root: resolve(__dirname, 'src'),

  // All asset URLs in emitted HTML/CSS are prefixed with /tools/ so they
  // resolve correctly when served by aem up / aem.live at that path.
  base: '/tools/',

  plugins: [
    // Copy the hand-coded prototype pages (src/prototype/*) into the build output
    // so "Open prototype" resolves under the da-playground showtime build too. The
    // dev server serves them from src/ directly; the rollup build only emits the
    // entry, so we copy them on closeBundle. Demo-only assets.
    {
      name: 'forge-copy-prototypes',
      closeBundle() {
        const from = resolve(__dirname, 'src/prototype');
        const to = resolve(__dirname, 'prototype');
        if (existsSync(from)) cpSync(from, to, { recursive: true });
      },
    },
    // Force the DA SDK URL to the local stub in the DEV SERVER (resolve.alias only
    // covers the rollup build — see the note on resolve.alias above). Vite's dev
    // import-analysis treats `https://` specifiers as EXTERNAL and returns before
    // any resolveId hook runs, so a resolver alone never fires. Instead we rewrite
    // the URL specifier to a plain id in a `transform` (enforce:'pre', so it runs
    // BEFORE import-analysis), then map that id to the stub file in resolveId.
    ...(stubDaSdk ? [{
      name: 'da-sdk-stub',
      enforce: 'pre' as const,
      transform(code: string, id: string) {
        if (id.includes('node_modules') || !code.includes(daSdkUrl)) return null;
        return { code: code.split(daSdkUrl).join('\0da-sdk-stub'), map: null };
      },
      resolveId(id: string) {
        return id === '\0da-sdk-stub' ? daStubPath : null;
      },
    }] : []),
    // Macro plugin MUST run before @vitejs/plugin-react (Babel pass).
    macros.vite(),
    react(),
  ],

  // Don't pre-bundle S2 with esbuild — the style() macro needs to run
  // through unplugin-parcel-macros, not esbuild's bundler.
  optimizeDeps: {
    exclude: ['@react-spectrum/s2'],
    // ...but DO force-bundle this one CommonJS leaf. react-aria's
    // CollectionBuilder.mjs does `import {useSyncExternalStore} from
    // "use-sync-external-store/shim/index.js"`, and that shim is CJS
    // (module.exports = require(...)) with no named export. Because it's only
    // reachable THROUGH the excluded S2 tree, Vite never pre-bundles it, so the
    // browser evaluates raw CJS as ESM and the named import is missing
    // ("does not provide an export named 'useSyncExternalStore'"). Including it
    // makes esbuild synthesize the ESM interop. Dev-only; the prod build's
    // rollup commonjs pass already handles this.
    //
    // The `a > b > c` form resolves each nested segment from the previous one's
    // context — required under pnpm's strict layout, where only S2 is hoisted
    // to the top level and `use-sync-external-store` lives under `react-aria`.
    include: [
      '@react-spectrum/s2 > react-aria > use-sync-external-store/shim/index.js',
    ],
  },

  build: {
    // Emit into milo's tools/ (one level above this project at tools/forge/):
    // the entry HTML lands at tools/forge.html and the bundle/assets under
    // tools/forge/ — the milo tool shape (minimal entry HTML + bundle subdir),
    // served as-is by `aem up` / aem.live at /tools/forge.html.
    outDir: resolve(__dirname, '..'),
    // CRITICAL: never wipe tools/ — it holds many other milo tools.
    emptyOutDir: false,
    // All CSS → one page-forge.css.
    cssCodeSplit: false,

    rollupOptions: {
      // Keep all https:// imports (DA SDK, any remote CDN) as literal imports
      // in the emitted bundle so the browser resolves them at runtime.
      external: (id: string) => id.startsWith('https://'),

      // Named forge.html so Vite emits tools/forge.html (not index.html).
      input: resolve(__dirname, 'src', 'forge.html'),

      output: {
        // Fixed filenames (no content hash). Entry + chunks + assets all land
        // under the forge/ subdir; with base '/tools/' the emitted forge.html
        // references them as /tools/forge/page-forge.{js,css}.
        entryFileNames: 'forge/page-forge.js',
        chunkFileNames: 'forge/page-forge.js',
        assetFileNames: (info) =>
          info.name?.endsWith('.css') ? 'forge/page-forge.css' : 'forge/assets/[name][extname]',
        // Inline all dynamic imports → single JS output file.
        inlineDynamicImports: true,
        // Disable manual code-splitting.
        manualChunks: undefined,
      },
    },
  },
  };
});
