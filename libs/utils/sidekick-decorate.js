import userCanPublishPage from '../tools/utils/publish.js';

const PUBLISH_BTN = '.publish.plugin button';
const BACKUP_PROFILE = '.profile-email';
const CONFIRM_MESSAGE = 'Are you sure? This will publish to production.';

export default function stylePublish(sk) {
  const setupPublishBtn = async (page, btn) => {
    const { canPublish, message } = await userCanPublishPage(page, false);
    btn.setAttribute('disabled', !canPublish);
    const messageText = btn.querySelector('span');
    const text = canPublish ? CONFIRM_MESSAGE : message;
    if (messageText) {
      messageText.innerText = text;
    } else {
      btn.insertAdjacentHTML('beforeend', `<span>${text}</span>`);
    }
  };

  const style = new CSSStyleSheet();
  style.replaceSync(`
    :host {
      --bg-color: rgb(129 27 14);
      --text-color: #fff0f0;
      color-scheme: light dark;
    }
    .publish.plugin {
      order: 100;
    }
    .publish.plugin button {
      position: relative;
    }
    .publish.plugin button:not([disabled=true]) {
      background: var(--bg-color);
      border-color: #b46157;
      color: var(--text-color);
    }
    .publish.plugin button:not([disabled=true]):hover {
      background-color: var(--hlx-sk-button-hover-bg);
      border-color: unset;
      color: var(--hlx-sk-button-hover-color);
    }
    .publish.plugin button > span {
      display: none;
      background: #666;
      border-radius: 4px;
      line-height: 1.2rem;
      padding: 8px 12px;
      position: absolute;
      top: 34px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      white-space: pre-wrap;
    }
    .publish.plugin button:not([disabled=true]) > span {
      background: var(--bg-color);
    }
    .publish.plugin button:hover > span {
      display: block;
      color: var(--text-color);
    }
    .publish.plugin button > span:before {
      content: '';
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #666;
      position: absolute;
      text-align: center;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
    .publish.plugin button:not([disabled=true]) > span:before {
      border-bottom: 6px solid var(--bg-color);
    }
  `);

  sk.shadowRoot.adoptedStyleSheets = [style];

  sk.addEventListener('statusfetched', async (event) => {
    const page = event?.detail?.data;
    const btn = event?.target?.shadowRoot?.querySelector(PUBLISH_BTN);
    if (page && btn) {
      setupPublishBtn(page, btn);
    }
  });

  setTimeout(async () => {
    const btn = sk.shadowRoot.querySelector(PUBLISH_BTN);
    btn?.setAttribute('disabled', true);
    const message = btn?.querySelector('span');
    if (btn && !message) {
      const page = {
        webPath: window.location.pathname,
        // added for edge case where the statusfetched event isnt fired on refresh
        profile: { email: sk.shadowRoot.querySelector(BACKUP_PROFILE)?.innerText },
      };
      setupPublishBtn(page, btn);
    }
  }, 500);
}
