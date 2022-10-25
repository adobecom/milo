import { html } from '../../../deps/htm-preact.js';

function GridItem({ children }) {
  return html`<li class="grid-item">${children}</li>`;
}

export default GridItem;
