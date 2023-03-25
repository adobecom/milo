import { html, useEffect } from '../../../deps/htm-preact.js';
import setActions from './index.js';

function handleAction(url) {
  window.open(url, '_blank');
}

function Actions({ label, parent }) {
  return html`
    <h3 class=locui-url-label>${label}</h3>
    <div class=locui-url-source-actions>
      <button
        disabled=${parent.actions?.edit?.status !== 200}
        class="locui-url-action locui-url-action-edit"
        onClick=${() => { handleAction(parent.actions?.edit.url); }}>Edit</button>
      <button
        disabled=${parent.actions?.preview?.status !== 200}
        class="locui-url-action locui-url-action-view"
        onClick=${() => { handleAction(parent.actions?.preview.url); }}>Preview</button>
      <button
        disabled=${parent.actions?.live?.status !== 200}
        class="locui-url-action locui-url-action-view"
        onClick=${() => { handleAction(parent.actions?.live.url); }}>Live</button>
    </div>
  `;
}

export default function Url({ item, idx }) {
  useEffect(() => { setActions(idx); }, [idx]);
  return html`
    <li class=locui-url>
      <div class=locui-url-details>
        <h3 class=locui-url-label>Path</h3>
        <p class=locui-url-path>${item.pathname}</p>
        <div class=locui-url-actions>
          <div class=locui-url-source>
            <${Actions} label=Source parent=${item} />
          </div>
          <div class=locui-url-langstore>
            <${Actions} label="Langstore (${item.langstore.lang})" parent=${item.langstore} />
          </div>
        </div>
      </div>
      <div class=locui-url-dates>
        <h3 class=locui-url-label>Details</h3>
      </div>
    </li>
  `;
}
