import { build } from 'esbuild';
import fs from 'node:fs';

const { metafile } = await build({
    alias: {
        react: '../mocks/react.js',
    },
    bundle: true,
    entryPoints: ['./src/index.js'],
    format: 'esm',
    metafile: true,
    minify: true,
    outfile: '../../../../libs/deps/mas/commerce.js',
    platform: 'browser',
    sourcemap: true,
    target: ['es2020'],
});

fs.writeFileSync('stats.json', JSON.stringify(metafile));
