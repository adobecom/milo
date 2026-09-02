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
  buildCaasXdmPayload,
  getProdUrl,
  hasCardMetadata,
  hasContentTypeTag,
  isDisabledOnPage,
  postDataToCaaS,
} from './send-utils.js';
import { getCustomConfig } from '../utils/utils.js';

// Re-exported from send-utils so the per-page opt-out check stays importable
// from this module (used by tests and any host that already depends on it).
export { isDisabledOnPage };

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
// matches any path under /foo/, including /foo itself; otherwise an exact
// match is required.
export const matchesUrl = (pattern, path) => {
  if (typeof pattern !== 'string' || typeof path !== 'string') return false;
  if (pattern.endsWith('**')) {
    const dir = pattern.slice(0, -2); // e.g. '/foo/'
    return path === dir.slice(0, -1) || path.startsWith(dir);
  }
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
  autoDetectLingo,
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

    // Card identity is the PRODUCTION url, not the aem.page/aem.live url the job
    // fires from. The site declares its prod host and .html rule in config, so
    // this path produces the same contentId/entityId as the milo-caas poller.
    // `repo` (the CaaS source) likewise comes from config when set — e.g. the
    // bacom blog files under `bacom`, which the aem hostname can't tell us.
    // Falls back to the caller-supplied url/host/repo when config omits them.
    const effHost = rule.host || host;
    const effRepo = rule.repo || repo;
    const prodUrl = effHost
      ? getProdUrl({ host: effHost, path, htmlExt: rule.htmlExt })
      : url;

    const { dom, error: fetchErr, lastModified } = await fetchPageDom(url);
    if (fetchErr) return { skipped: false, error: `fetch-failed: ${fetchErr}` };

    if (!hasCardMetadata(dom)) return { skipped: true, reason: 'no-card-metadata' };
    if (isDisabledOnPage(dom)) return { skipped: true, reason: 'page-override-disabled' };

    const { caasProps, errors, tags } = await buildCaasXdmPayload({
      dom,
      pageUrl: prodUrl,
      lastModified,
      host: effHost,
      repo: effRepo,
      floodgatecolor,
      // A rule opts a language-first (Lingo) site into per-page locale resolution;
      // an explicit caller-supplied languageFirst (used by the legacy bulk tool) wins.
      languageFirst: languageFirst ?? rule.languageFirst,
      // A fully Lingo-enabled site (e.g. bacom) sets rule.autoDetectLingo: true so
      // every page's LFL-ness is resolved per-URL from lingo-site-mapping.json —
      // the same behavior as checking "Auto-detect Lingo" in the bulk publisher —
      // instead of relying on a single site-wide manual languageFirst flag.
      autoDetectLingo: autoDetectLingo ?? rule.autoDetectLingo,
    });
    if (errors?.length) return { skipped: false, error: 'metadata-errors', errors };
    // Only pages with a caas:content-type tag participate. Pages without one
    // (product/solution/index/etc.) are a normal skip, not an error.
    if (!hasContentTypeTag(tags)) return { skipped: true, reason: 'no-content-type-tag' };

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
