import { createTag, getConfig } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import '../../deps/mas/merch-quantity-select.js';
import { postProcessAutoblock } from '../merch/autoblock.js';
import {
  initService,
  getOptions,
  overrideOptions,
  loadLitDependency,
  loadMasComponent,
  MAS_MERCH_CARD,
  MAS_MERCH_QUANTITY_SELECT,
} from '../merch/merch.js';

const CARD_AUTOBLOCK_TIMEOUT = 5000;
let log;

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), CARD_AUTOBLOCK_TIMEOUT);
  });
}

async function loadDependencies() {
  /** Load lit first as it's needed by MAS components */
  await loadLitDependency();

  /** Load service */
  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }
  const service = await servicePromise;
  log = service.Log.module('merch-card');

  /** Load required MAS components */
  await Promise.all([
    loadMasComponent(MAS_MERCH_CARD),
    loadMasComponent(MAS_MERCH_QUANTITY_SELECT),
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
  // If the element is wrapped in a <p> tag, replace the parent instead to simplify the DOM
  const parent = el.parentElement;
  if (parent && parent.tagName === 'P' && parent.children.length === 1) {
    parent.replaceWith(merchCard);
  } else {
    el.replaceWith(merchCard);
  }
  await checkReady(merchCard);
  await postProcessAutoblock(merchCard, true);
}

export default async function init(el) {
  let options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;
  options = overrideOptions(fragment, options);
  await loadDependencies();
  await createCard(el, options);
}
