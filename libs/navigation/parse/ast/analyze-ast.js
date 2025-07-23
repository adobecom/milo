/* eslint no-console: 0 */
import {
  BUILT_IN_METHODS,
  BUILT_IN_PROPERTIES,
} from '../utils/constants.js';
import collectIdentifiers from './collectIdentifiers.js';
import findScopeDeclarations from './findScopeDeclarations.js';
import { getNodeScope } from '../utils/utils.js';

/**
 * Extract dependencies from a given node
 * @param {Object} node - The AST node to analyze
 * @param {Object} tree - The full AST tree
 * @returns {Object} Object containing external dependencies and scope usage
 */
const extractDependencies = (node, tree) => {
  if (!node || !tree) return { externalDependencies: [], scopeUsage: [] };

  // Get the scope of the node
  const nodeScope = getNodeScope(node, tree);
  if (!nodeScope) return { externalDependencies: [], scopeUsage: [] };

  // Collect all identifiers from the target node
  const nodeIdentifiers = collectIdentifiers(node);
  const usedIdentifiers = nodeIdentifiers.used;
  const declaredIdentifiers = nodeIdentifiers.declared;

  // If this is a function, also analyze its body
  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
    if (node.body) {
      const bodyIdentifiers = collectIdentifiers(node.body);
      // Merge the results
      bodyIdentifiers.used.forEach((identifier) => usedIdentifiers.add(identifier));
      bodyIdentifiers.declared.forEach((identifier) => declaredIdentifiers.add(identifier));
    }
  }

  // Find all declarations in the scope
  const scopeDeclarations = findScopeDeclarations(nodeScope);

  // Find external dependencies (used but not declared in scope)
  const externalDependencies = Array.from(usedIdentifiers).filter(
    (identifier) => !declaredIdentifiers.has(identifier) && !scopeDeclarations.has(identifier),
  );

  // Filter out common built-in methods and properties that are not true dependencies
  const builtInMethods = new Set([...BUILT_IN_METHODS]);
  const builtInProperties = new Set([...BUILT_IN_PROPERTIES]);

  // Don't filter out identifiers that might be user-defined constants/variables
  // Only filter out known built-ins
  const trueExternalDependencies = externalDependencies.filter(
    (identifier) => !builtInMethods.has(identifier) && !builtInProperties.has(identifier),
  );

  // Find scope usage (identifiers that are declared in scope and used in the node)
  const scopeUsage = Array.from(usedIdentifiers)
    .filter((identifier) => scopeDeclarations.has(identifier))
    .map((identifier) => ({
      name: identifier,
      declaration: scopeDeclarations.get(identifier),
    }));

  return {
    externalDependencies: trueExternalDependencies,
    scopeUsage,
    usedIdentifiers: Array.from(usedIdentifiers),
    declaredIdentifiers: Array.from(declaredIdentifiers),
    scopeDeclarations: Array.from(scopeDeclarations.keys()),
    // Additional information for debugging
    rawExternalDependencies: externalDependencies,
    builtInMethodsUsed: externalDependencies.filter((id) => builtInMethods.has(id)),
    builtInPropertiesUsed: externalDependencies.filter((id) => builtInProperties.has(id)),
  };
};

export {
  getNodeScope,
  extractDependencies,
};
