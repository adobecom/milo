import { getConfig } from '../../../../utils/utils.js';
import { getMarketConfig } from '../../../../utils/market.js';
import { getFileName } from '../../../personalization/personalization.js';
import { mepMasStudioUrls } from '../../../../blocks/merch/mas-mep-utils.js';
import {
  watchForMasContent,
  unwatchForMasContent,
  injectMasBadges,
  removeMasBadges,
  MAS_OSI_SELECTOR,
} from '../mep-mas.js';
import {
  injectCaasBadges,
  removeCaasBadges,
  watchForCaasBlocks,
  unwatchForCaasBlocks,
  rewriteForPreviewHost,
  rewriteBlogPreviewHost,
} from '../mep-caas.js';

const MAS_PSEUDO_BADGE_SELECTOR = "[data-mas-block='offer'], [data-mas-block='inline'], [data-mas-block='ost']";

export const HIGHLIGHT_KEYS = {
  mep: 'mepHighlight',
  caas: 'mepCaasHighlight',
  mas: 'mepMasHighlight',
  other: 'otherHighlight',
};

export const TOGGLE_KEYS = {
  mep: 'toggle-mep',
  caas: 'toggle-caas',
  mas: 'toggle-mas',
  other: 'toggle-other-fragments',
};

const HIGHLIGHT_HANDLERS = {
  [TOGGLE_KEYS.mep]: {
    dataKey: HIGHLIGHT_KEYS.mep,
    on: [],
    off: [],
  },
  [TOGGLE_KEYS.caas]: {
    dataKey: HIGHLIGHT_KEYS.caas,
    on: [watchForCaasBlocks, injectCaasBadges],
    off: [unwatchForCaasBlocks, removeCaasBadges],
  },
  [TOGGLE_KEYS.mas]: {
    dataKey: HIGHLIGHT_KEYS.mas,
    on: [watchForMasContent, injectMasBadges],
    off: [unwatchForMasContent, removeMasBadges],
  },
  [TOGGLE_KEYS.other]: {
    dataKey: HIGHLIGHT_KEYS.other,
    on: [],
    off: [],
  },
};

export function getParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    mepAkamaiLocale: urlParams.get('akamaiLocale'),
    mepHighlight: urlParams.get(HIGHLIGHT_KEYS.mep),
    mepCaasHighlight: urlParams.get(HIGHLIGHT_KEYS.caas),
    mepMasHighlight: urlParams.get(HIGHLIGHT_KEYS.mas),
    mepOtherHighlight: urlParams.get(HIGHLIGHT_KEYS.other),
  };
}

function getBadgeDimensions(beforeStyles) {
  const paddingX = (parseFloat(beforeStyles.paddingLeft) || 0)
    + (parseFloat(beforeStyles.paddingRight) || 0);
  const paddingY = (parseFloat(beforeStyles.paddingTop) || 0)
    + (parseFloat(beforeStyles.paddingBottom) || 0);
  const borderX = (parseFloat(beforeStyles.borderLeftWidth) || 0)
    + (parseFloat(beforeStyles.borderRightWidth) || 0);
  const borderY = (parseFloat(beforeStyles.borderTopWidth) || 0)
    + (parseFloat(beforeStyles.borderBottomWidth) || 0);
  const contentWidth = parseFloat(beforeStyles.width) || 0;
  const contentHeight = parseFloat(beforeStyles.height) || parseFloat(beforeStyles.minHeight) || 0;
  return {
    width: contentWidth + paddingX + borderX,
    height: (contentHeight + paddingY + borderY) || 35,
  };
}

function getFragmentPath(fragment) {
  const path = fragment.dataset.path || fragment.dataset.fragmentPath || fragment.dataset.cardUrl
    || mepMasStudioUrls.get(fragment);
  if (!fragment.dataset.cardUrl) return path;
  return rewriteBlogPreviewHost(path) || rewriteForPreviewHost(path);
}

export function setBadgeEventListeners() {
  const FRAGMENT_SELECTOR = `[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id], [data-fragment-default], [data-card-url], ${MAS_PSEUDO_BADGE_SELECTOR}`;

  function isInBadgeArea(x, y, topOffset, width, height) {
    return x >= 0 && x < width && y >= topOffset && y < topOffset + height;
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.mep-preview-overlay')) return;

    const fragment = e.target.closest(FRAGMENT_SELECTOR);
    if (!fragment) return;

    const beforeStyles = window.getComputedStyle(fragment, '::before');
    const badgeVisible = beforeStyles.display !== 'none' && beforeStyles.content !== 'none';
    if (!badgeVisible) return;

    const { width: badgeWidth, height: badgeHeight } = getBadgeDimensions(beforeStyles);
    const fragmentPath = getFragmentPath(fragment);

    const handleBadgeClick = () => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (!fragmentPath) return;
      try {
        const { protocol } = new URL(fragmentPath, window.location.origin);
        if (protocol === 'http:' || protocol === 'https:') window.open(fragmentPath, '_blank', 'noopener');
      } catch (err) { /* invalid URL — ignore */ }
    };

    const elementStyle = window.getComputedStyle(fragment);

    if (elementStyle.display === 'contents') {
      const topOffset = parseFloat(fragment.style.getPropertyValue('--badge-top-offset')) || 0;
      const visibleChildren = Array.from(fragment.children).filter((c) => c.offsetHeight > 0);
      if (visibleChildren.length === 0) {
        if (e.clientX >= 0 && e.clientX < badgeWidth) handleBadgeClick();
        return;
      }
      for (const child of visibleChildren) {
        const { top, left } = child.getBoundingClientRect();
        const relX = e.clientX - left;
        const relY = e.clientY - top - (topOffset - badgeHeight);
        if (isInBadgeArea(relX, relY, 0, badgeWidth, badgeHeight)) {
          handleBadgeClick();
          return;
        }
      }
      return;
    }

    let containerEl = fragment;
    if (elementStyle.position === 'static') {
      let ancestor = fragment.parentElement;
      while (ancestor && window.getComputedStyle(ancestor).position === 'static') {
        ancestor = ancestor.parentElement;
      }
      containerEl = ancestor || document.documentElement;
    }
    const containerRect = containerEl.getBoundingClientRect();
    const containerStyle = window.getComputedStyle(containerEl);
    const containerBorderTop = parseFloat(containerStyle.borderTopWidth) || 0;
    const containerBorderLeft = parseFloat(containerStyle.borderLeftWidth) || 0;
    const badgeAbsTop = containerRect.top + containerBorderTop
      + (parseFloat(beforeStyles.top) || 0);
    const badgeAbsLeft = containerRect.left + containerBorderLeft
      + (parseFloat(beforeStyles.left) || 0);
    const inBadgeY = e.clientY >= badgeAbsTop && e.clientY < (badgeAbsTop + badgeHeight);
    const inBadgeX = e.clientX >= badgeAbsLeft && e.clientX < (badgeAbsLeft + badgeWidth);
    if (inBadgeY && inBadgeX) handleBadgeClick();
  }, true);
}

const PAGE_UPDATE_SELECTORS = {
  MEP: `
    [data-code-manifest-id],
    [data-manifest-id],
    [data-mep-lingo-fallback],
    [data-mep-lingo-roc],
    [data-removed-manifest-id]
  `,
  Caas: `
    [data-caas-block],
    [data-caas-block] [data-country]:not([data-card-url]),
    [data-caas-block] [data-country]:not([data-country='xx']),
    [data-caas-block] [data-country='xx']
  `,
  'M@S': `
    [data-mas-block='card'],
    [data-mas-block='collection'],
    [data-mas-block='collection'] merch-card,
    [data-mas-block='inline'],
    [data-mas-block='ost'],
    ${MAS_OSI_SELECTOR}
  `,
  'Other Fragments': '[data-fragment-default]',
};

const getPageUpdateCount = (label) => {
  const selector = PAGE_UPDATE_SELECTORS[label];
  return selector ? document.querySelectorAll(selector).length : 0;
};

export function refreshPageUpdateCounts() {
  document.querySelectorAll('.mep-toggle-text h2').forEach((h2) => {
    const label = h2.textContent;
    if (!PAGE_UPDATE_SELECTORS[label]) return;
    const valueEl = h2.nextElementSibling;
    const newText = `${getPageUpdateCount(label)} Page Updates`;
    if (valueEl && valueEl.textContent !== newText) valueEl.textContent = newText;
  });
}

const REAL_DOM_BADGE_SELECTOR = '.mep-caas-edit-badge, .mep-mas-edit-badge, .mep-mas-sub-collection-badge';

function getBadgeStyles(el) {
  return el.matches(REAL_DOM_BADGE_SELECTOR) ? window.getComputedStyle(el) : window.getComputedStyle(el, '::before');
}

function getBadgeHeight(el) {
  return getBadgeDimensions(getBadgeStyles(el)).height;
}

const BADGE_SELECTORS = `[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id][data-path], [data-fragment-default], ${MAS_PSEUDO_BADGE_SELECTOR}, ${REAL_DOM_BADGE_SELECTOR}`;
const BADGE_SPACING = 4;

const BADGE_MAX_WIDTH_SELECTORS = `
  [data-manifest-id],
  [data-code-manifest-id],
  [data-removed-manifest-id],
  [data-mep-lingo-roc],
  [data-mep-lingo-fallback],
  [data-fragment-default],
  [data-caas-block] [data-country],
  ${MAS_PSEUDO_BADGE_SELECTOR},
  ${REAL_DOM_BADGE_SELECTOR}
`;

function getBadgeLeft(el) {
  if (!el.matches(REAL_DOM_BADGE_SELECTOR) && window.getComputedStyle(el).display === 'contents') {
    const visibleChild = Array.from(el.children).find((c) => c.offsetHeight > 0);
    return visibleChild ? visibleChild.getBoundingClientRect().left : null;
  }
  return el.getBoundingClientRect().left;
}

function adjustBadgeMaxWidths() {
  const badges = [...document.querySelectorAll(BADGE_MAX_WIDTH_SELECTORS)];
  const lefts = badges.map(getBadgeLeft);
  badges.forEach((el, i) => {
    if (lefts[i] === null) return;
    el.style.setProperty('--badge-max-width', `${Math.max(window.innerWidth - lefts[i], 0)}px`);
  });
}

function getBadgeEntry(el) {
  const isRealDomBadge = el.matches(REAL_DOM_BADGE_SELECTOR);
  const beforeStyles = getBadgeStyles(el);
  if (beforeStyles.content === 'none' || beforeStyles.display === 'none') return null;

  const { width: badgeWidth, height: badgeHeight } = getBadgeDimensions(beforeStyles);
  const topOffset = parseFloat(el.style.getPropertyValue('--badge-top-offset')) || 0;
  const left = getBadgeLeft(el);
  if (left === null) return null;
  const right = left + badgeWidth;

  if (!isRealDomBadge && window.getComputedStyle(el).display === 'contents') {
    const visibleChild = Array.from(el.children).find((c) => c.offsetHeight > 0);
    if (!visibleChild) return null;
    const anchor = visibleChild.getBoundingClientRect().top;
    const top = anchor - badgeHeight + topOffset;
    const toOffset = (t) => t - anchor + badgeHeight;
    return {
      el, badgeHeight, top, toOffset, left, right,
    };
  }

  const anchor = el.getBoundingClientRect().top;
  return {
    el, badgeHeight, top: anchor + topOffset, toOffset: (t) => t - anchor, left, right,
  };
}

function adjustBadgePositions() {
  const allBadges = [...document.querySelectorAll(BADGE_SELECTORS)];

  allBadges.forEach((el) => el.style.removeProperty('--badge-top-offset'));

  // Batch reads then writes: measure every badge first, then apply the
  // zero-height offsets, so we don't force a layout recalc per element.
  const measured = allBadges.map((el) => {
    const section = el.closest('.section');
    const height = section ? section.offsetHeight : el.offsetHeight;
    return { el, badgeHeight: getBadgeHeight(el), height };
  });
  measured.forEach(({ el, badgeHeight, height }) => {
    if (height < 10) el.style.setProperty('--badge-top-offset', `-${badgeHeight + BADGE_SPACING}px`);
  });

  const positioned = allBadges
    .filter((el) => el.getClientRects().length > 0)
    .map(getBadgeEntry)
    .filter(Boolean);
  positioned.sort((a, b) => a.top - b.top);

  const placed = [];
  positioned.forEach((badge) => {
    const requiredBottom = placed.reduce((max, p) => {
      const overlapsX = badge.left < p.right && p.left < badge.right;
      const overlapsY = badge.top < p.bottom + BADGE_SPACING;
      return (overlapsX && overlapsY) ? Math.max(max, p.bottom + BADGE_SPACING) : max;
    }, -Infinity);

    if (requiredBottom > badge.top) {
      badge.top = requiredBottom;
      badge.el.style.setProperty('--badge-top-offset', `${badge.toOffset(badge.top)}px`);
    }
    placed.push({ left: badge.left, right: badge.right, bottom: badge.top + badge.badgeHeight });
  });
}

function refreshBadges() {
  adjustBadgeMaxWidths();
  adjustBadgePositions();
}

let badgeAdjustRaf;
const highlightObserver = new MutationObserver(() => {
  if (badgeAdjustRaf) return;
  badgeAdjustRaf = requestAnimationFrame(() => {
    badgeAdjustRaf = null;
    refreshPageUpdateCounts();
    refreshBadges();
  });
});

function isAnyHighlightActive() {
  return Object.values(HIGHLIGHT_KEYS).some((key) => document.body.dataset[key] === 'true');
}

function syncHighlightObserver() {
  if (isAnyHighlightActive()) {
    highlightObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    highlightObserver.disconnect();
  }
}

export function toggleHighlight(event) {
  const { checked, id } = event.target;
  const handler = HIGHLIGHT_HANDLERS[id];
  if (!handler) return;
  document.body.dataset[handler.dataKey] = checked;
  (checked ? handler.on : handler.off).forEach((fn) => fn());
  syncHighlightObserver();
  refreshPageUpdateCounts();
  refreshBadges();
}

let resizeRaf;
window.addEventListener('resize', () => {
  if (resizeRaf || !isAnyHighlightActive()) return;
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = null;
    refreshBadges();
  });
});

let scrollRaf;
window.addEventListener('scroll', () => {
  if (scrollRaf || !isAnyHighlightActive()) return;
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = null;
    adjustBadgeMaxWidths();
  });
}, { passive: true, capture: true });

export function getPageUpdates(label) {
  return `${getPageUpdateCount(label)} Page Updates`;
}

function setManifestIdOnElements(selector, manifestName, prop = 'manifestId') {
  document.querySelectorAll(selector).forEach((el) => {
    el.dataset[prop] = manifestName;
    if (prop === 'manifestId') el.dataset.manifestDisplay = `${manifestName}: html`;
  });
}

function setHighlightData() {
  const { mep } = getConfig();
  if (!mep?.experiments) return;

  mep?.experiments?.forEach(({ selectedVariant, manifest }) => {
    const manifestName = getFileName(manifest);

    selectedVariant?.replacefragment?.forEach(({ val }) => {
      document.querySelectorAll(`[data-path*="${val}"]`).forEach((el) => {
        el.dataset.manifestId = manifestName;
        el.dataset.fragmentPath = val;
        el.dataset.manifestDisplay = `${manifestName}: ${el.dataset.path || val}`;
      });
    });

    selectedVariant?.useblockcode?.forEach(({ selector }) => {
      if (selector) setManifestIdOnElements(`.${selector}`, manifestName, 'codeManifestId');
    });

    selectedVariant?.updatemetadata?.forEach(({ selector }) => {
      if (selector === 'gnav-source') setManifestIdOnElements('header, footer', manifestName);
    });

    const fragmentAttr = `[data-manifest-id="${manifestName}"]`;
    const parentFragSelector = `.section[class*="merch-cards"] .fragment${fragmentAttr}`;
    document.querySelectorAll(parentFragSelector).forEach((parentFrag) => {
      const parentPath = parentFrag.dataset.path;
      parentFrag.querySelectorAll('merch-card').forEach((card) => {
        card.dataset.manifestId = manifestName;
        if (parentPath) {
          card.dataset.fragmentPath = parentPath;
          card.dataset.manifestDisplay = `${manifestName}: ${parentPath}`;
        }
      });
    });

    document.querySelectorAll(`[data-manifest-id="${manifestName}"]`).forEach((el) => {
      if (el.dataset.manifestDisplay) return;
      if (el.dataset.path) {
        el.dataset.manifestDisplay = `${manifestName}: ${el.dataset.path}`;
        el.dataset.fragmentPath = el.dataset.path;
      } else {
        el.dataset.manifestDisplay = `${manifestName}: html`;
        el.dataset.mepHtmlBadge = 'true';
      }
    });
  });
}

function setDefaultFragments() {
  document.querySelectorAll('[data-path]').forEach((fragment) => {
    const { manifestId, mepLingoRoc, mepLingoFallback, path } = fragment.dataset;
    if (manifestId || mepLingoRoc || mepLingoFallback || !path) return;
    fragment.dataset.fragmentDefault = '';
    fragment.dataset.fragmentDisplay = path;
  });
}

export default async function init() {
  getMarketConfig();
  setHighlightData();
  setDefaultFragments();
  setBadgeEventListeners();
  requestAnimationFrame(refreshBadges);
}
