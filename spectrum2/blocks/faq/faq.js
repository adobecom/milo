import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { applyTextOverrides } from '../_shared/text.js';
import { decorateButtons } from '../_shared/buttons.js';
import { trackingLabel } from '../_shared/analytics.js';

const BLOCK = 'faq';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON_PATH = 'm9.30103,6c0-.04883-.02002-.09521-.02783-.14343-.01074-.06726-.01294-.13586-.03894-.19971-.04456-.10974-.11121-.21252-.20007-.30139L4.34277.66309c-.35547-.35547-.93359-.35547-1.28906,0s-.35645.93262,0,1.28906l4.047,4.04785-4.047,4.04785c-.35645.35645-.35547.93359,0,1.28906.17773.17773.41113.2666.64453.2666s.4668-.08887.64453-.2666l4.69141-4.69238c.08887-.08887.15552-.19165.20007-.30139.026-.06384.0282-.13245.03894-.19971.00781-.04822.02783-.0946.02783-.14343Z';
const EDITORIAL_QUERY = '(width >= 1280px)';
const C1_LABEL_PART_LIMIT = 20;

function blockNumber(el) {
  const doc = el.ownerDocument;
  const root = el.getRootNode();
  const scopes = root === doc || root === el ? [doc] : [doc, root];
  let n = scopes.reduce((sum, s) => sum + s.querySelectorAll('[data-faq-block]').length, 0) + 1;
  // eslint-disable-next-line no-loop-func
  while (scopes.some((s) => s.querySelector(`#${BLOCK}-${n}-panel-1`))) n += 1;
  el.dataset.faqBlock = String(n);
  return n;
}

function chevron(el) {
  const doc = el.ownerDocument;
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 12 12');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON_PATH);
  svg.append(path);
  return svg;
}

function unwrapInteractive(question) {
  question.querySelectorAll('a, button').forEach((node) => node.replaceWith(...node.childNodes));
  return question;
}

function syncItem(details) {
  const summary = details.querySelector(':scope > summary');
  if (!summary) return;
  summary.setAttribute('aria-expanded', String(details.open));
  const label = summary.getAttribute('daa-ll');
  if (!label) return;
  summary.setAttribute('daa-ll', details.open ? label.replace(/^open-/, 'close-') : label.replace(/^close-/, 'open-'));
}

function buildItem(el, ctx, {
  n, num, question, answer, open, labelLimit,
}) {
  const { make } = ctx;
  const panelId = `${BLOCK}-${n}-panel-${num}`;
  const text = textOf(question);
  const icon = make('span', { class: 'faq-icon', 'aria-hidden': 'true' }, chevron(el));
  const summary = make('summary', {
    class: 'faq-trigger',
    'aria-expanded': String(open),
    'aria-controls': panelId,
    'daa-ll': `${open ? 'close' : 'open'}-${num}--${trackingLabel(text, labelLimit)}`,
  }, [question, icon]);
  const inner = make('div', { class: 'faq-panel-inner' }, answer);
  const panel = make('div', { class: 'faq-panel', id: panelId }, inner);
  const details = make('details', { class: 'faq-item', open }, [summary, panel]);
  details.addEventListener('toggle', () => syncItem(details));
  return { details, summary, panel, inner, text };
}

const LD_WS = /[\t\n\f\r ]+/g;
const LD_ENDS = /^[\t\n\f\r ]+|[\t\n\f\r ]+$/g;
function ldText(value) {
  return String(value ?? '').replace(LD_WS, ' ').replace(LD_ENDS, '');
}

function writeJsonLd(el, ctx, n, questions) {
  const doc = el.ownerDocument;
  const toEntity = ({ name, text }) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } });
  const existing = doc.head?.querySelector('script[type="application/ld+json"][data-spectrum2-faq]');
  if (existing) {
    let schema = null;
    try { schema = JSON.parse(existing.textContent); } catch { schema = null; }
    if (schema && Array.isArray(schema.mainEntity)) {
      const seen = new Set(schema.mainEntity.map((q) => q && q.name));
      questions.filter((q) => !seen.has(q.name))
        .forEach((q) => schema.mainEntity.push(toEntity(q)));
      existing.textContent = JSON.stringify(schema);
      existing.dataset.spectrum2Faq = `${existing.dataset.spectrum2Faq} ${n}`;
      return existing;
    }
  }
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions.map(toEntity) };
  const script = ctx.make('script', { type: 'application/ld+json', 'data-spectrum2-faq': String(n) }, JSON.stringify(schema));
  (doc.head || doc.documentElement).append(script);
  return script;
}

function faqEntries(el) {
  return rowsOf(el).map((row) => {
    const cell = row.firstElementChild;
    const heading = cell?.querySelector(HEADINGS);
    if (!heading) return null;
    heading.remove();
    return { question: unwrapInteractive(heading), answer: [...cell.childNodes] };
  }).filter(Boolean);
}

function decorateFaq(el, ctx) {
  const n = blockNumber(el);
  const entries = faqEntries(el);
  const items = entries.map(({ question, answer }, idx) => {
    question.classList.add('faq-question', 's2-heading-5');
    const item = buildItem(el, ctx, { n, num: idx + 1, question, answer, open: idx === 0 });
    item.panel.classList.add('s2-body-md');
    return item;
  });
  el.replaceChildren(ctx.make('div', { class: 'faq-list' }, items.map((i) => i.details)));
  const applied = applyTextOverrides(el, ctx.overrides);
  if (applied.some((cls) => cls.startsWith('heading-'))) {
    items.forEach(({ summary }) => summary.querySelector('.faq-question')?.classList.add('faq-question-authored'));
  }
  if (el.classList.contains('seo')) {
    writeJsonLd(el, ctx, n, items.map(({ summary, inner }) => ({
      name: ldText(summary.querySelector('.faq-question')?.textContent),
      text: [...inner.childNodes].map((node) => ldText(node.textContent)).filter(Boolean).join(' '),
    })));
  }
  return { items: items.map((i) => i.details), overrides: applied };
}

function nodesOf(row) {
  return row ? cellsOf(row).flatMap((cell) => [...cell.childNodes]) : [];
}

function seoAnswer(panelRow) {
  const cell = panelRow?.firstElementChild;
  const para = cell?.querySelector('p');
  return ldText((para ?? cell)?.textContent);
}

function accordionEntries(rows, ctx, editorial) {
  const entries = [];
  for (let i = 0; i < rows.length; i += 2) {
    const triggerRow = rows[i];
    const answer = nodesOf(rows[i + 1]);
    const heading = triggerRow.querySelector(HEADINGS);
    const label = textOf(triggerRow);
    const seo = { name: ldText(triggerRow.textContent), text: seoAnswer(rows[i + 1]) };
    if (!heading && !label && !editorial && entries.length) {
      entries[entries.length - 1].answer.push(...answer);
    } else {
      let question;
      if (heading) {
        heading.remove();
        question = unwrapInteractive(heading);
        question.classList.add('faq-question');
      } else {
        question = ctx.make('span', { class: 'faq-question tracking-header', role: 'heading', 'aria-level': '3' }, label);
      }
      entries.push({ question, answer, seo });
    }
  }
  return entries;
}

function wireEditorial(el, ctx, items, media) {
  const pane = ctx.make('div', { class: 'faq-media' });
  el.append(pane);
  const win = el.ownerDocument.defaultView;
  const mql = typeof win?.matchMedia === 'function' ? win.matchMedia(EDITORIAL_QUERY) : null;
  const state = { active: 0 };
  const place = () => {
    const wide = !!mql?.matches;
    media.forEach((item, idx) => {
      const host = wide ? pane : items[idx]?.inner;
      if (!item || !host) return;
      if (wide) host.append(item);
      else if (host.firstChild !== item) host.prepend(item);
      item.classList.toggle('faq-media-active', idx === state.active);
    });
  };
  items.forEach(({ details }, idx) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      items.forEach((other) => {
        if (other.details !== details && other.details.open) other.details.open = false;
      });
      state.active = idx;
      place();
    });
  });
  place();
  mql?.addEventListener?.('change', place);
  return { pane, state, place };
}

function decorateAccordion(el, ctx) {
  const { make } = ctx;
  el.classList.add(BLOCK);
  const n = blockNumber(el);
  decorateButtons(el);
  const editorial = el.classList.contains('editorial');
  let rows = rowsOf(el);
  let media = [];
  if (editorial) {
    media = rows.filter((_, i) => i % 3 === 2).map((row) => make('div', { class: 'faq-media-item' }, nodesOf(row)));
    rows = rows.filter((_, i) => i % 3 !== 2);
  }
  const entries = accordionEntries(rows, ctx, editorial);
  const items = entries.map(({ question, answer, seo }, idx) => ({
    ...buildItem(el, ctx, {
      n,
      num: idx + 1,
      question,
      answer,
      open: editorial && idx === 0,
      labelLimit: C1_LABEL_PART_LIMIT,
    }),
    seo,
  }));
  if (![...el.classList].some((cls) => cls.startsWith('max-width-'))) el.classList.add('max-width-10-desktop');
  el.replaceChildren(make('div', { class: 'faq-list' }, items.map((i) => i.details)));
  applyTextOverrides(el, ctx.overrides);
  const editorialState = editorial ? wireEditorial(el, ctx, items, media) : null;
  if (el.classList.contains('seo')) {
    writeJsonLd(el, ctx, n, items.map(({ seo }) => seo));
  }
  return { items: items.map((i) => i.details), editorial: editorialState };
}

export const MEMBERS = Object.freeze({
  faq: { origin: 'c2', compat: 'canonical', overrides: 'c2', viewportPrePass: false, decorate: decorateFaq },
  accordion: { origin: 'c1', compat: 'adapter', overrides: 'none', viewportPrePass: false, decorate: decorateAccordion },
});

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
