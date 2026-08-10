import { getPreflightResults } from '../blocks/preflight/checks/preflightApi.js';
import captureMetrics from '../blocks/preflight/checks/captureMetrics.js';
import { loadStyle, getConfig } from './utils.js';

let wasDismissed = false;
let sidekickObserver;
let linkCheckListener;
const sidekick = document.querySelector('aem-sidekick, helix-sidekick');
function openPreflightPanel() {
  if (!sidekick) return;
  sidekick.dispatchEvent(new CustomEvent('custom:preflight', { bubbles: true }));
}

function dismissNotification() {
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

export function getDiffChangeCount(results) {
  const details = results?.runChecks?.diff?.[0]?.details || {};
  const content = details.content || { added: [], modified: [], removed: [] };
  const metadata = details.metadata || { added: [], modified: [], removed: [] };
  return content.added.length + content.modified.length + content.removed.length
    + metadata.added.length + metadata.modified.length + metadata.removed.length;
}

export function diffNudgeMessage(count) {
  return `${count} change${count === 1 ? '' : 's'} vs live — compare before publishing.`;
}

// FA #1: highlights appear on the preview page with no author action — and without waiting on the
// sidekick (the nudge needs it; the on-page highlight must not, or it would only show once the
// author opens the sidekick). Computes the diff directly (one live fetch, deferred phase) rather
// than the sidekick-gated preflight suite.
export async function autoHighlightUnpublished() {
  const root = document.querySelector('main');
  if (!root) return;
  try {
    const [{ default: fetchVersions }, { default: computeDiff }] = await Promise.all([
      import('../blocks/preflight/checks/diff/fetchVersions.js'),
      import('../blocks/preflight/checks/diff/computeDiff.js'),
    ]);
    const { content } = computeDiff(await fetchVersions(new URL(window.location.href)));
    if (!content) return;
    // On a bare preview page (no modal) nothing loaded the overlay styles or the c2 --s2a-* tokens
    // they resolve. preflight.js loads both when the modal opens; replicate here: preflight.css for
    // the overlay/label rules + the :root token files for their colors (keep in sync with the
    // C2_TOKENS list in preflight.js). Await all so overlays draw fully styled, no flash.
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    const styles = [
      `${base}/blocks/preflight/preflight.css`,
      `${base}/c2/styles/deps/tokens.primitives.css`,
      `${base}/c2/styles/deps/tokens.primitives.light.css`,
      `${base}/c2/styles/deps/tokens.semantic.light.css`,
    ];
    await Promise.all(styles.map((href) => new Promise((res) => { loadStyle(href, res); })));
    const { autoHighlightOnPage } = await import('../blocks/preflight/panels/diff-onpage.js');
    autoHighlightOnPage(content, root);
  } catch (e) {
    window.lana?.log?.(`[preflight][diff] auto-highlight failed: ${e.message}`, { tags: 'preflight', errorType: 'i' });
  }
}

function isPreflightOpen() {
  return !!document.getElementById('preflight');
}

async function createPreflightNotification(masUnpublishedCount = 0, diffMessage = '') {
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) return;
  // The modal already surfaces the results, so don't also show the notification.
  if (isPreflightOpen()) return;
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/styles/preflight-notification.css`);

  const masLine = masUnpublishedCount > 0
    ? `<br/><span class="notification-mas-line">M@S: ${masUnpublishedCount} unpublished fragment${masUnpublishedCount === 1 ? '' : 's'} on this page.</span>`
    : '';

  // The diff nudge swaps in its own copy but keeps the same review CTA below.
  const message = diffMessage
    ? `${diffMessage} <button class="preflight-review-link">Review</button>`
    : `Content quality checks are failing. Please <button class="preflight-review-link">review</button> before publishing.${masLine}`;

  const overlay = document.createElement('div');
  overlay.className = 'milo-preflight-overlay';
  overlay.innerHTML = `
    <div class="preflight-notification">
      <div class="notification-content">
        <span class="notification-message">
          ${message}
        </span>
        <button class="notification-close">×</button>
      </div>
    </div>
  `;

  const reviewLink = overlay.querySelector('.preflight-review-link');
  reviewLink.addEventListener('click', (e) => {
    e.preventDefault();
    openPreflightPanel();
  });

  const closeBtn = overlay.querySelector('.notification-close');
  closeBtn.addEventListener('click', dismissNotification);

  document.body.appendChild(overlay);
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
    // Diff nudge is preview-only: aem.live stakeholders and a just-synced publish never see it.
    if (event === 'previewed' && window.location.hostname.endsWith('.aem.page')) {
      const diffCount = getDiffChangeCount(results);
      if (diffCount > 0) await createPreflightNotification(0, diffNudgeMessage(diffCount));
    }
  });
});

function setupLinkCheckListener() {
  if (linkCheckListener) return;

  linkCheckListener = async (event) => {
    const { hasFailures } = event.detail;

    if (hasFailures && !wasDismissed) {
      const existingNotification = document.querySelector('.milo-preflight-overlay');
      const isPublishButtonDisabled = sidekick?.shadowRoot
        ?.querySelector('plugin-action-bar')?.shadowRoot
        ?.querySelector('sk-action-button.publish[disabled]');

      if (!existingNotification && !isPublishButtonDisabled) {
        await createPreflightNotification();
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
    if (results?.hasFailures) await createPreflightNotification(getMasUnpublishedCount(results));
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

  if (results.hasFailures) {
    await createPreflightNotification(getMasUnpublishedCount(results));
  } else {
    setupLinkCheckListener();
  }
}
