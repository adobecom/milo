import { html } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';

export default function Urls() {
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>URLs</h2>
      </div>
      <ul class=locui-urls>
        ${urls.value.map((url, idx) => html`<${Url} item=${url} key=${idx} idx=${idx} />`)}
      </ul>
    </div>
  `;
}
