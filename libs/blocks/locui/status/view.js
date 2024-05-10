import { html } from '../../../deps/htm-preact.js';
import { statuses } from '../utils/state.js';

function toggleDesc(e) {
  e.target.closest('.locui-status-toast').classList.toggle('open');
}

function renderMessage(description) {
  let message = description;
  if (Array.isArray(description) && description.length > 1) {
    message = html`<ol>${description.map((desc) => html`<li>${desc}</li>`)}</ol>`;
  }
  return message;
}

function Toast({ status }) {
  return html`
    <div class="locui-status-toast locui-status-toast-type-${status.type}
      ${status.description && 'has-description'}">
      <div class=locui-status-toast-content onClick=${toggleDesc}>
        <span class=locui-status-toast-content-type>${status.type}</span>
        <span class=locui-status-toast-text>${status.text}</span>
        <div class=locui-status-toast-expand>Expand</div>
      </div>
      ${status.description && html`
        <p class=locui-status-toast-description>${renderMessage(status.description)}</p>`}
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
