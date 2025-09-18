import { writeFileSync, readFileSync } from 'node:fs';
import { build } from 'esbuild';

const outfolder = '../../deps/mas';

const defaults = {
    bundle: true,
    format: 'esm',
    minify: !process.argv.includes('no-minify'),
    sourcemap: process.argv.includes('sourcemap'),
    platform: 'browser',
    target: ['es2020'],
};

// Read the price-literals.js file content
const priceLiteralsContent = readFileSync('./price-literals.json', 'utf-8');

// commerce.js
const { metafile } = await build({
    ...defaults,
    alias: {
        react: 'test/mocks/react.js',
    },
    entryPoints: ['./src/commerce.js'],
    outfile: `${outfolder}/commerce.js`,
    metafile: true,
    platform: 'browser',
    banner: {
        js: `window.masPriceLiterals = ${priceLiteralsContent}.data;`,
    },
});
writeFileSync(`commerce.json`, JSON.stringify(metafile));

// mas.js
await build({
    ...defaults,
    entryPoints: ['./src/mas.js'],
    outfile: './dist/mas.js',
    plugins: [],
    banner: {
        js: `window.masPriceLiterals = ${priceLiteralsContent}.data;`,
    },
});

// web components
Promise.all([
    build({
        ...defaults,
        stdin: { contents: '' },
        inject: ['./src/merch-offer.js', './src/merch-offer-select.js'],
        outfile: `${outfolder}/merch-offer-select.js`,
        plugins: [rewriteImports()],
    }),
    build({
        ...defaults,
        entryPoints: ['./src/merch-card-collection.js'],
        plugins: [rewriteImports()],
        outfile: `${outfolder}/merch-card-collection.js`,
    }),
    build({
        ...defaults,
        entryPoints: ['./src/sidenav/merch-sidenav.js'],
        outfile: `${outfolder}/merch-sidenav.js`,
        plugins: [rewriteImportsToLibsFolder()],
        external: ['lit'],
    }),
    buildLitComponent('merch-card'),
    buildLitComponent('merch-icon'),
    buildLitComponent('merch-quantity-select'),
    buildLitComponent('merch-secure-transaction'),
    buildLitComponent('merch-stock'),
    buildLitComponent('merch-whats-included'),
    buildLitComponent('merch-mnemonic-list'),
    buildLitComponent('mas-mnemonic'),
]).catch(() => process.exit(1));

function rewriteImports() {
    return {
        name: 'rewrite-imports',
        setup(build) {
            build.onResolve({ filter: /^lit(\/.*)?$/ }, () => {
                return {
                    path: '../lit-all.min.js',
                    external: true,
                };
            });
        },
    };
}

async function buildLitComponent(name) {
    const { metafile } = await build({
        ...defaults,
        entryPoints: [`./src/${name}.js`],
        external: ['lit'],
        metafile: true,
        outfile: `${outfolder}/${name}.js`,
        plugins: [rewriteImports()],
    });
    writeFileSync(`${outfolder}/${name}.json`, JSON.stringify(metafile));
}

function rewriteImportsToLibsFolder() {
    return {
        name: 'rewrite-imports-to-libs-folder',
        setup(build) {
            build.onResolve({ filter: /^lit(\/.*)?$/ }, () => {
                return {
                    path: '/libs/deps/lit-all.min.js',
                    external: true,
                };
            });
        },
    };
}
