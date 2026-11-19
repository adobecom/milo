// ESLint `overrides[].rules` replace a rule's options rather than merging them,
// so any override that re-declares `no-restricted-syntax` must spread these back
// in or it silently repeals them for the files it targets.
// The leaf functions that must only ever be reached through
// libs/blocks/caas/collectionIdentity.js, which supplies the section list.
const RESTRICTED_LEAF_FNS = ['toIdentityUrl', 'isIdentityPolicyMiss', 'isExtensionlessSection'];

const LEAF_DIRECT_MSG = 'Import toCollectionIdentityUrl/isCollectionIdentityPolicyMiss from libs/blocks/caas/collectionIdentity.js instead. The leaf defaults `sections` to [], so calling it directly applies the forced-.html flag WITHOUT the per-site extensionless-section list that qualifies it -- which silently drops every card in an exempt section out of its collection.';

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
      // The identity POLICY is pure and shared; the extensionless-section list
      // that qualifies it is per-site CONFIGURATION, and on the rendering side
      // that configuration lives in page metadata. collectionIdentity.js is the
      // single place that binds the two together, which is why its wrappers
      // take the raw page flag rather than a resolved boolean -- there is no
      // signature that applies the flag while skipping its qualifier.
      //
      // That guarantee is structural only while this stays the single door.
      // The leaf's functions default `sections` to [], so a new consumer call
      // site writing `toIdentityUrl(url, htmlIdentityEnabled())` would compile,
      // lint and test clean while silently forcing `.html` onto every exempt
      // section -- dropping those cards out of live collections with nothing
      // logged. Enforced here rather than left to a comment a future edit can
      // read past. tools/** is deliberately unaffected: each publisher resolves
      // its own configuration from a source that has no DOM.
      files: ['libs/**/*.js'],
      excludedFiles: ['libs/blocks/caas/collectionIdentity.js', 'libs/utils/caasIdentity.js'],
      rules: {
        // Two rules, because neither covers the other's case -- the same
        // asymmetry the bundle-leaf guard above documents.
        //
        // `paths` matches the specifier STRING, so it only ever covers the
        // depths listed here; a file one directory deeper writes
        // `../../../utils/caasIdentity.js` and lints clean. Verified: a probe
        // at libs/features/mep/mep-next/ was NOT caught by paths alone. It is
        // kept because it is the only one of the two that also covers
        // `export ... from` re-exports.
        'no-restricted-imports': ['error', {
          paths: [{
            name: '../../utils/caasIdentity.js',
            importNames: RESTRICTED_LEAF_FNS,
            message: LEAF_DIRECT_MSG,
          }, {
            name: '../utils/caasIdentity.js',
            importNames: RESTRICTED_LEAF_FNS,
            message: LEAF_DIRECT_MSG,
          }, {
            name: './caasIdentity.js',
            importNames: RESTRICTED_LEAF_FNS,
            message: LEAF_DIRECT_MSG,
          }],
        }],
        // ...so the depth-agnostic half is a selector matching the specifier
        // by suffix. `patterns` + `importNames` would be the obvious answer
        // but is not supported on this repo's eslint 8.11 -- it aborts with a
        // schema error. RESTRICTED_SYNTAX is spread back in because listing
        // this rule here would otherwise repeal the repo-wide selectors.
        'no-restricted-syntax': [
          'error',
          ...RESTRICTED_SYNTAX,
          {
            selector: `ImportDeclaration[source.value=/caasIdentity\\.js$/] ImportSpecifier[imported.name=/^(${RESTRICTED_LEAF_FNS.join('|')})$/]`,
            message: LEAF_DIRECT_MSG,
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
