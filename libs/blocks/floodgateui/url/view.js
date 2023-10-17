import { html } from '../../../deps/htm-preact.js';
import Tabs from './tabs.js';

export default function Url({ suffix, item, idx}) {
  const sourcePath = item.pathname;
  const floodgatePath = item.langstore?.pathname;
  return html`
    <li class=locui-url>
      <h3 class=locui-url-label>Path</h3>
      <p class=locui-url-path>${sourcePath}</p>
      <div class="locui-url-tab-group locui-url-tab-group-cols-${suffix.length}">
        <${Tabs} suffix=${suffix[0]} path=${sourcePath} idx=${idx} />
        ${floodgatePath && html`
          <${Tabs} suffix=${suffix[1]} path=${floodgatePath} idx=${idx}/>
        `}
      </div>
    </li>
  `;
}
