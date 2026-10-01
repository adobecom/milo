import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateBlockText, applyTextOverrides, isTextRole, roleClass } from '../_shared/text.js';
import { decorateButtons } from '../_shared/buttons.js';
import { decorateBlockBg, applyAuthoredColour, setBackgroundFocus } from '../_shared/background.js';
import { pageShims, getBlockSize, decorateBlockHrs } from '../_shared/s1-page.js';
import { decorateVideoLinks } from '../_shared/s1-video.js';

const BLOCK = 'hero-marquee';
const HEADINGS = 'h1, h2, h3, h4, h5, h6';
const ROW_KEYWORD = 'con-block-row-';
const CONTENT_TYPES = ['list', 'qrcode', 'lockup', 'text', 'bgcolor', 'supplemental'];
const HERO_TEXT = Object.freeze({ heading: 'xxl', body: 'm', detail: 'l' });
const MEDIA_COVER = ['media-cover', 'media-cover-left', 'media-cover-right', 'media-cover-top', 'media-cover-bottom'];
const BUTTON_SIZE = Object.freeze({ s: 's', m: 'm', l: 'l', xl: 'l', xxl: 'xl' });
const HERO_BUTTON = 'l';
const LOCKUP_SIZES = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];
const FIT = ['fill', 'contain', 'cover', 'none', 'scale-down'];
const MARQUEE_SIZES = { small: ['xl', 'm', 'm'], medium: ['xl', 'm', 'm'], large: ['xxl', 'xl', 'l'], xlarge: ['xxl', 'xl', 'l'] };
const ANCHOR_SIZES = { xsmall: ['xs', 'xs', 'xs'], small: ['m', 's', 's'], medium: ['l', 'm', 'm'], large: ['xl', 'm', 'l'], xlarge: ['xxl', 'l', 'xl'] };
const C1_PAGE_DEFAULT = ['m', 's', 'm'];
const MAS_WAIT_MS = 3000;
const MERCH_HREF = /mas\.adobe\.com\/studio\.html|\/tools\/ost\?|\/miniplans/;
const QUERIES = { mobile: '(width < 768px)', tablet: '(768px <= width < 1280px)', desktop: '(width >= 1280px)' };
const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  play: ['0 0 20 20', 'M4.749 18.004c-.398 0-.795-.108-1.153-.321C2.91 17.273 2.5 16.55 2.5 15.75V4.249c0-.799.41-1.521 1.096-1.932.685-.409 1.515-.43 2.219-.05L16.516 8.02C17.246 8.41 17.7 9.17 17.7 10s-.453 1.589-1.184 1.981L5.815 17.732c-.336.182-.702.272-1.066.272m.003-14.508c-.178 0-.318.068-.387.11-.11.065-.365.26-.365.643v11.502c0 .384.255.578.365.644s.402.198.74.017l10.7-5.75c.357-.193.395-.527.395-.662s-.038-.469-.394-.661L5.105 3.588c-.126-.067-.246-.092-.353-.092'],
  anchor: ['0 0 20 20', 'M3.755 7.243c.287-.299.762-.308 1.06-.02l5.183 4.986 5.197-4.999c.298-.288.773-.278 1.06.02.287.297.278.773-.02 1.06l-5.717 5.5c-.29.28-.75.28-1.04 0L3.776 8.303c-.153-.147-.23-.344-.23-.54 0-.188.07-.375.21-.52'],
  external: ['0 0 14 14', 'M12.05 1H5.164a.949.949 0 1 0 0 1.898h4.595l-8.18 8.18a.95.95 0 0 0 1.344 1.344l8.18-8.18v4.595a.949.949 0 1 0 1.898 0V1.949A.95.95 0 0 0 12.05 1'],
};

const c1Text = ([heading, body, detail], type = null) => ({ origin: 'c1', heading, body, detail, type });

function icon(doc, name, cls) {
  const [viewBox, d] = ICONS[name];
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return svg;
}

export function isMerchLink(a) {
  if (!a || a.nodeName !== 'A') return false;
  if (a.closest('mas-field')) return true;
  if (a.classList.contains('merch') || a.getAttribute('is') === 'checkout-link') return true;
  return MERCH_HREF.test(a.getAttribute('href') || '');
}

function guardMerch(root, fn) {
  const marked = [];
  root.querySelectorAll('a').forEach((a) => {
    if (!isMerchLink(a)) return;
    [a, ...a.querySelectorAll('*')].forEach((node) => {
      const add = ['merch', 'link-block'].filter((c) => !node.classList.contains(c));
      if (!add.length) return;
      node.classList.add(...add);
      marked.push([node, add]);
    });
  });
  try {
    return fn();
  } finally {
    marked.forEach(([node, add]) => {
      node.classList.remove(...add);
      if (!node.classList.length) node.removeAttribute('class');
    });
  }
}

async function settleMasFields(el) {
  const pending = [...el.querySelectorAll('mas-field')].filter((mf) => typeof mf.checkReady === 'function'
    && !mf.querySelector(':scope > [data-role="mas-field-content"]'));
  if (!pending.length) return;
  const win = el.ownerDocument.defaultView;
  const ready = Promise.all(pending.map((mf) => Promise.resolve()
    .then(() => mf.checkReady())
    .catch(() => false)));
  let timer;
  const wait = new Promise((resolve) => { timer = win.setTimeout(resolve, MAS_WAIT_MS); });
  await Promise.race([ready, wait]);
  win.clearTimeout(timer);
}

function adobeTvVideos(el) {
  el.querySelectorAll('a[href*=".mp4"]').forEach((a) => {
    if ((a.getAttribute('href') || '').includes('tv.adobe.com')) a.classList.add('video', 'link-block');
  });
}

function playIcons(el) {
  el.querySelectorAll('span.icon.icon-play').forEach((span) => {
    if (span.childNodes.length) return;
    span.append(icon(el.ownerDocument, 'play', 'hero-marquee-icon-svg'));
  });
}

function adoptMiloButtons(el) {
  el.querySelectorAll('.action-area').forEach((node) => node.classList.add('s2-action-area'));
  el.querySelectorAll('a.con-button:not(.s2-button)').forEach((a) => {
    if (isMerchLink(a)) return;
    a.classList.add('s2-button', a.classList.contains('blue') ? 's2-button-accent' : 's2-button-outline');
    const milo = [...a.classList].find((c) => /^button-(s|m|l|xl|xxl)$/.test(c));
    if (milo) a.classList.add(`s2-button-size-${BUTTON_SIZE[milo.slice(7)]}`);
  });
}

function sizeButtons(root, size, justify) {
  root.querySelectorAll('.s2-button').forEach((button) => {
    if (![...button.classList].some((c) => c.startsWith('s2-button-size-'))) button.classList.add(`s2-button-size-${size}`);
    if (justify) button.classList.add('hero-marquee-cta-justified');
  });
}

function buttons(root, size) {
  return guardMerch(root, () => decorateButtons(root, size));
}

function blockText(root, cfg) {
  guardMerch(root, () => decorateBlockText(root, cfg));
}

const CHANNEL = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
export function authoredLuminance(value) {
  const colours = [];
  const text = String(value || '').toLowerCase();
  text.replace(/#([0-9a-f]{3,8})\b/g, (m, hex) => {
    let h = hex;
    if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map((x) => x + x).join('');
    if (h.length === 6 || h.length === 8) {
      colours.push([0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)));
    }
    return m;
  });
  text.replace(/rgba?\(([^)]*)\)/g, (m, args) => {
    const parts = args.split(/[\s,/]+/).filter(Boolean).slice(0, 3);
    const rgb = parts.map((p) => (p.endsWith('%') ? parseFloat(p) * 2.55 : parseFloat(p)));
    if (rgb.length === 3 && rgb.every((n) => Number.isFinite(n))) colours.push(rgb);
    return m;
  });
  text.replace(/\b(white|black)\b/g, (m, name) => {
    colours.push(name === 'white' ? [255, 255, 255] : [0, 0, 0]);
    return m;
  });
  if (!colours.length) return null;
  const lum = colours.map(([r, g, b]) => 0.2126 * CHANNEL(r)
    + 0.7152 * CHANNEL(g)
    + 0.0722 * CHANNEL(b));
  return lum.reduce((a, b) => a + b, 0) / lum.length;
}

function themeFromAuthoredColour(el) {
  if (el.classList.contains('dark') || el.classList.contains('light')) return null;
  const lum = authoredLuminance(el.style.getPropertyValue('--_authored-bg'));
  if (lum === null) return null;
  const theme = lum > 0.179 ? 'light' : 'dark';
  el.classList.add(theme);
  return theme;
}

async function prepare(el, ctx, { member, heroVideo }) {
  const authored = [...el.classList];
  el.classList.add(BLOCK, `hero-marquee-member-${member}`);
  pageShims(el, ctx.make);
  if (heroVideo) adobeTvVideos(el);
  decorateVideoLinks(el, { autoplayByDefault: heroVideo, make: ctx.make });
  await settleMasFields(el);
  playIcons(el);
  return authored;
}

function finish(el, authored) {
  adoptMiloButtons(el);
  themeFromAuthoredColour(el);
  const paints = el.style.getPropertyValue('--_authored-bg').trim() || el.querySelector(':scope > .s2-background');
  if (paints) el.classList.add('hero-marquee-authored-surface');
  authored.forEach((cls) => el.classList.add(cls));
}

function handleObjectFit(bgRow) {
  const doc = bgRow.ownerDocument;
  bgRow.querySelectorAll('div').forEach((cell) => {
    const pic = cell.querySelector('picture');
    const img = pic?.querySelector('img');
    if (!img) return;
    const filled = [...cell.querySelectorAll('p')]
      .filter((p) => [...p.childNodes].some((n) => n.nodeType === 1 || n.textContent.trim()));
    let text = filled.length > 2 ? filled[1].textContent.trim() : '';
    if (!text && cell.textContent) text = cell.textContent;
    if (!text) return;
    const config = text.split(',').map((c) => c.toLowerCase().trim());
    const fit = FIT.filter((c) => config.includes(c));
    const focus = config.filter((c) => !fit.includes(c));
    if (fit.length) img.style.setProperty('--_object-fit', fit[0]);
    cell.replaceChildren(pic, doc.createTextNode(focus.join(',')));
  });
}

export function keywordOf(row) {
  const text = (row?.children[0]?.textContent || '').toLowerCase().trim();
  if (!text.includes(ROW_KEYWORD)) return null;
  const value = text.replace(ROW_KEYWORD, '').trim();
  const match = value.match(/^(\w+)\s*\((.*)\)$/);
  if (!match) return { key: value, classes: [] };
  const classes = match[2].split(',').map((c) => c.trim()).filter((c) => /^[a-z0-9-]+$/.test(c));
  return { key: match[1], classes };
}

function distillClasses(row, classes) {
  classes.forEach((cls) => {
    const type = ['heading', 'body', 'detail', 'button'].find((t) => cls.endsWith(`-${t}`));
    if (!type) return;
    row.classList.remove(cls);
    const size = cls.split('-')[0];
    if (type !== 'button' && isTextRole('c1', type, size)) row.classList.add(roleClass('c1', type, size));
  });
}

function decorateList(row, classes, make) {
  row.classList.add('s2-body-l');
  row.querySelectorAll('li').forEach((item) => {
    const first = item.children[0];
    const isIcon = first?.classList.contains('icon');
    const svg = first?.querySelector('img[src*=".svg"]');
    if (isIcon || svg) item.classList.add('hero-marquee-icon-item');
    if (svg) {
      svg.parentElement.classList.add('hero-marquee-list-icon');
      item.closest('ul, ol')?.classList.add('hero-marquee-has-svg-bullet');
      const listText = make('div', { class: 'hero-marquee-list-text' });
      [...item.childNodes].forEach((node) => { if (node !== first) listText.append(node); });
      item.append(listText);
    }
    item.parentElement?.classList.add('hero-marquee-icon-list');
  });
  distillClasses(row, classes);
}

function decorateQr(row) {
  const text = row.querySelector(':scope > div');
  if (!text) return;
  const classes = ['hero-marquee-qr-code-img', 'hero-marquee-google-play', 'hero-marquee-app-store'];
  [...text.children].forEach((node, i) => { if (classes[i]) node.classList.add(classes[i]); });
}

function lockupSize(cls) {
  const size = cls?.split('-')[0];
  return LOCKUP_SIZES.includes(size) ? size : 'l';
}

function lockupLabels(nodes, make) {
  nodes.forEach((node) => {
    if (node.nodeType === 3) {
      if (node.nodeValue.trim()) node.replaceWith(make('span', { class: 'hero-marquee-lockup-label' }, node.nodeValue));
    } else if (!node.childElementCount && node.textContent.trim()) {
      node.replaceWith(make('span', { class: 'hero-marquee-lockup-label' }, node.textContent.trim()));
    }
  });
}

function lockupFromContent(copy, make) {
  const first = copy.querySelector(':scope > p');
  if (!first?.querySelector('img')) return;
  first.classList.add('hero-marquee-lockup-area');
  lockupLabels([...first.childNodes].filter((n) => n.nodeType === 3), make);
}

function decorateLockupRow(row, classes, make) {
  const child = row.querySelector(':scope > div');
  child?.classList.add('hero-marquee-lockup-area');
  const used = classes.find((c) => c.endsWith('-icon')) || classes.find((c) => c.endsWith('-lockup'));
  if (used) row.classList.remove(used);
  row.classList.add(`hero-marquee-lockup-${lockupSize(used)}`);
  if (child) lockupLabels([...child.children], make);
}

function wrapInP(row, make) {
  const inner = row.querySelector(':scope > div');
  if (!inner || [...inner.childNodes].some((node) => node.nodeName === 'P')) return;
  const p = make('p');
  p.append(...inner.childNodes);
  inner.append(p);
}

function decorateTextRow(row, classes, make) {
  row.classList.add('hero-marquee-norm');
  wrapInP(row, make);
  const btnClass = classes.find((c) => c.endsWith('-button'));
  let size = HERO_BUTTON;
  if (btnClass) {
    size = BUTTON_SIZE[btnClass.split('-').reverse()[1]] ?? HERO_BUTTON;
    row.classList.remove(btnClass);
  }
  buttons(row, size);
  blockText(row, c1Text([HERO_TEXT.heading, HERO_TEXT.body, HERO_TEXT.detail]));
  applyTextOverrides(row, 'c1');
}

function decorateKeywordRow(el, row, { key, classes }, make) {
  row.classList.add('hero-marquee-row');
  if (/^[a-z0-9-]+$/.test(key)) row.classList.add(`hero-marquee-row-${key}`);
  if (classes.length) row.classList.add(...classes);
  const cols = cellsOf(row);
  cols[0]?.remove();
  cols[1]?.classList.add('hero-marquee-row-wrapper');
  if (!CONTENT_TYPES.includes(key)) return;
  if (key === 'bgcolor') {
    applyAuthoredColour(el, row.textContent.trim());
    row.remove();
  } else if (key === 'lockup') {
    decorateLockupRow(row, classes, make);
  } else if (key === 'qrcode') {
    decorateQr(row);
  } else if (key === 'list') {
    decorateList(row, classes, make);
  } else if (key === 'supplemental') {
    row.classList.add('hero-marquee-norm');
    distillClasses(row, classes);
  } else if (key === 'text') {
    decorateTextRow(row, classes, make);
  }
}

export function viewportOrder(viewport, content) {
  const groups = { 0: [] };
  [...content.children].forEach((node) => {
    const order = { tablet: null, desktop: null };
    node.classList.forEach((cls) => {
      if (!cls.startsWith('order-') || (!cls.endsWith('desktop') && !cls.endsWith('tablet'))) return;
      order.tablet = order.tablet || (cls.endsWith('tablet') ? cls : null);
      order.desktop = order.desktop || (cls.endsWith('desktop') ? cls : null);
    });
    const n = parseInt((order[viewport] || order.tablet)?.split('-')[1], 10);
    const key = Number.isInteger(n) ? n : 0;
    (groups[key] = groups[key] || []).push(node);
  });
  return Object.keys(groups).sort((a, b) => a - b).flatMap((key) => groups[key]);
}

function applyOrder(content, nodes) {
  const current = [...content.children];
  if (nodes.length === current.length && nodes.every((node, i) => node === current[i])) return;
  content.replaceChildren(...nodes);
}

function handleViewportOrder(copy) {
  if (!copy.querySelector(':scope > div[class*="order-"]')) return;
  const win = copy.ownerDocument.defaultView;
  const orders = { mobile: [...copy.children], tablet: viewportOrder('tablet', copy), desktop: viewportOrder('desktop', copy) };
  Object.entries(QUERIES).forEach(([viewport, query]) => {
    const mq = win?.matchMedia?.(query);
    if (!mq) return;
    if (mq.matches) applyOrder(copy, orders[viewport]);
    mq.addEventListener?.('change', (e) => { if (e.matches) applyOrder(copy, orders[viewport]); });
  });
}

async function decorateHeroMarquee(el, ctx) {
  const { make } = ctx;
  const authored = await prepare(el, ctx, { member: 'hero', heroVideo: true });
  let rows = rowsOf(el);
  if (rows.length > 1 && rows[0].textContent !== '') {
    el.classList.add('hero-marquee-has-bg');
    const [head, ...tail] = rows;
    handleObjectFit(head);
    decorateBlockBg(el, head, { useHandleFocalpoint: true });
    rows = tail;
  }

  const mainRowIndex = rows.findIndex((row) => !keywordOf(row));
  const foreground = rows[mainRowIndex];
  if (!foreground) {
    finish(el, authored);
    return;
  }
  const cells = cellsOf(foreground);
  foreground.classList.add('hero-marquee-foreground', `hero-marquee-cols-${cells.length}`);
  const anyTag = foreground.querySelector(`p, ${HEADINGS}`);
  const copy = anyTag?.closest('div') || cells[0] || foreground;
  copy.classList.add('hero-marquee-copy');
  const asset = foreground.querySelector('div > picture, .s2-video, :is(.video-container, .pause-play-wrapper), '
    + 'div > video, div > a[href*=".mp4"], div > a.s2-image-link, div > a.image-link');
  const nested = [...foreground.querySelectorAll('div > div')];

  if (asset) {
    asset.parentElement.classList.add('hero-marquee-asset');
    setBackgroundFocus(asset);
    const cover = MEDIA_COVER.filter((cls) => el.classList.contains(cls)).pop();
    if (cover) {
      asset.style.setProperty('--_media-cover-position', cover.split('-')[2] ?? 'center top');
      el.append(make('div', { class: 'hero-marquee-foreground-media' }, asset));
    }
  } else {
    cells.forEach((cell) => { if (cell.childElementCount === 0) cell.classList.add('hero-marquee-empty-asset'); });
  }
  if (nested.length === 2 && nested[1].classList.length === 0) nested[1].classList.add('hero-marquee-asset-unknown');

  blockText(copy, c1Text([HERO_TEXT.heading, HERO_TEXT.body, HERO_TEXT.detail], 'hasDetailHeading'));
  lockupFromContent(copy, make);
  const rootButton = authored.find((cls) => cls.endsWith('-button'));
  sizeButtons(copy, rootButton === 'xxl-button' ? 'xl' : HERO_BUTTON, true);

  if (cells[0]?.classList.contains('hero-marquee-asset')) el.classList.add('hero-marquee-asset-left');
  const lockupClass = authored.find((cls) => cls.endsWith('-lockup'));
  const mainCopy = make('div', { class: `hero-marquee-main-copy hero-marquee-lockup-${lockupSize(lockupClass)}` });
  mainCopy.append(...copy.childNodes);
  const others = rows.filter((row) => row !== foreground);
  const prepend = new Set(rows.slice(0, Math.max(mainRowIndex, 0)));
  copy.append(mainCopy);
  others.forEach((row) => (prepend.has(row) ? mainCopy.before(row) : copy.append(row)));
  others.forEach((row) => {
    const keyword = keywordOf(row);
    if (keyword) {
      decorateKeywordRow(el, row, keyword, make);
    } else {
      row.classList.add('hero-marquee-norm');
      decorateBlockHrs(row, make);
      buttons(row, HERO_BUTTON);
    }
  });
  others.forEach((row) => { if (row.isConnected) sizeButtons(row, HERO_BUTTON, true); });
  applyTextOverrides(el, 'c1', mainCopy);
  handleViewportOrder(copy);
  finish(el, authored);
}

function marqueeSize(el) {
  const size = getBlockSize(el);
  return MARQUEE_SIZES[size] ? size : 'medium';
}

function decorateMarqueeText(text, size) {
  const headings = text.querySelectorAll(HEADINGS);
  const heading = headings[headings.length - 1];
  if (!heading) return;
  const [h, body, detail] = MARQUEE_SIZES[size];
  heading.classList.add(roleClass('c1', 'heading', h));
  heading.nextElementSibling?.classList.add(roleClass('c1', 'body', body));
  const sib = heading.previousElementSibling;
  if (!sib) return;
  sib.classList.add(sib.querySelector('img, .icon') ? 'hero-marquee-icon-area' : roleClass('c1', 'detail', detail));
  sib.previousElementSibling?.classList.add('hero-marquee-icon-area');
}

function labelEmptiedLink(a, oldText, picture) {
  const alt = picture.querySelector('img')?.getAttribute('alt')?.trim();
  if (!alt && oldText && !a.hasAttribute('aria-label')) a.setAttribute('aria-label', oldText);
}

function decorateMultipleIconArea(iconArea) {
  let count = 0;
  iconArea.querySelectorAll(':scope picture').forEach((picture) => {
    count += 1;
    const src = picture.querySelector('img')?.getAttribute('src');
    const a = picture.nextElementSibling;
    if (count > 1) iconArea.dataset.iconCount = String(count);
    if (src?.endsWith('.svg') || a?.tagName !== 'A') return;
    if (!a.querySelector('img')) {
      const oldText = textOf(a);
      a.replaceChildren(picture);
      a.removeAttribute('class');
      labelEmptiedLink(a, oldText, picture);
    }
  });
}

function decorateImage(media) {
  media.classList.add('hero-marquee-image');
  const link = media.querySelector('a');
  const picture = media.querySelector('picture');
  if (link && picture && !link.parentElement.classList.contains('modal-img-link') && !isMerchLink(link)) {
    const oldText = textOf(link);
    link.textContent = '';
    link.append(picture);
    labelEmptiedLink(link, oldText, picture);
  }
}

function decorateSplit(el, foreground, media, make) {
  if (foreground && media) {
    const index = [...foreground.children].indexOf(media);
    media.classList.add('hero-marquee-bleed');
    foreground.insertAdjacentElement(index ? 'afterend' : 'beforebegin', media);
  }
  if (!media) return;
  const last = media.lastChild;
  const txt = last?.textContent?.trim();
  if (txt?.match(/^http.*\.mp4/) || last?.nodeName === 'VIDEO' || media.querySelector('.s2-video, video')) return;
  let credit = null;
  if (txt) credit = make('p', { class: 's2-body-s' }, txt);
  else if (media.lastElementChild && media.lastElementChild.tagName !== 'PICTURE') credit = media.lastElementChild;
  if (!credit) return;
  el.append(make('div', { class: 'hero-marquee-media-credit hero-marquee-container' }, credit));
  el.classList.add('hero-marquee-has-credit');
  if (txt) last.remove();
}

async function decorateMarquee(el, ctx) {
  const { make } = ctx;
  const authored = await prepare(el, ctx, { member: 'marquee', heroVideo: true });
  if (!['light', 'quiet'].some((cls) => el.classList.contains(cls))) el.classList.add('dark');
  const children = rowsOf(el);
  const foreground = children[children.length - 1];
  let background = null;
  if (children.length > 1) {
    decorateBlockBg(el, children[0], { useHandleFocalpoint: true });
    background = children[0].isConnected ? children[0] : null;
  }
  if (!foreground) {
    finish(el, authored);
    return;
  }
  foreground.classList.add('hero-marquee-foreground', 'hero-marquee-container');
  const headline = foreground.querySelector(HEADINGS);
  const divs = cellsOf(foreground).filter((node) => node.tagName === 'DIV');
  const text = headline?.closest('div')
    ?? divs.find((div) => !div.querySelector('picture, video, .s2-video, a[href*=".mp4"]')
      && (textOf(div) || div.querySelector('mas-field, [is="inline-price"]')))
    ?? divs[0];
  text?.classList.add('hero-marquee-text');
  const media = foreground.querySelector(':scope > div:not([class])');
  if (media) {
    media.classList.add('hero-marquee-asset');
    if (!media.querySelector('video, .s2-video, a[href*=".mp4"]')) decorateImage(media);
  }
  if (foreground.querySelector(':scope > div')?.classList.contains('hero-marquee-asset')) {
    el.classList.add('hero-marquee-row-reversed');
  }
  const size = marqueeSize(el);
  if (text) {
    buttons(text, HERO_BUTTON);
    decorateMarqueeText(text, size);
    const iconArea = text.querySelector('.hero-marquee-icon-area');
    if (iconArea?.childElementCount > 1) decorateMultipleIconArea(iconArea);
    sizeButtons(text, HERO_BUTTON, true);
  }
  if (el.classList.contains('split')) decorateSplit(el, foreground, media, make);
  if (background?.querySelector('.s2-video')) foreground.after(background);
  finish(el, authored);
}

function decorateAnchorTiles(el, anchors, make) {
  const group = make('div', { class: 'hero-marquee-links-group' });
  anchors[0].before(group);
  anchors.forEach((a) => {
    a.querySelectorAll(HEADINGS).forEach((h) => { if (h.id) h.id = `anchor-${h.id}`; });
    const external = a.classList.contains('hero-marquee-external');
    const span = make('span', { class: `hero-marquee-anchor-icon hero-marquee-anchor-icon-${external ? 'external' : 'anchor'}` });
    span.append(icon(el.ownerDocument, external ? 'external' : 'anchor', 'hero-marquee-icon-svg'));
    a.append(span);
    group.append(a);
  });
}

async function decorateMarqueeAnchors(el, ctx) {
  const { make } = ctx;
  const authored = await prepare(el, ctx, { member: 'anchors', heroVideo: false });
  const size = getBlockSize(el);
  const [background, copy, ...list] = rowsOf(el);
  if (!background || !copy) {
    finish(el, authored);
    return;
  }
  copy.classList.add('hero-marquee-copy');
  decorateBlockBg(el, background);
  blockText(copy, c1Text(ANCHOR_SIZES[size] ?? C1_PAGE_DEFAULT));
  sizeButtons(copy, 'm', false);
  const links = make('div', { class: 'hero-marquee-links' }, list);
  const foreground = make('div', { class: 'hero-marquee-foreground' }, copy);
  foreground.append(links);
  el.append(foreground);

  const page = (el.ownerDocument.defaultView?.location?.href || el.ownerDocument.baseURI || '').split(/\?|#/)[0];
  list.forEach((row, index) => {
    blockText(row, c1Text(ANCHOR_SIZES.xsmall));
    const a = row.querySelector('a');
    if (a && !isMerchLink(a) && a.textContent.charAt(0) === '#') {
      const content = row.querySelector(':scope > div');
      const target = a.textContent.toLowerCase();
      a.textContent = '';
      a.classList.add('hero-marquee-anchor-link');
      row.replaceWith(a);
      if (content) a.append(content);
      if (a.href.split(/\?|#/)[0] === page) a.setAttribute('href', target);
      else a.classList.add('hero-marquee-external');
    } else {
      row.classList.add(`hero-marquee-links-${index === 0 ? 'header' : 'footer'}`);
    }
  });
  const anchors = [...el.querySelectorAll('.hero-marquee-anchor-link')];
  if (anchors.length) decorateAnchorTiles(el, anchors, make);
  finish(el, authored);
}

export const MEMBERS = Object.freeze({
  'hero-marquee': { origin: 'c1', compat: 'canonical', overrides: 'c1', viewportPrePass: false, decorate: decorateHeroMarquee },
  marquee: { origin: 'c1', compat: 'adapter', overrides: 'none', viewportPrePass: false, decorate: decorateMarquee },
  'marquee-anchors': { origin: 'c1', compat: 'adapter', overrides: 'none', viewportPrePass: false, decorate: decorateMarqueeAnchors },
});

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
