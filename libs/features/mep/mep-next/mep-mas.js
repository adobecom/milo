// MEP "Highlight M@S Content" — badges, card action stacks, and content
// observation for merch-card / inline-price / checkout-link / offer surfaces.
//
// Extracted from mep-next.js for separation of concerns.

import { createTag, getConfig, normCountryCode } from '../../../utils/utils.js';
import { mepMasStudioUrls } from '../../../blocks/merch/mas-mep-utils.js';
import { getMiloLocaleSettings } from '../../../blocks/merch/merch.js';
import {
  extractSubCollections,
  injectSubCollectionBadge,
  removeSubCollectionBadges,
  mepMasSubCollections,
} from './mep-mas-subcollection.js';

const MAS_BADGE_CLASS = 'mep-mas-edit-badge';
// Only 'collection' reaches buildMasBadge. Card uses an action stack;
// inline/ost/offer render via CSS ::before pseudos.
const MAS_LABELS = { collection: 'Edit Collection in M@S Studio' };

// Mirrors SELECTOR_MAS_INLINE_PRICE et al. from ../mas/web-components/src/
// constants.js. Inlined rather than imported to avoid a hard runtime
// dependency on M@S's web-components package.
export const MAS_OSI_SELECTOR = [
  'span[is="inline-price"][data-wcs-osi]',
  'a[is="checkout-link"][data-wcs-osi]',
  'a[is="upt-link"][data-wcs-osi]',
  'button[is="checkout-button"][data-wcs-osi]',
  'sp-button[data-wcs-osi]',
].join(',');

export function updateMasNoContentMessage(show) {
  document.querySelectorAll('.mep-mas-no-content').forEach((el) => {
    el.hidden = !show;
  });
}

// Each selector catches a different M@S code path:
//   - [data-mas-block]  autoblock-stamped surface (preview-only)
//   - <merch-card>      web component (incl. collection children)
//   - [data-wcs-osi]    any commerce-bound element (covers standalone offers)
// Snapshot at call time — re-open the popup if M@S content hydrates after.
export function hasMasSurfaces() {
  return !!document.querySelector('[data-mas-block], merch-card, [data-wcs-osi]');
}

// Page-level market, most-to-least authoritative:
//   1. <mas-commerce-service country=…>   what M@S sends to WCS
//   2. getMiloLocaleSettings(locale).country   fallback before the service initializes
//   3. ?akamaiLocale=   spoof param; M@S ignores it when geo-detect is OFF, so
//      the chip will show the URL-path country (signaling the spoof didn't take)
export function getResolvedPageMarket() {
  try {
    const masCountry = document.head.querySelector('mas-commerce-service')?.getAttribute('country');
    if (masCountry) return normCountryCode(masCountry.toLowerCase());
    const { locale } = getConfig() || {};
    const masSettings = getMiloLocaleSettings(locale);
    if (masSettings?.country) return normCountryCode(masSettings.country.toLowerCase());
    const akamai = new URLSearchParams(window.location.search).get('akamaiLocale');
    if (akamai) return normCountryCode(akamai.toLowerCase());
    return null;
  } catch (e) { return null; }
}

// Per-host market, most-to-least authoritative:
//   1. data-ims-country (set post-WCS by M@S checkout-mixin)
//   2. country= query param on a commerce href — what was REQUESTED of WCS
//   3. pageMarket fallback — inline-price always falls here (no per-element country)
export function getCardMarket(el, pageMarket) {
  if (!el) return pageMarket;
  // For offer/ost surfaces the host IS the checkout-link, so check it first.
  const selfImsCountry = el.getAttribute?.('data-ims-country');
  if (selfImsCountry) return normCountryCode(selfImsCountry.toLowerCase());
  const imsCountry = el.querySelector?.('a[data-ims-country]')?.getAttribute('data-ims-country');
  if (imsCountry) return normCountryCode(imsCountry.toLowerCase());
  const candidates = [];
  if (el.tagName === 'A' && el.href) candidates.push(el);
  el.querySelectorAll?.('a[href*="country="]').forEach((a) => candidates.push(a));
  for (const a of candidates) {
    try {
      const url = new URL(a.href, window.location.origin);
      const country = url.searchParams.get('country');
      if (country) return normCountryCode(country.toLowerCase());
    } catch (e) { /* skip and try next candidate */ }
  }
  // Only checkout-mixin and upt-link set data-ims-country; display-only
  // (inline-price) cards fall back to pageMarket.
  return pageMarket;
}

// Returns 'unknown' when either side is unresolved — only 'mismatch' is
// surfaced visually.
function classifyMarket(cardMarket, pageMarket) {
  if (!cardMarket || !pageMarket) return 'unknown';
  return cardMarket === pageMarket ? 'match' : 'mismatch';
}

// Child cards have no authoring <a href> (M@S renders them from collection
// metadata) — clone the parent's captured Studio URL and substitute
// content-type + identifier. Keeps us aligned with the parent's URL
// convention rather than inventing a format. Returns null when undeducible.
export function deriveChildCardStudioUrl(parentUrl, childFragmentId) {
  if (!parentUrl || !childFragmentId) return null;
  try {
    const u = new URL(parentUrl, window.location.origin);
    const hash = (u.hash || '').replace(/^#/, '');
    const hashParams = new URLSearchParams(hash);
    if (hashParams.get('content-type') === 'merch-card-collection') {
      hashParams.set('content-type', 'merch-card');
    }
    if (hashParams.has('query')) hashParams.set('query', childFragmentId);
    else if (hashParams.has('fragment')) hashParams.set('fragment', childFragmentId);
    else hashParams.set('query', childFragmentId);
    u.hash = `#${hashParams.toString()}`;
    return u.toString();
  } catch (e) { return null; }
}

// Rewrites query=/fragment= -> fragmentId= and page=content -> page=fragment-editor.
// Scoped to content-type=merch-card; other types pass through unchanged.
export function toFragmentEditorUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url, window.location.origin);
    const hp = new URLSearchParams(u.hash.replace(/^#/, ''));
    if (hp.get('content-type') !== 'merch-card') return url;
    const id = hp.get('fragmentId') || hp.get('query') || hp.get('fragment');
    if (!id) return url;
    hp.delete('query');
    hp.delete('fragment');
    hp.set('fragmentId', id);
    hp.set('page', 'fragment-editor');
    u.hash = `#${hp.toString()}`;
    return u.toString();
  } catch {
    return url;
  }
}

function stampMarket(host, pageMarket) {
  const market = getCardMarket(host, pageMarket);
  if (!market) return;
  host.dataset.masMarket = market.toUpperCase();
  if (pageMarket && market !== pageMarket) {
    host.dataset.masMarketMismatch = 'true';
  } else {
    delete host.dataset.masMarketMismatch;
  }
}

function annotateCollectionChildren() {
  const pageMarket = getResolvedPageMarket();
  document.querySelectorAll('[data-mas-block="collection"]').forEach((container) => {
    const parentUrl = mepMasStudioUrls.get(container);
    if (!parentUrl) return;
    // Re-stamp every pass — data-ims-country arrives async post-WCS.
    container.querySelectorAll('merch-card').forEach((child) => {
      if (child.offsetParent === null) return;
      if (!child.dataset.masBlock) {
        const aemFragment = child.querySelector('aem-fragment[fragment]');
        const fragmentId = aemFragment?.getAttribute('fragment');
        if (!fragmentId) return;
        const childUrl = deriveChildCardStudioUrl(parentUrl, fragmentId);
        if (!childUrl) return;
        mepMasStudioUrls.set(child, childUrl);
        child.dataset.masBlock = 'card';
      }
      stampMarket(child, pageMarket);
    });
  });
}

// Pinned to milo.adobe.com so derived OST links work the same everywhere
// (DA preview, .aem.page, localhost). OSIs are environment-independent.
const OST_BASE_URL = 'https://milo.adobe.com/tools/ost';

// type=price/checkoutUrl pre-selects the correct OST tab. Idempotent.
function annotateOffers() {
  document.querySelectorAll(MAS_OSI_SELECTOR).forEach((el) => {
    if (mepMasStudioUrls.has(el)) return;
    const osi = el.getAttribute('data-wcs-osi');
    if (!osi) return;
    const isPrice = el.matches('span[is="inline-price"]');
    const type = isPrice ? 'price' : 'checkoutUrl';
    const pageMarket = getResolvedPageMarket();
    const ostUrl = `${OST_BASE_URL}?osi=${encodeURIComponent(osi)}&type=${type}${pageMarket ? `&country=${encodeURIComponent(pageMarket)}` : ''}`;
    mepMasStudioUrls.set(el, ostUrl);
    if (!el.dataset.masBlock) el.dataset.masBlock = 'offer';
  });
}

// Real DOM (not ::before) — three independent click targets + Copy needs a clipboard handler.
const CARD_ACTIONS_CLASS = 'mep-mas-card-actions';
const CARD_ACTION_EDIT_CLASS = 'mep-mas-card-action-edit';
const CARD_ACTION_OST_CLASS = 'mep-mas-card-action-ost';
const CARD_ACTION_COPY_CLASS = 'mep-mas-card-action-copy';

function getCardFragmentId(card) {
  return card.querySelector('aem-fragment[fragment]')?.getAttribute('fragment') || null;
}

// View in OST uses the first OSI — M@S confirmed all OSIs in a card are equivalent.
function getCardFirstOsi(card) {
  return card.querySelector('[data-wcs-osi]')?.getAttribute('data-wcs-osi') || null;
}

// Rebuild every pass — M@S can replace subtrees; diffing isn't worth it.
function injectMasCardActionStack(card) {
  const studioUrl = mepMasStudioUrls.get(card);
  if (!studioUrl) return;
  card.querySelectorAll(`:scope > .${CARD_ACTIONS_CLASS}`).forEach((el) => el.remove());

  const stack = createTag('div', { class: CARD_ACTIONS_CLASS });
  const market = card.dataset.masMarket;
  const mismatch = card.dataset.masMarketMismatch === 'true';
  const marketSuffix = market ? ` · ${market}` : '';
  const mismatchClass = mismatch ? ` ${CARD_ACTIONS_CLASS}-mismatch` : '';

  const editLink = createTag(
    'a',
    {
      class: `${CARD_ACTION_EDIT_CLASS}${mismatchClass}`,
      href: toFragmentEditorUrl(studioUrl),
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  );
  editLink.textContent = `Edit Card${marketSuffix}`;
  stack.append(editLink);

  const osi = getCardFirstOsi(card);
  if (osi) {
    const ostLink = createTag(
      'a',
      {
        class: `${CARD_ACTION_OST_CLASS}${mismatchClass}`,
        href: `${OST_BASE_URL}?osi=${encodeURIComponent(osi)}${market ? `&country=${encodeURIComponent(market)}` : ''}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    );
    ostLink.textContent = `View in OST${marketSuffix}`;
    stack.append(ostLink);
  }

  const fragmentId = getCardFragmentId(card);
  if (fragmentId) {
    const copyBtn = createTag(
      'button',
      {
        type: 'button',
        class: CARD_ACTION_COPY_CLASS,
        'data-fragment-id': fragmentId,
        title: `Copy fragment id: ${fragmentId}`,
      },
      'Copy Fragment ID',
    );
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = copyBtn.dataset.fragmentId;
      const restore = () => { copyBtn.textContent = 'Copy Fragment ID'; copyBtn.classList.remove(`${CARD_ACTION_COPY_CLASS}-copied`); };
      const flash = () => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add(`${CARD_ACTION_COPY_CLASS}-copied`);
        setTimeout(restore, 1500);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(id).then(flash).catch(() => {
          copyBtn.textContent = 'Copy failed';
          setTimeout(restore, 1500);
        });
      } else {
        flash();
      }
    });
    stack.append(copyBtn);
  }

  card.append(stack);
}

// Collection surfaces use this sibling-placed badge. Cards: real-DOM action
// stack (injectMasCardActionStack). Inline/ost/offer: ::before pseudos.
function buildMasBadge(url, surface, market, pageMarket) {
  const a = createTag(
    'a',
    {
      class: `${MAS_BADGE_CLASS} ${MAS_BADGE_CLASS}-${surface}`,
      href: url,
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    MAS_LABELS[surface],
  );
  if (market) {
    const chip = createTag('span', { class: `${MAS_BADGE_CLASS}-market` });
    if (classifyMarket(market, pageMarket) === 'mismatch') {
      chip.classList.add(`${MAS_BADGE_CLASS}-market-mismatch`);
    }
    chip.textContent = market.toUpperCase();
    a.append(' · ', chip);
  }
  return a;
}

export function injectMasBadges() {
  annotateCollectionChildren();
  annotateOffers();
  const pageMarket = getResolvedPageMarket();
  // Re-stamp every pass — chips upgrade from pageMarket fallback to data-ims-country post-WCS.
  document.querySelectorAll('[data-mas-block="card"], [data-mas-block="inline"], [data-mas-block="ost"], [data-mas-block="offer"]')
    .forEach((host) => stampMarket(host, pageMarket));
  let visibleCount = 0;
  document.querySelectorAll('[data-mas-block]').forEach((el) => {
    const surface = el.dataset.masBlock;
    if (surface === 'card') {
      injectMasCardActionStack(el);
      visibleCount += 1;
      return;
    }
    // offer/inline/ost use ::before pseudos — sibling <a> shifted layout in paragraphs/headings.
    if (surface === 'offer' || surface === 'inline' || surface === 'ost') {
      visibleCount += 1;
      return;
    }
    const url = mepMasStudioUrls.get(el);
    if (!url) return;
    const market = getCardMarket(el, pageMarket);
    // Hop past a sub-collection badge wedged between the parent badge and the container.
    // Without this hop the idempotence check below misses the parent, rebuilds it every
    // pass, and strands the previous sub badge.
    let prev = el.previousElementSibling;
    if (prev?.classList?.contains('mep-mas-sub-collection-badge')) {
      prev = prev.previousElementSibling;
    }
    if (prev?.classList?.contains(MAS_BADGE_CLASS)) {
      // Skip rebuild unless market changed — handles mid-hydration data-ims-country arrivals.
      if (prev.dataset.mepMasMarket === (market || '')) {
        visibleCount += 1;
        return;
      }
      prev.remove();
    }
    const a = buildMasBadge(url, surface, market, pageMarket);
    a.dataset.mepMasMarket = market || '';
    el.insertAdjacentElement('beforebegin', a);
    visibleCount += 1;
  });
  document.querySelectorAll('[data-mas-block="collection"]').forEach((container) => {
    injectSubCollectionBadge(container, pageMarket);
  });
  updateMasNoContentMessage(visibleCount === 0);
}

export function removeMasBadges() {
  document.querySelectorAll(`a.${MAS_BADGE_CLASS}`).forEach((el) => el.remove());
  // Cards: real DOM, must strip. Pseudos (offer/inline/ost) hide via body[data-mep-mas-highlight].
  document.querySelectorAll(`.${CARD_ACTIONS_CLASS}`).forEach((el) => el.remove());
  removeSubCollectionBadges();
  updateMasNoContentMessage(false);
}

// Hit boxes for the ::before badges in mep-next.css — keep in sync if CSS sizes change.
// Anchored to the host's right edge: `w` extends leftward, negative `top` overhangs above.
// Slightly larger than the visible badge for click forgiveness.
const PSEUDO_BADGE_HIT = {
  offer: { w: 130, h: 22, top: -14 },
  inline: { w: 240, h: 22, top: -14 },
  ost: { w: 130, h: 22, top: -14 },
};

// Pseudos can't carry an href — delegate clicks in the hit box to open the captured URL.
// preventDefault + stopPropagation suppress the host's normal navigation (checkout/CTA).
// Iterate all candidates: nested surfaces (e.g. offer inside inline) appear first in
// composedPath, so we try each until one whose hit box actually contains the click.
function handleChildCardBadgeClick(e) {
  if (document.body.dataset.mepMasHighlight !== 'true') return;
  // composedPath() crosses shadow boundaries — clicks originate inside the
  // merch-card / commerce-element shadow roots.
  const candidates = e.composedPath().filter((n) => {
    if (n?.nodeType !== 1) return false;
    const surface = n.dataset?.masBlock;
    return surface === 'offer' || surface === 'inline' || surface === 'ost';
  });
  const match = candidates.find((host) => {
    if (!mepMasStudioUrls.get(host)) return false;
    const hit = PSEUDO_BADGE_HIT[host.dataset.masBlock];
    if (!hit) return false;
    const rect = host.getBoundingClientRect();
    const isNestedInInline = host.dataset.masBlock !== 'inline' && !!host.closest('[data-mas-block="inline"]');
    const hitTop = isNestedInInline ? rect.height + 4 : hit.top;
    const yMin = rect.top + hitTop;
    return e.clientX >= rect.right - hit.w
      && e.clientX <= rect.right
      && e.clientY >= yMin
      && e.clientY <= yMin + hit.h;
  });
  if (!match) return;
  e.preventDefault();
  e.stopPropagation();
  window.open(mepMasStudioUrls.get(match), '_blank', 'noopener,noreferrer');
}

let masObserver;
let masRestampTimer;
// Named handler refs so unwatchForMasContent can remove them.
let masChildCardClickHandler;
let masAemLoadHandler;
let masRestampClickHandler;
// Exported for tests. Long enough for M@S hydration after a tab/accordion
// switch, short enough to feel responsive.
export const MAS_RESTAMP_DEBOUNCE_MS = 300;
export function watchForMasContent() {
  if (masObserver) return;

  masChildCardClickHandler = handleChildCardBadgeClick;
  document.addEventListener('click', masChildCardClickHandler, true);

  // Fallback for the race where highlight is enabled AFTER parent aem-fragment loaded
  // (autoblock listener missed it). aem:load bubbles+composed, so one document listener
  // catches every fragment regardless of nesting.
  masAemLoadHandler = (event) => {
    if (document.body.dataset.mepMasHighlight !== 'true') return;
    const fragment = event.target;
    if (!fragment || fragment.tagName !== 'AEM-FRAGMENT') return;
    const container = fragment.closest('[data-mas-block="collection"]');
    if (!container) return;
    const subs = extractSubCollections(event.detail);
    if (subs.length) {
      mepMasSubCollections.set(container, subs);
      clearTimeout(masRestampTimer);
      masRestampTimer = setTimeout(() => injectMasBadges(), MAS_RESTAMP_DEBOUNCE_MS);
    }
  };
  document.addEventListener('aem:load', masAemLoadHandler, true);

  // Tabs/accordions/filter chips toggle aria-selected/hidden — the childList observer
  // doesn't fire for that. Debounced to coalesce rapid clicks and let M@S hydrate.
  masRestampClickHandler = () => {
    if (document.body.dataset.mepMasHighlight !== 'true') return;
    clearTimeout(masRestampTimer);
    masRestampTimer = setTimeout(() => injectMasBadges(), MAS_RESTAMP_DEBOUNCE_MS);
  };
  document.addEventListener('click', masRestampClickHandler, true);

  // Re-injection triggers:
  //   - new [data-mas-block] / <merch-card> nodes (collection children)
  //   - aem-fragment[fragment] insertion (M@S sometimes appends post-mount; miss permanently)
  //   - data-ims-country attribute (post-WCS market upgrade)
  const isMasMutation = (n) => n.nodeType === 1 && (
    n.matches?.('[data-mas-block], merch-card, aem-fragment[fragment]')
    || n.querySelector?.('[data-mas-block], merch-card, aem-fragment[fragment]')
  );
  masObserver = new MutationObserver((mutations) => {
    if (document.body.dataset.mepMasHighlight !== 'true') return;
    const hit = mutations.some((m) => {
      if (m.type === 'attributes') return m.attributeName === 'data-ims-country';
      return [...m.addedNodes].some(isMasMutation);
    });
    if (hit) injectMasBadges();
  });
  masObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-ims-country'],
  });
}

export function unwatchForMasContent() {
  if (!masObserver) return;
  document.removeEventListener('click', masChildCardClickHandler, true);
  document.removeEventListener('aem:load', masAemLoadHandler, true);
  document.removeEventListener('click', masRestampClickHandler, true);
  masObserver.disconnect();
  masObserver = null;
  masChildCardClickHandler = null;
  masAemLoadHandler = null;
  masRestampClickHandler = null;
  clearTimeout(masRestampTimer);
}
