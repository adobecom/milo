import { html, render } from '../../../deps/htm-preact.js';
import { project } from '../store.js';

function Modal() {
  return html`
  <div class="locui-project-created-modal">
    <strong>Project "${project.value.name || 'n/a'}" Succesfully Created</strong>
  </div>
  `;
}

export default function renderModal(el) {
  render(html`<${Modal} />`, el);
  return el;
}
