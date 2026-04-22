import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fileDir = path.dirname(fileURLToPath(import.meta.url));

const stylesPath = path.resolve(fileDir, '../c2/styles/styles.css');
const targetPath = path.resolve(fileDir, './footer-c2.css');
const sourcePaths = [
  path.resolve(fileDir, '../c2/blocks/global-footer/global-footer.css'),
  path.resolve(fileDir, '../c2/blocks/global-footer/menu/menu.css'),
  path.resolve(fileDir, '../c2/blocks/modal/modal.css'),
];

const importLines = [
  "@import '../c2/blocks/global-footer/global-footer.css';",
  "@import '../c2/blocks/modal/modal.css';",
  "@import '../c2/blocks/global-footer/menu/menu.css';",
];

const VAR_USAGE_RE = /var\(\s*(--[A-Za-z0-9-_]+)/g;
const VAR_DEF_RE = /^\s*(--[A-Za-z0-9-_]+)\s*:\s*(.+);\s*$/;
const SELECTOR_ALLOWLIST = [
  '.caption, [class*="caption-"]',
  '.container',
];

function extractVarRefs(value) {
  const refs = new Set();
  for (const match of value.matchAll(VAR_USAGE_RE)) {
    refs.add(match[1]);
  }
  return refs;
}

function extractBlock(css, header) {
  const start = css.indexOf(`${header} {`);
  if (start === -1) return '';

  let cursor = start + header.length;
  let depth = 0;
  let end = start;

  while (cursor < css.length) {
    const char = css[cursor];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        end = cursor + 1;
        break;
      }
    }
    cursor += 1;
  }

  return css.slice(start, end);
}

function getBlockBody(block) {
  const openIndex = block.indexOf('{');
  return block.slice(openIndex + 1, -1);
}

function collectRuleLines(blockBody, selector) {
  const lines = blockBody.split('\n');
  const declarations = [];
  const nestedBlocks = new Map();

  let currentNestedSelector = null;
  let nestedDepth = 0;
  let nestedLines = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    const openCount = (line.match(/\{/g) || []).length;
    const closeCount = (line.match(/\}/g) || []).length;

    if (!currentNestedSelector) {
      if (trimmed.endsWith('{')) {
        currentNestedSelector = trimmed.slice(0, -1).trim();
        nestedDepth = openCount - closeCount;
        nestedLines = [];
      } else if (trimmed && trimmed !== '}') {
        declarations.push(trimmed);
      }
      return;
    }

    if (trimmed && trimmed !== '}') {
      nestedLines.push(trimmed);
    }

    nestedDepth += openCount - closeCount;
    if (nestedDepth === 0) {
      const resolvedSelector = currentNestedSelector.replace(/^&/, selector);
      nestedBlocks.set(resolvedSelector, nestedLines.filter((entry) => !entry.endsWith('{')));
      currentNestedSelector = null;
      nestedLines = [];
    }
  });

  return { declarations, nestedBlocks };
}

function renderRule(selector, lines) {
  const content = lines
    .filter(Boolean)
    .map((line) => `  ${line}`)
    .join('\n');
  return `${selector} {\n${content}\n}`;
}

function extractAllowedSelectors(css) {
  const selectorRules = [];

  SELECTOR_ALLOWLIST.forEach((selector) => {
    const block = extractBlock(css, selector);
    if (!block) return;

    if (selector === '.container') {
      const { declarations, nestedBlocks } = collectRuleLines(getBlockBody(block), selector);
      selectorRules.push(renderRule(selector, declarations));

      if (nestedBlocks.has('.container.wide')) {
        selectorRules.push(renderRule('.container.wide', nestedBlocks.get('.container.wide')));
      }

      if (nestedBlocks.has('.container .container')) {
        selectorRules.push(renderRule('.container .container', nestedBlocks.get('.container .container')));
      }
      return;
    }

    selectorRules.push(block.trim());
  });

  return selectorRules;
}

function parseVariableDefinitions(css) {
  const definitionsByVar = new Map();
  const definitionsByContext = new Map();
  const stack = [];
  const lines = css.split('\n');

  lines.forEach((line, index) => {
    const openCount = (line.match(/\{/g) || []).length;
    const closeCount = (line.match(/\}/g) || []).length;

    if (openCount > 0) {
      const header = line.split('{')[0].trim();
      for (let i = 0; i < openCount; i += 1) {
        stack.push(i === 0 ? header : '');
      }
    }

    const defMatch = line.match(VAR_DEF_RE);
    if (defMatch && stack.length) {
      const [, name, value] = defMatch;
      const context = stack.filter(Boolean);
      const entry = {
        name,
        value,
        line: line.trim(),
        context,
        order: index,
      };

      if (!definitionsByVar.has(name)) definitionsByVar.set(name, []);
      definitionsByVar.get(name).push(entry);

      const contextKey = context.join('|||');
      if (!definitionsByContext.has(contextKey)) definitionsByContext.set(contextKey, []);
      definitionsByContext.get(contextKey).push(entry);
    }
    for (let i = 0; i < closeCount; i += 1) {
      stack.pop();
    }
  });

  return { definitionsByVar, definitionsByContext };
}

function isVariableContextAllowed(context) {
  if (context.length === 1) {
    return context[0] === ':root' || context[0] === '.dark';
  }

  if (context.length === 2) {
    return context[0].startsWith('@media') && context[1] === ':root';
  }

  return false;
}

function resolveUsedVars(initialVars, definitionsByVar) {
  const resolved = new Set();
  const queue = [...initialVars];

  while (queue.length) {
    const varName = queue.shift();
    if (!resolved.has(varName)) {
      resolved.add(varName);
      const definitions = definitionsByVar.get(varName) || [];
      definitions.forEach(({ value }) => {
        extractVarRefs(value).forEach((dep) => {
          if (!resolved.has(dep)) queue.push(dep);
        });
      });
    }
  }

  return resolved;
}

function renderContext(context, entries) {
  const body = entries
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.line)
    .join('\n');

  if (!context.length) return `${body}\n`;

  let block = `${body}\n`;
  for (let i = context.length - 1; i >= 0; i -= 1) {
    const header = context[i];
    const indented = block
      .trimEnd()
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');
    block = `${header} {\n${indented}\n}\n`;
  }
  return block;
}

const [stylesCss, ...sourceCssFiles] = await Promise.all([
  fs.readFile(stylesPath, 'utf8'),
  ...sourcePaths.map((sourcePath) => fs.readFile(sourcePath, 'utf8')),
]);

const selectorRules = extractAllowedSelectors(stylesCss);
const usedVars = new Set();
sourceCssFiles.forEach((css) => {
  for (const match of css.matchAll(VAR_USAGE_RE)) {
    usedVars.add(match[1]);
  }
});
selectorRules.forEach((rule) => {
  for (const match of rule.matchAll(VAR_USAGE_RE)) {
    usedVars.add(match[1]);
  }
});

const { definitionsByVar, definitionsByContext } = parseVariableDefinitions(stylesCss);
const resolvedVars = resolveUsedVars(usedVars, definitionsByVar);

const contexts = [];
for (const [contextKey, entries] of definitionsByContext.entries()) {
  const includedEntries = entries.filter((entry) => resolvedVars.has(entry.name));
  const context = contextKey ? contextKey.split('|||') : [];
  if (includedEntries.length && isVariableContextAllowed(context)) {
    contexts.push({ context, entries: includedEntries });
  }
}

contexts.sort((a, b) => a.entries[0].order - b.entries[0].order);

const generatedCss = [
  '/* Auto-generated by generate-footer-c2-css.mjs. */',
  '/* Do not edit this file directly; update the generator instead. */',
  ...importLines,
  '',
  ...contexts.map(({ context, entries }) => renderContext(context, entries).trimEnd()),
  '',
  ...selectorRules,
  '',
].join('\n');

await fs.writeFile(targetPath, `${generatedCss}\n`);
