import * as esbuild from 'esbuild'; // eslint-disable-line
import fs from 'node:fs';
import extractFunction from './parse/parse.js';

fs.rmSync('./dist/', { recursive: true, force: true });

await esbuild.build({
  entryPoints: ['navigation.css', 'footer.css', 'dark-nav.css', 'base.css'],
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

// Custom plugin that intercepts merch.js imports and extracts only the needed function
// We do this because regular build tools can't verify the import is sideEffect free,
// but we know that the import is pure. So this custom tool extracts the function
// we need along with its dependencies.
const MerchInterceptor = {
  name: 'merch-interceptor',
  setup({ onResolve, onLoad }) {
    onResolve({ filter: /merch\.js$/ }, (args) => {
      // Only intercept if the importer is global-navigation.js
      if (args.importer && args.importer.includes('global-navigation.js')) {
        console.log('Merch interceptor activated! Intercepting import from:', args.importer);
        return { path: args.path, namespace: 'merch' };
      }
      // For other files, let esbuild handle the import normally
      return undefined;
    });

    // Provide parsed implementation when merch.js is imported
    onLoad({ filter: /.*/, namespace: 'merch' }, () => {
      console.log('Providing parsed merch.js implementation');

      // Parse the getMiloLocaleSettings function from the actual merch.js file
      const merchFilePath = '../blocks/merch/merch.js';
      const parsedCode = extractFunction('getMiloLocaleSettings', merchFilePath);
      return {
        contents: `
          ${parsedCode}

          export { getMiloLocaleSettings };
        `,
        loader: 'js',
      };
    });
  },
};

await esbuild.build({
  entryPoints: ['navigation.js'],
  bundle: true,
  splitting: true,
  format: 'esm',
  sourcemap: true,
  outdir: './dist/',
  plugins: [StyleLoader, MerchInterceptor],
});
