import { getPreflightResults } from '../blocks/preflight/checks/preflightApi.js';
import { loadStyle, getConfig } from './utils.js';

let preflightNotificationDismissed = false;
let observerCreated = false;

function openPreflightPanel() {
  const sk = document.querySelector('aem-sidekick, helix-sidekick');
  if (sk) {
    sk.dispatchEvent(new CustomEvent('custom:preflight', { bubbles: true }));
  }
}

async function createPreflightNotification() {
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) existingNotification.remove();
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
    e.stopPropagation();
    openPreflightPanel();
    overlay.remove();
  });

  const closeBtn = overlay.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    overlay.remove();
    preflightNotificationDismissed = true;
  });

  document.body.appendChild(overlay);
}

async function showNotificationIfAllowed(hasFailures) {
  const isPublishButtonDisabled = document.querySelector('aem-sidekick')?.shadowRoot?.querySelector('plugin-action-bar')?.shadowRoot?.querySelector('sk-action-button.publish[disabled]');
  if (!hasFailures || preflightNotificationDismissed || isPublishButtonDisabled) {
    return;
  }
  await createPreflightNotification();
}

function createSidekickVisibilityObserver() {
  const observer = new MutationObserver(async () => {
    const sidekick = document.querySelector('aem-sidekick');
    const notification = document.querySelector('.milo-preflight-overlay');

    if (!sidekick) {
      if (notification) {
        notification.remove();
      }
      return;
    }
    const isOpen = sidekick.getAttribute('open') !== 'false';

    if (isOpen) {
      if (!notification && !preflightNotificationDismissed) {
        const { hasFailures } = await getPreflightResults(window.location.href, document);
        await showNotificationIfAllowed(hasFailures);
      }
    } else {
      if (notification) {
        notification.remove();
      }
      preflightNotificationDismissed = false;
    }
  });

  observer.observe(document, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['open'],
  });

  return observer;
}

export default async function checkPreflightAndShowNotification() {
  if (!observerCreated) {
    createSidekickVisibilityObserver();
    observerCreated = true;
  }

  const { hasFailures } = await getPreflightResults(window.location.href, document);
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) {
    existingNotification.remove();
  }
  await showNotificationIfAllowed(hasFailures);
}
