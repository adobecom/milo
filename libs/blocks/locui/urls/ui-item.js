import { html, signal, useEffect } from '../../../deps/htm-preact.js';
import { status } from '../utils/state.js';

const details = signal({});
const langstore = signal({});

function handleEdit() {
  status.value = { type: 'error', text: 'testing 123' };
}

export default function UrlItem({ item }) {
  useEffect(() => {
    details.value = item;
    langstore.value = item.langstore;
  }, [item]);

  return html`
    <li class=locui-url>
      <div class=locui-url-details>
        <h3 class=locui-url-label>Path</h3>
        <p class=locui-url-path>${details.value.pathname}</p>
        <div class=locui-url-actions>
          <div class=locui-url-source>
            <h3 class=locui-url-label>Source</h3>
            <div class=locui-url-source-actions>
              <button
                class="locui-url-action locui-url-action-edit"
                onClick=${handleEdit}>Edit</button>
              <button class="locui-url-action locui-url-action-view">Preview</button>
              <button class="locui-url-action locui-url-action-view">Live</button>
            </div>
          </div>
          <div class=locui-url-langstore>
            <h3 class=locui-url-label>Langstore (${langstore.value.lang})</h3>
            <div class=locui-url-source-actions>
              <button class="locui-url-action locui-url-action-edit">Edit</button>
              <button class="locui-url-action locui-url-action-view">Preview</button>
              <button class="locui-url-action locui-url-action-view">Live</button>
            </div>
          </div>
        </div>
      </div>
      <div class=locui-url-dates>
        <h3 class=locui-url-label>Details</h3>
      </div>
    </li>
  `;
}
