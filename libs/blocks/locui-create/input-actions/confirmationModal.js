import { html, render } from '../../../deps/htm-preact.js';
import { updateDraftProject } from '../store.js';

function ConfirmationModal({ setApiError, projectCreatedModal }) {
  const closeConfirmationModal = () => {
    document.querySelector('.dialog-modal').dispatchEvent(new Event('closeConfirmationModal'));
  };
  const onConfirm = async () => {
    closeConfirmationModal();
    const error = await updateDraftProject(true);
    if (error) {
      setApiError(error);
      projectCreatedModal('error');
    } else {
      projectCreatedModal();
    }
  };

  return html`
  <div class="locui-project-confirmation-modal">
    <div class="confirmation-header">
      <strong>Are you sure you want to proceed?</strong>
    </div>
    <div class="confirmation-buttons">
     <button class="s2-btn accent" onClick=${onConfirm}>Yes</button>
     <button class="s2-btn secondary" onClick=${closeConfirmationModal}>No</button>
    </div>
  </div>
  `;
}

export default function renderModal(el, setApiError, projectCreatedModal) {
  render(html`<${ConfirmationModal} setApiError=${setApiError} projectCreatedModal=${projectCreatedModal} />`, el);
  return el;
}
