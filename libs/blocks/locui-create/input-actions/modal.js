import { html, render } from '../../../deps/htm-preact.js';
import { project } from '../store.js';

function Modal() {
  return html`
  <div class="locui-project-created-modal">
    <div class="modal-header">
      <a class="check-mark-logo">tick</a>
      <strong>Project "${project.value.name || 'n/a'}" Successfully Created</strong>
    </div>
    <div class="create-project-view">
     <button class="s2-btn accent">View</button>
    </div>
  </div>
  `;
}

export default function renderModal(el) {
  render(html`<${Modal} />`, el);
  return el;
}
