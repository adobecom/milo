import { getConfig, loadScript } from '../utils/utils.js';
import chatUIConfig from '../blocks/brand-concierge/chat-ui-config.js';

const DRAWER_WIDTH = 340;
const MOUNT_ID = 'brand-concierge-mount';

const WEB_AGENT_PROD = 'https://experience.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
const WEB_AGENT_STAGE = 'https://experience-stage.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';

const AI_ICON = `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bc-poc-grad-1" x1="6.75" y1="1.75" x2="19.29" y2="3.04" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D73220"/><stop offset=".33" stop-color="#D92361"/><stop offset="1" stop-color="#7155FA"/>
    </linearGradient>
    <linearGradient id="bc-poc-grad-2" x1="1.75" y1="12.75" x2="7.75" y2="13.37" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D73220"/><stop offset=".33" stop-color="#D92361"/><stop offset="1" stop-color="#7155FA"/>
    </linearGradient>
  </defs>
  <path d="M9.92 13.25c-.22 0-.44-.06-.64-.17-.48-.28-.73-.83-.61-1.37l.73-3.38L7.08 5.77c-.37-.41-.44-1.01-.16-1.49.28-.48.84-.73 1.37-.61l3.38.73 2.56-2.32c.41-.37 1.01-.44 1.49-.16.48.28.72.83.61 1.37l-.73 3.38 2.32 2.56c.37.41.44 1.01.16 1.49-.28.48-.83.73-1.37.61l-3.37-.73-2.56 2.32c-.24.22-.55.33-.86.33z" fill="url(#bc-poc-grad-1)"/>
  <path d="M3.35 18.25c-.13 0-.26-.03-.38-.1-.28-.16-.42-.49-.36-.81l.31-1.42-.97-1.07c-.22-.24-.26-.6-.1-.88.17-.28.49-.42.81-.36l1.42.31 1.07-.97c.24-.22.6-.26.88-.1.28.16.42.49.36.81l-.31 1.42.97 1.07c.22.24.26.6.1.88-.17.28-.5.42-.81.36l-1.42-.31-1.07.97c-.14.13-.32.2-.5.2z" fill="url(#bc-poc-grad-2)"/>
</svg>`;

const SEND_ICON = '<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path d="M18.65 9.97c0-.29-.17-.56-.44-.68L4.06 2.93c-.26-.12-.56-.08-.78.1-.22.18-.32.46-.26.74l1.27 6.24-1.22 6.23c-.05.25.03.5.2.68.02.02.04.04.07.06.22.17.52.21.78.1l14.1-6.41c.27-.12.44-.39.44-.68zM14.41 9.23l-8.75.03L4.78 4.9 14.4 9.23zM4.82 15.1l.85-4.35 8.76-.02L4.82 15.1z"/></svg>';
const CLOSE_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>';
const EXPAND_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9v4h4M13 7V3H9M3 13l5-5M13 3l-5 5"/></svg>';

const DRAWER_CSS = `
  html.has-concierge body {
    padding-right: var(--concierge-width);
    box-sizing: border-box;
  }

  .concierge {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--concierge-width);
    background: #fff;
    border-left: 1px solid rgba(0,0,0,0.08);
    box-shadow: -4px 0 16px rgba(0,0,0,0.04);
    z-index: 2147483000;
    display: flex;
    flex-direction: column;
    font-family: adobe-clean, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #292929;
    overflow: hidden;
  }

  .bc-poc-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
  }
  .bc-poc-title-row { display: flex; align-items: center; gap: 8px; }
  .bc-poc-title { font-size: 16px; font-weight: 700; color: #131313; }
  .bc-poc-beta {
    font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
    color: #6E6E6E; background: #F1F1F1; padding: 2px 6px; border-radius: 4px;
  }
  .bc-poc-header-actions { display: flex; gap: 4px; }
  .bc-poc-iconbtn {
    background: transparent; border: none; padding: 6px; cursor: pointer;
    color: #6E6E6E; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
  }
  .bc-poc-iconbtn:hover { background: rgba(0,0,0,0.06); color: #131313; }

  .bc-poc-mount { flex: 1; min-height: 0; position: relative; overflow: hidden; }
  .bc-poc-mount #${MOUNT_ID} { position: absolute; inset: 0; overflow: auto; }

  /* --- GNAV "Ask" pill --- */
  .bc-poc-gnav {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0 16px;
    height: 36px;
    padding: 0 6px 0 14px;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 18px;
    background: #fff;
    font-family: adobe-clean, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    color: #6E6E6E;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .bc-poc-gnav:hover { border-color: rgba(0,0,0,0.22); color: #292929; }
  .bc-poc-gnav .bc-poc-gnav-icon { display: inline-flex; flex-shrink: 0; }
  .bc-poc-gnav .bc-poc-gnav-label { white-space: nowrap; }
  .bc-poc-gnav .bc-poc-gnav-send {
    width: 26px; height: 26px; border-radius: 50%;
    background: #F1F1F1; color: #6E6E6E;
    display: inline-flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* Collapsed (icon-only) state when drawer is open */
  .bc-poc-gnav.is-collapsed {
    width: 36px; padding: 0;
    justify-content: center;
    gap: 0;
  }
  .bc-poc-gnav.is-collapsed .bc-poc-gnav-label,
  .bc-poc-gnav.is-collapsed .bc-poc-gnav-send { display: none; }

  /* --- push fixed/sticky Adobe elements off the drawer area --- */
  html.has-concierge header.global-navigation,
  html.has-concierge header.feds-header-wrapper,
  html.has-concierge .global-navigation,
  html.has-concierge .feds-header {
    right: var(--concierge-width) !important;
    width: auto !important;
  }
  html.has-concierge .local-nav,
  html.has-concierge .milo-local-nav,
  html.has-concierge .feds-localnav {
    right: var(--concierge-width) !important;
    width: auto !important;
  }
  html.has-concierge .sticky-bottom,
  html.has-concierge [class*="sticky-bottom"],
  html.has-concierge .floating-cta,
  html.has-concierge .merch-card-sticky {
    right: var(--concierge-width) !important;
    width: auto !important;
  }
  html.has-concierge #onetrust-banner-sdk,
  html.has-concierge #onetrust-consent-sdk {
    right: var(--concierge-width) !important;
    width: auto !important;
  }
  html.has-concierge #jarvis-chat-button,
  html.has-concierge [class*="jarvis-chat"],
  html.has-concierge .jarvis-launcher {
    right: calc(var(--concierge-width) + 16px) !important;
  }
  html.has-concierge .marquee,
  html.has-concierge .full-width,
  html.has-concierge [class*="full-bleed"] {
    max-width: calc(100vw - var(--concierge-width)) !important;
  }
  html.has-concierge .dialog-modal,
  html.has-concierge [class*="modal-container"],
  html.has-concierge .ucv3-iframe-wrapper {
    right: var(--concierge-width) !important;
  }

  @supports not (selector(:has(*))) {
    .concierge { display: none; }
    html.has-concierge body { padding-right: 0; }
  }
`;

const HEADER_HTML = `
  <header class="bc-poc-header">
    <div class="bc-poc-title-row">
      <span class="bc-poc-title">Ask</span>
      <span class="bc-poc-beta">BETA</span>
    </div>
    <div class="bc-poc-header-actions">
      <button type="button" class="bc-poc-iconbtn" aria-label="Expand">${EXPAND_ICON}</button>
      <button type="button" class="bc-poc-iconbtn bc-poc-close" aria-label="Close">${CLOSE_ICON}</button>
    </div>
  </header>
`;

const GNAV_PILL_HTML = `
  <span class="bc-poc-gnav-icon" aria-hidden="true">${AI_ICON}</span>
  <span class="bc-poc-gnav-label">Ask a question</span>
  <span class="bc-poc-gnav-send" aria-hidden="true">${SEND_ICON}</span>
`;

const GNAV_SELECTOR = [
  '.feds-header-wrapper',
  'header.global-navigation',
  '.global-navigation',
  '.feds-header',
].join(',');

const GNAV_ANCHOR_SELECTOR = [
  '.feds-cta-wrapper',
  '.feds-signIn-link',
  '.feds-utilities',
  '.gnav-toggle',
  '.feds-profile',
  '.signin',
].join(',');

let drawerOpen = false;
let drawerEl = null;
let styleEl = null;
let gnavPillEl = null;
let webAgentLoaded = false;

function waitForCondition(checkFn, timeout = 10000, interval = 100) {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      if (checkFn()) resolve(true);
      else if (Date.now() - start >= timeout) resolve(false);
      else setTimeout(tick, interval);
    };
    tick();
  });
}

function buildChatConfig(isStage) {
  const cfg = JSON.parse(JSON.stringify(chatUIConfig));
  if (isStage) {
    cfg.env = 'stage';
    if (cfg.behavior?.fireflyGalleryWidget) {
      cfg.behavior.fireflyGalleryWidget.fireflyHostname = 'https://firefly-stage.corp.adobe.com';
      cfg.behavior.fireflyGalleryWidget.fireflyEnv = 'stage';
    }
  }
  return cfg;
}

function attachAuthHook(surfaceURL) {
  const { userAgent, language } = window.navigator;
  const { locale } = getConfig();
  return (content) => {
    const token = window.adobeIMS?.isSignedInUser()
      ? window.adobeIMS.getAccessToken()?.token : null;
    if (token) {
      content.data = { type: 'auth', payload: { token } };
    }
    content.xdm = {
      web: { webPageDetails: { URL: surfaceURL } },
      environment: { browserDetails: { userAgent }, _dc: { language } },
      homeAddress: { region: locale?.region },
    };
  };
}

async function bootstrapWebAgent() {
  if (webAgentLoaded) return;
  webAgentLoaded = true;

  const isStage = getConfig()?.env?.name !== 'prod';
  const scriptSrc = isStage ? WEB_AGENT_STAGE : WEB_AGENT_PROD;
  loadScript(scriptSrc);

  const ready = await waitForCondition(() => !!window.adobe?.concierge?.bootstrap);
  if (!ready) {
    window.lana?.log('BC drawer POC: bootstrap API not available', { tags: 'bc-drawer-poc', severity: 'error' });
    return;
  }
  window.adobe.concierge.bootstrap({
    instanceName: 'alloy',
    stylingConfigurations: buildChatConfig(isStage),
    selector: `#${MOUNT_ID}`,
    onBeforeEventSend: attachAuthHook(window.location.href),
  });
}

function closeDrawer() {
  if (!drawerOpen) return;
  drawerOpen = false;
  if (drawerEl) drawerEl.style.display = 'none';
  document.documentElement.classList.remove('has-concierge');
  document.documentElement.style.removeProperty('--concierge-width');
  if (gnavPillEl) gnavPillEl.classList.remove('is-collapsed');
}

function openDrawer() {
  if (drawerOpen) return;
  drawerOpen = true;

  document.documentElement.classList.add('has-concierge');
  document.documentElement.style.setProperty('--concierge-width', `${DRAWER_WIDTH}px`);

  if (!drawerEl) {
    drawerEl = document.createElement('aside');
    drawerEl.className = 'concierge';
    drawerEl.setAttribute('role', 'complementary');
    drawerEl.setAttribute('aria-label', 'AI assistant');
    drawerEl.innerHTML = `${HEADER_HTML}<div class="bc-poc-mount"><div id="${MOUNT_ID}"></div></div>`;
    drawerEl.querySelector('.bc-poc-close')?.addEventListener('click', closeDrawer);
    document.documentElement.append(drawerEl);
  } else {
    drawerEl.style.display = '';
  }

  if (gnavPillEl) gnavPillEl.classList.add('is-collapsed');

  bootstrapWebAgent();
}

async function injectGnavPill() {
  const found = await waitForCondition(() => document.querySelector(GNAV_SELECTOR));
  if (!found) return;
  const gnav = document.querySelector(GNAV_SELECTOR);

  gnavPillEl = document.createElement('button');
  gnavPillEl.type = 'button';
  gnavPillEl.className = 'bc-poc-gnav';
  gnavPillEl.setAttribute('aria-label', 'Ask a question');
  gnavPillEl.innerHTML = GNAV_PILL_HTML;
  gnavPillEl.addEventListener('click', () => {
    if (drawerOpen) closeDrawer(); else openDrawer();
  });

  const anchor = gnav.querySelector(GNAV_ANCHOR_SELECTOR);
  if (anchor) anchor.parentNode.insertBefore(gnavPillEl, anchor);
  else gnav.append(gnavPillEl);

  if (drawerOpen) gnavPillEl.classList.add('is-collapsed');
}

export default function injectBcDrawerPoc() {
  if (styleEl) return;

  styleEl = document.createElement('style');
  styleEl.textContent = DRAWER_CSS.trim();
  document.head.append(styleEl);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (drawerOpen) {
        document.documentElement.style.setProperty('--concierge-width', `${DRAWER_WIDTH}px`);
      }
    }, 100);
  });

  injectGnavPill();
  openDrawer();
}
