import * as esbuild from 'esbuild'; // eslint-disable-line
import fs from 'node:fs';

fs.rmSync('./dist/', { recursive: true, force: true });

await esbuild.build({
  entryPoints: ['navigation.js'],
  bundle: true,
  splitting: true,
  format: 'esm',
  sourcemap: true,
  outdir: './dist/',
});

await esbuild.build({
  entryPoints: ['navigation.css', 'footer.css', 'dark-nav.css', 'base.css'],
  bundle: true,
  minify: true,
  outdir: './dist/',
});
