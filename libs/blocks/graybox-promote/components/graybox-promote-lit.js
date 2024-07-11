import { getSheet } from '../../../../tools/utils/utils.js';
import { LitElement, html } from '../../../deps/lit-all.min.js';
import { Task } from '../../../deps/lit-task.min.js';
// import login from '../../../tools/sharepoint/login.js';
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

// const TELEMETRY = { application: { appName: 'Adobe Graybox Promote' } };

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

const getAemInfo = () => {
  const search = new URLSearchParams(window.location.search);
  return {
    ref: search.get('ref'),
    repo: search.get('repo'),
    owner: search.get('owner'),
    excelRef: search.get('referrer'),
  };
};

const getProjectInfo = async (url) => {
  const liveOrigin = url.origin.replace('.hlx.page', '.hlx.live');
  const sheet = await getJson(
    `${liveOrigin}${url.pathname}?sheet=settings`,
    'Failed to fetch project info',
  );
  return {
    experienceName: getSheetValue(
      sheet.data,
      KEYS.PROJECT_INFO.EXPERIENCE_NAME,
    ),
    grayboxIoEnv: getSheetValue(sheet.data, KEYS.PROJECT_INFO.GRAYBOX_IO_ENV),
  };
};

const getGrayboxConfig = async ({ ref, repo, owner, grayboxIoEnv } = {}) => {
  const sheet = await getJson(
    `https://${ref}--${repo}--${owner}.hlx.live/.milo/graybox-config.json`,
    'Failed to fetch graybox config',
  );

  const grayboxData = sheet.graybox?.data;

  return {
    promoteDraftsOnly:
      getSheetValue(
        grayboxData,
        KEYS.CONFIG.PROMOTE_DRAFTS_ONLY,
      )?.toLowerCase() === 'true',
    enablePromote: getSheetValue(grayboxData, KEYS.CONFIG.ENABLE_PROMOTE)?.toLowerCase() === 'true',
    promoteUrl: getSheetValue(
      grayboxData,
      KEYS.CONFIG.PROMOTE_URL[(grayboxIoEnv || 'prod').toUpperCase()],
    ),
    promoteIgnorePaths: sheet.promoteignorepaths?.data
      ?.map((item) => item?.[KEYS.CONFIG.PROMOTE_IGNORE_PATHS])
      .join(','),
  };
};

const getSharepointData = async (url) => {
  const liveOrigin = url.origin.replace('-graybox', '').replace('.hlx.page', '.hlx.live');
  const { sharepoint } = await getServiceConfig(liveOrigin);
  return {
    root: `/${sharepoint.rootMapping}`,
    gbRoot: `/${sharepoint.rootMapping}-graybox`,
    driveId: sharepoint.driveId,
  };
};

const getFilePath = async ({ ref, repo, owner, excelRef } = {}) => {
  const status = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}?editUrl=${excelRef}`);
  if (!status.ok) throw new Error('Failed to fetch file path');
  return (new URL((await status.json())?.preview?.url))?.pathname;
};

const getPreviewUrl = async ({ owner, repo, ref, filePath } = {}) => {
  const res = await fetch(`${ADMIN}/preview/${owner}/${repo}/${ref}${filePath}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to fetch preview URL');
  return new URL((await res.json())?.preview?.url);
};

class GrayboxPromote extends LitElement {
  spToken = accessToken.value || accessTokenExtra.value;

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet];
  }

  constructor() {
    super();

    this.loginToSharepoint = async () => {
      // TODO - delete below
      this.spToken = '1234';
      return null;
      // TODO - uncomment below
      // const scopes = ['files.readwrite', 'sites.readwrite.all'];
      // const extraScopes = [`${origin}/.default`];
      // return login({ scopes, extraScopes, telemetry: TELEMETRY })
      //   .then(() => {
      //     this.spToken = accessToken.value || accessTokenExtra.value;
      //   })
      //   .catch((error) => {
      //     throw error;
      //   });
    };

    this.setupTask = new Task(this, {
      task: async () => {
        const { ref, repo, owner, excelRef } = getAemInfo();
        const filePath = await getFilePath({ ref, repo, owner, excelRef });
        const previewUrl = await getPreviewUrl({ owner, repo, ref, filePath });
        const { experienceName, grayboxIoEnv } = await getProjectInfo(previewUrl);
        const {
          promoteDraftsOnly,
          enablePromote,
          promoteUrl,
          promoteIgnorePaths,
        } = await getGrayboxConfig({ ref, repo, owner, grayboxIoEnv });
        const spData = await getSharepointData(previewUrl);
        if (!enablePromote) {
          throw new Error(
            'sharepoint.site.enablePromote is not enabled in graybox config',
          );
        }

        if (!this.spToken) {
          return html`
            <p>
              The login popup was blocked.<br />Please use the button below.
            </p>
            <button @click="${() => this.getSpTokenTask.run()}">Login</button>
          `;
        }
        return html` <p>Are you sure you want to promote the content for ${experienceName}?</p>
            <button
              @click="${() => this.promoteTask.run({
    experienceName,
    promoteUrl,
    promoteDraftsOnly,
    promoteIgnorePaths,
    spData,
    repo,
    ref,
    owner,
    filePath,
  })}"
            >
              Promote
            </button>`;
      },
      args: () => [],
    });

    this.getSpTokenTask = new Task(this, {
      task: async () => {
        const { ref, repo, owner } = getAemInfo();
        return new Promise((resolve, reject) => {
          this.loginToSharepoint(ref, repo, owner)
            .then(() => {
              this.setupTask.run();
              resolve();
            })
            .catch(reject);
        });
      },
      autoRun: false,
    });

    this.promoteTask = new Task(this, {
      task: async ({
        experienceName,
        promoteUrl,
        promoteDraftsOnly,
        promoteIgnorePaths,
        repo,
        ref,
        owner,
        spData,
        filePath,
      }) => {
        try {
          const { root, gbRoot, driveId } = spData;
          const mainRepo = repo.replace('-graybox', '');
          const params = {
            adminPageUri: `https://milo.adobe.com/tools/graybox-promote?ref=${ref}&repo=${mainRepo}&owner=${owner}&host=business.adobe.com&project=${mainRepo.toUpperCase()}&referrer=MOCK_REF`,
            projectExcelPath: filePath.replace('.json', '.xlsx'),
            rootFolder: root,
            gbRootFolder: gbRoot,
            experienceName,
            draftsOnly: promoteDraftsOnly,
            promoteIgnorePaths,
            driveId,
            ignoreUserCheck: true,
            spToken: this.spToken,
          };
          const promote = await fetch(promoteUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(params).toString(),
          });
          const promoteRes = await promote.json();
          if (promoteRes?.code === 200) {
            return 'Successfully promoted';
          }
          throw new Error('Could not promote. Please try again.');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e);
          return 'Failed to promote.';
        }
      },
      autoRun: false,
    });
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.getSpTokenTask.render({
    pending: () => html`<p>Logging in to sharepoint...</p>`,
    complete: () => {},
    error: (err) => html`<p>Error getting sharepoint token: ${err.message}</p>`,
  })}
        ${this.promoteTask.render({
    pending: () => html`<p>Promoting...</p>`,
    complete: (i) => i,
    error: (err) => html`<p>${err}</p>`,
  })}
        ${
  [1, 2].includes(this.promoteTask.status) ? ''
    : this.setupTask.render({
      pending: () => html`<p>Loading...</p>`,
      complete: (i) => i,
      error: (err) => html`<p>${err.message}</p>`,
    })}
      </div>
    `;
  }
}

customElements.define('graybox-promote', GrayboxPromote);
