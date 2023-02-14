import { html } from '../../../libs/deps/htm-preact.js';

function LayoutWrapper({ children }) {
  return html` <div class="whole-app">${children}</div> `;
}

export default LayoutWrapper;
