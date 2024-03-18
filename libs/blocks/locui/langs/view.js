import { html } from '../../../deps/htm-preact.js';
import { languages } from '../utils/state.js';
import { rollout, showLangErrors, showUrls } from './index.js';

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

function Language({ item, idx }) {
  const hasLocales = item.locales?.length > 0;
  const cssStatus = `locui-subproject-${item.status || 'not-started'}`;
  const completeType = item.status === 'translated' || item.status === 'in-progress' ? 'Translated' : 'Rolled out';
  const total = item.locales?.length && completeType === 'Rolled out' ? item.locales.length * item.size : null;
  const rolloutType = item.status === 'completed' ? 'Re-rollout' : 'Rollout';
  return html`
    <li class="locui-subproject ${cssStatus}" onClick=${(e) => showLangErrors(e, item)}>
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
          <p class=locui-project-label>${completeType}</p>
          <div class=locui-project-name-totals>
            <h3 class=locui-subproject-name>${item.done}</h3>
            ${total > 0 && html`
              <h4 class=locui-subproject-of>of</h4>
              <h4 class=locui-subproject-name>${total}</h3>
            `}
          </div>
        </div>
        `}
      </div>
      ${hasLocales && html`
        <p class=locui-project-label>Locales</p>
        <div class=locui-subproject-locales>
          <button class=locui-subproject-locale onClick=${() => showUrls(item, `langstore/${item.code}`)}>Langstore</button>
          ${item.locales.map((locale) => html`
            <button class=locui-subproject-locale onClick=${() => showUrls(item, locale)}>${locale}</button>
          `)}
        </div>
      `}
      ${(item.status === 'translated' || item.status === 'completed') && html`
        <div class=locui-subproject-action-area>
          <button class=locui-urls-heading-action onClick=${() => rollout(item, idx)}>${rolloutType}</button>
        </div>
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
        ${languages.value.map((proj, idx) => html`<${Language} item=${proj} key=${idx} idx=${idx} />`)}
      </ul>
    </div>
  `;
}
