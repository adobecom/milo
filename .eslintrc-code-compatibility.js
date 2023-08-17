module.exports = {
  root: true,
  extends: ['plugin:compat/recommended', 'plugin:ecmalist/recommended'],
  settings: { es: { aggressive: true } },
  env: { browser: true, mocha: true },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: [
      "eslint-plugin-import",
  ],
  ignorePatterns: [
    '/libs/deps/*',
    '/tools/loc/*',
  ],
};
