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
let log;
loadMasComponent(MAS_MERCH_CARD);
loadMasComponent(MAS_MERCH_QUANTITY_SELECT);
loadMasComponent(MAS_FIELD);

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), CARD_AUTOBLOCK_TIMEOUT);
  });
}

async function loadDependencies() {
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
    loadMasComponent(MAS_FIELD),
  ]);
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

export async function createCard(el, options) {
  const aemFragment = createTag('aem-fragment', { fragment: options.fragment });
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
  const aemFragment = createTag('aem-fragment', { fragment: options.fragment });
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
}

export default async function init(el) {
  let options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;
  options = overrideOptions(fragment, options);
  await loadDependencies();
  if (options.field) {
    await createInline(el, options);
  } else {
    await createCard(el, options);
  }
}
