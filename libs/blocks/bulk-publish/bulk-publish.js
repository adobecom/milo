import { html, render, useRef, useState } from '../../deps/htm-preact.js';
import { getMetadata } from '../../utils/utils.js';
import {
  ANONYMOUS,
  executeActions,
  getActionName,
  getCompletion,
  getStoredOperation,
  getStoredUrlInput,
  getUrls,
  getUser,
  sendReport,
  signIn,
  signOut,
  storeOperation,
  storeUrls,
  userIsAuthorized,
} from './bulk-publish-utils.js';

const URLS_ENTRY_LIMIT = 1000;
let urlLimit;

function User({ user }) {
  return html`
      <div class="bulk-user">
          <div class="bulk-user-header">logged in as</div>
          <div class="bulk-user-name">
              ${user.name}
          </div>
          ${user.name !== ANONYMOUS && html`
              <a class="bulk-user-signout" onclick=${signOut}>Sign out</a>
          `}
      </div>
  `;
}

function UrlInput({ urlsElt }) {
  return html`
    <span class="max-urls">Maximum number of URLS processed: ${urlLimit} </span>
    <textarea class="bulk-urls-input" placeholder="Ex: https://main--milo--adobecom.hlx.page/my/sample/page" ref="${urlsElt}">${getStoredUrlInput()}</textarea>
  `;
}

function SelectBtn({ actionElt, onSelectChange, storedOperationName }) {
  return html`
      <select class="bulk-action-select" ref="${actionElt}" onChange=${onSelectChange}>
          <option value="preview">Preview</option>
          <option value="publish" selected="${storedOperationName === 'publish'}">Publish</option>
          <option value="preview&publish" selected="${storedOperationName === 'preview&publish'}">Preview & Publish</option>
          <option value="unpublish" selected="${storedOperationName === 'unpublish'}">Unpublish</option>
          <option value="unpublish&delete" selected="${storedOperationName === 'unpublish&delete'}">Delete</option>
          <option value="index" selected="${storedOperationName === 'index'}">Index</option>
      </select>
  `;
}

function SubmitBtn({ submit }) {
  return html`
    <button class="bulk-action-submit" onClick=${submit}>
      Run process
    </button>
  `;
}

function prettyDate(date = new Date()) {
  const localeDate = date.toLocaleString();
  const splitDate = localeDate.split(', ');
  return html`
    <span class=bulk-date>${splitDate[0]}</span>
    <span class=bulk-time>${splitDate[1]}</span>
  `;
}

function bulkPublishStatus(row) {
  const success = row.status.publish === 200;
  const status = success ? '' : `Error - Status: ${row.status.publish}`;
  return !success && row.status.publish !== undefined && html`
    <span class=page-status>${status}</span>
  `;
}

function bulkPreviewStatus(row) {
  const success = row.status.preview === 200;
  const status = success ? '' : `Error - Status: ${row.status.preview}`;
  return row.status.preview !== 200 && row.status.preview !== undefined && html`
    <span class=page-status>${status}</span>
  `;
}

function bulkDeleteStatus(row) {
  const success = row.status.delete === 204;
  const status = row.status.delete === 403
    ? 'Failed to Delete (Ensure the resource is deleted in SharePoint)'
    : `Error - Status: ${row.status.delete}`;
  return !success && row.status.delete !== undefined && html`
    <span class=page-status>${status}</span>
  `;
}

function bulkUnpublishStatus(row) {
  const success = row.status.unpublish === 204;
  const status = row.status.unpublish === 403
    ? 'Failed to Unpublish (Ensure the resource is deleted in SharePoint)'
    : `Error - Status: ${row.status.unpublish}`;
  return !success && row.status.unpublish !== undefined && html`
    <span class=page-status>${status}</span>
  `;
}

function bulkIndexStatus(row) {
  const success = row.status.index === 200 || row.status.index === 202;
  const status = success ? '' : `Error - Status: ${row.status.index}`;
  return !success && row.status.index !== undefined && html`<span class=page-status>${status}</span>`;
}

function StatusTitle({ bulkTriggered, submittedAction, urlNumber }) {
  const name = getActionName(submittedAction, true);
  const URLS = (urlNumber > 1) ? 'URLS' : 'URL';
  return bulkTriggered && html`
    <div class="bulk-status-head">
      <ul class="bulk-status-head-title">
        <li><span>STATUS:</span> ${name} ${urlNumber} ${URLS}</li>
      </ul>
    </div>
  `;
}

function StatusRow({ row }) {
  const timeStamp = prettyDate(row?.timestamp);
  const errorStyle = 'status-error';
  const del = !!row.status.delete || !!row.status.unpublish;
  const expectedStatus = del ? 204 : 200;
  const previewStatus = del ? row.status.delete : row.status.preview;
  const publishStatus = del ? row.status.unpublish : row.status.publish;
  const preStatus = del ? bulkDeleteStatus : bulkPreviewStatus;
  const pubStatus = del ? bulkUnpublishStatus : bulkPublishStatus;

  const previewStatusError = previewStatus === expectedStatus ? '' : errorStyle;
  const publishStatusError = publishStatus === expectedStatus ? '' : errorStyle;
  const indexSuccess = row.status.index === 200 || row.status.index === 202;
  const indexStatusError = indexSuccess ? '' : errorStyle;

  return html`
    <tr class="bulk-status-row">
      <td class="bulk-status-url"><a href="${row.url}" target="_blank">${row.url}</a></td>
      <td class="bulk-status-preview ${previewStatusError}">
        ${previewStatus === expectedStatus && timeStamp} ${preStatus(row)}
      </td>
      <td class="bulk-status-publish ${publishStatusError}">
        ${publishStatus === expectedStatus && timeStamp} ${pubStatus(row)}
      </td>
      <td class="bulk-status-index ${indexStatusError}">
        ${indexSuccess && timeStamp} ${bulkIndexStatus(row)}
      </td>
    </tr>
  `;
}

function StatusContent({ resultsElt, result, submittedAction }) {
  const name = getActionName(submittedAction).toLowerCase();
  const displayClass = 'did-bulk';
  const bulkPreviewed = name.includes('preview') || name === 'delete' ? displayClass : '';
  const bulkPublished = name.includes('publish') || name === 'delete' ? displayClass : '';
  const bulkIndexed = name.includes('index') ? displayClass : '';

  const del = name === 'delete' || name === 'unpublish';
  const headings = {
    pre: del ? 'Deleted' : 'Previewed',
    pub: del ? 'UnPublished' : 'Published',
  };
  return html`
    <table class="bulk-status-content" ref="${resultsElt}">
      ${result && html`
        <tr class="bulk-status-header-row">
          <th>URL</th>
          <th class="${bulkPreviewed}">${headings.pre}</th>
          <th class="${bulkPublished}">${headings.pub}</th>
          <th class="${bulkIndexed}">Indexed</th>
        </tr>
        ${result.reverse().map((row) => html`<${StatusRow} row=${row} />`)}
      `}
    </table>
  `;
}

function StatusCompletion({ completion }) {
  const timeStamp = prettyDate();
  return completion && html`
    <div class="bulk-job">
      <div class="bulk-job-status">
        ${completion.preview.total > 0 && html`
          <ul class="bulk-job-preview">
            <li><span>Preview Job Complete:</span> ${timeStamp}</li>
            <li><span>Successful:</span> ${completion.preview.success} / ${completion.preview.total}</li>
          </ul>
        `}
        ${completion.publish.total > 0 && html`
        <ul class="bulk-job-publish">
          <li><span>Publish Job Complete:</span> ${timeStamp}</li>
          <li><span>Successful:</span> ${completion.publish.success} / ${completion.publish.total}</li>
        </ul>
        `}
        ${completion.delete.total > 0 && html`
        <ul class="bulk-job-publish">
          <li><span>Delete Job Complete:</span> ${timeStamp}</li>
          <li><span>Successful:</span> ${completion.delete.success} / ${completion.delete.total}</li>
        </ul>
        `}
        ${completion.unpublish.total > 0 && html`
        <ul class="bulk-job-publish">
          <li><span>Unpublish Job Complete:</span> ${timeStamp}</li>
          <li><span>Successful:</span> ${completion.unpublish.success} / ${completion.unpublish.total}</li>
        </ul>
        `}
        ${completion.index.total > 0 && html`
        <ul class="bulk-job-index">
          <li><span>Index Job Complete:</span> ${timeStamp}</li>
          <li><span>Successful:</span> ${completion.index.success} / ${completion.index.total}</li>
        </ul>
        `}
      </div>
    </div>
  `;
}

// eslint-disable-next-line max-len
function Status({
  valid, urlNumber, bulkTriggered, submittedAction, result, resultsElt, completion,
}) {
  return valid && html`
    <div class="bulk-status">
      <div class="bulk-status-info">
        <${StatusTitle}
          bulkTriggered=${bulkTriggered}
          submittedAction=${submittedAction}
          urlNumber=${urlNumber} />
        <${StatusCompletion}
          completion=${completion} />
      </div>
      <div class="bulk-status-content-container">
        <${StatusContent}
          resultsElt=${resultsElt}
          result=${result}
          submittedAction=${submittedAction} />
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
    message = 'There are no URLS to process. Add URLS to the text area to start bulk publishing.';
  } else if (urlNumber > urlLimit) {
    message = `There are too many URLS. You entered ${urlNumber} URLS. The max allowed number is ${urlLimit}`;
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
              <div>The previous bulk operation was interrupted before it could finish. Would you like to resume processing the outstanding URLS?</div>
              <div class="bulk-resume-modal-button">
                  <button class="bulk-resume-modal-button-resume" onclick="${resume}">Resume</button>
                  <button class="bulk-resume-modal-button-cancel" onclick="${hideModal}">Cancel</button>
              </div>
          </div>
      </div>
  `;
}

function BulkPublish({ user, storedOperation }) {
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
  const resumeModal = useRef(null);

  const displayResumeDialog = (storedOperation.completed === null || storedOperation.completed) ? '' : 'displayed';

  const executeBulk = async (resume) => {
    // reset the result area
    setResult(null);
    setCompletion(null);
    setValid(null);

    // validate the user
    const authorizedValue = await userIsAuthorized();
    setAuthorized(authorizedValue);
    if (!authorizedValue) {
      setValid(false);
      return;
    }

    // validate the number of urls
    const { urls } = getStoredOperation();
    const urlNumberValue = urls.length;
    setUrlNumber(urlNumberValue);
    if (urlNumberValue < 1 || urlNumberValue > urlLimit) {
      setValid(false);
      return;
    }

    // perform the action
    setValid(true);
    const operation = getStoredOperation().name;
    const results = await executeActions(resume, setResult);
    const completionValue = getCompletion(results);
    setCompletion(completionValue);

    // log the actions on the server
    await sendReport(results, operation);
  };

  const onSelectChange = () => {
    setSelectedAction(actionElt.current.value);
  };

  const hideModal = () => {
    resumeModal.current.classList.remove('displayed');
  };

  const submit = async () => {
    setBulkTriggered(true);
    const operation = actionElt.current.value;
    setSubmittedAction(operation);
    storeOperation(operation);
    const urls = getUrls(urlsElt);
    storeUrls(urls);
    await executeBulk();
  };

  const resume = async () => {
    setBulkTriggered(true);
    hideModal();
    await executeBulk(true);
  };

  return html`
  <div class="bulk-container">
    <div class="bulk-input" ref="${bulkInputElt}">
      <div class="bulk-header">
        <div class="tool-header">
          <h1>Bulk Publishing</div>
        </div>
        <${User} user=${user} />
      </div>
      <div class="bulk-controls">
        <div class="bulk-urls-title">Add URLS</div>
        <div class="bulk-action">
          <${SelectBtn}
            actionElt=${actionElt}
            onSelectChange=${onSelectChange}
            storedOperationName=${storedOperation.name} />
          <${SubmitBtn}
            submit=${submit}
            selectedAction=${selectedAction} />
        </div>
      </div>
      <${UrlInput} urlsElt=${urlsElt} />
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
      completion=${completion} />
    <${ResumeModal}
      displayResumeDialog=${displayResumeDialog}
      resumeModal=${resumeModal}
      resume=${resume}
      hideModal=${hideModal} />
  </div>
  `;
}

function initUrlLimit() {
  if (urlLimit) return;
  const { searchParams } = new URL(window.location.href);
  const limit = searchParams.get('limit');
  urlLimit = limit ? Number(limit) || URLS_ENTRY_LIMIT : URLS_ENTRY_LIMIT;
}

export default async function init(el) {
  const imsSignIn = getMetadata('ims-sign-in');
  if (imsSignIn === 'on' || imsSignIn === 'true') {
    const signedIn = await signIn();
    if (!signedIn) return;
  }

  initUrlLimit();
  const user = await getUser();
  const storedOperation = getStoredOperation();
  render(html`<${BulkPublish} user="${user}" storedOperation="${storedOperation}" />`, el);
}
