// build/extract-utils.js
import * as parser from '@babel/parser';
import * as fs from 'fs';
import * as path from 'path';
import * as t from '@babel/types';
import traverseDefault from '@babel/traverse';
import generatorDefault from '@babel/generator';
import jsBeautify from 'js-beautify';

const traverse = traverseDefault.default || traverseDefault;
const generator = generatorDefault.default || generatorDefault;
const beautify = jsBeautify.js;

const HYDRATION_MARKER = '//@hydrate';

/**
 * Scans a directory recursively for files containing the hydration marker
 * @param {string} dir - Directory to scan
 * @returns {Array} Array of file paths that contain the hydration marker
 */
export function scanForHydratedFiles(dir) {
    const hydratedFiles = [];
    
    function scanDirectory(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                scanDirectory(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.js')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes(HYDRATION_MARKER)) {
                  console.log(fullPath);
                    hydratedFiles.push(fullPath);
                }
            }
        }
    }

    scanDirectory(dir);
    return hydratedFiles;
}

function convertHydrateString(inputStr) {
    // Regular Expression Breakdown:
    // ^                   - Start of the string anchor
    // @hydrate\.         - Matches the literal "@hydrate." (dot needs escaping)
    // \d+               - Matches one or more digits (the number N)
    // \({payload:       - Matches the literal "({payload:" (parentheses and brace need escaping)
    // \{                - Matches the opening curly brace of the payload content (needs escaping)
    // (.*?)             - Captures any character (.), zero or more times (*), non-greedily (?)
    //                     This is group 1, the content we want to extract (e.g., "button, dd, num, id")
    // \}                - Matches the closing curly brace of the payload content (needs escaping)
    // \}\)              - Matches the literal "})" (brace and parenthesis need escaping)
    // $                   - End of the string anchor
    const regex = /^@hydrate\.\d+\({payload:\{(.*?)\}\}\)$/;
  
    // Attempt to match the regex against the input string
    const match = inputStr.match(regex);
    console.log(match)
  
    // Check if a match was found
    if (match && match[1] !== undefined) {
      // match[0] is the full matched string
      // match[1] is the content captured by the first capturing group (.*?)
      const extractedContent = match[1];
      // Return the extracted content enclosed in curly braces
      return `{${extractedContent}}`;
    } else {
      // Return null if the pattern doesn't match
      return '';
    }
  }

export function extractHandlers(outputPath, config, blocks) {
    const {entry} = config;
    const code = fs.readFileSync(entry, 'utf-8');
    const hydrationRuntime = fs.readFileSync('tools/hydration-runtime.js', 'utf-8');
    const ast = parser.parse(code, { sourceType: 'module', ranges: true });
    const parts = entry.split('/'); // Split by "/"
    const lastTwoParts = parts.slice(-2).join('/');
  
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
          // console.log('++++++', hydrateComment);
          const id = hydrateComment.value.split('.')[1];
          const a = convertHydrateString(hydrateComment.value);
          
          hydrateBlocks.push({
            code: `(${a}) => {${generator(path.node, { comments: false }).code}}`,
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
  
    
    blocks[lastTwoParts] = blocks[lastTwoParts] || [];
    blocks[lastTwoParts].push(...hydrateBlocks);
  
    const sortedStatements = [
        ...importNodes,
        ...extractedNodes,
    ].map(node => t.isExpression(node) ? t.expressionStatement(node) : node);
    const extractedAST = t.program(sortedStatements);
    const extractedCode = generator(extractedAST).code;
    const fnsArr = hydrateBlocks.map((blk) => {
        return `block_${blk.id}: ${blk.code}` 
    });

    hydrationCode.push(`
      ${extractedCode}
      const hydrationToken = "${lastTwoParts}";
      const hydrationBlocks = {${fnsArr.join(',')}}
      ${hydrationRuntime}
    `)
    fs.writeFileSync(outputPath, beautify(hydrationCode.join('\n'), { indent_size: 2 }));
  }

/**
 * Process all hydrated files in a directory
 * @param {string} sourceDir - Directory containing files to process
 * @param {string} outputDir - Directory to output processed files
 */
export function processHydratedFiles(sourceDir, outputDir, blocks) {
    const hydratedFiles = scanForHydratedFiles(sourceDir);
    console.log(`Found ${hydratedFiles.length} files with hydration markers`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    hydratedFiles.forEach(file => {
        const relativePath = path.relative(sourceDir, file);
        const outputPath = path.join(outputDir, `${path.basename(file, '.js')}-hydrate.js`);
        
        extractHandlers(outputPath, { entry: file }, blocks);
        console.log(`Processed: ${relativePath}`);
    });
}


 // -------- Dynamic Hydration Runtime Code (ID Only) --------
     