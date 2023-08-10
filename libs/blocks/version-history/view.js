import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { fetchVersions, createHistoryTag } from './index.js';
import loginToSharePoint from '../../tools/sharepoint/login.js';

const baseUrl = 'https://adobe.sharepoint.com';
const scope = [`${baseUrl}/.default`];
const telemetry = {
  application: {
    appName: 'Adobe Version history'
  },
};


function formatTime(inputTime) {
  const [hours, minutes] = inputTime.split(':');
  let formattedHours = String(Number(hours) % 12);
  if (formattedHours === '0') {
    formattedHours = '12';
  }
  const period = Number(hours) < 12 ? 'AM' : 'PM';

  return `${formattedHours}:${minutes} ${period}`;
}

export default function View() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [versions, setVersions] = useState([]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loginAndFetchVersion() {
      await loginToSharePoint(scope, telemetry);
      setIsAuthenticated(true);
      const savedVersions = await fetchVersions();
      setVersions(savedVersions);
    }

    loginAndFetchVersion();
  }, []);

  async function onClickCreate() {
    try {
      await createHistoryTag(comment);
      const savedVersions = await fetchVersions();
      setComment('');
      setVersions(savedVersions);
    } catch (err) {
      setError(err.message);
    }
  }

  function onChangeComment(e) {
    setComment(e.currentTarget.value);
    setError('');
  }

  function downloadVersionFile(data) {
    const fileUrl = data.IsCurrentVersion ? `${baseUrl}/${data.Url}` : `${baseUrl}/sites/adobecom/${data.Url}`;
    const a = document.createElement('a');
    a.href = fileUrl;
    document.body.appendChild(a);
    a.click();
  }

  function prettyDate(timeStamp) {
    const date = new Date(timeStamp);
    const localeDate = date.toLocaleString();
    const splitDate = localeDate.split(', ');
    
    return html`
      <td>
        <div class=date>${splitDate[0]}</div>
        <div>${formatTime(splitDate[1])}</div>
      </td>
    `;
  }

  function getTableData({ details, key }) {
    switch (key) {
      case 'VersionLabel':
        return html`<td class="link download" onclick="${downloadVersionFile.bind(this, details)}">${details[key]}</td>`;
      case 'Created':
        return html`${prettyDate(details[key])}`;
      default:
        return html`<td>${details[key]}</td>`;
    }
  }

  function renderTableRows(details) {
    const keys = ['VersionLabel', 'Created', 'CheckInComment'];
    return html`<tr>${keys.map((key) => getTableData({ details, key }))}</tr>`;
  }

  function renderError() {
    if (error) {
      return html`<div class="error">${error}</div>`;
    }
    return null;
  }

  function renderList() {
    return html`
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Created</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody id="addVersionHistory">
        ${versions.map((version) => renderTableRows(version))}
        </tbody>
      </table>`;
  }

  if (!isAuthenticated) {
    return html`<div id="status" class="container sk-version"> Authenticating.... </div>`;
  }

  return html`
    <div id="content" class="container sk-version">
      <div class="comment-container">
        <textarea value="${comment}" id="comment" name="comment" placeholder="Add comment here" onkeyup="${onChangeComment}"></textarea>
        <button id="create" onClick="${onClickCreate}">Create version</button>
      </div>
     
      ${renderError()}
      <div class="table-container">
        ${renderList()}
      </div>
    </div>
  `;
}
