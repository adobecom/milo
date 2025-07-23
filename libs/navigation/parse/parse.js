/* eslint no-console: 0 */
import { parse } from '@babel/parser';
import fs from 'node:fs';
import { extractDependencies, getNodeScope } from './ast/analyze-ast.js';
import regenerateCode from './generate-code/generate.js';
import { findFunction, getFunctionBodyType, getFunctionParameters } from './utils/utils.js';

export default (functionName) => {
  const j = fs.readFileSync('../blocks/merch/merch.js').toString();
  const ast = parse(j, { sourceType: 'module' });
  console.log('soup');

  const fn = findFunction(functionName, ast.program);

  if (!fn) {
    console.error('Function getMiloLocaleSettings not found in AST');
  } else {
    console.log('Found function:', fn.type, fn.id?.name);
    console.log('Function parameters:', getFunctionParameters(fn));
    console.log('Function body type:', getFunctionBodyType(fn));
    console.log('Function location:', fn.loc);

    const scope = getNodeScope(fn, ast.program);
    if (scope) {
      console.log('Function scope:', scope.type, scope.id?.name || 'anonymous');
      console.log('Scope location:', scope.loc);
    } else {
      console.log('No scope found for function');
    }

    // Test the extractDependencies function
    const dependencies = extractDependencies(fn, ast.program);
    console.log('\n=== Dependencies Analysis ===');
    console.log('External dependencies:', dependencies.externalDependencies);
    console.log('Scope usage:', dependencies.scopeUsage.map((item) => item.name));
    console.log('All used identifiers:', dependencies.usedIdentifiers);
    console.log('Declared identifiers:', dependencies.declaredIdentifiers);
    console.log('Built-in methods used:', dependencies.builtInMethodsUsed);
    console.log('Built-in properties used:', dependencies.builtInPropertiesUsed);

    // Test the regenerateCode function
    const regenerated = regenerateCode(fn, ast.program);
    console.log('\n=== Code Regeneration ===');
    console.log('Generated code:');
    console.log('```javascript');
    console.log(regenerated.code);
    console.log('```');
    console.log('Included nodes:', regenerated.includedNodes);
    console.log('Dependencies included:', regenerated.dependencies);
    console.log('Scope usage included:', regenerated.scopeUsage);
  }
};
