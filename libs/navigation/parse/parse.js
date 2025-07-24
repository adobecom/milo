/* eslint no-console: 0 */
import { parse } from '@babel/parser';
import fs from 'node:fs';
import regenerateCode from './generate-code/generate.js';
import { findFunction, getFunctionBodyType, getFunctionParameters } from './utils/utils.js';

export default (functionName, filePath, log = false) => {
  const j = fs.readFileSync(filePath).toString();
  const ast = parse(j, { sourceType: 'module' });

  const fn = findFunction(functionName, ast.program);

  if (!fn) throw new Error(`Function ${functionName} not found in AST of ${filePath}`);
  if (log) {
    console.log('Found function:', fn.type, fn.id?.name);
    console.log('Function parameters:', getFunctionParameters(fn));
    console.log('Function body type:', getFunctionBodyType(fn));
    console.log('Function location:', fn.loc);
  }
  // Test the regenerateCode function
  const regenerated = regenerateCode(fn, ast.program);
  if (log) {
    console.log('\n=== Code Regeneration ===');
    console.log('Generated code:');
    console.log('```javascript');
    console.log(`${regenerated.code}\nexport *;`);
    console.log('```');
    console.log('Included nodes:', regenerated.includedNodes);
    console.log('Dependencies included:', regenerated.dependencies);
    console.log('Scope usage included:', regenerated.scopeUsage);
  }
  return regenerated.code;
};
