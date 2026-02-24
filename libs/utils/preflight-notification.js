import { getPreflightResults } from '../blocks/preflight/checks/preflightApi.js';
import { loadStyle, getConfig } from './utils.js';

let wasDismissed = false;
let sidekickObserver;
let linkCheckListener;
const sidekick = document.querySelector('aem-sidekick, helix-sidekick');
function openPreflightPanel() {
  if (!sidekick) return;
  sidekick.dispatchEvent(new CustomEvent('custom:preflight', { bubbles: true }));
}

async function createPreflightNotification() {
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) return;
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/styles/preflight-notification.css`);

  const overlay = document.createElement('div');
  overlay.className = 'milo-preflight-overlay';
  overlay.innerHTML = `
    <div class="preflight-notification">
      <div class="notification-content">
        <span class="notification-message">
          Content quality checks are failing. Please <button class="preflight-review-link">review</button> before publishing.
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
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    wasDismissed = true;
    if (!linkCheckListener) return;
    window.removeEventListener('preflightLinksComplete', linkCheckListener);
    linkCheckListener = null;
  });

  document.body.appendChild(overlay);
}

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
    });
    if (results?.hasFailures) await createPreflightNotification();
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
  });

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
    await createPreflightNotification();
  } else {
    setupLinkCheckListener();
  }
}
