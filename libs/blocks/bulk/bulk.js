import { html, render, useState, useRef } from '../../deps/htm-preact.js';
import createCopy from '../library-config/library-utils.js';
import {
  signOut,
  getStoredUrlInput,
  getActionName,
  getUrls,
  userIsAuthorized,
  executeActions,
  getCompletion,
  sendReport,
  signIn,
  getUser,
  getStoredOperation,
  storeUrls,
  storeOperation,
} from './utils.js';

// TODO enable IMS sign in?
const IMS_SIGN_IN_ENABLED = false;
const URLS_ENTRY_LIMIT = 1000;

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

function SelectBtn({ actionElt, onSelectChange, storedOperationName }) {
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
  } else if (urlNumber < 1) {
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
  const [selectedAction, setSelectedAction] = useState(storedOperation.name);
  const [submittedAction, setSubmittedAction] = useState(storedOperation.name);
  const [result, setResult] = useState(null);
  const [completion, setCompletion] = useState(null);

  const urlsElt = useRef(null);
  const actionElt = useRef(null);
  const resultsElt = useRef(null);
  const bulkInputElt = useRef(null);
  const bulkInputToggleElt = useRef(null);
  const resumeModal = useRef(null);

  const displayResumeDialog = (storedOperation.completed === null || storedOperation.completed) ? '' : 'displayed';

  const executeBulk = async (operation, startUrlIdx = 0) => {
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
    storeUrls(urls);
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
    storeOperation(operation);
    await executeBulk(operation);
  };

  const resume = async () => {
    setBulkTriggered(true);
    hideModal();
    const startUrlIdx = storedOperation.urlIdx !== null ? storedOperation.urlIdx + 1 : 0;
    await executeBulk(storedOperation.name, startUrlIdx);
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
                    storedOperationName=${storedOperation.name} />
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
  if (IMS_SIGN_IN_ENABLED) {
    const signedIn = await signIn(IMS_SIGN_IN_ENABLED);
    if (!signedIn) return;
  }

  const user = await getUser();
  const storedOperation = getStoredOperation();
  render(html`<${Bulk} user="${user}" storedOperation="${storedOperation}" />`, el);
}
// TODO remove the anonymous user in bulk-config.xlsx
// TODO: test edge cases + write tests
