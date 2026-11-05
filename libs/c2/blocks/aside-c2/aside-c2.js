import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

const TEXT_CONFIG = { heading: '4', body: 'md' };
const MEDIA = 'picture, video, a[href*=".mp4"]';
const mobileQuery = window.matchMedia('(width < 768px)');

function isColorCell(cell) {
  return CSS.supports('color', cell.textContent.trim()) && cell.firstChild?.nodeType === Node.TEXT_NODE;
}

function isMediaCell(cell) {
  return cell.children.length === 1 && !!cell.querySelector(MEDIA);
}

function decorateProductLockup(foreground) {
  const lockup = foreground.firstElementChild;
  const icon = lockup?.matches('p') && lockup.querySelector('img');
  if (!icon) return;
  lockup.classList.remove(`body-${TEXT_CONFIG.body}`);
  lockup.classList.add('product-lockup', 'eyebrow');
  const src = icon.getAttribute('src');
  const federatedSrc = getFederatedUrl(src);
  if (federatedSrc !== src) icon.src = federatedSrc;
}

function decorateStandaloneLink(foreground) {
  const container = foreground.lastElementChild;
  const link = container?.querySelector(':scope > a:only-child:not(.con-button)');
  const text = link?.textContent.trim();
  if (!text || container.textContent.trim() !== text) return;
  container.classList.remove(`body-${TEXT_CONFIG.body}`, 'supplemental-text', 'body-xl');
  container.classList.add('link-container');
  link.classList.add('standalone-link', 'label');
}

function createBackground(cell) {
  if (!cell) return null;
  const background = createTag('div', { class: 'background' });
  background.style.backgroundColor = cell.textContent.trim();
  return background;
}

function orderContent(el) {
  const foreground = el.querySelector(':scope > .inner > .foreground');
  const media = el.querySelector(':scope > .inner > .media');
  if (!foreground || !media) return;
  const mediaFirst = mobileQuery.matches || media.classList.contains('media-first');
  if (mediaFirst === (media.nextElementSibling === foreground)) return;
  // Move the element without focus so keyboard focus survives breakpoint changes
  if (media.contains(document.activeElement)) media[mediaFirst ? 'after' : 'before'](foreground);
  else foreground[mediaFirst ? 'before' : 'after'](media);
}

function addOrderListeners(el) {
  ['(width < 768px)', '(width < 1280px)'].forEach((query) => {
    window.matchMedia(query).addEventListener('change', () => orderContent(el));
  });
}

function decorate(block) {
  const [firstRow, secondRow] = block.children;
  const firstRowCells = [...(firstRow?.children ?? [])];
  const secondRowCells = [...(secondRow?.children ?? [])];
  const backgroundCell = secondRow && firstRowCells.find((cell) => isColorCell(cell));
  const media = (secondRow ? secondRowCells : firstRowCells).find((cell) => isMediaCell(cell));
  // The background is a color only; in the two-row form a row-1 image or video is dropped
  const foreground = firstRowCells.find((cell) => cell !== backgroundCell && cell !== media
    && !(secondRow && isMediaCell(cell)));
  const isMediaFirst = firstRowCells.indexOf(foreground) > 0;

  if (foreground) {
    foreground.classList.add('foreground');
    decorateBlockText(foreground, TEXT_CONFIG);
    decorateProductLockup(foreground);
    decorateStandaloneLink(foreground);
  }
  media?.classList.add('media');
  if (isMediaFirst) media?.classList.add('media-first');
  const background = createBackground(backgroundCell);

  const inner = createTag('div', { class: 'inner' });
  const content = isMediaFirst || mobileQuery.matches ? [media, foreground] : [foreground, media];
  inner.append(...[...content, background].filter(Boolean));
  block.replaceChildren(inner);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  addOrderListeners(el);
}
