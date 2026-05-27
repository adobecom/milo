const DRAWER_WIDTH = 340;

const AI_ICON = `<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.92 13.25c-.22 0-.44-.06-.64-.17-.48-.28-.73-.83-.61-1.37l.73-3.38L7.08 5.77c-.37-.41-.44-1.01-.16-1.49.28-.48.84-.73 1.37-.61l3.38.73 2.56-2.32c.41-.37 1.01-.44 1.49-.16.48.28.72.83.61 1.37l-.73 3.38 2.32 2.56c.37.41.44 1.01.16 1.49-.28.48-.83.73-1.37.61l-3.37-.73-2.56 2.32c-.24.22-.55.33-.86.33z" fill="url(#bc-grad-1)"/>
  <path d="M3.35 18.25c-.13 0-.26-.03-.38-.1-.28-.16-.42-.49-.36-.81l.31-1.42-.97-1.07c-.22-.24-.26-.6-.1-.88.17-.28.49-.42.81-.36l1.42.31 1.07-.97c.24-.22.6-.26.88-.1.28.16.42.49.36.81l-.31 1.42.97 1.07c.22.24.26.6.1.88-.17.28-.5.42-.81.36l-1.42-.31-1.07.97c-.14.13-.32.2-.5.2z" fill="url(#bc-grad-2)"/>
  <defs>
    <linearGradient id="bc-grad-1" x1="6.75" y1="1.75" x2="19.29" y2="3.04" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D73220"/><stop offset=".33" stop-color="#D92361"/><stop offset="1" stop-color="#7155FA"/>
    </linearGradient>
    <linearGradient id="bc-grad-2" x1="1.75" y1="12.75" x2="7.75" y2="13.37" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D73220"/><stop offset=".33" stop-color="#D92361"/><stop offset="1" stop-color="#7155FA"/>
    </linearGradient>
  </defs>
</svg>`;

const SEND_ICON = '<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M18.65 9.97c0-.29-.17-.56-.44-.68L4.06 2.93c-.26-.12-.56-.08-.78.1-.22.18-.32.46-.26.74l1.27 6.24-1.22 6.23c-.05.25.03.5.2.68.02.02.04.04.07.06.22.17.52.21.78.1l14.1-6.41c.27-.12.44-.39.44-.68zM14.41 9.23l-8.75.03L4.78 4.9 14.4 9.23zM4.82 15.1l.85-4.35 8.76-.02L4.82 15.1z"/></svg>';

const THUMBS_UP = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 6V3a1.5 1.5 0 0 0-3 0v2L3 8v5h7l2.5-5V7a1 1 0 0 0-1-1H9zM3 8H2v5h1"/></svg>';
const THUMBS_DOWN = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 10v3a1.5 1.5 0 0 0 3 0v-2l3-3V3H6L3.5 8v1a1 1 0 0 0 1 1H7zM13 8h1V3h-1"/></svg>';

const EXPAND_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9v4h4M13 7V3H9M3 13l5-5M13 3l-5 5"/></svg>';
const CLOSE_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>';

const DRAWER_HTML = `
  <header class="bc-poc-header">
    <div class="bc-poc-title-row">
      <span class="bc-poc-title">Ask</span>
      <span class="bc-poc-beta">BETA</span>
    </div>
    <div class="bc-poc-header-actions">
      <button type="button" class="bc-poc-iconbtn" aria-label="Expand">${EXPAND_ICON}</button>
      <button type="button" class="bc-poc-iconbtn" aria-label="Close">${CLOSE_ICON}</button>
    </div>
  </header>

  <div class="bc-poc-body">
    <div class="bc-poc-question">Which apps can help me combine and retouch photos?</div>

    <div class="bc-poc-answer">
      <p>The best Adobe product for touching up and enhancing photos is <a href="#">Adobe Photoshop</a>.</p>
      <p>It offers advanced retouching tools such as the Spot Healing Brush, Healing Brush, Clone Stamp, and Patch Tool for precise photo enhancements and blemish removal.</p>
    </div>

    <article class="bc-poc-card">
      <div class="bc-poc-card-image">
        <span class="bc-poc-card-image-label">Ps</span>
      </div>
      <div class="bc-poc-card-content">
        <h3>Photoshop</h3>
        <p>Best app for creating images, graphics, and art with powerful tools and generative AI.</p>
        <button type="button" class="bc-poc-card-cta">See plans &amp; pricing</button>
      </div>
    </article>

    <div class="bc-poc-feedback">
      <button type="button" class="bc-poc-iconbtn" aria-label="Helpful">${THUMBS_UP}</button>
      <button type="button" class="bc-poc-iconbtn" aria-label="Not helpful">${THUMBS_DOWN}</button>
    </div>
  </div>

  <footer class="bc-poc-footer">
    <div class="bc-poc-input">
      <span class="bc-poc-input-icon">${AI_ICON}</span>
      <input type="text" placeholder="Ask a question" aria-label="Ask a question" />
      <button type="button" class="bc-poc-send" aria-label="Send">${SEND_ICON}</button>
    </div>
    <p class="bc-poc-disclaimer">AI responses may be inaccurate and any offers provided are non-binding. <a href="#">Generative AI Terms</a>.</p>
  </footer>
`;

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

  .bc-poc-body {
    flex: 1; overflow-y: auto;
    padding: 16px;
    display: flex; flex-direction: column; gap: 16px;
  }

  .bc-poc-question {
    align-self: flex-end; max-width: 85%;
    background: #F1F1F1; color: #292929;
    padding: 10px 14px; border-radius: 16px 16px 4px 16px;
    font-size: 14px; line-height: 20px;
  }

  .bc-poc-answer { font-size: 14px; line-height: 22px; }
  .bc-poc-answer p { margin: 0 0 12px; }
  .bc-poc-answer p:last-child { margin-bottom: 0; }
  .bc-poc-answer a { color: #1473E6; text-decoration: underline; }

  .bc-poc-card {
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
  }
  .bc-poc-card-image {
    height: 140px;
    background: linear-gradient(135deg, #001E36 0%, #31A8FF 100%);
    display: flex; align-items: center; justify-content: center;
  }
  .bc-poc-card-image-label {
    color: #fff; font-size: 56px; font-weight: 800; letter-spacing: -2px;
    font-family: adobe-clean, sans-serif;
  }
  .bc-poc-card-content { padding: 14px 16px 16px; }
  .bc-poc-card-content h3 {
    margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #131313;
  }
  .bc-poc-card-content p {
    margin: 0 0 12px; font-size: 13px; line-height: 18px; color: #4B4B4B;
  }
  .bc-poc-card-cta {
    background: #1473E6; color: #fff; border: none;
    padding: 8px 14px; border-radius: 16px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: inherit;
  }
  .bc-poc-card-cta:hover { background: #0D66D0; }

  .bc-poc-feedback { display: flex; gap: 4px; }

  .bc-poc-footer {
    border-top: 1px solid rgba(0,0,0,0.08);
    padding: 12px 16px 14px;
    flex-shrink: 0;
    background: #fff;
  }
  .bc-poc-input {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid rgba(0,0,0,0.12); border-radius: 22px;
    padding: 6px 8px 6px 12px;
    background: #fff;
  }
  .bc-poc-input:focus-within { border-color: #1473E6; }
  .bc-poc-input-icon { display: inline-flex; flex-shrink: 0; }
  .bc-poc-input input {
    flex: 1; border: none; outline: none; background: transparent;
    font: inherit; font-size: 14px; color: #292929; padding: 4px 0;
  }
  .bc-poc-input input::placeholder { color: #8C8C8C; }
  .bc-poc-send {
    background: transparent; border: none; padding: 4px; cursor: pointer;
    color: #6E6E6E; display: inline-flex; align-items: center;
  }
  .bc-poc-disclaimer {
    font-size: 11px; line-height: 16px; color: #6E6E6E;
    margin: 8px 4px 0; text-align: center;
  }
  .bc-poc-disclaimer a { color: #6E6E6E; text-decoration: underline; }

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

export default function injectBcDrawerPoc() {
  if (document.documentElement.classList.contains('has-concierge')) return;

  document.documentElement.classList.add('has-concierge');
  document.documentElement.style.setProperty('--concierge-width', `${DRAWER_WIDTH}px`);

  const drawer = document.createElement('aside');
  drawer.className = 'concierge';
  drawer.setAttribute('role', 'complementary');
  drawer.setAttribute('aria-label', 'AI assistant');
  drawer.innerHTML = DRAWER_HTML;

  const style = document.createElement('style');
  style.textContent = DRAWER_CSS.trim();

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
