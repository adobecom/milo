import { writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const outfolder = '../../../../libs/deps/mas';

async function buildLitComponent(name) {
    const { metafile } = await build({
        bundle: true,
        entryPoints: [`./src/${name}.js`],
        external: ['lit'],
        format: 'esm',
        metafile: true,
        minify: true,
        platform: 'browser',
        outfile: `${outfolder}/${name}.js`,
        plugins: [rewriteImports()],
        sourcemap: true,
    });

    writeFileSync(`../../../../libs/deps/mas/${name}.json`, JSON.stringify(metafile));
}

Promise.all([
    build({
        bundle: true,
        stdin: { contents: '' },
        inject: [
            './src/merch-card.js',
            './src/merch-icon.js',
        ],
        format: 'esm',
        minify: true,
        outfile: `${outfolder}/merch-card.js`,
        sourcemap: true,
        plugins: [rewriteImports()],
    }),
    build({
        bundle: true,
        stdin: { contents: '' },
        inject: ['./src/merch-offer.js', './src/merch-offer-select.js'],
        format: 'esm',
        minify: true,
        outfile: `${outfolder}/merch-offer-select.js`,
        sourcemap: true,
        plugins: [rewriteImports()],
    }),
    build({
        bundle: true,
        entryPoints: ['./src/merch-card-collection.js'],
        format: 'esm',
        minify: true,
        plugins: [rewriteImports()],
        sourcemap: true,
        outfile: `${outfolder}/merch-card-collection.js`,
    }),
    build({
        entryPoints: ['./src/sidenav/merch-sidenav.js'],
        bundle: true,
        minify: true,
        outfile: `${outfolder}/merch-sidenav.js`,
        format: 'esm',
        plugins: [rewriteImports()],
        external: ['lit'],
    }),
    buildLitComponent('merch-icon'),
    buildLitComponent('merch-quantity-select'),
    buildLitComponent('merch-secure-transaction'),
    buildLitComponent('merch-stock'),
    buildLitComponent('merch-subscription-panel'),
    buildLitComponent('merch-twp-d2p'),
    buildLitComponent('merch-whats-included'),
    buildLitComponent('merch-mnemonic-list'),
    buildLitComponent('merch-datasource'),
]).catch(() => process.exit(1));

function rewriteImports(rew) {
    return {
        name: 'rewrite-imports',
        setup(build) {
            build.onResolve({ filter: /^lit(\/.*)?$/ }, (args) => {
                return {
                    path: '../lit-all.min.js',
                    external: true,
                };
            });
        },
    };
}
