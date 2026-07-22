/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Bulk Publish v2 — Auto-Publish to CaaS hook
 * -------------------------------------------
 * Called by job-process.js after a Helix bulk preview/publish job stops.
 * Iterates the per-resource outcomes in the job status and invokes the
 * shared caasAutoPublish library for each successful URL.
 *
 * Best-effort and fire-and-forget by design:
 *   - The library never throws and gates itself on the site's
 *     /.milo/caas/config.json — sites that haven't opted in are no-ops.
 *   - Failures are caught and logged but never block the bulk job.
 *   - IMS token is fetched lazily, only when there is at least one
 *     successful resource on a supported topic.
 */

import { caasAutoPublish } from '../../../tools/send-to-caas/auto-publish.js';
import { getCustomConfig, getImsToken } from '../../../tools/utils/utils.js';
import { loadScript } from '../../utils/utils.js';
import { isSuccess } from './utils.js';

const CONFIG_PATH = '/.milo/caas/config.json';

const SUPPORTED_TOPICS = new Set(['preview', 'publish']);

const parseRepoOwner = (origin) => {
  try {
    const { hostname } = new URL(origin);
    const [head] = hostname.split('.');
    const parts = head.split('--');
    if (parts.length < 3) return {};
    const [, repo, owner] = parts;
    return { repo, owner };
  } catch {
    return {};
  }
};

export const collectSuccessfulPaths = (jobStatus) => {
  const resources = jobStatus?.data?.resources;
  if (!Array.isArray(resources)) return [];
  return resources
    .filter((r) => isSuccess(r?.status))
    .map((r) => r?.webPath || r?.path)
    .filter(Boolean);
};

// Lightweight pre-check: is the site opted in at all? Avoids loading the
// IMS library for sites that don't have a /.milo/caas/config.json file.
// Uses the same cached helper the shared library uses, so the network
// request happens at most once per origin per session.
const isSiteOptedIn = async (origin) => {
  try {
    const config = await getCustomConfig(`${origin}${CONFIG_PATH}`);
    return Array.isArray(config?.autoPublish?.data) && config.autoPublish.data.length > 0;
  } catch {
    return false;
  }
};

export const runAutoPublishForJob = async ({
  job,
  jobStatus,
  publish = caasAutoPublish,
  getToken = () => getImsToken(loadScript),
  optedIn = isSiteOptedIn,
}) => {
  if (!job?.origin || !jobStatus?.topic) return [];
  if (!SUPPORTED_TOPICS.has(jobStatus.topic)) return [];

  const paths = collectSuccessfulPaths(jobStatus);
  if (!paths.length) return [];

  if (!(await optedIn(job.origin))) return [];

  const accessToken = await getToken().catch(() => null);
  if (!accessToken) return [];

  const { repo, owner } = parseRepoOwner(job.origin);
  const getAuthToken = async () => accessToken;

  const tasks = paths.map((path) => publish({
    action: jobStatus.topic,
    url: `${job.origin}${path}`,
    path,
    origin: job.origin,
    getAuthToken,
    host: owner ? `${repo}.${owner}` : '',
    repo: repo || '',
  }).catch((e) => ({ skipped: false, error: e?.message || String(e), path })));

  return Promise.all(tasks);
};

export default runAutoPublishForJob;
