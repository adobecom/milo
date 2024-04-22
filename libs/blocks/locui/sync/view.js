import { html } from '../../../deps/htm-preact.js';
import { serviceStatus, heading } from '../utils/state.js';
import { showContents, getPrettyDate, toggleContent } from './index.js';

function isSidekickOpen() {
  const sidekick = document.querySelector('helix-sidekick');
  return !!sidekick;
}

export default function Sync() {
  const prettyDate = getPrettyDate();
  const prettySync = serviceStatus.value.replace(/[\W_]+/g, '-');
  const connectedTo = heading.value.env ? `${serviceStatus} (${heading.value.env})` : serviceStatus;
  const sidekickOpen = isSidekickOpen() ? ' push-down' : '';

  return html`
    <div class="locui-sync-badge-container${sidekickOpen}">
      <div class="locui-sync-badge locui-sync-badge-status-${prettySync}">
        <button class=locui-sync-badge-header onClick=${toggleContent}>${connectedTo}</button>
        ${showContents.value && html`
          <div class=locui-sync-badge-content>Last sync: <span class=locui-sync-badge-mono>${prettyDate[1]}</span></div>
        `}
      </div>
    </div>
  `;
}
