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

function createStyleProbe(heading) {
  const probe = createTag(`h${Number(heading.dataset.masOrigLevel)}`);
  [...heading.attributes].forEach(({ name, value }) => probe.setAttribute(name, value));
  // Content-dependent selectors such as h4:has(> svg) control icon alignment.
  probe.append(...[...heading.childNodes].map((node) => node.cloneNode(true)));
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
  return probe;
}

// Measures and reapplies in three phases (insert all probes, read all values, write all values)
// so a whole batch costs a single forced style recalc instead of one per property read.
function applyPreservedStyles(headings) {
  const targets = headings
    .filter((heading) => Number(heading.dataset.masOrigLevel) && heading.isConnected)
    .map((heading) => ({ heading, probe: createStyleProbe(heading) }));
  if (!targets.length) return;
  try {
    targets.forEach(({ heading, probe }) => heading.after(probe));
    const measured = targets.map(({ probe }) => {
      const computed = getComputedStyle(probe);
      return PRESERVED_STYLE_PROPS.map((prop) => computed[prop]);
    });
    targets.forEach(({ heading }, i) => {
      PRESERVED_STYLE_PROPS.forEach((prop, j) => { heading.style[prop] = measured[i][j]; });
    });
  } finally {
    targets.forEach(({ probe }) => probe.remove());
  }
}

function swapHeadingTag(heading, newLevel) {
  const next = createTag(`h${newLevel}`);
  [...heading.attributes].forEach(({ name, value }) => next.setAttribute(name, value));
  next.append(...heading.childNodes);
  heading.replaceWith(next);
  return next;
}

// Cards finish at different async points, and reading style right after a swap forces a recalc.
// Batch mode keeps the original headings in place and swaps them from a ResizeObserver callback,
// which runs after the frame's layout and before paint: the original headings' computed style is
// read for free, and no frame is painted without the preserved styles. Headings that are never
// laid out (display:none) are swapped by the fallback timer.
const pendingSwaps = new Map();
let headingObserver;
let fallbackTimer;
function flushPendingSwaps(targets) {
  const items = targets.filter((heading) => pendingSwaps.has(heading))
    .map((heading) => ({ heading, newLevel: pendingSwaps.get(heading) }));
  items.forEach(({ heading }) => {
    pendingSwaps.delete(heading);
    headingObserver?.unobserve(heading);
  });
  const measured = items.map(({ heading }) => {
    if (!heading.isConnected) return null;
    const computed = getComputedStyle(heading);
    return PRESERVED_STYLE_PROPS.map((prop) => computed[prop]);
  });
  items.forEach(({ heading, newLevel }, i) => {
    const next = swapHeadingTag(heading, newLevel);
    if (!measured[i]) return;
    PRESERVED_STYLE_PROPS.forEach((prop, j) => { next.style[prop] = measured[i][j]; });
  });
}

function queueHeadingSwaps(items) {
  if (!items.length) return;
  if (typeof ResizeObserver === 'undefined') {
    items.forEach(({ heading, newLevel }) => pendingSwaps.set(heading, newLevel));
    flushPendingSwaps(items.map(({ heading }) => heading));
    return;
  }
  headingObserver ||= new ResizeObserver((entries) => {
    flushPendingSwaps(entries.map(({ target }) => target));
  });
  items.forEach(({ heading, newLevel }) => {
    pendingSwaps.set(heading, newLevel);
    headingObserver.observe(heading);
  });
  clearTimeout(fallbackTimer);
  fallbackTimer = setTimeout(() => flushPendingSwaps([...pendingSwaps.keys()]), 3000);
}

let responsiveSyncAdded = false;
function ensureResponsiveHeadingSync() {
  if (responsiveSyncAdded) return;
  responsiveSyncAdded = true;
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      applyPreservedStyles([...document.querySelectorAll('[data-mas-orig-level]')]);
    }, 150);
  });
}

export function overrideCardHeadingLevel(card, targetLevel, { batch = false } = {}) {
  const headings = [...card.querySelectorAll('h1,h2,h3,h4,h5,h6')];
  if (!headings.length) return;
  const origLevels = headings.map((h) => {
    const level = Number(h.dataset.masOrigLevel) || Number(h.tagName[1]);
    h.dataset.masOrigLevel = level;
    return level;
  });
  const base = Math.min(...origLevels);
  const delta = targetLevel - base;
  const swapped = [];
  const queued = [];
  headings.forEach((heading, i) => {
    const newLevel = Math.min(6, Math.max(1, origLevels[i] + delta));
    if (newLevel === Number(heading.tagName[1])) return;
    if (batch) queued.push({ heading, newLevel });
    else swapped.push(swapHeadingTag(heading, newLevel));
  });
  if (batch) queueHeadingSwaps(queued);
  else applyPreservedStyles(swapped);
  ensureResponsiveHeadingSync();
}

async function postProcessCard(card) {
  await decorateContentLinks(card);
  await localizePreviewLinks(card);
  await localizeMerchIcons(card);
  decorateCardCtasWithA11y(card);
  enableAnalytics(card);
  const headingLevel = getMerchCardHeadingLevel();
  if (headingLevel) overrideCardHeadingLevel(card, headingLevel, { batch: true });
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
