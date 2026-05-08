import { createTag } from '../../../utils/utils.js';
import { decorateViewportContent } from '../../../utils/decorate.js';

const CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M3 5.5L8 10.5L13 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function getIcon(col) {
  const picture = col.querySelector('picture');
  if (picture) return picture;

  const svgLink = col.querySelector('a[href*=".svg"]');
  if (!svgLink) return null;

  const href = svgLink.getAttribute('href');
  const rawText = svgLink.textContent || '';
  const alt = rawText.includes('|') ? rawText.split('|').pop().trim() : '';
  const img = createTag('img', { src: href, alt, loading: 'lazy' });
  svgLink.closest('h1, h2, h3, h4, p').remove();
  return img;
}

function buildPromoButton(ctaEl) {
  const link = ctaEl.querySelector('em a, strong a');
  if (!link) return null;

  const btn = createTag('a', {
    class: 'pm-promo-button',
    href: link.getAttribute('href'),
  });
  const text = createTag('span', { class: 'pm-promo-text' }, link.textContent.trim());
  const chevron = createTag('span', { class: 'pm-promo-chevron', 'aria-hidden': 'true' });
  chevron.innerHTML = CHEVRON_SVG;
  btn.append(text, chevron);
  return btn;
}

function decorate(block) {
  const col = block.querySelector(':scope > div > div');
  if (!col) return;

  // Extract icon first (removes its parent element from col)
  const icon = getIcon(col);

  // After icon removal, find remaining elements
  const heading = col.querySelector('h1, h2, h3');
  const ctaEl = col.querySelector('p:has(em a), p:has(strong a)');
  const bodyParas = [...col.querySelectorAll('p')].filter((p) => p !== ctaEl);

  // Chiclet row: icon + product title side-by-side
  const chicletRow = createTag('div', { class: 'pm-chiclet-row' });
  if (icon) {
    const chiclet = createTag('div', { class: 'pm-chiclet' });
    chiclet.append(icon);
    chicletRow.append(chiclet);
  }
  if (heading) {
    heading.classList.add('pm-title');
    chicletRow.append(heading);
  }

  // Body text
  const bodyEl = createTag('div', { class: 'pm-body' });
  bodyParas.forEach((p) => bodyEl.append(p));

  // Foreground: chiclet row at top, body at bottom
  const foreground = createTag('div', { class: 'pm-foreground' });
  foreground.append(chicletRow, bodyEl);

  // Promo area: full-width on mobile, bottom-right on tablet+
  const promoArea = createTag('div', { class: 'pm-promo-area' });
  if (ctaEl) {
    const promoBtn = buildPromoButton(ctaEl);
    if (promoBtn) promoArea.append(promoBtn);
  }

  block.replaceChildren(foreground, promoArea);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
