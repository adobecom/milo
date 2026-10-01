import { rowsOf, hasContent, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateBlockText } from '../_shared/text.js';

const BLOCK = 'quick-facts';
export const CLS = Object.freeze({
  body: `${BLOCK}-body`,
  intro: `${BLOCK}-intro`,
  logo: `${BLOCK}-logo`,
  list: `${BLOCK}-list`,
  fact: `${BLOCK}-fact`,
  products: `${BLOCK}-products`,
  title: `${BLOCK}-title`,
  inset: `${BLOCK}-inset`,
  productTitle: `${BLOCK}-product-title`,
  count: (n) => `${BLOCK}-count-${n}`,
  titlebody: (size) => `${BLOCK}-titlebody-${size}`,
  subheading: (size) => `${BLOCK}-subheading-${size}`,
});
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const TITLE_HOSTS = new Set(['P', 'DIV', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'EM']);
const STATS_SIZES = ['xl', 'l', 'm', 's', 'xs', 'xs'];
const OVERRIDE_TYPES = {
  heading: (c) => /^s2-heading-/.test(c),
  body: (c) => /^s2-body-/.test(c),
  subheading: (c) => c.startsWith(`${BLOCK}-subheading-`),
  titlebody: (c) => c.startsWith(`${BLOCK}-titlebody-`),
};
const OVERRIDE_CLASS = {
  heading: (m) => `s2-heading-${m}`,
  body: (m) => `s2-body-${m}`,
  subheading: (m) => CLS.subheading(m),
  titlebody: (m) => CLS.titlebody(m),
};

const unclassedRows = (el) => rowsOf(el).filter((row) => !row.classList.length);

function buildBody(el, make, intro, facts, products) {
  const body = make('div', { class: CLS.body });
  if (intro) body.append(intro);
  const list = make('div', { class: `${CLS.list} ${CLS.count(facts.length)}` });
  facts.forEach((row) => {
    row.classList.add(CLS.fact);
    list.append(row);
  });
  if (facts.length) body.append(list);
  if (products) {
    products.classList.add(CLS.products, CLS.count(1));
    body.append(products);
  }
  el.append(body);
  return body;
}

export function applyOverrides(el) {
  const applied = [];
  [...el.classList].forEach((cls) => {
    const parts = cls.split('-');
    if (parts.length !== 2) return;
    const [modifier, type] = parts;
    if (!OVERRIDE_TYPES[type] || !modifier) return;
    let count = 0;
    el.querySelectorAll('[class]').forEach((node) => {
      const current = [...node.classList].find(OVERRIDE_TYPES[type]);
      if (!current) return;
      node.classList.replace(current, OVERRIDE_CLASS[type](modifier));
      count += 1;
    });
    if (count) applied.push(cls);
    el.classList.remove(cls);
  });
  return applied;
}

function decorateQuickFacts(el, ctx) {
  const { make } = ctx;
  const inset = !el.classList.contains('no-inset');
  const first = unclassedRows(el)[0];
  if (!first) return;
  let intro = null;
  if (first.querySelector('picture')) {
    intro = first;
    intro.classList.add(CLS.intro, CLS.logo);
  }
  const rows = unclassedRows(el).filter((row) => row !== intro);
  rows.forEach((row) => {
    const heading = row.querySelector(`:is(${HEADINGS})`);
    heading?.classList.add(CLS.title);
    if (inset) heading?.classList.add(CLS.inset);
    const holder = row.querySelector('strong')?.parentElement;
    const isCell = holder && holder.parentElement === row && holder.tagName === 'DIV';
    if (holder && holder !== row && !isCell && TITLE_HOSTS.has(holder.tagName)) {
      holder.classList.add(CLS.titlebody('xl'), CLS.title);
      if (inset) holder.classList.add(CLS.inset);
    }
  });
  const products = rows.length ? rows[rows.length - 1] : null;
  const facts = rows.slice(0, -1);
  buildBody(el, make, intro, facts, products);

  decorateBlockText(el, { origin: ctx.origin, heading: 'm', body: 's', type: 'merch' });
  const subheading = products?.querySelector(`:is(${HEADINGS})`);
  if (subheading) {
    subheading.classList.remove('s2-heading-m');
    subheading.classList.add(CLS.subheading('xs'), CLS.productTitle);
    if (inset) subheading.classList.add(CLS.inset);
  }
  applyOverrides(el);
}

function sizeHeadingsByLevel(row) {
  row.querySelectorAll(HEADINGS).forEach((h) => {
    const level = Number(h.tagName[1]);
    h.classList.add(`s2-heading-${STATS_SIZES[level - 1]}`);
  });
}

function decorateStats(el, ctx) {
  const { make } = ctx;
  const first = rowsOf(el)[0];
  if (!first) return;
  let intro = null;
  if (first.querySelector('picture') || textOf(first) !== '') {
    intro = first;
    intro.classList.add(CLS.intro);
    if (first.querySelector('picture')) intro.classList.add(CLS.logo);
  } else if (!hasContent(first)) {
    first.remove();
  } else {
    intro = first;
    intro.classList.add(CLS.intro);
  }
  const rows = unclassedRows(el).filter((row) => row !== intro);
  rows.forEach(sizeHeadingsByLevel);
  if (intro) sizeHeadingsByLevel(intro);
  const products = rows.length ? rows[rows.length - 1] : null;
  const facts = rows.slice(0, -1);
  buildBody(el, make, intro, facts, products);
}

export const MEMBERS = Object.freeze({
  'quick-facts': {
    origin: 'c1',
    compat: 'canonical',
    overrides: 'c1',
    viewportPrePass: false,
    decorate: (el, ctx) => {
      el.classList.add(BLOCK);
      return decorateQuickFacts(el, ctx);
    },
  },
  stats: {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: (el, ctx) => {
      el.classList.add(BLOCK);
      return decorateStats(el, ctx);
    },
  },
});

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
