import { build } from 'esbuild';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

// Get the current commit hash
const commitHash = execSync('git rev-parse HEAD').toString().trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
console.log(`you're building from branch ${branch} with commit ${commitHash}`);
const params = process.argv.slice(2);
const outfolder = params.includes('milo') ? '../../../../libs/deps/' : '../libs';

const { metafile } = await build({
    alias: {
        react: '../mocks/react.js',
    },
    bundle: true,
    entryPoints: ['./src/index.js'],
    format: 'esm',
    metafile: true,
    minify: true,
    outfile: `${outfolder}/commerce.js`,
    platform: 'browser',
    sourcemap: true,
    target: ['es2020'],
});

fs.writeFileSync('stats.json', JSON.stringify(metafile));
