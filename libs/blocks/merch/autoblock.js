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

export function decorateCardCtasWithA11y(card) {
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
    daaLhElement = daaLhElement.parentElement?.closest('[daa-lh]');
  }
  if (daaLhValue) {
    // eslint-disable-next-line no-underscore-dangle
    window._satellite?.track('event', {
      xdm: {},
      data: { web: { webInteraction: { name: `${eventName}|${daaLhValue}` } } },
    });
  }
}

export function cleanupTabsAnalytics(el) {
  const tabs = el.closest('.tabs');
  if (tabs) {
    const blocksWithMerch = Array.from(document.querySelectorAll('[data-block]'))
      .filter((block) => block.querySelector('merch-card, merch-card-collection'));
    blocksWithMerch.forEach((block) => block.removeAttribute('data-block'));
    const tabPanel = el.closest('.tabpanel');
    const tabPanelDaaLh = tabPanel?.getAttribute('data-nested-lh');
    if (tabPanelDaaLh) {
      tabPanel.setAttribute('daa-lh', `${tabPanelDaaLh}--tab`);
    }
  }
}

export function enableAnalytics(card) {
  const getCardLL = (ll) => `${ll}--${card.getAttribute('data-analytics-id')}--card`;
  card.setAttribute('data-analytics-id', card.getAttribute('daa-lh'));
  card.removeAttribute('daa-lh');
  card.querySelectorAll('a[daa-ll]').forEach((anchor) => {
    const ll = anchor.getAttribute('daa-ll');
    anchor.setAttribute('daa-ll', getCardLL(ll));
  });
  card.querySelectorAll('merch-addon').forEach((ao) => {
    ao.addEventListener('change', (aoe) => {
      handleCustomAnalyticsEvent(getCardLL(`addon-${aoe.detail.checked ? 'checked' : 'unchecked'}`), aoe.target);
    });
  });
  card.querySelectorAll('merch-quantity-select').forEach((qs) => {
    qs.addEventListener('merch-quantity-selector:change', (qse) => {
      handleCustomAnalyticsEvent(getCardLL(`quantity-${qse.detail.option}`), qse.target);
    });
  });
}

export async function postProcessAutoblock(autoblockEl, isCard = false) {
  cleanupTabsAnalytics(autoblockEl);
  const cards = isCard ? [autoblockEl] : Array.from(autoblockEl.querySelectorAll('merch-card'));
  const processPromises = cards.map(async (card) => {
    try {
      await card.checkReady();
      decorateLinks(card);
      localizePreviewLinks(card);
      card.querySelectorAll('.modal.link-block').forEach((blockEl) => loadBlock(blockEl));
      decorateCardCtasWithA11y(card);
      enableAnalytics(card);
    } catch (e) {
      window.lana?.log(`Error processing autoblock element: ${e.toString()}`);
    }
  });
  return Promise.allSettled(processPromises);
}
