import { isEmptyCell } from './dom.js';

export const VIEWPORT_KEYWORDS = Object.freeze(['mobile', 'tablet', 'desktop']);
export const VIEWPORT_SUFFIX = '-viewport';

export const VIEWPORT_QUERIES = Object.freeze({
  'mobile-tablet-desktop': Object.freeze({
    mobile: '(width < 768px)',
    tablet: '(768px <= width < 1280px)',
    desktop: '(width >= 1280px)',
  }),
  'mobile-desktop': Object.freeze({
    mobile: '(width < 1280px)',
    desktop: '(width >= 1280px)',
  }),
  'mobile-tablet': Object.freeze({
    mobile: '(width < 768px)',
    tablet: '(width >= 768px)',
  }),
  mobile: Object.freeze({ mobile: 'all' }),
  tablet: Object.freeze({ tablet: 'all' }),
  desktop: Object.freeze({ desktop: 'all' }),
});

function cloneChildren(source) {
  return [...source.childNodes].map((child) => child.cloneNode(true));
}

export function parseVariants(text) {
  const match = (text || '').match(/\(([^)]+)\)/);
  return match
    ? match[1].split(',').map((cls) => cls.trim()).filter(Boolean)
    : [];
}

export function getDelimiterKeyword(row) {
  if (!row || row.children.length !== 1) return null;
  const text = row.children[0].textContent.trim().toLowerCase();
  return VIEWPORT_KEYWORDS.find((kw) => (
    text.startsWith(kw + VIEWPORT_SUFFIX) || text === kw || text.startsWith(`${kw} `) || text.startsWith(`${kw}(`)
  )) ?? null;
}

function inheritRowCells(row, prevRow) {
  if (!row || !prevRow) return;
  [...row.children].forEach((col, i) => {
    const prevCol = prevRow.children[i];
    if (isEmptyCell(col) && prevCol && !isEmptyCell(prevCol)) {
      col.replaceChildren(...cloneChildren(prevCol));
    }
  });
}

function resolveInheritance(rows, previousContent) {
  if (!previousContent) return;
  const [contentRow, ...extraRows] = rows;
  const [prevContentRow, ...prevExtraRows] = previousContent.children;
  inheritRowCells(contentRow, prevContentRow);
  extraRows.forEach((row, i) => inheritRowCells(row, prevExtraRows[i]));
}

export function parseViewportContent(el) {
  const children = [...el.children];
  const content = {};
  const delimiterEls = [];

  VIEWPORT_KEYWORDS.forEach((keyword, kwIndex) => {
    const delimiterIdx = children.findIndex((child) => getDelimiterKeyword(child) === keyword);
    if (delimiterIdx < 0) return;

    const nextIdx = children.findIndex((child, i) => {
      if (i <= delimiterIdx) return false;
      const nextKw = getDelimiterKeyword(child);
      return nextKw && VIEWPORT_KEYWORDS.indexOf(nextKw) > kwIndex;
    });

    const rows = children.slice(delimiterIdx + 1, nextIdx < 0 ? children.length : nextIdx);

    const prevKey = VIEWPORT_KEYWORDS.slice(0, kwIndex).reverse().find((k) => content[k]);
    resolveInheritance(rows, content[prevKey]?.container);

    const container = el.ownerDocument.createElement('div');
    container.append(...rows);

    const delimiterEl = children[delimiterIdx];
    const variants = parseVariants(delimiterEl.textContent);
    delimiterEls.push(delimiterEl);

    content[keyword] = { container, variants };
  });

  delimiterEls.forEach((d) => d.remove());

  if (!Object.keys(content).length) {
    return { hasViewportVariations: false };
  }

  const h1Count = Object.values(content)
    .reduce((n, vp) => n + vp.container.querySelectorAll('h1').length, 0);
  const allVariants = Object.values(content).flatMap(({ variants }) => variants);

  return { hasViewportVariations: true, content, allVariants, h1Count };
}

function matchMediaOf(el) {
  const win = el.ownerDocument?.defaultView;
  if (!win || typeof win.matchMedia !== 'function') {
    throw new Error('spectrum2: decorateViewportContent needs el.ownerDocument.defaultView.matchMedia');
  }
  return (query) => win.matchMedia(query);
}

function applyViewportContent(el, viewports, afterApply) {
  if (!viewports.hasViewportVariations) return false;

  const { content, allVariants } = viewports;
  const vpKeys = Object.keys(content);
  const queryKey = vpKeys.join('-');
  const queries = VIEWPORT_QUERIES[queryKey];
  viewports.queryKey = queryKey;

  if (!queries) return false;

  const matchMedia = matchMediaOf(el);
  vpKeys.forEach((viewport) => {
    const mq = matchMedia(queries[viewport]);
    const { container, variants } = content[viewport];
    const children = [...container.children];

    const setContent = () => {
      if (!mq.matches) return;
      el.classList.remove(...allVariants);
      if (variants.length) el.classList.add(...variants);
      el.replaceChildren(...children);
      if (afterApply) afterApply(el);
    };

    setContent();
    mq.addEventListener('change', setContent);
  });
  return true;
}

const isThenable = (v) => !!v && typeof v.then === 'function';

export function decorateViewportContent(el, decorateFn, { afterApply } = {}) {
  const viewports = parseViewportContent(el);
  const finish = () => {
    if (viewports.hasViewportVariations) {
      viewports.applied = applyViewportContent(el, viewports, afterApply);
    } else {
      if (afterApply) afterApply(el);
      viewports.applied = true;
    }
    return viewports;
  };

  const pending = viewports.hasViewportVariations
    ? Object.values(viewports.content).map(({ container }) => decorateFn(container, el))
    : [decorateFn(el, el)];

  if (pending.some(isThenable)) return Promise.all(pending).then(finish);
  return finish();
}
