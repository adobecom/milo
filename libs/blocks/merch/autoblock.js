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

export async function decorateCardCtasWithA11y(element, self) {
  const cards = self ? [element] : element.querySelectorAll('merch-card');
  cards.forEach(async (card) => {
    await card.checkReady();
    card.querySelectorAll('a[href]').forEach((link) => {
      if (link.getAttribute('aria-label')) return;

      if (link.isCheckoutLink) {
        link.onceSettled().then(() => {
          addAriaLabelToCta(link);
        });
      } else {
        const productName = card.querySelector('h3')?.textContent || '';
        link.setAttribute('aria-label', `${link.textContent}${productName ? ' - ' : ''}${productName}`);
      }
    });
  });
}

export function postProcessAutoblock(autoblockEl, self = false) {
  decorateLinks(autoblockEl);
  localizePreviewLinks(autoblockEl);
  autoblockEl.querySelectorAll('.modal.link-block').forEach((blockEl) => loadBlock(blockEl));
  decorateCardCtasWithA11y(autoblockEl, self);
}
