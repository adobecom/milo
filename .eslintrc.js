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
    'no-restricted-syntax': [
      'error',
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
    ],
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
      files: ['libs/utils/caasIdentity.js'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'ImportDeclaration',
            message: 'caasIdentity.js must stay dependency-free: it is bundled for the milo-caas poller. Keep it pure string logic.',
          },
          {
            selector: 'ImportExpression',
            message: 'caasIdentity.js must stay dependency-free: it is bundled for the milo-caas poller. Keep it pure string logic.',
          },
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
