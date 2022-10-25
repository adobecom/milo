import { html } from '../../../deps/htm-preact.js';

function Card({ children }) {
  return html`<div class="card">${children}</div>`;
}

export default Card;
