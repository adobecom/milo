import { miloUserCanPublish } from './utils.js';

const PUBLISH_BTN = '.publish.plugin button';
const CONFIRM_MESSAGE = 'Are you sure? This will publish to production.';
const NO_AUTH_MESSAGE = 'This page currently cannot be published';

export default function stylePublish(sk) {
  sk.addEventListener('statusfetched', async (event) => {
    const thisPage = event?.detail?.data;
    const enablePublish = await miloUserCanPublish(thisPage);
    const publishBtn = event?.target?.shadowRoot?.querySelector(PUBLISH_BTN);
    if (publishBtn) {
      publishBtn.setAttribute('disabled', !enablePublish);
      const message = publishBtn.querySelector('span');
      if (message) {
        message.innerText = enablePublish ? CONFIRM_MESSAGE : NO_AUTH_MESSAGE;
      }
    }
  });

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
      background: var(--bg-color);
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
    .publish.plugin button:hover > span {
      display: block;
      color: var(--text-color);
    }
    .publish.plugin button > span:before {
      content: '';
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid var(--bg-color);
      position: absolute;
      text-align: center;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
  `);
  sk.shadowRoot.adoptedStyleSheets = [style];
  setTimeout(() => {
    const btn = sk.shadowRoot.querySelector(PUBLISH_BTN);
    btn?.insertAdjacentHTML('beforeend', `<span>${CONFIRM_MESSAGE}</span>`);
  }, 800);
}
