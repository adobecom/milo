import { html, render, useEffect } from '../../deps/htm-preact.js';
import { getProjectHeading, loadDetails, loadLocales } from './utils/utils.js';
import { heading, languages, urls } from './utils/state.js';

import Heading from './heading/view.js';
import Langs from './langs/view.js';
import Urls from './urls/view.js';
import Status from './status/view.js';
import loginToSharePoint from './utils/sp.js';

const LOC_NAME = 'Milo Localization';

async function setDetails() {
  loginToSharePoint();
  await getProjectHeading();
  await loadDetails();
  await loadLocales();
}

function Localization() {
  useEffect(() => { setDetails(); }, []);

  return html`
    <h1>${LOC_NAME}</h1>
    ${heading.value.editUrl && html`<${Heading} />`}
    ${languages.value.length > 0 && html`<${Langs} />`}
    ${urls.value.length > 0 && html`<${Urls} />`}
    <${Status} />`;
}

export default function init(el) {
  render(html`<${Localization} />`, el);
}
