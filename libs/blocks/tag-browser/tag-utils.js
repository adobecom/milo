const text = (value) => (typeof value === 'string' ? value.trim() : '');

export function mergeTags(target, incoming) {
  const byId = new Map(target.map((tag) => [tag.id, tag]));
  incoming.forEach((tag) => {
    const existing = byId.get(tag.id);
    if (existing) {
      mergeTags(existing.children, tag.children);
    } else {
      target.push(tag);
      byId.set(tag.id, tag);
    }
  });
  return target;
}

function chimeraTags(tags) {
  return Object.entries(tags || {}).map(([key, tag]) => ({
    id: text(tag.tagID) || key,
    label: text(tag.title) || text(tag.name) || key,
    value: text(tag.tagID),
    children: chimeraTags(tag.tags),
  }));
}

function flattenTags(tags) {
  return tags.flatMap((tag) => [
    { ...tag, children: [] },
    ...flattenTags(tag.children),
  ]);
}

function sheetTags(rows) {
  const rowId = (row) => {
    const value = text(row.value);
    return text(row.id) || (value && `sheet:${encodeURIComponent(text(row.group))}/${encodeURIComponent(value)}`);
  };
  const tags = new Map();
  const groups = new Map();
  const roots = [];
  const inactive = new Set(rows.filter((row) => row.active === false
    || ['false', '0'].includes(String(row.active).toLowerCase())).map(rowId));

  rows.forEach((row) => {
    const id = rowId(row);
    const label = text(row.label) || text(row.title) || text(row.name) || text(row.value);
    if (!id || !label || inactive.has(id)) return;
    tags.set(id, {
      id,
      label,
      value: text(row.value) || text(row.title) || label,
      children: [],
      parent: text(row.parent),
      group: text(row.group),
    });
  });

  tags.forEach((tag) => {
    const ancestors = new Set([tag.id]);
    let parentId = tag.parent;
    while (parentId) {
      if (ancestors.has(parentId)) throw new Error('Tag hierarchy contains a cycle');
      ancestors.add(parentId);
      parentId = tags.get(parentId)?.parent;
    }
    if ([...ancestors].some((id) => inactive.has(id))) return;
    const parent = tags.get(tag.parent);
    if (parent) {
      parent.children.push(tag);
    } else if (tag.group) {
      if (!groups.has(tag.group)) {
        const group = { id: `group:${tag.group}`, label: tag.group, value: tag.group, children: [] };
        groups.set(tag.group, group);
        roots.push(group);
      }
      groups.get(tag.group).children.push(tag);
    } else {
      roots.push(tag);
    }
  });
  return roots;
}

function filterCaasTags(tags, searchParams) {
  const wildcards = { '**': '.*', '*': '[^/]*', '?': '[^/]' };
  const patterns = (key) => (searchParams.get(key) || '').split(',')
    .map((pattern) => pattern.trim())
    .filter(Boolean)
    .map((pattern) => {
      // A trailing slash selects one node; bare paths include descendants.
      const exact = pattern.endsWith('/');
      const path = exact ? pattern.slice(0, -1) : pattern;
      const expression = path.replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*|\*|\?/g, (wildcard) => wildcards[wildcard]);
      return new RegExp(`^${expression}${exact ? '$' : '(?:/.*)?$'}`);
    });
  const include = patterns('include');
  const exclude = patterns('exclude');
  return tags.filter(({ value }) => (
    (!include.length || include.some((pattern) => pattern.test(value)))
    && !exclude.some((pattern) => pattern.test(value))
  ));
}

export function normalizeTags(json, searchParams = new URLSearchParams()) {
  if (json?.namespaces && typeof json.namespaces === 'object') {
    const namespaces = Object.entries(json.namespaces);
    return namespaces.flatMap(([id, namespace]) => {
      const children = chimeraTags(namespace.tags);
      if (id === 'caas') {
        const selected = filterCaasTags(flattenTags(children), searchParams);
        return selected.length ? [{
          id: 'namespace:caas',
          label: 'CaaS Tags',
          value: 'CaaS Tags',
          children: selected,
        }] : [];
      }
      if (namespaces.length === 1) return children;
      return [{
        id: `namespace:${id}`,
        label: text(namespace.title) || text(namespace.name) || id,
        value: '',
        children,
      }];
    });
  }
  const rows = Array.isArray(json?.data) ? json.data : json?.data?.data;
  if (!Array.isArray(rows)) throw new Error('Unsupported tag data');
  return sheetTags(rows);
}

export async function fetchTags(source) {
  const url = new URL(source, window.location.href);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Use an HTTP(S) JSON URL');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url.href, { signal: controller.signal, credentials: 'omit' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const tags = normalizeTags(await response.json(), url.searchParams);
    if (!tags.length) throw new Error('No tags found');
    return tags;
  } finally {
    clearTimeout(timeout);
  }
}
