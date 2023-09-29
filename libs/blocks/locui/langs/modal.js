import { html, render } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';
import { origin } from '../utils/franklin.js';

function Modal({ lang, prefix }) {
  const localeUrls = urls.value.map(
    (url) => new URL(`${origin}/${prefix}${url.pathname}`),
  );

  return html`
    <h2>${lang.Language} (${prefix})</h2>
    <ul class=locui-urls>
      ${localeUrls.map((url, idx) => html`
        <${Url} item=${url} key=${idx} idx=${idx} suffix=${[prefix]} />
      `)}
    </ul>
  `;
}

export default function renderModal(el, lang, prefix) {
  render(html`<${Modal} lang=${lang} prefix=${prefix} />`, el);
  return el;
}
