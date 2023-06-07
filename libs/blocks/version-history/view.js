import { html, useState, useEffect } from '../../deps/htm-preact.js';
import { fetchVersions, createHistoryTag } from './index.js';
import loginToSharePoint from '../../utils/deps/login.js';

const scope = ['https://adobe.sharepoint.com/.default'];

export default function View() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [versions, setVersions] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(async () => {
    try {
      await loginToSharePoint(scope);
      setIsAuthenticated(true);
      const versions = await fetchVersions();
      setVersions(versions);
    } catch(err) {
      setError(err.error_description)
    }
  }, []);

  const onClickCreate = async () => {
    if (comment) {
      await createHistoryTag(comment);
      const versions = await fetchVersions();
      setComment('');
      setVersions(versions);
    }
    return;
  }

  function onChangeComment(e) {
    setComment(e.currentTarget.value);
  }

  function downloadVersionFile(data) {
    const fileUrl = data.IsCurrentVersion ? `https://adobe.sharepoint.com/${data.Url}` : `https://adobe.sharepoint.com/sites/adobecom/${data.Url}`;
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
      <span class=date>${splitDate[0]}</span>
      <span class=time>${splitDate[1]}</span>
      </td>
    `;
  }

  function getTableData({ details, key }) {
    switch (key) {
      case 'VersionLabel':
        return html`<td class="link" onclick="${downloadVersionFile.bind(this, details)}">${details[key]}</td>`;
      case 'Created':
        return html`${prettyDate(details[key])}`;
      default:
        return html`<td>${details[key]}</td>`;
    }
  }

  function renderTableRows(details) {
    const keys = ['VersionLabel', 'Created', 'CheckInComment']
    return html`<tr>${keys.map(key => getTableData({ details, key }))}</tr>`;
  }

  if (!isAuthenticated) {
    return html`<div id="status" class="container"> Authenticating.... </div>`
  }

  return html`
    <div id="content" class="container">
      <div class="comment-container">
        <label for="comment">Comment:</label>
        <textarea value="${comment}" id="comment" name="comment" placeholder="Add comment" onChange="${onChangeComment}"></textarea>
      </div>
      <button id="create" onClick="${onClickCreate}">Create Version</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Modified Date</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody id="addVersionHistory">
        ${versions.map((version) => renderTableRows(version))}
        </tbody>
      </table>
    </div>
  `;
}
