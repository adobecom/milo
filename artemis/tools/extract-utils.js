// build/extract-utils.js
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const fs = require('fs');
const t = require('@babel/types');

module.exports = function extractHandlers(outputPath, config) {
  const {selectors, entry, block } = config;
  const code = fs.readFileSync(entry, 'utf-8');
  const ast = parser.parse(code, { sourceType: 'module' });

  const dependencies = new Set();
  const componentHandlers = new Set();
  const importNodes = new Set(); 
  const hydrationCode = [];
  const extractedNodes = new Set();
  const processedDependencies = new Set();
  const globalVariables = new Set();

  // AST Analysis
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.property?.name === 'addEventListener') {
        const handler = path.node.arguments[1];
        if (handler.type === 'FunctionExpression' || handler.type === 'ArrowFunctionExpression' || handler.type === 'Identifier') {
          componentHandlers.add(generator(handler).code);
        }

        // Track dependencies used inside event listener
        path.traverse({
          Identifier(innerPath) {
              dependencies.add(innerPath.node.name);
          },
        });
      }
    },
    AssignmentExpression(path) {
      if (
          t.isMemberExpression(path.node.left) &&
          t.isIdentifier(path.node.left.property) &&
          path.node.left.property.name.startsWith("on") &&
          (t.isFunctionExpression(path.node.right) || t.isArrowFunctionExpression(path.node.right))
      ) {
          extractedNodes.add(path.parentPath.node);

          // Track dependencies used inside event handler
          path.traverse({
              Identifier(innerPath) {
                  dependencies.add(innerPath.node.name);
              },
          });
      }
    },
    VariableDeclarator(path) {
      // Track global variable declarations
      if (path.parentPath.parentPath.isProgram()) {
        globalVariables.add(path.node.id.name);
      }
    }
  });

  // Phase 2: Recursive dependency resolution
    let previousSize;
    do {
      previousSize = dependencies.size;
      const currentDeps = Array.from(dependencies);

      currentDeps.forEach(depName => {
        if (processedDependencies.has(depName)) return;
        processedDependencies.add(depName);

        traverse(ast, {
          FunctionDeclaration(path) {
            if (path.node.id.name === depName) {
              // Track dependencies within this function
              path.traverse({
                Identifier(innerPath) {
                  const name = innerPath.node.name;
                  // if (!isBrowserAPI(name) && globalVariables.has(name)) {
                  //   dependencies.add(name);
                  // }
                  if (!dependencies.has(innerPath.node.name)) {
                    dependencies.add(innerPath.node.name);
                  }
                }
              });
            }
          },
          VariableDeclarator(path) {
            if (path.node.id.name === depName && 
                path.parentPath.parentPath.isProgram() &&
                (path.node.init.type === 'FunctionExpression' ||
                path.node.init.type === 'ArrowFunctionExpression')) {
              // Track dependencies within function expressions
              path.traverse({
                Identifier(innerPath) {
                  if (!dependencies.has(innerPath.node.name)) {
                    dependencies.add(innerPath.node.name);
                  }
                }
              });
            }
          }
        });
      });
    } while (dependencies.size > previousSize);

  // console.log(dependencies);
  // Step 2: Extract relevant declarations (imports, functions, variables)
  traverse(ast, {
      // ImportDeclaration(path) {
      //     if (path.node.specifiers.some(spec => dependencies.has(spec.local.name))) {
      //         importNodes.add(path.node); // Store separately to ensure they appear at the top
      //     }
      // },
      FunctionDeclaration(path) {
          if (dependencies.has(path.node.id.name)) {
              extractedNodes.add(path.node);
          }
      },
      VariableDeclaration(path) {
        path.node.declarations.forEach(declaration => {
            if (t.isIdentifier(declaration.id) && dependencies.has(declaration.id.name) &&  globalVariables.has(declaration.id.name)) {
                extractedNodes.add(path.node);
            }
        });
      }
  });

  // Step 3: Reassemble AST with imports first
  const sortedStatements = [
      ...importNodes, // Ensure imports are at the top
      ...extractedNodes
  ].map(node => t.isExpression(node) ? t.expressionStatement(node) : node);
  
  // Step 4: Generate the final extracted code
  const extractedAST = t.program(sortedStatements);
  const extractedCode = generator(extractedAST).code;
  hydrationCode.push(`
    ${extractedCode}
    document.querySelectorAll('${block}').forEach(block => {
      ${selectors.map((selector, idx) => {
        return `
        (function(){
        const conditionMethod = ${selector.condition} || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           ${Object.entries(selector.scope).map(([param, cfg]) => {
              return `${param}: ${cfg}`;
            }).join(',\n')}
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        ${Object.entries(selector.scope).map(([param, cfg]) => {
          return `const ${param}= scopeResult['${param}'];`;
        }).join('\n')}
        block.querySelectorAll('${selector.trigger}').forEach(el => {
          const paramResolver = () => ({
            ${Object.entries(selector.params).map(([param, cfg]) => {
              return `${param}: ${cfg}`;
            }).join(',\n')}
          });
          el.addEventListener('${selector.event}', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            ${Object.entries(selector.params).map(([param, cfg]) => {
              return `const ${param}= result['${param}'];`;
            }).join('\n')}
           (${Array.from(componentHandlers)[idx]})(e);
          });
        });})();`
      }).join('\n')}
    });
  `);


  fs.writeFileSync(outputPath, hydrationCode.join('\n'));
}

