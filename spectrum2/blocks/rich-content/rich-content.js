import { rowsOf, cellsOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateBlockText, applyTextOverrides, isTextRole, TEXT_DEFAULTS } from '../_shared/text.js';
import { decorateViewportContent } from '../_shared/viewport.js';
import { decorateBlockBg, isAuthoredColour } from '../_shared/background.js';
import { federatedUrl } from '../_shared/urls.js';
import { pageShims, getBlockSize, adoptMiloButtons } from '../_shared/s1-page.js';
import { decorateVideoLinks } from '../_shared/s1-video.js';

const BLOCK = 'rich-content';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const SVG_NS = 'http://www.w3.org/2000/svg';
const HERO_OVERLAY_PROP = '--rc-hero-overlay';
const OPENING_QUOTE = /^(\p{Pi}|["„‚「『｢﹁﹃＂⹂])/u;
const ARROW_PATH = 'm9.94946,4.99658c-.00024-.052-.02026-.10132-.02954-.15259-.01074-.05835-.0127-.11768-.03516-.17322-.00122-.00281-.00146-.00574-.00269-.00867-.03198-.07642-.08447-.13965-.13574-.20312-.01831-.02295-.02612-.0509-.04712-.07227l-.00488-.005c-.00024-.00024-.00049-.00049-.00098-.00085l-3.06934-3.11914c-.33984-.3457-.89355-.34863-1.2373-.01074-.34473.33887-.34961.89355-.01074,1.2373l1.6106,1.63672H.9248c-.4834,0-.875.3916-.875.875s.3916.875.875.875h6.06177l-1.6106,1.63672c-.33887.34375-.33398.89844.01074,1.2373.16992.16699.3916.25098.61328.25098.22656,0,.45215-.08691.62402-.26172l3.06934-3.11914c.00049-.00037.00073-.00061.00098-.00085l.00488-.005c.021-.02136.02881-.04932.04712-.07227.05127-.06348.10376-.12671.13574-.20312.00122-.00293.00146-.00586.00269-.00867.02246-.05554.02441-.11487.03516-.17322.00928-.05127.0293-.10059.02954-.15259,0-.00122.00073-.0022.00073-.00342s-.00073-.0022-.00073-.00342Z';

export const CLS = Object.freeze({
  c1: `${BLOCK}-c1`,
  c2: `${BLOCK}-c2`,
  foreground: `${BLOCK}-foreground`,
  content: `${BLOCK}-content`,
  background: `${BLOCK}-background`,
  hasBg: `${BLOCK}-has-bg`,
  overlaySource: `${BLOCK}-overlay-source`,
  quote: `${BLOCK}-opening-quote`,
  ctaContainer: `${BLOCK}-cta-container`,
  ctaArea: `${BLOCK}-cta-area`,
  mediaCell: `${BLOCK}-media-cell`,
  jumpLinks: `${BLOCK}-jump-links`,
  jumpList: `${BLOCK}-jump-list`,
  jumpLink: `${BLOCK}-jump-link`,
  jumpBadge: `${BLOCK}-jump-badge`,
  jumpLabel: `${BLOCK}-jump-label`,
  iconArea: `${BLOCK}-icon-area`,
  image: `${BLOCK}-image`,
  linkList: `${BLOCK}-link-list`,
  noHeading: `${BLOCK}-no-heading`,
  hspace: `${BLOCK}-hspace`,
  hasHeading: `${BLOCK}-has-heading`,
  gapXl: `${BLOCK}-gap-xl`,
  titleL: 's2-title-l',
});

export const OVERRIDE_PATTERN = Object.freeze({
  c1: /-(heading|body|detail)$/,
  c2: /^(heading|body|button)-/,
});

export const TEXT_SIZES = Object.freeze({
  standard: { small: ['s', 's', 's'], medium: ['m', 'm', 'm'], large: ['l', 'l', 'l'], xlarge: ['xl', 'xl', 'xl'] },
  inset: { small: ['s', 'm'], medium: ['m', 'l'], large: ['l', 'xl'], xlarge: ['xl', 'xxl'] },
  text: { xxsmall: ['xxs', 'xxs'], small: ['m', 's', 's'], medium: ['l', 'm', 'm'], large: ['xl', 'm', 'l'], xlarge: ['xxl', 'l', 'xl'] },
});
const C1_FALLBACK = [TEXT_DEFAULTS.c1.heading, TEXT_DEFAULTS.c1.body, TEXT_DEFAULTS.c1.detail];

function applyOverrides(root, grammar, make) {
  const classes = [...root.classList].filter((c) => OVERRIDE_PATTERN[grammar].test(c));
  if (!classes.length) return [];
  return applyTextOverrides(make('div', { class: classes.join(' ') }), grammar, root);
}

function firstTextNode(el) {
  const walker = el.ownerDocument.createTreeWalker(el, 4);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeValue !== '') return node;
  }
  return null;
}

export function hangOpeningQuote(header, make) {
  if (!header) return null;
  const match = header.textContent.match(OPENING_QUOTE);
  if (!match) return null;
  const node = firstTextNode(header);
  if (!node || !node.nodeValue.startsWith(match[1])) return null;
  node.nodeValue = node.nodeValue.slice(match[1].length);
  const span = make('span', { class: CLS.quote }, match[1]);
  header.prepend(span);
  return span;
}

function promoteParagraphHeading(content, headingSize, skipFirst) {
  if (!content || content.querySelector(HEADINGS)) return;
  const ps = [...content.querySelectorAll('p')];
  const target = skipFirst ? ps[1] : ps[0];
  if (!target) return;
  const bodyClass = [...target.classList].find((c) => c.startsWith('s2-body-'));
  if (bodyClass) target.classList.replace(bodyClass, `s2-heading-${headingSize}`);
}

function arrowIcon(doc) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 10 10');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  const g = doc.createElementNS(SVG_NS, 'g');
  g.setAttribute('transform', 'rotate(90 5 5)');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ARROW_PATH);
  path.setAttribute('fill', 'currentColor');
  g.append(path);
  svg.append(g);
  return svg;
}

function decorateJumpLinks(content, foreground, make) {
  if (!content || !foreground) return null;
  const jumpRow = [...content.querySelectorAll('p, div')]
    .filter((node) => node.querySelector('a'))
    .find((node) => [...node.childNodes].some((n) => n.nodeType === 3 && n.textContent.includes('|')));
  if (!jumpRow) return null;
  const doc = content.ownerDocument;
  const list = make('ul', { class: CLS.jumpList });
  [...jumpRow.querySelectorAll('a')].forEach((anchor) => {
    const label = make('span', { class: CLS.jumpLabel }, anchor.textContent.trim());
    const badge = make('span', { class: CLS.jumpBadge, 'aria-hidden': 'true' }, arrowIcon(doc));
    anchor.textContent = '';
    anchor.classList.add(CLS.jumpLink);
    anchor.append(badge, label);
    list.append(make('li', {}, anchor));
  });
  const nav = make('nav', { class: CLS.jumpLinks, 'aria-label': 'Jump to section' }, list);
  jumpRow.remove();
  foreground.append(nav);
  return nav;
}

const c2Text = () => ({ ...TEXT_DEFAULTS.c2, origin: 'c2' });

function decorateMediaVariant(container) {
  const row = container.children[0];
  if (!row) return;
  const [ctaCell, mediaCell] = [...row.children];
  if (!ctaCell && !mediaCell) return;
  if (mediaCell && (mediaCell.textContent.trim() || mediaCell.children.length)) {
    mediaCell.classList.add(CLS.mediaCell);
    container.append(mediaCell);
  } else {
    mediaCell?.remove();
  }
  if (ctaCell) {
    decorateBlockText(ctaCell, c2Text());
    ctaCell.classList.add(CLS.ctaArea);
    container.append(ctaCell);
  }
  row.remove();
  container.querySelector('.s2-action-area')?.classList.add('dark');
  container.querySelector('.s2-button.s2-button-accent')?.classList.replace('s2-button-accent', 's2-button-fill');
}

function decorateContainer(block, root, ctx) {
  const { make } = ctx;
  decorateVideoLinks(block, { make });
  if (root.classList.contains('media')) {
    decorateMediaVariant(block);
    adoptMiloButtons(block);
    return;
  }
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add(CLS.content);
  foreground?.classList.add(CLS.foreground);
  if (content) {
    decorateBlockText(content, c2Text());
    hangOpeningQuote(content.querySelector('h1, h2, h3, h4, h5, h6, p'), make);
  }
  const bgCell = foreground?.children[1];
  if (bgCell && !bgCell.querySelector('picture, img') && bgCell.textContent.trim()) {
    bgCell.classList.add(CLS.overlaySource);
  }
  const isJumpLink = root.classList.contains('jump-link');
  promoteParagraphHeading(content, '2', isJumpLink);
  const firstP = content && [...content.querySelectorAll('p')].find((p) => p.querySelector('picture, img'));
  const iconImg = firstP?.querySelector('img[src]');
  if (iconImg) iconImg.setAttribute('src', federatedUrl(iconImg.getAttribute('src'), block.ownerDocument.defaultView));
  const bodyClass = firstP && [...firstP.classList].find((c) => c.startsWith('s2-body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, 's2-eyebrow');
  adoptMiloButtons(block);
  if (isJumpLink) decorateJumpLinks(content, foreground, make);
}

export const SECTION_GROUND_CLASS = 'rich-content-section-ground';
function groundSection(el, background) {
  const section = el.parentElement;
  if (!el.hasAttribute('data-spectrum2-prologue') || !section?.classList.contains('section')) return;
  if (background?.kind === 'colour' && background.value) {
    section.style.setProperty('background', background.value);
    section.classList.add(SECTION_GROUND_CLASS);
  }
}

function applyHeroOverlay(el) {
  const section = el.closest('.section');
  if (!section) return;
  const text = el.querySelector(`.${CLS.overlaySource}`)?.textContent.trim();
  if (text && isAuthoredColour(text)) section.style.setProperty(HERO_OVERLAY_PROP, text);
  else section.style.removeProperty(HERO_OVERLAY_PROP);
}

function showLowestViewport(el, viewports, afterApply) {
  const [lowest] = Object.keys(viewports.content || {});
  if (!lowest) return false;
  const { container, variants } = viewports.content[lowest];
  el.classList.remove(...viewports.allVariants);
  if (variants.length) el.classList.add(...variants);
  el.replaceChildren(...container.children);
  afterApply(el);
  return true;
}

function decorateRichContent(el, ctx) {
  const { make } = ctx;
  el.classList.add(BLOCK, CLS.c2);
  pageShims(el, make);
  const afterApply = (root) => applyOverrides(root, ctx.overrides, make);
  const decorateOne = (block, root) => decorateContainer(block, root, ctx);
  const viewports = decorateViewportContent(el, decorateOne, { afterApply });
  if (viewports.hasViewportVariations && !viewports.applied) {
    viewports.applied = showLowestViewport(el, viewports, afterApply);
  }
  if (el.classList.contains('media')) el.classList.add('dark');
  applyHeroOverlay(el);
  const Observer = el.ownerDocument.defaultView?.MutationObserver;
  if (viewports.hasViewportVariations && Observer) {
    new Observer(() => applyHeroOverlay(el)).observe(el, { childList: true });
  }
  return viewports;
}

function decorateCellText(cell, [heading, body, detail]) {
  const cfg = {
    origin: 'c1',
    heading: isTextRole('c1', 'heading', heading) ? heading : null,
    body: isTextRole('c1', 'body', body) ? body : null,
    detail: isTextRole('c1', 'detail', detail) ? detail : null,
  };
  decorateBlockText(cell, cfg);
  if (heading && !cfg.heading && !cell.classList.contains('default')) {
    cell.querySelectorAll(HEADINGS).forEach((h) => h.classList.add(`s2-heading-${heading}`));
  }
}

function decorateMultiViewport(row) {
  const cells = cellsOf(row);
  if (cells.length !== 2 && cells.length !== 3) return;
  cells.forEach((cell, i) => {
    if (i === 0) cell.classList.add('s2-mobile-up');
    else if (cells.length === 2) cell.classList.add('s2-tablet-up', 's2-desktop-up');
    else cell.classList.add(i === 1 ? 's2-tablet-up' : 's2-desktop-up');
  });
}

function decorateIconArea(cell, authored) {
  const first = cell.children[0];
  if (first?.querySelector('img')) {
    const area = authored.match(/-(lockup|icon)/);
    first.classList.add(area ? `${BLOCK}-${area[1]}-area` : CLS.image);
  }
  cell.querySelectorAll(HEADINGS).forEach((h) => {
    const prev = h.previousElementSibling;
    if (prev?.childElementCount && [...prev.children].every((c) => c.nodeName === 'PICTURE')) {
      prev.classList.add(CLS.iconArea);
    }
  });
}

function decorateLinkFarm(el, make) {
  const [title, links] = el.querySelectorAll(`:scope > .${CLS.foreground}`);
  if (!links) return;
  const hCount = links.querySelectorAll(HEADINGS).length;
  title?.querySelector(HEADINGS)?.classList.add('s2-heading-l');
  links.querySelectorAll('p').forEach((p) => p.classList.add('s2-body-s'));
  [...links.querySelectorAll('div')].forEach((column, index) => {
    column.setAttribute('role', 'list');
    [...column.children].filter((child) => !child.matches(HEADINGS)).forEach((child) => child.setAttribute('role', 'listitem'));
    const heading = column.querySelector(HEADINGS);
    heading?.classList.add('s2-heading-xs');
    if (!hCount) return;
    if (!heading) {
      column.prepend(make('div', { class: CLS.noHeading, 'aria-hidden': 'true' }));
      return;
    }
    const sibling = index % 2 === 0 ? column.nextElementSibling : column.previousElementSibling;
    sibling?.classList.add(CLS.hspace);
    if (index > 0) column.classList.add(CLS.hasHeading);
    if (index > 1) links.classList.add(CLS.gapXl);
  });
}

function markLinkLists(el) {
  const allowed = (n) => n.nodeType === 1 && n.tagName === 'A'
    && (!n.className || (n.classList.contains('modal') && n.classList.contains('link-block')));
  el.querySelectorAll('[class*="s2-body-"]').forEach((body) => {
    if ([...body.childNodes].every((n) => allowed(n) || (n.nodeType === 3 && n.textContent.trim() === ''))) {
      body.classList.add(CLS.linkList);
    }
  });
}

function decorateTextBlock(el, ctx) {
  const { make } = ctx;
  const authored = el.className;
  el.classList.add(BLOCK, CLS.c1);
  pageShims(el, make);
  decorateVideoLinks(el, { make });

  let rows = rowsOf(el);
  let background = null;
  if (rows.length > 1 || (rows.length && el.classList.contains('accent-bar'))) {
    if (rows[0].textContent !== '') el.classList.add(CLS.hasBg);
    const [head, ...tail] = rows;
    background = decorateBlockBg(el, head, { className: CLS.background });
    rows = tail;
    if (background.kind === 'colour' && !el.classList.contains('dark')) el.classList.add('light');
    groundSection(el, background);
  }

  const helperClasses = [];
  let blockType = 'text';
  const size = el.classList.contains('legal') ? 'xxsmall' : getBlockSize(el);
  ['inset', 'long-form', 'bio'].forEach((variant, index) => {
    if (!el.classList.contains(variant)) return;
    helperClasses.push('max-width-8-desktop');
    blockType = index > 0 ? 'standard' : variant;
  });
  const sizes = TEXT_SIZES[blockType][size] || C1_FALLBACK;
  const hasLinkFarm = el.classList.contains('link-farm');
  rows.forEach((row) => {
    row.classList.add(CLS.foreground);
    if (!hasLinkFarm) {
      cellsOf(row).forEach((cell) => decorateCellText(cell, sizes));
      decorateMultiViewport(row);
    }
    cellsOf(row).forEach((cell) => decorateIconArea(cell, authored));
  });
  if (el.classList.contains('full-width')) helperClasses.push('max-width-8-desktop', 'center', 'xxl-spacing');
  if (el.classList.contains('intro')) helperClasses.push('max-width-8-desktop', 'xxl-spacing-top', 'xl-spacing-bottom');
  if (el.classList.contains('vertical')) el.querySelector('.s2-action-area')?.classList.add('s2-body-s');
  if (hasLinkFarm) decorateLinkFarm(el, make);
  el.classList.add(...helperClasses);
  const overrides = applyOverrides(el, ctx.overrides, make);

  adoptMiloButtons(el);
  const lastActionArea = el.querySelector('.s2-action-area:last-of-type');
  if (lastActionArea) {
    const container = make('div', { class: CLS.ctaContainer });
    lastActionArea.after(container);
    container.append(lastActionArea);
  }
  if (el.classList.contains('l-title')) {
    el.querySelectorAll('[class*="s2-detail-"]').forEach((detail) => detail.classList.add(CLS.titleL));
  }
  if (el.classList.contains('link-spacer')) markLinkLists(el);
  return { bands: rows, background, sizes, overrides };
}

export const MEMBERS = Object.freeze({
  'rich-content': { origin: 'c2', compat: 'canonical', overrides: 'c2', viewportPrePass: true, decorate: decorateRichContent },
  text: { origin: 'c1', compat: 'adapter', overrides: 'c1', viewportPrePass: false, decorate: decorateTextBlock },
});

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
