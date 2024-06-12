import { html } from '../../../deps/htm-preact.js';
import { statuses } from '../utils/state.js';
import errorLinks from './index.js';

function toggleDesc(e) {
  e.target.closest('.locui-status-toast').classList.toggle('open');
}

function Description({ status }) {
  const { description, type } = status;
  if (!description) return '';
  let message;
  if (Array.isArray(description)) {
    if (description.length > 1) {
      message = html`<ol>${description.map((desc) => html`
        <li>${errorLinks(desc, type)}</li>`)}</ol>`;
    } else {
      message = errorLinks(message[0], type);
    }
  } else {
    message = errorLinks(description, type);
  }
  return html`<p class=locui-status-toast-description>${message}</p>`;
}

function Toast({ status }) {
  return html`
    <div class="locui-status-toast locui-status-toast-type-${status.type}
      ${status.description && 'has-description'}">
      <div class=locui-status-toast-content onClick=${toggleDesc}>
        <span class=locui-status-toast-content-type>${status.type}</span>
        <span class=locui-status-toast-text>${status.text}</span>
        ${status.description && html`<div class=locui-status-toast-expand>Expand</div>`}
      </div>
      <${Description} status=${status} />
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
