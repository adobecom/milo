import { build } from 'esbuild';
import fs from 'node:fs';

const { metafile } = await build({
    alias: {
        react: '../mocks/react.js',
    },
    bundle: true,
    entryPoints: ['./src/mas.js'],
    format: 'esm',
    metafile: true,
    minify: true,
    sourcemap: true,
    outfile: '../../../../libs/deps/mas/mas.js',
    platform: 'browser',
    target: ['es2020'],
});
fs.writeFileSync('stats.json', JSON.stringify(metafile));
