import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const HERO_OVERLAY_PROP = '--rc-hero-overlay';

function hangOpeningQuote(header) {
  if (!header) return;
  const openingQuotes = /^(\p{Pi})/u;
  const match = header.textContent.match(openingQuotes);
  if (!match) return;
  const quote = match[1];
  header.textContent = header.textContent.slice(1);
  const span = createTag('span', { class: 'opening-quote' }, quote);
  header.prepend(span);
}

function decorateText(el) {
  decorateBlockText(el);
  const firstText = el?.querySelector('h1, h2, h3, h4, h5, h6, p');
  hangOpeningQuote(firstText);
}

function promoteParagraphHeading(content, headingSize = '2') {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const firstP = content.querySelector('p');
  if (!firstP) return;
  const bodyClass = [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, `heading-${headingSize}`);
}

function decorate(block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);

  const bgCell = foreground?.children[1];
  if (bgCell && !bgCell.querySelector('picture, img') && bgCell.textContent.trim()) {
    bgCell.classList.add('hero-overlay-source');
  }

  promoteParagraphHeading(content);
}

function applyHeroOverlay(el) {
  const section = el.closest('.section');
  if (!section) return;
  const source = el.querySelector('.hero-overlay-source');
  if (source) section.style.setProperty(HERO_OVERLAY_PROP, source.textContent.trim());
  else section.style.removeProperty(HERO_OVERLAY_PROP);
}

export default function init(el) {
  const viewports = decorateViewportContent(el, decorate);
  applyHeroOverlay(el);
  if (viewports.hasViewportVariations) {
    const observer = new MutationObserver(() => applyHeroOverlay(el));
    observer.observe(el, { childList: true });
  }
}
