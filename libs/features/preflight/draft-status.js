import { getIssueCounts } from '../../blocks/preflight/checks/issueCounts.js';
import { clearPreflightCache } from '../../blocks/preflight/checks/preflightApi.js';
import { clearLocalizationCache } from '../../blocks/preflight/checks/localization.js';
import { setLikelyLcp } from '../../blocks/preflight/checks/performance.js';
import { render } from '../../deps/htm-preact.js';
import { createTag, getConfig, loadBlock, loadStyle, MILO_EVENTS } from '../../utils/utils.js';
import { debounce } from '../../utils/action.js';

const MERCH_HYDRATION_MS = 1000;
const HEADER_FOOTER_TIMEOUT_MS = 5000;
export const RECHECK_DEBOUNCE_MS = 1000;
const DA_CURSOR = '#da-cursor-position';
const CHECKING = { status: 'checking', text: 'Preflight is checking this page…' };
const FAILED = { status: 'error', text: 'Preflight checks could not run' };
const BAR = `<div class="preflight-notification"><div class="notification-content">
  <span class="notification-message" role="status"></span>
  <button type="button" class="preflight-review-link">Review</button>
  <button type="button" class="notification-close" aria-label="Close">×</button>
</div></div>`;

let bar;
let checkedDraft;
let reportOpening;

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function summarize(counts) {
  const tabs = Object.values(counts);
  const errors = tabs.reduce((sum, tab) => sum + tab.errors, 0);
  const warnings = tabs.reduce((sum, tab) => sum + tab.warnings, 0);
  if (!errors && !warnings) return { status: 'pass', text: 'Preflight: no issues' };
  const found = [errors && plural(errors, 'issue'), warnings && plural(warnings, 'warning')];
  return { status: errors ? 'fail' : 'warn', text: `Preflight found ${found.filter(Boolean).join(', ')}` };
}

const isRenderedOrMissing = (block) => !block
  || (block.dataset.blockStatus === 'loaded' && block.textContent.trim());
const headerAndFooterRendered = () => ['header', 'footer']
  .every((tag) => isRenderedOrMissing(document.querySelector(tag)));

function waitForHeaderAndFooter() {
  let observer;
  return new Promise((resolve) => {
    observer = new MutationObserver(() => headerAndFooterRendered() && resolve());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    setTimeout(resolve, HEADER_FOOTER_TIMEOUT_MS);
    if (headerAndFooterRendered()) resolve();
  }).finally(() => observer.disconnect());
}

function draftWithoutCursor() {
  const main = document.querySelector('main').cloneNode(true);
  main.querySelector(`span${DA_CURSOR}`)?.remove();
  main.querySelector(DA_CURSOR)?.removeAttribute('id');
  return main.innerHTML;
}

const logFailure = (e) => window.lana?.log?.(`Preflight draft status failed: ${e}`, { tags: 'preflight' });

const keepAcrossEdits = (...elements) => document.documentElement.append(...elements);

async function clearDataKeptFromPreviousReport() {
  const [{ resetContent }, { resetAltAudit }] = await Promise.all([
    import('../../blocks/preflight/panels/general.js'),
    import('../../blocks/preflight/accessibility/audit-image-alt-text.js'),
  ]);
  resetContent();
  resetAltAudit();
}

async function loadReport() {
  await clearDataKeptFromPreviousReport();
  return loadBlock(createTag('div', { class: 'preflight' }));
}

async function openReport() {
  const [content, { getModal }] = await Promise.all([loadReport(), import('../../blocks/modal/modal.js')]);
  const dialog = await getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
  const curtain = dialog.nextElementSibling;
  keepAcrossEdits(dialog, curtain);
}

function openReportOnce() {
  if (reportOpening || document.getElementById('preflight')) return;
  reportOpening = openReport().catch(logFailure).finally(() => { reportOpening = undefined; });
}

async function refreshOpenReport() {
  const report = document.querySelector('#preflight .preflight');
  if (!report) return;
  const freshReport = await loadReport();
  if (!report.isConnected) {
    render(null, freshReport);
    return;
  }
  render(null, report);
  report.replaceWith(freshReport);
}

function show({ status, text }) {
  bar.dataset.status = status;
  bar.querySelector('.notification-message').textContent = text;
}

async function check() {
  if (!bar.isConnected) return;
  const draft = draftWithoutCursor();
  if (draft === checkedDraft) return;
  checkedDraft = draft;
  await waitForHeaderAndFooter();
  clearPreflightCache();
  clearLocalizationCache();
  const counts = await getIssueCounts({ merchDelayMs: MERCH_HYDRATION_MS })
    .catch((e) => { logFailure(e); checkedDraft = undefined; });
  show(counts ? summarize(counts) : FAILED);
  await refreshOpenReport();
}

let checking = Promise.resolve();
const runCheck = () => { checking = checking.then(check).catch(logFailure); };
const recheck = debounce(runCheck, RECHECK_DEBOUNCE_MS);
const LISTEN_TO_NON_BUBBLING = true;
const isFragment = (area) => area.matches?.('main *');
const checkAfterEdits = ({ target }) => {
  if (!isFragment(target)) recheck();
};

function close() {
  bar.remove();
  document.removeEventListener(MILO_EVENTS.DEFERRED, checkAfterEdits, LISTEN_TO_NON_BUBBLING);
}

export default function showDraftStatus() {
  if (bar) return;
  loadStyle(`${getConfig().base}/styles/preflight-notification.css`);
  bar = createTag('div', { class: 'milo-preflight-overlay draft-status' }, BAR);
  bar.querySelector('.preflight-review-link').addEventListener('click', openReportOnce);
  bar.querySelector('.notification-close').addEventListener('click', close);
  document.addEventListener(MILO_EVENTS.DEFERRED, checkAfterEdits, LISTEN_TO_NON_BUBBLING);
  keepAcrossEdits(bar);
  setLikelyLcp();
  show(CHECKING);
  runCheck();
}
