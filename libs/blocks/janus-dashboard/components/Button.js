import { html } from '../../../deps/htm-preact.js';

function Button({ children, onClick }) {
  return html`<div class="button" onClick=${onClick}>${children}</div>`;
}

export default Button;
