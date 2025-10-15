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

export function extractHandlers(outputPath, config, blocks) {
  const {entry} = config;
  console.log(entry);
  const code = fs.readFileSync(entry, 'utf-8');
  const hydrate = fs.readFileSync('output.json', 'utf-8');
  const ast = parser.parse(code, { sourceType: 'module', ranges: true });
  const parts = entry.split('/'); // Split by "/"
  const lastTwoParts = parts.slice(-2).join('/');
  const data = JSON.parse(hydrate);
  const hydrator = data.filter(obj => obj.file === lastTwoParts);

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
        const id = hydrateComment.value.split('.')[1];
        
        hydrateBlocks.push({
          code: generator(path.node, { comments: false }).code,
          id: parseInt(id, 0)
        });
        path.traverse({
          Identifier(innerPath) {
              dependencies.add(innerPath.node.name);
          },
      });
      }
    },
    VariableDeclarator(path) {
      if (path.parentPath.parentPath.isProgram()) {
        globalVariables.add(path.node.id.name);
      }
    }
  });

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

  traverse(ast, {
      ImportDeclaration(path) {
          if (path.node.specifiers.some(spec => dependencies.has(spec.local.name))) {
              importNodes.add(path.node);
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

  const sortedStatements = [
      ...importNodes,
      ...extractedNodes,
  ].map(node => t.isExpression(node) ? t.expressionStatement(node) : node);
  const extractedAST = t.program(sortedStatements);
  const extractedCode = generator(extractedAST).code;
  console.log(hydrateBlocks);  
  console.log('-----')
  hydrationCode.push(`
    ${extractedCode} // Assuming this is some initial code
  
    ${hydrateBlocks?.map((block, idx) => {
      const hyd = hydrator.filter(h => h.id === block.id);
  
      const tasks = hyd?.map((hydrationInstance) => {
        const taskData = {
          selectors: {},
          data: {}
        };
        // Store selector strings identified by their parameter name
        Object.entries(hydrationInstance.elements || {}).forEach(([param, selectorId]) => {
          if (Array.isArray(selectorId)) {
            const selector = selectorId.map(value => `[data-hydrate-multi="${value}"]`).join(', ');
            taskData.selectors[param] = selector;
          } else {
            taskData.selectors[param] = `[data-hydrate-id="${selectorId}"]`;
          }
        });

        Object.entries(hydrationInstance.data || {}).forEach(([param, value]) => {
          taskData.data[param] = value;
        });
        return taskData;
      });
  
      const allKeys = tasks.reduce((keys, task) => {
         Object.keys(task.selectors).forEach(k => keys.add(k));
         Object.keys(task.data).forEach(k => keys.add(k));
         return keys;
      }, new Set());
      const destructureKeys = Array.from(allKeys).join(',');
  
      return `
        function init_${block.id}() {
          const tasks = ${JSON.stringify(tasks || [])};
  
          tasks.forEach((task) => {
            try {
              const resElems = {};
              for (const key in task.selectors) {
                const x = document.querySelectorAll(task.selectors[key]);
                resElems[key] = task.selectors[key].includes('data-hydrate-multi') ? x : x[0]
                if (!resElems[key]) {
                  console.warn(\`Hydration element not found\`);
                }
              }

              const finalArgs = { ...resElems, ...task.data };
  
              (({ ${destructureKeys} }) => {
                ${block.code}
              })(finalArgs);
  
            } catch (error) {
                console.error('Error during hydration execution');
            }
          });
        };
      `;
    }).join('\n\n')}
  `);

  fs.writeFileSync(outputPath, beautify(hydrationCode.join('\n'), { indent_size: 2 }));
}


