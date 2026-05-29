import {
  createTag,
  getCookie,
  getConfig,
  getMetadata,
  getGeoLocalePrefix,
  loadStyle,
  lingoActive,
  normCountryCode,
  resolveDetectedMarketCountry,
} from '../../utils/utils.js';
import { getMarketConfig, marketsLangForLocale } from '../../utils/market.js';
import { mepCaasConfigUrls } from '../../blocks/caas/utils.js';
import { mepMasStudioUrls } from '../../blocks/merch/mas-mep-utils.js';
import { getMiloLocaleSettings, isMasGeoDetectionEnabled } from '../../blocks/merch/merch.js';
import {
  extractSubCollections,
  injectSubCollectionBadge,
  removeSubCollectionBadges,
  mepMasSubCollections,
} from './preview-mas-subcollection.js';
import { US_GEO, getFileName, normalizePath } from './personalization.js';

export function escapeHtml(str) {
  if (str == null || str === '') return str;
  const el = document.createElement('span');
  el.textContent = String(str);
  return el.innerHTML;
}

const API_DOMAIN = 'https://jvdtssh5lkvwwi4y3kbletjmvu0qctxj.lambda-url.us-west-2.on.aws';

export const API_URLS = {
  pageList: `${API_DOMAIN}/get-pages`,
  pageDetails: `${API_DOMAIN}/get-page`,
  pageDataByURL: `${API_DOMAIN}/get-page?url=`,
  save: `${API_DOMAIN}/save-mep-call`,
  report: `${API_DOMAIN}/get-report`,
};

const CAAS_BADGE_CLASS = 'mep-caas-edit-badge';
const PREVIEW_HOST_RE = /\.(aem|hlx)\.(page|live)$/;
const BLOG_PATH_RE = /^\/(?:[^/]+\/)?blog\//i;
const PREVIEW_REPO_HOST_RE = /^(.+?)--(.+?)--adobecom\.aem\.(page|live)$/;

function rewriteForPreviewHost(url) {
  if (!url) return url;
  const isPreview = PREVIEW_HOST_RE.test(window.location.host)
    || window.location.search.includes('milolibs=');
  if (!isPreview) return url;
  try {
    const u = new URL(url);
    const { prodDomains = ['business.adobe.com', 'www.adobe.com', 'news.adobe.com'] } = getConfig();
    if (!prodDomains.includes(u.host)) return u.toString();
    u.protocol = window.location.protocol;
    u.host = window.location.host;
    if (PREVIEW_HOST_RE.test(u.host)) u.pathname = u.pathname.replace(/\.html$/, '');
    return u.toString();
  } catch { return url; }
}

function rewriteBlogPreviewHost(url) {
  if (!url) return null;
  const m = window.location.host.match(PREVIEW_REPO_HOST_RE);
  if (!m) return null;
  const [, branch, repo, env] = m;
  if (repo.endsWith('-blog')) return null;
  try {
    const u = new URL(url);
    if (u.host !== 'business.adobe.com') return null;
    if (!BLOG_PATH_RE.test(u.pathname)) return null;
    u.protocol = window.location.protocol;
    u.host = `${branch}--${repo}-blog--adobecom.aem.${env}`;
    u.pathname = u.pathname.replace(/\.html$/, '');
    return u.toString();
  } catch { return null; }
}

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

function injectCaasBadges() {
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

function removeCaasBadges() {
  document.querySelectorAll(`a.${CAAS_BADGE_CLASS}`).forEach((el) => el.remove());
  // Clear derived paths so they don't sit in the DOM as invisible state.
  document.querySelectorAll('[data-card-path]').forEach((el) => delete el.dataset.cardPath);
}

let caasObserver;
function watchForCaasBlocks() {
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

function unwatchForCaasBlocks() {
  if (!caasObserver) return;
  caasObserver.disconnect();
  caasObserver = null;
}

const MAS_BADGE_CLASS = 'mep-mas-edit-badge';
// Only 'collection' reaches buildMasBadge. Card uses an action stack;
// inline/ost/offer render via CSS ::before pseudos.
const MAS_LABELS = { collection: 'Edit Collection in M@S Studio' };

// Mirrors SELECTOR_MAS_INLINE_PRICE et al. from ../mas/web-components/src/
// constants.js. Inlined rather than imported to avoid a hard runtime
// dependency on M@S's web-components package.
const MAS_OSI_SELECTOR = [
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
    const hash = (u.hash || '').replace(/^#/, '');
    const hp = new URLSearchParams(hash);
    if (hp.get('content-type') !== 'merch-card') return url;
    const id = hp.get('fragmentId') || hp.get('query') || hp.get('fragment');
    if (!id) return url;
    hp.delete('query');
    hp.delete('fragment');
    hp.set('fragmentId', id);
    hp.set('page', 'fragment-editor');
    u.hash = `#${hp.toString()}`;
    return u.toString();
  } catch (e) { return url; }
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
  const marketSuffix = market ? ` \u00b7 ${market}` : '';
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
    a.append(' \u00b7 ', chip);
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

// Hit boxes for the ::before badges in preview.css — keep in sync if CSS sizes change.
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

function unwatchForMasContent() {
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

function updatePreviewButton(popup, pageId) {
  const selectedInputs = popup.querySelectorAll(
    'option:checked, input[type="text"]',
  );
  const manifestParameter = [];

  selectedInputs.forEach((selected) => {
    const parentSelect = selected.closest('select');
    const isHidden = parentSelect?.disabled;
    const parentSelectId = parentSelect?.id || '';
    // Spoofer dropdowns drive ?akamaiLocale; no data-manifest = serializes as "undefined--…".
    const isSpooferSelect = parentSelectId.startsWith('mepLingoRegionSelect')
      || parentSelectId.startsWith('mepMasMarketSelect');

    if (!selected.value || isHidden || isSpooferSelect) return;

    let { value } = selected;

    if (selected.classList.contains('new-manifest') && value) {
      try {
        const newManifest = new URL(value);
        value = newManifest.pathname || value;
      } catch {
        // Ignore invalid URL
      }
    } else {
      value = `${selected.dataset.manifest}--${value}`;
    }

    manifestParameter.push(value);
  });

  const isMmm = pageId.length;
  const page = isMmm ? popup.closest('[data-url]').dataset.url : window.location.href;
  const simulateHref = new URL(page);
  simulateHref.searchParams.set('mep', manifestParameter.join('---'));

  const mepHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepHighlightCheckbox${pageId}`,
  );

  document.body.dataset.mepHighlight = mepHighlightCheckbox.checked;
  if (mepHighlightCheckbox.checked) {
    simulateHref.searchParams.set('mepHighlight', true);
  } else {
    simulateHref.searchParams.delete('mepHighlight');
  }

  const mepFragmentsCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepFragmentsCheckbox${pageId}`,
  );

  document.body.dataset.mepFragments = mepFragmentsCheckbox.checked;
  if (mepFragmentsCheckbox.checked) {
    simulateHref.searchParams.set('mepFragments', true);
  } else {
    simulateHref.searchParams.delete('mepFragments');
  }

  const mepCaasHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepCaasHighlightCheckbox${pageId}`,
  );

  if (mepCaasHighlightCheckbox) {
    document.body.dataset.mepCaasHighlight = mepCaasHighlightCheckbox.checked;
    if (mepCaasHighlightCheckbox.checked) {
      simulateHref.searchParams.set('mepCaasHighlight', true);
      watchForCaasBlocks();
      injectCaasBadges();
    } else {
      simulateHref.searchParams.delete('mepCaasHighlight');
      unwatchForCaasBlocks();
      removeCaasBadges();
    }
  }

  const mepMasHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasHighlightCheckbox${pageId}`,
  );
  if (mepMasHighlightCheckbox) {
    document.body.dataset.mepMasHighlight = mepMasHighlightCheckbox.checked;
    if (mepMasHighlightCheckbox.checked) {
      simulateHref.searchParams.set('mepMasHighlight', true);
      watchForMasContent();
      injectMasBadges();
    } else {
      simulateHref.searchParams.delete('mepMasHighlight');
      unwatchForMasContent();
      removeMasBadges();
    }
  }

  const mepPreviewButtonCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepPreviewButtonCheckbox${pageId}`,
  );
  if (mepPreviewButtonCheckbox.checked) {
    simulateHref.searchParams.set('mepButton', 'off');
  } else {
    simulateHref.searchParams.delete('mepButton');
  }

  // Three popup shapes for the region/market spoofer (see getMepPopup):
  //   1) Lingo + M@S: checkbox toggles which dropdown writes ?akamaiLocale
  //   2) Lingo only:  Lingo dropdown writes ?akamaiLocale unconditionally
  //   3) Non-Lingo + M@S: standalone M@S dropdown writes ?akamaiLocale +
  //      ?mepMasMarket=true (re-pre-selects on reload)
  const mepMasMarketCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasMarketCheckbox${pageId}`,
  );
  const mepLingoRegionSelect = popup.querySelector(
    `select#mepLingoRegionSelect${pageId}`,
  );
  const mepMasMarketSelect = popup.querySelector(
    `select#mepMasMarketSelect${pageId}`,
  );
  const mepMasMarketWrapper = popup.querySelector('.mep-mas-market-dropdown');
  const masMarketOn = !!mepMasMarketCheckbox?.checked;
  if (mepLingoRegionSelect) mepLingoRegionSelect.disabled = masMarketOn;
  // Only Lingo+M@S gates the dropdown on the checkbox; the standalone variant is always visible.
  if (mepMasMarketWrapper && !mepMasMarketWrapper.classList.contains('standalone')) {
    mepMasMarketWrapper.hidden = !masMarketOn;
  }
  if (masMarketOn) {
    simulateHref.searchParams.set('mepMasMarket', 'true');
    const masVal = mepMasMarketSelect?.value;
    if (masVal) {
      simulateHref.searchParams.set('akamaiLocale', masVal);
    } else {
      simulateHref.searchParams.delete('akamaiLocale');
    }
  } else if (!mepMasMarketCheckbox && mepMasMarketSelect) {
    // Standalone shape (non-Lingo + M@S): dropdown is authoritative,
    // mepMasMarket=true persists the selection across reloads.
    const masVal = mepMasMarketSelect.value;
    if (masVal) {
      simulateHref.searchParams.set('mepMasMarket', 'true');
      simulateHref.searchParams.set('akamaiLocale', masVal);
    } else {
      simulateHref.searchParams.delete('mepMasMarket');
      simulateHref.searchParams.delete('akamaiLocale');
    }
  } else {
    simulateHref.searchParams.delete('mepMasMarket');
    if (mepLingoRegionSelect) {
      const selectedRegion = mepLingoRegionSelect.value;
      if (selectedRegion) {
        simulateHref.searchParams.set('akamaiLocale', selectedRegion);
      } else {
        simulateHref.searchParams.delete('akamaiLocale');
      }
    }
  }

  popup
    .querySelector('a.con-button')
    .setAttribute('href', simulateHref.href);
}

function changeTab(event) {
  const tabs = event.target.closest('.mep-popup-tabs').querySelectorAll('.mep-tab');
  const index = Array.from(tabs).indexOf(event.target);

  tabs.forEach((tab, i) => {
    tab.toggleAttribute('active', i === index);
    event.target.closest('.mep-popup').querySelectorAll('.mep-popup-body')[i]?.toggleAttribute('active', i === index);
  });
}

function expandManifest(event) {
  event.target.closest('.mep-manifest-toggle').toggleAttribute('active');
  event.target.closest('.mep-section').querySelector('.mep-manifest-info')?.toggleAttribute('active');
}

function addDividers(node, selector) {
  node.querySelectorAll(selector).forEach((section, index) => {
    if (index === node.querySelectorAll(selector).length - 1) return;
    const mepDivider = createTag('div', { class: 'mep-divider' });
    section.insertAdjacentElement('afterend', mepDivider);
  });
}

function addPillEventListeners(div, overlay, onClose) {
  div.querySelector('.mep-manifest.mep-badge').addEventListener('click', () => {
    const isHidden = div.classList.toggle('mep-hidden');
    if (!isHidden) overlay?.showPopover?.();
  });
  div.querySelector('.mep-close').addEventListener('click', () => {
    const overlayEl = document.querySelector('.mep-preview-overlay');
    overlayEl?.hidePopover?.();
    overlayEl?.remove();
    onClose?.();
  });
}

export function parsePageAndUrl(config, windowLocation, prefix) {
  const { stageDomainsMap, env } = config;
  const { pathname, origin } = windowLocation;
  const allowedHosts = [
    'business.stage.adobe.com',
    'www.stage.adobe.com',
    'milo.stage.adobe.com',
  ];
  if (env?.name === 'prod' || !stageDomainsMap
    || allowedHosts.includes(origin.replace('https://', ''))) {
    const domain = origin.replace('stage.adobe.com', 'adobe.com');
    return { page: pathname.replace(`/${prefix}/`, '/'), url: `${domain}${pathname}` };
  }
  let path = pathname;
  let domain = origin;
  const domainCheck = Object.keys(stageDomainsMap)
    .find((key) => {
      try {
        const { host } = new URL(`https://${key}`);
        return allowedHosts.includes(host);
      } catch (e) {
        /* c8 ignore next 2 */
        return false;
      }
    });
  if (domainCheck) domain = `https://${domainCheck}`;
  path = path.replace('/homepage/index-loggedout', '/');
  if (!path.endsWith('/') && !path.endsWith('.html') && !domain.includes('milo')) {
    path += '.html';
  }
  domain = domain.replace('stage.adobe.com', 'adobe.com');
  return { page: path.replace(`/${prefix}/`, '/'), url: `${domain}${path}` };
}
function parseMepConfig() {
  const config = getConfig();
  const { mep, locale } = config;
  if (!mep || !locale) return null;
  const { experiments, prefix, highlight } = mep;
  const activities = experiments.map((experiment) => {
    const {
      name, event, manifest, variantNames, selectedVariantName,
      disabled, analyticsTitle, source, geoRestriction, mktgAction,
    } = experiment;
    let pathname = manifest;
    try { pathname = new URL(manifest).pathname; } catch (e) { /* do nothing */ }
    return {
      targetActivityName: name,
      variantNames,
      selectedVariantName,
      url: manifest,
      disabled,
      source,
      eventStart: event?.start,
      eventEnd: event?.end,
      pathname,
      analyticsTitle,
      geoRestriction,
      mktgAction,
    };
  });
  const { page, url } = parsePageAndUrl(config, window.location, prefix);

  return {
    page: {
      url,
      page,
      target: getMetadata('target') || 'off',
      personalization: (getMetadata('personalization')) ? 'on' : 'off',
      geo: prefix === US_GEO ? '' : prefix,
      locale: locale?.ietf,
      region: locale?.region,
      highlight,
    },
    activities,
  };
}
function formatDate(dateTime, format = 'local') {
  if (!dateTime) return '';
  let dateObj = dateTime;
  if (typeof dateObj === 'string') dateObj = new Date(dateObj);
  if (format === 'iso') return dateObj.toISOString();
  const date = dateObj.toLocaleDateString(false, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const time = dateObj.toLocaleTimeString(false, { timeStyle: 'short' });
  return `${date} ${time}`;
}
function getManifestListDomAndParameter(mepConfig) {
  const { activities, page } = mepConfig;
  const { pageId = 0 } = page;
  let manifestList = '';
  const manifestParameter = [];
  activities?.forEach((manifest, mIdx) => {
    const {
      variantNames,
      manifestPath = manifest.url,
      selectedVariantName = manifest.selectedVariantName || 'default',
      manifestUrl,
      targetActivityName,
      source,
      analyticsTitle,
      eventStart,
      eventEnd,
      disabled,
      geoRestriction,
      mktgAction,
    } = manifest;
    const editUrl = manifestUrl || manifestPath;
    const editPath = normalizePath(editUrl);
    const variantNamesArray = typeof variantNames === 'string' ? variantNames.split('||') : variantNames;
    let options = '';
    let isSelected = '';
    if (!variantNames.includes(selectedVariantName) && pageId === 0) {
      isSelected = 'selected';
      manifestParameter.push(`${editUrl}--default`);
    }
    options += `<option name="${editPath}${pageId}" value="" title="none">None (Don't add manifest)</option>`;
    options += `<option name="${editPath}${pageId}" value="default" 
    id="${editPath}${pageId}--default" data-manifest="${editPath}" ${isSelected} title="Default (control)">Default (control)</option>`;
    isSelected = '';
    variantNamesArray.forEach((variant) => {
      isSelected = '';
      if (variant === selectedVariantName) {
        isSelected = 'selected';
        manifestParameter.push(`${manifestPath}--${variant}`);
      }
      options += `<option name="${editPath}${pageId}" value="${variant}" 
      id="${editPath}${pageId}--${variant}" data-manifest="${editPath}" ${isSelected} title="${variant}">${variant}</option>`;
    });
    const expandSVG = `
    <svg xmlns="<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="mep-toggle-expand">
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
    </svg>`;
    const collapseSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" class="mep-toggle-collapse">
      <path d="M200-440v-80h560v80H200Z"/>
    </svg>`;
    manifestList += `
    <div class="mep-section" title="Manifest location: ${editUrl}&#013;Analytics manifest name: ${analyticsTitle || 'N/A for this manifest type'}">
      <div class="mep-manifest-title">
        <a class="mep-edit-manifest" href="${editUrl}" target="_blank" title="Open manifest">
          ${mIdx + 1}. ${getFileName(manifestPath)}
        </a>
        <div class="mep-manifest-toggle">${expandSVG}${collapseSVG}</div>
      </div>   
      <div class="mep-manifest-info">
            ${targetActivityName ? `<div class="target-activity-name">${targetActivityName || ''}</div>` : ''}
              <div class="mep-section-data">
                  <span class="mep-active">Experience</span>
                ${!variantNames.includes(selectedVariantName) ? `
                  <span class="mep-active">default (control)</span>` : `
                  <span class='mep-active mep-selected-variant'>${selectedVariantName}</span>`}
                  <span>Source</span>
                  <span>${source}</span>
                  <span>Mktg action</span>
                  <span>${mktgAction}</span>
                ${geoRestriction ? `
                  <span>Geo</span>
                  <span>${geoRestriction ? `${geoRestriction?.toUpperCase()}` : ''}</span>` : ''}
                ${(eventStart && eventEnd) || disabled ? `
                  <span>Active?</span>
                  <span>${(eventStart && eventEnd) || disabled ? `${disabled ? 'inactive' : 'active'}` : ''}` : ''}</span>
                ${manifest.lastSeen ? `
                  <span>Last Seen</span>
                  <span>${formatDate(new Date(manifest.lastSeen))}</span>` : ''}  
                ${eventStart && eventEnd ? `
                  <span>On</span>
                  <span>${formatDate(eventStart)} 
                  <br><a target= "_blank" href="?instant=${formatDate(eventStart, 'iso')}">Instant</a>
                  </span>
                  <span>Off</span>
                  <span>${formatDate(eventEnd)}</span>` : ''}
              </div>
      </div>
      <div class="mep-experience-dropdown">
        <select name="experiences" class="mep-manifest-variants">${options}</select>
      </div>
    </div>`;
  });

  return { manifestList, manifestParameter };
}
function formatManifestText(count) {
  return count > 1 ? 'Manifests' : 'Manifest';
}
function getPillText(manifestCount) {
  return `
    <span class="mep-open"></span>
    <div class="mep-manifest-count">${manifestCount || 0} ${formatManifestText(manifestCount)} found</div>
  `;
}
let sevenDayPageData;
async function mmmToggleManifests(event, popup, pageId) {
  const mepConfig = parseMepConfig();
  if (!mepConfig) return;
  const mmmManifestsElement = document.querySelector('.mep-manifest-list.mmm-list');

  if (!sevenDayPageData) {
    try {
      const pageDataUrl = `${API_URLS.pageDataByURL}${mepConfig.page.url}&lastSeen=week`;

      const response = await fetch(pageDataUrl);

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      if (data) {
        sevenDayPageData = data;
        sevenDayPageData.activities = sevenDayPageData.activities.filter(
          (activity) => !mepConfig.activities.some(
            (existingActivity) => normalizePath(existingActivity.url)
            === normalizePath(activity.url),
          ),
        ).map((activity) => {
          activity.source = 'MMM';
          return activity;
        });
        mmmManifestsElement.innerHTML = `<h6>MMM data for last 7 days</h6> ${getManifestListDomAndParameter(data).manifestList}`;
        mmmManifestsElement.querySelectorAll('select').forEach((input) => {
          input.querySelector('option[title="none"]').selected = true;
          input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
        });
        addDividers(mmmManifestsElement, '.mep-section');
        mmmManifestsElement.querySelectorAll('.mep-manifest-title .mep-manifest-toggle').forEach((input) => {
          input.addEventListener('click', (e) => expandManifest.bind(null, e)());
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching 7-day page data:', error);
    }
  }

  const pill = document.querySelector('.mep-manifest.mep-badge');
  if (event.target.checked && sevenDayPageData) {
    mmmManifestsElement.classList.add('mep-show');
    mmmManifestsElement.querySelectorAll('select').forEach((select) => {
      select.disabled = false;
    });
    pill.innerHTML = getPillText(sevenDayPageData.activities.length + mepConfig.activities.length);
  } else {
    mmmManifestsElement.classList.remove('mep-show');
    mmmManifestsElement.querySelectorAll('select').forEach((select) => {
      select.disabled = true;
    });
    pill.innerHTML = getPillText(mepConfig.activities?.length);
  }
}
function addMepPopupListeners(popup, pageId) {
  // One-way auto-check: flipping Highlight M@S ON also pre-toggles "Use M@S markets instead"
  // so the dropdown unhides in the same click. Never auto-unchecks. Must run BEFORE the
  // blanket change listener below so the first updatePreviewButton sees the auto-check.
  const mepMasHighlightCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasHighlightCheckbox${pageId}`,
  );
  const mepMasMarketCheckbox = popup.querySelector(
    `input[type="checkbox"]#mepMasMarketCheckbox${pageId}`,
  );
  if (mepMasHighlightCheckbox && mepMasMarketCheckbox) {
    mepMasHighlightCheckbox.addEventListener('change', (event) => {
      if (event.target.checked && !mepMasMarketCheckbox.checked) {
        mepMasMarketCheckbox.checked = true;
      }
    });
  }
  popup.querySelectorAll('select, input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener('keyup', updatePreviewButton.bind(null, popup, pageId));
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('#mepManifestsCheckbox').forEach((input) => {
    input.addEventListener('change', (event) => mmmToggleManifests.bind(null, event, popup, pageId)());
    input.addEventListener('change', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('.mep-popup-tabs .mep-tab').forEach((input) => {
    input.addEventListener('click', (event) => changeTab.bind(null, event)());
    input.addEventListener('click', updatePreviewButton.bind(null, popup, pageId));
  });
  popup.querySelectorAll('.mep-manifest-title .mep-manifest-toggle').forEach((input) => {
    input.addEventListener('click', (event) => expandManifest.bind(null, event)());
  });
}
function setTargetOnText(target, page) {
  if (target === undefined) return page.target;
  return target === 'postlcp' ? 'on post LCP' : target;
}
export async function getMepPopup(mepConfig, isMmm = false) {
  const { page } = mepConfig;
  const pageId = page?.pageId ? `-${page.pageId}` : '';

  // Check URL parameters for highlight and fragments
  const urlParams = new URLSearchParams(window.location.search);
  const highlightParam = urlParams.get('mepHighlight');
  const fragmentsParam = urlParams.get('mepFragments');
  const caasHighlightParam = urlParams.get('mepCaasHighlight');
  const masHighlightParam = urlParams.get('mepMasHighlight');
  const masMarketParam = urlParams.get('mepMasMarket');

  let mepHighlightChecked = '';
  if (page?.highlight || highlightParam === 'true') {
    mepHighlightChecked = 'checked="checked"';
    document.body.dataset.mepHighlight = true;
  }
  let mepFragmentsChecked = '';
  if (page?.fragments || fragmentsParam === 'true') {
    mepFragmentsChecked = 'checked="checked"';
    document.body.dataset.mepFragments = true;
  }
  let mepCaasHighlightChecked = '';
  if (caasHighlightParam === 'true') {
    mepCaasHighlightChecked = 'checked="checked"';
    document.body.dataset.mepCaasHighlight = true;
  }
  let mepMasHighlightChecked = '';
  if (masHighlightParam === 'true') {
    mepMasHighlightChecked = 'checked="checked"';
    document.body.dataset.mepMasHighlight = true;
  }
  const masMarketChecked = masMarketParam === 'true';
  const mepMasMarketCheckedAttr = masMarketChecked ? 'checked="checked"' : '';
  const PREVIEW_BUTTON_ID = 'preview-button';
  const pageUrl = isMmm ? page.url : new URL(window.location.href).href;
  const mepPopup = createTag('div', {
    class: `mep-popup${isMmm ? '' : ' in-page'}`,
    'data-url': pageUrl,
  });

  const config = getConfig();
  const regionKeys = Object.keys(config?.locale?.regions || {});

  // Build Header
  function buildHeader() {
    const mepPopupHeader = createTag('div', { class: 'mep-popup-header' });
    const mmmSVG = `<svg width="33" height="21" viewBox="0 0 33 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.8359 20.9998H18.0635C17.8561 21.0036 17.6523 20.9458 17.478 20.8338C17.3037 20.7219 17.1669 20.5607 17.0849 20.371L11.9039 8.30626C11.8958 8.27747 11.8821 8.25055 11.8636 8.22704C11.845 8.20353 11.822 8.18389 11.7958 8.16924C11.7696 8.1546 11.7408 8.14523 11.711 8.14167C11.6812 8.13812 11.651 8.14044 11.6221 8.14852L11.617 8.15001C11.5806 8.1604 11.5475 8.17958 11.5204 8.20585C11.4934 8.23212 11.4733 8.26466 11.462 8.30055L8.23347 15.9607C8.20525 16.0273 8.20475 16.1023 8.23207 16.1692C8.25939 16.2362 8.31229 16.2896 8.37914 16.3177L8.37983 16.318C8.41348 16.3319 8.44957 16.339 8.486 16.3389H12.035C12.1425 16.3389 12.2477 16.3704 12.3373 16.4295C12.427 16.4887 12.4972 16.5728 12.5391 16.6715L14.0926 20.1157C14.1588 20.2708 14.1603 20.4457 14.097 20.602C14.0336 20.7583 13.9105 20.8831 13.7548 20.949L13.754 20.9493C13.6753 20.9826 13.5907 20.9998 13.5053 20.9998H0.58545C0.488275 20.9993 0.392732 20.9749 0.307356 20.9287C0.22198 20.8824 0.149429 20.8159 0.0961835 20.7349C0.0429379 20.6539 0.0106559 20.5611 0.00222085 20.4647C-0.00621415 20.3683 0.00946049 20.2713 0.0478448 20.1824L8.26598 0.690892C8.35033 0.483823 8.49562 0.307024 8.68274 0.183739C8.86987 0.0604533 9.09007 -0.00354744 9.31441 0.000151769H14.0543C14.2779 -0.0028459 14.4972 0.0615004 14.6834 0.184758C14.8697 0.308015 15.0142 0.484433 15.098 0.690892L23.3726 20.1824C23.4107 20.2712 23.4263 20.3681 23.4178 20.4644C23.4094 20.5606 23.3771 20.6533 23.324 20.7342C23.2709 20.8151 23.1986 20.8817 23.1134 20.928C23.0283 20.9744 22.933 20.999 22.8359 20.9998Z" fill="white"/>
      <path d="M27.6434 20.9998H32.4159C32.5129 20.999 32.6082 20.9744 32.6934 20.928C32.7785 20.8817 32.8509 20.8151 32.904 20.7342C32.9571 20.6533 32.9893 20.5606 32.9978 20.4644C33.0062 20.3681 32.9907 20.2712 32.9525 20.1824L24.6779 0.690892C24.5941 0.484433 24.4496 0.308015 24.2634 0.184758C24.0771 0.0615004 23.8579 -0.0028459 23.6343 0.000151769H18.8943C18.67 -0.00354743 18.4498 0.0604533 18.2627 0.183739C18.0756 0.307024 17.38 1.16222 17.2956 1.36928L20.4916 8.97894C20.503 8.94305 21.0733 8.23212 21.1004 8.20585C21.1274 8.17958 21.1606 8.1604 21.1969 8.15001L21.202 8.14852C21.2309 8.14044 21.2611 8.13812 21.2909 8.14167C21.3207 8.14523 21.3496 8.1546 21.3757 8.16924C21.4019 8.18389 21.4249 8.20353 21.4435 8.22704C21.462 8.25055 21.4758 8.27747 21.4839 8.30626L26.6648 20.371C26.7468 20.5607 26.8837 20.7219 27.058 20.8338C27.2322 20.9458 27.436 21.0036 27.6434 20.9998Z" fill="white"/>
      </svg>`;
    const mmmLink = isMmm ? mmmSVG : `<a href="https://main--milo--adobecom.aem.page/docs/authoring/features/mmm/" title="Open Mep Manifest Manager" target="_blank">${mmmSVG}</a>`;
    mepPopupHeader.innerHTML = `${mmmLink}<span class="mep-close"></span>`;
    return mepPopupHeader;
  }
  const mepPopupHeader = buildHeader();

  function buildTabsAndContainers() {
    const mepPopupTabs = createTag('div', { class: 'mep-popup-tabs' });
    const tabs = ['Options', 'Summary'];
    const mepPopupBody = tabs.map((tab, index) => {
      const mepTab = createTag('div', { class: 'mep-tab' });
      if (index === 0) mepTab.setAttribute('active', '');
      mepTab.textContent = tab;
      mepPopupTabs.append(mepTab);
      const bodyDiv = createTag('div', { class: `mep-popup-body mep-${tabs[index].toLocaleLowerCase()}-body` });
      if (index === 0) bodyDiv.setAttribute('active', '');
      return bodyDiv;
    });
    return { mepPopupTabs, mepPopupBody };
  }
  const { mepPopupTabs, mepPopupBody } = buildTabsAndContainers();

  function BuildOptionsManifestList() {
    const { manifestList } = getManifestListDomAndParameter(mepConfig);
    const manifestTag = createTag('div', { class: 'mep-manifest-list' });
    manifestTag.innerHTML = `<h6>Manifests</h6>
      ${mepConfig.activities?.length ? manifestList : '<div class="mep-section">(0 manifests found.)</div>'}
    `;
    mepPopupBody[0].append(manifestTag);
  }
  BuildOptionsManifestList();

  function BuildOptionsManifestLisMMM() {
    if (config.env?.name !== 'prod') return;
    const mepManifestListMMM = createTag('div', { class: 'mep-manifest-list mmm-list' });
    mepPopupBody[0].append(mepManifestListMMM);
  }
  BuildOptionsManifestLisMMM();

  // Visibility gates for the market spoofers. Computed once per popup-build:
  //   - lingoOk: page exposes Lingo regions, so the existing Lingo dropdown
  //     and its companion "Use M@S markets instead" checkbox make sense.
  //   - hasMas:  page has any M@S surface (collection / card / inline / OST
  //     / offer); without one, neither M@S control is useful.
  // Resulting render matrix:
  //                          Lingo dropdown    M@S checkbox    M@S dropdown
  //   Lingo + no M@S         shown             hidden          hidden
  //   Lingo + M@S            shown             shown           gated by checkbox
  //   non-Lingo + no M@S     "no Lingo" hint   hidden          hidden
  //   non-Lingo + M@S        "no Lingo" hint   hidden          shown standalone
  // Standalone variant drops the green left border (a visual link to the
  // adjacent toggle) since there's no checkbox to anchor to.
  const lingoOk = lingoActive() && regionKeys.length > 0;
  const hasMas = hasMasSurfaces();

  function buildOptionsLingoSelect() {
    if (lingoOk) {
      const regionOptions = regionKeys.map((key) => {
        const country = key.split('_')[0];
        // M@S Markets mode disables the Lingo dropdown — surfacing a "selected" option would
        // mislead since its value no longer drives akamaiLocale.
        const currentAkamaiLocale = masMarketChecked ? null : urlParams.get('akamaiLocale');
        const selected = currentAkamaiLocale === country ? ' selected' : '';
        return `<option value="${country}"${selected}>${key}</option>`;
      }).join('');

      const disabledAttr = masMarketChecked ? ' disabled' : '';
      return `
        <div class="mep-experience-dropdown">
          <label for="mepLingoRegionSelect${pageId}">Supported Lingo Geos</label>
          <select name="mepLingoRegion${pageId}" id="mepLingoRegionSelect${pageId}" class="mep-manifest-variants"${disabledAttr}>
            <option value="">-- Select Region --</option>
            ${regionOptions}
          </select>
        </div>`;
    } return '<div>(No Lingo supported geos for this page.)</div>';
  }
  const regionDropdownHTML = buildOptionsLingoSelect();

  // Sync read from cache — do NOT await getMarketConfig(). Cold cache renders the placeholder;
  // the deferred reload at the end of getMepPopup picks up live data. Returns '' on no M@S.
  function buildOptionsMasMarketSelect() {
    if (!hasMas) return '';
    const cached = config?.marketsConfig;
    const languages = cached?.languages?.data ?? cached?.data ?? [];
    const lang = languages.length
      ? marketsLangForLocale({ languages }, config?.locale)
      : null;
    const supported = lang?.supportedRegions
      ?.split(',').map((m) => m.trim().toLowerCase())
      .filter(Boolean) || [];

    // Standalone (non-Lingo + M@S): always visible, pre-selected from
    // akamaiLocale. Lingo + M@S: hidden until the companion checkbox flips.
    const standalone = !lingoOk;
    const hiddenAttr = standalone || masMarketChecked ? '' : 'hidden';
    const currentAkamaiLocale = (standalone || masMarketChecked)
      ? urlParams.get('akamaiLocale')
      : null;
    const opts = supported.map((c) => {
      const selected = currentAkamaiLocale === c ? ' selected' : '';
      return `<option value="${c}"${selected}>${c}</option>`;
    }).join('');
    // Always emit <select> (disabled when empty) — keeps shape stable; no downstream branches.
    const disabledAttr = supported.length === 0 ? ' disabled' : '';
    const placeholderOpt = supported.length === 0
      ? '<option value="">-- No M@S markets for this page --</option>'
      : '<option value="">-- Select Market --</option>';
    const standaloneClass = standalone ? ' standalone' : '';
    return `
      <div class="mep-experience-dropdown mep-mas-market-dropdown${standaloneClass}" ${hiddenAttr}>
        <label for="mepMasMarketSelect${pageId}">Supported M@S Markets</label>
        <select name="mepMasMarket${pageId}" id="mepMasMarketSelect${pageId}" class="mep-manifest-variants"${disabledAttr}>
          ${placeholderOpt}
          ${opts}
        </select>
      </div>`;
  }
  // Warm the cache for next popup open. Fire-and-forget.
  if (!config?.marketsConfig) getMarketConfig();
  const masMarketDropdownHTML = buildOptionsMasMarketSelect();
  // Checkbox only makes sense between two dropdowns — suppress on non-Lingo (M@S alone).
  const masMarketToggleHTML = (hasMas && lingoOk) ? `
    <div class="mep-mas-market-toggle">
      <input type="checkbox" name="mepMasMarket${pageId}"
        id="mepMasMarketCheckbox${pageId}" ${mepMasMarketCheckedAttr} value="true">
      <label for="mepMasMarketCheckbox${pageId}">Use M@S markets</label>
    </div>` : '';

  function buildOptionsToggles() {
    const mepToggleOptions = createTag('div', { class: 'mep-section' });
    const infoSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff" class="mep-info-icon">
    <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
    </svg>`;
    const mepToggleInfo = `
    ${infoSVG}
    <div class="mep-info-tooltip">
      <h6 class="mep-section-header">Fragment Color Key</h6>
      <div class="mep-section-data">
        <span class="D1ECF1 color-swatch"></span>
        <span class="mep-manifest-label">MEP Manifest</span>
        <span class="D4EDDA color-swatch"></span> 
        <span class="regional-label">Lingo Regional</span>
        <span class="FFF3CD color-swatch"></span>
        <span class="fallback-label">Lingo Fallback</span>
        <span class="E9ECEF color-swatch"></span>
        <span class="manifest-label">Other</span>
      </div>
    </div>
    `;

    const showManifestsCheckbox = config.env?.name === 'prod' && !isMmm
      ? `<div>
        <input type="checkbox" name="mepHighlight${pageId}"
        id="mepManifestsCheckbox" value="false">
        <label for="mepManifestsCheckbox">MMM data for last 7 days</label>
      </div>`
      : '';
    mepToggleOptions.innerHTML = `
    <h6 class="mep-section-header">
      Toggles
      ${mepToggleInfo}
    </h6>
    <div class="mep-manifest-variants">
      <div>
        <input type="checkbox" name="mepHighlight${pageId}"
        id="mepHighlightCheckbox${pageId}" ${mepHighlightChecked} value="true">
        <label for="mepHighlightCheckbox${pageId}">Highlight changes</label>
      </div>
      <div>
        <input type="checkbox" name="mepFragments${pageId}"
        id="mepFragmentsCheckbox${pageId}" ${mepFragmentsChecked} value="true">
        <label for="mepFragmentsCheckbox${pageId}">Highlight fragments</label>
      </div>
      <div>
        <input type="checkbox" name="mepCaasHighlight${pageId}"
        id="mepCaasHighlightCheckbox${pageId}" ${mepCaasHighlightChecked} value="true">
        <label for="mepCaasHighlightCheckbox${pageId}">Highlight CaaS</label>
      </div>
      <div>
        <input type="checkbox" name="mepMasHighlight${pageId}"
        id="mepMasHighlightCheckbox${pageId}" ${mepMasHighlightChecked} value="true">
        <label for="mepMasHighlightCheckbox${pageId}">Highlight M@S</label>
        <div class="mep-mas-no-content" hidden>No M@S content found on this page.</div>
      </div>
      ${showManifestsCheckbox}
      <div>
        <input type="checkbox" name="mepPreviewButtonCheckbox${pageId}"
        id="mepPreviewButtonCheckbox${pageId}" value="off">
        <label for="mepPreviewButtonCheckbox${pageId}">Add mepButton=off to preview link</label>
      </div>
    </div>
    ${regionDropdownHTML}
    ${masMarketToggleHTML}
    ${masMarketDropdownHTML}
    <div>New manifest location or path*</div>
    <input type="text" name="new-manifest${pageId}" class="new-manifest">
  `;
    mepPopupBody[0].append(mepToggleOptions);
  }
  buildOptionsToggles();

  // Build Options : Footer
  function buildOptionsFooter() {
    const mepFooterHTML = `
      <a class="con-button outline button-l" data-id="${PREVIEW_BUTTON_ID}" title="Preview above choices" ${isMmm ? ' target="_blank"' : ''} active>
        Preview
      </a>`;

    mepPopupBody[0].append(createTag('div', { class: `mep-popup-footer${isMmm ? '' : ' dark'}` }, mepFooterHTML));
  }
  buildOptionsFooter();

  // Build Summary : Page
  function buildSummaryPage() {
    const mepTarget = isMmm ? page.target : ({ postlcp: 'postlcp', true: 'on', false: 'off' }[config.mep?.targetEnabled]);

    const foundation = (getMetadata('foundation') || 'c1').toUpperCase();
    const pageData = {
      manifestsFound: mepConfig.activities?.length || 0,
      foundation,
      targetIntegration: setTargetOnText(mepTarget, page),
      personalization: page.personalization,
      locale: page.locale?.toLowerCase(),
      lastSeen: formatDate(new Date(page.lastSeen)),
    };

    const pageHTML = `
    <h6 class="mep-section-header">Page</h6>
    <div class="mep-section-data">
        <span>Manifests Found</span>
        <span>${pageData.manifestsFound}</span>
        <span>Foundation</span>
        <span>${pageData.foundation}</span>
        <span>Target Integration</span>
        <span>${pageData.targetIntegration}</span>
        <span>Personalization</span>
        <span>${pageData.personalization}</span>
    ${page.lastSeen ? `
        <span>Locale</span>
        <span>${pageData.locale}</span>`
    : ''}
    </div>
    `;

    mepPopupBody[1].append(createTag('div', { class: 'mep-section' }, pageHTML));
  }
  buildSummaryPage();

  // Build Summary : Consent
  function buildSummaryConsent() {
    if (isMmm) return;
    const { consentState } = config.mep;

    const consentData = {
      functional: consentState?.functional ? 'on' : 'off',
      advertising: consentState?.advertising ? 'on' : 'off',
    };

    const consentHTML = `
    <h6 class="mep-section-header">Consent</h6>
    <div class="mep-section-data">
        <span>Functional</span>
        <span>${consentData.functional}</span>
        <span>Advertising</span>
        <span>${consentData.advertising}</span>
    </div>
  `;
    mepPopupBody[1].append(createTag('div', { class: 'mep-section' }, consentHTML));
  }

  buildSummaryConsent();

  // Build Summary : Lingo
  async function buildSummaryLingo() {
    async function getGeoUserSupport() {
      if (regionKeys?.length === 0 || !lingoActive()) return 'Not Applicable';
      if (await getGeoLocalePrefix()) return 'Supported';
      return 'Not Supported';
    }

    const regionalFragments = document.querySelectorAll('[data-mep-lingo-roc]');
    const fallbackFragments = document.querySelectorAll('[data-mep-lingo-fallback]');

    const searchParams = new URLSearchParams(window.location.search);
    const countryParam = normCountryCode(searchParams.get('country'));
    const countryCookie = countryParam
      || normCountryCode(getCookie('country'))
      || 'None';

    const lingoData = {
      langFirst: lingoActive() ? 'on' : 'off',
      geoFolder: page.geo || 'Us (None)',
      countryCookie: escapeHtml(countryCookie) ?? '',
      userCountry: escapeHtml(await resolveDetectedMarketCountry()) ?? '',
      geoUser: await getGeoUserSupport(),
      updates: `${regionalFragments.length} of ${regionalFragments.length + fallbackFragments.length}`,
      total: regionalFragments.length + fallbackFragments.length,
    };

    const lingoHTML = `
    <h6 class="mep-section-header">Lingo</h6>
    <div class="mep-section-data">
      ${isMmm ? `
        <span>Total</span>
        <span>${lingoData.total}</span>
      ` : `
        <span>Mep Lingo Updates</span>
        <span>${lingoData.updates}</span>
      `}
        <span>Lang First / Lingo</span>
        <span>${lingoData.langFirst}</span>
        <span>Geo Folder</span>
        <span>${lingoData.geoFolder}</span>
      ${isMmm ? '' : `
        <span>Country cookie</span>
        <span>${lingoData.countryCookie}</span>
        <span>User Country</span>
        <span>${lingoData.userCountry}</span>
        <span>Geo + User</span>
        <span>${lingoData.geoUser}</span>
      `}
    </div>
  `;
    mepPopupBody[1].append(createTag('div', { class: 'mep-section' }, lingoHTML));
  }
  await buildSummaryLingo();

  // M@S summary. Surfaces Detected = Collections + Cards + Inline Fields + Standalone Offers.
  // Sub-collections are a sub-row (live inside the parent collection payload, not a separate
  // DOM surface). Counts query real elements (merch-card, mas-field, MAS_OSI_SELECTOR) — the
  // [data-mas-block] stamps only land while mep.preview is on. Standalone Offers excludes
  // card-internal offers (~5x multiplier per card; per-card "View in OST" handles them).
  function buildSummaryMas() {
    const collectionContainers = document.querySelectorAll('[data-mas-block="collection"]');
    let subCollectionCount = 0;
    collectionContainers.forEach((c) => {
      subCollectionCount += mepMasSubCollections.get(c)?.length || 0;
    });
    const standaloneOfferCount = [...document.querySelectorAll(MAS_OSI_SELECTOR)]
      .filter((el) => !el.closest('merch-card')).length;
    const masCounts = {
      collection: collectionContainers.length,
      subCollection: subCollectionCount,
      card: document.querySelectorAll('merch-card').length,
      inlineField: document.querySelectorAll('mas-field').length,
      standaloneOffer: standaloneOfferCount,
    };
    const masSurfaces = masCounts.collection
      + masCounts.card
      + masCounts.inlineField
      + masCounts.standaloneOffer;
    const geoDetectionOn = isMasGeoDetectionEnabled();
    const masGeoDetectionParam = new URLSearchParams(window.location.search).get('mas-geo-detection');
    const masGeoDetectionMeta = getMetadata('mas-geo-detection');
    let geoDetectionSource = 'none';
    if (geoDetectionOn) {
      geoDetectionSource = masGeoDetectionParam ? 'URL param' : 'Metadata';
    } else if (masGeoDetectionParam || masGeoDetectionMeta) {
      geoDetectionSource = masGeoDetectionParam ? 'URL param (off)' : 'Metadata (off)';
    }

    const svc = document.head.querySelector('mas-commerce-service');
    const liveCountry = svc?.getAttribute('country');
    const localeCountry = getMiloLocaleSettings(config.locale)?.country;
    const pageMarket = (liveCountry || localeCountry || '').toUpperCase() || 'unknown';
    const pageMarketSource = liveCountry ? 'mas-commerce-service' : 'page locale';

    const section = createTag('div', { class: 'mep-section' });
    section.append(createTag('h6', { class: 'mep-section-header' }, 'M@S'));
    const data = createTag('div', { class: 'mep-section-data' });
    const rows = [
      ['Mas Geo Detection', geoDetectionOn ? 'on' : 'off'],
      ['Geo Source', geoDetectionSource],
      ['Page Market', pageMarket],
      ['Market Source', pageMarketSource],
      ['Surfaces Detected', masSurfaces],
      ['Collections', masCounts.collection, true],
      ['Sub-collections', masCounts.subCollection, true],
      ['Cards', masCounts.card, true],
      ['Inline Fields', masCounts.inlineField, true],
      ['Standalone Offers', masCounts.standaloneOffer, true],
    ];
    rows.forEach(([label, value, sub]) => {
      data.append(createTag('span', sub ? { class: 'mep-mas-subitem' } : null, label));
      const valueSpan = createTag('span');
      valueSpan.textContent = String(value);
      data.append(valueSpan);
    });
    section.append(data);
    mepPopupBody[1].append(section);
  }
  buildSummaryMas();

  // Inject Overlay
  function compileOverlay() {
    mepPopup.append(mepPopupHeader, mepPopupTabs, ...mepPopupBody);

    mepPopupBody.forEach((body) => {
      addDividers(body, '.mep-section');
    });

    addMepPopupListeners(mepPopup, pageId);

    const previewButton = mepPopup.querySelector(`a[data-id="${PREVIEW_BUTTON_ID}"]`);
    if (previewButton) updatePreviewButton(mepPopup, pageId);
  }
  compileOverlay();

  // Cold-cache defer-populate: if marketsConfig wasn't ready at build time, await the fetch
  // and re-render the dropdown in place. Guarded so it never clobbers user selection.
  if (!config?.marketsConfig) {
    getMarketConfig().then(() => {
      const wrapper = mepPopup.querySelector('.mep-mas-market-dropdown');
      if (!wrapper) return;
      const existingSelect = wrapper.querySelector('select');
      if (existingSelect?.value) return;
      wrapper.outerHTML = buildOptionsMasMarketSelect();
      const newSelect = mepPopup.querySelector(`select#mepMasMarketSelect${pageId}`);
      newSelect?.addEventListener('change', () => updatePreviewButton(mepPopup, pageId));
    });
  }

  return mepPopup;
}

async function createPreviewPill() {
  const mepConfig = parseMepConfig();
  if (!mepConfig) return;
  const { activities } = mepConfig;
  const overlay = createTag('div', { class: 'mep-preview-overlay static-links', popover: 'manual', 'data-lenis-prevent': '' });
  const pill = document.createElement('div');
  pill.classList.add('mep-hidden');
  const mepBadge = createTag('div', { class: 'mep-manifest mep-badge' });
  mepBadge.innerHTML = getPillText(activities?.length);
  pill.append(mepBadge);
  pill.append(await getMepPopup(mepConfig));
  overlay.append(pill);
  document.body.append(overlay);
  let onClose;
  if (window.lenis?.options) {
    const originalPrevent = window.lenis.options.prevent;
    window.lenis.options.prevent = (node) => {
      if (node.closest('.mep-preview-overlay')) return true;
      return originalPrevent?.(node);
    };
    onClose = () => { window.lenis.options.prevent = originalPrevent; };
  }
  addPillEventListeners(pill, overlay, onClose);
}
function addHighlightData(manifests) {
  manifests.forEach(({ selectedVariant, manifest }) => {
    const manifestName = getFileName(manifest);

    const updateManifestId = (selector, prop = 'manifestId') => {
      document.querySelectorAll(selector).forEach((el) => {
        el.dataset[prop] = manifestName;
        if (prop === 'manifestId') {
          el.dataset.manifestDisplay = `${manifestName}: html`;
        }
      });
    };

    selectedVariant?.replacefragment?.forEach(
      ({ val }) => {
        document.querySelectorAll(`[data-path*="${val}"]`).forEach((el) => {
          el.dataset.manifestId = manifestName;
          el.dataset.fragmentPath = val;
          el.dataset.manifestDisplay = `${manifestName}: ${el.dataset.path || val}`;
        });
      },
    );

    selectedVariant?.useblockcode?.forEach(({ selector }) => {
      if (selector) updateManifestId(`.${selector}`, 'codeManifestId');
    });

    selectedVariant?.updatemetadata?.forEach(({ selector }) => {
      if (selector === 'gnav-source') updateManifestId('header, footer');
    });

    // eslint-disable-next-line max-len
    document.querySelectorAll(`.section[class*="merch-cards"] .fragment[data-manifest-id="${manifestName}"] merch-card`)
      .forEach((el) => (el.dataset.manifestId = manifestName));

    document.querySelectorAll(`[data-manifest-id="${manifestName}"]`).forEach((el) => {
      if (!el.dataset.manifestDisplay) {
        if (el.dataset.path) {
          el.dataset.manifestDisplay = `${manifestName}: ${el.dataset.path}`;
          el.dataset.fragmentPath = el.dataset.path;
        } else {
          el.dataset.manifestDisplay = `${manifestName}: html`;
          el.dataset.mepHtmlBadge = 'true'; // Mark as non-clickable HTML badge - gnav workaround
        }
      }
    });
  });
}

function markDefaultFragments() {
  document.querySelectorAll('[data-path]').forEach((fragment) => {
    const hasManifest = fragment.dataset.manifestId;
    const hasRoc = fragment.dataset.mepLingoRoc;
    const hasFallback = fragment.dataset.mepLingoFallback;
    if (!hasManifest && !hasRoc && !hasFallback && fragment.dataset.path) {
      fragment.dataset.fragmentDefault = '';
      fragment.dataset.fragmentDisplay = fragment.dataset.path;
    }
  });
}

function adjustBadgesForZeroHeightSections() {
  const badgeSelectors = '[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id][data-path], [data-fragment-default]';
  document.querySelectorAll(badgeSelectors).forEach((el) => {
    const section = el.closest('.section');
    const elementHeight = el.offsetHeight;
    const sectionHeight = section ? section.offsetHeight : elementHeight;
    if (sectionHeight < 10) {
      const badgeHeight = 35;
      const spacing = 5;
      el.style.setProperty('--badge-top-offset', `-${badgeHeight + spacing}px`);
    }
  });
}

function adjustStackedBadges() {
  const badgeSelectors = '[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id][data-path], [data-fragment-default]';
  const badgeHeight = 35;
  const spacing = 5;
  document.querySelectorAll('.section').forEach((section) => {
    const allBadges = section.querySelectorAll(badgeSelectors);
    const directBadges = [...allBadges].filter((el) => {
      if (el.closest('.section') !== section) return false;
      return window.getComputedStyle(el).display === 'contents';
    });
    if (directBadges.length <= 1) return;
    let offset = 0;
    directBadges.forEach((el) => {
      if (offset > 0) el.style.setProperty('--badge-top-offset', `${offset}px`);
      offset += badgeHeight + spacing;
    });
  });
}

function addFragmentBadgeClickHandlers() {
  document.body.addEventListener('click', (e) => {
    const isHighlightEnabled = document.body.dataset.mepHighlight === 'true';
    const isFragmentsEnabled = document.body.dataset.mepFragments === 'true';
    const isCaasHighlightEnabled = document.body.dataset.mepCaasHighlight === 'true';
    if (!isHighlightEnabled && !isFragmentsEnabled && !isCaasHighlightEnabled) return;

    // Ignore clicks from within the MEP popup
    if (e.target.closest('.mep-preview-overlay')) return;

    // Find the badged element that was clicked (includes non-fragment badges)
    const fragment = e.target.closest('[data-mep-lingo-roc], [data-mep-lingo-fallback], [data-manifest-id], [data-fragment-default], [data-card-url]');
    if (!fragment) return;

    const elementStyle = window.getComputedStyle(fragment);
    const beforeStyles = window.getComputedStyle(fragment, '::before');
    const badgeIsVisible = beforeStyles.display !== 'none' && beforeStyles.content !== 'none';
    if (!badgeIsVisible) return;

    // Use max of calculated dimensions or reasonable minimums for badge text
    const badgeWidth = Math.max(parseFloat(beforeStyles.width) + 30, 200);
    const badgeHeight = parseFloat(beforeStyles.height)
      || parseFloat(beforeStyles.minHeight)
      || 35;
    let fragmentPath = fragment.dataset.path
      || fragment.dataset.fragmentPath
      || fragment.dataset.cardUrl;
    if (fragment.dataset.cardUrl) {
      fragmentPath = rewriteBlogPreviewHost(fragmentPath) || rewriteForPreviewHost(fragmentPath);
    }
    const badgeTopOffset = parseFloat(fragment.style.getPropertyValue('--badge-top-offset')) || 0;
    const handleBadgeClick = () => {
      e.preventDefault();
      e.stopPropagation();
      if (fragmentPath) window.open(fragmentPath, '_blank');
    };

    if (elementStyle.display === 'contents') {
      const visibleChildren = Array.from(fragment.children).filter((c) => c.offsetHeight > 0);
      if (visibleChildren.length === 0) {
        if (e.clientX >= 0 && e.clientX < badgeWidth) handleBadgeClick();
        return;
      }
      for (const child of visibleChildren) {
        const childRect = child.getBoundingClientRect();
        const relativeY = e.clientY - childRect.top;
        const relativeX = e.clientX - childRect.left;
        const inBadgeY = relativeY >= (badgeTopOffset - badgeHeight)
          && relativeY < badgeTopOffset;
        const inBadgeX = relativeX >= 0 && relativeX < badgeWidth;
        if (inBadgeY && inBadgeX) {
          handleBadgeClick();
          return;
        }
      }
      return;
    }

    const rect = fragment.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const inBadgeY = clickY >= badgeTopOffset && clickY < (badgeTopOffset + badgeHeight);
    if (inBadgeY && clickX >= 0 && clickX < badgeWidth) handleBadgeClick();
  });
}

export async function saveToMmm() {
  const data = parseMepConfig();
  if (!data) return false;
  const excludedStrings = ['/drafts/', '.stage.', '.page/', '.live/', '/fragments/', '/nala/'];
  if (excludedStrings.some((str) => data.page.url.includes(str))) return false;
  data.activities = data.activities.filter((activity) => {
    const { url, source } = activity;
    activity.source = source.filter((item) => item !== 'mep param');
    return (!!(activity.source?.length && !url.includes('/drafts/')));
  });
  data.activities = data.activities.map((activity) => {
    activity.variantNames = activity.variantNames?.join('||') || '';
    activity.source = activity.source?.join(',') || '';
    delete activity.selectedVariantName;
    return activity;
  });
  if (data.page.prefix === US_GEO) data.page.prefix = '';
  data.page.target = getMetadata('target') || 'off';
  delete data.page.highlight;
  return fetch(API_URLS.save, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      const res = await response.json();
      if (response.ok) return res;
      /* c8 ignore next 1 */
      throw new Error(res.message || 'Network response failed');
    });
}
export default async function decoratePreviewMode() {
  const { miloLibs, codeRoot, mep } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/features/personalization/preview.css`);
  // Warm the M@S supported-markets cache so the spoofer dropdown is ready by popup open.
  // Critical on non-Lingo pages (e.g., /products/photoshop) — no other consumer fetches
  // this config before the popup builds. Fire-and-forget; getMarketConfig swallows errors.
  getMarketConfig();
  await createPreviewPill();
  if (mep?.experiments) addHighlightData(mep.experiments);
  markDefaultFragments();
  addFragmentBadgeClickHandlers();
  if (document.body.dataset.mepCaasHighlight === 'true') {
    watchForCaasBlocks();
    injectCaasBadges();
  }
  if (document.body.dataset.mepMasHighlight === 'true') {
    watchForMasContent();
    injectMasBadges();
  }
  // Adjust badge positions after a short delay to allow rendering
  setTimeout(() => {
    adjustBadgesForZeroHeightSections();
    adjustStackedBadges();
  }, 100);
}
