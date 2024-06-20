import { LitElement, html } from '../../../deps/lit-all.min.js';
import { Task } from '../../../deps/lit-task.min.js';
import login from '../../../tools/sharepoint/login.js';
import sharepointLogin from '../../../tools/sharepoint/login.js';
import { accessToken, accessTokenExtra, account } from '../../../tools/sharepoint/state.js';
import { setup } from '../../version-history/index.js';

const KEYS = {
  PROJECT_INFO: {
    EXPERIENCE_NAME: 'experienceName',
    GRAYBOX_IO_ENV: 'grayboxIoEnv',
  },
  CONFIG: {
    PROMOTE_DRAFTS_ONLY: 'sharepoint.site.promoteDraftsOnly',
    ENABLE_PROMOTE: 'sharepoint.site.enablePromote',
    PROMOTE_URL: {
      DEV: 'dev.graybox.promote.url',
      STAGE: 'stage.graybox.promote.url',
      PROD: 'prod.graybox.promote.url',
    },
  },
};

const TELEMETRY = { application: { appName: 'Adobe Graybox Promote' } };

async function getJson(url, errMsg = `Failed to fetch ${url}`) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error(errMsg, err.message);
  }

  if (!res.ok) {
    throw new Error(errMsg, res.status, res.statusText);
  }
  const sheet = await res.json();
  return sheet;
}

const getSheetValue = (data, key) => data
  ?.find((obj) => obj.key?.toLowerCase() === key?.toLowerCase())?.value;

function getAemInfo() {
  const search = new URLSearchParams(window.location.search);
  return {
    ref: search.get('ref'),
    repo: search.get('repo'),
    owner: search.get('owner'),
    referrer: search.get('referrer'),
  };
}

async function getProjectInfo(referrer) {
  const url = new URL(referrer);
  const sheet = await getJson(
    `${url.origin}${url.pathname}?sheet=settings`,
    'Failed to fetch project info',
  );
  return {
    experienceName: getSheetValue(sheet.data, KEYS.PROJECT_INFO.EXPERIENCE_NAME),
    grayboxIoEnv: getSheetValue(sheet.data, KEYS.PROJECT_INFO.GRAYBOX_IO_ENV),
  };
}

async function getGrayboxConfig(ref, repo, owner, grayboxIoEnv) {
  const sheet = await getJson(
    `https://${ref}--${repo}--${owner}.hlx.page/.milo/graybox-config.json`,
    'Failed to fetch graybox config',
  );
  const grayboxData = sheet.graybox?.data;
  return {
    promoteDraftsOnly: getSheetValue(grayboxData, KEYS.CONFIG.PROMOTE_DRAFTS_ONLY)?.toLowerCase() === 'true',
    enablePromote: true, /// TODO -> uncomment this //getSheetValue(grayboxData, KEYS.CONFIG.ENABLE_PROMOTE)?.toLowerCase() === 'true',
    promoteUrl: getSheetValue(grayboxData, KEYS.CONFIG.PROMOTE_URL[grayboxIoEnv.toUpperCase()]),
  };
}

async function getSharepointDriveId(ref, repo, owner) {
  const sheet = await getJson(
    `https://${ref}--${repo}--${owner}.hlx.page/.milo/config.json?sheet=configs`,
    'Failed to fetch milo config',
  );
  return getSheetValue(sheet.data, 'prod.sharepoint.driveId');
}

async function getSharePointDetails(hlxOrigin) {
  const { sharepoint } = await getServiceConfig(hlxOrigin);
  const spSiteHostname = sharepoint.site.split(',')[0].split('/').pop();
  return {
    origin: `https://${spSiteHostname}`,
    siteId: sharepoint.siteId,
    site: sharepoint.site,
    driveId: sharepoint.driveId ? `drives/${sharepoint.driveId}` : 'drive',
  };
}

class GrayboxPromote extends LitElement {
  spToken = accessToken.value || accessTokenExtra.value
  constructor() {
    super();

    this.getValuesTask = new Task(this, async () => {
        const { ref, repo, owner, referrer } = getAemInfo();
        const { experienceName, grayboxIoEnv } = await getProjectInfo(referrer);
        const {
          promoteDraftsOnly,
          enablePromote,
          promoteUrl,
        } = await getGrayboxConfig(ref, repo, owner, grayboxIoEnv);
        if (!enablePromote) {
          throw new Error('sharepoint.site.enablePromote is not enabled in graybox config');
        }
        const driveId = await getSharepointDriveId(ref, repo, owner);
        if (!this.spToken) {
           //TODO - delete below after getting Azure permissions
          return html`<button @click="${() => {
            this.spToken = 'abc'
            this.getValuesTask.run();
          }}">Login</button>`;
          // TODO - uncomment below after getting Azure permissions
          // return html`<button @click="${() => this.getSpTokenTask.run()}">Login</button>`;
        } else {
          return html`<button @click="${() => this.promoteTask.run(experienceName, grayboxIoEnv)}">Promote</button>`;
        }
    });
  
    this.getSpTokenTask = new Task(this, async () => {
        const { ref, repo, owner } = getAemInfo();
          return new Promise((resolve, reject) => {
            this.spLogin(ref, repo, owner)
              .then(() => {
                this.getValuesTask.run();
                resolve();
              })
              .catch(reject);
          });
    });
  
    this.promoteTask = new Task(this,  async () => {
        const promoteUrl = '';
        const token = this.spToken;
        const projectExelPath = '';
        const rootFolder = '';
        const gbRootFolder = '';
        const experienceName = '';
        const adminPageUri = '';
        const draftsOnly = '';
        const promoteIgnorePaths = '';
        const driveId = '';
        await fetch(`${promoteUrl}?spToken=${this.spToken}&
        projectExcelPath=${projectExelPath}
        &rootFolder=${rootFolder}
        &experienceName=${experienceName}
        &adminPageUri=${adminPageUri}
        &draftsOnly=${draftsOnly}
        &promoteIgnorePaths=${promoteIgnorePaths}
        &driveId=${driveId}
        &ignoreUserCheck=true`)
    });
  
    this.spLogin = () => {
      const scopes = ['files.readwrite', 'sites.readwrite.all'];
      const extraScopes = [`${origin}/.default`];
      return login({ scopes, extraScopes, telemetry: TELEMETRY })
        .then(() => {
          this.spToken = accessToken.value || accessTokenExtra.value;
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }

  async connectedCallback() {
    super.connectedCallback();
    this.task = new Task(this, this.run);
  }

  render() {
    return this.getValuesTask.render({
        pending: () => html`<p>Loading...</p>`,
        complete: i => i,
        error: (err) => html`<p>${err.message}</p>`,
      })
  }
}

customElements.define('graybox-promote', GrayboxPromote);
