import { html } from '../../../libs/deps/htm-preact.js';

export default function ActionButton({ children, onClickHandler }) {
  return html`<button onClick=${onClickHandler} class="action-button">
    ${children}
  </button>`;
}
