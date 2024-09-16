export default function stylePublish(sk) {
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
      background: var(--bg-color);
      border-color: #b46157;
      color: var(--text-color);
      position: relative;
    }
    .publish.plugin button:hover {
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
    const btn = sk.shadowRoot.querySelector('.publish.plugin button');
    btn?.insertAdjacentHTML('beforeend', `
      <span>Are you sure? This will publish to production.</span>
    `);
  }, 500);
}
