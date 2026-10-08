import { getIssueCounts } from '../../blocks/preflight/checks/issueCounts.js';
import { clearPreflightCache } from '../../blocks/preflight/checks/preflightApi.js';
import { clearLocalizationCache } from '../../blocks/preflight/checks/localization.js';
import { setLikelyLcp } from '../../blocks/preflight/checks/performance.js';
import { createTag, getConfig, loadBlock, loadStyle, MILO_EVENTS } from '../../utils/utils.js';

const MERCH_HYDRATION_MS = 1000;
const RENDER_TIMEOUT_MS = 5000;
const DA_CURSOR = '#da-cursor-position';
const CHECKING = { status: 'checking', text: 'Preflight is checking this page…' };
const FAILED = { status: 'error', text: 'Preflight checks could not run' };
const BAR = `<div class="preflight-notification"><div class="notification-content">
  <span class="notification-message" role="status"></span>
  <button type="button" class="preflight-review-link">Review</button>
  <button type="button" class="notification-close" aria-label="Close">×</button>
</div></div>`;

let started = false;

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function summarize(counts) {
  const tabs = Object.values(counts);
  const errors = tabs.reduce((sum, tab) => sum + tab.errors, 0);
  const warnings = tabs.reduce((sum, tab) => sum + tab.warnings, 0);
  if (!errors && !warnings) return { status: 'pass', text: 'Preflight: no issues' };
  const found = [errors && plural(errors, 'issue'), warnings && plural(warnings, 'warning')];
  return { status: errors ? 'fail' : 'warn', text: `Preflight found ${found.filter(Boolean).join(', ')}` };
}

const isLoaded = (el) => !el || ((el.classList.contains('ready')
  || el.dataset.blockStatus === 'loaded') && el.textContent.trim());
const headerAndFooterLoaded = () => isLoaded(document.querySelector('header'))
  && isLoaded(document.querySelector('footer'));

function waitForHeaderAndFooter() {
  let observer;
  return new Promise((resolve) => {
    observer = new MutationObserver(() => headerAndFooterLoaded() && resolve());
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    setTimeout(resolve, RENDER_TIMEOUT_MS);
    if (headerAndFooterLoaded()) resolve();
  }).finally(() => observer.disconnect());
}

const keepAcrossEdits = (...elements) => document.documentElement.append(...elements);

function draftContent() {
  const main = document.querySelector('main')?.cloneNode(true);
  main?.querySelector(DA_CURSOR)?.remove();
  return main?.innerHTML ?? '';
}

const loadReport = () => loadBlock(createTag('div', { class: 'preflight' }));

async function openReport() {
  const [content, { getModal }] = await Promise.all([loadReport(), import('../../blocks/modal/modal.js')]);
  const dialog = await getModal(null, { id: 'preflight', content, closeEvent: 'closeModal' });
  const curtain = dialog.nextElementSibling;
  keepAcrossEdits(dialog, curtain);
}

export default function showDraftStatus() {
  if (started) return;
  started = true;
  loadStyle(`${getConfig().base}/styles/preflight-notification.css`);
  const bar = createTag('div', { class: 'milo-preflight-overlay draft-status' }, BAR);
  const message = bar.querySelector('.notification-message');
  const show = ({ status, text }) => {
    bar.dataset.status = status;
    message.textContent = text;
  };
  let checkedDraft;
  let latestCheck = 0;

  async function check() {
    const draft = draftContent();
    if (draft === checkedDraft) return;
    checkedDraft = draft;
    latestCheck += 1;
    const thisCheck = latestCheck;
    await waitForHeaderAndFooter();
    clearPreflightCache();
    clearLocalizationCache();
    setLikelyLcp();
    const counts = await getIssueCounts({ merchDelayMs: MERCH_HYDRATION_MS })
      .catch(() => null);
    if (thisCheck !== latestCheck) return;
    show(counts ? summarize(counts) : FAILED);
    const report = document.querySelector('#preflight .preflight');
    if (report) report.replaceWith(await loadReport());
  }

  bar.querySelector('.preflight-review-link').addEventListener('click', openReport);
  bar.querySelector('.notification-close').addEventListener('click', () => {
    bar.remove();
    document.removeEventListener(MILO_EVENTS.DEFERRED, check);
  });
  document.addEventListener(MILO_EVENTS.DEFERRED, check);
  keepAcrossEdits(bar);
  show(CHECKING);
  check();
}
