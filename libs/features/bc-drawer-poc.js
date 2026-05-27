import { getConfig, loadScript } from '../utils/utils.js';
import chatUIConfig from '../blocks/brand-concierge/chat-ui-config.js';

const DRAWER_WIDTH = 340;
const MOUNT_ID = 'brand-concierge-mount';

const WEB_AGENT_PROD = 'https://experience.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';
const WEB_AGENT_STAGE = 'https://experience-stage.adobe.net/solutions/adobe-brand-concierge-acom-brand-concierge-web-agent/static-assets/main.js';

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
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    color: #6E6E6E; border-radius: 50%; display: inline-flex;
    align-items: center; justify-content: center;
  }
  .bc-poc-iconbtn:hover { background: rgba(0,0,0,0.06); color: #131313; }

  .bc-poc-mount {
    flex: 1;
    min-height: 0;
    position: relative;
    overflow: hidden;
  }
  .bc-poc-mount #${MOUNT_ID} {
    position: absolute;
    inset: 0;
    overflow: auto;
  }

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

export default async function injectBcDrawerPoc() {
  if (document.documentElement.classList.contains('has-concierge')) return;

  document.documentElement.classList.add('has-concierge');
  document.documentElement.style.setProperty('--concierge-width', `${DRAWER_WIDTH}px`);

  const style = document.createElement('style');
  style.textContent = DRAWER_CSS.trim();
  document.head.append(style);

  const drawer = document.createElement('aside');
  drawer.className = 'concierge';
  drawer.setAttribute('role', 'complementary');
  drawer.setAttribute('aria-label', 'AI assistant');
  drawer.innerHTML = `${HEADER_HTML}<div class="bc-poc-mount"><div id="${MOUNT_ID}"></div></div>`;
  document.documentElement.append(drawer);

  drawer.querySelector('.bc-poc-close')?.addEventListener('click', () => {
    drawer.remove();
    style.remove();
    document.documentElement.classList.remove('has-concierge');
    document.documentElement.style.removeProperty('--concierge-width');
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.documentElement.style.setProperty('--concierge-width', `${DRAWER_WIDTH}px`);
    }, 100);
  });

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
