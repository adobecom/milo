import {html, render, useState, useRef, useEffect} from '../../deps/htm-preact.js';
import { getImsToken } from '../../../tools/send-to-caas/send-utils.js';
import { loadScript } from '../../utils/utils.js';

const UNSUPPORTED_SITE = 'unsupported domain';
const URLS_NUMBER = 200;

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
  try {
    const { origin } = new URL(url);
    const sites = await getSupportedSites();
    return sites.includes(origin);
  } catch (e) {
    return false;
  }
};

const getReport = async (urls, action) => {
  const origins = new Map();
  urls.forEach((url) => {
    let origin;
    try {
      const urlObj = new URL(url);
      origin = urlObj.origin;
    } catch (e) {
      origin = url;
    }
    const count = origins.get(origin) || 0;
    origins.set(origin, count + 1);
  });
  const timestamp = new Date().toISOString();
  const { email } = await window.adobeIMS.getProfile();
  return [...origins.keys()].map((origin) => ({
    timestamp,
    email,
    action,
    domain: origin,
    urls: origins.get(origin),
  }));
};

const sendReport = async (urls, action) => {
  const rows = await getReport(urls, action);
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
  });
};

const execute = async (url, action) => {
  const siteAllowed = await siteIsSupported(url);
  if (!siteAllowed) return UNSUPPORTED_SITE;
  const { hostname, pathname } = new URL(url);
  const [branch, repo, owner] = hostname.split('.')[0].split('--');
  const adminURL = `https://admin.hlx.page/${action}/${owner}/${repo}/${branch}${pathname}`;
  const resp = await fetch(adminURL, {
    method: 'POST',
  });
  return resp.status;
};

const executeAll = async (url, actionName) => {
  const actions = actionName.split('&');
  const status = {};
  for (let j = 0; j < actions.length; j++) {
    const action = actions[j];
    // eslint-disable-next-line no-await-in-loop
    status[action] = await execute(url, action);
  }
  return status;
};

function getActionName(action, gerund) {
  let name;
  switch (action) {
    case 'preview':
      name = (!gerund) ? 'Preview' : 'Previewing';
      break;
    case 'live':
      name = (!gerund) ? 'Publish' : 'Publishing';
      break;
    default:
      name = (!gerund) ? 'Preview & publish' : 'Previewing & publishing';
  }
  return name;
}

function getUrls(element) {
  return element.current?.value.split('\n').filter((url) => url.length > 0).map((e) => e.trim()) || [];
}

function StatusRow(props) {
  const [status, setStatus] = useState(null);
  useEffect(() => {
    async function setActionStatus() {
      const statusValue = await executeAll(props.url, props.action);
      setTimeout(() => {
        setStatus(statusValue);
      }, 500);
    }
    setActionStatus();
  }, [props]);
  return status && html`
    <div class="bulk-status-row">
        <div class="bulk-status-url">${status.preview && props.url}</div>
        <div class="bulk-status-preview">${status.preview && status.preview}</div>
        <div class="bulk-status-url">${status.live && props.url}</div>
        <div class="bulk-status-publish">${status.live && status.live}</div>
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

function StatusContent(props) {
  const urls = getUrls(props.urlsElt);
  // const timeStamp = prettyDate();
  return html`
    <div class="bulk-status-content">
        <div class="bulk-status-header">
            <div class="bulk-status-header-url">Preview Status</div>
            <div class="bulk-status-header-url">Publish Status</div>
        </div>
        <div class="bulk-status-rows">
            ${urls.map((url) => html`<${StatusRow} url=${url} action=${props.action} />`)}
        </div>
    </div>`;
}

function StatusTitle(props) {
  const urls = getUrls(props.urlsElt);
  const name = getActionName(props.action, true);
  const URLS = (urls?.length > 1) ? 'URLS' : 'URL';
  return props.action && html`
      <div class="bulk-status-title">
          STATUS ${name} ${urls?.length} ${URLS}
      </div>`;
}

function Status(props) {
  if (!props.action) return '';
  return html`
    <div class="bulk-status">
        <div class="bulk-status-title-container">
            <${StatusTitle}
                action=${props.action}
                urlsElt=${props.urlsElt} />
        </div>
        <div class="bulk-status-content-container">
            <${StatusContent}
                action=${props.action}
                urlsElt=${props.urlsElt} />
        </div>
    </div>`;
}

function User(props) {
  return html`
      <div class="bulk-user-name">
          ${props.user}
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
  } else if (props.urlNumber > URLS_NUMBER) {
    message = `There are too many URLs. You entered ${props.urlNumber} URLs. The max allowed number is ${URLS_NUMBER}`;
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
  
  const urlsElt = useRef(null);
  const actionElt = useRef(null);
  
  const onSubmit = async () => {
    // reset the result area
    setSubmittedAction(null);
    
    // validate the user
    const authorizedValue = await userIsAuthorized();
    setAuthorized(authorizedValue);
    if (!authorizedValue) return;
    
    // validate the number of urls
    const urls = getUrls(urlsElt);
    const urlNumberValue = urls.length;
    setUrlNumber(urlNumberValue);
    if (urlNumberValue === 0 || urlNumberValue > URLS_NUMBER) return;
    
    // perform the action
    const submittedActionValue = actionElt.current.value;
    setSubmittedAction(submittedActionValue);
    // const actions = submittedActionValue.split('&');
    // const resultValue = await executeAll(actions, urls);
    // setResult(resultValue);
    
    // Log the actions on the server
    await sendReport(urls, submittedActionValue);
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
                </div>
            </div>
            <textarea class="bulk-urls-input" ref="${urlsElt}"></textarea>
            <div class="bulk-action">
                <${SubmitBtn}
                    onSubmit=${onSubmit}
                    selectedAction=${selectedAction} />
                <select class="bulk-action-select" ref="${actionElt}" onChange=${onSelectChange}>
                    <option value="preview">Preview</option>
                    <option value="live">Publish</option>
                    <option value="preview&live">Preview & Publish</option>
                </select>
            </div>
            <${ErrorMessage}
                authorized=${authorized}
                urlNumber=${urlNumber} />
            <${Status}
                action=${submittedAction}
                urlsElt=${urlsElt} />
        </div>`;
}

export default async function init(el) {
  // force user to sign in
  const signedIn = await signIn();
  if (!signedIn) return;
  
  const user = await getUser();
  render(html`<${Bulk} user="${user}" />`, el);
}
// TODO: render one after the other
// TODO: test edge cases + write tests
