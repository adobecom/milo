import { rowsOf, cellsOf, hasContent, isEmptyCell, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateViewportContent } from '../_shared/viewport.js';
import { decorateBlockText, applyTextOverrides, decorateIconStack } from '../_shared/text.js';
import { decorateBlockBg, applyAuthoredColour } from '../_shared/background.js';
import { decorateButtons } from '../_shared/buttons.js';
import { federatedUrl } from '../_shared/urls.js';
import { placeholderFallbacks } from '../_shared/s1-page.js';
import { revealAfter } from '../_shared/motion.js';

const BLOCK = 'explore-card';
const CLS = {
  container: `${BLOCK}-tile`,
  content: `${BLOCK}-body`,
  background: `${BLOCK}-backdrop`,
  foreground: `${BLOCK}-media`,
  link: `${BLOCK}-tile-link`,
  standalone: `${BLOCK}-standalone-link`,
  icon: `${BLOCK}-icon`,
  media: `${BLOCK}-has-media`,
  toneLight: `${BLOCK}-tone-light`,
  toneDark: `${BLOCK}-tone-dark`,
};
const TEXT_CFG = Object.freeze({ origin: 'c2', heading: '5', body: 'md', button: 'md' });
const OVERRIDE = /^(heading|body|button)-/;
const SVG_URL = /\.svg(\?.*)?$/i;
const VIDEO_HREF = /\.(mp4|webm|ogg|mov|m4v)(\?[^#]*)?(#.*)?$/i;
const PIPE_TAIL = /\s?\|([^|]*)$/;
const BUTTON_SUFFIX = /#_button-[a-zA-Z-]+/g;
const HEADINGS = 'h1, h2, h3, h4, h5, h6';

const isVideoLink = (a) => VIDEO_HREF.test(a.href || '') || a.hasAttribute('data-video-poster');

function svgLinksToPictures(block, make, win) {
  block.querySelectorAll('a[href]').forEach((a) => {
    const text = a.textContent;
    const href = a.getAttribute('href') || '';
    if (!(text.includes('.svg') || href.includes('.svg'))) return;
    const [first, ...rest] = text.split('|');
    let authored;
    let hrefUrl;
    try {
      authored = new URL(first.trim());
      hrefUrl = new URL(a.href);
    } catch (e) {
      return;
    }
    const alt = rest.join('|').trim();
    const src = (authored.hostname.includes('.hlx.') || authored.hostname.includes('.aem.'))
      ? authored.pathname
      : authored.href;
    const img = make('img', { loading: 'lazy', src: federatedUrl(src, win), alt });
    const picture = make('picture', null, img);
    if (authored.pathname === hrefUrl.pathname) {
      a.replaceWith(picture);
    } else {
      a.replaceChildren(picture);
    }
  });
}

function decorateIcon(contentDiv, win) {
  const img = contentDiv.querySelector('img');
  if (!img || !SVG_URL.test(img.src || '')) return;
  img.setAttribute('src', federatedUrl(img.src, win));
  const p = img.closest('p');
  const holder = p && contentDiv.contains(p) ? p : (img.closest('picture') || img);
  holder.classList.add(CLS.icon);
}

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

function appendForeground(foregroundRow, contentDiv) {
  if (!foregroundRow) return;
  if (hasContent(foregroundRow)) {
    [...foregroundRow.children].forEach((child) => child.classList.add(CLS.foreground));
    contentDiv.append(...foregroundRow.childNodes);
  }
  foregroundRow.remove();
}

function stripPipeTail(node) {
  const text = node.textContent;
  if (!PIPE_TAIL.test(text) || /\.[a-z]+/i.test(text)) return;
  const last = [...node.childNodes].reverse()[0];
  if (last) last.textContent = last.textContent.replace(PIPE_TAIL, '');
}

function wrapperOf(link) {
  let node = link;
  while (node.parentElement && ['STRONG', 'EM'].includes(node.parentElement.tagName)
    && node.parentElement.children.length === 1 && textOf(node.parentElement) === textOf(node)) {
    node = node.parentElement;
  }
  return node;
}

function removeWithEmptyParents(node, stopAt) {
  let parent = node.parentElement;
  node.remove();
  while (parent && parent !== stopAt && stopAt.contains(parent) && isEmptyCell(parent)) {
    const next = parent.parentElement;
    parent.remove();
    parent = next;
  }
}

function decorateContainer(block, el, ctx) {
  const { make } = ctx;
  const win = el.ownerDocument.defaultView;
  const [firstRow, foregroundRow] = rowsOf(block);
  if (!firstRow) return;
  const cells = cellsOf(firstRow);
  const contentDiv = cells[0];
  if (!contentDiv) return;
  const backgroundDiv = cells.length > 1 ? cells[cells.length - 1] : null;

  svgLinksToPictures(block, make, win);
  decorateIcon(contentDiv, win);

  const link = [...contentDiv.querySelectorAll('a[href]')].find((a) => !isVideoLink(a)) ?? null;
  const heading = contentDiv.querySelector(HEADINGS);

  contentDiv.classList.add(CLS.content);
  firstRow.classList.add(CLS.container);

  if (backgroundDiv) {
    backgroundDiv.classList.add(CLS.background);
    const bg = decorateBlockBg(firstRow, backgroundDiv, { useHandleFocalpoint: true });
    if (bg.kind === 'colour') {
      firstRow.append(make('div', { class: CLS.background }));
      const tone = colourTone(bg.value);
      if (tone) firstRow.classList.add(tone === 'light' ? CLS.toneLight : CLS.toneDark);
    }
    if (bg.kind === 'media' && backgroundDiv.querySelector('img, picture, video')) {
      firstRow.classList.add(CLS.media);
    }
  }

  appendForeground(foregroundRow, contentDiv);

  const extraLinks = link
    ? [...contentDiv.querySelectorAll('a[href]')].filter((a) => a !== link)
    : [];
  let tile = null;
  if (link && !extraLinks.length) {
    const href = (link.getAttribute('href') || '').replace(BUTTON_SUFFIX, '');
    const label = heading ? textOf(heading) : '';
    tile = make('a', { class: CLS.link, href, 'data-tracking-label': label || null });
    const source = wrapperOf(link);
    if (el.classList.contains('show-link')) {
      const span = make('span', { class: CLS.standalone }, link.childNodes);
      stripPipeTail(span);
      source.replaceWith(span);
    } else {
      removeWithEmptyParents(source, contentDiv);
    }
  }

  decorateBlockText(contentDiv, TEXT_CFG);
  contentDiv.querySelectorAll(`.${CLS.icon}`).forEach((n) => n.classList.remove('s2-eyebrow'));

  if (tile) {
    tile.append(contentDiv);
    firstRow.prepend(tile);
  }
}

function decorateExploreCard(el, ctx) {
  const authored = [...el.classList].filter((c) => OVERRIDE.test(c));
  const afterApply = (root) => {
    const live = [...root.classList].filter((c) => OVERRIDE.test(c));
    const all = [...new Set([...authored, ...live])];
    if (all.length) applyTextOverrides(ctx.make('div', { class: all.join(' ') }), 'c2', root);
    root.classList.remove(...all);
  };
  return decorateViewportContent(el, (block) => decorateContainer(block, el, ctx), { afterApply });
}

const BRICK = {
  fg: `${BLOCK}-brick-fg`,
  text: `${BLOCK}-brick-text`,
  media: `${BLOCK}-brick-media`,
  backdrop: `${BLOCK}-brick-backdrop`,
  split: `${BLOCK}-brick-split`,
  row: `${BLOCK}-brick-row`,
  mediaLeft: `${BLOCK}-brick-media-left`,
  mediaRight: `${BLOCK}-brick-media-right`,
  iconArea: `${BLOCK}-brick-icon-area`,
  iconGap: `${BLOCK}-brick-icon-gap-s`,
  listText: `${BLOCK}-brick-list-text`,
  firstLink: `${BLOCK}-brick-first-link`,
  supplemental: `${BLOCK}-brick-supplemental`,
  colour: `${BLOCK}-brick-colour`,
  overMedia: `${BLOCK}-brick-over-media`,
};
const BRICK_SIZES = { large: ['xxl', 'm', 'l'], default: ['xl', 'm', 'l'] };
const OBJECT_FITS = ['fill', 'contain', 'cover', 'none', 'scale-down'];
const BRICK_MEDIA = 'img, picture, video';

function pipeToAriaLabel(a) {
  const text = a.textContent;
  if (!PIPE_TAIL.test(text) || /\.[a-z]+/i.test(text)) return;
  const node = [...a.childNodes].reverse()[0];
  if (!node) return;
  const label = node.textContent.match(PIPE_TAIL)?.[1];
  node.textContent = node.textContent.replace(PIPE_TAIL, '');
  a.setAttribute('aria-label', (label || '').trim());
}

function brickObjectFit(bgRow) {
  bgRow.querySelectorAll('div').forEach((cell) => {
    const pic = cell.querySelector('picture');
    if (!pic) return;
    let text = '';
    const filled = [...cell.querySelectorAll('p:not(:empty)')].filter((p) => [...p.childNodes]
      .some((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())));
    if (filled.length > 2) text = filled[1]?.textContent.trim();
    if (!text && cell.textContent) text = cell.textContent;
    if (!text) return;
    const config = text.split(',').map((c) => c.toLowerCase().trim());
    const fit = OBJECT_FITS.filter((c) => config.includes(c));
    const focus = config.filter((c) => !fit.includes(c));
    const img = pic.querySelector('img');
    if (fit.length && img) img.style.setProperty('--_object-fit', fit[0]);
    cell.replaceChildren(pic, cell.ownerDocument.createTextNode(focus.join(',')));
  });
}

function brickHeadingRoles(textCell) {
  const headings = [...textCell.querySelectorAll(HEADINGS)];
  const withPicture = headings.find((h) => h.querySelector('picture'));
  if (!withPicture) return;
  headings.forEach((h) => { if (h !== withPicture) h.setAttribute('role', 'paragraph'); });
}

function brickForeground(el, fg) {
  const textCell = fg.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div') || fg;
  textCell.classList.add(BRICK.text);
  brickHeadingRoles(textCell);
  if (cellsOf(fg).filter((c) => c.tagName === 'DIV').length > 1) {
    if (!el.classList.contains('stack')) {
      el.classList.add(BRICK.split);
      if (!el.classList.contains('center')) el.classList.add(BRICK.row);
    }
    const media = fg.querySelector('div:not([class])');
    if (media) {
      media.classList.add(BRICK.media);
      el.classList.add(fg.firstElementChild === media ? BRICK.mediaLeft : BRICK.mediaRight);
    }
  }
  const iconArea = textCell.querySelector('p');
  if (iconArea?.querySelector('img')) {
    iconArea.classList.add(BRICK.iconArea);
    if (iconArea.querySelectorAll('img').length > 1) iconArea.classList.add(BRICK.iconGap);
  }
  return textCell;
}

function brickIconStack(el, make) {
  decorateIconStack(el);
  const stack = el.querySelector('.s2-icon-stack-area');
  if (!stack) return;
  stack.classList.remove(...[...stack.classList].filter((c) => c.startsWith('s2-body-') && c !== 's2-body-s'));
  stack.querySelectorAll('li').forEach((li) => {
    const aText = li.querySelector('a')?.textContent?.trim();
    const liText = li.textContent?.trim();
    if (!liText || liText === aText) return;
    const pic = li.querySelector('picture');
    li.querySelectorAll('p').forEach((p) => p.replaceWith(...p.childNodes));
    let icon = pic;
    if (pic && pic.parentElement !== li) {
      icon = pic.parentElement.cloneNode(false);
      icon.append(pic);
    }
    const text = make('span', { class: BRICK.listText }, li.childNodes);
    li.replaceChildren(...(icon ? [icon, text] : [text]));
    text.querySelector('a:empty')?.remove();
  });
}

function brickSupplemental(fg) {
  if (!fg.querySelector('.s2-action-area')) return;
  const next = fg.querySelector('.s2-action-area + p');
  const last = fg.querySelector('.s2-action-area ~ p:last-child');
  if (next) next.className = '';
  if (last) last.className = `s2-body-xs ${BRICK.supplemental}`;
}

function brickTileLink(el, fg, make) {
  if (!el.classList.contains('click')) return;
  const links = fg.querySelectorAll(`.${BRICK.text} a`);
  if (links.length !== 1) {
    el.classList.remove('click');
    return;
  }
  const a = links[0];
  const label = make('span', { class: [...a.classList, BRICK.firstLink].join(' ') }, a.childNodes);
  a.replaceWith(label);
  a.className = `${CLS.link} ${BRICK.fg}`;
  a.replaceChildren(...fg.childNodes);
  fg.replaceWith(a);
}

function decorateBrick(el, ctx) {
  const { make } = ctx;
  const win = el.ownerDocument.defaultView;
  el.classList.add(BLOCK);
  if (!el.classList.contains('light')) el.classList.add('dark');
  svgLinksToPictures(el, make, win);
  el.querySelectorAll('a[href]').forEach(pipeToAriaLabel);

  const rows = rowsOf(el);
  if (!rows.length) return;
  let colour = null;
  if (rows.length > 1) {
    const bgRow = rows[rows.length - 2];
    brickObjectFit(bgRow);
    const bg = decorateBlockBg(el, bgRow, { useHandleFocalpoint: true, className: BRICK.backdrop });
    if (bg.kind === 'colour') colour = bg.value;
    if (bg.kind === 'media' && bgRow.querySelector(BRICK_MEDIA)) el.classList.add(BRICK.overMedia);
  }
  if (rows.length > 2) {
    colour = applyAuthoredColour(el, rows[0].textContent) || colour;
    rows[0].remove();
  }
  if (colour) el.classList.add(BRICK.colour);

  const fg = rows[rows.length - 1];
  fg.classList.add(BRICK.fg);
  brickForeground(el, fg);
  const [heading, body, detail] = BRICK_SIZES[el.classList.contains('large') ? 'large' : 'default'];
  decorateButtons(fg, 'l');
  decorateBlockText(fg, { origin: 'c1', heading, body, detail });
  if (el.classList.contains('button-fill')) {
    fg.querySelector('.s2-action-area')?.querySelectorAll('a.s2-button.s2-button-accent').forEach((b) => {
      b.classList.replace('s2-button-accent', 'fill');
    });
  }
  el.querySelector(`.${BRICK.iconArea}`)?.classList.remove('s2-detail-l');
  brickIconStack(el, make);
  brickSupplemental(fg);
  brickTileLink(el, fg, make);
  applyTextOverrides(el, 'c1');
}

export const MEMBERS = Object.freeze({
  'explore-card': {
    origin: 'c2',
    compat: 'canonical',
    overrides: 'c2',
    viewportPrePass: true,
    decorate: decorateExploreCard,
  },
  brick: {
    origin: 'c1',
    compat: 'adapter',
    overrides: 'c1',
    viewportPrePass: false,
    decorate: decorateBrick,
  },
});

export default function decorate(el) {
  placeholderFallbacks(el);
  return revealAfter(dispatch(el, MEMBERS, { block: BLOCK }), el, () => [el], { siblings: `.${BLOCK}` });
}
