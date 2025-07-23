import { getNext } from '../utils/utils.js';

/**
 * Pure function to find all declarations in a scope
 * @param {Object} scopeNode - The scope node to analyze
 * @returns {Map} Map of declaration names to their nodes
 */
const findScopeDeclarations = (scopeNode) => {
  if (!scopeNode || !scopeNode.type) {
    return new Map();
  }

  const scopeDeclarations = new Map();

  const processNode = (currentNode) => {
    if (!currentNode || !currentNode.type) return;

    switch (currentNode.type) {
      case 'VariableDeclaration':
        currentNode.declarations?.forEach((declarator) => {
          if (declarator.id?.type === 'Identifier') {
            scopeDeclarations.set(declarator.id.name, declarator);
          }
        });
        break;

      case 'FunctionDeclaration':
        if (currentNode.id?.type === 'Identifier') {
          scopeDeclarations.set(currentNode.id.name, currentNode);
        }
        break;

      case 'ClassDeclaration':
        if (currentNode.id?.type === 'Identifier') {
          scopeDeclarations.set(currentNode.id.name, currentNode);
        }
        break;

      case 'ImportSpecifier':
        if (currentNode.local?.type === 'Identifier') {
          scopeDeclarations.set(currentNode.local.name, currentNode);
        }
        break;

      case 'ImportDefaultSpecifier':
        if (currentNode.local?.type === 'Identifier') {
          scopeDeclarations.set(currentNode.local.name, currentNode);
        }
        break;

      case 'ImportNamespaceSpecifier':
        if (currentNode.local?.type === 'Identifier') {
          scopeDeclarations.set(currentNode.local.name, currentNode);
        }
        break;

      case 'Parameter':
        if (currentNode.name?.type === 'Identifier') {
          scopeDeclarations.set(currentNode.name.name, currentNode);
        }
        break;

      default: {
        // Recursively check children
        const children = getNext(currentNode);
        children.forEach((child) => {
          if (child) {
            processNode(child);
          }
        });
        break;
      }
    }
  };

  processNode(scopeNode);
  return scopeDeclarations;
};

export default findScopeDeclarations;
