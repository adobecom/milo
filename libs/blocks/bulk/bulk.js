import { html, render, useState, useRef } from '../../deps/htm-preact.js';
import { getImsToken } from '../../../tools/send-to-caas/send-utils.js';
import { fetchWithTimeout } from '../caas/utils.js';
import { loadScript } from '../../utils/utils.js';
import {
  getLocalStorage,
  setLocalStorage,
} from '../review/utils/localStorageUtils.js';
import createCopy from '../library-config/library-utils.js';

// TODO enable IMS sign in?
const IMS_SIGN_IN_ENABLED = false;
const ADMIN_BASE_URL = 'https://admin.hlx.page';
const URLS_ENTRY_LIMIT = 1000;
const THROTTLING_DELAY_MS = 100;
const BULK_CONFIG_FILE_PATH = '/tools/bulk-config.json';
const BULK_REPORT_FILE_PATH = '/tools/bulk-report';
const BULK_AUTHORIZED_USERS = 'bulkAuthorizedUsers';
const BULK_SUPPORTED_SITES = 'bulkSupportedSites';
const BULK_STORED_URLS = 'bulkStoredUrls';
const BULK_STORED_URL_IDX = 'bulkStoredUrlIdx';
const BULK_STORED_COMPLETED = 'bulkStoredCompleted';
const BULK_STORED_OPERATION_NAME = 'bulkStoredOperationName';
const UNSUPPORTED_SITE = 'unsupported domain';

const getUser = async () => {
  const profile = await window.adobeIMS?.getProfile();
  return profile
    ? { name: profile.name, email: profile.email }
    : { name: 'anonymous', email: 'anonymous' };
};

const signIn = async () => {
  if (!IMS_SIGN_IN_ENABLED) return true;
  // force user to sign in
  const accessToken = await getImsToken(loadScript);
  if (!accessToken) {
    window.adobeIMS.signIn();
    return false;
  }
  return true;
};

const getAuthorizedUsers = async () => {
  let authorizedUsers = getLocalStorage(BULK_AUTHORIZED_USERS);
  if (authorizedUsers) return authorizedUsers;
  const resp = await fetch(BULK_CONFIG_FILE_PATH);
  const json = await resp.json();
  authorizedUsers = json.users.data.map((user) => user.user);
  setLocalStorage(BULK_AUTHORIZED_USERS, authorizedUsers);
  return authorizedUsers;
};

const getSupportedSites = async () => {
  let supportedSites = getLocalStorage(BULK_SUPPORTED_SITES);
  if (supportedSites) return supportedSites;
  const resp = await fetch(BULK_CONFIG_FILE_PATH);
  const json = await resp.json();
  supportedSites = json.sites.data.map((site) => site.origin);
  setLocalStorage(BULK_SUPPORTED_SITES, supportedSites);
  return supportedSites;
};

const userIsAuthorized = async () => {
  const { email } = await getUser();
  const users = await getAuthorizedUsers();
  return users.includes(email);
};

const siteIsSupported = async (url) => {
  try {
    const { origin } = new URL(url);
    const sites = await getSupportedSites();
    return sites.includes(origin);
  } catch (e) {
    return false;
  }
};

const getUrls = (element) => element.current?.value.split('\n').filter((url) => url.length > 0).map((e) => e.trim());

const getActionName = (action, gerund) => {
  let name;
  switch (action) {
    case null:
    case 'preview':
      name = (!gerund) ? 'Preview' : 'Previewing';
      break;
    case 'publish':
      name = (!gerund) ? 'Publish' : 'Publishing';
      break;
    default:
      name = (!gerund) ? 'Preview & publish' : 'Previewing & publishing';
  }
  return name;
};

const executeAction = async (action, url) => {
  const operation = (action === 'preview') ? 'preview' : 'live';
  const siteAllowed = await siteIsSupported(url);
  if (!siteAllowed) return UNSUPPORTED_SITE;
  const { hostname, pathname } = new URL(url);
  const [branch, repo, owner] = hostname.split('.')[0].split('--');
  const adminURL = `${ADMIN_BASE_URL}/${operation}/${owner}/${repo}/${branch}${pathname}`;
  const resp = await fetchWithTimeout(adminURL, { method: 'POST' });
  return resp.status;
};

// eslint-disable-next-line no-promise-executor-return
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const executeActions = async (actions, urls, setResult, lastUrlIdx = 0) => {
  setLocalStorage(BULK_STORED_COMPLETED, false);
  const results = [];
  if (lastUrlIdx > urls.length - 1) {
    // eslint-disable-next-line no-console
    console.error(`incorrect url index: ${lastUrlIdx}`);
    return null;
  }
  // eslint-disable-next-line no-plusplus
  for (let i = lastUrlIdx; i < urls.length; i++) {
    const url = urls[i];
    const status = {};
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < actions.length; j++) {
      const action = actions[j];
      // eslint-disable-next-line no-await-in-loop
      status[action] = await executeAction(action, url);
      // eslint-disable-next-line no-await-in-loop
      await delay(THROTTLING_DELAY_MS);
    }
    results.push({
      url,
      status,
    });
    setResult([...results]);
    setLocalStorage(BULK_STORED_URL_IDX, i);
  }
  setLocalStorage(BULK_STORED_COMPLETED, true);
  return results;
};

const getCompletion = (results) => {
  let previewTotal = 0;
  let publishTotal = 0;
  let previewSuccess = 0;
  let publishSuccess = 0;
  results.forEach((result) => {
    const { status } = result;
    if (status.preview) previewTotal += 1;
    if (status.publish) publishTotal += 1;
    if (status.preview === 200) previewSuccess += 1;
    if (status.publish === 200) publishSuccess += 1;
  });
  return {
    preview: {
      total: previewTotal,
      success: previewSuccess,
    },
    publish: {
      total: publishTotal,
      success: publishSuccess,
    },
  };
};

const getReport = async (results, action) => {
  const origins = {};
  results.forEach((result) => {
    let origin;
    try {
      const urlObj = new URL(result.url);
      origin = urlObj.origin;
    } catch (e) {
      origin = result.url;
    }
    if (!origins[origin]) {
      origins[origin] = {
        total: 0,
        success: 0,
      };
    }
    if (action === 'preview&publish') {
      origins[origin].total += 2;
    } else {
      origins[origin].total += 1;
    }
    if (result.status.preview === 200) {
      origins[origin].success += 1;
    }
    if (result.status.publish === 200) {
      origins[origin].success += 1;
    }
  });
  const timestamp = new Date().toISOString();
  const { email } = await getUser();
  return Object.keys(origins).map((origin) => ({
    timestamp,
    email,
    action: getActionName(action),
    domain: origin,
    urls: origins[origin].total,
    success: origins[origin].success,
  }));
};

const sendReport = async (results, action) => {
  const rows = await getReport(results, action);
  rows.forEach((row) => {
    fetch(BULK_REPORT_FILE_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: row }),
    });
  });
};

const getStoredOperation = () => {
  const storedOperationName = getLocalStorage(BULK_STORED_OPERATION_NAME);
  const storedUrlIdx = getLocalStorage(BULK_STORED_URL_IDX);
  const storedUrls = getLocalStorage(BULK_STORED_URLS);
  const completed = getLocalStorage(BULK_STORED_COMPLETED);
  return {
    storedOperationName,
    storedUrlIdx,
    storedUrls,
    completed,
  };
};

const getStoredUrlInput = () => {
  const storedUrls = getLocalStorage(BULK_STORED_URLS);
  return storedUrls ? storedUrls.join('\n') : '';
};

const signOut = (e) => {
  e.preventDefault();
  window.adobeIMS?.signOut();
};

function User({ user }) {
  return html`
      <div class="bulk-user">
          <div class="bulk-user-header">logged in as</div>
          <div class="bulk-user-name">
              ${user.name}
          </div>
          <a class="bulk-user-signout" onclick=${signOut}>Sign out</a>
      </div>
  `;
}

function UrlInput({ urlsElt }) {
  return html`
      <textarea class="bulk-urls-input" ref="${urlsElt}">${getStoredUrlInput()}</textarea>
  `;
}

function SelectBtn({ actionElt, onSelectChange, storedOperationName}) {
  return html`
      <select class="bulk-action-select" ref="${actionElt}" onChange=${onSelectChange}>
          <option value="preview">Preview</option>
          <option value="publish" selected="${storedOperationName === 'publish'}">Publish</option>
          <option value="preview&publish" selected="${storedOperationName === 'preview&publish'}">Preview & Publish</option>
      </select>
  `;
}

function SubmitBtn({ submit, selectedAction }) {
  const name = getActionName(selectedAction);
  return html`
      <button class="bulk-action-submit" onClick=${submit}>
          ${name}
      </button>
  `;
}

function prettyDate() {
  const date = new Date();
  const localeDate = date.toLocaleString();
  const splitDate = localeDate.split(', ');
  return html`
    <span class=bulk-date>${splitDate[0]}</span>
    <span class=bulk-time>${splitDate[1]}</span>
  `;
}

function StatusRow({ row }) {
  return html`
    <tr class="bulk-status-row">
        <td class="bulk-status-url">${row.status.preview && row.url}</td>
        <td class="bulk-status-preview">${row.status.preview && row.status.preview}</td>
        <td class="bulk-status-url">${row.status.publish && row.url}</td>
        <td class="bulk-status-publish">${row.status.publish && row.status.publish}</td>
    </tr>
  `;
}

function StatusTitle({ bulkTriggered, submittedAction, copyResults, showHideUrls, bulkInputToggleElt, urlNumber }) {
  const name = getActionName(submittedAction, true);
  const URLS = (urlNumber > 1) ? 'URLS' : 'URL';
  return bulkTriggered && html`
      <div class="bulk-status-head">
          <div class="bulk-status-head-title">
              STATUS ${name} ${urlNumber} ${URLS}
          </div>
          <div>
              <button class="bulk-status-head-copy" onclick=${copyResults} title="Copy results"></button>
              <button class="bulk-status-head-toggle-urls" ref="${bulkInputToggleElt}" onclick=${showHideUrls} title="Show/hide urls"></button>
          </div>
      </div>
  `;
}

function StatusContent({ resultsElt, result }) {
  return html`
    <table class="bulk-status-content" ref="${resultsElt}">
        ${result && html`
            <colgroup>
                <col class="bulk-status-content-col1"/>
                <col class="bulk-status-content-col2"/>
                <col class="bulk-status-content-col3"/>
                <col class="bulk-status-content-col4"/>
            </colgroup>
            <tr class="bulk-status-header-row">
                <th class="bulk-status-header-url">Preview</th>
                <th>Status</th>
                <th class="bulk-status-header-url">Publish</th>
                <th>Status</th>
            </tr>
            ${result.map((row) => html`<${StatusRow} row=${row} />`)}
        `}
    </table>
  `;
}

function StatusFooter({ completion }) {
  const timeStamp = prettyDate();
  return completion && html`
      <table class="bulk-status-footer">
          <colgroup>
              <col class="bulk-status-content-col1"/>
              <col class="bulk-status-content-col2"/>
              <col class="bulk-status-content-col3"/>
              <col class="bulk-status-content-col4"/>
          </colgroup>
          <tr>
              <td>
                  <div class="bulk-status-footer-preview">
                      ${completion.preview.total > 0 && html`
                          <div class="bulk-status-footer-preview-complete">job complete</div>
                          <div class="bulk-status-footer-preview-date">${timeStamp}</div>
                          <div class="bulk-status-footer-preview-success">successful: ${completion.preview.success} / ${completion.preview.total}</div>
                      `}
                  </div>
              </td>
              <td></td>
              <td>
                  <div class="bulk-status-footer-publish">
                      ${completion.publish.total > 0 && html`
                          <div class="bulk-status-footer-publish-complete">job complete</div>
                          <div class="bulk-status-footer-publish-date">${timeStamp}</div>
                          <div class="bulk-status-footer-publish-success">successful: ${completion.publish.success} / ${completion.publish.total}</div>
                      `}
                  </div>
              </td>
              <td></td>
          </tr>
      </table>
  `;
}

function Status({ valid, urlNumber, bulkTriggered, submittedAction, result, resultsElt, completion, copyResults, showHideUrls, bulkInputToggleElt }) {
  return valid && html`
    <div class="bulk-status">
        <div class="bulk-status-title-container">
            <${StatusTitle}
                bulkTriggered=${bulkTriggered}
                submittedAction=${submittedAction}
                copyResults=${copyResults}
                showHideUrls=${showHideUrls}
                bulkInputToggleElt=${bulkInputToggleElt}
                urlNumber=${urlNumber} />
        </div>
        <div class="bulk-status-content-container">
            <${StatusContent}
                resultsElt=${resultsElt}
                result=${result} />
        </div>
        <div class="bulk-status-footer-container">
            <${StatusFooter}
                completion=${completion} />
        </div>
    </div>
  `;
}

function ErrorMessage({ valid, authorized, urlNumber }) {
  if (valid) return '';
  let message;
  if (!authorized) {
    message = 'You are not authorized to perform bulk operations';
  } else if (urlNumber === 0) {
    message = 'There are no URL to process';
  } else if (urlNumber > URLS_ENTRY_LIMIT) {
    message = `There are too many URLs. You entered ${urlNumber} URLs. The max allowed number is ${URLS_ENTRY_LIMIT}`;
  }
  return !!message && html`
      <div class="bulk-error">
          ${message}
      </div>
  `;
}

function ResumeModal({ displayResumeDialog, resumeModal, resume, hideModal }) {
  return html`
      <div class="bulk-resume-modal ${displayResumeDialog}" ref="${resumeModal}">
          <div class="bulk-resume-modal-content">
              <div>Previous bulk operation did not terminate. Would you like to resume processing the outstanding URLs?</div>
              <div class="bulk-resume-modal-button">
                  <button class="bulk-resume-modal-button-resume" onclick="${resume}">Resume</button>
                  <button class="bulk-resume-modal-button-cancel" onclick="${hideModal}">Cancel</button>
              </div>
          </div>
      </div>
  `;
}

function Bulk({ user, storedOperation }) {
  const [valid, setValid] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const [urlNumber, setUrlNumber] = useState(-1);
  const [bulkTriggered, setBulkTriggered] = useState(false);
  const [selectedAction, setSelectedAction] = useState(storedOperation.storedOperationName);
  const [submittedAction, setSubmittedAction] = useState(storedOperation.storedOperationName);
  const [result, setResult] = useState(null);
  const [completion, setCompletion] = useState(null);

  const urlsElt = useRef(null);
  const actionElt = useRef(null);
  const resultsElt = useRef(null);
  const bulkInputElt = useRef(null);
  const bulkInputToggleElt = useRef(null);
  const resumeModal = useRef(null);

  const displayResumeDialog = (storedOperation.completed === null || storedOperation.completed) ? '' : 'displayed';

  const executeBulk = async (operation, startUrlIdx) => {
    // reset the result area
    setResult(null);
    setCompletion(null);

    // validate the user
    const authorizedValue = await userIsAuthorized();
    setAuthorized(authorizedValue);
    if (!authorizedValue) {
      setValid(false);
      return;
    }

    // validate the number of urls
    const urls = getUrls(urlsElt);
    setLocalStorage(BULK_STORED_URLS, urls);
    const urlNumberValue = urls.length - startUrlIdx;
    setUrlNumber(urlNumberValue);
    if (urlNumberValue < 1 || urlNumberValue > URLS_ENTRY_LIMIT) {
      setValid(false);
      return;
    }

    // perform the action
    const actions = operation.split('&');
    const results = await executeActions(actions, urls, setResult, startUrlIdx);
    const completionValue = getCompletion(results);
    setCompletion(completionValue);

    // log the actions on the server
    await sendReport(results, operation);
  };

  const onSelectChange = () => {
    setSelectedAction(actionElt.current.value);
  };

  const copyResults = async () => {
    const blob = new Blob([resultsElt.current.outerHTML], { type: 'text/html' });
    createCopy(blob);
  };

  const showHideUrls = () => {
    bulkInputElt.current.classList.toggle('is-hidden');
    bulkInputToggleElt.current.classList.toggle('open');
  };

  const hideModal = () => {
    resumeModal.current.classList.remove('displayed');
  };

  const submit = async () => {
    setBulkTriggered(true);
    const operation = actionElt.current.value;
    setSubmittedAction(operation);
    setLocalStorage(BULK_STORED_OPERATION_NAME, operation);
    await executeBulk(operation, 0);
  };

  const resume = async () => {
    setBulkTriggered(true);
    hideModal();
    const operation = storedOperation.storedOperationName;
    const urlIdx = storedOperation.storedUrlIdx;
    await executeBulk(operation, urlIdx + 1);
  };

  return html`
    <div class="bulk">
        <div class="bulk-input" ref="${bulkInputElt}">
            <div class="bulk-header">
                <div class="bulk-urls">
                    <div class="bulk-urls-title">urls</div>
                </div>
                <${User} user=${user} />
            </div>
            <${UrlInput} urlsElt=${urlsElt} />
            <div class="bulk-action">
                <${SubmitBtn}
                    submit=${submit}
                    selectedAction=${selectedAction} />
                <${SelectBtn}
                    actionElt=${actionElt}
                    onSelectChange=${onSelectChange}
                    storedOperationName=${storedOperation.storedOperationName} />
            </div>
        </div>
        <${ErrorMessage}
            valid=${valid}
            authorized=${authorized}
            urlNumber=${urlNumber} />
        <${Status}
            valid=${valid}
            urlNumber=${urlNumber}
            bulkTriggered=${bulkTriggered}
            submittedAction=${submittedAction}
            result=${result}
            resultsElt=${resultsElt}
            completion=${completion}
            copyResults=${copyResults}
            showHideUrls=${showHideUrls}
            bulkInputToggleElt=${bulkInputToggleElt} />
        <${ResumeModal}
            displayResumeDialog=${displayResumeDialog}
            resumeModal=${resumeModal}
            resume=${resume}
            hideModal=${hideModal} />
    </div>
  `;
}

export default async function init(el) {
  const signedIn = await signIn();
  if (!signedIn) return;

  const user = await getUser();
  const storedOperation = getStoredOperation();
  render(html`<${Bulk} user="${user}" storedOperation="${storedOperation}" />`, el);
}
// TODO remove the anonymous user in bulk-config.xlsx
// TODO: test edge cases + write tests
