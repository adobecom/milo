/* eslint import/prefer-default-export:0 */
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

/**
 * Given a Babel AST and a function name, finds that function and all its
 * dependencies, and returns them as a self-contained JavaScript code string.
 *
 * This function is pure and operates under the assumption that the source
 * code contains no side effects or dynamic calls.
 *
 * @param {t.File} ast The source Babel AST.
 * @param {string} functionName The name of the function to extract.
 * @returns {string} A string of JavaScript code containing the target function
 *                   and all its dependencies. Returns an empty string if the
 *                   function is not found.
 */
export function extractFunctionCode(ast, functionName) {
  // Step 1: Map all top-level declarations (functions and variables) by name.
  // This allows us to easily find the AST node for a given dependency.
  const topLevelDeclarations = new Map();
  traverse.default(ast, {
    Program(programPath) {
      programPath.get('body').forEach((statementPath) => {
        if (statementPath.isFunctionDeclaration()) {
          const { name } = statementPath.node.id;
          topLevelDeclarations.set(name, statementPath);
        } else if (statementPath.isVariableDeclaration()) {
          statementPath.get('declarations').forEach((declaratorPath) => {
            if (declaratorPath.get('id').isIdentifier()) {
              const { name } = declaratorPath.node.id;
              topLevelDeclarations.set(name, statementPath);
            }
          });
        } else if (statementPath.isExportNamedDeclaration()) {
          const declaration = statementPath.get('declaration');
          if (declaration.isFunctionDeclaration()) {
            const { name } = declaration.node.id;
            topLevelDeclarations.set(name, statementPath);
          }
        }
      });
      programPath.stop(); // We only need the top-level scope.
    },
  });

  if (!topLevelDeclarations.has(functionName)) {
    throw new Error(`Function "${functionName}" not found in the AST.`);
  }

  // Step 2: Recursively find all dependencies.
  // We use a breadth first search that returns all the visited nodes
  const bfs = (start, getNext) => {
    const go = (visited, queue) => {
      if (queue.length === 0) return visited;
      const [current, ...rest] = queue;
      if (visited.has(current)) return go(visited, rest);
      visited.add(current);
      const newQueue = [...rest, ...getNext(current)];
      return go(visited, newQueue);
    };
    return go(new Set(), [start]);
  };

  const requiredNames = bfs(
    functionName,
    (currentName) => {
      if (!topLevelDeclarations.has(currentName)) return [];
      const declarationPath = topLevelDeclarations.get(currentName);
      // Traverse the current declaration to find all referenced identifiers.
      const accumulator = [];
      declarationPath.traverse({
        Identifier(identifierPath) {
          // We only care about identifiers that are references to other variables/functions.
          if (!identifierPath.isReferenced()) {
            return;
          }

          const binding = identifierPath.scope.getBinding(identifierPath.node.name);

          // A binding exists and it points to a known top-level declaration.
          // This means we have found a dependency.
          if (binding && topLevelDeclarations.has(binding.identifier.name)) {
            accumulator.push(binding.identifier.name);
          }
        },
      });
      return accumulator;
    },
  );

  // Step 3: Build a new AST with only the required declarations.
  // We iterate through the original AST body to maintain the original order.
  const newBody = [];
  const addedNodes = new Set(); // Prevents adding the same multi-declaration statement twice.

  ast.program.body.forEach((node) => {
    // Determine the name(s) declared by this node.
    const declaredNames = [];
    if (t.isFunctionDeclaration(node) && node.id) {
      declaredNames.push(node.id.name);
    } else if (t.isVariableDeclaration(node)) {
      node.declarations.forEach((declarator) => {
        if (t.isIdentifier(declarator.id)) {
          declaredNames.push(declarator.id.name);
        }
      });
    } else if (t.isExportNamedDeclaration(node) && node.declaration) {
      if (t.isFunctionDeclaration(node.declaration)) {
        declaredNames.push(node.declaration.id.name);
      }
    }

    // If any of the declared names are required, add the entire node.
    for (const name of declaredNames) {
      if (requiredNames.has(name) && !addedNodes.has(node)) {
        newBody.push(t.cloneNode(node, true));
        addedNodes.add(node);
        break;
      }
    }
  });

  const newAst = t.file(t.program(newBody));

  // Step 4: Generate the final JavaScript code string from the new AST.
  const { code } = generate.default(newAst);

  return code;
}
