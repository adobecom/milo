import { html } from '../../../deps/htm-preact.js';
import { languages } from '../utils/state.js';
import rollout from './index.js';

function getPrettyStatus(status) {
  switch (status) {
    case 'translated':
      return 'Rollout ready';
    case 'in-progress':
      return 'In progress';
    case 'rolling-out':
      return 'Rolling out';
    default:
      return status;
  }
}

function Badge({ status }) {
  const prettyStatus = getPrettyStatus(status);
  if (!prettyStatus) return null;
  return html`<div class=locui-subproject-badge>${prettyStatus}</div>`;
}

function Language({ item }) {
  const hasLocales = item.locales?.length > 0;
  const cssStatus = `locui-subproject-${item.status || 'not-started'}`;

  return html`
    <li class="locui-subproject ${cssStatus}">
      ${item.status && html`<${Badge} status=${item.status} />`}
      <p class=locui-project-label>Language</p>
      <h3 class=locui-subproject-name>${item.Language}</h3>
      <p class=locui-project-label>Action</p>
      <h3 class=locui-subproject-name>${item.Action}</h3>
      <div class=locui-subproject-items>
        <div>
          <p class=locui-project-label>Items</p>
          <h3 class=locui-subproject-name>${item.size}</h3>
        </div>
        ${item.done > 0 && html`
        <div>
          <p class=locui-project-label>Complete</p>
          <h3 class=locui-subproject-name>${item.done}</h3>
        </div>
        `}
      </div>
      ${hasLocales && html`
        <p class=locui-project-label>Locales</p>
        <div class=locui-subproject-locales>
          ${item.locales.map((locale) => html`<span class=locui-subproject-locale>${locale}</span>`)}
        </div>
      `}
      ${item.status === 'translated' && html`
        <button class=locui-urls-heading-action onClick=${() => rollout(item)}>Rollout</button>
      `}
    </li>
  `;
}

export default function Langs() {
  return html`
    <div class=locui-section>
      <div class=locui-section-heading>
        <h2 class=locui-section-label>Languages</h2>
      </div>
      <ul class=locui-subprojects>
        ${languages.value.map((proj) => html`<${Language} item=${proj} />`)}
      </ul>
    </div>
  `;
}
