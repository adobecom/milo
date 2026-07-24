import { createTag, getConfig } from '../../utils/utils.js';
import { decorateButtons, getBlockSize } from '../../utils/decorate.js';
import { postProcessAutoblock } from '../merch/autoblock.js';
import {
  initService,
  createAemFragment,
  getOptions,
  overrideOptions,
  loadMasComponent,
  createFragmentErrorEl,
  isMasErrorEnv,
  COMMERCE_LIBRARY,
  MAS_MERCH_CARD,
  MAS_MERCH_QUANTITY_SELECT,
  MAS_FIELD,
} from '../merch/merch.js';

const CARD_AUTOBLOCK_TIMEOUT = 5000;
const seenFragments = new Set();
let log;
loadMasComponent(MAS_MERCH_CARD);
loadMasComponent(MAS_MERCH_QUANTITY_SELECT);

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';
const BLOCK_CONTENT_SELECTOR = `${HEADING_SELECTOR}, p, div, ul, ol, table, blockquote, pre, figure, section, article, hr`;
const INLINE_WRAPPER_SELECTOR = 'strong, em, span, b, i, u, small, mark';

/**
 * Upgrades plain commerce elements (missing `is` attribute) to their proper
 * customized built-in equivalents so the commerce service resolves them.
 * e.g. <a data-wcs-osi="..."> → <a is="checkout-link" data-wcs-osi="...">
 */
const COMMERCE_IS_BY_TAG = { a: 'checkout-link', button: 'checkout-button', span: 'inline-price' };
function upgradeCommerceLinks(content) {
  content.querySelectorAll('[data-wcs-osi]:not([is])').forEach((el) => {
    const isValue = COMMERCE_IS_BY_TAG[el.tagName.toLowerCase()];
    if (!isValue) return;
    const upgraded = document.createElement(el.tagName.toLowerCase(), { is: isValue });
    [...el.attributes].forEach(({ name, value }) => upgraded.setAttribute(name, value));
    upgraded.innerHTML = el.innerHTML;
    el.replaceWith(upgraded);
  });
}

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), CARD_AUTOBLOCK_TIMEOUT);
  });
}

async function loadCoreDependencies() {
  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }
  const service = await servicePromise;
  log = service.Log.module('merch-card');

  await Promise.all([
    loadMasComponent(MAS_MERCH_CARD),
    loadMasComponent(MAS_MERCH_QUANTITY_SELECT),
  ]);
}

async function loadInlineDependencies() {
  await loadMasComponent(MAS_FIELD);
}

export async function checkReady(masElement, fragment) {
  if (isMasErrorEnv()) {
    const uuid = fragment ?? masElement.querySelector('aem-fragment')?.getAttribute('fragment');
    if (masElement.hasAttribute('failed')) {
      createFragmentErrorEl(uuid, 'Card').then((el) => masElement.insertAdjacentElement('beforebegin', el));
    } else {
      masElement.addEventListener('aem:error', async (e) => {
        masElement.insertAdjacentElement('beforebegin', await createFragmentErrorEl(uuid, 'Card', e.detail?.status));
      }, { once: true });
    }
  }

  const readyPromise = masElement.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);
  if (success === 'timeout') {
    log.error(`${masElement.tagName} did not initialize withing give timeout`);
  } else if (!success) {
    log.error(`${masElement.tagName} failed to initialize`);
  }
}

function hasOnlyTargetContent(parent, target) {
  if (!parent || !target || target.parentElement !== parent) return false;
  return [...parent.childNodes].every((node) => {
    if (node === target) return true;
    return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
  });
}

function unwrapInlineWrappers(masField) {
  let parent = masField.parentElement;
  while (parent?.matches?.(INLINE_WRAPPER_SELECTOR)
    && hasOnlyTargetContent(parent, masField)) {
    parent.replaceWith(masField);
    parent = masField.parentElement;
  }
}

function normalizeBlockFieldWrappers(masField) {
  const content = masField.querySelector(':scope > [data-role="mas-field-content"]');
  if (!content?.querySelector(BLOCK_CONTENT_SELECTOR)) return;

  unwrapInlineWrappers(masField);

  const parent = masField.parentElement;
  if (!parent || !hasOnlyTargetContent(parent, masField)) return;

  if (parent.matches(HEADING_SELECTOR)) {
    const innerHeading = [...content.children]
      .find((child) => child.matches?.(HEADING_SELECTOR));
    if (innerHeading) {
      if (parent.id && !innerHeading.id) innerHeading.id = parent.id;
      parent.classList.forEach((className) => innerHeading.classList.add(className));
    }
  }

  if (parent.matches('p') || parent.matches(HEADING_SELECTOR)) {
    parent.replaceWith(masField);
  }
}

async function createJsonLd(el, options) {
  const aemFragment = createAemFragment(options, seenFragments);
  const merchCard = createTag('merch-card', { consonant: '', hidden: '' }, aemFragment);
  document.body.appendChild(merchCard);
  await checkReady(merchCard, options.fragment);
  const fragmentEl = merchCard.querySelector('aem-fragment');
  const fields = fragmentEl?.data?.fields;
  const priceEl = merchCard.querySelector('[is="inline-price"][data-template="price"]')
    ?? merchCard.querySelector('[is="inline-price"]:not([data-template="strikethrough"]):not([data-template="legal"])');
  const strikethroughEl = merchCard.querySelector('[is="inline-price"][data-template="strikethrough"]');
  const offer = priceEl?.value?.[0];
  const regularOffer = strikethroughEl?.value?.[0];
  const { injectJsonLd } = await loadMasComponent(COMMERCE_LIBRARY);
  injectJsonLd(fields, offer, regularOffer, document.location.href);
  merchCard.remove();
  el.remove();
}

export async function createCard(el, options) {
  const aemFragment = createAemFragment(options, seenFragments);
  const merchCard = createTag('merch-card', { consonant: '' }, aemFragment);
  // For the "Edit Card" mep preview badge.
  if (getConfig()?.mep?.preview) {
    const { mepMasStudioUrls } = await import('../merch/mas-mep-utils.js');
    mepMasStudioUrls.set(merchCard, el.href);
    merchCard.dataset.masBlock = 'card';
  }
  const parent = el.parentElement;
  if (parent && parent.tagName === 'P' && parent.children.length === 1) {
    parent.replaceWith(merchCard);
  } else {
    el.replaceWith(merchCard);
  }
  await checkReady(merchCard, options.fragment);
  await postProcessAutoblock(merchCard, true);
}

function copyMasFieldIdToParent(masField, name) {
  if (masField.getAttribute(name)) {
    masField.parentElement.setAttribute(`data-mas-field-${name}`, masField.getAttribute(name));
  }
}

/**
 * Hoists a resolved inline CTA out of its mas-field into the authored em/strong,
 * then runs decorateButtons. Size and utility classes come from an already-decorated
 * sibling button, else from the block's own classes. Deferred until every CTA
 * mas-field in the container has been hoisted, so a still-wrapped sibling isn't
 * matched by 'em a'/'strong a' with the wrong parent (its content span).
 */
function decorateInlineCtas(masField, content) {
  const container = masField.closest('p, div');

  // The block this CTA belongs to (direct child of a section). Bounds the sibling
  // lookup so a foreign block's button can't dictate this CTA's size.
  let blockEl = container?.parentElement;
  while (blockEl?.parentElement && !blockEl.parentElement.classList.contains('section')
    && blockEl.parentElement !== document.body) {
    blockEl = blockEl.parentElement;
  }

  // Match an already-decorated sibling button in the same block, else derive from the block.
  const siblingBtn = [...(blockEl?.querySelectorAll('.con-button') ?? [])]
    .find((b) => !masField.contains(b));
  let size;
  let utilClasses = [];

  if (siblingBtn) {
    // Inherit the sibling's exact size and utility classes (null size honoured).
    size = [...siblingBtn.classList].find((c) => /^button-(s|m|l|xl)$/.test(c)) ?? null;
    utilClasses = [...siblingBtn.classList].filter((c) => c.startsWith('button-') && c !== size);
  } else {
    // No decorated sibling yet — derive size from the block, mirroring its decorateButtons call.
    const btnVariant = [...(blockEl?.classList ?? [])].find((c) => c.endsWith('-button'));
    if (btnVariant) {
      size = `button-${btnVariant.split('-')[0]}`;
    } else if (blockEl?.classList.contains('hero-marquee')) {
      size = 'button-xl';
    } else if (blockEl?.classList.contains('accordion') || blockEl?.classList.contains('media')) {
      size = null;
    } else {
      const blockSize = getBlockSize(blockEl ?? container);
      size = (blockSize === 'large' || blockSize === 'xlarge') ? 'button-xl' : 'button-l';
    }
  }
  copyMasFieldIdToParent(masField, 'fragment-id');
  copyMasFieldIdToParent(masField, 'variation-id');
  masField.replaceWith(...[...content.childNodes]);

  const pendingCTAs = container?.querySelectorAll('em > mas-field, strong > mas-field');
  if (container && !pendingCTAs?.length) {
    decorateButtons(container, size);
    if (utilClasses.length) {
      container.querySelectorAll('.con-button').forEach((b) => utilClasses.forEach((c) => b.classList.add(c)));
    }
  }
}

/**
 * A headless mas-field CTA can resolve after its block decorated (slow network),
 * firing 'mas:ready' too late for decorateButtons. One document-level listener
 * hoists + decorates it regardless of block, so no per-block wiring is needed.
 * Registered once, on the first merch init.
 */
let masReadyWatched = false;
function watchMasFieldCtas() {
  if (masReadyWatched) return;
  masReadyWatched = true;
  // Hide an inline CTA while it's still wrapped in a mas-field (rendered but not yet
  // hoisted/decorated) so its half-styled state doesn't flash on slow loads. Removing
  // the mas-field on decoration reveals the finished button.
  const style = createTag('style', undefined, 'em > mas-field:has(a), strong > mas-field:has(a) { visibility: hidden; }');
  document.head.append(style);
  document.addEventListener('mas:ready', ({ target: mf }) => {
    if (mf?.tagName !== 'MAS-FIELD' || !mf.closest('em, strong')) return;
    const content = mf.querySelector(':scope > [data-role="mas-field-content"]');
    // Same gate createInline uses: an inline CTA anchor, not block-level content.
    if (content?.querySelector('a') && !content.querySelector(BLOCK_CONTENT_SELECTOR)) {
      decorateInlineCtas(mf, content);
    }
  });
}

/** Replaces an inline fragment link with a mas-field wrapping an aem-fragment. */
async function createInline(el, options) {
  const aemFragment = createAemFragment(options, seenFragments);
  const masField = createTag('mas-field', { field: options.field }, aemFragment);
  if (getConfig()?.mep?.preview) {
    const { mepMasStudioUrls } = await import('../merch/mas-mep-utils.js');
    mepMasStudioUrls.set(masField, el.href);
    masField.dataset.masBlock = 'inline';
  }
  el.replaceWith(masField);
  await checkReady(masField, options.fragment);
  normalizeBlockFieldWrappers(masField);

  const content = masField.querySelector(':scope > [data-role="mas-field-content"]');
  if (!content) return;

  // Upgrade any plain commerce elements (missing `is`) so the commerce service resolves
  // them. Applies to both CTA (<a>) and price (<span>) fields.
  upgradeCommerceLinks(content);

  // Inline CTAs: hoist the anchor into the authored em/strong and let decorateButtons style it.
  if (content.querySelector('a') && !content.querySelector(BLOCK_CONTENT_SELECTOR)) {
    decorateInlineCtas(masField, content);
  }
}

export default async function init(el) {
  watchMasFieldCtas();
  let options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;
  options = overrideOptions(fragment, options);
  await loadCoreDependencies();
  if (options.jsonld) {
    await createJsonLd(el, options);
  } else if (options.field) {
    await loadInlineDependencies();
    await createInline(el, options);
  } else {
    await createCard(el, options);
  }
}
