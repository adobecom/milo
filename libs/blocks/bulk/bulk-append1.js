import { html, render, signal, useState, useRef, useEffect } from '../../deps/htm-preact.js';
import { getImsToken } from '../../../tools/send-to-caas/send-utils.js';
import { loadScript } from '../../utils/utils.js';

const UNAUTHORIZED_USER = 'unauthorized user';
const UNSUPPORTED_SITE = 'unsupported site';

const getUser = async () => {
  const profile = await window.adobeIMS.getProfile();
  return profile.name;
};

const signIn = async () => {
  const accessToken = await getImsToken(loadScript);
  if (!accessToken) {
    window.adobeIMS.signIn();
    return false;
  }
  return true;
};

const getAuthorizedUsers = async () => {
  window.bulk = window.bulk || {};
  let { authorizedUsers } = window.bulk;
  if (authorizedUsers) return authorizedUsers;
  const resp = await fetch('/tools/bulk-config.json');
  const json = await resp.json();
  authorizedUsers = json.users.data.map((user) => user.user);
  window.bulk.authorizedUsers = authorizedUsers;
  return authorizedUsers;
};

const getSupportedSites = async () => {
  window.bulk = window.bulk || {};
  let { supportedSites } = window.bulk;
  if (supportedSites) return supportedSites;
  const resp = await fetch('/tools/bulk-config.json');
  const json = await resp.json();
  supportedSites = json.sites.data.map((site) => site.origin);
  window.bulk.supportedSites = supportedSites;
  return supportedSites;
};

const userIsAuthorized = async () => {
  const { email } = await window.adobeIMS.getProfile();
  const users = await getAuthorizedUsers();
  return users.includes(email);
};

const siteIsSupported = async (url) => {
  const { origin } = new URL(url);
  const sites = await getSupportedSites();
  return sites.includes(origin);
};

const getReport = async (urls, operation) => {
  const origins = new Map();
  urls.forEach((url) => {
    const { origin } = new URL(url);
    const count = origins.get(origin) || 0;
    origins.set(origin, count + 1);
  });
  const timestamp = new Date().toISOString();
  const { email } = await window.adobeIMS.getProfile();
  return [...origins.keys()].map((origin) => ({
    timestamp,
    email,
    operation,
    domain: origin,
    urls: origins.get(origin),
  }));
};

const sendReport = async (urls, operation) => {
  const rows = await getReport(urls, operation);
  // TODO: const reportFile = '/tools/bulk-report';
  const reportFile = '/drafts/jck/bulk/bulk-report';
  rows.forEach((row) => {
    fetch(reportFile, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: row,
      }),
    })
    console.log('report sent', row);
  });
};

const execute = async (url, operation) => {
  const userAllowed = await userIsAuthorized();
  if (!userAllowed) return UNAUTHORIZED_USER;
  const siteAllowed = await siteIsSupported(url);
  if (!siteAllowed) return UNSUPPORTED_SITE;
  const { hostname, pathname } = new URL(url);
  const [branch, repo, owner] = hostname.split('.')[0].split('--');
  const adminURL = `https://admin.hlx.page/${operation}/${owner}/${repo}/${branch}${pathname}`;
  const resp = await fetch(adminURL, {
    method: 'POST',
  });
  return resp.status;
};

const executeAll = async (url, operationName) => {
  const operations = operationName.split('&');
  const status = {};
  for (let j = 0; j < operations.length; j++) {
    const operation = operations[j];
    // eslint-disable-next-line no-await-in-loop
    status[operation] = await execute(url, operation);
  }
  return status;
};

function getOperationName(operation) {
  let name;
  switch (operation) {
    case 'preview':
      name = 'Preview';
      break;
    case 'live':
      name = 'Publish';
      break;
    default:
      name = 'Preview and publish';
  }
  return name;
}

function StatusRow(props) {
  const [status, setStatus] = useState({});
  const [statusLoading, setStatusLoading] = useState(false);
  useEffect(() => {
    async function getStatus() {
      const statusObj = await executeAll(props.url, props.operationName);
      setStatus(statusObj);
      setStatusLoading(true);
    }
    getStatus();
  }, [props]);
  if (!statusLoading) return '';
  return html`
    <div class="bulk-status-row">
        ${status.preview && html`
            <div class="bulk-status-url">${props.url}</div>
            <div class="bulk-status-preview">${status.preview}</div>
        `}
        ${status.live && html`
            <div class="bulk-status-url">${props.url}</div>
            <div class="bulk-status-publish">${status.live}</div>
        `}
    </div>`;
}

function StatusTitle(props) {
  const name = getOperationName(props.operationName);
  return html`
      <div class="bulk-status-title">
          ${props.bulkTriggered && html`
              STATUS ${name}ing ${props.urls?.length} URLS
          `}
      </div>`;
}

function StatusContent(props) {
  return html`
    <div class="bulk-status-content">
        <div class="bulk-status-header">
            <div class="bulk-status-header-url">URL</div>
            <div class="bulk-status-header-status-preview">Preview Status</div>
            <div class="bulk-status-header-url">URL</div>
            <div class="bulk-status-header-status-publish">Publish Status</div>
        </div>
        <div class="bulk-status-rows">
            ${props.urls.map((url) => html`<${StatusRow} url=${url} operationName=${props.operationName} />`)}
            ${props.setBulkFinished(true)}
        </div>
    </div>`;
}

function StatusFooter(props) {
  const timeStamp = new Date().toISOString();
  return html`
      <div class="bulk-status-footer">
          ${props.bulkFinished && html`
              <div class="bulk-status-footer-complete">JOB COMPLETE</div>
              <div class="bulk-status-footer-date">${timeStamp}</div>
          `}
      </div>
  `;
}

function Status(props) {
  const [bulkFinished, setBulkFinished] = useState(false);
  return html`
    <div class="bulk-status">
        ${props.displayStatus && html`
          <div class="bulk-status-header-container">
              <${StatusTitle}
                  operationName=${props.operationName}
                  urls=${props.urls} />
          </div>
          <div class="bulk-status-content-container">
              <${StatusContent}
                  operationName=${props.operationName}
                  setBulkFinished=${setBulkFinished}
                  urls=${props.urls} />
          </div>
          <div class="bulk-status-footer-container">
              <${StatusFooter} bulkFinished=${bulkFinished} />
          </div>
        `}
    </div>`;
}

function User(props) {
  return html`
      <div class="bulk-user-name">
          ${props.user}
      </div>`;
}

function SubmitBtn(props) {
  const name = getOperationName(props.operationName);
  // eslint-disable-next-line no-use-before-define
  return html`
      <button class="bulk-submit" onClick=${props.onSubmit}>
          ${name}
      </button>`;
}

function BulkAppend1(props) {
  const [displayStatus, setDisplayStatus] = useState(false);
  const [operationName, setOperationName] = useState('preview');
  const [urls, setUrls] = useState(null);
  const urlsInput = useRef(null);
  const operationInput = useRef(null);

  const onSubmit = async () => {
    setDisplayStatus(false);
    setDisplayStatus(true);
    const urlsValue = urlsInput.current.value.split('\n').filter((url) => url.length > 0).map((e) => e.trim());
    setUrls(urlsValue);
    await sendReport(urlsValue, operationName);
  };

  const onSelectChange = () => {
    const operationNameValue = operationInput.current.value;
    setOperationName(operationNameValue);
  };

  return html`
        <div class="bulk">
            <div class="bulk-user">
                <div class="bulk-user-header">LOGGED IN AS</div>
                <${User} user=${props.user} />
            </div>
            <div class="bulk-urls">
                <div class="bulk-urls-title">URLS</div>
                <textarea class="bulk-urls-input" ref="${urlsInput}"></textarea>
            </div>
            <select class="bulk-operation" ref="${operationInput}" onChange=${onSelectChange}>
                <option value="preview">preview</option>
                <option value="live">publish</option>
                <option value="preview&live">preview & publish</option>
            </select>
            <${SubmitBtn} onSubmit=${onSubmit}  operationName=${operationName}/>
            <${Status}
                displayStatus=${displayStatus}
                urls=${urls}
                operationName=${operationName} />
        </div>`;
}

export default async function init(el) {
  // force user to sign in
  const signedIn = await signIn();
  if (!signedIn) return;

  const user = await getUser();
  render(html`<${BulkAppend1} user="${user}" />`, el);
}
// TODO styling
// TODO remove console.log
// TODO: test edge cases + write tests
