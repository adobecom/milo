import process from 'node:process';
import type { ExtractUnit } from '../config/scope.ts';
import { getRemoteDocumentPath } from './paths.ts';

const HLX_ADMIN_ORIGIN = 'https://admin.hlx.page';
const HLX_ORG = 'adobecom';
const HLX_REF = 'main';

export type PromoteAction = 'preview' | 'publish';

export type PromoteJobResponse = {
  links?: {
    self?: string;
  };
};

export type PromoteJobStatus = {
  stopTime?: string;
  progress?: {
    failed?: number;
  };
  data?: {
    resources?: Array<{
      status?: number;
      path?: string;
    }>;
  };
};

export function getSiteEnvKey(owner: string, repo: string, prefix = ''): string {
  return `${prefix || ''}${owner}_${repo}`.replaceAll('-', '_').toUpperCase();
}

export function getRepoToken(site: string): string {
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

function getEndpoint(action: PromoteAction, repo: string): string {
  const processName = action === 'preview' ? 'preview' : 'live';
  return `${HLX_ADMIN_ORIGIN}/${processName}/${HLX_ORG}/${repo}/${HLX_REF}/*`;
}

function getDetailsUrl(job: PromoteJobResponse): string {
  const self = job.links?.self;
  if (!self) {
    throw new Error('AEM admin response did not include a job status URL.');
  }
  return self.endsWith('/details') ? self : `${self}/details`;
}

export function getRemotePromotePath(normalizedRoot: string, baseGeo: string): string {
  return `/${getRemoteDocumentPath(normalizedRoot, baseGeo)}`;
}

export function getAemDocumentUrl(
  repo: string,
  remotePath: string,
  environment: 'page' | 'live',
): string {
  const normalizedPath = remotePath.replace(/^\/+/, '');
  return `https://main--${repo}--${HLX_ORG}.aem.${environment}/${normalizedPath}`;
}

export function groupUnitsByRepo(units: ExtractUnit[]): Map<string, ExtractUnit[]> {
  const groups = new Map<string, ExtractUnit[]>();
  for (const unit of units) {
    const existing = groups.get(unit.hostSite) || [];
    existing.push(unit);
    groups.set(unit.hostSite, existing);
  }
  return groups;
}

export async function startJob(
  action: PromoteAction,
  repo: string,
  paths: string[],
  authHeader: string,
  fetchImpl: typeof fetch,
): Promise<PromoteJobResponse> {
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

  return response.json() as Promise<PromoteJobResponse>;
}

export async function pollJobStatus(
  job: PromoteJobResponse,
  authHeader: string,
  fetchImpl: typeof fetch,
  pollIntervalMs: number,
  maxPollAttempts: number,
): Promise<PromoteJobStatus> {
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

    const status = await response.json() as PromoteJobStatus;
    if (status.stopTime) return status;

    if (attempt < maxPollAttempts - 1) {
      await new Promise((resolve) => {
        setTimeout(resolve, pollIntervalMs);
      });
    }
  }

  throw new Error(`Timed out waiting for AEM admin job to finish after ${maxPollAttempts} attempts.`);
}
