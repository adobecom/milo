import { html, render } from '../../../../deps/htm-preact.js';

function Modal() {
  return html`
  <div class="locui-fragment-modal">
    <h2>NOT FOUND</h2>
    <p>fragments/...</p>
    <p>fragments/...</p>
  </div>
  `;
}

export default function renderModal(el) {
  render(html`<${Modal} />`, el);
  return el;
}
