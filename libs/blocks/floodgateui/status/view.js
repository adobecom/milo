import { html } from '../../../deps/htm-preact.js';
import { statuses } from '../utils/state.js';

function toggleDesc(e) {
  e.target.closest('.fgui-status-toast').classList.toggle('open');
}

function Toast({ status }) {
  return html`
    <div onClick=${toggleDesc}
      class="fgui-status-toast fgui-status-toast-type-${status.type}
      ${status.description && 'has-description'}">
      <div class=fgui-status-toast-content>
        <span class=fgui-status-toast-content-type>${status.type}</span>
        <span class=fgui-status-toast-text>${status.text}</span>
      </div>
      ${status.description && html`
        <p class=fgui-status-toast-description>${status.description}</p>
        <div class=fgui-status-toast-expand>Expand</div>`}
    </div>
  `;
}

export default function Status() {
  const statusArr = Object.keys(statuses.value).map((key) => statuses.value[key]);
  return html`
    <div class=fgui-status-toast-section>
      ${statusArr.map((status) => status && html`<${Toast} status=${status} />`)}
    </div>
  `;
}
