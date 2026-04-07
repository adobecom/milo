type TemplateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | TemplateScope
  | TemplateScope[];

interface TemplateScope {
  [key: string]: TemplateValue;
}

type TemplateNode =
  | { type: 'text'; value: string }
  | { type: 'value'; key: string }
  | { type: 'if'; key: string; children: TemplateNode[]; elseChildren: TemplateNode[] }
  | { type: 'unless'; key: string; children: TemplateNode[]; elseChildren: TemplateNode[] }
  | { type: 'each'; key: string; children: TemplateNode[] };

type ParseStop = 'if' | 'unless' | 'each';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

type ParsedTag =
  | { kind: 'if' | 'unless' | 'each'; key: string }
  | { kind: 'end'; block: ParseStop }
  | { kind: 'else' }
  | { kind: 'value'; key: string };

function parseTag(tag: string): ParsedTag {
  const trimmed = tag.trim();
  if (trimmed.startsWith('#if ')) {
    return { kind: 'if', key: trimmed.slice(4).trim() };
  }
  if (trimmed.startsWith('#unless ')) {
    return { kind: 'unless', key: trimmed.slice(8).trim() };
  }
  if (trimmed.startsWith('#each ')) {
    return { kind: 'each', key: trimmed.slice(6).trim() };
  }
  if (trimmed === '/if') {
    return { kind: 'end', block: 'if' };
  }
  if (trimmed === '/unless') {
    return { kind: 'end', block: 'unless' };
  }
  if (trimmed === '/each') {
    return { kind: 'end', block: 'each' };
  }
  if (trimmed === 'else') {
    return { kind: 'else' };
  }
  return { kind: 'value', key: trimmed };
}

function stripStandaloneControlLines(template: string): string {
  return template.replace(
    /^[ \t]*(\{\{(?:#if|\/if|#unless|\/unless|#each|\/each|else)\b[^}]*\}\})[ \t]*\r?\n?/gm,
    '$1',
  );
}

function parseNodes(template: string, start = 0, stop?: ParseStop): { nodes: TemplateNode[]; index: number } {
  const nodes: TemplateNode[] = [];
  let index = start;

  while (index < template.length) {
    const open = template.indexOf('{{', index);
    if (open === -1) {
      if (stop) {
        throw new Error(`Missing closing template tag for ${stop}`);
      }
      nodes.push({ type: 'text', value: template.slice(index) });
      return { nodes, index: template.length };
    }

    if (open > index) {
      nodes.push({ type: 'text', value: template.slice(index, open) });
    }

    const close = template.indexOf('}}', open + 2);
    if (close === -1) {
      throw new Error('Unclosed template tag');
    }

    const parsed = parseTag(template.slice(open + 2, close));
    index = close + 2;

    if (parsed.kind === 'end') {
      if (!stop) {
        throw new Error(`Unexpected template closing tag: ${parsed.block}`);
      }
      if (parsed.block !== stop) {
        throw new Error(`Mismatched template closing tag: expected ${stop}, got ${parsed.block}`);
      }
      return { nodes, index };
    }

    if (parsed.kind === 'else') {
      if (!stop || stop === 'each') {
        throw new Error('Unexpected {{else}} outside of {{#if}} or {{#unless}} block');
      }
      return { nodes, index, elseHit: true } as { nodes: TemplateNode[]; index: number; elseHit?: boolean };
    }

    if (parsed.kind === 'value') {
      nodes.push({ type: 'value', key: parsed.key });
      continue;
    }

    if (parsed.kind === 'each') {
      const childResult = parseNodes(template, index, 'each');
      nodes.push({ type: 'each', key: parsed.key, children: childResult.nodes });
      index = childResult.index;
      continue;
    }

    // if or unless — may have else branch
    const childResult = parseNodes(template, index, parsed.kind) as { nodes: TemplateNode[]; index: number; elseHit?: boolean };
    let elseChildren: TemplateNode[] = [];
    if (childResult.elseHit) {
      const elseResult = parseNodes(template, childResult.index, parsed.kind);
      elseChildren = elseResult.nodes;
      index = elseResult.index;
    } else {
      index = childResult.index;
    }
    nodes.push({ type: parsed.kind, key: parsed.key, children: childResult.nodes, elseChildren });
  }

  if (stop) {
    throw new Error(`Missing closing template tag for ${stop}`);
  }

  return { nodes, index };
}

function toPathSegments(key: string): string[] {
  if (key === '.' || key === 'this') return [];
  return key.split('.').map((segment) => segment.trim()).filter(Boolean);
}

function lookupValue(contexts: TemplateScope[], key: string): TemplateValue {
  const segments = toPathSegments(key);

  for (let i = contexts.length - 1; i >= 0; i -= 1) {
    let value: TemplateValue = contexts[i];
    let found = true;

    for (const segment of segments) {
      if (!value || Array.isArray(value) || typeof value !== 'object' || !(segment in value)) {
        found = false;
        break;
      }
      value = (value as TemplateScope)[segment];
    }

    if (found) return value;
  }

  return undefined;
}

function isTruthy(value: TemplateValue): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

function renderScalar(value: TemplateValue): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') return escapeHtml(value);
  if (typeof value === 'number' || typeof value === 'boolean') return escapeHtml(String(value));
  throw new Error('Template scalar value must be a string, number, boolean, null, or undefined');
}

function renderNodes(nodes: TemplateNode[], contexts: TemplateScope[]): string {
  return nodes.map((node) => {
    if (node.type === 'text') {
      return node.value;
    }

    if (node.type === 'value') {
      return renderScalar(lookupValue(contexts, node.key));
    }

    if (node.type === 'if') {
      const value = lookupValue(contexts, node.key);
      return isTruthy(value) ? renderNodes(node.children, contexts) : renderNodes(node.elseChildren, contexts);
    }

    if (node.type === 'unless') {
      const value = lookupValue(contexts, node.key);
      return !isTruthy(value) ? renderNodes(node.children, contexts) : renderNodes(node.elseChildren, contexts);
    }

    const value = lookupValue(contexts, node.key);
    if (value !== undefined && value !== null && !Array.isArray(value)) {
      console.warn(`[warn] Template {{#each ${node.key}}}: expected array, got ${typeof value}`);
      return '';
    }
    if (!Array.isArray(value) || !value.length) {
      return '';
    }

    return value.map((entry, index) => {
      if (!entry || Array.isArray(entry) || typeof entry !== 'object') {
        throw new Error('Template each blocks require array items to be objects');
      }
      const scope: TemplateScope = {
        ...entry,
        '@index': index,
        '@key': String(index),
      };
      return renderNodes(node.children, [...contexts, scope]);
    }).join('');
  }).join('');
}

export function renderHtmlTemplate(template: string, data: TemplateScope): string {
  const parsed = parseNodes(stripStandaloneControlLines(template));
  return renderNodes(parsed.nodes, [data]);
}
