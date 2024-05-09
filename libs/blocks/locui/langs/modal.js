import { html, render } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';
import { getStatus, origin } from '../utils/franklin.js';

async function openFile(e, path) {
  e.target.classList.add('locui-action-loading');
  const details = await getStatus(path);
  e.target.classList.remove('locui-action-loading');
  if (details.edit.url) window.open(details.edit.url, '_blank');
}

function getErrorLink(error) {
  const path = error.substring(error.indexOf('/'), error.lastIndexOf('.docx'));
  const fileURL = urls.value.find((url) => path.includes(url.pathname));
  if (fileURL) {
    return html`
      <button 
        onClick="${(e) => { openFile(e, fileURL.pathname); }}" class="locui-urls-heading-action">
        Open File
      </button>`;
  }
  return '';
}

function Modal({ lang, prefix, error }) {
  const localeUrls = urls.value.map(
    (url) => new URL(`${origin}/${prefix}${url.pathname}`),
  );

  if (error) {
    const { statusText, errors } = lang;
    return html`
      <h2><span class="error-icon" /> ${statusText}</h2>
      <p>Errors reported for <i><strong>${lang.Language}</strong>:</i></p>
      <ol>${errors.map((err) => html`<li><span>${err}${getErrorLink(err)}</span></li>`)}</ol>
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

export default function renderModal(el, lang, prefix, error = false) {
  render(html`<${Modal} lang=${lang} prefix=${prefix} error=${error} />`, el);
  return el;
}
