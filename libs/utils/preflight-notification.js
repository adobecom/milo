import { getPreflightResults } from '../blocks/preflight/checks/preflightApi.js';
import { CHECK_PRIORITIES, PRIORITY, PRIORITY_ORDER, SEVERITY, STATUS } from '../blocks/preflight/checks/constants.js';
import captureMetrics from '../blocks/preflight/checks/captureMetrics.js';
import { createTag, loadStyle, getConfig } from './utils.js';

let wasDismissed = false;
let sidekickObserver;
let linkCheckListener;
const sidekick = document.querySelector('aem-sidekick, helix-sidekick');
function openPreflightPanel() {
  if (!sidekick) return;
  sidekick.dispatchEvent(new CustomEvent('custom:preflight', { bubbles: true }));
}

['previewed', 'published'].forEach((event) => {
  sidekick?.addEventListener(event, async () => {
    const results = await getPreflightResults({
      url: window.location.href,
      area: document,
      useCache: false,
    }).catch(() => null);
    if (!results) return;
    window.hasCapturedPreflightMetrics = false;
    captureMetrics(results.runChecks).catch((e) => window.lana?.log?.(`Preflight metrics capture failed: ${e}`, { tags: 'preflight' }));
  });
});

const SNOOZE_KEY = 'milo-preflight-popup-snooze';
const SNOOZE_MS = 24 * 60 * 60 * 1000;

function readSnoozes() {
  try {
    return JSON.parse(localStorage.getItem(SNOOZE_KEY)) || {};
  } catch {
    return {};
  }
}

export function isPageSnoozed(path = window.location.pathname) {
  return readSnoozes()[path] > Date.now();
}

// Per page and time-bound: editing a page doesn't nag, but no page is silenced for good.
export function snoozePage(path = window.location.pathname, now = Date.now()) {
  const snoozes = Object.fromEntries(Object.entries(readSnoozes())
    .filter(([, until]) => until > now));
  snoozes[path] = now + SNOOZE_MS;
  try {
    localStorage.setItem(SNOOZE_KEY, JSON.stringify(snoozes));
  } catch {
    // Storage blocked: the pop-up simply shows again next time.
  }
}

function dismissNotification() {
  if (document.querySelector('.milo-preflight-overlay .notification-snooze input')?.checked) snoozePage();
  document.querySelector('.milo-preflight-overlay')?.remove();
  wasDismissed = true;
  if (!linkCheckListener) return;
  window.removeEventListener('preflightLinksComplete', linkCheckListener);
  linkCheckListener = null;
}

// Dismiss the notification the moment preflight is opened (via the review link or
// the sidekick plugin) — both routes fire `custom:preflight` on the sidekick.
sidekick?.addEventListener('custom:preflight', dismissNotification);

function getMasUnpublishedCount(results) {
  const merchResults = results?.runChecks?.merch || [];
  return merchResults.reduce((sum, check) => {
    if (check?.status !== 'fail') return sum;
    return sum + (check.details?.unpublished?.length || 0);
  }, 0);
}

function isPreflightOpen() {
  return !!document.getElementById('preflight');
}

// Stands in for an SEO check that threw (usually the network link check).
const failedCheck = { status: STATUS.FAIL, severity: SEVERITY.CRITICAL, title: 'SEO check (could not run)' };
const isFail = (check) => check?.status === STATUS.FAIL;
// Limbo shows as a warning in the panel, so it counts here too.
const isIssue = (check) => isFail(check) || check?.status === STATUS.LIMBO;
const issue = (check, key, title, count) => (
  { key, title, count, severity: check.severity, status: check.status });

// Tab order (General, SEO, M@S, Accessibility, Performance, Assets), matching countIssues.
function listIssues({
  structure = [], seo = [], merch = [], accessibility = [], performance = [], assets = [],
} = {}) {
  const plain = (checks) => checks.filter(isIssue)
    .map((check) => issue(check, check.checkId ?? check.id, check.title));
  const aggregates = [
    ...merch.filter(isFail).map((check) => issue(
      check,
      check.checkId ?? check.name,
      check.title ?? check.name,
      (check.details?.unpublished ?? check.details?.prices)?.length,
    )),
    ...accessibility.filter((check) => isFail(check) && check.details?.issuesCount > 0)
      .map((check) => issue(check, check.checkId, check.title, check.details.issuesCount)),
  ];
  const assetIssues = assets.flatMap((check) => {
    const { criticalAssetFailures = [], warningAssetFailures = [] } = check?.details || {};
    return [
      issue(check, 'image-dimensions-above-fold', `${check.title} above the fold`, criticalAssetFailures.length),
      issue(check, 'image-dimensions-below-fold', `${check.title} below the fold`, warningAssetFailures.length),
    ].filter(({ count }) => count > 0);
  });
  return [...plain(structure), ...plain(seo), ...aggregates, ...plain(performance),
    ...assetIssues];
}

// Limbo means the check couldn't decide (e.g. link service unreachable); the panel shows it
// as a warning, so it never outranks Normal here.
const priorityOf = ({ key, severity, status }) => {
  if (status === STATUS.LIMBO) return PRIORITY.NORMAL;
  return CHECK_PRIORITIES[key]
    ?? (severity === SEVERITY.CRITICAL ? PRIORITY.CRITICAL : PRIORITY.NORMAL);
};

// Failing check titles per priority level, Blocker first; empty levels are dropped.
export function groupByPriority(runChecks) {
  const issues = listIssues(runChecks);
  return PRIORITY_ORDER.map((level) => ({
    level,
    items: issues.filter((item) => priorityOf(item) === level)
      .map(({ title, count }) => (count ? `${title} (${count})` : title)),
  })).filter(({ items }) => items.length);
}

const settle = (check) => Promise.resolve(check).catch(() => failedCheck);
// Pending SEO checks (the network link check) are skipped so they can't hold the pop-up back.
const settleNow = (check) => Promise.race([settle(check), new Promise((r) => { setTimeout(r); })]);

async function resolveSeo(runChecks, now) {
  const seo = await Promise.all((runChecks.seo ?? []).map(now ? settleNow : settle));
  return { ...runChecks, seo: seo.filter(Boolean) };
}

// Every level counts; preflightLinksComplete reports link failures that land later.
export async function hasSettledIssues(runChecks = {}) {
  return groupByPriority(await resolveSeo(runChecks, true)).length > 0;
}

function renderIssueGroups(container, runChecks) {
  if (!container.isConnected) return;
  container.replaceChildren(...groupByPriority(runChecks).map(({ level, items }) => createTag(
    'p',
    { class: `notification-group is-${level.toLowerCase()}` },
    [createTag('strong', null, `${level}:`), ` ${items.join(' · ')}`],
  )));
}

// Ranks the run that triggered the pop-up instead of re-running Preflight: what has
// settled now, then again once the slow link check lands.
// shortcut: skips the page-wide localization link scan, so Links can be missing
// here while the panel flags it; add it only if authors need the exact list.
async function addIssueGroups(container, runChecks) {
  renderIssueGroups(container, await resolveSeo(runChecks, true));
  renderIssueGroups(container, await resolveSeo(runChecks));
}

async function createPreflightNotification(results) {
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) return;
  // The modal already surfaces the results, so don't also show the notification.
  if (isPreflightOpen() || isPageSnoozed()) return;
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/styles/preflight-notification.css`);

  const masUnpublishedCount = getMasUnpublishedCount(results);
  const title = createTag('p', { id: 'preflight-popup-title', class: 'notification-title' }, 'Preflight found issues on this page');
  const message = createTag('p', { id: 'preflight-popup-message', class: 'notification-message' }, 'Please review before publishing.');

  if (masUnpublishedCount > 0) {
    const masLine = createTag('span', { class: 'notification-mas-line' });
    masLine.textContent = `M@S: ${masUnpublishedCount} unpublished fragment${masUnpublishedCount === 1 ? '' : 's'} on this page.`;
    message.append(createTag('br'), masLine);
  }

  const issues = createTag('div', { class: 'notification-issues' });
  const reviewBtn = createTag('button', { class: 'notification-review' }, 'Review issues');
  const dismissBtn = createTag('button', { class: 'notification-dismiss' }, 'Dismiss');
  reviewBtn.addEventListener('click', openPreflightPanel);
  dismissBtn.addEventListener('click', dismissNotification);

  const snooze = createTag('label', { class: 'notification-snooze' }, [
    createTag('input', { type: 'checkbox' }),
    "Don't show again today for this page",
  ]);

  const content = createTag('div', { class: 'notification-content' }, [
    title,
    message,
    issues,
    createTag('div', { class: 'notification-actions' }, [snooze, dismissBtn, reviewBtn]),
  ]);
  const notification = createTag('div', {
    class: 'preflight-notification',
    role: 'alertdialog',
    'aria-labelledby': title.id,
    'aria-describedby': message.id,
  }, content);
  notification.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismissNotification();
  });
  // Don't pull focus away from something the author is already using.
  const isFocusFree = !document.activeElement || document.activeElement === document.body;
  document.body.append(createTag('div', { class: 'milo-preflight-overlay preflight-popup' }, notification));
  if (isFocusFree) reviewBtn.focus();
  await addIssueGroups(issues, results?.runChecks ?? {});
}

function setupLinkCheckListener(results) {
  if (linkCheckListener) return;

  linkCheckListener = async (event) => {
    const { hasFailures } = event.detail;

    if (hasFailures && !wasDismissed) {
      const existingNotification = document.querySelector('.milo-preflight-overlay');
      const isPublishButtonDisabled = sidekick?.shadowRoot
        ?.querySelector('plugin-action-bar')?.shadowRoot
        ?.querySelector('sk-action-button.publish[disabled]');

      if (!existingNotification && !isPublishButtonDisabled) {
        await createPreflightNotification(results);
      }
    }
  };

  window.addEventListener('preflightLinksComplete', linkCheckListener, { once: true });
}

function createObserver() {
  if (sidekickObserver) return;
  sidekickObserver = new MutationObserver(async () => {
    if (wasDismissed || !sidekick) return;
    if (sidekick.getAttribute('open') !== 'true') {
      document.querySelector('.milo-preflight-overlay')?.remove();
      return;
    }

    const results = await getPreflightResults({
      url: window.location.href,
      area: document,
    }).catch(() => null);
    if (results && await hasSettledIssues(results.runChecks)) {
      await createPreflightNotification(results);
    }
  });

  sidekickObserver.observe(sidekick, {
    attributes: true,
    attributeFilter: ['open'],
  });
}

export default async function show() {
  const preflightPromise = getPreflightResults({
    url: window.location.href,
    area: document,
  }).catch(() => null);

  if (wasDismissed || document.querySelector('.milo-preflight-overlay')) return;

  const isPublishButtonDisabled = sidekick?.shadowRoot
    ?.querySelector('plugin-action-bar')?.shadowRoot
    ?.querySelector('sk-action-button.publish[disabled]');

  if (isPublishButtonDisabled) return;

  createObserver();
  if (sidekick && sidekick.getAttribute('open') !== 'true') return;

  const results = await preflightPromise;

  if (!results) return;

  if (await hasSettledIssues(results.runChecks)) {
    await createPreflightNotification(results);
  } else {
    setupLinkCheckListener(results);
  }
}
