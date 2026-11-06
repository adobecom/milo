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
 * Columns that shape a card's url and identity:
 *   htmlExt       rule-wide `.html` policy for the public url
 *   htmlExt<Env>  per-target override, e.g. htmlExtStage / htmlExtProd, for a
 *                 site rolling extensionless urls out one environment at a time
 *   htmlIdentity  hash contentId/entityId from the `.html` form regardless of
 *                 the public url, so ids survive that rollout. Rule-wide, and
 *                 REQUIRED when htmlExt<Env> splits the targets.
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
import {
  getCaasIdentityUrl,
  isFlagDisabled,
  isFlagEnabled,
  isFlagUnrecognized,
  isHtmlIdentityEnabled,
} from '../../libs/utils/caasIdentity.js';

// Nothing on the identity path used to emit a single log line, so a site whose
// cards silently stopped matching had no signal to go on. `window` is guarded
// because this module is also loaded outside a browser (tests, and any host
// that imports it directly).
const logIdentity = (message, severity = 'error') => {
  if (typeof window === 'undefined') return;
  window.lana?.log(`caas-auto-publish: ${message}`, { tags: 'caas', severity });
};

// Re-exported from send-utils so the per-page opt-out check stays importable
// from this module (used by tests and any host that already depends on it).
export { isDisabledOnPage };

export const CONFIG_PATH = '/.milo/caas/config.json';

const DEFAULT_TARGETS = {
  preview: [
    { caasEnv: 'prod', draftOnly: true },
    { caasEnv: 'stage', draftOnly: false },
  ],
  publish: [
    { caasEnv: 'prod', draftOnly: false },
  ],
};

// Pattern '/foo/**' matches '/foo' itself and any path under '/foo/'; otherwise
// an exact match is required. Deliberately stricter than libs/tools/utils/publish.js's
// '**' matcher, which does an unanchored substring check (`webPath.includes(...)`)
// and would also match e.g. '/other/foo-launch' against '/foo/**' — too loose for
// auto-publish routing rules, so this does not mirror that matcher.
export const matchesUrl = (pattern, path) => {
  if (typeof pattern !== 'string' || typeof path !== 'string') return false;
  if (pattern.endsWith('**')) {
    const dir = pattern.slice(0, -2); // e.g. '/foo/'
    return path === dir.slice(0, -1) || path.startsWith(dir);
  }
  return pattern === path;
};

// Effective specificity of a rule's pattern: the '**' suffix is match syntax,
// not literal path characters, so it must not count toward length — otherwise
// a wildcard rule can tie (or even beat) an exact-match rule of the same raw
// string length despite covering a shorter, less specific prefix.
const ruleSpecificity = (url) => {
  if (typeof url !== 'string') return -1;
  return url.endsWith('**') ? url.length - 2 : url.length;
};

// Most-specific (longest effective pattern) wins so per-directory rules can
// override per-site rules without an explicit precedence flag. Ties (e.g. an
// exact match and a wildcard of equal effective specificity) favor the exact
// match, since it unambiguously identifies a single path rather than a family
// of paths.
export const resolveRule = (rules, path) => {
  if (!Array.isArray(rules) || !path) return null;
  const sorted = [...rules].sort((a, b) => {
    const diff = ruleSpecificity(b?.url) - ruleSpecificity(a?.url);
    if (diff !== 0) return diff;
    return (a?.url?.endsWith('**') ? 1 : 0) - (b?.url?.endsWith('**') ? 1 : 0);
  });
  return sorted.find((rule) => rule?.url && matchesUrl(rule.url, path)) || null;
};

// A site mid-migration can serve extensionless urls in one CaaS environment
// while another still serves `.html` -- bacom is rolling extensionless out to
// stage before prod. `htmlExt` stays the rule-wide default; an `htmlExt<Env>`
// column overrides it for one target (htmlExtStage, htmlExtProd).
//
// Per-env columns rather than a nested value because this config is a
// spreadsheet: every cell is a string, so `{"stage":false}` cannot be authored.
// An absent or empty override falls back to the rule-wide value, so existing
// configs -- which have no override columns -- behave exactly as before.
//
// Note this scopes the PUBLIC url only. Card identity must NOT vary by
// environment: a collection authored in DA holds one contentId and is promoted
// unchanged, so an id that differed per environment would resolve in only one.
// `htmlIdentity` is therefore rule-wide, and is a no-op in any environment
// still serving `.html` (forceSingleHtml collapses `/x.html` to `/x.html`).
// Only environments this module actually targets may contribute an override
// column. An unvalidated caasEnv would interpolate straight into the lookup
// key, so a typo'd or caller-injected value would read an arbitrary rule
// property as if it were a `.html` policy.
export const HTML_EXT_ENVS = ['prod', 'stage'];

export const resolveHtmlExt = (rule, caasEnv) => {
  const known = HTML_EXT_ENVS.includes(caasEnv);
  const envKey = known ? `htmlExt${caasEnv.charAt(0).toUpperCase()}${caasEnv.slice(1)}` : '';
  if (caasEnv && !known) {
    logIdentity(`unknown caasEnv '${caasEnv}', falling back to rule-wide htmlExt`, 'warn');
  }
  const override = envKey ? rule?.[envKey] : undefined;
  const useDefault = override === undefined || override === null || override === '';
  const value = useDefault ? rule?.htmlExt : override;
  // An authored value that is neither true nor false (e.g. 'yes', '1') would
  // otherwise resolve silently to false and flip every public url on the rule.
  if (isFlagUnrecognized(value)) {
    logIdentity(`unrecognized htmlExt value '${value}' on rule '${rule?.url}', treating as false`);
  }
  return isFlagEnabled(value);
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
    // `enabled` arrives from a spreadsheet, which can only ever produce the
    // STRING 'false'. The previous strict `=== false` check therefore ignored
    // it, and a site that had explicitly turned autopublish off kept publishing.
    if (isFlagDisabled(rule.enabled)) return { skipped: true, reason: 'rule-disabled' };

    // Card identity is the PRODUCTION url, not the aem.page/aem.live url the job
    // fires from. The site declares its prod host and .html rule in config, so
    // this path produces the same contentId/entityId as the milo-caas poller --
    // except for `htmlIdentity`, which the poller ignores until the committed
    // caas-payload-builder.js bundle it runs is rebuilt. Do not enable the flag
    // for a site before that lands, or the two publishers will disagree.
    // `repo` (the CaaS source) likewise comes from config when set — e.g. the
    // bacom blog files under `bacom`, which the aem hostname can't tell us.
    // Falls back to the caller-supplied url/host/repo when config omits them.
    const effHost = rule.host || host;
    const effRepo = rule.repo || repo;

    const { dom, error: fetchErr, lastModified } = await fetchPageDom(url);
    if (fetchErr) return { skipped: false, error: `fetch-failed: ${fetchErr}` };

    if (!hasCardMetadata(dom)) return { skipped: true, reason: 'no-card-metadata' };
    if (isDisabledOnPage(dom)) return { skipped: true, reason: 'page-override-disabled' };

    // Keeps a site's existing `.html`-derived card identities stable while its
    // public urls go extensionless. Declared per rule alongside htmlExt.
    const htmlIdentity = isHtmlIdentityEnabled(rule.htmlIdentity);

    const targets = resolveTargets(rule, action);

    // Group targets by the `.html` policy they resolve to and build one payload
    // per distinct policy. Targets that agree -- every site not mid-migration --
    // collapse to a single build, exactly as before.
    const byHtmlExt = new Map();
    targets.forEach((target) => {
      const htmlExt = resolveHtmlExt(rule, target.caasEnv);
      if (!byHtmlExt.has(htmlExt)) byHtmlExt.set(htmlExt, []);
      byHtmlExt.get(htmlExt).push(target);
    });

    const variantProdUrl = (htmlExt) => (
      effHost ? getProdUrl({ host: effHost, path, htmlExt }) : url
    );

    // Divergent public urls are the point; divergent IDENTITY never is. The
    // same page would land in two environments under two contentIds, and a
    // promoted DA collection -- which holds one uuid literal -- would resolve
    // in only one of them. Splitting a card's identity is not something a later
    // republish can clean up, so refuse rather than write it.
    //
    // Asserted on the real hash inputs rather than on the htmlIdentity flag:
    // the policy only normalizes in-scope urls (the bacom prod host), so the
    // flag being on does NOT prove the ids converge. On any other host
    // getCaasIdentityUrl is a no-op and the ids fork regardless.
    const identityUrls = new Set([...byHtmlExt.keys()].map((htmlExt) => (
      getCaasIdentityUrl(variantProdUrl(htmlExt).replace(/^https?:\/\//, ''), htmlIdentity)
    )));
    if (identityUrls.size > 1) {
      // Deliberately NOT the `skipped: true` shape. Five routine conditions
      // already return that (no rule, no card metadata, no content-type tag,
      // ...), so an operator watching skip counts cannot tell a page that was
      // never eligible from a misconfiguration that has stopped an entire site
      // from publishing. This is a refusal that needs a human, so it surfaces
      // as an error and logs.
      logIdentity(
        `refusing to publish '${path}': htmlExt differs per environment but identity does not `
        + 'converge, which would mint two contentIds for one page. Set htmlIdentity on the rule.',
      );
      return { skipped: false, error: 'env-split-requires-html-identity' };
    }

    const buildVariant = async ([htmlExt, variantTargets]) => {
      const prodUrl = variantProdUrl(htmlExt);
      const { caasProps, errors, tags } = await buildCaasXdmPayload({
        dom,
        pageUrl: prodUrl,
        lastModified,
        host: effHost,
        repo: effRepo,
        floodgatecolor,
        htmlIdentity,
        // A rule opts a language-first (Lingo) site into per-page locale resolution;
        // an explicit caller-supplied languageFirst (used by the legacy bulk tool) wins.
        languageFirst: languageFirst ?? rule.languageFirst,
        // A fully Lingo-enabled site (e.g. bacom) sets rule.autoDetectLingo: true so
        // every page's LFL-ness is resolved per-URL from lingo-site-mapping.json —
        // the same behavior as checking "Auto-detect Lingo" in the bulk publisher —
        // instead of relying on a single site-wide manual languageFirst flag.
        autoDetectLingo: autoDetectLingo ?? rule.autoDetectLingo,
      });
      return { htmlExt, caasProps, errors, tags, targets: variantTargets };
    };

    // Built one at a time, NOT with Promise.all. buildCaasXdmPayload writes to
    // a module-global config (setConfig) and then awaits, so two in-flight
    // calls interleave and the second one's pageUrl overwrites the first's
    // before it has finished reading it. Nothing else in the repo called it
    // concurrently, so this code introduced that hazard; serializing keeps the
    // fix local instead of reworking the shared config for a <=2 item loop.
    const variants = [];
    for (const entry of [...byHtmlExt.entries()]) {
      variants.push(await buildVariant(entry));
    }

    const failed = variants.find((variant) => variant.errors?.length);
    if (failed) return { skipped: false, error: 'metadata-errors', errors: failed.errors };
    // Only pages with a caas:content-type tag participate. Pages without one
    // (product/solution/index/etc.) are a normal skip, not an error. Tags come
    // from the dom, so every variant agrees -- checking one is enough.
    if (!hasContentTypeTag(variants[0]?.tags)) {
      return { skipped: true, reason: 'no-content-type-tag' };
    }

    const accessToken = await getAuthToken();
    if (!accessToken) return { skipped: false, error: 'no-auth-token' };

    const postOne = async (caasProps, htmlExt, { caasEnv, draftOnly }) => {
      try {
        const response = await postDataToCaaS({ accessToken, caasEnv, caasProps, draftOnly });
        return { caasEnv, draftOnly, htmlExt, ok: !!response?.success, response };
      } catch (e) {
        return { caasEnv, draftOnly, htmlExt, ok: false, error: e?.message || String(e) };
      }
    };

    const results = (await Promise.all(variants.map(
      (variant) => Promise.all(variant.targets.map(
        (target) => postOne(variant.caasProps, variant.htmlExt, target),
      )),
    ))).flat();

    // Echoed so a caller can tell after the fact which policy produced a card.
    // `htmlIdentity` alone reports intent, not effect: the policy is host-gated,
    // so the flag can be on while the ids were never normalized. The identity
    // url is the actual hash input, which is what an operator comparing a live
    // card against a republish needs.
    const [identityUrl] = [...identityUrls];
    return { skipped: false, htmlIdentity, identityUrl, results };
  } catch (e) {
    return { skipped: false, error: e?.message || String(e) };
  }
};

export default caasAutoPublish;
