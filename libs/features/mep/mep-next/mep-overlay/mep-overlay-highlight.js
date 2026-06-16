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
import { getConfig } from '../../../../utils/utils.js';

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

export function setHighlightData() {
  function markDefaultFragments() {
    document.querySelectorAll('[data-path]').forEach((fragment) => {
      const { manifestId, mepLingoRoc, mepLingoFallback, path } = fragment.dataset;
      if (!manifestId && !mepLingoRoc && !mepLingoFallback && path) {
        fragment.dataset.fragmentDefault = '';
        fragment.dataset.fragmentDisplay = path;
      }
    });
  }

  function processExperiment({ selectedVariant, manifest }) {
    const manifestName = getFileName(manifest);

    function applyManifestId(selector, prop = 'manifestId') {
      document.querySelectorAll(selector).forEach((el) => {
        el.dataset[prop] = manifestName;
        if (prop === 'manifestId') el.dataset.manifestDisplay = `${manifestName}: html`;
      });
    }

    selectedVariant?.replacefragment?.forEach(({ val }) => {
      document.querySelectorAll(`[data-path*="${val}"]`).forEach((el) => {
        el.dataset.manifestId = manifestName;
        el.dataset.fragmentPath = val;
        el.dataset.manifestDisplay = `${manifestName}: ${el.dataset.path || val}`;
      });
    });

    selectedVariant?.useblockcode?.forEach(({ selector }) => {
      if (selector) applyManifestId(`.${selector}`, 'codeManifestId');
    });

    selectedVariant?.updatemetadata?.forEach(({ selector }) => {
      if (selector === 'gnav-source') applyManifestId('header, footer');
    });

    const merchCardSel = `.section[class*="merch-cards"] .fragment[data-manifest-id="${manifestName}"] merch-card`;
    document.querySelectorAll(merchCardSel).forEach((el) => {
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
  }

  markDefaultFragments();
  const config = getConfig();
  if (!config.mep?.preview) return;
  config.mep.experiments.forEach(processExperiment);
}

export function toggleHighlight(event) {
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

export function setBadgeEventListeners() {
  const FRAGMENT_SELECTOR = '[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id], [data-fragment-default], [data-card-url]';

  function getBadgeDimensions(beforeStyles) {
    const width = Math.max(parseFloat(beforeStyles.width) + 30, 200);
    const height = parseFloat(beforeStyles.height) || parseFloat(beforeStyles.minHeight) || 35;
    return { width, height };
  }

  function getFragmentPath(fragment) {
    const path = fragment.dataset.path || fragment.dataset.fragmentPath || fragment.dataset.cardUrl;
    if (fragment.dataset.cardUrl) {
      return rewriteBlogPreviewHost(path) || rewriteForPreviewHost(path);
    }
    return path;
  }

  function isInBadgeArea(x, y, topOffset, width, height) {
    return x >= 0 && x < width && y >= topOffset && y < topOffset + height;
  }

  document.body.addEventListener('click', (e) => {
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

export function getPageUpdates() {
  const count = 0;
  return `${count} Page Updates`;
}
