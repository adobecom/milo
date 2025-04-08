import { createTag } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import '../../deps/mas/merch-quantity-select.js';
import { initService } from '../merch/merch.js';

const CARD_AUTOBLOCK_TIMEOUT = 5000;
let log;

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(false), CARD_AUTOBLOCK_TIMEOUT);
  });
}

export function getOptions(el) {
  const { hash } = new URL(el.href);
  const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(hashValue);
  const options = {};
  for (const [key, value] of searchParams.entries()) {
    if (key === 'fragment' || key === 'query') options.fragment = value;
  }
  return options;
}

async function loadDependencies() {
  /** Load service first */
  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }
  const service = await servicePromise;
  log = service.Log.module('merch');
}

export async function checkReady(masElement) {
  const readyPromise = masElement.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);

  if (!success) {
    log.error(`${masElement.tagName} did not initialize withing give timeout`);
  }
}

export async function createCard(el, options) {
  const aemFragment = createTag('aem-fragment', { fragment: options.fragment });
  const merchCard = createTag('merch-card', { consonant: '' }, aemFragment);
  el.replaceWith(merchCard);
  await checkReady(merchCard);
}

export default async function init(el) {
  const options = getOptions(el);
  if (!options.fragment) return;
  await loadDependencies();
  await createCard(el, options);
}
