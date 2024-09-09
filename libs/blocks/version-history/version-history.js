import { html, useEffect, render } from '../../deps/htm-preact.js';
import { account } from '../../tools/sharepoint/state.js';
import { comment, error, versions, showLogin } from './state.js';
import { autoSetup, setup, onChangeComment, onClickCreateVersion } from './index.js';

const VERSION_HELP_URL = 'https://milo.adobe.com/docs/authoring/version-history';

function Error() {
  return html`<div class=error-container>${error}</div>`;
}

function Versions() {
  return html`
    <div class=versions-container>
      <div class="version-row version-row--header">
        <div class=version-number>Version</div>
        <div>Created</div>
        <div>By</div>
      </div>
      ${versions.value.map((ver, idx) => html`
        <div class="version-row" key=${idx}>
          <div class=version-row-detail>
            <div class=version-number>${ver.id}</div>
            <div>
              <div class=version-date>${ver.date[0]}</div>
              <div class=version-time>${ver.date[1]}</div>
            </div>
            <div>${ver.user}</div>
            ${ver.href && html`<a class=version-download href=${ver.href}>DL</a>`}
          </div>
          ${ver.comment && html`<div class=version-comment>${ver.comment}</div>`}
        </div>
      `)}
    </div>
  `;
}

function VersionHistory() {
  useEffect(() => { autoSetup(); }, []);
  if (!account.value.username) {
    return html`
      <div class=version-history-starting>
        <h1>Authenticating</h1>
        ${showLogin.value && html`
          <p>The login popup was blocked.<br/>Please use the button below.</p>
          <button class=version-action onClick="${setup}">Open login</button>
        `}
      </div>
    `;
  }

  return html`
    <div class=comment-container>
      <textarea
        value=${comment}
        id=comment
        name=comment
        placeholder="Add comment here"
        onkeyup=${onChangeComment} />
        <div class=version-action-container>
          <a
            class=version-action-help
            target="_blank"
            href="${VERSION_HELP_URL}">Help</a>
          <button class=version-action
            onClick="${onClickCreateVersion}">Create version</button>
        </div>
    </div>
    ${error.value && html`<${Error} />`}
    ${versions.value.length > 0 && html`<${Versions} />`}
  `;
}

export default async function init(el) {
  if (window.self === window.top) {
    document.body.classList.add('in-page');
  }
  render(html`<${VersionHistory} />`, el);
}
