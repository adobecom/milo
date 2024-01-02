import { h, Component, html } from '../../../deps/htm-preact.js';
import ConfirmationModal from './confirmationModal.js';
import { findFragments } from './index.js';
import { copyToFloodgateTree, promoteFiles, deleteFgTree } from '../utils/miloc.js';
import { urls, copyStatusCheck, fragmentStatusCheck } from '../utils/state.js';

const PromoteFilesConfirmationModal = () => h(ConfirmationModal, {
  actionName: "Promote Files",
  confirmMessage: "Promote",
  onConfirm: (doPublish) => promoteFiles(doPublish),
  showRadioButtons: true,
});

const DeleteConfirmationModal = () => h(ConfirmationModal, {
  actionName: "Delete",
  confirmMessage: "Delete",
  onConfirm: () => deleteFgTree(),
  showRadioButtons: false,
});

const urlLimitExceededTitle = 'Number of URLs has exceeded the limit of 500. Please reduce the number of URLs.';
const inProgressTitle = 'Copy operation is in progress already. Please wait.';
const inProgressTitleFragment = 'Fragments and Assets are being updated. Please wait.';

export default function Actions() {

  return html`
    <div class="fgui-section">
      <div class="fgui-section-heading">
        <h2 class="fgui-section-label">Actions</h2>
      </div>
      <div class="fgui-url-heading-actions">
        ${html`
          <button
            class="fgui-urls-heading-action"
            onClick=${findFragments}
            title=${fragmentStatusCheck.value === 'IN PROGRESS' ? inProgressTitleFragment : ''}
            disabled=${fragmentStatusCheck.value === 'IN PROGRESS' || urls.value.length < 1}
          >
            Update Fragments and Assets
          </button>
          <button
            class="fgui-urls-heading-action"
            onClick=${copyToFloodgateTree}
            title=${urls.value.length > 500 ? urlLimitExceededTitle : (copyStatusCheck.value === 'IN PROGRESS' ? inProgressTitle : '')}
            disabled=${urls.value.length > 500 || copyStatusCheck.value === 'IN PROGRESS' || urls.value.length < 1}
          >
            Copy Files to FG Tree
          </button>
          <${PromoteFilesConfirmationModal} />
          <${DeleteConfirmationModal} />
        `}
      </div>
    </div>
  `;
}
