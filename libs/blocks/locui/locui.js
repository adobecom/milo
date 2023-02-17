import { html, render, signal, useEffect } from '../../deps/htm-preact.js';
import { getProjectHeading, getProjectDetails } from './utils/utils.js';

const LOC_NAME = 'Milo Localization';

const status = signal('Getting project name');
const heading = signal({ name: '' });
const subProjects = signal([]);
const urls = signal([]);

async function setDetails() {
  heading.value = await getProjectHeading();
  status.value = 'Getting sub-projects';
  const { languages, paths } = await getProjectDetails();
  subProjects.value = languages;
  urls.value = paths;
  status.value = null;
}

function UrlItem({ item }) {
  return html`<li class=locui-url>${item}</li>`;
}

function SubProject({ item }) {
  console.log(item);
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
        <h2 class=locui-project-label>Project</h2>
        <div class=locui-project-details-name>
          <span>${heading.value.name}</span>
          ${heading.value.editUrl
            && html`<a class=locui-project-details-edit href="${heading.value.editUrl}" target="_blank">Edit</a>`}
        </div>
      </div>
      ${status.value && html`
        <div class=locui-project-heading-column>
          <h2 class=locui-project-label>Status</h2>
          <div class=locui-project-details>
            <span>${status.value}</span>
          </div>
        </div>
      `}
    </div>

    ${hasProjects && html`
      <h2 class=locui-project-label>Sub Projects</h2>
      <ul class=locui-subprojects>
        ${subProjects.value.map((proj) => html`<${SubProject} item=${proj} />`)}
      </ul>
    `}

    ${hasUrls && html`
      <h2>URLs</h2>
      <ul class=locui-urls>
        ${urls.value.map((url) => html`<${UrlItem} item=${url} />`)}
      </ul>
    `}
  `;
}

export default function init(el) {
  render(html`<${Localization} />`, el);
}
