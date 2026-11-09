import { createTag, getMetadata } from '../../utils/utils.js';
import { foundDisableValues, getDynamicNavState } from './dynamic-navigation.js';

export const ACTIVE = 'active';
export const ENABLED = 'enabled';
export const INACTIVE = 'inactive';
export const RESET = 'reset';
export const tooltipInfo = {
  active: 'Displayed in green, this status appears when a user is on an entry page or a page with the Dynamic Nav enabled, indicating that the nav is fully functioning.',
  enabled: 'Displayed in yellow, this status indicates that the Dynamic Nav is set to "on," but the user has not yet visited an entry page.',
  inactive: 'Displayed in red, this status indicates that the Dynamic Nav is either not configured or has been disabled.',
  reset: 'Displayed in grey, this status indicates that this page resets the Dynamic Nav.',
};

const COOKIE_SCOPE_LABEL = {
  prod: 'Shared across adobe.com',
  stage: 'Shared across stage.adobe.com',
  preview: 'Host-only (EDS preview/live)',
  local: 'Host-only (local)',
};

const getCurrentSource = (state, authoredSource) => (
  state.active ? state.stored.source : authoredSource
);

const getStatus = (state) => {
  const { setting, disabled, active, stored, groupMatched } = state;

  if (!stored.consent) return INACTIVE;
  if (setting === 'entry') return ACTIVE;
  if (setting === 'reset') return RESET;
  if (disabled) return INACTIVE;
  if (setting === 'on') {
    if (active) return ACTIVE;
    // Stored nav exists but this page's group does not match: nav will not follow.
    if (stored.source && !groupMatched) return INACTIVE;
    return ENABLED;
  }
  return INACTIVE;
};

const processDisableValues = (valueStr, elem, foundValues = false) => {
  if (!valueStr || valueStr.length === 0) return;

  const disableValueList = valueStr.split(',');
  const table = createTag('table');
  const flatValues = Array.isArray(foundValues) && foundValues.flat();

  table.innerHTML = `
      <caption>Disable Values</caption>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Match?</th>
        </tr>
      </thead>
      <tbody>
      </tbody>`;

  const tBody = table.querySelector('tbody');

  disableValueList.forEach((pair) => {
    const itemRow = createTag('tr');
    const [key, value] = pair.split(';');
    const keyElem = createTag('td');
    const valElem = createTag('td');
    const matchElem = createTag('td');
    keyElem.innerText = key;
    valElem.innerText = value;
    matchElem.innerText = flatValues && flatValues.includes(value) ? 'yes' : 'no';

    itemRow.append(keyElem, valElem, matchElem);
    tBody.append(itemRow);
  });

  elem.append(table);
};

const returnPath = (url) => {
  try {
    return new URL(url).pathname;
  } catch (e) {
    return '';
  }
};

const createStatusWidget = () => {
  const state = getDynamicNavState();
  const { setting, stored, groupMatched } = state;
  const authoredSource = getMetadata('gnav-source') || 'Metadata not found: site gnav source';
  const dynamicNavSetting = setting || '';
  const currentSource = getCurrentSource(state, authoredSource);
  const dynamicNavDisableValues = getMetadata('dynamic-nav-disable');
  const foundValues = foundDisableValues();
  const groupMetaSetting = getMetadata('dynamic-nav-group') || 'Group not set';
  const hasStoredGroupContext = !!stored.source;
  const groupsMatchMessage = hasStoredGroupContext && groupMatched ? 'Yes' : 'No';
  const status = getStatus(state);
  const cookieMessage = stored.available ? 'Yes' : 'No (using authored navigation)';
  const cookieScope = COOKIE_SCOPE_LABEL[state.environment?.name] || 'Host-only';
  const statusWidget = createTag('div', { class: 'dynamic-nav-status' });

  statusWidget.innerHTML = `
    <span class="title"><span class="dns-badge"></span>Dynamic Nav</span>
    <section class="details hidden">
      <span class="dns-close"></span>
      <div class="message additional-info">
        <p>Additional Info:
          <span>${tooltipInfo[status]}</span>
        </p>
      </div>
      <p class="status">Status: <span>${status}</span></p> 
      <p class="setting">Setting: <span>${dynamicNavSetting}</span></p>
      <p class="group">Group: <span>${groupMetaSetting}</span></p>
      <p class="group-match">Group matches stored group: <span>${groupsMatchMessage}</span></p>
      <p class="cookies-available">Cookies available: <span>${cookieMessage}</span></p>
      <p class="functional-consent">Functional cookie consent (C0003): <span>${stored.consent ? 'Yes' : 'No (using authored navigation)'}</span></p>
      <p class="cookie-scope">Cookie scope: <span>${cookieScope}</span></p>
      <div class="nav-source-info">
        <p>Authored and stored source match: <span>${authoredSource === currentSource}</span></p>
        <p>Authored Nav Source:
        <span>${returnPath(authoredSource)}</span></p>
        <p>Stored Nav Source:
        <span>${returnPath(currentSource)}</span></p>
      </div>
      <div class="disable-values">
      </div>
    </section>
  `;

  processDisableValues(dynamicNavDisableValues, statusWidget.querySelector('.disable-values'), foundValues);
  statusWidget.classList.add(status);

  statusWidget.addEventListener('click', () => {
    statusWidget.querySelector('.details').classList.toggle('hidden');
    statusWidget.querySelector('.dns-badge').classList.toggle('dns-open');
  });

  return statusWidget;
};

export default async function main() {
  const statusWidget = createStatusWidget();
  const topNav = document.querySelector('.global-navigation');
  const dnsClose = statusWidget.querySelector('.dns-close');

  dnsClose.addEventListener('click', () => {
    topNav.removeChild(statusWidget);
  });

  if (topNav) topNav.appendChild(statusWidget);
}
