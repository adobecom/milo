import { html } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Tabs from './tabs.js';

export default function Url({ suffix, item, idx }) {
  const sourcePath = item.pathname;
  const floodgatePath = item.langstore?.pathname;
  let hasError;
  if (item.valid === undefined) {
    // if not validated (LANGSTORE, locale) then get validation status from urls
    const match = urls.value.find((url) => sourcePath.endsWith(url.pathname)
      || url.langstore.pathname.endsWith(floodgatePath));
    hasError = typeof match.valid === 'string' ? match.valid : false;
  } else {
    hasError = typeof item.valid === 'string' ? item.valid : false;
  }
  return html`
    <li class=fgui-url${hasError ? ' error' : ''}>
      <h3 class=fgui-url-label>Path</h3>
      <p class=fgui-url-path>${sourcePath}${hasError ? html`<span>${hasError}</span>` : ''}</p>
      <div class="fgui-url-tab-group fgui-url-tab-group-cols-${suffix.length}">
        <${Tabs} suffix=${suffix[0]} path=${sourcePath} hasError=${hasError} idx=${idx} />
        ${floodgatePath && html`
          <${Tabs} suffix=${suffix[1]} path=${floodgatePath} hasError=${hasError} idx=${idx}/>
        `}
      </div>
    </li>
  `;
}
