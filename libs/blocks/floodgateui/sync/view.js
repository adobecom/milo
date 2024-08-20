import { html } from '../../../deps/htm-preact.js';
import { serviceStatus, heading } from '../utils/state.js';
import { showContents, getPrettyDate, toggleContent } from './index.js';

export default function Sync() {
  const prettyDate = getPrettyDate();
  const prettySync = serviceStatus.value.replace(/[\W_]+/g, '-');
  const connectedTo = heading.value.env ? `${serviceStatus} (${heading.value.env})` : serviceStatus;

  return html`
    <div class=fgui-sync-badge-container>
      <div class="fgui-sync-badge fgui-sync-badge-status-${prettySync}">
        <button class=fgui-sync-badge-header onClick=${toggleContent}>${connectedTo}</button>
        ${showContents.value && html`
          <div class=fgui-sync-badge-content>Last sync: <span class=fgui-sync-badge-mono>${prettyDate[1]}</span></div>
        `}
      </div>
    </div>
  `;
}
