import { COMMON_AST_PROPERTIES, FUNCTION_NODE_TYPES, SCOPE_CONTAINER_TYPES } from './constants.js';

/**
 * Breadth-first search implementation for AST traversal
 * @param {Object} tree - The AST tree to traverse
 * @param {Function} next - Function to get children of a node
 * @param {Function} predicate - Function to test if a node matches criteria
 * @returns {Object|null} The first node that matches the predicate, or null
 */
export const bfs = (tree, next, predicate) => {
  const go = (tr, q, visited) => {
    if (q.length === 0) return null;
    const [head, ...tail] = q;
    if (visited.has(head)) return go(tr, tail, visited);
    if (predicate(head)) return head;
    visited.add(head);
    const children = next(head);
    return go(tr, [...tail, ...children], visited);
  };
  return go(tree, [tree], new Set());
};

/**
 * Get the next nodes in the AST traversal based on node type
 * @param {Object} n - The current AST node
 * @returns {Array} Array of child nodes
 */
export const getNext = (n) => {
  if (!n || !n.type) return [];

  switch (n.type) {
    // Program and module
    case 'Program':
      return n.body || [];
    case 'Module':
      return n.body || [];

    // Function declarations and expressions
    case 'FunctionDeclaration':
      return [n.id, n.params, n.body, n.generator, n.async].filter(Boolean);
    case 'FunctionExpression':
      return [n.id, n.params, n.body, n.generator, n.async].filter(Boolean);
    case 'ArrowFunctionExpression':
      return [n.params, n.body, n.generator, n.async].filter(Boolean);

    // Class declarations and expressions
    case 'ClassDeclaration':
      return [n.id, n.superClass, n.body].filter(Boolean);
    case 'ClassExpression':
      return [n.id, n.superClass, n.body].filter(Boolean);

    // Import and export declarations
    case 'ImportDeclaration':
      return [n.declaration, n.specifiers, n.source].filter(Boolean);
    case 'ExportNamedDeclaration':
      return [n.declaration, n.specifiers, n.source].filter(Boolean);
    case 'ExportDefaultDeclaration':
      return [n.declaration].filter(Boolean);
    case 'ExportAllDeclaration':
      return [n.source].filter(Boolean);

    // Variable declarations
    case 'VariableDeclaration':
      return n.declarations || [];
    case 'VariableDeclarator':
      return [n.id, n.init].filter(Boolean);

    // Control flow statements
    case 'IfStatement':
      return [n.test, n.consequent, n.alternate].filter(Boolean);
    case 'SwitchStatement':
      return [n.discriminant, ...(n.cases || [])];
    case 'SwitchCase':
      return [n.test, ...(n.consequent || [])];
    case 'TryStatement':
      return [n.block, n.handler, n.finalizer].filter(Boolean);
    case 'CatchClause':
      return [n.param, n.body];
    case 'ThrowStatement':
      return [n.argument].filter(Boolean);

    // Loop statements
    case 'ForStatement':
      return [n.init, n.test, n.update, n.body].filter(Boolean);
    case 'ForInStatement':
      return [n.left, n.right, n.body];
    case 'ForOfStatement':
      return [n.left, n.right, n.body];
    case 'ForAwaitStatement':
      return [n.left, n.right, n.body];
    case 'WhileStatement':
      return [n.test, n.body];
    case 'DoWhileStatement':
      return [n.body, n.test];

    // Expression statements
    case 'ExpressionStatement':
      return [n.expression].filter(Boolean);
    case 'ReturnStatement':
      return [n.argument].filter(Boolean);
    case 'BreakStatement':
      return [n.label].filter(Boolean);
    case 'ContinueStatement':
      return [n.label].filter(Boolean);
    case 'LabeledStatement':
      return [n.label, n.body];
    case 'WithStatement':
      return [n.object, n.body];

    // Block statements
    case 'BlockStatement':
      return n.body || [];
    case 'ClassBody':
      return n.body || [];

    // Class-related
    case 'ClassMethod':
      return [n.key, n.params, n.body, n.decorators, n.generator, n.async].filter(Boolean);
    case 'ClassPrivateMethod':
      return [n.key, n.params, n.body, n.decorators, n.generator, n.async].filter(Boolean);
    case 'ClassProperty':
      return [n.key, n.value, n.decorators].filter(Boolean);
    case 'ClassPrivateProperty':
      return [n.key, n.value, n.decorators].filter(Boolean);
    case 'MethodDefinition':
      return [n.key, n.value, n.decorators].filter(Boolean);

    // Object and array expressions
    case 'ObjectExpression':
      return n.properties || [];
    case 'ObjectProperty':
      return [n.key, n.value, n.decorators].filter(Boolean);
    case 'ObjectMethod':
      return [n.key, n.params, n.body, n.decorators, n.generator, n.async].filter(Boolean);
    case 'ArrayExpression':
      return n.elements || [];
    case 'SpreadElement':
      return [n.argument].filter(Boolean);
    case 'RestElement':
      return [n.argument].filter(Boolean);

    // Function calls and member expressions
    case 'CallExpression':
      return [n.callee, ...(n.arguments || [])];
    case 'NewExpression':
      return [n.callee, ...(n.arguments || [])];
    case 'MemberExpression':
      return [n.object, n.property].filter(Boolean);
    case 'OptionalMemberExpression':
      return [n.object, n.property].filter(Boolean);
    case 'OptionalCallExpression':
      return [n.callee, ...(n.arguments || [])];

    // JSX elements
    case 'JSXElement':
      return [n.openingElement, n.closingElement, ...(n.children || [])];
    case 'JSXFragment':
      return [n.openingFragment, n.closingFragment, ...(n.children || [])];

    // Template literals
    case 'TemplateLiteral':
      return [...(n.quasis || []), ...(n.expressions || [])];
    case 'TaggedTemplateExpression':
      return [n.tag, n.quasi];

    // Logical and conditional expressions
    case 'LogicalExpression':
      return [n.left, n.right];
    case 'ConditionalExpression':
      return [n.test, n.consequent, n.alternate];
    case 'AssignmentExpression':
      return [n.left, n.right];
    case 'AssignmentPattern':
      return [n.left, n.right];

    // Binary and unary expressions
    case 'BinaryExpression':
      return [n.left, n.right];
    case 'UnaryExpression':
      return [n.argument].filter(Boolean);
    case 'UpdateExpression':
      return [n.argument].filter(Boolean);

    // Identifiers and literals
    case 'Identifier':
      return [];
    case 'StringLiteral':
      return [];
    case 'NumericLiteral':
      return [];
    case 'BooleanLiteral':
      return [];
    case 'NullLiteral':
      return [];
    case 'RegExpLiteral':
      return [];
    case 'BigIntLiteral':
      return [];
    case 'DecimalLiteral':
      return [];

    // Default case for unknown node types
    default: {
      // For unknown node types, try to find common properties
      for (const prop of COMMON_AST_PROPERTIES) {
        if (n[prop]) {
          if (Array.isArray(n[prop])) {
            return n[prop];
          }
          return [n[prop]];
        }
      }
      return [];
    }
  }
};

export default { getNext };
/**
 * Find a function by name in the AST tree
 * @param {string} functionName - The name of the function to find
 * @param {Object} tree - The AST tree to search
 * @returns {Object|null} The function node or null if not found
 */
export const findFunction = (functionName, tree) => {
  const result = bfs(
    tree,
    getNext,
    (n) => {
      if (!n || !n.type) return false;

      // Handle different function declaration types according to Babel AST spec
      switch (n.type) {
        case 'FunctionDeclaration':
          return n.id?.name === functionName;
        case 'FunctionExpression':
          return n.id?.name === functionName;
        case 'ArrowFunctionExpression':
          return n.id?.name === functionName;
        case 'VariableDeclarator':
          // Handle const/let/var functionName = function() {}
          if (n.id?.name === functionName && n.init) {
            return FUNCTION_NODE_TYPES.includes(n.init.type);
          }
          return false;
        case 'ExportNamedDeclaration':
          // Handle export function functionName() {}
          if (n.declaration?.type === 'FunctionDeclaration') {
            return n.declaration.id?.name === functionName;
          }
          return false;
        case 'ExportDefaultDeclaration':
          // Handle export default function functionName() {}
          if (n.declaration?.type === 'FunctionDeclaration') {
            return n.declaration.id?.name === functionName;
          }
          return false;
        default:
          return false;
      }
    },
  );

  // If we found an ExportNamedDeclaration, return the actual function declaration
  if (result?.type === 'ExportNamedDeclaration' && result.declaration?.type === 'FunctionDeclaration') {
    return result.declaration;
  }

  return result;
};

// Helper function to find parent node
export const findParentNode = (targetNode, rootNode) => {
  const findParent = (currentNode) => {
    if (!currentNode) return null;

    const children = getNext(currentNode);
    for (const child of children) {
      if (child === targetNode) {
        return currentNode;
      }
      const result = findParent(child, currentNode);
      if (result) return result;
    }
    return null;
  };

  return findParent(rootNode);
};

/**
 * Get the scope container for a given node
 * @param {Object} node - The target node
 * @param {Object} tree - The full AST tree
 * @returns {Object|null} The scope container node or null if not found
 */
export const getNodeScope = (node, tree) => {
  if (!node || !tree) return null;

  // Helper function to check if a node contains the target node
  const containsNode = (container, target) => {
    if (!container || !target) return false;

    // Check if this is the target node itself
    if (container === target) return true;

    // Check if nodes have the same location (same source position)
    if (container.loc && target.loc) {
      const containerStart = container.loc.start;
      const containerEnd = container.loc.end;
      const targetStart = target.loc.start;
      const targetEnd = target.loc.end;

      if (containerStart && containerEnd && targetStart && targetEnd) {
        // Check if target is within container's scope
        return (
          (containerStart.line < targetStart.line
            || (containerStart.line === targetStart.line
                && containerStart.column <= targetStart.column))
          && (containerEnd.line > targetEnd.line
            || (containerEnd.line === targetEnd.line && containerEnd.column >= targetEnd.column))
        );
      }
    }

    // Fallback: check if target is a child of container by traversing the tree
    const isChild = (parent, child) => {
      if (!parent || !child) return false;
      if (parent === child) return true;

      const children = getNext(parent);
      return children.some((c) => isChild(c, child));
    };

    return isChild(container, target);
  };

  // Helper function to check if a node is a scope container
  const isScopeContainer = (n) => {
    if (!n || !n.type) return false;

    // These node types can contain other nodes and create scope according to Babel AST spec
    return SCOPE_CONTAINER_TYPES.includes(n.type);
  };

  return bfs(
    tree,
    getNext,
    (n) => {
      if (!n || !isScopeContainer(n)) return false;

      // Check if this scope container contains the target node
      if (containsNode(n, node)) {
        // Verify this is the immediate scope
        // by checking if any child scope also
        // contains the target
        const children = getNext(n);
        const childScopeContainsTarget = children.some((child) => {
          if (!child || !isScopeContainer(child)) return false;
          return containsNode(child, node) && child !== node;
        });

        return !childScopeContainsTarget;
      }

      return false;
    },
  );
};

/**
 * Get function parameters as an array of strings
 * @param {Object} fn - The function node
 * @returns {Array} Array of parameter names/descriptions
 */
export const getFunctionParameters = (fn) => {
  if (!fn || !fn.params) return [];
  return fn.params.map((param) => {
    if (param.type === 'Identifier') return param.name;
    if (param.type === 'ObjectPattern') return 'object';
    if (param.type === 'ArrayPattern') return 'array';
    if (param.type === 'RestElement') return `...${param.argument?.name || 'rest'}`;
    if (param.type === 'AssignmentPattern') return `${param.left?.name || 'param'}=${param.right?.type || 'default'}`;
    return 'unknown';
  });
};

/**
 * Get the type of function body
 * @param {Object} fn - The function node
 * @returns {string} The body type ('block', 'expression', or the actual type)
 */
export const getFunctionBodyType = (fn) => {
  if (!fn || !fn.body) return 'unknown';
  if (fn.body.type === 'BlockStatement') return 'block';
  if (fn.body.type === 'Expression') return 'expression';
  return fn.body.type;
};
