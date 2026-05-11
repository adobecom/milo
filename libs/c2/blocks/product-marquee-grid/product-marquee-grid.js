import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M3 5.5L8 10.5L13 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function decorate(block) {
  const col = block.children[0]?.children[0];
  if (!col) return;

  const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl && isSvgUrl(iconEl.src)) {
    iconEl.src = getFederatedUrl(iconEl.src);
  }

  const ctaLink = col.querySelector('p:has(em a) em a, p:has(strong a) strong a');
  col.querySelector('p:has(em a), p:has(strong a)')?.remove();

  decorateBlockText(col, { heading: '2', body: 'md' });

  const heading = col.querySelector('h1, h2, h3, h4');
  const bodyEls = [...col.querySelectorAll('.body-md')];

  const chicletRow = createTag('div', { class: 'pm-chiclet-row' });
  if (iconEl) {
    iconEl.classList.add('icon');
    chicletRow.append(iconEl);
  }
  if (heading) chicletRow.append(heading);

  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(chicletRow, ...bodyEls);

  const promoArea = createTag('div', { class: 'pm-promo-area' });
  if (ctaLink) {
    promoArea.append(createTag('a', { class: 'pm-promo-button', href: ctaLink.getAttribute('href') }, [
      createTag('span', { class: 'pm-promo-text' }, ctaLink.textContent.trim()),
      createTag('span', { class: 'pm-promo-chevron', 'aria-hidden': 'true' }, CHEVRON_SVG),
    ]));
  }

  block.replaceChildren(foreground, promoArea);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
