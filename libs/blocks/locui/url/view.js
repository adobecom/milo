import { html } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Tabs from './tabs.js';

export default function Url({ suffix, item }) {
  const sourcePath = item.pathname;
  const langstorePath = item.langstore?.pathname;
  let hasError;
  if (item.valid === undefined) {
    // if not validated (LANGSTORE, locale) then get validation status from urls
    const match = urls.value.find((url) => sourcePath.endsWith(url.pathname)
      || url.langstore.pathname.endsWith(langstorePath));
    hasError = typeof match.valid === 'string' ? match.valid : false;
  } else {
    hasError = typeof item.valid === 'string' ? item.valid : false;
  }
  return html`
    <li class="locui-url${hasError ? ' error' : ''}">
      <h3 class=locui-url-label>Path</h3>
      <p class=locui-url-path>${sourcePath}${hasError ? html`<span>${hasError}</span>` : ''}</p>
      <div class="locui-url-tab-group locui-url-tab-group-cols-${suffix.length}">
        <${Tabs} suffix=${suffix[0]} path=${sourcePath} hasError=${hasError} />
        ${langstorePath && html`
          <${Tabs} suffix=${suffix[1]} path=${langstorePath} hasError=${hasError} />
        `}
      </div>
    </li>
  `;
}
