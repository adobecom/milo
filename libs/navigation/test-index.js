import { parse } from '@babel/parser';
import fs from 'node:fs';
import {
  findFunction,
  extractDependencies,
  regenerateCode
} from './index.js';

const js = fs.readFileSync('./libs/blocks/merch/merch.js').toString();
const ast = parse(js, { sourceType: 'module' });

const fn = findFunction('getMiloLocaleSettings', ast.program);
if (fn) {
  console.log('✅ Index exports working correctly');
  console.log('Function found:', fn.id?.name);
  
  const dependencies = extractDependencies(fn, ast.program);
  console.log('Dependencies extracted:', dependencies.externalDependencies.length);
  
  const regenerated = regenerateCode(fn, ast.program);
  console.log('Code regenerated:', regenerated.includedNodes, 'nodes');
} else {
  console.log('❌ Function not found');
} 