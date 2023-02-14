import { html } from '../../../libs/deps/htm-preact.js';

function LayoutWrapper({ children }) {
  // const img = html`<img src="img/cropped.png" class="world-img" />`;
  return html` <div>
    <div class="hero-image">
      <div class="whole-content">${children}</div>
    </div>
  </div>`;
}

export default LayoutWrapper;
