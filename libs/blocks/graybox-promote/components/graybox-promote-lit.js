import { getSheet } from '../../../../tools/utils/utils.js';
import { LitElement, html } from '../../../deps/lit-all.min.js';
import { Task } from '../../../deps/lit-task.min.js';
import login from '../../../tools/sharepoint/login.js';
import {
  accessToken,
  accessTokenExtra,
} from '../../../tools/sharepoint/state.js';
import getServiceConfig from '../../../utils/service-config.js';
import { getConfig } from '../../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;
const styleSheet = await getSheet(
  `${base}/blocks/graybox-promote/graybox-promote.css`,
);
const ADMIN = 'https://admin.hlx.page';
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
    PROMOTE_IGNORE_PATHS: 'PromoteIgnorePaths',
  },
};
const TELEMETRY = { application: { appName: 'Adobe Graybox Promote' } };
const CONFIG = {
  login: { redirectUri: '/tools/graybox-promote/spauth' },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

const getJson = async (url, errMsg = `Failed to fetch ${url}`) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(errMsg, res.status, res.statusText);
  }
  const sheet = await res.json();
  return sheet;
};

const getSheetValue = (data, key) => data?.find(
  (obj) => obj.key?.toLowerCase() === key?.toLowerCase(),
)?.value;

const getAemInfo = (context) => {
  const search = new URLSearchParams(window.location.search);
  ['ref', 'repo', 'owner', 'referrer'].forEach((key) => {
    context[key] = search.get(key) || '';
  });
};

const getProjectInfo = async (context) => {
  const sheet = await getJson(
    `${context.previewUrl.href}?sheet=settings`,
    'Failed to fetch project info',
  );
  context.setup.experienceName = getSheetValue(
    sheet.data,
    KEYS.PROJECT_INFO.EXPERIENCE_NAME,
  );
  context.grayboxIoEnv = getSheetValue(sheet.data, KEYS.PROJECT_INFO.GRAYBOX_IO_ENV);
};

const getGrayboxConfig = async (context) => {
  const { ref, repo, owner, grayboxIoEnv } = context;
  const sheet = await getJson(
    `https://${ref}--${repo}--${owner}.hlx.page/.milo/graybox-config.json`,
    'Failed to fetch graybox config',
  );

  const grayboxData = sheet.graybox?.data;
  context.enablePromote = getSheetValue(grayboxData, KEYS.CONFIG.ENABLE_PROMOTE)?.toLowerCase() === 'true';
  context.promoteUrl = getSheetValue(
    grayboxData,
    KEYS.CONFIG.PROMOTE_URL[(grayboxIoEnv || 'prod').toUpperCase()],
  );
  context.setup.draftsOnly = getSheetValue(
    grayboxData,
    KEYS.CONFIG.PROMOTE_DRAFTS_ONLY,
  )?.toLowerCase() === 'true';
  context.setup.promoteIgnorePaths = sheet.promoteignorepaths?.data
    ?.map((item) => item?.[KEYS.CONFIG.PROMOTE_IGNORE_PATHS])
    .join(',');
};

const getSharepointData = async (context) => {
  const liveOrigin = context.previewUrl.origin.replace('-graybox', '').replace('.hlx.page', '.hlx.live');
  const { sharepoint } = await getServiceConfig(liveOrigin);
  context.setup.rootFolder = `/${sharepoint.rootMapping}`;
  context.setup.gbRootFolder = `/${sharepoint.rootMapping}-graybox`;
  context.setup.driveId = sharepoint.driveId;
};

const getFilePath = async (context) => {
  const { ref, repo, owner, referrer } = context;
  const status = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}?editUrl=${referrer}`);
  if (!status.ok) throw new Error('Failed to fetch file path. Please ensure you\'re signed in to Sidekick.');
  const statusResp = await status.json();
  context.previewUrl = statusResp.preview.status === 200 && new URL(statusResp.preview.url);
  context.setup.projectExcelPath = (new URL(statusResp.preview.url)).pathname.replace('.json', '.xlsx');
};

const preview = async (context) => {
  const { owner, repo, ref, setup: { projectExcelPath } } = context;
  const res = await fetch(`${ADMIN}/preview/${owner}/${repo}/${ref}${projectExcelPath.replace('.xlsx', '.json')}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to preview your file. Please ensure you\'re signed in to Sidekick.');
  context.previewUrl = new URL((await res.json()).preview.url);
};

const loginToSharepoint = async (context) => login({
  scopes: ['files.readwrite', 'sites.readwrite.all'],
  telemetry: TELEMETRY,
  config: CONFIG,
  suppliedOrigin: window.location.origin,
})
  .then(() => {
    context.setup.spToken = accessToken.value || accessTokenExtra.value;
  });

class GrayboxPromote extends LitElement {
  setup = { spToken: accessToken.value || accessTokenExtra.value };

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet];
  }

  constructor() {
    super();

    this.setupTask = new Task(this, {
      task: async () => {
        if (!this.setup.spToken) await loginToSharepoint(this);
        getAemInfo(this);
        await getFilePath(this);
        if (!this.previewUrl) await preview(this);
        await getProjectInfo(this);
        await getSharepointData(this);
        const mainRepo = this.repo.replace('-graybox', '');
        this.setup.adminPageUri = `https://milo.adobe.com/tools/graybox-promote?ref=${this.ref}&repo=${mainRepo}&owner=${this.owner}&project=${mainRepo.toUpperCase()}`;
        await getGrayboxConfig(this);

        if (!this.enablePromote) throw new Error('sharepoint.site.enablePromote is not enabled in graybox config');

        return html`
            <p>Are you sure you want to promote the content for ${this.setup.experienceName}?</p>
            <button @click="${() => this.promoteTask.run()}">Promote</button>`;
      },
      args: () => [],
    });

    this.promoteTask = new Task(this, {
      task: async () => {
        const promote = await fetch(this.promoteUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(this.setup).toString(),
        });
        const promoteRes = await promote.json();
        if (promoteRes?.code === 200) {
          return 'Promote triggered. Please check the status of your promote in the excel logs.';
        }
        throw new Error(`Could not promote: ${promote.payload}`);
      },
      autoRun: false,
    });
  }

  render() {
    return html`
      <div class="wrapper">
       ${this.setupTask.render({
    pending: () => html`<p>Loading...</p>`,
    complete: (i) => (this.promoteTask.status === 0 ? i : ''),
    error: (err) => html`<p>${err}</p>`,
  })}
        ${this.promoteTask.render({
    pending: () => html`<p>Promoting...</p>`,
    complete: (i) => i,
    error: (err) => html`<p>${err}</p>`,
  })}
      </div>
    `;
  }
}

customElements.define('graybox-promote', GrayboxPromote);
