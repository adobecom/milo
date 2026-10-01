import { rowsOf, textOf } from '../_shared/dom.js';
import { decorateBlockText, applyTextOverrides } from '../_shared/text.js';
import { decorateBlockBg, applyAuthoredColour } from '../_shared/background.js';
import { pageLinkShims, markStaticLinks, headingText, colourTone, dropGradientPosition } from './aside-page.js';

const VARIANTS = ['banner', 'ribbon', 'pill'];
const SIZES = ['small', 'medium', 'large'];
const BLOCK_CONFIG = {
  banner: { small: ['s', 's', 's', 'm'], medium: ['m', 'm', 'm', 'l'], large: ['l', 'l', 'l', 'l'] },
  ribbon: { small: ['s', 's', 's', 'm'], medium: ['m', 'm', 'm', 'l'], large: ['l', 'l', 'l', 'l'] },
  pill: { small: ['s', 's', 's', 'm'], medium: ['m', 'm', 'm', 'l'], large: ['l', 'm', 'm', 'l'] },
};
const BUTTON_SIZE = /([xsml]+)-button/;
const LOCKUP = /([xsml]+)-(lockup|icon)/;
const CLOSE_EVENT = '#_evt-close';
const VIEWPORTS = {
  2: ['(width < 768px)', '(width >= 768px)'],
  3: ['(width < 768px)', '(768px <= width < 1280px)', '(width >= 1280px)'],
};
const CLOSE_GLYPH = '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" class="aside-close-glyph"><path fill="currentColor" d="M17.071 2.9289C15.6725 1.53038 13.8907 0.577987 11.9509 0.192144C10.0111 -0.1937 8.0004 0.00433988 6.17314 0.761219C4.34589 1.5181 2.78411 2.79982 1.6853 4.44431C0.586487 6.0888 0 8.02219 0 10C0 11.9778 0.586487 13.9112 1.6853 15.5557C2.78411 17.2002 4.34589 18.4819 6.17314 19.2388C8.0004 19.9957 10.0111 20.1937 11.9509 19.8079C13.8907 19.422 15.6725 18.4696 17.071 17.0711C17.9996 16.1425 18.7362 15.0401 19.2388 13.8269C19.7413 12.6136 20 11.3132 20 10C20 8.68677 19.7413 7.3864 19.2388 6.17314C18.7362 4.95988 17.9996 3.85748 17.071 2.9289ZM13.9082 14.7616C13.814 14.8558 13.6862 14.9087 13.5529 14.9087C13.4197 14.9087 13.2919 14.8558 13.1977 14.7616L10.0002 11.5636L6.80219 14.7616C6.70795 14.8558 6.58016 14.9087 6.44691 14.9087C6.31366 14.9087 6.18587 14.8558 6.09163 14.7616L5.23736 13.9073C5.14316 13.813 5.09023 13.6853 5.09023 13.552C5.09023 13.4188 5.14316 13.291 5.23736 13.1967L8.43636 10.0003L5.23887 6.80276C5.19215 6.75609 5.15508 6.70067 5.12979 6.63967C5.10451 6.57867 5.09149 6.51328 5.09149 6.44724C5.09149 6.3812 5.10451 6.31581 5.12979 6.25481C5.15508 6.1938 5.19215 6.13838 5.23887 6.09171L6.09314 5.23744C6.18738 5.14323 6.31517 5.09031 6.44842 5.09031C6.58167 5.09031 6.70946 5.14323 6.80369 5.23744L10.0002 8.43643L13.1982 5.23895C13.2448 5.19222 13.3003 5.15516 13.3613 5.12987C13.4223 5.10458 13.4877 5.09157 13.5537 5.09157C13.6197 5.09157 13.6851 5.10458 13.7461 5.12987C13.8071 5.15516 13.8626 5.19222 13.9092 5.23895L14.761 6.09322C14.8552 6.18745 14.9081 6.31525 14.9081 6.44849C14.9081 6.58174 14.8552 6.70954 14.761 6.80377L11.564 10.0003L14.761 13.1977C14.8552 13.292 14.9081 13.4198 14.9081 13.553C14.9081 13.6863 14.8552 13.8141 14.761 13.9083L13.9082 14.7616Z"/></svg>';

const camel = (str) => str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const fmt = (cell) => (cell?.textContent || '').toLowerCase().replace('\n', '').trim();

export function readOptions(el) {
  const rows = rowsOf(el).slice(2);
  rows.forEach((row) => row.remove());
  return rows.reduce((opts, row) => ({
    ...opts,
    [camel(fmt(row.children[0]))]: fmt(row.children[1]),
  }), {});
}

export function notificationData(el) {
  const variant = VARIANTS.find((v) => el.classList.contains(v)) || 'banner';
  const size = SIZES.find((s) => el.classList.contains(s)) || 'medium';
  const sizes = [...BLOCK_CONFIG[variant][size]];
  const buttonSize = el.className.match(BUTTON_SIZE);
  if (buttonSize) sizes.splice(3, 1, buttonSize[1]);
  return { variant, size, sizes };
}

function decorateLockup(area, el, make) {
  const icon = area.querySelector('picture');
  const content = icon?.nextElementSibling || icon?.nextSibling;
  if (!content) return;
  const label = make('span', { class: 'aside-lockup-label' });
  if (content.nodeType === 3) {
    label.textContent = content.nodeValue;
    area.replaceChild(label, content);
  } else {
    label.append(content);
    area.append(label);
  }
  area.classList.add('aside-lockup-area');
  const pre = el.className.match(LOCKUP);
  if (!pre) el.classList.add(`${el.classList.contains('pill') ? 'm' : 'l'}-lockup`);
  if (pre && pre[2] === 'icon') el.classList.replace(pre[0], `${pre[1]}-lockup`);
}

function liveRegion(el, make) {
  let region = el.querySelector(':scope > .aside-live-region');
  if (!region) {
    region = make('div', { class: 'aside-live-region', role: 'status', 'aria-live': 'polite', tabindex: '-1' });
    el.append(region);
  }
  return region;
}

export function closeBanner(el) {
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  const region = el.querySelector(':scope > .aside-live-region');
  const hadFocus = el.contains(doc.activeElement);
  el.removeAttribute('aria-modal');
  el.removeAttribute('role');
  el.classList.add('aside-closed');
  el.closest('.section')?.classList.add('close-sticky-section');
  if (region) {
    if (hadFocus) region.focus({ preventScroll: true });
    win.setTimeout(() => { region.textContent = 'Banner closed'; }, 100);
  }
  doc.dispatchEvent(new win.CustomEvent('milo:sticky:closed'));
}

function addCloseAction(el, btn) {
  btn.addEventListener('click', (e) => {
    if (btn.nodeName === 'A') e.preventDefault();
    closeBanner(el);
  });
}

function addClose(el, make) {
  if (el.querySelector(':scope > .aside-close, :scope > .aside-flexible-inner > .aside-close')) return;
  const btn = make('button', { type: 'button', class: 'aside-close', 'aria-label': 'Close Promotional Banner' });
  btn.innerHTML = CLOSE_GLYPH;
  addCloseAction(el, btn);
  const inner = el.querySelector(':scope > .aside-flexible-inner');
  (inner || el).append(btn);
  liveRegion(el, make);
}

function decorateFlexible(el, make) {
  const parts = [
    el.querySelector(':scope > .s2-background'),
    el.querySelector(':scope > .aside-foreground'),
    el.querySelector(':scope > .aside-close'),
  ].filter(Boolean);
  const inner = make('div', { class: 'aside-flexible-inner' }, parts);
  const bg = el.style.getPropertyValue('--_authored-bg');
  if (bg) {
    inner.style.setProperty('--_authored-bg', bg);
    el.style.removeProperty('--_authored-bg');
  }
  el.prepend(inner);
}

function decorateSplitList(el, list, make) {
  if (!list) return;
  const area = make('div', { class: 'aside-split-list' });
  list.querySelectorAll('li').forEach((item) => {
    const pic = item.querySelector('picture');
    if (!pic) return;
    const textLi = ['STRONG', 'EM', 'A'].includes(item.lastElementChild?.nodeName) ? item : item.nextElementSibling;
    if (!textLi?.lastElementChild) return;
    const btn = make('div', {}, textLi.lastElementChild);
    const btnA = btn.querySelector('a');
    if (btnA?.getAttribute('href')?.includes(CLOSE_EVENT)) {
      btnA.setAttribute('href', CLOSE_EVENT);
      addCloseAction(el, btnA);
      liveRegion(el, make);
    }
    const img = pic.querySelector('img');
    if (img) img.loading = 'eager';
    const copy = make('div', { class: 'aside-split-copy' }, [pic, make('div', {}, textOf(textLi))]);
    area.append(make('div', { class: 'aside-split-item' }, [copy, btn]));
  });
  list.replaceWith(area);
}

function decorateForegroundText(el, container, make) {
  const text = container?.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  text?.classList.add('aside-text');
  if (el.classList.contains('split')) {
    decorateSplitList(el, text?.querySelector('ul'), make);
    return;
  }
  const iconArea = text?.querySelector('p:has(picture)');
  iconArea?.classList.add('aside-icon-area');
  if (iconArea?.textContent.trim()) decorateLockup(iconArea, el, make);
}

function decorateLayout(el, make) {
  const rows = rowsOf(el);
  const foreground = rows.pop();
  const background = rows[0];
  if (background) {
    dropGradientPosition(background);
    const bg = decorateBlockBg(el, background);
    const tone = bg.kind === 'colour' ? colourTone(bg.value) : null;
    if (tone) el.classList.add(`aside-tone-${tone}`);
  }
  if (!foreground) return null;
  foreground.classList.add('aside-foreground');
  if (el.matches('.pill, .ribbon')) {
    foreground.querySelectorAll(':scope > div').forEach((div) => decorateForegroundText(el, div, make));
  } else {
    decorateForegroundText(el, foreground, make);
  }
  const fgMedia = foreground.querySelector(':scope > div:not(.aside-text) :is(img, video, a[href*=".mp4"])')?.closest('div');
  const bgMedia = el.querySelector(':scope > div:not(.aside-foreground) :is(img, video, a[href*=".mp4"])')?.closest('div');
  const media = fgMedia ?? bgMedia;
  if (media && !media.classList.contains('aside-text')) media.classList.add('aside-image');
  foreground.classList.toggle('aside-no-image', !media && !el.querySelector('.aside-icon-area'));
  if (el.matches('.pill:not(.no-closure), .ribbon:not(.no-closure)')) addClose(el, make);
  if (el.matches('.pill.flexible')) decorateFlexible(el, make);
  return foreground;
}

function wrapCopy(foreground, make) {
  foreground.querySelectorAll('.aside-text').forEach((text) => {
    const heading = text.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p:not(.aside-icon-area, .s2-action-area), :scope > mas-field');
    if (!heading) return;
    const icon = heading.previousElementSibling;
    const next = heading.nextElementSibling;
    const body = next?.classList.contains('s2-action-area') ? null : next;
    const anchor = icon?.nextSibling || text.firstChild;
    const copy = make('div', { class: 'aside-copy-wrap' }, [heading, body].filter(Boolean));
    if (anchor && anchor.parentNode === text) text.insertBefore(copy, anchor);
    else text.prepend(copy);
  });
}

function decorateMultiViewport(el) {
  const foreground = el.querySelector('.aside-foreground');
  const cells = foreground ? [...foreground.children] : [];
  const queries = VIEWPORTS[cells.length];
  if (!queries) return;
  const win = el.ownerDocument.defaultView;
  if (!win?.matchMedia) return;
  cells.forEach((cell, index) => {
    cell.classList.add('aside-viewport-cell');
    const mq = win.matchMedia(queries[index]);
    const show = () => { if (mq.matches) foreground.replaceChildren(cell); };
    show();
    mq.addEventListener('change', show);
  });
}

function watchSticky(el, make) {
  const section = el.closest('.section');
  const win = el.ownerDocument.defaultView;
  if (!section) return;
  const apply = () => {
    const bottom = section.classList.contains('sticky-bottom');
    if (!bottom && !section.classList.contains('sticky-top')) return false;
    el.classList.remove('no-closure');
    addClose(el, make);
    el.setAttribute('aria-label', headingText(el) || (bottom ? 'Promotional Banner Bottom' : 'Promotional Banner Top'));
    el.setAttribute('role', 'region');
    return true;
  };
  if (apply() || !win?.MutationObserver) return;
  const observer = new win.MutationObserver(() => { if (apply()) observer.disconnect(); });
  observer.observe(section, { attributes: true, attributeFilter: ['class'] });
}

export function decorateNotification(el, ctx) {
  const { make } = ctx;
  el.classList.add('aside', 'aside-member-notification');
  const { variant, sizes } = notificationData(el);
  const options = readOptions(el);
  pageLinkShims(el, make);
  const [heading, body, detail, button] = sizes;
  const blockText = decorateLayout(el, make);
  if (blockText) {
    decorateBlockText(blockText, { origin: ctx.origin, heading, body, detail, button });
  }
  if (options.borderBottom) {
    const border = make('div', { class: 'aside-border' });
    applyAuthoredColour(border, options.borderBottom);
    const inner = el.querySelector(':scope > .aside-flexible-inner');
    (inner || el).append(border);
  }
  applyTextOverrides(el, ctx.overrides);
  markStaticLinks(el);
  if (blockText && (variant === 'ribbon' || variant === 'pill')) {
    wrapCopy(blockText, make);
    decorateMultiViewport(el);
  }
  el.dataset.notificationId = `notification-${[...el.ownerDocument.querySelectorAll('[data-notification-id]')].length + 1}`;
  watchSticky(el, make);
}
