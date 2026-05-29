import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { decorateViewportContent } from '../../../utils/decorate.js';

const CHEVRON_SVG = '<svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.208 5.417L7.50781 1.7168C7.18554 1.39453 6.66406 1.39453 6.34179 1.7168C6.01953 2.03907 6.01953 2.56055 6.34179 2.88282L8.63281 5.17481H1.375C0.918955 5.17481 0.549805 5.54395 0.549805 6.00001C0.549805 6.45607 0.918945 6.82521 1.375 6.82521H8.63281L6.34179 9.1172C6.01953 9.43947 6.01953 9.96095 6.34179 10.2832C6.50292 10.4444 6.71386 10.5254 6.9248 10.5254C7.13574 10.5254 7.34668 10.4444 7.50781 10.2832L11.208 6.58302C11.5303 6.26075 11.5303 5.73927 11.208 5.417Z" fill="#fff"/></svg>';

function decorate(block) {
  const col = block.children[0]?.children[0];
  if (!col) return;

  const iconEl = col.querySelector('p img[src*=".svg"]');
  if (iconEl) iconEl.src = getFederatedUrl(iconEl.src);

  const ctaLink = col.querySelector('p:has(em a) em a, p:has(strong a) strong a');
  col.querySelector('p:has(em a), p:has(strong a)')?.remove();

  const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
  heading?.classList.add('heading-super');

  const bodyEls = [...col.querySelectorAll('p')].filter((el) => el.textContent.trim());
  bodyEls.forEach((el) => el.classList.add('heading-5'));

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
      createTag('span', { class: 'pm-promo-text eyebrow' }, ctaLink.textContent.trim()),
      createTag('span', { class: 'pm-promo-chevron', 'aria-hidden': 'true' }, CHEVRON_SVG),
    ]));
  }

  const content = createTag('div', { class: 'pm-content container' });
  content.append(foreground, promoArea);
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
