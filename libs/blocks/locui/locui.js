import { html, render, signal, useEffect } from '../../deps/htm-preact.js';
import { getProjectHeading, getProjectDetails, getUrlDetails } from './utils/utils.js';

const LOC_NAME = 'Milo Localization';

const status = signal('Getting project name');
const heading = signal({ name: '' });
const subProjects = signal([]);
const urls = signal([]);

async function setDetails() {
  heading.value = await getProjectHeading();

  status.value = 'Getting languages';
  const { languages, projectUrls } = await getProjectDetails();
  subProjects.value = languages;
  // Update the UI with basic URL info
  urls.value = projectUrls;

  // Fetch full URL details
  status.value = 'Getting URL details';
  urls.value = await getUrlDetails(projectUrls);
  // status.value = null;
}

function UrlItem({ item }) {
  return html`
    <li class=locui-url>
      <div class=locui-url-details>
        <h3 class=locui-url-label>Path</h3>
        <p class=locui-url-path>${item.pathname}</p>
        <div class=locui-url-actions>
          <div class=locui-url-source>
            <h3 class=locui-url-label>Source</h3>
            <div class=locui-url-source-actions>
              <a class="locui-url-action locui-url-action-edit" href="#">Edit</a>
              <a class="locui-url-action locui-url-action-preview" href="#">Preview</a>
              <a class="locui-url-action locui-url-action-live" href="#">Live</a>
            </div>
          </div>
          <div class=locui-url-langstore>
            <h3 class=locui-url-label>Langstore (${item.langstore.lang})</h3>
          </div>
        </div>
      </div>
      <div class=locui-url-dates>
        <h3 class=locui-url-label>Details</h3>
      </div>
    </li>
    `;
}

function SubProject({ item }) {
  return html`
    <li class=locui-subproject>
      <p class=locui-project-label>Language</p>
      <h3 class=locui-subproject-name>${item.Language}</h3>
      <p class=locui-project-label>Action</p>
      <h3 class=locui-subproject-name>${item.Action}</h3>
      <p class=locui-project-label>Items</p>
      <h3 class=locui-subproject-name>${item.size}</h3>
    </li>
  `;
}

function Localization() {
  useEffect(() => {
    setDetails();
  }, []);

  const hasProjects = subProjects.value.length > 0;
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
      ${status.value && html`
        <div class=locui-project-heading-column>
          <h2 class=locui-section-label>Status</h2>
          <div class=locui-project-details>
            <span>${status.value}</span>
          </div>
        </div>
      `}
    </div>

    ${hasProjects && html`
      <h2 class=locui-section-label>Languages</h2>
      <ul class=locui-subprojects>
        ${subProjects.value.map((proj) => html`<${SubProject} item=${proj} />`)}
      </ul>
    `}

    ${hasUrls && html`
      <h2 class=locui-section-label>URLs</h2>
      <ul class=locui-urls>
        ${urls.value.map((url) => html`<${UrlItem} item=${url} />`)}
      </ul>
    `}
  `;
}

export default function init(el) {
  render(html`<${Localization} />`, el);
}
