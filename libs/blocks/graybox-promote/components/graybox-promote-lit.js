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
};

// eslint-disable-next-line
const getSheetValue = (data, key) => data?.find((obj) => obj.key?.toLowerCase() === key?.toLowerCase())?.value;

const getAemInfo = () => {
  const search = new URLSearchParams(window.location.search);
  return {
    ref: search.get('ref'),
    repo: search.get('repo'),
    owner: search.get('owner'),
    referrer: search.get('referrer'),
  };
};

const getProjectInfo = async (referrer) => {
  const url = new URL(referrer);
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

const getGrayboxConfig = async (ref, repo, owner, grayboxIoEnv) => {
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
    promoteIgnorePaths: sheet.promoteignorepaths?.data?.map((item) => item?.[KEYS.CONFIG.PROMOTE_IGNORE_PATHS])
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

const getProjectExcelPath = (url) => url.pathname.replace('.json', '.xlsx');

class GrayboxPromote extends LitElement {
  spToken = accessToken.value || accessTokenExtra.value;

  async connectedCallback() {
    super.connectedCallback();
    this.renderRoot.adoptedStyleSheets = [styleSheet];
  }

  constructor() {
    super();

    this.spLogin = async () => {
      const scopes = ['files.readwrite', 'sites.readwrite.all'];
      const extraScopes = [`${origin}/.default`];
      // TODO - delete below
      this.spToken = '1234';
      return null;
      // TODO - delete above
      return login({ scopes, extraScopes, telemetry: TELEMETRY })
        .then(() => {
          this.spToken = accessToken.value || accessTokenExtra.value;
        })
        .catch((error) => {
          throw error;
        });
    };

    this.getValuesTask = new Task(this, {
      task: async () => {
        const { ref, repo, owner, referrer } = getAemInfo();
        const url = new URL(referrer);
        const { experienceName, grayboxIoEnv } = await getProjectInfo(referrer);
        const {
          promoteDraftsOnly,
          enablePromote,
          promoteUrl,
          promoteIgnorePaths,
        } = await getGrayboxConfig(ref, repo, owner, grayboxIoEnv);
        const spData = await getSharepointData(url);
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
        } else {
          return html` <p>Are you sure you want to promote the content for ${experienceName}?</p>
            <button
              @click="${() =>
                this.promoteTask.run({
                  experienceName,
                  promoteUrl,
                  promoteDraftsOnly,
                  promoteIgnorePaths,
                  spData,
                  repo,
                  ref,
                  owner,
                  url,
                })}"
            >
              Promote
            </button>`;
        }
      },
      args: () => [],
    });

    this.getSpTokenTask = new Task(this, {
      task: async () => {
        const { ref, repo, owner } = getAemInfo();
        return new Promise((resolve, reject) => {
          this.spLogin(ref, repo, owner)
            .then(() => {
              this.getValuesTask.run();
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
        url,
        spData
      }) => {
        try {
          const {root, gbRoot, driveId} = spData;
          const mainRepo = repo.replace('-graybox', '');
          const promote = await fetch(`${promoteUrl}?spToken=${this.spToken}&projectExcelPath=${getProjectExcelPath(url)}&rootFolder=${root}&gbRootFolder=${gbRoot}&experienceName=${experienceName}&adminPageUri=${`https://milo.adobe.com/tools/graybox?ref=${ref}%26repo=${mainRepo}%26owner=${owner}`}%26host=business.adobe.com%26project=${mainRepo.toUpperCase()}%26referrer=MOCK_REF&draftsOnly=${promoteDraftsOnly}&promoteIgnorePaths=${promoteIgnorePaths}&driveId=${driveId}&ignoreUserCheck=true`);
          const promoteRes = await promote.json();
          if (promoteRes?.code === 200) {
            return 'Successfully promoted';
          } else {
            throw new Error('Could not promote. Please try again.');
          }
        } catch (e) {
          console.log(e);
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
          error: (err) =>
            html`<p>Error getting sharepoint token: ${err.message}</p>`,
        })}
        ${this.promoteTask.render({
          pending: () => html`<p>Promoting...</p>`,
          complete: (i) => i,
          error: (err) => html`<p>${err}</p>`,
        })}
        ${
          [1,2].includes(this.promoteTask.status) ? '' :
          this.getValuesTask.render({
          pending: () => html`<p>Loading...</p>`,
          complete: (i) => i,
          error: (err) => html`<p>${err.message}</p>`,
        })}
      </div>
    `;
  }
}

customElements.define('graybox-promote', GrayboxPromote);
