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
  context.ref = search.get('ref');
  context.repo = search.get('repo');
  context.owner = search.get('owner');
  context.excelRef = search.get('referrer');
};

const getProjectInfo = async (context) => {
  const sheet = await getJson(
    `${context.liveUrl.href}?sheet=settings`,
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
    `https://${ref}--${repo}--${owner}.hlx.live/.milo/graybox-config.json`,
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
  const liveOrigin = context.liveUrl.origin.replace('-graybox', '').replace('.hlx.page', '.hlx.live');
  const { sharepoint } = await getServiceConfig(liveOrigin);
  context.setup.rootFolder = `/${sharepoint.rootMapping}`;
  context.setup.gbRootFolder = `/${sharepoint.rootMapping}-graybox`;
  context.setup.driveId = sharepoint.driveId;
};

const getFilePath = async (context) => {
  const { ref, repo, owner, excelRef } = context;
  const status = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}?editUrl=${excelRef}`);
  if (!status.ok) throw new Error('Failed to fetch file path');
  const statusResp = await status.json();
  context.previewUrl = statusResp.preview.status === 200 && new URL(statusResp.preview.url);
  context.liveUrl = statusResp.live.status === 200 && new URL(statusResp.live.url);
  context.setup.projectExcelPath = (new URL(statusResp.preview.url)).pathname.replace('.json', '.xlsx');
};

const preview = async (context) => {
  const { owner, repo, ref, setup: { projectExcelPath } } = context;
  const res = await fetch(`${ADMIN}/preview/${owner}/${repo}/${ref}${projectExcelPath.replace('.xlsx', '.json')}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to fetch preview URL');
  context.previewUrl = new URL((await res.json()).preview.url);
};

const publish = async (context) => {
  const { owner, repo, ref, setup: { projectExcelPath } } = context;
  const res = await fetch(`${ADMIN}/live/${owner}/${repo}/${ref}${projectExcelPath.replace('.xlsx', '.json')}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to fetch live URL');
  context.liveUrl = new URL((await res.json()).live.url);
};

const loginToSharepoint = async (context) => login({ scopes: ['files.readwrite', 'sites.readwrite.all'], telemetry: TELEMETRY })
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
        if (!this.liveUrl) await publish(this);
        await getProjectInfo(this);
        await getSharepointData(this);
        const mainRepo = this.repo.replace('-graybox', '');
        this.setup.adminPageUri = `https://milo.adobe.com/tools/graybox-promote?ref=${this.ref}&repo=${mainRepo}&owner=${this.owner}&host=business.adobe.com&project=${mainRepo.toUpperCase()}&referrer=MOCK_REF`;
        await getGrayboxConfig(this);
        // TODO remove the line below after receiving user permissions
        this.setup.ignoreUserCheck = true;

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
          return 'Successfully promoted';
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
