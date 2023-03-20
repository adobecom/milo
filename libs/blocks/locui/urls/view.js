import { html } from '../../../deps/htm-preact.js';
import UrlItem from './ui-item.js';

export default function Urls({ urls }) {
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>URLs</h2>
      </div>
      <ul class=locui-urls>
        ${urls.map((url) => html`<${UrlItem} item=${url} />`)}
      </ul>
    </div>
  `;
}
