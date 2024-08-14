import { build } from 'esbuild';
import fs from 'node:fs';

const defaults = {
    alias: {
        react: '../mocks/react.js',
    },
    bundle: true,
    format: 'esm',
    metafile: true,
    sourcemap: true,
    minify: true,
    platform: 'browser',
    target: ['es2020'],
    external: [],
};

let { metafile } = await build({
    ...defaults,
    entryPoints: ['./src/mas.js'],
    outfile: '../../../deps/mas/mas.js',
});
fs.writeFileSync('mas.json', JSON.stringify(metafile));

({ metafile } = await build({
    ...defaults,
    entryPoints: ['./src/mas.min.js'],
    outfile: '../../../deps/mas/mas.min.js',
}));
fs.writeFileSync('mas.min.json', JSON.stringify(metafile));
