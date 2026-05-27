const DRAWER_WIDTH = 340;

export default function injectBcDrawerPoc() {
  if (document.documentElement.classList.contains('has-concierge')) return;

  document.documentElement.classList.add('has-concierge');
  document.documentElement.style.setProperty('--concierge-width', `${DRAWER_WIDTH}px`);

  const drawer = document.createElement('aside');
  drawer.className = 'concierge';
  drawer.setAttribute('role', 'complementary');
  drawer.setAttribute('aria-label', 'AI assistant');

  const style = document.createElement('style');
  style.textContent = `
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
      background-color: teal;
      z-index: 2147483000;
    }

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
  `.trim();

  document.head.append(style);
  document.documentElement.append(drawer);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.documentElement.style.setProperty('--concierge-width', `${DRAWER_WIDTH}px`);
    }, 100);
  });
}
