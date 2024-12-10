import { html, render } from '../../../deps/htm-preact.js';
import { project, projectInfo } from '../store.js';

function Modal() {
  return html`
  <div class="locui-project-created-modal">
    <div class="modal-header">
      <a class="check-mark-logo">tick</a>
      <strong>Project "${project.value.name || 'n/a'}" Successfully Created</strong>
    </div>
    <div class="create-project-view">
    ${projectInfo.value.projectLink && html`<a class="s2-btn accent" href="${projectInfo.value.projectLink}" target="_blank" rel="noreferrer noopener">View</a>`}
    </div>
  </div>
  `;
}

export default function renderModal(el) {
  render(html`<${Modal} />`, el);
  return el;
}
