import { rowsOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';
import { decorateBlockText, decorateIconStack, applyTextOverrides } from '../_shared/text.js';
import { decorateBlockBg } from '../_shared/background.js';
import { pageLinkShims, colourTone, markStaticLinks, dropGradientPosition } from './aside-page.js';
import { decorateNotification } from './aside-notification.js';

const BLOCK = 'aside';
const VARIANTS = ['split', 'inline', 'notification', 'container-mobile', 'full-bleed-mobile'];
const SIZES = ['extra-small', 'small', 'medium', 'large'];
const BLOCK_CONFIG = {
  split: ['xl', 's', 'm'],
  inline: ['s', 'm'],
  notification: {
    'extra-small': ['m', 'm'],
    small: ['m', 'm'],
    medium: ['s', 's'],
    large: ['l', 'm'],
  },
  'container-mobile': ['xl', 'l', 'l'],
  'full-bleed-mobile': ['xl', 's', 'm'],
};
const PROMO_VIEWPORTS = ['mobile-up', 'tablet-up', 'desktop-up'];
const PROMO_TEXT = {
  default: { 'mobile-up': ['s', 's'], 'tablet-up': ['s', 's'], 'desktop-up': ['m', 'l'] },
  popup: { 'mobile-up': ['s', 's'], 'tablet-up': ['l', 'm'], 'desktop-up': ['xxl', 'xl'] },
};
const FORMAT = /^format:/i;
const CLOSE_GLYPH = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class="aside-close-glyph"><circle cx="10" cy="10" r="10" fill="currentColor"/><path d="M6 6l8 8M14 6l-8 8" stroke-width="2" class="aside-close-cross"/></svg>';

export function blockData(el) {
  const variant = VARIANTS.find((v) => el.classList.contains(v));
  const size = SIZES.find((s) => el.classList.contains(s));
  const data = variant ? BLOCK_CONFIG[variant] : BLOCK_CONFIG.split;
  if (Array.isArray(data)) return data;
  return data[size || 'small'];
}

function decorateMediaFormats(el) {
  if (!(el.classList.contains('medium') || el.classList.contains('large'))) return;
  [...el.querySelectorAll('div > p video, div > p picture')].some((media) => {
    const parentP = media.closest('p');
    const siblingP = parentP?.nextElementSibling;
    if (!siblingP || siblingP.nodeName !== 'P') return false;
    const siblingText = siblingP.textContent;
    if (!FORMAT.test(siblingText)) return false;
    const formats = siblingText.split(': ')[1]?.split(/\s+/).filter(Boolean);
    const cell = media.closest('div');
    if (formats?.length) {
      const cls = ['aside-format'];
      if (formats.length === 3) cls.push(`aside-desktop-${formats[2]}`);
      if (formats.length >= 2) cls.push(`aside-tablet-${formats[1]}`);
      cls.push(`aside-mobile-${formats[0]}`);
      cell.classList.add(...cls);
    }
    siblingP.remove();
    cell.insertBefore(media, parentP);
    parentP.remove();
    return true;
  });
}

function hoverPlay(video) {
  if (!video?.hasAttribute('data-hoverplay')) return;
  const win = video.ownerDocument.defaultView;
  const reduced = () => !!win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  video.addEventListener('mouseenter', () => { if (!reduced()) video.play()?.catch?.(() => {}); });
  video.addEventListener('mouseleave', () => video.pause());
}

function fillPromoViewports(foreground) {
  const count = foreground.childElementCount;
  if (!count) return;
  const last = foreground.children[count - 1];
  for (let i = count; i < 3; i += 1) foreground.append(last.cloneNode(true));
}

function combineTextBlocks(textBlocks, iconArea, viewport, variant, make) {
  const [heading, body] = PROMO_TEXT[variant][viewport];
  const contentArea = make('p', { class: 'aside-content-area' });
  const textArea = make('p', { class: 'aside-text-area' });
  textBlocks[0].parentElement.prepend(contentArea);
  textBlocks.forEach((block) => {
    textArea.append(block);
    block.classList.add(block.nodeName === 'P' ? `s2-body-${body}` : `s2-heading-${heading}`);
  });
  if (iconArea) {
    if (iconArea.textContent.trim()) iconArea.classList.add('s2-detail-xs');
    iconArea.classList.add('aside-icon-area');
    contentArea.append(iconArea);
  }
  contentArea.append(textArea);
}

function addPromoClose(el, foreground, make) {
  const btn = make('button', { type: 'button', class: 'aside-promo-close', 'aria-label': 'Close' });
  btn.innerHTML = CLOSE_GLYPH;
  foreground.append(btn);
  btn.addEventListener('click', () => {
    el.closest('.section')?.classList.add('close-sticky-section');
    el.ownerDocument.dispatchEvent(new el.ownerDocument.defaultView.CustomEvent('milo:sticky:closed'));
  });
}

function decoratePromobar(el, foreground, make) {
  const variant = el.classList.contains('popup') ? 'popup' : 'default';
  if (foreground.childElementCount !== 3) fillPromoViewports(foreground);
  [...foreground.children].forEach((child, index) => {
    const viewport = PROMO_VIEWPORTS[index];
    child.className = '';
    if (viewport) child.classList.add(`aside-${viewport}`);
    child.classList.add('aside-promo-text');
    const textBlocks = [...child.children];
    const iconArea = child.querySelector('picture')?.closest('p');
    const actions = child.querySelectorAll('em a, strong a, p > a strong');
    if (iconArea) textBlocks.splice(textBlocks.indexOf(iconArea), 1);
    if (actions.length) textBlocks.pop();
    if (!(textBlocks.length || iconArea || actions.length)) child.classList.add('aside-hide-block');
    else if (textBlocks.length && viewport) {
      combineTextBlocks(textBlocks, iconArea, viewport, variant, make);
    }
  });
  if (variant === 'popup') addPromoClose(el, foreground, make);
  return foreground;
}

function formatPromoButtons(el) {
  if (!el.classList.contains('promobar')) return;
  el.querySelectorAll('.s2-action-area .s2-button').forEach((btn) => {
    btn.classList.add('s2-button-size-l');
    if (el.classList.contains('popup') && !btn.classList.contains('s2-button-outline')) btn.classList.add('fill');
  });
}

function adoptMiloButtons(el) {
  el.querySelectorAll('.action-area').forEach((p) => p.classList.add('s2-action-area'));
  el.querySelectorAll('a.con-button:not(.s2-button)').forEach((a) => {
    a.classList.add('s2-button', a.classList.contains('blue') ? 's2-button-accent' : 's2-button-outline');
  });
}

function markTone(el, bg) {
  let values = [];
  if (bg.kind === 'colour') values = [bg.value];
  else if (bg.kind === 'media' && bg.value) {
    const cells = [...bg.value.children];
    if (cells.length && cells.every((c) => c.classList.contains('s2-expand-background'))) {
      values = cells.map((c) => c.style.getPropertyValue('--_authored-bg')).filter(Boolean);
      if (values.length !== cells.length) values = [];
    }
  }
  const tones = new Set(values.map(colourTone));
  if (tones.size === 1 && !tones.has(null)) el.classList.add(`aside-tone-${[...tones][0]}`);
}

function decorateLayout(el, make) {
  const rows = rowsOf(el);
  if (rows.length > 1) {
    dropGradientPosition(rows[0]);
    markTone(el, decorateBlockBg(el, rows[0]));
  }
  const foreground = rows[rows.length - 1];
  if (!foreground) return null;
  foreground.classList.add('aside-foreground');
  if (el.classList.contains('promobar')) return decoratePromobar(el, foreground, make);
  if (el.classList.contains('split')) decorateMediaFormats(el);
  const text = foreground.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  text?.classList.add('aside-text');
  const isNotification = el.classList.contains('notification');
  const media = foreground.querySelector(':scope > div:not([class])');
  if (media && !isNotification) {
    media.classList.add('aside-image');
    hoverPlay(media.querySelector('video'));
  }
  const picture = text?.querySelector('p picture');
  const iconArea = picture?.closest('p') || null;
  if (iconArea) {
    const iconVariant = el.className.match(/-(avatar|lockup)/);
    iconArea.classList.add(iconVariant ? `aside-${iconVariant[1]}-area` : 'aside-icon-area');
  }
  const notText = ':scope > div:not(.aside-text)';
  const notFg = ':scope > div:not(.aside-text):not(.aside-foreground)';
  const fgImage = foreground.querySelector(`${notText} img`)?.closest('div');
  const bgImage = el.querySelector(`${notFg} img`)?.closest('div');
  const fgMedia = foreground.querySelector(`${notText} :is(.video-container, video, a[href*=".mp4"], a[href*="tv.adobe.com"]), ${notText} iframe[src*="tv.adobe.com"]`)
    ?.closest('div:not(.video-container)');
  const bgMedia = el.querySelector(`${notFg} video, ${notFg} a:is([href*=".mp4"], [href*="tv.adobe.com"])`)?.closest('div');
  const image = fgImage ?? bgImage;
  const asideMedia = fgMedia ?? bgMedia ?? image;
  const isSplit = el.classList.contains('split');
  const hasMedia = fgImage ?? fgMedia ?? (isSplit && asideMedia);
  if (!hasMedia) el.classList.add('aside-no-media');
  if (asideMedia && !asideMedia.classList.contains('aside-text')) {
    asideMedia.classList.add(isSplit ? 'aside-split-image' : 'aside-image');
    if (isSplit) {
      const position = [...asideMedia.parentNode.children].indexOf(asideMedia);
      el.classList.add(position ? 'aside-split-left' : 'aside-split-right');
      foreground.parentElement.append(asideMedia);
    }
  } else if (!iconArea) {
    foreground.classList.add('aside-no-image');
  }
  if (isSplit) {
    decorateIconStack(el);
    el.querySelectorAll('.s2-icon-stack-area li p').forEach((p) => p.replaceWith(...p.childNodes));
  }
  return foreground;
}

function decorateAside(el, ctx) {
  el.classList.add(BLOCK, 'aside-member-aside');
  const { make } = ctx;
  pageLinkShims(el, make);
  const [heading, body, detail] = blockData(el);
  const blockText = decorateLayout(el, make);
  if (blockText && !el.classList.contains('promobar')) {
    decorateBlockText(blockText, { origin: ctx.origin, heading, body, detail });
  } else if (blockText) {
    decorateBlockText(blockText, { origin: ctx.origin, body });
  }
  if (el.classList.contains('notification')) markStaticLinks(el);
  adoptMiloButtons(el);
  formatPromoButtons(el);
  applyTextOverrides(el, ctx.overrides);
  if (el.classList.contains('l-title')) el.querySelector('[class*="s2-detail-"]')?.classList.add('aside-title-l');
}

export const MEMBERS = Object.freeze({
  aside: { origin: 'c1', compat: 'canonical', overrides: 'c1', viewportPrePass: false, decorate: decorateAside },
  notification: { origin: 'c1', compat: 'adapter', overrides: 'c1', viewportPrePass: false, decorate: decorateNotification },
});

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}
