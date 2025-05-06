import { createTag } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import '../../deps/mas/merch-quantity-select.js';
import { initService, getMasPreview, getOptions, overrideOptions } from '../merch/merch.js';

const CARD_AUTOBLOCK_TIMEOUT = 5000;
let log;

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), CARD_AUTOBLOCK_TIMEOUT);
  });
}

async function loadDependencies() {
  /** Load service first */
  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }
  const service = await servicePromise;
  log = service.Log.module('merch-card');
}

export async function checkReady(masElement) {
  const readyPromise = masElement.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);
  if (success === 'timeout') {
    log.error(`${masElement.tagName} did not initialize withing give timeout`);
  } else if (!success) {
    log.error(`${masElement.tagName} failed to initialize`);
  }
}

export async function createCard(el, options) {
  const aemFragment = createTag('aem-fragment', { fragment: options.fragment });
  const preview = getMasPreview();
  if (preview) {
    aemFragment.setAttribute('preview', preview);
  }
  const merchCard = createTag('merch-card', { consonant: '' }, aemFragment);
  el.replaceWith(merchCard);
  await checkReady(merchCard);
}

export default async function init(el) {
  let options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;
  options = overrideOptions(fragment, options);
  await loadDependencies();
  await createCard(el, options);
}
