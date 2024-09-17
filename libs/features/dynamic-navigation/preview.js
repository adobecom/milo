import { createTag, getConfig, getMetadata, loadStyle } from '../../utils/utils.js';
import { isDynamicNavDisabled } from './dynamic-navigation.js';
/*
  Answers the questions about session storage:
  Is dynamic nav enabled for the consumer (dnkey)
  What nav is saved in storage (gnavSource)
  What was the ogNav on this page (ogSource)

  Answers the questions about metadata
*/
const ACTIVE = 'active';
const ENABLED = 'enabled';
const INACTIVE = 'inactive';

const getCurrentSource = (status, storageSource, authoredSource) => {
  if (status === 'on') {
    return storageSource || authoredSource;
  }
  return authoredSource;
};

const getStatus = (status, disabled, storageSource) => {
  if (status === 'entry') return ACTIVE;

  if (disabled) return INACTIVE;

  if (status === 'on' && storageSource) return ACTIVE;

  if (status === 'on' && !storageSource) return ENABLED;

  return INACTIVE;
};

const processDisableValues = (arr, elem) => {
  if (arr === null || arr === undefined) return;
  if (arr.length === 0) return;

  const diableValueList = arr.split(',');
  const caption = createTag('caption');
  const keyHead = createTag('th');
  const valHead = createTag('th');
  keyHead.innerText = 'Key';
  valHead.innerText = 'Value';
  const row = createTag('tr', {}, [keyHead, valHead]);
  const thead = createTag('thead', {}, row);
  const tbody = createTag('tbody');
  const table = createTag('table', {}, [caption, thead, tbody]);

  diableValueList.forEach((pair) => {
    const itemRow = createTag('tr');
    const [key, value] = pair.split(';');
    const keyElem = createTag('td');
    const valElem = createTag('td');
    keyElem.innerText = key;
    valElem.innerText = value;

    itemRow.append(keyElem, valElem);
    tbody.append(itemRow);
  });

  elem.append(table);
};

const returnPath = (url) => {
  const sourceUrl = new URL(url);
  return sourceUrl.pathname;
};

export default function main() {
  const { dynamicNavKey } = getConfig();
  const storedSource = window.sessionStorage.getItem('gnavSource');
  const authoredSource = getMetadata('gnav-source') || 'Metadata not found: site gnav source';
  const dynamicNavStatus = getMetadata('dynamic-nav');
  const currentSource = getCurrentSource(dynamicNavStatus, storedSource, authoredSource);
  const dynamicNavDisableValues = getMetadata('dynamic-nav-disable');
  const STATUS = getStatus(dynamicNavStatus, isDynamicNavDisabled(), storedSource);
  const ENABLED_INFO = 'The enabled status means that this page has dynamic nav set to "on", but an entry page has not been visited first to set the data';

  const previewWidget = createTag('div', { class: 'dynamic-nav-status' });

  previewWidget.innerHTML = 
  `
    <span class="title"><span class="dns-badge"></span>Dynamic Nav</span>
    <section class="details hidden">
      <span class="dns-close"></span> 
      <div class="message ${STATUS === ENABLED ? 'additional-info' : ''}">
        <p>${STATUS === ENABLED ? 'Additional Info: <span>' : ''}
        <span>${STATUS === ENABLED ? ENABLED_INFO : ''}</span></p>
      </div>
      <p>Status: <span>${STATUS}</span></p> 
      <p>Setting: <span>${dynamicNavStatus}</span></p>
      <div class="consumer-key">
        <p>Consumer key: <span>${dynamicNavKey}</span></p>
      </div>
      <div class="nav-source-info">
        <p>Authored and stored source match: <span>${authoredSource === currentSource}</span></p>
        <p>Authored Nav Source:
        <span>${returnPath(authoredSource)}</span></p>
        <p>Sotred Nav Source:
        <span>${returnPath(currentSource)}</span></p>
      </div>
      <div class="disable-values">
      </div>
    </section>
  `;

  const topNav = document.querySelector('.feds-topnav');
  const fedsProfile = document.querySelector('.feds-profile');
  const statusClass = STATUS;
  processDisableValues(dynamicNavDisableValues, previewWidget.querySelector('.disable-values'));
  previewWidget.classList.add(statusClass);
  const dnsClose = previewWidget.querySelector('.dns-close');

  previewWidget.addEventListener('click', () => {
    previewWidget.querySelector('.details').classList.toggle('hidden');
    previewWidget.querySelector('.dns-badge').classList.toggle('dns-open');
  });

  dnsClose.addEventListener('click', () => {
    topNav.removeChild(previewWidget);
  });

  topNav.insertBefore(previewWidget, fedsProfile);
}
