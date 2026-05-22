// MEP "Highlight CaaS Content" — edit-in-Configurator badges and
// auto-derived card paths for [data-caas-block] / [data-card-url] surfaces.
//
// Extracted from mep-next.js for separation of concerns.

import { createTag } from '../../../utils/utils.js';
import { mepCaasConfigUrls } from '../../../blocks/caas/utils.js';

const CAAS_BADGE_CLASS = 'mep-caas-edit-badge';

function derivePathsForCards(root = document) {
  root.querySelectorAll('[data-card-url]:not([data-card-path])').forEach((el) => {
    const href = el.dataset.cardUrl;
    if (!href) { el.dataset.cardPath = ''; return; }
    try {
      el.dataset.cardPath = new URL(href).pathname;
    } catch {
      el.dataset.cardPath = '';
    }
  });
}

export function injectCaasBadges() {
  document.querySelectorAll('[data-caas-block]').forEach((el) => {
    const prev = el.previousElementSibling;
    if (prev?.classList?.contains(CAAS_BADGE_CLASS)) return;
    const url = mepCaasConfigUrls.get(el);
    if (!url) return;
    const a = createTag(
      'a',
      {
        class: CAAS_BADGE_CLASS,
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'Edit in CaaS Configurator',
    );
    el.insertAdjacentElement('beforebegin', a);
  });
  derivePathsForCards();
}

export function removeCaasBadges() {
  document.querySelectorAll(`a.${CAAS_BADGE_CLASS}`).forEach((el) => el.remove());
  // Clear derived paths so they don't sit in the DOM as invisible state.
  document.querySelectorAll('[data-card-path]').forEach((el) => delete el.dataset.cardPath);
}

let caasObserver;
export function watchForCaasBlocks() {
  if (caasObserver) return;
  caasObserver = new MutationObserver((mutations) => {
    if (document.body.dataset.mepCaasHighlight !== 'true') return;
    const hasCaasMutation = mutations.some((m) => [...m.addedNodes].some((n) => (n.nodeType === 1)
      && (n.matches?.('[data-caas-block], [data-card-url]')
        || n.querySelector?.('[data-caas-block], [data-card-url]'))));
    if (hasCaasMutation) injectCaasBadges();
  });
  caasObserver.observe(document.body, { childList: true, subtree: true });
}

export function unwatchForCaasBlocks() {
  if (!caasObserver) return;
  caasObserver.disconnect();
  caasObserver = null;
}
