import { rowsOf, cellsOf, textOf, hasContent } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateViewportContent } from '../_shared/viewport.js';
import { decorateBlockText, applyTextOverrides } from '../_shared/text.js';
import { decorateBlockBg, applyAuthoredColour } from '../_shared/background.js';

const BLOCK = 'social-proof';
export const CLS = Object.freeze({
  inner: `${BLOCK}-inner`,
  foreground: `${BLOCK}-foreground`,
  media: `${BLOCK}-media`,
  figure: `${BLOCK}-figure`,
  logo: `${BLOCK}-logo`,
  body: `${BLOCK}-body`,
  quote: `${BLOCK}-quote`,
  text: `${BLOCK}-text`,
  caption: `${BLOCK}-caption`,
  author: `${BLOCK}-author`,
  role: `${BLOCK}-role`,
  line: `${BLOCK}-line`,
  hang: `${BLOCK}-hang`,
  hasBg: `${BLOCK}-has-bg`,
  backdrop: `${BLOCK}-backdrop`,
  extra: `${BLOCK}-extra`,
  toneLight: `${BLOCK}-tone-light`,
  toneDark: `${BLOCK}-tone-dark`,
});
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const COPY_NODES = ':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, '
  + ':scope > p, :scope > em, :scope > strong, :scope > blockquote p';
const LONG_FORM = ['xxlarge', 'contained', 'max-width-10-desktop'];
const C2_TEXT = Object.freeze({ origin: 'c2', heading: '3', body: 'lg', button: 'md' });
const OVERRIDE = /^(heading|body|button)-/;
const OPENING_QUOTE = /^(\s*)(\p{Pi})/u;
const EDS_HOST = /\.(hlx|aem)\./;

export function colourTone(value) {
  const v = String(value || '').trim().toLowerCase();
  let rgba = null;
  const hex = v.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    const h = hex[1].length <= 4 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
    rgba = [0, 2, 4, 6].map((i) => (i < h.length ? parseInt(h.slice(i, i + 2), 16) : 255));
    rgba[3] /= 255;
  }
  const fn = v.match(/^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)\s*(?:[,/]\s*(\d*\.?\d+)(%?)\s*)?\)$/);
  if (fn) {
    const alpha = fn[4] === undefined ? 1 : Number(fn[4]) / (fn[5] ? 100 : 1);
    rgba = [Number(fn[1]), Number(fn[2]), Number(fn[3]), alpha];
  }
  if (!rgba || rgba[3] < 1 || rgba.slice(0, 3).some((c) => c > 255)) return null;
  const [r, g, b] = rgba.slice(0, 3).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179 ? 'light' : 'dark';
}

function markTone(target, value) {
  const tone = colourTone(value);
  if (tone) target.classList.add(tone === 'light' ? CLS.toneLight : CLS.toneDark);
}

function svgLinksToPictures(el, make) {
  const base = el.ownerDocument.baseURI;
  el.querySelectorAll('a[href]').forEach((a) => {
    if (a.children.length) return;
    const text = a.textContent || '';
    const href = a.getAttribute('href') || '';
    if (!text.includes('.svg') && !href.includes('.svg')) return;
    const [first, ...rest] = text.split('|');
    let authored;
    let linked;
    try {
      authored = new URL(first.trim());
      linked = new URL(href, base);
    } catch (e) {
      return;
    }
    const alt = rest.join('|').trim();
    const sameFile = authored.pathname === linked.pathname;
    let src = authored.href;
    if (sameFile) src = href;
    else if (EDS_HOST.test(authored.hostname)) src = authored.pathname;
    const picture = make('picture', {}, make('img', { loading: 'lazy', src, alt }));
    if (sameFile) a.replaceWith(picture);
    else a.replaceChildren(picture);
  });
}

export function hangOpeningQuote(el, make) {
  if (!el) return null;
  const walker = el.ownerDocument.createTreeWalker(el, 4);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeValue.trim()) {
      const match = node.nodeValue.match(OPENING_QUOTE);
      if (!match) return null;
      node.nodeValue = node.nodeValue.slice(match[0].length);
      const span = make('span', { class: CLS.hang }, match[2]);
      node.before(span);
      return span;
    }
  }
  return null;
}

function removeIfEmpty(node) {
  if (node && !hasContent(node)) node.remove();
}

function copyNodesOf(cell) {
  return [...cell.querySelectorAll(COPY_NODES)];
}

function decorateQuote(el, ctx) {
  const { make } = ctx;
  if (el.classList.contains('long-form')) el.classList.add(...LONG_FORM);
  svgLinksToPictures(el, make);
  const rows = rowsOf(el);
  if (!rows.length) return;

  let bgRow = null;
  if (rows.length > 1 && rows[0].textContent.trim()) {
    // eslint-disable-next-line prefer-destructuring
    bgRow = rows[0];
    el.classList.add(CLS.hasBg);
    const bg = decorateBlockBg(el, bgRow);
    if (bg.kind === 'colour') markTone(el, bg.value);
    else if (bg.kind === 'media') bgRow.classList.add(CLS.backdrop);
  }

  const lastRow = rows[rows.length - 1];
  const cells = [...lastRow.querySelectorAll(':scope > div')];
  const cell = cells[0] || lastRow;
  if (!cell.firstElementChild && cell.textContent.trim()) {
    cell.append(make('p', {}, [...cell.childNodes]));
  }
  const before = rows.length > 1 ? rows[rows.length - 2] : null;
  const imageRow = before && before !== bgRow && before.querySelector('picture') ? before : null;

  const [quoteNode, ...lines] = copyNodesOf(cell);
  const figure = make('figure', { class: CLS.figure });
  const body = make('div', { class: CLS.body });
  const blockquote = make('blockquote', { class: CLS.quote });
  if (quoteNode) {
    quoteNode.classList.add(CLS.text);
    blockquote.append(quoteNode);
  }
  body.append(blockquote);

  const caption = make('figcaption', { class: CLS.caption });
  lines.forEach((line, i) => {
    line.classList.add(i === 0 ? CLS.author : CLS.role);
    if (i > 1) line.classList.add(CLS.line);
    caption.append(line);
  });
  const rest = [...cell.childNodes, ...cells.slice(1).flatMap((c) => [...c.childNodes])]
    .filter((n) => (n.nodeType === 1 ? hasContent(n) : (n.textContent || '').trim()));
  rest.forEach((n) => {
    if (n.nodeType === 1) {
      n.classList.add(CLS.line);
      caption.append(n);
    } else {
      caption.append(make('p', { class: CLS.line }, n));
    }
  });
  if (caption.childNodes.length) body.append(caption);

  if (imageRow) {
    imageRow.classList.add(CLS.logo);
    figure.append(imageRow);
  }
  figure.append(body);
  lastRow.remove();
  el.prepend(figure);

  rowsOf(el).forEach((row) => {
    if (row === bgRow) return;
    if (!hasContent(row)) row.remove();
    else row.classList.add(CLS.extra);
  });
}

function decorateBlockquoteForm(authored, make) {
  const figure = make('figure', { class: CLS.figure });
  const body = make('div', { class: CLS.body });
  const [quote, ...lines] = [...authored.children];
  authored.classList.add(CLS.quote);
  authored.replaceWith(figure);
  body.append(authored);
  figure.append(body);
  if (quote) {
    quote.classList.add(CLS.text, 's2-heading-3');
    hangOpeningQuote(quote, make);
  }
  if (lines.length) {
    const caption = make('figcaption', { class: `${CLS.caption} s2-body-lg` });
    lines.forEach((line, i) => {
      line.classList.add(i === 0 ? CLS.author : CLS.role);
      if (i > 1) line.classList.add(CLS.line);
      caption.append(line);
    });
    body.append(caption);
  }
  return figure;
}

function decorateHeadingForm(foreground, make) {
  decorateBlockText(foreground, C2_TEXT);
  const heading = foreground.querySelector(HEADINGS);
  if (!heading) return null;
  hangOpeningQuote(heading, make);
  const figure = make('figure', { class: CLS.figure });
  const body = make('div', { class: CLS.body });
  const blockquote = make('blockquote', { class: CLS.quote });
  const top = heading.parentElement === foreground
    ? heading
    : [...foreground.children].find((c) => c.contains(heading));
  const lines = [];
  for (let n = top.nextSibling; n; n = n.nextSibling) {
    if (n.nodeType === 1 || (n.textContent || '').trim()) lines.push(n);
  }
  heading.classList.add(CLS.text);
  top.replaceWith(figure);
  blockquote.append(top);
  body.append(blockquote);
  if (lines.length) {
    const caption = make('figcaption', { class: CLS.caption });
    lines.forEach((line, i) => {
      const node = line.nodeType === 1 ? line : make('p', { class: 's2-body-lg' }, line);
      node.classList.add(i === 0 ? CLS.author : CLS.role);
      if (i > 1) node.classList.add(CLS.line);
      caption.append(node);
    });
    body.append(caption);
  }
  figure.append(body);
  return figure;
}

function decorateContainer(block, ctx) {
  const { make } = ctx;
  const [firstRow, secondRow, ...others] = rowsOf(block);
  if (!firstRow) return;
  const [foreground, bgCell, ...moreCells] = cellsOf(firstRow);
  firstRow.classList.add(CLS.inner);

  if (bgCell) {
    if (bgCell.querySelector('img, picture, video')) {
      bgCell.classList.add(CLS.media);
    } else {
      const colour = textOf(bgCell);
      if (colour && applyAuthoredColour(firstRow, colour)) markTone(firstRow, colour);
      bgCell.remove();
    }
  }
  moreCells.forEach((c) => removeIfEmpty(c));

  if (secondRow) {
    const [mediaCell, ...rest] = cellsOf(secondRow);
    if (mediaCell && hasContent(mediaCell)) {
      mediaCell.classList.add(CLS.media);
      firstRow.append(mediaCell);
    }
    rest.filter(hasContent).forEach((c) => {
      c.classList.add(CLS.media);
      firstRow.append(c);
    });
    secondRow.remove();
  }
  others.forEach((row) => {
    if (hasContent(row)) row.classList.add(CLS.extra);
    else row.remove();
  });

  if (!foreground) return;
  foreground.classList.add(CLS.foreground);
  const authored = foreground.querySelector('blockquote');
  if (authored) {
    decorateBlockquoteForm(authored, make);
    return;
  }
  decorateHeadingForm(foreground, make);
}

function decorateSocialProof(el, ctx) {
  const authored = [...el.classList].filter((c) => OVERRIDE.test(c));
  const afterApply = (root) => {
    const live = [...root.classList].filter((c) => OVERRIDE.test(c));
    const all = [...new Set([...authored, ...live])];
    if (all.length) applyTextOverrides(ctx.make('div', { class: all.join(' ') }), 'c2', root);
    root.classList.remove(...all);
  };
  return decorateViewportContent(el, (block) => decorateContainer(block, ctx), { afterApply });
}

export const MEMBERS = Object.freeze({
  'social-proof': {
    origin: 'c2',
    compat: 'canonical',
    overrides: 'c2',
    viewportPrePass: true,
    decorate: (el, ctx) => {
      el.classList.add(BLOCK);
      return decorateSocialProof(el, ctx);
    },
  },
  quote: {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'none',
    viewportPrePass: false,
    decorate: (el, ctx) => {
      el.classList.add(BLOCK);
      return decorateQuote(el, ctx);
    },
  },
});

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
