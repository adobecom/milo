import { createTag, getConfig } from '../../utils/utils.js';
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
} from '../merch/merch.js';

const CARD_AUTOBLOCK_TIMEOUT = 5000;
const seenFragments = new Set();
let log;
loadMasComponent(MAS_MERCH_CARD);
loadMasComponent(MAS_MERCH_QUANTITY_SELECT);

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

export default async function init(el) {
  let options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;
  options = overrideOptions(fragment, options);
  await loadCoreDependencies();
  if (options.jsonld) {
    await createJsonLd(el, options);
  } else {
    await createCard(el, options);
  }
}
