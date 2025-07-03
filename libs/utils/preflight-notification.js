import { hasPreflightFailures, executePreflightChecks } from '../blocks/preflight/checks/preflightExecutor.js';
import { loadStyle } from './utils.js';

let preflightNotificationDismissed = false;

function openPreflightPanel() {
  const sk = document.querySelector('aem-sidekick, helix-sidekick');
  if (sk) {
    sk.dispatchEvent(new CustomEvent('custom:preflight', { bubbles: true }));
  }
}

async function createPreflightNotification() {
  const existingNotification = document.querySelector('.milo-preflight-overlay');
  if (existingNotification) {
    existingNotification.remove();
  }
  loadStyle('/libs/styles/preflight-notification.css');

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

  overlay.style.cssText = `
    position: fixed;
    bottom: 120px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
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

async function checkPreflightAndShowNotification() {
  try {
    await executePreflightChecks();
    const hasFailures = hasPreflightFailures();
    const existingNotification = document.querySelector('.milo-preflight-overlay');
    if (existingNotification) {
      existingNotification.remove();
    }

    if (hasFailures && !preflightNotificationDismissed) {
      await createPreflightNotification();
    }
  } catch (error) {
    console.warn('Failed to check preflight status:', error);
  }
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
        try {
          await executePreflightChecks();
          const hasFailures = hasPreflightFailures();
          if (hasFailures) {
            await createPreflightNotification();
          }
        } catch (error) {
          console.warn('Failed to check preflight status:', error);
        }
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

export { checkPreflightAndShowNotification, createSidekickVisibilityObserver }; 
