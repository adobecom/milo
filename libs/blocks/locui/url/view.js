import { html } from '../../../deps/htm-preact.js';
import Tabs from './tabs.js';

export default function Url({ suffix, item }) {
  const sourcePath = item.pathname;
  const langstorePath = item.langstore?.pathname;

  return html`
    <li class="locui-url${!item.valid ? ' error' : ''}">
      <h3 class=locui-url-label>Path</h3>
      <p class=locui-url-path>${sourcePath}${!item.valid ? html`<span>NOT FOUND</span>` : ''}</p>
      <div class="locui-url-tab-group locui-url-tab-group-cols-${suffix.length}">
        <${Tabs} suffix=${suffix[0]} path=${sourcePath} />
        ${langstorePath && html`
          <${Tabs} suffix=${suffix[1]} path=${langstorePath} />
        `}
      </div>
    </li>
  `;
}
