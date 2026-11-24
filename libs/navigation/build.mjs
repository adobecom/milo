import * as esbuild from 'esbuild'; // eslint-disable-line import/no-extraneous-dependencies
import fs from 'node:fs';
import nodepath from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = nodepath.dirname(fileURLToPath(import.meta.url));

fs.rmSync('./dist/', { recursive: true, force: true });

await esbuild.build({
  entryPoints: ['navigation.css', 'navigation-c2.css', 'footer.css', 'footer-c2.css', 'dark-nav.css', 'base.css'],
  bundle: true,
  minify: true,
  outdir: './dist/',
  plugins: [{
    name: 'dont-bundle-svg',
    setup({ onResolve }) {
      onResolve({ filter: /^<svg/ }, ({ path }) => ({ path, external: true }));
    },
  }],
});

// This function behaves slightly different
// than the built in split function in
// that it only splits the array xs into two arrays
// on the first occurence of y only
const splitAt = (xs, y) => {
  if (!xs.length) return null;
  const splitInternal = (before, after) => {
    if (!after.length) return [before, []];
    const [x, ...rest] = after;
    if (x === y) return [before, rest];
    return splitInternal(before.concat([x]), rest);
  };
  return splitInternal([], xs);
};

const StyleLoader = {
  name: 'inline-style',
  setup({ onLoad }) {
    const template = (css) => `
      typeof document<'u'&&
      document.head
        .appendChild(document.createElement('style'))
        .appendChild(document.createTextNode(${JSON.stringify(css)}))`;
    onLoad({ filter: /\.css$/ }, async (args) => {
      const { path } = args;
      const [before, after] = splitAt(path.split('/'), 'navigation');
      const newPath = before
        .concat(['navigation', 'dist'])
        .concat(after)
        .join('/');
      const css = await fs.promises.readFile(newPath, 'utf8');
      return { contents: template(css) };
    });
  },
};

const LitResolver = {
  name: 'lit-resolver',
  setup({ onResolve }) {
    // Resolve lit-all.min.js imports to the actual file location
    onResolve({ filter: /lit-all\.min\.js$/ }, () => {
      const litPath = nodepath.resolve(__dirname, '../deps/lit-all.min.js');
      return { path: litPath };
    });
  },
};

// Only reachable via utils.js/delayed.js's loadArea(document)/loadDelayed()
// paths (full-page bootstrap, authoring/QA, MEP overlay), which standalone
// gnav never calls - excluded so this dead code doesn't bloat the bundle.
const lazyChunkFilenames = [
  'preflight-notification.js',
  'region-modal.js',
  'georoutingv2.js',
  'mep-overlay.js',
  'mep-overlay-highlight.js',
  'mep-next.js',
  'mep-lcp-check.js',
  'jsonld-graph-manager.js',
  'scroll-animations.js',
  'jarvis-chat.js',
  'google-login.js',
  'block-notifications.js',
  'automated-aria.js',
  'interlinks.js',
  'samplerum.js',

  // These ARE used by standalone gnav (not dead code), but only via dynamic
  // import() - excluding them here keeps that lazy-loading instead of
  // eagerly inlining them:
  // - aup-sdk.js: preserves the conditional SDK preload.
  // - merch.js: preserves dynamic imports, including gnav's startup import.
  // - merch-card-autoblock.js: its dynamic entry also depends on merch.js.
  'aup-sdk.js',
  'merch.js',
  'merch-card-autoblock.js',
];

const LAZY_CHUNKS_DIR = 'lazy-chunks';
// filename -> absolute source path, filled in as the resolver matches imports
const resolvedLazyChunkFiles = new Map();

// Marking these external alone isn't enough: npm only ships dist/, so the
// original relative path (e.g. ../features/google-login.js) won't exist for
// consumers. Rewrite to a flat ./lazy-chunks/<file>.js path instead, and
// build the real file there after the build (see buildLazyChunkFiles below).
const LazyChunkResolver = {
  name: 'lazy-chunk-resolver',
  setup({ onResolve }) {
    onResolve({ filter: /.*/ }, (args) => {
      // Only externalize genuine dynamic import() calls. A plain static
      // `import {...} from` must be available before the importing module's
      // top-level code runs, so externalizing it doesn't make it lazy - it
      // just forces consumers' bundlers (e.g. webpack) to pull the whole
      // lazy-chunk file into whatever chunk contains the importer instead.
      if (args.kind !== 'dynamic-import') return null;
      const filename = lazyChunkFilenames.find((f) => args.path.endsWith(f));
      if (!filename) return null;
      resolvedLazyChunkFiles.set(filename, nodepath.resolve(args.resolveDir, args.path));
      return { path: `./${LAZY_CHUNKS_DIR}/${filename}`, external: true };
    });
  },
};

// Some lazy-chunk files load CSS at runtime via loadStyle(new URL('./x.css',
// import.meta.url)) instead of a static import - esbuild can't see/bundle
// that, so the referenced .css file is copied here as a flat sibling file
// to satisfy the relative URL once it's flattened into dist/lazy-chunks/.
const copyLazyChunkCss = (entryPoints) => {
  const destDir = nodepath.resolve(__dirname, 'dist', LAZY_CHUNKS_DIR);
  entryPoints.forEach((absPath) => {
    const source = fs.readFileSync(absPath, 'utf8');
    const re = /new URL\(['"](\.[^'"]+\.css)['"]/g;
    let match = re.exec(source);
    while (match) {
      const cssPath = nodepath.resolve(nodepath.dirname(absPath), match[1]);
      if (fs.existsSync(cssPath)) {
        fs.copyFileSync(cssPath, nodepath.join(destDir, nodepath.basename(cssPath)));
      } else {
        // eslint-disable-next-line no-console
        console.warn(`[build.mjs] lazy-chunk css not found, skipping: ${cssPath}`);
      }
      match = re.exec(source);
    }
  });
};

// Build all lazy entries together so esbuild owns their internal import
// paths and shares dependencies, including stateful modules.
// A missing/renamed source file is skipped with a warning rather than
// failing the build - these are optional/unreachable, so a stale list
// entry should only lose the optimization for that one file, not break CI.
const buildLazyChunkFiles = async () => {
  const entryPoints = [...resolvedLazyChunkFiles.values()].filter((absPath) => {
    if (fs.existsSync(absPath)) return true;
    // eslint-disable-next-line no-console
    console.warn(`[build.mjs] lazy-chunk file not found, skipping: ${absPath}`);
    return false;
  });
  if (!entryPoints.length) return;
  await esbuild.build({
    entryPoints,
    bundle: true,
    // Do not externalize nested imports here: esbuild must resolve them
    // to these same entries and generate paths relative to each output.
    splitting: true,
    format: 'esm',
    sourcemap: true,
    chunkNames: 'chunks/[name]-[hash]',
    outdir: `./dist/${LAZY_CHUNKS_DIR}/`,
    entryNames: '[name]', // flatten output - matches the ./lazy-chunks/<file>.js rewrite above
    plugins: [LitResolver],
  });
  copyLazyChunkCss(entryPoints);
};

// Keep core navigation in one bundle; matching feature imports stay external.
await esbuild.build({
  entryPoints: ['navigation.js'],
  bundle: true,
  splitting: false,
  format: 'esm',
  sourcemap: true,
  outdir: './dist/',
  define: { 'import.meta.standaloneNavBundle': 'true' },
  plugins: [LitResolver, StyleLoader, LazyChunkResolver],
});

await buildLazyChunkFiles();
