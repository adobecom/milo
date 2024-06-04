import { html } from '../../../deps/htm-preact.js';
import Tabs from './tabs.js';

export default function Url({ suffix, item }) {
  const sourcePath = item.pathname;
  const langstorePath = item.langstore?.pathname;
  const urlHasError = item.valid !== undefined && !item.valid;

  return html`
    <li class="locui-url${urlHasError ? ' error' : ''}">
      <h3 class=locui-url-label>Path</h3>
      <p class=locui-url-path>${sourcePath}${urlHasError ? html`<span>NOT FOUND</span>` : ''}</p>
      <div class="locui-url-tab-group locui-url-tab-group-cols-${suffix.length}">
        <${Tabs} suffix=${suffix[0]} path=${sourcePath} />
        ${langstorePath && html`
          <${Tabs} suffix=${suffix[1]} path=${langstorePath} />
        `}
      </div>
    </li>
  `;
}
