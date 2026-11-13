import { getPreflightResults } from '../blocks/preflight/checks/preflightApi.js';
import { CHECK_PRIORITIES, PRIORITY, PRIORITY_ORDER, SEVERITY, STATUS } from '../blocks/preflight/checks/constants.js';
import captureMetrics from '../blocks/preflight/checks/captureMetrics.js';
import { clearPageStatusCache } from '../blocks/preflight/checks/adminStatus.js';
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
    clearPageStatusCache();
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

export function snoozePage(path = window.location.pathname, now = Date.now()) {
  const snoozes = Object.fromEntries(Object.entries(readSnoozes())
    .filter(([, until]) => until > now));
  snoozes[path] = now + SNOOZE_MS;
  try {
    localStorage.setItem(SNOOZE_KEY, JSON.stringify(snoozes));
  } catch (e) {
    window.lana?.log?.(`Preflight pop-up snooze not saved: ${e.message}`, { tags: 'preflight' });
  }
}

const isSnoozeTicked = () => !!document.querySelector('.milo-preflight-overlay .notification-snooze input')?.checked;

function dismissNotification() {
  if (isSnoozeTicked()) snoozePage();
  document.querySelector('.milo-preflight-overlay')?.remove();
  wasDismissed = true;
  if (!linkCheckListener) return;
  window.removeEventListener('preflightLinksComplete', linkCheckListener);
  linkCheckListener = null;
}

// Dismiss the notification the moment preflight is opened (via the review link or
// the sidekick plugin) — both routes fire `custom:preflight` on the sidekick.
sidekick?.addEventListener('custom:preflight', dismissNotification);

function createToast() {
  const reviewLink = createTag('button', { class: 'preflight-review-link' }, 'review');
  const closeBtn = createTag('button', { class: 'notification-close', 'aria-label': 'Close' }, '×');
  reviewLink.addEventListener('click', openPreflightPanel);
  closeBtn.addEventListener('click', dismissNotification);
  const message = createTag('span', { class: 'notification-message' }, [
    'Content quality checks are failing. Please ', reviewLink, ' before publishing.',
  ]);
  const content = createTag('div', { class: 'notification-content' }, [message, closeBtn]);
  const notification = createTag('div', { class: 'preflight-notification' }, content);
  return createTag('div', { class: 'milo-preflight-overlay' }, notification);
}

function dismissOrCollapseToToast() {
  if (!isSnoozeTicked()) {
    dismissNotification();
    return;
  }
  snoozePage();
  document.querySelector('.milo-preflight-overlay')?.replaceWith(createToast());
}

function isPreflightOpen() {
  return !!document.getElementById('preflight');
}

const SEO_CHECK_THAT_THREW = { status: STATUS.FAIL, severity: SEVERITY.CRITICAL, title: 'SEO check (could not run)' };
const isFail = (check) => check?.status === STATUS.FAIL;
const isUndecided = (check) => check?.status === STATUS.LIMBO;
const isIssue = (check) => isFail(check) || isUndecided(check);
const issue = (check, key, title, count) => (
  { key, title, count, severity: check.severity, status: check.status });

function listIssues({
  structure = [], content = [], seo = [], merch = [], accessibility = [], performance = [],
  assets = [],
} = {}) {
  const plain = (checks) => checks.filter(isIssue)
    .map((check) => issue(check, check.checkId ?? check.id, check.title));
  const contentIssues = content.filter(isIssue).map((check) => issue(
    check,
    check.checkId,
    check.title,
    isFail(check) ? check.details?.items?.length : undefined,
  ));
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
  return [...plain(structure), ...contentIssues, ...plain(seo), ...aggregates,
    ...plain(performance), ...assetIssues];
}

const priorityOf = (found) => {
  if (isUndecided(found)) return PRIORITY.NORMAL;
  return CHECK_PRIORITIES[found.key]
    ?? (found.severity === SEVERITY.CRITICAL ? PRIORITY.CRITICAL : PRIORITY.NORMAL);
};

export function groupByPriority(runChecks) {
  const issues = listIssues(runChecks);
  return PRIORITY_ORDER.map((level) => ({
    level,
    items: issues.filter((item) => priorityOf(item) === level)
      .map(({ title, count }) => (count ? `${title} (${count})` : title)),
  })).filter(({ items }) => items.length);
}

const settle = (check) => Promise.resolve(check).catch(() => SEO_CHECK_THAT_THREW);
const nextTick = () => new Promise((resolve) => { setTimeout(resolve); });
const settledOrSkipped = (check) => Promise.race([settle(check), nextTick()]);

async function resolveSeo(runChecks, { skipPending = false } = {}) {
  const seo = await Promise.all((runChecks.seo ?? []).map(skipPending ? settledOrSkipped : settle));
  return { ...runChecks, seo: seo.filter(Boolean) };
}

export async function hasSettledIssues(runChecks = {}) {
  return listIssues(await resolveSeo(runChecks, { skipPending: true })).some(isFail);
}

function renderIssueGroups(container, runChecks) {
  if (!container.isConnected) return;
  container.replaceChildren(...groupByPriority(runChecks).map(({ level, items }) => createTag(
    'p',
    { class: `notification-group is-${level.toLowerCase()}` },
    [createTag('strong', null, `${level}:`), ` ${items.join(' · ')}`],
  )));
}

async function addIssueGroups(container, runChecks) {
  renderIssueGroups(container, await resolveSeo(runChecks, { skipPending: true }));
  renderIssueGroups(container, await resolveSeo(runChecks));
}

async function createPreflightNotification(results) {
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) return;
  // The modal already surfaces the results, so don't also show the notification.
  if (isPreflightOpen()) return;
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/styles/preflight-notification.css`);
  if (isPageSnoozed()) {
    document.body.append(createToast());
    return;
  }

  const title = createTag('p', { id: 'preflight-popup-title', class: 'notification-title' }, 'Preflight found issues on this page');
  const message = createTag('p', { id: 'preflight-popup-message', class: 'notification-message' }, 'Please review before publishing.');

  const issues = createTag('div', { class: 'notification-issues' });
  const reviewBtn = createTag('button', { class: 'notification-review' }, 'Review issues');
  const dismissBtn = createTag('button', { class: 'notification-dismiss' }, 'Dismiss');
  reviewBtn.addEventListener('click', openPreflightPanel);
  dismissBtn.addEventListener('click', dismissOrCollapseToToast);

  const snooze = createTag('label', { class: 'notification-snooze' }, [
    createTag('input', { type: 'checkbox' }),
    "Don't show again for 24 hours on this page",
  ]);

  const content = createTag('div', { class: 'notification-content' }, [
    title,
    message,
    issues,
    createTag('div', { class: 'notification-actions' }, [snooze, dismissBtn, reviewBtn]),
  ]);
  const notification = createTag('div', {
    class: 'preflight-notification',
    role: 'dialog',
    'aria-labelledby': title.id,
    'aria-describedby': message.id,
  }, content);
  notification.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismissOrCollapseToToast();
  });
  const isFocusFree = !document.activeElement || document.activeElement === document.body;
  document.body.append(createTag('div', { class: 'milo-preflight-overlay preflight-popup' }, notification));
  if (isFocusFree) reviewBtn.focus({ preventScroll: true });
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
