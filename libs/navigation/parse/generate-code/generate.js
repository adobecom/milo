/* eslint no-console: 0 */
import { generate } from '@babel/generator';
import { extractDependencies } from '../ast/analyze-ast.js';

/**
 * Regenerate JavaScript code from a function and its dependencies
 * @param {Object} node - The AST node to regenerate
 * @param {Object} tree - The full AST tree
 * @param {Object} options - Generation options
 * @returns {Object} Object containing the generated code and metadata
 */
const findExternalDependencies = (node, tree) => {
  const dependencies = extractDependencies(node, tree);
  const { scopeUsage } = dependencies;

  const nodes = Object.values(scopeUsage)
    .map(({ declaration }) => {
      if (declaration.type === 'FunctionDeclaration') {
        return new Set([declaration, ...findExternalDependencies(declaration, tree)]);
      }
      return new Set([declaration]);
    })
    .reduce((acc, x) => acc.union(x), new Set());
  return nodes;
};

const regenerateCode = (node, tree, options = {}) => {
  if (!node || !tree) return { code: '', dependencies: [], scopeUsage: [] };

  const dependencies = extractDependencies(node, tree);

  const externalDependencyNodes = findExternalDependencies(node, tree);

  const newAst = {
    type: 'Program',
    body: [node, ...externalDependencyNodes].map((n) => {
      if (n.type !== 'VariableDeclarator') return n;
      return {
        type: 'VariableDeclaration',
        declarations: [n],
        kind: 'const',
      };
    }),
    sourceType: 'module',
    directives: [],
  };

  // Generate code
  const generationOptions = {
    comments: true,
    retainLines: false,
    compact: false,
    minified: false,
    ...options,
  };

  const result = generate(newAst, generationOptions);

  return {
    code: result.code,
    dependencies: dependencies.externalDependencies,
    scopeUsage: dependencies.scopeUsage.map((item) => item.name),
    allUsedIdentifiers: dependencies.usedIdentifiers,
    declaredIdentifiers: dependencies.declaredIdentifiers,
    metadata: {
      externalDependencies: dependencies.externalDependencies,
      scopeUsage: dependencies.scopeUsage,
      builtInMethodsUsed: dependencies.builtInMethodsUsed,
      builtInPropertiesUsed: dependencies.builtInPropertiesUsed,
    },
  };
};

export default regenerateCode;
