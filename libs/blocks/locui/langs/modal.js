import { html, render } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';
import { origin } from '../utils/franklin.js';
import { renderLinks } from '../status/view.js';

function Modal({ lang, prefix, type }) {
  const localeUrls = urls.value.map(
    (url) => new URL(`${origin}/${prefix}${url.pathname}`),
  );

  if (type === 'error') {
    const { statusText, errors } = lang;
    return html`
      <h2><span class="error-icon" /> ${statusText}</h2>
      <p>Errors reported for <i><strong>${lang.Language}</strong>:</i></p>
      <ol>${errors.map((err) => html`<li>${renderLinks(err)}</li>`)}</ol>
    `;
  }

  if (type === 'warning') {
    const { warnings } = lang;
    return html`
      <h2 class="warning-heading"><span class="warning-icon" /> Warnings</h2>
      <p>Warnings reported for <i><strong>${lang.Language}</strong>:</i></p>
      <ol>${warnings.map((err) => html`<li>${err}</li>`)}</ol>
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

export default function renderModal(el, lang, prefix, type = 'lang') {
  render(html`<${Modal} lang=${lang} prefix=${prefix} type=${type} />`, el);
  return el;
}
