import { decorateLinks, loadBlock, localizeLink } from '../../utils/utils.js';
import { addAriaLabelToCta } from './merch.js';

export function localizePreviewLinks(el) {
  const anchors = el.getElementsByTagName('a');
  for (const a of anchors) {
    const { href } = a;
    if (href?.match(/http[s]?:\/\/\S*\.(hlx|aem).(page|live)\//)) {
      try {
        const url = new URL(href);
        a.href = localizeLink(href, url.hostname);
      } catch (e) {
        window.lana?.log(`Invalid URL - ${href}: ${e.toString()}`);
      }
    }
  }
}

export function postProcessAutoblock(autoblockEl) {
  decorateLinks(autoblockEl);
  localizePreviewLinks(autoblockEl);
  autoblockEl.querySelectorAll('.modal.link-block').forEach((blockEl) => loadBlock(blockEl));
}

export function decorateCardCtasWithA11y(card) {
  card.querySelectorAll('a[href]').forEach((link) => {
    if (link.getAttribute('aria-label')) return;

    if (link.getAttribute('is') === 'checkout-link') {
      link.onceSettled().then(() => {
        addAriaLabelToCta(link);
      });
    } else {
      const productName = card.querySelector('h3')?.textContent;
      link.setAttribute('aria-label', `${link.textContent}${productName ? ' - ' : ''}${productName}`);
    }
  });
}
