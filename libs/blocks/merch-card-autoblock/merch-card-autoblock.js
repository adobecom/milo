import { createTag, getConfig } from '../../utils/utils.js';
import { decorateButtons, getBlockSize } from '../../utils/decorate.js';
import { postProcessAutoblock } from '../merch/autoblock.js';
import {
  initService,
  getOptions,
  overrideOptions,
  loadMasComponent,
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

export async function checkReady(masElement) {
  const readyPromise = masElement.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);
  if (success === 'timeout') {
    log.error(`${masElement.tagName} did not initialize withing give timeout`);
  } else if (!success) {
    const { env } = getConfig();
    if (env.name !== 'prod') {
      masElement.prepend(createTag('div', { }, 'Failed to load. Please check your VPN connection.'));
    }
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
  const attrs = { fragment: options.fragment };
  if (seenFragments.has(options.fragment)) attrs.loading = 'cache';
  seenFragments.add(options.fragment);
  const aemFragment = createTag('aem-fragment', attrs);
  const merchCard = createTag('merch-card', { consonant: '', hidden: '' }, aemFragment);
  document.body.appendChild(merchCard);
  await checkReady(merchCard);
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
  const attrs = { fragment: options.fragment };
  if (seenFragments.has(options.fragment)) attrs.loading = 'cache';
  seenFragments.add(options.fragment);
  const aemFragment = createTag('aem-fragment', attrs);
  const merchCard = createTag('merch-card', { consonant: '' }, aemFragment);
  const parent = el.parentElement;
  if (parent && parent.tagName === 'P' && parent.children.length === 1) {
    parent.replaceWith(merchCard);
  } else {
    el.replaceWith(merchCard);
  }
  await checkReady(merchCard);
  await postProcessAutoblock(merchCard, true);
}

/** Replaces an inline fragment link with a mas-field wrapping an aem-fragment. */
async function createInline(el, options) {
  const attrs = { fragment: options.fragment };
  if (seenFragments.has(options.fragment)) attrs.loading = 'cache';
  seenFragments.add(options.fragment);
  const aemFragment = createTag('aem-fragment', attrs);
  const masField = createTag('mas-field', { field: options.field }, aemFragment);
  el.replaceWith(masField);
  await checkReady(masField);
  normalizeBlockFieldWrappers(masField);

  const content = masField.querySelector(':scope > [data-role="mas-field-content"]');
  if (!content) return;

  // Upgrade any plain commerce elements (missing `is`) so the commerce service resolves
  // them. Applies to both CTA (<a>) and price (<span>) fields.
  upgradeCommerceLinks(content);

  // For inline link content (CTAs), replace mas-field with the rendered content so the
  // links sit inside the page's original em/strong wrappers. Then run Milo's decorateButtons
  // using the size and utility classes already applied to sibling buttons by the block
  // (e.g. marquee's button-l and button-justified-mobile).
  if (content.querySelector('a') && !content.querySelector(BLOCK_CONTENT_SELECTOR)) {
    const container = masField.closest('p, div');

    // Read size + utility classes from already-decorated sibling .con-button elements
    // (the block ran decorateButtons on its regular CTAs before our checkReady resolved).
    let siblingBtn = null;
    let searchEl = container?.parentElement;
    while (searchEl && searchEl !== document.body && !siblingBtn) {
      siblingBtn = [...searchEl.querySelectorAll('.con-button')].find((b) => !masField.contains(b));
      if (!siblingBtn) searchEl = searchEl.parentElement;
    }
    let size;
    let utilClasses = [];

    if (siblingBtn) {
      // Sibling authored buttons exist — inherit their exact size and utility classes.
      // If siblings have no size class (e.g. accordion, media), honour that with null.
      size = [...siblingBtn.classList].find((c) => /^button-(s|m|l|xl)$/.test(c)) ?? null;
      utilClasses = [...siblingBtn.classList].filter((c) => c.startsWith('button-') && c !== size);
    } else {
      // No sibling reference yet — block ran decorateButtons before our checkReady resolved.
      // Derive size from the block's own classes, mirroring each block's decorateButtons call.
      let blockEl = container?.parentElement;
      while (blockEl?.parentElement && !blockEl.parentElement.classList.contains('section')
        && blockEl.parentElement !== document.body) {
        blockEl = blockEl.parentElement;
      }
      // Explicit *-button variation class (hero-marquee/notification: 'xl-button' → 'button-xl')
      const btnVariant = [...(blockEl?.classList ?? [])].find((c) => c.endsWith('-button'));
      if (btnVariant) {
        size = `button-${btnVariant.split('-')[0]}`;
      } else if (blockEl?.classList.contains('hero-marquee')) {
        size = 'button-xl'; // hero-marquee always defaults to button-xl
      } else if (blockEl?.classList.contains('accordion') || blockEl?.classList.contains('media')) {
        size = null; // these blocks call decorateButtons with no size
      } else {
        const blockSize = getBlockSize(blockEl ?? container);
        size = (blockSize === 'large' || blockSize === 'xlarge') ? 'button-xl' : 'button-l';
      }
    }
    masField.replaceWith(...[...content.childNodes]);

    // Defer decorateButtons until the last CTA mas-field in this container has been
    // replaced. If decorateButtons ran while another mas-field was still in the DOM,
    // it would find the checkout link inside that pending mas-field via 'strong a'/'em a'
    // but with the wrong parentElement (the content span, not strong/em), causing the
    // wrong button type and breaking the pending mas-field's content span.
    const pendingCTAs = container?.querySelectorAll('em > mas-field, strong > mas-field');
    if (container && !pendingCTAs?.length) {
      decorateButtons(container, size);
      if (utilClasses.length) {
        container.querySelectorAll('.con-button').forEach((b) => utilClasses.forEach((c) => b.classList.add(c)));
      }
    }
  }
}

export default async function init(el) {
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
