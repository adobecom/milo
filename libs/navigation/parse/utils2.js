/* eslint no-use-before-define:0 */
/* eslint no-confusing-arrow:0 */

import { COMMON_AST_PROPERTIES } from './constants2.js';

// data Tree a = Item a | Section [Tree a]
// data Path a = Top | Node [Tree a] (Path a) [Tree a]
// data Location a = Location (Tree a) (Path a)

const TOP = 'TOP';

export const createZipper = (tree, path) => {
  // usually we would be immutable
  // but since javascript isn't lazy
  // we'll just mutate here
  const location = {
    tree,
    path,
  };
  return {
    current: () => location,
    goLeft: () => {
      if (location.path === TOP) return null;
      if (location.path.left.length === 0) return null;
      const l = location.path.left.pop();
      location.path.right.unshift(location.tree);
      location.tree = l;
      return location;
    },
    goRight: () => {
      if (location.path === TOP) return null;
      if (location.path.right.length === 0) return null;
      const r = location.path.right.shift();
      location.path.left.push(location.tree);
      location.tree = r;
      return location;
    },
    goUp: () => {
      if (location.path === TOP) return null;
      location.path = location.path.up;
      return location;
    },
    goDown: () => {
      const next = getNext(location.tree);
      if (next.length === 0) return null;
      const [current, ...rest] = next;
      location.path = {
        up: location.path,
        left: [],
        right: rest,
      };
      location.tree = current;
      return location;
    },
  };
};

// fold ::(Traversable t) => (b -> a -> b) -> b -> t a -> b
export const treeFold = (f, start, tree) => {
  const go = (q, visited, acc) => {
    if (q.length === 0) return acc;
    const [x, ...xs] = q;
    if (visited.has(x)) return go(xs, visited, acc);
    const accNew = f(acc, x);
    visited.add(x);
    const next = getNext(x);
    return go([...xs, ...next], visited, accNew);
  };
  return go([tree], new Set(), start);
};

// We duplicate the logic from fold because
// we can short circuit this once we find
// the first true.
export const bfs = (tree, predicate) => {
  const go = (q, visited) => {
    if (q.length === 0) return null;
    const [x, ...xs] = q;
    if (visited.has(x)) return go(xs, visited);
    if (predicate(x[0])) return x;
    visited.add(x);
    const next = getNext(x[0]).map((n, i, arr) => {
      const left = arr.slice(0, i);
      const right = arr.slice(i + 1);
      const path = {
        up: x[1],
        left,
        right,
      };
      return [n, path];
    });

    return go([...xs, ...next], visited);
  };
  return go([[tree, TOP]], new Set());
};

export const treeMap = (tree, f) => treeFold(
  (acc, x) => acc.concat([f(x)]),
  [],
  tree,
);

export const treeFilter = (tree, predicate) => treeFold(
  (acc, x) => predicate(x) ? acc.concat([x]) : acc,
  [],
  tree,
);

export const processNode = (node) => {
  switch (node.type) {
    case 'VariableDeclaration':
    case 'FunctionDeclaration':
    case 'ClassDeclaration':
      return node
        .declarations
        ?.filter((d) => d.id?.type === 'Identifier');
    case 'Parameter':
      return node
        .declarations
        ?.filter((d) => d.name?.type === 'Identifier');
    default: break;
  }
  return null;
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
