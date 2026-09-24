import { createTag, getConfig, loadStyle, raceForegroundTimeout } from '../../utils/utils.js';
import {
  getOptions,
  initService,
  createAemFragment,
  loadMasComponent,
  MAS_MERCH_CARD,
  overrideOptions,
} from '../merch/merch.js';

loadMasComponent(MAS_MERCH_CARD);

const MAS_COMPARE_CHART = 'mas-compare-chart';
const COMPARE_CHART_AUTOBLOCK_TIMEOUT = 5000;
const seenFragments = new Set();
let stylesLoaded;

function hasOnlyTargetContent(parent, target) {
  if (!parent || !target || target.parentElement !== parent) return false;
  return [...parent.childNodes].every((node) => {
    if (node === target) return true;
    return node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '';
  });
}

async function checkReady(compareChart) {
  // Foreground-time budget: a frozen webview must not burn the deadline while suspended
  // and report a timeout the moment it resumes.
  const success = await raceForegroundTimeout(
    compareChart.checkReady(),
    COMPARE_CHART_AUTOBLOCK_TIMEOUT,
  );
  if (success && success !== 'timeout') return;

  const service = await initService();
  const log = service.Log.module('mas-compare-chart-autoblock');
  if (success === 'timeout') {
    log.error(`${compareChart.tagName} did not initialize within given timeout`);
  } else {
    log.error(`${compareChart.tagName} failed to initialize`);
  }

  const { env } = getConfig();
  if (env.name !== 'prod') {
    compareChart.prepend(createTag('div', { }, 'Failed to load. Please check your VPN connection.'));
  }
}

function loadCompareChartStyles() {
  const { base } = getConfig();
  stylesLoaded ||= new Promise((resolve) => {
    loadStyle(`${base}/blocks/mas-compare-chart-autoblock/mas-compare-chart-autoblock.css`, resolve);
  });
  return stylesLoaded;
}

export async function createCompareChart(el, options) {
  const aemFragment = createAemFragment(options, seenFragments);
  const compareChart = createTag(MAS_COMPARE_CHART, { consonant: '' }, aemFragment);
  const paragraph = el.parentElement;
  paragraph.parentElement.className = 'mas-compare-chart-container';
  const toReplace = paragraph?.tagName === 'P' && hasOnlyTargetContent(paragraph, el)
    ? paragraph
    : el;

  compareChart.className = el.className;
  toReplace.replaceWith(compareChart);
  await checkReady(compareChart);
}

export default async function init(el) {
  let options = getOptions(el);
  if (!options.fragment) return;

  options = overrideOptions(options.fragment, options);
  const stylesPromise = loadCompareChartStyles();
  await initService();
  await loadMasComponent(MAS_COMPARE_CHART);
  await stylesPromise;
  await createCompareChart(el, options);
}
