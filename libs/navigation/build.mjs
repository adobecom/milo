import * as esbuild from 'esbuild'; // eslint-disable-line
import fs from 'node:fs';
import nodepath from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = nodepath.dirname(fileURLToPath(import.meta.url)); // eslint-disable-line

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
const deadWeightFilenames = [
  'preflight-notification.js',
  'region-modal.js',
  'georoutingv2.js',
  'mep-overlay.js',
  'mep-overlay-highlight.js',
  'preview.js',
  'jsonld-graph-manager.js',
  'scroll-animations.js',
  'jarvis-chat.js',
  'google-login.js',
  'block-notifications.js',
  'automated-aria.js',
  'interlinks.js',
  'samplerum.js',
];

const DEAD_WEIGHT_DIR = 'dead-weight';
// filename -> absolute source path, filled in as the resolver matches imports
const resolvedDeadWeightFiles = new Map();

// Marking these external alone isn't enough: npm only ships dist/, so the
// original relative path (e.g. ../features/google-login.js) won't exist for
// consumers. Rewrite to a flat ./dead-weight/<file>.js path instead, and
// copy the real file there after the build (see copyDeadWeightFile below).
const DeadWeightResolver = {
  name: 'dead-weight-resolver',
  setup({ onResolve }) {
    onResolve({ filter: /.*/ }, (args) => {
      const filename = deadWeightFilenames.find((f) => args.path.endsWith(f));
      if (!filename) return null;
      resolvedDeadWeightFiles.set(filename, nodepath.resolve(args.resolveDir, args.path));
      return { path: `./${DEAD_WEIGHT_DIR}/${filename}`, external: true };
    });
  },
};

// Some dead-weight files load CSS at runtime via loadStyle(new URL('./x.css',
// import.meta.url)) instead of a static import - esbuild can't see/bundle
// that, so the referenced .css file is copied here as a flat sibling file
// to satisfy the relative URL once it's flattened into dist/dead-weight/.
const copyDeadWeightCss = (entryPoints) => {
  const destDir = nodepath.resolve(__dirname, 'dist', DEAD_WEIGHT_DIR);
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
        console.warn(`[build.mjs] dead-weight css not found, skipping: ${cssPath}`);
      }
      match = re.exec(source);
    }
  });
};

// Each dead-weight file is bundled (not just copied) into dist/dead-weight/
// via its own esbuild entry point - this inlines its own imports for real,
// instead of leaving relative import statements that would point at the
// wrong place once flattened out of the monorepo's folder structure.
// A missing/renamed source file is skipped with a warning rather than
// failing the build - these are optional/unreachable, so a stale list
// entry should only lose the optimization for that one file, not break CI.
const buildDeadWeightFiles = async () => {
  const entryPoints = [...resolvedDeadWeightFiles.values()].filter((absPath) => {
    if (fs.existsSync(absPath)) return true;
    // eslint-disable-next-line no-console
    console.warn(`[build.mjs] dead-weight file not found, skipping: ${absPath}`);
    return false;
  });
  if (!entryPoints.length) return;
  await esbuild.build({
    entryPoints,
    bundle: true,
    splitting: false,
    format: 'esm',
    sourcemap: true,
    outdir: `./dist/${DEAD_WEIGHT_DIR}/`,
    entryNames: '[name]', // flatten output - matches the ./dead-weight/<file>.js rewrite above
    plugins: [LitResolver],
  });
  copyDeadWeightCss(entryPoints);
};

// Disabling splitting collapses gnav's ~15+ dynamic-import chunks into one
// file, avoiding extra sequential network hops when re-bundled by a
// consumer (e.g. webpack). import() calls still resolve lazily.
//
// NOTE: still inlines spectrum-web-components/theme.js (~367KB, only
// needed for the 3-in-1 merch modal). Externalizing/lazy-loading it can be
// looked into separately - deferred for now to measure this change alone.
//
// A bundle-size-growth warning (comparing navigation.js against a stored
// baseline, to flag newly-inlined deadWeightFilenames candidates) was
// prototyped and removed for simplicity - can be looked into separately.
await esbuild.build({
  entryPoints: ['navigation.js'],
  bundle: true,
  splitting: false,
  format: 'esm',
  sourcemap: true,
  outdir: './dist/',
  plugins: [LitResolver, StyleLoader, DeadWeightResolver],
});

await buildDeadWeightFiles();
