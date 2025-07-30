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

export function handleCustomAnalyticsEvent(eventName, element) {
  let daaLhValue = '';
  let daaLhElement = element.closest('[daa-lh]');
  while (daaLhElement) {
    if (daaLhValue) {
      daaLhValue = `|${daaLhValue}`;
    }
    const daaLhAttrValue = daaLhElement.getAttribute('daa-lh');
    daaLhValue = `${daaLhAttrValue}${daaLhValue}`;
    daaLhElement = daaLhElement.parentElement.closest('[daa-lh]');
  }
  if (daaLhValue) {
    // eslint-disable-next-line no-underscore-dangle
    window._satellite?.track('event', {
      xdm: {},
      data: { web: { webInteraction: { name: `${eventName}|${daaLhValue}` } } },
    });
  }
}

function enableAnalytics(el, self) {
  const tabs = el.closest('.tabs');
  if (tabs) {
    const blocks = tabs.querySelectorAll('[data-block]');
    blocks.forEach((block) => {
      block.removeAttribute('data-block');
    });
  }

  const tabPanel = el.closest('.tabpanel');
  const tabPanelDaaLh = tabPanel?.getAttribute('data-nested-lh');
  if (tabPanelDaaLh) {
    tabPanel.setAttribute('daa-lh', `${tabPanelDaaLh}--tab`);
  }

  const cards = self ? [el] : el.querySelectorAll('merch-card');
  cards.forEach(async (card) => {
    await card.checkReady();
    card.setAttribute('name', card.getAttribute('daa-lh'));
    card.removeAttribute('daa-lh');
    card.querySelectorAll('a[daa-ll]').forEach((anchor) => {
      const ll = anchor.getAttribute('daa-ll');
      anchor.setAttribute('daa-ll', `${ll}--${card.name}--card`);
    });
    card.querySelectorAll('merch-addon').forEach((ao) => {
      ao.addEventListener('change', (aoe) => {
        handleCustomAnalyticsEvent(`addon-${aoe.detail.checked ? 'checked' : 'unchecked'}--${card.name}--card`, aoe.target);
      });
    });
    card.querySelectorAll('merch-quantity-select').forEach((qs) => {
      qs.addEventListener('merch-quantity-selector:change', (qse) => {
        handleCustomAnalyticsEvent(`quantity-${qse.detail.option}--${card.name}--card`, qse.target);
      });
    });
  });
}

export function postProcessAutoblock(autoblockEl, self = false) {
  decorateLinks(autoblockEl);
  localizePreviewLinks(autoblockEl);
  autoblockEl.querySelectorAll('.modal.link-block').forEach((blockEl) => loadBlock(blockEl));
  decorateCardCtasWithA11y(autoblockEl, self);
  enableAnalytics(autoblockEl, self);
}
