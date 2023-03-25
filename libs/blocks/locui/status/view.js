import { html } from '../../../deps/htm-preact.js';
import { statuses } from '../utils/state.js';

function Toast({ status }) {
  return html`
    <div class="locui-status-toast locui-status-toast-type-${status.type}">
      <div class=locui-status-toast-content>
        <span class=locui-status-toast-content-type>${status.type}</span>
        <span class=locui-status-toast-text>${status.text}</span>
      </div>
    </div>
  `;
}

export default function Status() {
  const statusArr = Object.keys(statuses.value).map((key) => statuses.value[key]);
  return html`
    <div class=locui-status-toast-section>
      ${statusArr.map((status) => status && html`<${Toast} status=${status} />`)}
    </div>
  `;
}
