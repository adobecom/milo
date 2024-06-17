import { html, render } from '../../../deps/htm-preact.js';
import { urls } from '../utils/state.js';
import Url from '../url/view.js';
import { origin } from '../utils/franklin.js';
import { getSkippedFileWarnings } from './index.js';
import errorLinks from '../status/index.js';

function Modal({ lang, prefix, type }) {
  const localeUrls = urls.value.map(
    (url) => new URL(`${origin}/${prefix}${url.pathname}`),
  );

  if (type === 'error') {
    const { statusText, errors } = lang;
    return html`
      <h2><span class="error-icon" /> ${statusText}</h2>
      <p>Errors reported for <i><strong>${lang.Language}</strong>:</i></p>
      <ol>${errors.map((err) => html`<li>${errorLinks(err, 'error')}</li>`)}</ol>
    `;
  }

  if (type === 'skipped') {
    const skipped = getSkippedFileWarnings(lang);
    return html`
      <h2 class="skipped-heading">
        <span class="skipped-icon" /> Skipped Items during rollout <i>- ${lang.Language}</i>
      </h2>
      <p>Files that already exist in the langstore are skipped because of the project configuration.
        If you would like file updates to be merged on rollout you will need to <i>start a new project</i> with the correct regional edit behavior (merge). <a href="https://milo.adobe.com/docs/authoring/localization#:~:text=2.Regional.edit.behavior%3A" target="_blank">Learn more</a></p>
      <ol>${skipped.map((err) => html`<li>${err}</li>`)}</ol>
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
