import { getConfig } from '../../../../utils/utils.js';
import { getMarketConfig } from '../../../../utils/market.js';
import { getFileName } from '../../../personalization/personalization.js';
import {
  watchForMasContent,
  unwatchForMasContent,
  injectMasBadges,
  removeMasBadges,
} from '../mep-mas.js';
import {
  injectCaasBadges,
  removeCaasBadges,
  watchForCaasBlocks,
  unwatchForCaasBlocks,
  rewriteForPreviewHost,
  rewriteBlogPreviewHost,
} from '../mep-caas.js';

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

export function toggleHighlight(event) {
  const { checked, id } = event.target;
  const handler = HIGHLIGHT_HANDLERS[id];
  if (!handler) return;
  document.body.dataset[handler.dataKey] = checked;
  (checked ? handler.on : handler.off).forEach((fn) => fn());
}

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
  return {
    width: Math.max(parseFloat(beforeStyles.width) + 30, 200),
    height: parseFloat(beforeStyles.height) || parseFloat(beforeStyles.minHeight) || 35,
  };
}

function getFragmentPath(fragment) {
  const path = fragment.dataset.path || fragment.dataset.fragmentPath || fragment.dataset.cardUrl;
  if (!fragment.dataset.cardUrl) return path;
  return rewriteBlogPreviewHost(path) || rewriteForPreviewHost(path);
}

export function setBadgeEventListeners() {
  const FRAGMENT_SELECTOR = '[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id], [data-fragment-default], [data-card-url]';

  function isInBadgeArea(x, y, topOffset, width, height) {
    return x >= 0 && x < width && y >= topOffset && y < topOffset + height;
  }

  document.body.addEventListener('click', (e) => {
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
      e.stopPropagation();
      if (fragmentPath) window.open(fragmentPath, '_blank');
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

    // ::before badges anchor to the host's nearest positioned ancestor — usually
    // the host, but not for gnav promos (host is position:static, badge resolves
    // up to header.global-navigation). Walk up to find the real containing block.
    let containerRect;
    if (elementStyle.position !== 'static') {
      containerRect = fragment.getBoundingClientRect();
    } else {
      let ancestor = fragment.parentElement;
      while (ancestor && window.getComputedStyle(ancestor).position === 'static') {
        ancestor = ancestor.parentElement;
      }
      containerRect = (ancestor || document.documentElement).getBoundingClientRect();
    }
    const badgeAbsTop = containerRect.top + (parseFloat(beforeStyles.top) || 0);
    const badgeAbsLeft = containerRect.left + (parseFloat(beforeStyles.left) || 0);
    const inBadgeY = e.clientY >= badgeAbsTop && e.clientY < (badgeAbsTop + badgeHeight);
    const inBadgeX = e.clientX >= badgeAbsLeft && e.clientX < (badgeAbsLeft + badgeWidth);
    if (inBadgeY && inBadgeX) handleBadgeClick();
  });
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
    [data-mas-block='collection'] [data-mas-block='card'],
    [data-mas-block='inline'],
    [data-mas-block='offer'],
    [data-mas-block='ost']
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

function getBadgeHeight(el) {
  const s = window.getComputedStyle(el, '::before');
  const content = parseFloat(s.height) || parseFloat(s.minHeight) || 0;
  const padding = (parseFloat(s.paddingTop) || 0) + (parseFloat(s.paddingBottom) || 0);
  const border = (parseFloat(s.borderTopWidth) || 0) + (parseFloat(s.borderBottomWidth) || 0);
  return content + padding + border || 35;
}

const BADGE_SELECTORS = '[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id][data-path], [data-fragment-default]';
const BADGE_SPACING = 4;

function getBadgeEntry(el) {
  const beforeStyles = window.getComputedStyle(el, '::before');
  if (beforeStyles.content === 'none' || beforeStyles.display === 'none') return null;

  const badgeHeight = getBadgeHeight(el);
  const topOffset = parseFloat(el.style.getPropertyValue('--badge-top-offset')) || 0;

  if (window.getComputedStyle(el).display === 'contents') {
    const visibleChild = Array.from(el.children).find((c) => c.offsetHeight > 0);
    if (!visibleChild) return null;
    const anchor = visibleChild.getBoundingClientRect().top;
    const top = anchor - badgeHeight + topOffset;
    const toOffset = (t) => t - anchor + badgeHeight;
    return { el, badgeHeight, top, toOffset };
  }

  const anchor = el.getBoundingClientRect().top;
  return { el, badgeHeight, top: anchor + topOffset, toOffset: (t) => t - anchor };
}

function adjustBadgePositions() {
  const allBadges = [...document.querySelectorAll(BADGE_SELECTORS)];

  allBadges.forEach((el) => el.style.removeProperty('--badge-top-offset'));

  allBadges.forEach((el) => {
    const badgeHeight = getBadgeHeight(el);
    const section = el.closest('.section');
    const height = section ? section.offsetHeight : el.offsetHeight;
    if (height < 10) el.style.setProperty('--badge-top-offset', `-${badgeHeight + BADGE_SPACING}px`);
  });

  const positioned = allBadges.map(getBadgeEntry).filter(Boolean);
  positioned.sort((a, b) => a.top - b.top);

  let prevBottom = -Infinity;
  positioned.forEach((badge) => {
    if (badge.top < prevBottom + BADGE_SPACING) {
      badge.top = prevBottom + BADGE_SPACING;
      badge.el.style.setProperty('--badge-top-offset', `${badge.toOffset(badge.top)}px`);
    }
    prevBottom = badge.top + badge.badgeHeight;
  });
}

let badgeAdjustTimer;
const highlightObserver = new MutationObserver(() => {
  refreshPageUpdateCounts();
  clearTimeout(badgeAdjustTimer);
  badgeAdjustTimer = setTimeout(adjustBadgePositions, 50);
});
highlightObserver.observe(document.body, { childList: true, subtree: true });

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
        el.dataset.mepHtmlBadge = 'true'; // gnav workaround: non-clickable badge
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
  requestAnimationFrame(adjustBadgePositions);
}
