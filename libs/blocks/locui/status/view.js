import { html } from '../../../deps/htm-preact.js';
import { statuses } from '../utils/state.js';

function toggleDesc(e) {
  e.target.closest('.locui-status-toast').classList.toggle('open');
}

export function renderLinks(str) {
  const linkPattern = /\[(.*?)\]\((.*?)\)/g;
  const link = linkPattern.exec(str);
  if (link) {
    const msg = str.replace(linkPattern, '');
    const [text, href] = link.slice(1);
    return html`
      <span>
        ${msg.substring(0, link.index)}
        <a href="${href}" target="_blank">${text}</a>
        ${msg.substring(link.index, msg.length)} 
      </span>`;
  }
  return str;
}

function renderDescription(description) {
  let message = description;
  if (Array.isArray(description)) {
    if (description.length > 1) {
      message = html`<ol>${description.map((desc) => html`<li>${renderLinks(desc)}</li>`)}</ol>`;
    } else return renderLinks(message[0]);
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
        ${status.description && html`<div class=locui-status-toast-expand>Expand</div>`}
      </div>
      ${status.description && html`
        <p class=locui-status-toast-description>${renderDescription(status.description)}</p>`}
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
