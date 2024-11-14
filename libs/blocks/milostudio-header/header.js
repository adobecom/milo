import { html } from '../../deps/htm-preact.js';

export default function Header() {
  return html`
  <a class="header-link" href="https://milostudio.adobe.com/#/home">
    <div class="locui-header-container">
      <a class="locui-header-logo">edit</a>
      <span class="locui-header-title">
        Milo Studio
      </span>
    </div>
  </a>
  `;
}
