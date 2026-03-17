import { createTag, getConfig } from '../../utils/utils.js';
import { postProcessAutoblock } from '../merch/autoblock.js';
import {
  initService,
  getOptions,
  overrideOptions,
  loadMasComponent,
  MAS_MERCH_CARD,
  MAS_MERCH_QUANTITY_SELECT,
  MAS_FIELD,
} from '../merch/merch.js';

const CARD_AUTOBLOCK_TIMEOUT = 5000;
const MILO_TYPO_CLASS_PATTERN = /^(heading|body|detail|title)-[a-z0-9-]+$/i;
const seenFragments = new Set();
let log;
loadMasComponent(MAS_MERCH_CARD);
loadMasComponent(MAS_MERCH_QUANTITY_SELECT);

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6';
const BLOCK_CONTENT_SELECTOR = `${HEADING_SELECTOR}, p, div, ul, ol, table, blockquote, pre, figure, section, article, hr`;
const INLINE_WRAPPER_SELECTOR = 'strong, em, span, b, i, u, small, mark';

function stripMiloTypoClassesFromElement(el) {
  if (!el?.classList?.length) return;
  const toRemove = [...el.classList].filter((c) => MILO_TYPO_CLASS_PATTERN.test(c));
  toRemove.forEach((c) => el.classList.remove(c));
}

function stripMasFieldMiloClasses(masField) {
  stripMiloTypoClassesFromElement(masField.parentElement);
  const root = masField.shadowRoot ?? masField;
  root.querySelectorAll('[class]').forEach((el) => {
    if (el.hasAttribute?.('data-mas-field-preserve-classes')) return;
    stripMiloTypoClassesFromElement(el);
  });
}

function observeMasFieldForStyles(masField) {
  function strip() {
    stripMasFieldMiloClasses(masField);
  }
  strip();
  const root = masField.shadowRoot ?? masField;
  const parentObserver = new MutationObserver(strip);
  const parent = masField.parentElement;
  if (parent) {
    parentObserver.observe(parent, { attributes: true, attributeFilter: ['class'] });
    setTimeout(() => parentObserver.disconnect(), 5000);
  }
  const rootObserver = new MutationObserver(strip);
  rootObserver.observe(root, { childList: true, subtree: true });
  setTimeout(() => rootObserver.disconnect(), 3000);
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
      innerHeading.setAttribute('data-mas-field-preserve-classes', '');
    }
  }

  if (parent.matches('p') || parent.matches(HEADING_SELECTOR)) {
    parent.replaceWith(masField);
  }
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
  // mas-field listens for aem:load from aem-fragment and renders the field content.
  const masField = createTag('mas-field', { field: options.field }, aemFragment);
  const parent = el.parentElement;
  const isWrappedInParagraph = parent?.tagName === 'P';
  const isOnlyChild = parent?.children.length === 1;
  const hasNoSurroundingText = parent?.textContent.trim() === el.textContent.trim();
  if (isWrappedInParagraph && isOnlyChild && hasNoSurroundingText) {
    parent.replaceWith(masField); // remove empty <p>, replace with mas-field
  } else {
    el.replaceWith(masField); // keep <p> and surrounding text, replace only the link
  }
  await checkReady(masField);
  normalizeBlockFieldWrappers(masField);
  observeMasFieldForStyles(masField);
}

export default async function init(el) {
  let options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;
  options = overrideOptions(fragment, options);
  await loadCoreDependencies();
  if (options.field) {
    await loadInlineDependencies();
    await createInline(el, options);
  } else {
    await createCard(el, options);
  }
}
