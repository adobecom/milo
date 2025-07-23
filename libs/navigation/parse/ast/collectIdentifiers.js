import { getNext } from '../utils/utils.js';

/**
 * Pure function to collect identifiers from a node
 * @param {Object} currentNode - The AST node to analyze
 * @param {boolean} isDeclaration - Whether we're in a declaration context
 * @returns {Object} Object with used and declared identifier sets
 */
export default function collectIdentifiers(currentNode, isDeclaration = false) {
  if (!currentNode || !currentNode.type) {
    return { used: new Set(), declared: new Set() };
  }

  const result = { used: new Set(), declared: new Set() };

  switch (currentNode.type) {
    case 'Identifier':
      if (isDeclaration) {
        result.declared.add(currentNode.name);
      } else {
        result.used.add(currentNode.name);
      }
      break;

    case 'MemberExpression': {
      // Handle property access like GeoMap[geo] or obj.prop
      const objectResult = collectIdentifiers(currentNode.object, isDeclaration);
      const propertyResult = collectIdentifiers(currentNode.property, isDeclaration);
      result.used = new Set([...result.used, ...objectResult.used, ...propertyResult.used]);
      result.declared = new Set([
        ...result.declared,
        ...objectResult.declared,
        ...propertyResult.declared,
      ]);
      break;
    }

    case 'VariableDeclaration':
      currentNode.declarations?.forEach((declarator) => {
        if (declarator.id?.type === 'Identifier') {
          result.declared.add(declarator.id.name);
        } else if (declarator.id?.type === 'ObjectPattern') {
          declarator.id.properties?.forEach((prop) => {
            if (prop.value?.type === 'Identifier') {
              result.declared.add(prop.value.name);
            }
          });
        } else if (declarator.id?.type === 'ArrayPattern') {
          declarator.id.elements?.forEach((element) => {
            if (element?.type === 'Identifier') {
              result.declared.add(element.name);
            }
          });
        }
        // Also process the init expression to find used identifiers
        if (declarator.init) {
          const initResult = collectIdentifiers(declarator.init, isDeclaration);
          result.used = new Set([...result.used, ...initResult.used]);
          result.declared = new Set([...result.declared, ...initResult.declared]);
        }
      });
      break;

    case 'FunctionDeclaration':
      if (currentNode.id?.type === 'Identifier') {
        result.declared.add(currentNode.id.name);
      }
      break;

    case 'ClassDeclaration':
      if (currentNode.id?.type === 'Identifier') {
        result.declared.add(currentNode.id.name);
      }
      break;

    case 'Parameter':
      if (currentNode.name?.type === 'Identifier') {
        result.declared.add(currentNode.name.name);
      }
      break;

    case 'ImportSpecifier':
      if (currentNode.local?.type === 'Identifier') {
        result.declared.add(currentNode.local.name);
      }
      break;

    case 'ImportDefaultSpecifier':
      if (currentNode.local?.type === 'Identifier') {
        result.declared.add(currentNode.local.name);
      }
      break;

    case 'ImportNamespaceSpecifier':
      if (currentNode.local?.type === 'Identifier') {
        result.declared.add(currentNode.local.name);
      }
      break;

    case 'ObjectProperty':
      if (currentNode.key?.type === 'Identifier' && currentNode.computed === false) {
        // For object properties like { key: value }, key is not a variable declaration
        const valueResult = collectIdentifiers(currentNode.value, isDeclaration);
        result.used = new Set([...result.used, ...valueResult.used]);
        result.declared = new Set([...result.declared, ...valueResult.declared]);
      } else {
        const keyResult = collectIdentifiers(currentNode.key, isDeclaration);
        const valueResult = collectIdentifiers(currentNode.value, isDeclaration);
        result.used = new Set([...result.used, ...keyResult.used, ...valueResult.used]);
        result.declared = new Set([
          ...result.declared,
          ...keyResult.declared,
          ...valueResult.declared,
        ]);
      }
      break;

    case 'AssignmentPattern': {
      const leftResult = collectIdentifiers(currentNode.left, true); // left is the declaration
      const rightResult = collectIdentifiers(currentNode.right, isDeclaration);
      result.used = new Set([...result.used, ...leftResult.used, ...rightResult.used]);
      result.declared = new Set([
        ...result.declared,
        ...leftResult.declared,
        ...rightResult.declared,
      ]);
      break;
    }

    case 'RestElement': {
      const restResult = collectIdentifiers(currentNode.argument, isDeclaration);
      result.used = new Set([...result.used, ...restResult.used]);
      result.declared = new Set([...result.declared, ...restResult.declared]);
      break;
    }

    case 'SpreadElement': {
      const spreadResult = collectIdentifiers(currentNode.argument, isDeclaration);
      result.used = new Set([...result.used, ...spreadResult.used]);
      result.declared = new Set([...result.declared, ...spreadResult.declared]);
      break;
    }

    case 'CatchClause':
      if (currentNode.param?.type === 'Identifier') {
        result.declared.add(currentNode.param.name);
      }
      break;

    default: {
      // For all other node types, recursively process children
      const children = getNext(currentNode);
      children.forEach((child) => {
        if (child) {
          const childResult = collectIdentifiers(child, isDeclaration);
          result.used = new Set([...result.used, ...childResult.used]);
          result.declared = new Set([...result.declared, ...childResult.declared]);
        }
      });
      break;
    }
  }

  return result;
}
