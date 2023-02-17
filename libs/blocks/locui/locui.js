import { html, render, signal, useEffect } from '../../deps/htm-preact.js';
import { getProjectHeading, getProjectDetails } from './utils/utils.js';

const LOC_NAME = 'Milo Localization';

const heading = signal({ name: 'Getting Information' });
const subProjects = signal([]);
const urls = signal([]);

async function setDetails() {
  heading.value = await getProjectHeading();
  const { languages, paths } = await getProjectDetails();
  subProjects.value = languages;
  urls.value = paths;
}

function UrlItem({ item }) {
  return html`<li class=locui-url>${item}</li>`;
}

function SubProject({ item }) {
  return html`
    <li class=locui-subproject>
    <p class=locui-subproject-label>Language</p>
    <h3 class=locui-subproject-name>${item.Language}</h3>
    <p class=locui-subproject-label>Action</p>
    <h3 class=locui-subproject-name>${item.Action}</h3>
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
    <div class=locui-project-details>
      <span class=locui-project-details-name>
        ${heading.value.name}
      </span>
      ${heading.value.editUrl
        && html`<a href="${heading.value.editUrl}" target="_blank">Edit</a>`}
    </div>

    ${hasProjects && html`
      <h2>Sub Projects</h2>
      <ul class=locui-subprojects>
        ${subProjects.value.map((proj) => html`<${SubProject} item=${proj} />`)}
      </ul>
    `}
    ${!hasProjects && html`
      <h2>Getting projects</h2>
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
