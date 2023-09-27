import { html, render, signal, useEffect } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';
import { origin } from '../utils/franklin.js';

const localeUrls = signal([]);

function Modal({ lang, prefix }) {
  useEffect(() => {
    localeUrls.value = urls.value.map((url) => {
      return new URL(`${origin}/${prefix}${url.pathname}`);
    });
  }, [prefix]);

  return html`
    <h2>${lang.Language} (${prefix})</h2>
    <ul class=locui-urls>
      ${localeUrls.value.map((url, idx) => html`<${Url} item=${url} key=${idx} idx=${idx} />`)}
    </ul>
  `;
}

export default function renderModal(el, lang, prefix) {
  render(html`<${Modal} lang=${lang} prefix=${prefix} />`, el);
  return el;
}
