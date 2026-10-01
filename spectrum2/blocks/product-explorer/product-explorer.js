import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { paragraphsOf } from '../_shared/s1-paragraphs.js';
import { dispatch } from '../_shared/members.js';
import { decorateButtons } from '../_shared/buttons.js';

const FAMILY = 'product-explorer';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const LISTS = 'ul, ol';
const MEDIA = 'picture, img, video';
const ELEMENT = 1;
const OPEN = ['directory', 'catalogue', 'index-rail', 'split-stack'];
const INDEXED = 'index-rail';

const linkedList = (cell) => [...cell.querySelectorAll(LISTS)].some((list) => list.querySelector('a[href]'));

export function rowKind(row) {
  const cells = cellsOf(row);
  if (cells.length >= 2) {
    const [name, ...rest] = cells;
    const plainName = !!textOf(name) && !name.querySelector(`${HEADINGS}, ${LISTS}, ${MEDIA}, a[href]`);
    if (plainName && rest.some(linkedList)) return 'category';
  }
  if (row.querySelector(HEADINGS)) return 'head';
  if (row.querySelector('a[href]')) return 'link';
  return textOf(row) || row.querySelector(MEDIA) ? 'text' : 'empty';
}

function partsOfRow(row, make) {
  const cells = cellsOf(row);
  return (cells.length ? cells : [row]).flatMap((cell) => paragraphsOf(cell, make));
}

const isMedia = (n) => n.nodeType === ELEMENT
  && (n.matches(MEDIA) || (!!n.querySelector(MEDIA) && !textOf(n)));

export function readCategory(row) {
  const [nameCell, ...rest] = cellsOf(row);
  let listAt = -1;
  rest.forEach((cell, i) => { if (linkedList(cell)) listAt = i; });
  return {
    name: textOf(nameCell),
    intro: rest.filter((cell, i) => i !== listAt),
    list: rest[listAt],
  };
}

function uniquePrefix(el, count) {
  const doc = el.ownerDocument;
  const root = el.getRootNode();
  const scopes = root === doc ? [doc] : [doc, root];
  const decorated = scopes.reduce((sum, s) => sum + s.querySelectorAll(`.${FAMILY}[data-product-explorer-decorated]`).length, 0);
  const has = (id) => scopes.some((s) => s.querySelector(`[id="${id}"]`));
  const taken = (p) => has(`${p}-heading`)
    || Array.from({ length: Math.max(count, 1) }, (_, i) => i + 1).some((i) => has(`${p}-tab-${i}`) || has(`${p}-panel-${i}`));
  let n = decorated + 1;
  while (taken(`${FAMILY}-${n}`)) n += 1;
  return `${FAMILY}-${n}`;
}

function isRtl(el) {
  const dir = el.closest('[dir]')?.getAttribute('dir') || el.ownerDocument.dir;
  return String(dir).toLowerCase() === 'rtl';
}

function buildIntro(cells, make) {
  const intro = make('div', { class: 'product-explorer-intro' });
  const copy = make('div', { class: 'product-explorer-copy' });
  const media = make('div', { class: 'product-explorer-media' });
  cells.flatMap((cell) => paragraphsOf(cell, make)).forEach((n) => {
    (isMedia(n) ? media : copy).append(n);
  });
  copy.querySelectorAll(HEADINGS).forEach((h) => h.classList.add('product-explorer-title'));
  if (copy.childNodes.length) intro.append(copy);
  if (media.childNodes.length) intro.append(media);
  return intro;
}

function buildProducts(cell, make) {
  const products = make('div', { class: 'product-explorer-products' });
  products.append(...paragraphsOf(cell, make));
  products.querySelectorAll(`:scope > :is(${HEADINGS})`).forEach((h) => h.classList.add('product-explorer-list-heading'));
  products.querySelectorAll(`:scope > :is(${LISTS})`).forEach((list) => {
    if (!list.querySelector('a[href]')) return;
    list.classList.add('product-explorer-list');
    [...list.children].filter((li) => li.tagName === 'LI').forEach((li) => {
      li.classList.add('product-explorer-item');
      const links = li.querySelectorAll('a[href]');
      links.forEach((a) => a.classList.add('product-explorer-link'));
      if (links.length === 1) li.classList.add('product-explorer-item-linked');
      li.querySelectorAll(':scope > picture, :scope > img').forEach((m) => m.classList.add('product-explorer-icon'));
      li.querySelectorAll(':scope > strong, :scope > b').forEach((s) => s.classList.add('product-explorer-badge'));
    });
  });
  return products;
}

function decorateProductExplorer(el, ctx) {
  el.classList.add(FAMILY);
  if (el.dataset.productExplorerDecorated) return;
  const { make } = ctx;
  const doc = el.ownerDocument;
  const rows = rowsOf(el);
  const kinds = rows.map(rowKind);
  const first = kinds.indexOf('category');
  if (first < 0) return;
  const last = kinds.lastIndexOf('category');
  const prefix = uniquePrefix(el, kinds.filter((k) => k === 'category').length);
  el.dataset.productExplorerDecorated = 'true';

  const head = make('div', { class: 'product-explorer-head' });
  const foot = make('div', { class: 'product-explorer-foot' });
  const categories = [];
  const kept = [];
  rows.forEach((row, i) => {
    const kind = kinds[i];
    if (kind === 'empty') return;
    if (kind === 'category') { categories.push(readCategory(row)); return; }
    if (i < first) { head.append(...partsOfRow(row, make)); return; }
    if (i > last && (kind === 'link' || kind === 'text')) { foot.append(...partsOfRow(row, make)); return; }
    row.classList.add('product-explorer-row');
    kept.push(row);
  });

  const parts = [];
  const heading = head.querySelector(HEADINGS);
  if (head.childNodes.length) {
    heading?.classList.add('product-explorer-heading');
    parts.push(head);
  }

  const open = OPEN.some((option) => el.classList.contains(option));
  const tabbed = categories.length > 1 && !open;
  const tabs = [];
  const panels = categories.map((cat, i) => {
    const n = i + 1;
    const panel = make('div', { class: 'product-explorer-panel' });
    const intro = buildIntro(cat.intro, make);
    if (intro.childNodes.length) panel.append(intro);
    else panel.classList.add('product-explorer-panel-list');
    panel.append(buildProducts(cat.list, make));
    if (open) {
      const label = make('p', { class: 'product-explorer-category' }, cat.name);
      const copy = panel.querySelector('.product-explorer-copy');
      if (copy) copy.prepend(label);
      else panel.prepend(label);
      panel.id = `${prefix}-panel-${n}`;
      return panel;
    }
    if (!tabbed) return panel;
    const tabId = `${prefix}-tab-${n}`;
    const panelId = `${prefix}-panel-${n}`;
    tabs.push(make('button', {
      type: 'button',
      role: 'tab',
      class: 'product-explorer-tab',
      id: tabId,
      'aria-controls': panelId,
      'aria-selected': i === 0 ? 'true' : 'false',
      tabindex: i === 0 ? '0' : '-1',
    }, cat.name));
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('tabindex', '0');
    if (i > 0) panel.setAttribute('hidden', '');
    return panel;
  });

  if (tabbed) {
    const tablist = make('div', { class: 'product-explorer-tabs', role: 'tablist' }, tabs);
    if (heading) {
      if (!heading.id) heading.id = `${prefix}-heading`;
      tablist.setAttribute('aria-labelledby', heading.id);
    }
    const select = (index) => {
      tabs.forEach((tab, j) => {
        const on = j === index;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        panels[j].toggleAttribute('hidden', !on);
      });
    };
    tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
    tablist.addEventListener('keydown', (e) => {
      const step = isRtl(el) ? { ArrowLeft: 1, ArrowRight: -1 } : { ArrowLeft: -1, ArrowRight: 1 };
      if (!(e.key in step) && e.key !== 'Home' && e.key !== 'End') return;
      const current = tabs.indexOf(doc.activeElement);
      const from = current >= 0 ? current : tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
      let to;
      if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = tabs.length - 1;
      else to = (Math.max(from, 0) + step[e.key] + tabs.length) % tabs.length;
      e.preventDefault();
      select(to);
      tabs[to].focus();
    });
    parts.push(tablist);
  }

  if (open && el.classList.contains(INDEXED) && panels.length > 1) {
    const index = make(heading ? 'nav' : 'div', { class: 'product-explorer-index' }, [make('ul', {}, categories.map((cat, i) => (
      make('li', {}, [make('a', { href: `#${panels[i].id}` }, cat.name)])
    )))]);
    if (heading) {
      if (!heading.id) heading.id = `${prefix}-heading`;
      index.setAttribute('aria-labelledby', heading.id);
    }
    parts.push(index);
  }

  const stage = make('div', { class: 'product-explorer-panels' }, panels);
  parts.push(stage, ...kept);
  if (foot.childNodes.length) {
    decorateButtons(foot);
    parts.push(foot);
  }
  el.classList.toggle('product-explorer-tabbed', tabbed);
  el.classList.toggle('product-explorer-open', open);
  el.classList.toggle('product-explorer-lists', panels.every((p) => p.classList.contains('product-explorer-panel-list')));
  el.replaceChildren(...parts);
}

export const MEMBERS = {
  'product-explorer': {
    origin: 'bacom',
    compat: 'canonical',
    overrides: 'none',
    viewportPrePass: false,
    decorate: decorateProductExplorer,
  },
};

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: FAMILY });
}
