import login from '../../tools/sharepoint/login.js';
import { account } from '../../tools/sharepoint/state.js';
import getServiceConfig from '../../utils/service-config.js';
import { getReqOptions } from '../../tools/sharepoint/msal.js';
import { createTag } from '../../utils/utils.js';

const SCOPES = ['files.readwrite', 'sites.readwrite.all'];
const TELEMETRY = { application: { appName: 'Milo - Path Finder' } };

const getSharePointDetails = (() => {
  let site;
  let driveId;
  let reqOpts;

  return async () => {
    if (site && driveId && reqOpts) return { site, driveId, reqOpts };

    // Fetching SharePoint details
    const { sharepoint } = await getServiceConfig();
    ({ site } = sharepoint);
    driveId = sharepoint.driveId ? `drives/${sharepoint.driveId}` : 'drive';
    reqOpts = getReqOptions();

    return { site, driveId, reqOpts };
  };
})();

function getItemId() {
  const referrer = new URLSearchParams(window.location.search).get('referrer');
  const sourceDoc = referrer?.match(/sourcedoc=([^&]+)/)[1];
  const sourceId = decodeURIComponent(sourceDoc);
  return sourceId.slice(1, -1);
}

async function linkToPage(e, form, input, target) {
  e.preventDefault();

  const { site, driveId, reqOpts } = await getSharePointDetails();
  const resp = await fetch(`${site}/${driveId}/root:${input.value}`, reqOpts);
  if (!resp.ok) {
    form.classList.add('error');
    return;
  }

  form.classList.remove('error');
  const json = await resp.json();
  window.open(json.webUrl, target || '_blank');
}

function buildUi(el, path) {
  const form = createTag('form');
  const input = createTag('input', { type: 'text', value: path });
  const btn = createTag('button', { }, 'Go');
  const jumpBtn = createTag('button', { }, '');
  jumpBtn.classList.add('new-tab');

  form.addEventListener('submit', (e) => linkToPage(e, form, input, '_parent'));
  jumpBtn.addEventListener('click', (e) => linkToPage(e, form, input));
  form.append(input, btn, jumpBtn);
  el.append(form);
}

async function setup(el) {
  await login({ scopes: SCOPES, telemetry: TELEMETRY });
  if (!account.value.username) {
    window.lana.log('Could not login to MS Graph', { tags: 'errorType=info,module=path-finder' });
    return;
  }
  el.innerHTML = '';
  // Get basic SP details
  const { site, driveId, reqOpts } = await getSharePointDetails();

  // Get basic item details
  const itemId = getItemId();

  // Ask Graph
  const resp = await fetch(`${site}/${driveId}/items/${itemId}`, reqOpts);
  if (!resp.ok) return;
  const json = await resp.json();

  // Format the data
  const fileName = json.name;
  const parentPath = json.parentReference.path.split(':').pop();
  const fullPath = `${parentPath}/${fileName}`;

  // Build the UI
  buildUi(el, fullPath);
}

function buttonSetup(el) {
  const span = createTag('span');
  span.innerHTML = 'The login popup was blocked. Please use this login button to try again.';
  const btn = createTag('button', { class: 'login' }, 'Open login');
  btn.addEventListener('click', () => setup(el));
  el.append(span, btn);
}

export default async function init(el) {
  try {
    await setup(el);
  } catch {
    buttonSetup(el);
  }
}
