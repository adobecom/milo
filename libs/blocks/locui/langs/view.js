import { html, useState } from '../../../deps/htm-preact.js';
import { languages } from '../utils/state.js';
import { rollout, showLangErrors, showLangWarnings, showUrls } from './index.js';

function getPrettyStatus({ status, queued } = {}) {
  switch (status) {
    case 'translated':
      return 'Rollout ready';
    case 'in-progress':
      return 'In progress';
    case 'rolling-out':
      return 'Rolling out';
    case 'error':
      return `${queued ? 'In Rollout Queue' : status}`;
    default:
      return status;
  }
}

function Badge(props) {
  const prettyStatus = getPrettyStatus(props);
  if (!prettyStatus) return null;
  return html`<div class=locui-subproject-badge>${prettyStatus}</div>`;
}

function langActionProps(lang) {
  let showAction = ['translated', 'completed', 'error'].includes(lang.status);
  let actionType = lang.status === 'completed' ? 'Re-rollout' : 'Rollout';
  const hasError = lang.status === 'error';
  if (showAction && lang.rolloutQueued) {
    showAction = !hasError;
  }
  if (hasError) {
    actionType = 'Retry';
  }
  return [showAction, actionType];
}

function Language({ item, idx }) {
  const [didRetry, setDidRetry] = useState(false);
  const hasLocales = item.locales?.length > 0;
  const cssStatus = `locui-subproject-${item.status || 'not-started'}`;

  const onRollout = (e) => {
    if (item.status === 'error') {
      e.stopPropagation();
      setDidRetry(true);
    }
    rollout(item, idx);
  };

  const [showAction, actionType] = langActionProps(item);

  return html`
    <li class="locui-subproject ${cssStatus}" onClick=${(e) => showLangErrors(e, item)}>
      ${item.status && html`<${Badge} status=${item.status} queued=${didRetry ? item.rolloutQueued : false} />`}
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
          <p class=locui-project-label>${item.statusText}</p>
          <div class=locui-project-name-totals>
            <h3 class=locui-subproject-name>${item.done}</h3>
            ${item.total > 0 && html`
              <h4 class=locui-subproject-of>of</h4>
              <h4 class=locui-subproject-name>${item.total}</h3>
            `}
          </div>
        </div>
        `}
      </div>
      ${hasLocales && html`
        <p class=locui-project-label>Locales</p>
        <div class=locui-subproject-locales>
          <button class=locui-subproject-locale onClick=${() => showUrls(item, `langstore/${item.code}`)}>
            Langstore
          </button>
          ${item.locales.map((locale) => html`
            <button class=locui-subproject-locale onClick=${() => showUrls(item, locale)}>
              ${locale}
            </button>
          `)}
        </div>
      `}
      ${item.warnings?.length > 0 && html`
        <div class=locui-urls-heading-warnings onClick=${() => showLangWarnings(item)}>
          <span class="warning-icon" /> Warning${item.warnings.length > 1 ? 's' : ''}
        </div>`}
      ${showAction && html`
        <div class=locui-subproject-action-area>
          <button class="locui-urls-heading-action ${item.status}" onClick=${(e) => onRollout(e)}>
            ${actionType}
          </button>
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
