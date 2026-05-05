import process from 'node:process';
import { getRemoteDocumentPath } from './paths.js';

/**
 * @typedef {import('../config/scope.js').ExtractUnit} ExtractUnit
 */

const HLX_ADMIN_ORIGIN = 'https://admin.hlx.page';
const HLX_ORG = 'adobecom';
const HLX_REF = 'main';

/**
 * @typedef {'preview' | 'publish'} PromoteAction
 */

/**
 * @typedef {Object} PromoteJobResponse
 * @property {{ self?: string }} [links]
 */

/**
 * @typedef {Object} PromoteJobStatus
 * @property {string} [stopTime]
 * @property {{ failed?: number }} [progress]
 * @property {{ resources?: Array<{ status?: number, path?: string }> }} [data]
 */

/**
 * @param {string} owner
 * @param {string} repo
 * @param {string} [prefix]
 * @returns {string}
 */
export function getSiteEnvKey(owner, repo, prefix = '') {
  return `${prefix || ''}${owner}_${repo}`.replaceAll('-', '_').toUpperCase();
}

/**
 * @param {string} site
 * @returns {string}
 */
export function getRepoToken(site) {
  const siteTokenKey = getSiteEnvKey(HLX_ORG, site, 'AEM_ADMIN_TOKEN_');
  const candidates = [
    process.env[siteTokenKey],
    process.env[`AEM_ADMIN_TOKEN_${site.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()}`],
    process.env.AEM_ADMIN_TOKEN,
    process.env.AEM_TOKEN,
    process.env.HLX_ADMIN_TOKEN,
  ].filter(Boolean);

  const token = candidates[0];
  if (!token) {
    throw new Error(
      `Missing AEM admin token for ${site}. Set ${siteTokenKey}, AEM_ADMIN_TOKEN, AEM_TOKEN, or HLX_ADMIN_TOKEN.`,
    );
  }

  return token.startsWith('token ') ? token : `token ${token}`;
}

/**
 * @param {PromoteAction} action
 * @param {string} repo
 * @returns {string}
 */
function getEndpoint(action, repo) {
  const processName = action === 'preview' ? 'preview' : 'live';
  return `${HLX_ADMIN_ORIGIN}/${processName}/${HLX_ORG}/${repo}/${HLX_REF}/*`;
}

/**
 * @param {PromoteJobResponse} job
 * @returns {string}
 */
function getDetailsUrl(job) {
  const self = job.links?.self;
  if (!self) {
    throw new Error('AEM admin response did not include a job status URL.');
  }
  return self.endsWith('/details') ? self : `${self}/details`;
}

/**
 * @param {string} normalizedRoot
 * @param {string} baseGeo
 * @returns {string}
 */
export function getRemotePromotePath(normalizedRoot, baseGeo) {
  return `/${getRemoteDocumentPath(normalizedRoot, baseGeo)}`;
}

/**
 * @param {string} repo
 * @param {string} remotePath
 * @param {'page' | 'live'} environment
 * @returns {string}
 */
export function getAemDocumentUrl(
  repo,
  remotePath,
  environment,
) {
  const normalizedPath = remotePath.replace(/^\/+/, '');
  return `https://main--${repo}--${HLX_ORG}.aem.${environment}/${normalizedPath}`;
}

/**
 * @param {ExtractUnit[]} units
 * @returns {Map<string, ExtractUnit[]>}
 */
export function groupUnitsByRepo(units) {
  const groups = new Map();
  for (const unit of units) {
    const existing = groups.get(unit.hostSite) || [];
    existing.push(unit);
    groups.set(unit.hostSite, existing);
  }
  return groups;
}

/**
 * @param {PromoteAction} action
 * @param {string} repo
 * @param {string[]} paths
 * @param {string} authHeader
 * @param {typeof fetch} fetchImpl
 * @returns {Promise<PromoteJobResponse>}
 */
export async function startJob(
  action,
  repo,
  paths,
  authHeader,
  fetchImpl,
) {
  const response = await fetchImpl(getEndpoint(action, repo), {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paths,
      forceUpdate: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start ${action} job for ${repo}: HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * @param {PromoteJobResponse} job
 * @param {string} authHeader
 * @param {typeof fetch} fetchImpl
 * @param {number} pollIntervalMs
 * @param {number} maxPollAttempts
 * @returns {Promise<PromoteJobStatus>}
 */
export async function pollJobStatus(
  job,
  authHeader,
  fetchImpl,
  pollIntervalMs,
  maxPollAttempts,
) {
  const detailsUrl = getDetailsUrl(job);

  for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
    const response = await fetchImpl(detailsUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to poll AEM admin job status: HTTP ${response.status}`);
    }

    const status = await response.json();
    if (status.stopTime) return status;

    if (attempt < maxPollAttempts - 1) {
      await new Promise((resolve) => {
        setTimeout(resolve, pollIntervalMs);
      });
    }
  }

  throw new Error(`Timed out waiting for AEM admin job to finish after ${maxPollAttempts} attempts.`);
}
