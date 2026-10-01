const ELEMENT_NODE = 1;
const MEDIA_SELECTOR = 'img, picture, svg, video, a[href]';

function appendChildren(el, children) {
  if (children === null || children === undefined || children === false) return;
  if (typeof children === 'string' || typeof children === 'number') {
    el.textContent = String(children);
    return;
  }
  if (typeof children.nodeType === 'number') {
    el.append(children);
    return;
  }
  if (Array.isArray(children) || typeof children.length === 'number') {
    const list = [...children].filter((c) => c !== null && c !== undefined && c !== false);
    el.append(...list.map((c) => (typeof c === 'number' ? String(c) : c)));
    return;
  }
  throw new TypeError('spectrum2: createTag children must be a string, Node, Node[] or NodeList');
}

export function createTag(tag, attrs = {}, children = null, doc = globalThis.document) {
  if (!doc || typeof doc.createElement !== 'function') {
    throw new Error('spectrum2: createTag needs a document (use tagFor(el) inside a block)');
  }
  const el = doc.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([key, val]) => {
      if (val === null || val === undefined || val === false) return;
      el.setAttribute(key, val === true ? '' : String(val));
    });
  }
  appendChildren(el, children);
  return el;
}

export function tagFor(el) {
  return (tag, attrs, children) => createTag(tag, attrs, children, el.ownerDocument);
}

export function rowsOf(el) {
  if (!el) return [];
  return [...el.children].filter((child) => child.tagName === 'DIV');
}

export function cellsOf(row) {
  if (!row) return [];
  return [...row.children];
}

export function hasContent(node) {
  if (!node) return false;
  if ((node.textContent || '').trim() !== '') return true;
  if (node.nodeType !== ELEMENT_NODE) return false;
  return node.matches(MEDIA_SELECTOR) || !!node.querySelector(MEDIA_SELECTOR);
}

export function isEmptyCell(node) {
  if (!node) return true;
  return !(node.children && node.children.length) && !(node.textContent || '').trim();
}

export function textOf(node) {
  if (!node) return '';
  return (node.textContent || '').replace(/\s+/g, ' ').trim();
}
