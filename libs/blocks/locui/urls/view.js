import { html } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import UrlItem from './ui-item.js';

export default function Urls() {
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>URLs</h2>
      </div>
      <ul class=locui-urls>
        ${urls.value.map((url) => html`<${UrlItem} item=${url} />`)}
      </ul>
    </div>
  `;
}
