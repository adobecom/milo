module.exports = {
  root: false,
  extends: '../../../.eslintrc.js',
  settings: { 'import/resolver': { node: { moduleDirectory: ['node_modules', 'src/'] } } },
};
