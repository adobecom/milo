import { createTag, getConfig } from '../../utils/utils.js';
import {
  getOptions,
  initService,
  loadMasComponent,
  MAS_COMPARE_CHART,
  overrideOptions,
} from '../merch/merch.js';

const COMPARE_CHART_AUTOBLOCK_TIMEOUT = 5000;
const seenFragments = new Set();

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), COMPARE_CHART_AUTOBLOCK_TIMEOUT);
  });
}

function hasOnlyTargetContent(parent, target) {
  if (!parent || !target || target.parentElement !== parent) return false;
  return [...parent.childNodes].every((node) => {
    if (node === target) return true;
    return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
  });
}

async function checkReady(compareChart) {
  const readyPromise = compareChart.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);
  if (success && success !== 'timeout') return;

  const { env } = getConfig();
  if (env.name !== 'prod') {
    compareChart.prepend(createTag('div', { }, 'Failed to load. Please check your VPN connection.'));
  }
}

export async function createCompareChart(el, options) {
  const attrs = { fragment: options.fragment };
  if (seenFragments.has(options.fragment)) attrs.loading = 'cache';
  seenFragments.add(options.fragment);

  const aemFragment = createTag('aem-fragment', attrs);
  const compareChart = createTag(MAS_COMPARE_CHART, { consonant: '' }, aemFragment);
  const paragraph = el.parentElement;
  const toReplace = paragraph?.tagName === 'P' && hasOnlyTargetContent(paragraph, el)
    ? paragraph
    : el;

  toReplace.replaceWith(compareChart);
  await checkReady(compareChart);
}

export default async function init(el) {
  let options = getOptions(el);
  if (!options.fragment) return;

  options = overrideOptions(options.fragment, options);
  await initService();
  await loadMasComponent(MAS_COMPARE_CHART);
  await createCompareChart(el, options);
}
