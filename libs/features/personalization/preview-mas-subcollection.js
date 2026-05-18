// MEP "Highlight M@S Content" — sub-collection edit badges.
//
// A <merch-card-collection> can host sub-collections surfaced in the
// sidenav (e.g., plans-page categories: Photo / Video / Design). When the
// user picks one, we render an "Edit Sub-collection" badge linking into
// M@S Studio.
//
// Capture is wired by the autoblock via attachAemLoadListener BEFORE
// decoration: the M@S collection web component removes the parent
// <aem-fragment> immediately after dispatching aem:load, so its rawData
// can't be read after the fact.

import { createTag } from '../../utils/utils.js';
import { mepMasStudioUrls } from '../../blocks/merch/mas-mep-utils.js';

export const SUB_COLLECTION_BADGE_CLASS = 'mep-mas-sub-collection-badge';

// container -> Array<{ id, label, queryLabel }>
export const mepMasSubCollections = new WeakMap();

// Walks referencesTree from aem:load.detail (shape: mas/web-components/
// src/merch-card-collection.js). Sub-collections have fields.queryLabel
// — that's what the sidenav matches against. Recurses for nested catalogs.
export function extractSubCollections(payload) {
  if (!payload) return [];
  const { references, referencesTree } = payload;
  if (!Array.isArray(referencesTree) || !references) return [];
  const out = [];
  const seen = new Set();
  function walk(nodes) {
    nodes.forEach((node) => {
      if (!node || typeof node !== 'object') return;
      const { identifier } = node;
      if (identifier && !seen.has(identifier)) {
        const fields = references[identifier]?.value?.fields;
        if (fields?.queryLabel) {
          seen.add(identifier);
          out.push({
            id: identifier,
            label: fields.label || '',
            queryLabel: fields.queryLabel,
          });
        }
      }
      if (Array.isArray(node.referencesTree) && node.referencesTree.length) {
        walk(node.referencesTree);
      }
    });
  }
  walk(referencesTree);
  return out;
}

export function getSubCollectionsFor(container) {
  if (!container) return [];
  return mepMasSubCollections.get(container) || [];
}

// One-shot aem:load capture — must be attached pre-decoration because M@S
// removes the aem-fragment immediately after dispatching the event.
export function attachAemLoadListener(aemFragment, container) {
  if (!aemFragment || !container) return;
  aemFragment.addEventListener('aem:load', (event) => {
    const subCollections = extractSubCollections(event.detail);
    if (subCollections.length) {
      mepMasSubCollections.set(container, subCollections);
    }
  }, { once: true });
}

// Rewrites the parent's Studio URL to open the named sub-collection in
// fragment-editor view. content-type stays as merch-card-collection
// (sub-collections are themselves collections).
export function toSubCollectionStudioUrl(parentUrl, subCollectionId) {
  if (!parentUrl || !subCollectionId) return parentUrl;
  try {
    const u = new URL(parentUrl, window.location.origin);
    const hash = (u.hash || '').replace(/^#/, '');
    const hp = new URLSearchParams(hash);
    if (hp.has('fragmentId')) hp.set('fragmentId', subCollectionId);
    else if (hp.has('query')) hp.set('query', subCollectionId);
    else if (hp.has('fragment')) hp.set('fragment', subCollectionId);
    else hp.set('fragmentId', subCollectionId);
    hp.set('page', 'fragment-editor');
    if (!hp.get('content-type')) hp.set('content-type', 'merch-card-collection');
    u.hash = `#${hp.toString()}`;
    return u.toString();
  } catch (e) {
    return parentUrl;
  }
}

// The badge lives OUTSIDE the container (see CRITICAL note in
// injectSubCollectionBadge), so we walk back through any sibling MEP
// edit-badges to find ours. Without the walk, restamp passes that
// re-insert the parent badge would orphan the previous sub badge.
function findExistingBadge(container) {
  let prev = container.previousElementSibling;
  while (prev) {
    if (prev.classList?.contains(SUB_COLLECTION_BADGE_CLASS)) return prev;
    if (!prev.classList?.contains('mep-mas-edit-badge')) return null;
    prev = prev.previousElementSibling;
  }
  return null;
}

export function injectSubCollectionBadge(container, pageMarket) {
  if (!container) return;
  // Skip hidden tab variants (e.g., plans page wraps each tab —
  // Individuals / Business / Students / Schools — in its own container).
  // Without this guard we'd render one badge per tab. offsetHeight covers
  // position:fixed where offsetParent can be null on visible elements.
  if (!container.offsetParent && container.offsetHeight === 0) {
    findExistingBadge(container)?.remove();
    return;
  }
  const collection = container.querySelector('merch-card-collection');
  const filter = (collection?.getAttribute('filter') || '').trim();
  const subs = getSubCollectionsFor(container);
  const existing = findExistingBadge(container);

  if (!filter || filter === 'all' || !subs.length) {
    existing?.remove();
    return;
  }

  const active = subs.find((s) => s.queryLabel === filter);
  if (!active) {
    existing?.remove();
    return;
  }

  const parentUrl = mepMasStudioUrls.get(container);
  if (!parentUrl) {
    existing?.remove();
    return;
  }
  const url = toSubCollectionStudioUrl(parentUrl, active.id);
  const marketSuffix = pageMarket ? ` \u00b7 ${pageMarket.toUpperCase()}` : '';
  const labelText = `Edit Sub-collection: ${active.label || active.queryLabel}${marketSuffix}`;

  if (existing) {
    if (existing.dataset.mepMasSubId === active.id
      && existing.dataset.mepMasMarket === (pageMarket || '')) {
      return;
    }
    existing.href = url;
    existing.textContent = labelText;
    existing.dataset.mepMasSubId = active.id;
    existing.dataset.mepMasMarket = pageMarket || '';
    return;
  }

  const a = createTag(
    'a',
    {
      class: SUB_COLLECTION_BADGE_CLASS,
      href: url,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  );
  a.textContent = labelText;
  a.dataset.mepMasSubId = active.id;
  a.dataset.mepMasMarket = pageMarket || '';
  // CRITICAL: insert OUTSIDE the container, not inside. The container is a
  // CSS grid (.collection-container.plans uses grid-template-areas) — a
  // 4th grid child would auto-place at the bottom, well below the cards.
  container.insertAdjacentElement('beforebegin', a);
}

export function removeSubCollectionBadges() {
  document.querySelectorAll(`a.${SUB_COLLECTION_BADGE_CLASS}`).forEach((el) => el.remove());
}
