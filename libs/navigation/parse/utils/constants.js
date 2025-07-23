/* eslint no-multi-spaces: 0 */

/**
 * Constants for AST parsing and dependency analysis
 * Contains hardcoded collections of
 * built-in JavaScript methods, properties, and common
 * AST node properties
 */

/**
 * Built-in JavaScript methods that should not be considered as external dependencies
 * These are standard methods available on all JavaScript objects and primitives
 */
export const BUILT_IN_METHODS = new Set([
  // Object methods
  'toString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
  'toLocaleString', 'toJSON', 'toPrimitive',

  // Number methods
  'toFixed', 'toExponential', 'toPrecision',

  // String methods
  'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'localeCompare',
  'match', 'replace', 'search', 'slice', 'split', 'substring', 'substr',
  'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight',
  'startsWith', 'endsWith', 'includes', 'repeat', 'padStart', 'padEnd',
  'normalize', 'codePointAt', 'fromCodePoint', 'fromCharCode', 'raw',
  'anchor', 'big', 'blink', 'bold', 'fixed', 'fontcolor', 'fontsize',
  'italics', 'link', 'small', 'strike', 'sub', 'sup', 'toSource',
  'unwatch', 'watch',

  // Function methods
  'constructor', 'prototype', 'length', 'name', 'arguments', 'caller',
  'apply', 'call', 'bind',

  // Array methods
  'push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'join',
  'forEach', 'map', 'filter', 'reduce', 'reduceRight', 'some', 'every',
  'find', 'findIndex', 'flat', 'flatMap',

  // Map/Set methods
  'keys', 'values', 'entries', 'has', 'get', 'set', 'delete', 'clear', 'add',
  'size', 'forEach',

  // Global functions
  'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent',
  'encodeURI', 'encodeURIComponent', 'escape', 'unescape', 'eval', 'uneval',

  // Object static methods
  'isPrototypeOf', 'hasOwnProperty', 'propertyIsEnumerable', 'toLocaleString',
  'toString', 'valueOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
  'getOwnPropertySymbols', 'getPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed',
  'preventExtensions', 'seal', 'freeze', 'defineProperty', 'defineProperties',
  'create', 'assign', 'setPrototypeOf', 'is', 'from', 'of',

  // Date methods
  'now', 'parse', 'UTC', 'getTime', 'getFullYear', 'getMonth', 'getDate',
  'getDay', 'getHours', 'getMinutes', 'getSeconds', 'getMilliseconds',
  'getTimezoneOffset', 'getUTCFullYear', 'getUTCMonth', 'getUTCDate',
  'getUTCDay', 'getUTCHours', 'getUTCMinutes', 'getUTCSeconds',
  'getUTCMilliseconds', 'setTime', 'setFullYear', 'setMonth', 'setDate',
  'setHours', 'setMinutes', 'setSeconds', 'setMilliseconds', 'setUTCFullYear',
  'setUTCMonth', 'setUTCDate', 'setUTCHours', 'setUTCMinutes', 'setUTCSeconds',
  'setUTCMilliseconds', 'toDateString', 'toTimeString', 'toLocaleString',
  'toLocaleDateString', 'toLocaleTimeString', 'toUTCString', 'toISOString',
  'toJSON', 'valueOf', 'toString',
]);

/**
 * Built-in JavaScript properties that should not be considered as external dependencies
 * These are standard properties available on global objects and common JavaScript APIs
 */
export const BUILT_IN_PROPERTIES = new Set([
  // Object properties
  'length', 'name', 'prototype', 'constructor', 'arguments', 'caller', 'size',

  // Browser globals
  'window', 'document', 'navigator', 'location', 'history', 'screen', 'console',
  'localStorage', 'sessionStorage', 'indexedDB', 'crypto', 'performance',
  'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout',
  'setInterval', 'clearInterval', 'setImmediate', 'clearImmediate', 'queueMicrotask',

  // Global constructors
  'Promise', 'Symbol', 'Map', 'Set', 'WeakMap', 'WeakSet', 'Proxy', 'Reflect',
  'JSON', 'Math', 'Date', 'RegExp', 'Error', 'EvalError', 'RangeError', 'ReferenceError',
  'SyntaxError', 'TypeError', 'URIError', 'Array', 'ArrayBuffer', 'DataView',
  'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array',
  'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array',
  'BigUint64Array', 'Object', 'Function', 'Boolean', 'Number', 'String', 'BigInt',

  // Global values
  'undefined', 'null', 'NaN', 'Infinity', 'globalThis', 'global', 'process',
  'Buffer',

  // Window properties
  'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'setImmediate', 'clearImmediate', 'queueMicrotask', 'requestAnimationFrame',
  'cancelAnimationFrame', 'console', 'performance', 'crypto', 'localStorage',
  'sessionStorage', 'indexedDB', 'navigator', 'screen', 'history', 'location',
  'document', 'window', 'self', 'top', 'parent', 'frames', 'opener', 'closed',

  // Common object properties (duplicates for clarity)
  'length', 'name', 'prototype', 'constructor', 'arguments', 'caller',
]);

/**
 * Common AST node properties that are typically used for traversing nodes
 * These properties are commonly found across different AST node types
 */
export const COMMON_AST_PROPERTIES = [
  'body',           // Function bodies, program body, block statements
  'expression',     // Expression statements, return statements
  'argument',       // Unary expressions, spread elements
  'arguments',      // Function calls, method calls
  'elements',       // Array expressions
  'properties',     // Object expressions
  'declarations',   // Variable declarations
  'specifiers',     // Import/export declarations
];

/**
 * AST node types that represent function declarations or expressions
 * Used for identifying function-related nodes in the AST
 */
export const FUNCTION_NODE_TYPES = [
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
];

/**
 * AST node types that represent scope containers
 * These nodes create new variable scopes in JavaScript
 */
export const SCOPE_CONTAINER_TYPES = [
  'Program',
  'Module',
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
  'BlockStatement',
  'ClassDeclaration',
  'ClassExpression',
  'ClassBody',
  'MethodDefinition',
  'ClassMethod',
  'ClassPrivateMethod',
  'IfStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'ForAwaitStatement',
  'WhileStatement',
  'DoWhileStatement',
  'SwitchStatement',
  'TryStatement',
  'CatchClause',
  'WithStatement',
];
