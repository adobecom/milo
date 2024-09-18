import { writeFileSync } from 'node:fs';
import { build } from 'esbuild';
import { exec } from 'child_process';


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
        // sourcemap: true,
    });

    writeFileSync(`${outfolder}/${name}.json`, JSON.stringify(metafile));
}

async function generateDoc() {
  return exec(`wca analyze .. --features event --visibility public --outFile ${outfolder}/doc.md`);
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
        outfile: `${outfolder}/merch-card-collection.js`,
    }),
    build({
        entryPoints: ['./src/sidenav/merch-sidenav.js'],
        bundle: true,
        minify: true,
        outfile: `${outfolder}/merch-sidenav.js`,
        format: 'esm',
        plugins: [rewriteImportsToLibsFolder()],
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
    generateDoc(),
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

function rewriteImportsToLibsFolder(rew) {
  return {
      name: 'rewrite-imports-to-libs-folder',
      setup(build) {
          build.onResolve({ filter: /^lit(\/.*)?$/ }, (args) => {
              return {
                  path: '/libs/deps/lit-all.min.js',
                  external: true,
              };
          });
      },
  };
}
