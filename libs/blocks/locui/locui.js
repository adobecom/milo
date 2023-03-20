import { html, render, useEffect } from '../../deps/htm-preact.js';
import { getProjectHeading, loadDetails, loadLocales } from './utils/utils.js';
import { status, heading, languages, urls } from './utils/state.js';

import Langs from './langs/ui.js';
import Urls from './urls/ui.js';

const LOC_NAME = 'Milo Localization';

async function setDetails() {
  await getProjectHeading();
  await loadDetails();
  await loadLocales();
}

function Localization() {
  useEffect(() => { setDetails(); }, []);

  const hasLanguages = languages.value.length > 0;
  const hasUrls = urls.value.length > 0;

  return html`
      <h1>${LOC_NAME}</h1>
      <div class=locui-project-heading>
        <div class=locui-project-heading-column>
          <h2 class=locui-section-label>Project</h2>
          <div class=locui-project-details-name>
            <span>${heading.value.name}</span>
            ${heading.value.editUrl
              && html`<a class=locui-project-details-edit href="${heading.value.editUrl}" target="_blank">Edit</a>`}
          </div>
        </div>
      </div>

      ${hasLanguages && html`<${Langs} />`}

      ${hasUrls && html`<${Urls} urls=${urls.value} />`}

      ${status.value.text && html`
        <div class="locui-status-toast-section locui-status-toast-type-${status.value.type}">
          <div class=locui-status-toast-content>
            <span class=locui-status-toast-content-type>${status.value.type}</span>
            <span class=locui-status-toast-text>${status.value.text}</span>
          </div>
        </div>
      `}
  `;
}

export default function init(el) {
  render(html`<${Localization} />`, el);
}
