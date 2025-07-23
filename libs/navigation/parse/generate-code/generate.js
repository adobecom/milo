/* eslint no-console: 0 */
import { generate } from '@babel/generator';
import { extractDependencies } from '../ast/analyze-ast.js';
import { findParentNode, getNext, getNodeScope } from '../utils/utils.js';

/**
 * Regenerate JavaScript code from a function and its dependencies
 * @param {Object} node - The AST node to regenerate
 * @param {Object} tree - The full AST tree
 * @param {Object} options - Generation options
 * @returns {Object} Object containing the generated code and metadata
 */
const regenerateCode = (node, tree, options = {}) => {
  if (!node || !tree) return { code: '', dependencies: [], scopeUsage: [] };

  // Extract dependencies
  const dependencies = extractDependencies(node, tree);

  // Collect all nodes needed for regeneration
  const nodesToInclude = [];

  // Add the main function
  nodesToInclude.push(node);

  // Add scope usage declarations
  const scopeUsageNodes = new Set();
  dependencies.scopeUsage.forEach((usage) => {
    if (usage.declaration) {
      scopeUsageNodes.add(usage.declaration);
    }
  });

  // Find external dependencies in the scope
  const externalDependencyNodes = new Set();
  // const nodeScope = getNodeScope(node, tree);

  // if (nodeScope) {
  //   const findExternalDependencies = (scopeNode) => {
  //     if (!scopeNode || !scopeNode.type) return;

  //     switch (scopeNode.type) {
  //       case 'VariableDeclaration':
  //         scopeNode.declarations?.forEach((declarator) => {
  //           if (declarator.id?.type === 'Identifier' && dependencies.externalDependencies.includes(declarator.id.name)) {
  //             externalDependencyNodes.add(scopeNode);
  //           }
  //         });
  //         break;

  //       case 'FunctionDeclaration':
  //         if (scopeNode.id?.type === 'Identifier' && dependencies.externalDependencies.includes(scopeNode.id.name)) {
  //           externalDependencyNodes.add(scopeNode);
  //         }
  //         break;

  //       case 'ClassDeclaration':
  //         if (scopeNode.id?.type === 'Identifier' && dependencies.externalDependencies.includes(scopeNode.id.name)) {
  //           externalDependencyNodes.add(scopeNode);
  //         }
  //         break;

  //       case 'ImportSpecifier':
  //         if (scopeNode.local?.type === 'Identifier' && dependencies.externalDependencies.includes(scopeNode.local.name)) {
  //           // Find the parent ImportDeclaration
  //           const parent = findParentNode(scopeNode, nodeScope);
  //           if (parent && parent.type === 'ImportDeclaration') {
  //             externalDependencyNodes.add(parent);
  //           }
  //         }
  //         break;

  //       case 'ImportDefaultSpecifier':
  //         if (scopeNode.local?.type === 'Identifier' && dependencies.externalDependencies.includes(scopeNode.local.name)) {
  //           const parent = findParentNode(scopeNode, nodeScope);
  //           if (parent && parent.type === 'ImportDeclaration') {
  //             externalDependencyNodes.add(parent);
  //           }
  //         }
  //         break;

  //       case 'ImportNamespaceSpecifier':
  //         if (scopeNode.local?.type === 'Identifier' && dependencies.externalDependencies.includes(scopeNode.local.name)) {
  //           const parent = findParentNode(scopeNode, nodeScope);
  //           if (parent && parent.type === 'ImportDeclaration') {
  //             externalDependencyNodes.add(parent);
  //           }
  //         }
  //         break;

  //       default: {
  //         // Recursively check children
  //         const children = getNext(scopeNode);
  //         children.forEach((child) => {
  //           if (child) {
  //             findExternalDependencies(child);
  //           }
  //         });
  //         break;
  //       }
  //     }
  //   };

  //   findExternalDependencies(nodeScope);
  // }

  // Also search the entire tree for any declarations that match our external dependencies
  const searchEntireTree = (treeNode) => {
    if (!treeNode || !treeNode.type) return;

    // Check if this node declares any of our external dependencies
    switch (treeNode.type) {
      case 'VariableDeclaration':
        treeNode.declarations?.forEach((declarator) => {
          if (declarator.id?.type === 'Identifier' && dependencies.externalDependencies.includes(declarator.id.name)) {
            externalDependencyNodes.add(treeNode);
          }
        });
        break;

      case 'FunctionDeclaration':
        if (treeNode.id?.type === 'Identifier' && dependencies.externalDependencies.includes(treeNode.id.name)) {
          externalDependencyNodes.add(treeNode);
        }
        break;

      case 'ClassDeclaration':
        if (treeNode.id?.type === 'Identifier' && dependencies.externalDependencies.includes(treeNode.id.name)) {
          externalDependencyNodes.add(treeNode);
        }
        break;

      case 'ExportNamedDeclaration':
        if (treeNode.declaration?.type === 'VariableDeclaration') {
          treeNode.declarations?.forEach((declarator) => {
            if (declarator.id?.type === 'Identifier' && dependencies.externalDependencies.includes(declarator.id.name)) {
              externalDependencyNodes.add(treeNode);
            }
          });
        } else if (treeNode.declaration?.type === 'FunctionDeclaration'
                  && treeNode.declaration.id?.type === 'Identifier'
                  && dependencies.externalDependencies.includes(treeNode.declaration.id.name)) {
          externalDependencyNodes.add(treeNode);
        }
        break;
      default: break;
    }

    // Recursively search children
    const children = getNext(treeNode);
    children.forEach((child) => {
      if (child) {
        searchEntireTree(child);
      }
    });
  };

  // Search the entire tree for missing dependencies
  searchEntireTree(tree);

  // Add all collected nodes
  nodesToInclude.push(...scopeUsageNodes);
  nodesToInclude.push(...externalDependencyNodes);

  // Create a new AST with the collected nodes
  const newAst = {
    type: 'Program',
    body: nodesToInclude,
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
    includedNodes: nodesToInclude.length,
    metadata: {
      externalDependencies: dependencies.externalDependencies,
      scopeUsage: dependencies.scopeUsage,
      builtInMethodsUsed: dependencies.builtInMethodsUsed,
      builtInPropertiesUsed: dependencies.builtInPropertiesUsed,
    },
  };
};

export default regenerateCode;
