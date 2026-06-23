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
    const topOffset = parseFloat(fragment.style.getPropertyValue('--badge-top-offset')) || 0;

    const handleBadgeClick = () => {
      e.preventDefault();
      e.stopPropagation();
      if (fragmentPath) window.open(fragmentPath, '_blank');
    };

    if (window.getComputedStyle(fragment).display === 'contents') {
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

    const { top, left } = fragment.getBoundingClientRect();
    const clickX = e.clientX - left;
    const clickY = e.clientY - top;
    if (isInBadgeArea(clickX, clickY, topOffset, badgeWidth, badgeHeight)) handleBadgeClick();
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
    const merchCardSelector = `.section[class*="merch-cards"] .fragment${fragmentAttr} merch-card`;
    document.querySelectorAll(merchCardSelector).forEach((el) => {
      el.dataset.manifestId = manifestName;
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
}
