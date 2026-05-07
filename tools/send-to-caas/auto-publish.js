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
 * Auto Publish to CaaS
 * --------------------
 * After a successful Helix preview/publish, hosts (da-live editor,
 * milo bulk-publish-v2) call `caasAutoPublish` to push the page into CaaS.
 *
 * Routing is data-driven. Each customer site opts in by adding a
 * /.milo/caas/config.json file describing which paths participate, with
 * the same URL-pattern shape used by /.milo/publish-permissions-config.json.
 *
 * The function NEVER throws. CaaS publishing is best-effort — the underlying
 * Helix publish must not be blocked by a CaaS failure. All outcomes return
 * a structured result for the host to surface in its UI.
 */

import {
  getCardMetadata,
  getCaasProps,
  loadCaasTags,
  postDataToCaaS,
  setConfig,
} from './send-utils.js';
import { getCustomConfig } from '../utils/utils.js';

const CONFIG_PATH = '/.milo/caas/config.json';

const DEFAULT_TARGETS = {
  preview: [
    { caasEnv: 'prod', draftOnly: true },
    { caasEnv: 'stage', draftOnly: false },
  ],
  publish: [
    { caasEnv: 'prod', draftOnly: false },
  ],
};

// URL-pattern matching mirrors libs/tools/utils/publish.js: pattern '/foo/**'
// matches any path under /foo/; otherwise an exact match is required.
export const matchesUrl = (pattern, path) => {
  if (typeof pattern !== 'string' || typeof path !== 'string') return false;
  if (pattern.endsWith('**')) return path.startsWith(pattern.slice(0, -2));
  return pattern === path;
};

// Most-specific (longest pattern) wins so per-directory rules can override
// per-site rules without an explicit precedence flag.
export const resolveRule = (rules, path) => {
  if (!Array.isArray(rules) || !path) return null;
  const sorted = [...rules].sort(
    (a, b) => (b?.url?.length || 0) - (a?.url?.length || 0),
  );
  return sorted.find((rule) => rule?.url && matchesUrl(rule.url, path)) || null;
};

export const resolveTargets = (rule, action) => {
  if (Array.isArray(rule?.targets) && rule.targets.length) return rule.targets;
  return DEFAULT_TARGETS[action];
};

// Per-page explicit override: a row inside .card-metadata of the form
// "auto-publish | false" lets an author opt a single page out without
// touching the site config.
export const isDisabledOnPage = (dom) => {
  if (!dom?.querySelector) return false;
  const md = dom.querySelector('.card-metadata');
  if (!md) return false;
  const rows = [...md.querySelectorAll(':scope > div')];
  return rows.some((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length < 2) return false;
    const key = cells[0].textContent.trim().toLowerCase();
    const val = cells[1].textContent.trim().toLowerCase();
    return key === 'auto-publish' && val === 'false';
  });
};

const hasCardMetadata = (dom) => !!dom?.querySelector?.('.card-metadata');

const fetchPageDom = async (url) => {
  try {
    const resp = await fetch(`${url}?timestamp=${Date.now()}`);
    if (!resp.ok) return { error: `${resp.status}: ${resp.statusText}` };
    const html = await resp.text();
    const dom = new DOMParser().parseFromString(html, 'text/html');
    return { dom, lastModified: resp.headers.get('last-modified') };
  } catch (e) {
    return { error: e?.message || String(e) };
  }
};

export const caasAutoPublish = async ({
  action,
  url,
  path,
  origin,
  getAuthToken,
  host,
  repo,
  floodgatecolor = 'default',
  languageFirst,
} = {}) => {
  try {
    if (!action || !DEFAULT_TARGETS[action]) {
      return { skipped: true, reason: 'unsupported-action' };
    }
    if (!url || !path || !origin || typeof getAuthToken !== 'function') {
      return { skipped: true, reason: 'missing-required-args' };
    }

    const config = await getCustomConfig(`${origin}${CONFIG_PATH}`);
    const rules = config?.autoPublish?.data;
    if (!Array.isArray(rules) || !rules.length) {
      return { skipped: true, reason: 'no-config' };
    }

    const rule = resolveRule(rules, path);
    if (!rule) return { skipped: true, reason: 'no-matching-rule' };
    if (rule.enabled === false) return { skipped: true, reason: 'rule-disabled' };

    const { dom, error: fetchErr, lastModified } = await fetchPageDom(url);
    if (fetchErr) return { skipped: false, error: `fetch-failed: ${fetchErr}` };

    if (!hasCardMetadata(dom)) return { skipped: true, reason: 'no-card-metadata' };
    if (isDisabledOnPage(dom)) return { skipped: true, reason: 'page-override-disabled' };

    setConfig({
      bulkPublish: true,
      doc: dom,
      pageUrl: url,
      lastModified,
      host,
      repo,
    });
    await loadCaasTags();
    const { caasMetadata, errors } = await getCardMetadata({
      prodUrl: url,
      host,
      repo,
      floodgatecolor,
      languageFirst,
    });
    if (errors?.length) return { skipped: false, error: 'metadata-errors', errors };
    if (!caasMetadata?.tags?.length) return { skipped: false, error: 'no-tags' };
    const caasProps = getCaasProps(caasMetadata, url);

    const targets = resolveTargets(rule, action);
    const accessToken = await getAuthToken();
    if (!accessToken) return { skipped: false, error: 'no-auth-token' };

    const postOne = async ({ caasEnv, draftOnly }) => {
      try {
        const response = await postDataToCaaS({ accessToken, caasEnv, caasProps, draftOnly });
        return { caasEnv, draftOnly, ok: !!response?.success, response };
      } catch (e) {
        return { caasEnv, draftOnly, ok: false, error: e?.message || String(e) };
      }
    };

    const results = await Promise.all(targets.map(postOne));
    return { skipped: false, results };
  } catch (e) {
    return { skipped: false, error: e?.message || String(e) };
  }
};

export default caasAutoPublish;
