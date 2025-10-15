// build/extract-utils.js
import * as parser from '@babel/parser';
import * as fs from 'fs';
import * as t from '@babel/types';
import traverseDefault from '@babel/traverse';
import generatorDefault from '@babel/generator';
import jsBeautify from 'js-beautify';

const traverse = traverseDefault.default || traverseDefault;
const generator = generatorDefault.default || generatorDefault;
const beautify = jsBeautify.js;

export function extractHandlers(outputPath, config) {
  const {env, entry, block } = config;
  const code = fs.readFileSync(entry, 'utf-8');
  const hydrate = fs.readFileSync('output.json', 'utf-8');
  const ast = parser.parse(code, { sourceType: 'module', ranges: true });
  const parts = entry.split('/'); // Split by "/"
  const lastTwoParts = parts.slice(-2).join('/');
  const data = JSON.parse(hydrate);
  const hydrator = data.filter(obj => obj.file === lastTwoParts);
  console.log(hydrator);

  const dependencies = new Set();
  const componentHandlers = new Set();
  const importNodes = new Set(); 
  const hydrationCode = [];
  const extractedNodes = new Set();
  const processedDependencies = new Set();
  const globalVariables = new Set();
  const hydrateBlocks = [];

  // AST Analysis
  traverse(ast, {
    enter(path) {
      const comments = path.node.leadingComments || [];
      const hydrateComment = comments.find(c => 
        c.value.trim().startsWith('@hydrate')
      );

      if (hydrateComment) {
        console.log(hydrateComment.value)
        const id = hydrateComment.value.split('.')[1];
        
        hydrateBlocks.push({
          code: generator(path.node, { comments: false }).code,
          id: parseInt(id, 0)
        });
        // path.remove();
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
      ImportDeclaration(path) {
          if (path.node.specifiers.some(spec => dependencies.has(spec.local.name))) {
              importNodes.add(path.node); // Store separately to ensure they appear at the top
          }
      },
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
      ...extractedNodes,
  ].map(node => t.isExpression(node) ? t.expressionStatement(node) : node);
  // Step 4: Generate the final extracted code
  const extractedAST = t.program(sortedStatements);
  const extractedCode = generator(extractedAST).code;
  hydrationCode.push(`
    ${extractedCode}
    ${hydrateBlocks?.map((_, idx) => {
      const hyd = hydrator.filter(h => h.id === hydrateBlocks[idx].id);
      return `export default function init_${hydrateBlocks[idx].id}() {
        ${hyd?.map((_, iidx) => {
        return ` 
          (function(){
            /* DOM elements */
            ${Object.entries(hyd[iidx].elements || {}).map(([param, cfg]) => {
              return `const ${param} = document.querySelector('[data-hydrate-id="${cfg}"]')`;
            }).join('\n')};

            ${Object.entries(hyd[iidx].data || {}).map(([param, cfg]) => {
              return `const ${param} = ${cfg}`;
            }).join('\n')};

            ${hydrateBlocks[idx].code}
            })();`
        }).join('\n')}`
      }).join('\n')}
    };
  `);

  fs.writeFileSync(outputPath, beautify(hydrationCode.join('\n'), { indent_size: 2 }));
}


