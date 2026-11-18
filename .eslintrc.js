// ESLint `overrides[].rules` replace a rule's options rather than merging them,
// so any override that re-declares `no-restricted-syntax` must spread these back
// in or it silently repeals them for the files it targets.
const BUNDLE_LEAF_MSG = 'caasIdentity.js must stay dependency-free: it is bundled for the milo-caas poller. Keep it pure string logic.';

const RESTRICTED_SYNTAX = [
  {
    selector: 'ForInStatement',
    message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
  },
  {
    selector: 'LabeledStatement',
    message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
  },
  {
    selector: 'WithStatement',
    message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
  },
];

module.exports = {
  root: true,
  extends: ['airbnb-base', 'plugin:react-hooks/recommended', 'plugin:compat/recommended', 'plugin:ecmalist/recommended'],
  settings: { es: { aggressive: true } },
  env: { browser: true, mocha: true },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'chai-friendly/no-unused-expressions': 2,
    'import/extensions': ['error', { js: 'always' }],
    'import/no-cycle': 0,
    'linebreak-style': ['error', 'unix'],
    'no-await-in-loop': 0,
    'no-param-reassign': [2, { props: false }],
    'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX],
    'no-return-assign': ['error', 'except-parens'],
    'no-unused-expressions': 0,
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 6 },
      ObjectPattern: { multiline: true, minProperties: 6 },
      ImportDeclaration: { multiline: true, minProperties: 6 },
      ExportDeclaration: { multiline: true, minProperties: 6 },
    }],
  },
  overrides: [
    {
      // caasIdentity.js is imported by tools/send-to-caas/caas-payload-core.js,
      // which microbundle compiles into the caas-payload-builder.js artifact the
      // milo-caas poller runs. Any import this leaf gains is silently pulled into
      // that bundle (or breaks it, for anything browser-only), so the
      // dependency-free rule is enforced here rather than left to a header
      // comment that a future edit can read past.
      //
      // no-restricted-imports rather than a no-restricted-syntax selector: it
      // covers `import`, dynamic `import()` AND `export ... from` in one rule.
      // Selectors on ImportDeclaration/ImportExpression miss re-exports, which
      // are ExportNamedDeclaration/ExportAllDeclaration nodes with a source --
      // and a re-export creates exactly the bundle dependency this forbids.
      files: ['libs/utils/caasIdentity.js'],
      rules: {
        // no-restricted-imports covers `import` and `export ... from`; a
        // selector on ImportDeclaration alone misses re-exports, which are
        // ExportNamedDeclaration/ExportAllDeclaration nodes with a source.
        'no-restricted-imports': ['error', {
          patterns: [{
            group: ['*'],
            message: BUNDLE_LEAF_MSG,
          }],
        }],
        // ...but no-restricted-imports does NOT match dynamic `import()`, which
        // would pull a chunk into the bundle just as surely. Verified by
        // mutation: with only the rule above, `() => import('./getUuid.js')`
        // lints clean. RESTRICTED_SYNTAX is spread back in because listing this
        // rule here would otherwise repeal the three repo-wide selectors.
        'no-restricted-syntax': [
          'error',
          ...RESTRICTED_SYNTAX,
          { selector: 'ImportExpression', message: BUNDLE_LEAF_MSG },
        ],
      },
    },
    {
      files: ['test/**/*.js'],
      rules: { 'no-console': 0 },
    },
    {
      // Override for nala test
      files: ['nala/**/*.js', 'nala/**/*.test.js'],
      rules: {
        'no-console': 0,
        'import/no-extraneous-dependencies': 0,
        'max-len': 0,
        'chai-friendly/no-unused-expressions': 0,
        'no-plusplus': 0,
      },
    },
  ],
  ignorePatterns: [
    '/libs/deps/*',
    '/tools/loc/*',
    '/tools/send-to-caas/caas-payload-builder.js',
    '/libs/features/spectrum-web-components/*',
    '/libs/navigation/dist/*',
    '/libs/mep/ace1209/globe-gallery/three.module.min.js',
    '/libs/mep/ace1209/globe-gallery/src/three-src.js',
  ],
  plugins: [
    'chai-friendly',
  ],
};
