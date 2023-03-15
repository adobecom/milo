import { html, render, useState, useRef } from '../../deps/htm-preact.js';
import { getImsToken } from '../../../tools/send-to-caas/send-utils.js';
import { loadScript } from '../../utils/utils.js';

const UNSUPPORTED_SITE = 'unsupported domain';
const MAX_URLS_NUMBER = 1000;
// TODO enable IMS sign in?
const IMS_SIGN_IN_ENABLED = false;

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
  const adminURL = `https://admin.hlx.page/${operation}/${owner}/${repo}/${branch}${pathname}`;
  const resp = await fetch(adminURL, { method: 'POST' });
  return resp.status;
};

// eslint-disable-next-line no-promise-executor-return
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const executeActions = async (actions, urls, setResult) => {
  const results = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const status = {};
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < actions.length; j++) {
      const action = actions[j];
      // eslint-disable-next-line no-await-in-loop
      status[action] = await executeAction(action, url);
      // eslint-disable-next-line no-await-in-loop
      await delay(100);
    }
    results.push({
      url,
      status,
    });
    setResult([...results]);
  }
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
  const reportFile = '/tools/bulk-report';
  rows.forEach((row) => {
    fetch(reportFile, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: row }),
    });
  });
};

function StatusRow(props) {
  return html`
    <div class="bulk-status-row">
        <div class="bulk-status-url">${props.row.status.preview && props.row.url}</div>
        <div class="bulk-status-preview">${props.row.status.preview && props.row.status.preview}</div>
        <div class="bulk-status-url">${props.row.status.publish && props.row.url}</div>
        <div class="bulk-status-publish">${props.row.status.publish && props.row.status.publish}</div>
    </div>`;
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

function StatusTitle(props) {
  const urls = getUrls(props.urlsElt);
  const name = getActionName(props.submittedAction, true);
  const URLS = (urls?.length > 1) ? 'URLS' : 'URL';
  return props.submittedAction && html`
      <div class="bulk-status-title">
          STATUS ${name} ${urls?.length} ${URLS}
      </div>`;
}

function StatusContent(props) {
  return html`
    <div class="bulk-status-content">
        ${props.result && html`
            <div class="bulk-status-header">
                <div class="bulk-status-header-url">Preview Status</div>
                <div class="bulk-status-header-url">Publish Status</div>
            </div>
            <div class="bulk-status-rows">
                ${props.result.map((row) => html`<${StatusRow} row=${row} />`)}
            </div>
        `}
    </div>`;
}

function StatusFooter(props) {
  const timeStamp = prettyDate();
  return props.completion && html`
    <div class="bulk-status-footer">
        <div class="bulk-status-footer-preview">
            ${props.completion.preview.total > 0 && html`
                <div class="bulk-status-footer-preview-complete">job complete</div>
                <div class="bulk-status-footer-preview-date">${timeStamp}</div>
                <div class="bulk-status-footer-preview-success">successful: ${props.completion.preview.success} / ${props.completion.preview.total}</div>
            `}
        </div>
        <div class="bulk-status-footer-publish">
            ${props.completion.publish.total > 0 && html`
                <div class="bulk-status-footer-publish-complete">job complete</div>
                <div class="bulk-status-footer-publish-date">${timeStamp}</div>
                <div class="bulk-status-footer-publish-success">successful: ${props.completion.publish.success} / ${props.completion.publish.total}</div>
        `}
        </div>
    </div>`;
}

function Status(props) {
  return html`
    <div class="bulk-status">
        <div class="bulk-status-title-container">
            <${StatusTitle}
                submittedAction=${props.submittedAction}
                urlsElt=${props.urlsElt} />
        </div>
        <div class="bulk-status-content-container">
            <${StatusContent}
                result=${props.result} />
        </div>
        <div class="bulk-status-footer-container">
            <${StatusFooter}
                completion=${props.completion} />
        </div>
    </div>`;
}

function User(props) {
  return html`
      <div class="bulk-user-name">
          ${props.user.name}
      </div>`;
}

function SubmitBtn(props) {
  const name = getActionName(props.selectedAction);
  return html`
      <button class="bulk-action-submit" onClick=${props.onSubmit}>
          ${name}
      </button>`;
}

function ErrorMessage(props) {
  let message;
  if (!props.authorized) {
    message = 'You are not authorized to perform bulk operations';
  } else if (props.urlNumber === 0) {
    message = 'There are no URLs specified';
  } else if (props.urlNumber > MAX_URLS_NUMBER) {
    message = `There are too many URLs. You entered ${props.urlNumber} URLs. The max allowed number is ${MAX_URLS_NUMBER}`;
  }
  return !!message && html`
      <div class="bulk-error">
          ${message}
      </div>`;
}

function Bulk(props) {
  const [authorized, setAuthorized] = useState(true);
  const [urlNumber, setUrlNumber] = useState(-1);
  const [selectedAction, setSelectedAction] = useState('preview');
  const [submittedAction, setSubmittedAction] = useState(null);
  const [result, setResult] = useState(null);
  const [completion, setCompletion] = useState(null);

  const urlsElt = useRef(null);
  const actionElt = useRef(null);

  const signOut = (e) => {
    e.preventDefault();
    window.adobeIMS?.signOut();
  };

  const onSubmit = async () => {
    // reset the result area
    setSubmittedAction(null);
    setResult(null);
    setCompletion(null);

    // validate the user
    const authorizedValue = await userIsAuthorized();
    setAuthorized(authorizedValue);
    if (!authorizedValue) return;

    // validate the number of urls
    const urls = getUrls(urlsElt);
    const urlNumberValue = urls.length;
    setUrlNumber(urlNumberValue);
    if (urlNumberValue === 0 || urlNumberValue > MAX_URLS_NUMBER) return;

    // perform the action
    const submittedActionValue = actionElt.current.value;
    setSubmittedAction(submittedActionValue);
    const actions = submittedActionValue.split('&');
    const results = await executeActions(actions, urls, setResult);
    const completionValue = getCompletion(results);
    setCompletion(completionValue);

    // Log the actions on the server
    await sendReport(results, submittedActionValue);
  };

  const onSelectChange = () => {
    setSelectedAction(actionElt.current.value);
  };

  return html`
    <div class="bulk">
        <div class="bulk-header">
            <div class="bulk-urls">
                <div class="bulk-urls-title">urls</div>
            </div>
            <div class="bulk-user">
                <div class="bulk-user-header">logged in as</div>
                <${User} user=${props.user} />
                <a class="bulk-user-signout" onclick=${signOut}>Sign out</a>
            </div>
        </div>
        <textarea class="bulk-urls-input" ref="${urlsElt}"></textarea>
        <div class="bulk-action">
            <${SubmitBtn}
                onSubmit=${onSubmit}
                selectedAction=${selectedAction} />
            <select class="bulk-action-select" ref="${actionElt}" onChange=${onSelectChange}>
                <option value="preview">Preview</option>
                <option value="publish">Publish</option>
                <option value="preview&publish">Preview & Publish</option>
            </select>
        </div>
        <${ErrorMessage}
            authorized=${authorized}
            urlNumber=${urlNumber} />
        <${Status}
            urlsElt=${urlsElt}
            submittedAction=${submittedAction}
            result=${result}
            completion=${completion} />
    </div>`;
}

export default async function init(el) {
  const signedIn = await signIn();
  if (!signedIn) return;

  const user = await getUser();
  render(html`<${Bulk} user="${user}" />`, el);
}
// TODO remove the anonymous user in bulk-config.xlsx
// TODO: test edge cases + write tests
