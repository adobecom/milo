import { html } from '../../../deps/htm-preact.js';

function Paper({ children }) {
  return html`<div class="paper">${children}</div>`;
}

export default Paper;
