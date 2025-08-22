import { getPreflightResults } from '../blocks/preflight/checks/preflightApi.js';
import { loadStyle, getConfig } from './utils.js';

let wasDismissed = false;
let sidekickObserver;
let linkCheckListener;
const sidekick = document.querySelector('aem-sidekick');
function openPreflightPanel() {
  if (sidekick) {
    sidekick.dispatchEvent(new CustomEvent('custom:preflight', { bubbles: true }));
  }
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
    if (linkCheckListener) {
      window.removeEventListener('preflightLinksComplete', linkCheckListener);
      linkCheckListener = null;
    }
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

    window.removeEventListener('preflightLinksComplete', linkCheckListener);
    linkCheckListener = null;
  };

  window.addEventListener('preflightLinksComplete', linkCheckListener);
}

function createObserver() {
  if (sidekickObserver) return;
  sidekickObserver = new MutationObserver(async () => {
    const notification = document.querySelector('.milo-preflight-overlay');

    if (!sidekick || sidekick.getAttribute('open') !== 'true') {
      if (notification) {
        notification.remove();
      }
      return;
    }

    if (sidekick.getAttribute('open') === 'true' && !wasDismissed) {
      const { hasFailures } = await getPreflightResults({
        url: window.location.href,
        area: document,
      });
      if (hasFailures) {
        await createPreflightNotification();
      }
    }
  });

  sidekickObserver.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['open'],
  });
}

export default async function show() {
  createObserver();
  const { hasFailures } = await getPreflightResults({
    url: window.location.href,
    area: document,
  });
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) return;

  const isPublishButtonDisabled = sidekick?.shadowRoot
    ?.querySelector('plugin-action-bar')?.shadowRoot
    ?.querySelector('sk-action-button.publish[disabled]');

  if (hasFailures && !wasDismissed && !isPublishButtonDisabled) {
    await createPreflightNotification();
  } else if (!wasDismissed && !isPublishButtonDisabled) {
    setupLinkCheckListener();
  }
}
