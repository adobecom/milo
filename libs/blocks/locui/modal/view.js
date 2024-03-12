import { html } from '../../../deps/htm-preact.js';
import { showModal } from '../utils/state.js';
import { getModalByType } from './index.js';

export default function Modal() {
  const { renderContent, title } = getModalByType(showModal.value);
  if (!renderContent) return null;
  return html`
    <div 
      onClick=${() => { showModal.value = ''; }}
      class=locui-modal-container>
      <div
        class=locui-modal-content
        onClick=${(e) => { e.stopPropagation(); }}>
        <h2 class=locui-modal-title>
          ${title}
        </h2>
        ${renderContent()}
      </div>
    </div>
  `;
}
