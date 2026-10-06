import { createTag, decorateLinksAsync, getConfig, loadBlock, localizeLinkAsync } from '../../utils/utils.js';
import { addAriaLabelToCta, getMerchCardHeadingLevel } from './merch.js';

let iconsLoaded;
function loadBadgeIcons(cards) {
  if (iconsLoaded) return;
  const hasBadgeIcon = cards.some((card) => card.querySelector('merch-badge[icon^="sp-icon-"]'));
  if (hasBadgeIcon) {
    iconsLoaded = true;
    const { base } = getConfig();
    import(`${base}/features/spectrum-web-components/dist/icons-workflow.js`);
  }
}

export async function localizePreviewLinks(el) {
  const anchors = el.getElementsByTagName('a');
  for (const a of anchors) {
    const { href } = a;
    if (href?.match(/http[s]?:\/\/\S*\.(hlx|aem).(page|live)\//)) {
      try {
        const url = new URL(href);
        a.href = await localizeLinkAsync(href, url.hostname);
      } catch (e) {
        window.lana?.log(`Invalid URL - ${href}: ${e.toString()}`, {
          tags: 'merch-autoblock',
          severity: 'error',
        });
      }
    }
  }
}

const MERCH_ICON_HREF_RE = /^http[s]?:\/\/\S*\.((hlx|aem)\.(page|live)|adobe\.com)\//;

export async function localizeMerchIcons(el) {
  const merchIcons = el.querySelectorAll('merch-icon');
  for (const a of merchIcons) {
    const { href } = a;
    const hostMatch = href?.match(MERCH_ICON_HREF_RE);
    if (hostMatch) {
      try {
        a.href = await localizeLinkAsync(href);
      } catch (e) {
        window.lana?.log(`Invalid URL - ${href}: ${e.toString()}`, {
          tags: 'merch-autoblock',
          severity: 'error',
        });
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
      const productName = card.querySelector('h1,h2,h3,h4,h5,h6')?.textContent || '';
      if (productName === link.textContent) return;
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
    [...tabs.querySelectorAll('button[role=tab]')].forEach((tab) => {
      const tabDaaLl = tab.getAttribute('daa-ll');
      if (!tabDaaLl.includes('-useraction')) {
        tab.setAttribute('daa-ll', `${tabDaaLl}-useraction`);
      }
    });
  }
}

export function enableAnalytics(card) {
  const getCardLL = (ll) => `${ll}--${card.getAttribute('data-analytics-id')}--card`;
  card.setAttribute('data-analytics-id', card.getAttribute('daa-lh') || '');
  card.removeAttribute('daa-lh');
  card.querySelectorAll('a').forEach((anchor) => {
    const ll = anchor.getAttribute('daa-ll') || anchor.textContent.toLowerCase().trim().replaceAll(/\s+/g, '-');
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

export async function decorateContentLinks(el) {
  await decorateLinksAsync(el);
  el.querySelectorAll('.modal.link-block').forEach((blockEl) => loadBlock(blockEl));
}

// mas merch-card CSS targets bare tag selectors (e.g. `[slot="whats-included"] h4`) for
// typography, so swapping the tag drops that styling. Re-measure it via a hidden probe using
// the original tag and reapply inline so the visual look is unaffected by the tag-level a11y
// fix. The probe is re-measured on resize so media-query-driven values (e.g. mobile font-size)
// stay in sync with the viewport instead of being frozen at decoration time.
const PRESERVED_STYLE_PROPS = [
  'fontFamily', 'fontWeight', 'fontSize', 'lineHeight', 'letterSpacing', 'color',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'display', 'alignItems', 'gap',
];

function applyPreservedStyles(heading) {
  const origLevel = Number(heading.dataset.masOrigLevel);
  if (!origLevel || !heading.isConnected) return;
  const probe = createTag(`h${origLevel}`);
  [...heading.attributes].forEach(({ name, value }) => probe.setAttribute(name, value));
  // Content-dependent selectors such as h4:has(> svg) control icon alignment.
  probe.append(...[...heading.childNodes].map((node) => node.cloneNode(true)));
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
  heading.after(probe);
  const computed = getComputedStyle(probe);
  PRESERVED_STYLE_PROPS.forEach((prop) => { heading.style[prop] = computed[prop]; });
  probe.remove();
}

let responsiveSyncAdded = false;
function ensureResponsiveHeadingSync() {
  if (responsiveSyncAdded) return;
  responsiveSyncAdded = true;
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      document.querySelectorAll('[data-mas-orig-level]').forEach(applyPreservedStyles);
    }, 150);
  });
}

export function overrideCardHeadingLevel(card, targetLevel) {
  const headings = [...card.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  if (!headings.length) return;
  const origLevels = headings.map((h) => {
    const level = Number(h.dataset.masOrigLevel) || Number(h.tagName[1]);
    h.dataset.masOrigLevel = level;
    return level;
  });
  const base = Math.min(...origLevels);
  const delta = targetLevel - base;
  headings.forEach((heading, i) => {
    const newLevel = Math.min(6, Math.max(1, origLevels[i] + delta));
    if (newLevel === Number(heading.tagName[1])) return;
    const next = createTag(`h${newLevel}`);
    [...heading.attributes].forEach(({ name, value }) => next.setAttribute(name, value));
    next.append(...heading.childNodes);
    heading.replaceWith(next);
    applyPreservedStyles(next);
  });
  ensureResponsiveHeadingSync();
}

async function postProcessCard(card) {
  await decorateContentLinks(card);
  await localizePreviewLinks(card);
  await localizeMerchIcons(card);
  decorateCardCtasWithA11y(card);
  enableAnalytics(card);
  const headingLevel = getMerchCardHeadingLevel();
  if (headingLevel) overrideCardHeadingLevel(card, headingLevel);
}

export async function postProcessAutoblock(autoblockEl, isCard = false) {
  cleanupTabsAnalytics(autoblockEl);
  const cards = isCard ? [autoblockEl] : Array.from(autoblockEl.querySelectorAll('merch-card'));
  loadBadgeIcons(cards);
  const processPromises = cards.map(async (card) => {
    try {
      const cardReady = await card.checkReady();
      if (cardReady) {
        postProcessCard(card);
      } else {
        card.addEventListener('mas:ready', () => postProcessCard(card));
      }
    } catch (e) {
      window.lana?.log(`Error processing autoblock element: ${e.toString()}`, {
        tags: 'merch-autoblock',
        severity: 'error',
      });
    }
  });
  return Promise.allSettled(processPromises);
}
