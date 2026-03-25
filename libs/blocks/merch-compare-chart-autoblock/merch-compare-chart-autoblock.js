import { createTag, getConfig, loadStyle } from '../../utils/utils.js';
import { postProcessAutoblock } from '../merch/autoblock.js';
import {
  initService,
  getOptions,
  overrideOptions,
  loadMasComponent,
} from '../merch/merch.js';



const MAS_COMPARISON_TABLE = 'mas-comparison-table';
const MAS_TABLE = 'mas-table';

const AUTOBLOCK_TIMEOUT = 5000;
const seenFragments = new Set();
let log;

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), AUTOBLOCK_TIMEOUT);
  });
}

async function loadCoreDependencies() {
  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }
  const service = await servicePromise;
  log = service.Log.module('merch-compare-chart');

  await Promise.all([
    loadMasComponent('aem-fragment'),
    loadMasComponent(MAS_COMPARISON_TABLE),
    loadMasComponent(MAS_TABLE),
  ]);
}

export async function checkReady(masElement) {
  const readyPromise = masElement.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);
  if (success === 'timeout') {
    log.error(`${masElement.tagName} did not initialize within given timeout`);
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

export async function createCompareChart(el, options) {
  const attrs = { fragment: options.fragment };
  if (seenFragments.has(options.fragment)) attrs.loading = 'cache';
  seenFragments.add(options.fragment);
  const aemFragment = createTag('aem-fragment', attrs);
  const table = createTag(MAS_COMPARISON_TABLE, {}, aemFragment);
  const parent = el.parentElement;
  if (parent && parent.tagName === 'P' && hasOnlyTargetContent(parent, el)) {
    parent.replaceWith(table);
  } else {
    el.replaceWith(table);
  }
  await checkReady(table);
  await postProcessAutoblock(table, true);
}

export default async function init(el) {
  const { base } = getConfig();
  loadStyle(`${base}/blocks/comparison-table/comparison-table.css`);
  let options = getOptions(el);
  const { fragment } = options;
  if (!fragment) return;
  options = overrideOptions(fragment, options);
  await loadCoreDependencies();
  await createCompareChart(el, options);
}
