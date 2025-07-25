/* eslint no-console: 0 */
import { parse } from '@babel/parser';
import fs from 'node:fs';
import { bfs, createZipper, processNode, treeFilter, treeFold, treeMap } from './utils2.js';

export default function doTheThing (functionName, filePath, log = false) {
  const j = fs.readFileSync(filePath).toString();
  const ast = parse(j, { sourceType: 'module' });
  const [functionNode, path] = bfs(
    ast.program,
    (node) => node?.id?.name === functionName,
  );
  const zipper = createZipper(functionNode, path);
  // const functionScope = zipper.goUp();
  const functionDeclarations = getScopeDeclarations(functionNode);
  const functionParameters = getFunctionParameters(functionNode);
  const functionDependencies = getFunctionDependencies(functionNode);
  const outerScopeDeclarations = getOuterScopeDeclarations(zipper);
  const dependencies = outerScopeDeclarations
    .intersection(functionDependencies
      .difference(functionDeclarations
        .union(functionParameters)));
  console.log(dependencies);
}

const getScopeDeclarations = (node) => {
  const isDeclaration = () => {
    switch (node.type) {
      case 'VariableDeclaration':
      case 'FunctionDeclaration':
        return true;
      default: return false;
    }
  };
  return new Set(treeFilter(node, isDeclaration));
};

const getFunctionParameters = (node) => {
  if (node.type !== 'FunctionDeclaration') {
    throw new Error(`Expected a FunctionDeclaration, got ${node.type}`);
  }
  return new Set(node?.params ?? []);
};

const getFunctionDependencies = (node) => new Set(treeMap(
  node,
  (n) => n.declarations ?? [],
).flat());

const getOuterScopeDeclarations = (zipper) => {
  const go = (acc) => {
    const newLocation = zipper.goUp();
    if (newLocation === null) return acc;
    return go(acc.union(getScopeDeclarations(newLocation.tree)));
  };
  return go(new Set());
};
