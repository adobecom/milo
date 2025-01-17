import { html, render } from '../../../deps/htm-preact.js';
import { project, projectInfo } from '../store.js';

function Modal({ type }) {
  const closeModal = () => {
    document.querySelector('.dialog-modal').dispatchEvent(new Event('closeModal'));
  };

  return html`
    <div class="locui-project-created-modal">
      <div class="modal-header">
        ${type === 'error' ? html`
              <a class="alert-icon">error</a>
              <strong>Project "${project.value.name || 'n/a'}" Creation Failed!</strong>
            ` : html`
              <a class="check-mark-logo">tick</a>
              <strong>Project "${project.value.name || 'n/a'}" Successfully Created</strong>
            `}
      </div>
      <div class="create-project-view">
        ${type === 'success' ? projectInfo.value.projectLink
          && html`
              <a
                class="s2-btn accent"
                href="${projectInfo.value.projectLink}"
                onclick=${() => { closeModal(); }}
                target="_self"
                rel="noreferrer noopener"
              >
                View
              </a>
            ` : html`
              <a
                class="s2-btn accent"
                href="#"
                onclick=${(e) => { e.preventDefault(); closeModal(); }}
              >
                Back
              </a>
            `}
      </div>
    </div>
  `;
}

export default function renderModal(el, type = 'success') {
  render(html`<${Modal} type=${type} />`, el);
  return el;
}
