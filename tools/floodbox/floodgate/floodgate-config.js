import RequestHandler from '../request-handler.js';
import { DA_ORIGIN } from '../constants.js';

const FLOODGATE_CONFIG_FILE = '/.milo/floodgate/config.json';

function normalizeEmail(s) {
  return String(s ?? '').trim().toLowerCase();
}

/** @param {string} [value] */
function parseUserList(value) {
  if (!value || typeof value !== 'string') return [];
  return value.split(',').map((e) => normalizeEmail(e)).filter(Boolean);
}

/** Source-repo path under /{org}/{repo}/drafts (wildcards use path prefix before *). */
function isPathUnderDrafts(path, org, repo) {
  if (!path || !org || !repo) return false;
  const draftsRoot = `/${org}/${repo}/drafts`;
  const base = path.endsWith('*') ? path.slice(0, -1).replace(/\/$/, '') : path;
  return base === draftsRoot || base.startsWith(`${draftsRoot}/`);
}

/**
 * @typedef {'none'|'all'|'operation'|'paths'} FloodgateBlockScope
 * @typedef {object} FloodgateAccessResult
 * @property {'full'|'copyOnly'|'draftsOnly'|'blocked'} mode
 * @property {FloodgateBlockScope} blockScope
 * @property {string} [errorMessage]
 * @property {string} [infoMessage]
 */

/**
 * @param {object} opts
 * @param {string[]} opts.allAccessUsers — normalized emails with full access
 * @param {string[]} opts.copyOnlyUsers — normalized emails that can only copy
 * @param {boolean} opts.draftsAllowed — whether unlisted users can work in drafts
 * @param {string} opts.userEmail — raw email from IMS
 * @param {string[]} opts.paths — validated source-repo paths
 * @param {'copy'|'promote'|'delete'} opts.operation
 * @param {string} opts.org
 * @param {string} opts.repo — source repo name (not floodgate repo)
 * @returns {FloodgateAccessResult}
 */
function evaluateFloodgateAccess({
  allAccessUsers,
  copyOnlyUsers,
  draftsAllowed,
  userEmail,
  paths,
  operation,
  org,
  repo,
}) {
  const u = normalizeEmail(userEmail);
  if (!u) {
    return {
      mode: 'blocked',
      blockScope: 'all',
      errorMessage: 'Could not verify your Adobe ID. Sign in and refresh, then try again.',
    };
  }

  const allAccess = (allAccessUsers || []).map(normalizeEmail).filter(Boolean);
  if (allAccess.includes(u)) {
    return { mode: 'full', blockScope: 'none' };
  }

  const copyOnly = (copyOnlyUsers || []).map(normalizeEmail).filter(Boolean);
  if (copyOnly.includes(u)) {
    const infoMessage = 'You only have permission to copy files to floodgate.';
    if (operation !== 'copy') {
      return {
        mode: 'blocked',
        blockScope: 'operation',
        infoMessage,
        errorMessage: `${infoMessage} Promote and Delete are not available for your account.`,
      };
    }
    return { mode: 'copyOnly', blockScope: 'none', infoMessage };
  }

  if (draftsAllowed) {
    const infoMessage = 'You only have permission to work with files in the drafts folder.';

    if (!paths.length) {
      return { mode: 'draftsOnly', blockScope: 'none', infoMessage };
    }

    const allDrafts = paths.every((p) => isPathUnderDrafts(p, org, repo));
    if (!allDrafts) {
      return {
        mode: 'blocked',
        blockScope: 'paths',
        infoMessage,
        errorMessage: 'You only have permission for paths under the drafts folder. Remove paths outside /drafts or contact an administrator.',
      };
    }

    return { mode: 'draftsOnly', blockScope: 'none', infoMessage };
  }

  return {
    mode: 'blocked',
    blockScope: 'all',
    errorMessage: 'You are not authorized to use Floodgate for this site. Ask an administrator to add your email to the floodgate config.',
  };
}

const getSheetByIndex = (json, index = 0) => {
  if (json[':type'] !== 'multi-sheet') {
    return json;
  }
  const names = json[':names']
    || Object.keys(json).filter((k) => !k.startsWith(':'));
  return json[names[index]];
};

const getFirstSheet = (json) => getSheetByIndex(json, 0);

/**
 * FloodgateConfig provides the configuration setup for the Floodgate app.
 */
class FloodgateConfig {
  constructor(org, repo, accessToken, signal) {
    this.org = org;
    this.repo = repo;
    this.accessToken = accessToken;
    this.signal = signal;
    this.requestHandler = new RequestHandler(accessToken, { signal });

    this.draftsAllowed = false;
    this.allAccessUsers = [];
    this.copyOnlyUsers = [];
    this.colors = [];
    this.promoteIgnorePaths = [];
    this.chronoBoxFragmentsEnabled = false;
  }

  async getConfig() {
    const resp = await this.requestHandler.daFetch(`${DA_ORIGIN}/source/${this.org}/${this.repo}${FLOODGATE_CONFIG_FILE}`);
    if (resp.ok) {
      const json = await resp.json();
      const config = getFirstSheet(json);
      const promoteIgnorePathsConfig = json['promote-ignore-paths'];

      if (config) {
        this.#setConfig(config);
      }

      if (promoteIgnorePathsConfig) {
        this.promoteIgnorePaths = promoteIgnorePathsConfig.data
          .map(({ promoteIgnorePaths }) => promoteIgnorePaths)
          .filter(Boolean);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch Floodgate config for ${this.org}/${this.repo}`);
    }
  }

  getPromoteIgnorePaths() {
    return this.promoteIgnorePaths;
  }

  #setConfig(config) {
    if (!Array.isArray(config?.data)) return;
    const draftsAllowedEntry = config.data.find(({ key }) => key === 'draftsAllowed');
    this.draftsAllowed = draftsAllowedEntry?.value === 'true';
    const allAccessUsersEntry = config.data.find(({ key }) => key === 'allAccessUsers');
    this.allAccessUsers = parseUserList(allAccessUsersEntry?.value);
    const copyOnlyUsersEntry = config.data.find(({ key }) => key === 'copyOnlyUsers');
    this.copyOnlyUsers = parseUserList(copyOnlyUsersEntry?.value);
    const colors = config.data.find(({ key }) => key === 'colors');
    this.colors = colors?.value?.split(',').map((color) => color.trim());
    const chronoBoxEntry = config.data.find(({ key }) => key === 'chronoBoxFragmentsEnabled');
    this.chronoBoxFragmentsEnabled = chronoBoxEntry?.value === 'true';
  }
}

export default FloodgateConfig;
export {
  normalizeEmail,
  parseUserList,
  isPathUnderDrafts,
  evaluateFloodgateAccess,
};
