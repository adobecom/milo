import { html, render } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';
import { origin } from '../utils/franklin.js';

function Modal({ lang, prefix, error }) {
  const localeUrls = urls.value.map(
    (url) => new URL(`${origin}/${prefix}${url.pathname}`),
  );

  if (error) {
    const { statusText, errors } = lang;
    return html`
      <h2><span class="error-icon" /> ${statusText}</h2>
      <p>Errors reported for this language:</p>
      <ol class=locui-urls>
        ${errors.map((err) => html`<li>${err}</li>`)}
      </ol>
    `;
  }

  return html`
    <h2>${lang.Language} (${prefix})</h2>
    <ul class=locui-urls>
      ${localeUrls.map((url, idx) => html`
        <${Url} item=${url} key=${idx} idx=${idx} suffix=${[prefix]} />
      `)}
    </ul>
  `;
}

export default function renderModal(el, lang, prefix, error = null) {
  render(html`<${Modal} lang=${lang} prefix=${prefix} error=${error} />`, el);
  return el;
}
