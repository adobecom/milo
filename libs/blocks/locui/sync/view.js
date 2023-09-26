import { html } from '../../../deps/htm-preact.js';
import { serviceStatus, heading } from '../utils/state.js';

export default function Sync() {
  const prettySync = serviceStatus.value.replace(/[\W_]+/g, '-');
  const connectedTo = heading.value.env ? `${serviceStatus} (${heading.value.env})` : serviceStatus;

  return html`
    <div class=locui-sync-badge-container>
      <div class="locui-sync-badge locui-sync-badge-status-${prettySync}">
        <div class=locui-sync-badge-header>${connectedTo}</div>
        <div class=locui-sync-badge-content>Monday</div>
      </div>
    </div>
  `;
}
