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
 *                 the public url, so ids survive that rollout. REQUIRED when
 *                 htmlExt<Env> splits the environments a rule can reach.
 *                 SITE-WIDE AND STICKY, unlike htmlExt: enabling it on ANY rule
 *                 enables it for EVERY rule in the file, and setting it to
 *                 `false` on one rule does NOT opt that rule out. Card identity
 *                 must not vary by path or environment, so the resolver
 *                 deliberately has no way to scope it.
 *                 This includes rules whose `enabled` column is false -- a
 *                 stale column on an archived row still opts the whole file in,
 *                 because ON is the safe direction. To turn the policy off,
 *                 remove the column from every rule (or set it to `false` on
 *                 every rule); both resolve to off.
 *                 STICKY means what it says: once a site has published under
 *                 forced-`.html` ids, turning this off re-orphans every card it
 *                 minted. There is no migration back.
 *                 Currently applies to business.adobe.com only. On another host
 *                 it is a no-op for identity, but it is NOT inert: combined
 *                 with an htmlExt<Env> split it cannot make the ids converge,
 *                 so the rule is refused outright and that path stops
 *                 publishing (see BACOM_PROD_HOST in caasIdentity.js).
 *   htmlIdentitySections
 *                 comma list of path SEGMENTS this site publishes without the
 *                 extension (e.g. `blog`), which htmlIdentity must leave
 *                 alone. Authored as bare segments: `blog`, not `/blog` or
 *                 `blog/*`. Matched anywhere in the path, so `blog` covers
 *                 `/blog/x`, `/de/blog/x` and `/products/blog/x`; it is a
 *                 segment match, so `/products/blogging-tool` is unaffected.
 *                 A page NAMED for the section matches too: `/products/blog`
 *                 is treated as extensionless.
 *                 SITE-WIDE like htmlIdentity, and UNIONED across rules: a
 *                 rule that omits the column does not re-force `.html` for its
 *                 subtree. Omit it entirely and there is no carve-out at all.
 *                 The rendering side MUST be configured to match, via the
 *                 `caas-identity-extensionless-sections` page metadata
 *                 (MWPW-213847), or the two sides hash the same page
 *                 differently and every card in the section silently stops
 *                 resolving.
 *                 Subject to the same bundle-pin gate as htmlIdentity below,
 *                 and more urgently: a poller pinned to a build that has
 *                 htmlIdentity but not this column honours the flag while
 *                 ignoring the carve-out, which orphans the section rather
 *                 than merely duplicating it. DO NOT author this column until
 *                 the pin is bumped to a build containing it.
 *
 * Two things outside this file must agree, or cards silently disappear:
 *   1. PAGE METADATA. Setting htmlIdentity here is only the publisher half.
 *      Every site that renders a business.adobe.com card BY URL -- the
 *      publishing site AND any other site featuring its cards in a collection
 *      -- must also set the `caas-identity-html` page metadata, which is what
 *      libs/blocks/caas/utils.js resolves featured-card links through. Set one
 *      without the other and the lookup misses with no error: the card just
 *      vanishes from the collection. The sidekick tool (send-to-caas.js) reads
 *      that metadata rather than these rules, so it diverges here too.
 *   2. THE POLLER'S BUNDLE. wcms/milo-caas runs caas-payload-builder.js, which
 *      it fetches against a pinned MILO_PAYLOAD_BUILDER_SHA256. Until that pin
 *      is bumped to a build containing htmlIdentity, the poller ignores this
 *      column entirely while the browser publisher honours it -- the same page
 *      gets two contentIds and two cards. DO NOT author htmlIdentity in any
 *      config.json before that bump lands -- AND do not set the
 *      `caas-identity-html` PAGE METADATA on a business.adobe.com page either.
 *      send-to-caas.js reads that metadata and feeds it straight into
 *      getCardMetadata, so on a site that is both publisher and consumer it
 *      mints forced-.html ids on its own, with no config.json change at all.
 *      Consumer-only sites -- those that merely FEATURE bacom cards -- can set
 *      the metadata at any time; it is only a fork on a publishing bacom page.
 *
 * The function NEVER throws. CaaS publishing is best-effort — the underlying
 * Helix publish must not be blocked by a CaaS failure. All outcomes return
 * a structured result for the host to surface in its UI.
 */

import {
  buildCaasXdmPayload,
  createIdentityLogger,
  getProdUrl,
  hasCardMetadata,
  hasContentTypeTag,
  isDisabledOnPage,
  postDataToCaaS,
} from './send-utils.js';
import { getCustomConfig } from '../utils/utils.js';
import {
  toIdentityUrl,
  findUnrecognizedSections,
  isFlagDisabled,
  isFlagEnabled,
  isFlagUnrecognized,
  isHtmlIdentityEnabled,
  isLegacyHtmlExtEnabled,
  normalizeSections,
} from '../../libs/utils/caasIdentity.js';

// Nothing on the identity path used to emit a single log line, so a site whose
// cards silently stopped matching had no signal to go on. The shared logger
// falls back to console because only SOME of this module's runtimes install
// window.lana: bulk-publish-v2 is a Milo block and therefore has it, while the
// standalone bulk publisher page, da-live and the poller do not -- see
// createIdentityLogger in caas-payload-core.js.
const logIdentity = createIdentityLogger('caas-auto-publish');

// Separate tag for diagnostics that are NOT about card identity, so retiring
// the `htmlIdentity` tag after the rollout cannot silence the message saying a
// site has stopped auto-publishing. (The unknown-caasEnv and htmlExt warnings
// stay on the identity tag: htmlExt feeds prodUrl, which is the hash input.)
const logAutoPublish = createIdentityLogger('caas-auto-publish', 'caas,autoPublish');

// See resolveHtmlIdentity: the site-wide-application notice is informational and
// would otherwise fire once per url in a bulk job. Keyed per declaring+matched
// rule pair, not a single flag, because one submission spans multiple origins.
const siteWideNoticesLogged = new Set();

// See resolveHtmlExt: the legacy-parser pin reports the cell at error severity,
// and that resolver runs 3-4 times per url.
const pinnedHtmlExtLogged = new Set();

// See resolveHtmlIdentitySections: the misauthored-cell warning names the
// offending entries, and that resolver runs once per url, so a single bad
// `blog/*` cell would otherwise emit one lana entry per page in a bulk job.
// Keyed on the entries themselves, so a second distinct typo still reports.
const unrecognizedSectionsLogged = new Set();

// Test-only. The set above is module-level by design (matching
// warnOnIdentityPolicyMiss in libs/blocks/caas/utils.js), which makes the
// "fires once, then suppressed" behaviour untestable from a known state: the
// first test to use a given rule shape trips it for the rest of the file.
// Without this, initialising it pre-populated would silence the diagnostic
// permanently and the whole suite would still pass.
export const resetIdentityNoticesForTesting = () => {
  siteWideNoticesLogged.clear();
  pinnedHtmlExtLogged.clear();
  unrecognizedSectionsLogged.clear();
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
// `htmlIdentity` is therefore resolved site-wide (see resolveHtmlIdentity), and
// is a no-op in any environment still serving `.html` (forceSingleHtml
// collapses `/x.html` to `/x.html`).
// Only environments this module actually targets may contribute an override
// column. An unvalidated caasEnv would interpolate straight into the lookup
// key, so a typo'd or caller-injected value would read an arbitrary rule
// property as if it were a `.html` policy.
// Derived from DEFAULT_TARGETS rather than restated, so the two cannot drift:
// adding an environment there automatically allows its override column.
const HTML_EXT_ENVS = [
  ...new Set(Object.values(DEFAULT_TARGETS).flat().map((t) => t.caasEnv)),
];

// A rule may declare its own targets, so its environments are legitimate
// override columns too even when they are not in DEFAULT_TARGETS. They come
// from the same authored config as the override itself, so this widens the
// allowlist without widening the trust domain.
const allowedHtmlExtEnvs = (rule) => {
  if (!Array.isArray(rule?.targets)) return HTML_EXT_ENVS;
  const declared = rule.targets
    .map((t) => t?.caasEnv)
    .filter((env) => typeof env === 'string' && env);
  return [...new Set([...HTML_EXT_ENVS, ...declared])];
};

export const resolveHtmlExt = (rule, caasEnv) => {
  const known = allowedHtmlExtEnvs(rule).includes(caasEnv);
  const envKey = known ? `htmlExt${caasEnv.charAt(0).toUpperCase()}${caasEnv.slice(1)}` : '';
  if (caasEnv && !known) {
    logIdentity(`unknown caasEnv '${caasEnv}', falling back to rule-wide htmlExt`, 'warning');
  }
  const override = envKey ? rule?.[envKey] : undefined;
  // Trimmed before the "unauthored" test: an author who clears a cell by typing
  // a space produces '  ', which is not '' and so would be taken as a real
  // override. It then resolves to false WITHOUT tripping isFlagUnrecognized
  // (which deliberately treats blank as "fall back to default"), silently
  // flipping that environment's public urls with no diagnostic at all.
  const trimmedOverride = typeof override === 'string' ? override.trim() : override;
  const useDefault = trimmedOverride === undefined || trimmedOverride === null || trimmedOverride === '';
  const value = useDefault ? rule?.htmlExt : override;
  // Compatibility guard on the PRE-EXISTING htmlExt column. Before this change
  // the parser was `htmlExt === true || htmlExt === 'true'`, so 'TRUE', 'On' or
  // ' true ' resolved to FALSE in live configs. Routing it through the
  // canonical isFlagEnabled widens that set, which would silently flip those
  // sites' public urls -- and because prodUrl is the uuid v5 hash input,
  // silently rehash every card they publish, with no error and no rollback, at
  // merge rather than on an authoring action.
  //
  // Applied UNIFORMLY: to the rule-wide column, to the per-environment override
  // columns, and (via the same shared parser) to getProdUrl in the poller
  // bundle. Two different asymmetries were tried first and both manufactured
  // the exact fork this change exists to prevent:
  //   - pinning the browser but not getProdUrl made the two PUBLISHERS read one
  //     cell differently, minting two contentIds for one page across runtimes,
  //     where the env-split guard below cannot see it;
  //   - pinning the rule-wide column but not its per-env siblings made
  //     `{ htmlExt: 'on', htmlExtStage: 'on' }` resolve prod=false/stage=true,
  //     so a config the author believes is uniform splits, trips that guard and
  //     stops the path publishing -- with a remedy message pointing at
  //     htmlIdentity, a cell that is not the cause.
  // The "new columns cannot exist in live data" argument justifies not NEEDING
  // the pin on them; it does not justify one column meaning two things.
  //
  // Normalize the cell to lowercase 'true' to opt in -- deliberately an
  // explicit authoring action, so the rehash happens when someone chooses it
  // rather than when this merges.
  if (typeof value === 'string' && !isLegacyHtmlExtEnabled(value) && isFlagEnabled(value)) {
    // Deduped per rule+value: resolveHtmlExt runs once per target AND again per
    // ruleEnvs entry (3 calls on publish, 4 on preview), so one pinned cell
    // would otherwise emit 3-4 identical error-severity lana messages per url
    // -- 20,000 on a 5,000-url job, in the one runtime where lana is loaded.
    const pinKey = `${rule?.url}|${value}`;
    if (!pinnedHtmlExtLogged.has(pinKey)) {
      pinnedHtmlExtLogged.add(pinKey);
      logIdentity(
        `htmlExt '${value}' on rule '${rule?.url}' was read as false before the parser was widened; `
        + 'keeping it false to avoid rehashing live cards. Author it as lowercase \'true\' to enable.',
        'error',
      );
    }
    return false;
  }
  // An authored value that is neither true nor false (e.g. 'yes', '1') would
  // otherwise resolve silently to false and flip every public url on the rule.
  if (isFlagUnrecognized(value)) {
    logIdentity(`unrecognized htmlExt value '${value}' on rule '${rule?.url}', treating as false`, 'warning');
  }
  return isLegacyHtmlExtEnabled(value);
};

// Card identity is a SITE-level scheme on the publish path, not a per-path
// one: a single site must hash every card it publishes the same way or its
// collections fracture. resolveRule returns only the single most-specific
// match, so reading htmlIdentity off that rule alone means a narrow rule that
// merely omits the column silently reverts the policy for its whole subtree --
// exactly the "section-wide orphaning with no error raised anywhere" that
// caasIdentity.js exists to prevent.
//
// So resolve it across the whole config: if ANY rule enables it, the site has
// opted in. Disagreement is an authoring error, and the safe direction is ON --
// a card that keeps its established `.html` id stays findable, whereas one that
// loses it is orphaned with no way back.
export const resolveHtmlIdentity = (rules, rule, origin = '') => {
  const list = Array.isArray(rules) ? rules : [];
  // Deliberately NOT filtered on `enabled`: a disabled row still declares the
  // site's identity scheme, and ON is the safe direction (a card that keeps its
  // established `.html` id stays findable; one that loses it is orphaned with no
  // way back). So a stale htmlIdentity column on an archived row opts the whole
  // file in -- documented in the header table, because archived rows are exactly
  // where stale columns survive.
  const declaring = list.filter((r) => isHtmlIdentityEnabled(r?.htmlIdentity));
  if (!declaring.length) return isHtmlIdentityEnabled(rule?.htmlIdentity);
  const dissenting = list.filter((r) => isFlagDisabled(r?.htmlIdentity));
  if (dissenting.length) {
    logIdentity(
      `htmlIdentity disagrees across rules (enabled on '${declaring[0]?.url}', `
      + `disabled on '${dissenting[0]?.url}'); card identity is site-wide, so `
      + 'treating it as ENABLED. Set the column consistently on every rule.',
      'warning',
    );
  } else if (!isHtmlIdentityEnabled(rule?.htmlIdentity)
    && !siteWideNoticesLogged.has(`${origin}|${declaring[0]?.url}|${rule?.url}`)) {
    // Deduped per origin + declaring/matched rule PAIR rather than once per
    // module lifetime. A single bulk submission spans one job per origin
    // (bulk-publish-v2/services.js sets origin per pasted url) and this module
    // fetches a different `${origin}/.milo/caas/config.json` per call, so a
    // global flag let the first site's notice through and silenced every other
    // site's -- including the stale-archived-row opt-in the header table calls
    // out as the footgun. The origin is part of the key because rule `url`s are
    // PATHS, not origins: the live main-- and stage-- da-bacom configs carry
    // byte-identical patterns, so keying on patterns alone still collided for
    // exactly the cross-site case this fix is for. The set is bounded by
    // origins x rule pairs -- single digits per site -- not by the thousands of
    // urls in the job.
    //
    // This branch is INFORMATIONAL, not a misconfiguration: a broad opt-in rule
    // plus narrower rules that omit the column is the shape the header table
    // documents as correct. Per page it fired once for every url in a bulk job
    // -- thousands of lana warnings at sampleRate 100 from bulk-publish-v2,
    // where lana IS loaded -- burying the two messages that are genuinely
    // actionable (the disagreement warning above and the env-split refusal
    // below).
    siteWideNoticesLogged.add(`${origin}|${declaring[0]?.url}|${rule?.url}`);
    logIdentity(
      `htmlIdentity is enabled on rule '${declaring[0]?.url}' but not on the `
      + `matched rule '${rule?.url}'; applying it site-wide so this path does `
      + 'not mint a second set of card ids. (Further occurrences suppressed.)',
      'warning',
    );
  }
  return true;
};

// The SECTION list that qualifies the policy, resolved the same way and for
// the same reason: a narrow rule that merely omits the column must not
// silently re-force `.html` onto a section's ids for its subtree. So the list
// is UNIONED across every rule. Union is also the safe direction -- an exempt
// section keeps the bare id its cards already hold, while losing the exemption
// orphans them with no way back.
//
// The rendering side must be configured to match, via the
// `caas-identity-extensionless-sections` page metadata (MWPW-213847).
export const resolveHtmlIdentitySections = (rules, rule) => {
  const list = Array.isArray(rules) ? rules : [];
  const declared = [...list, rule].flatMap((r) => normalizeSections(r?.htmlIdentitySections));
  const unrecognized = findUnrecognizedSections(declared);
  const noticeKey = unrecognized.join(',');
  if (unrecognized.length && !unrecognizedSectionsLogged.has(noticeKey)) {
    unrecognizedSectionsLogged.add(noticeKey);
    logIdentity(
      `unrecognized htmlIdentitySections entries '${unrecognized.join(', ')}': these name `
      + 'a path, host or glob rather than a bare path segment, so they match nothing and '
      + 'the section keeps forced-`.html` ids. Author bare segments, e.g. `blog`.',
      'warning',
    );
  }
  return normalizeSections(declared).join(',');
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
    // The kill switch is the highest-stakes column in the file, so an authored
    // value that means neither true nor false ('no', '0', 'disabled') must not
    // resolve silently to "keep publishing".
    if (isFlagUnrecognized(rule.enabled)) {
      logAutoPublish(
        `unrecognized enabled value '${rule.enabled}' on rule '${rule.url}', treating as ENABLED`,
        'warning',
      );
    }
    if (isFlagDisabled(rule.enabled)) {
      // Logged because this is the one condition whose meaning changed: a
      // spreadsheet can only author the STRING 'false', which the old strict
      // `=== false` check missed, so sites that had asked for auto-publish to be
      // off were still publishing. Those sites stop here, and an undifferentiated
      // skip count would not explain why.
      logAutoPublish(
        `rule '${rule.url}' is disabled by its enabled column ('${rule.enabled}'), `
        + `not publishing '${path}'`,
        'warning',
      );
      return { skipped: true, reason: 'rule-disabled' };
    }

    // Card identity is the PRODUCTION url, not the aem.page/aem.live url the job
    // fires from. The site declares its prod host and .html rule in config, so
    // this path produces the same contentId/entityId as the milo-caas poller.
    //
    // That equivalence holds only while the committed caas-payload-builder.js
    // bundle the poller runs is built from this source. It is rebuilt in this
    // change, so publish AND removal (getCaasIds) now agree across the two
    // runtimes. `npm run build:caas-payload-builder` is a manual script, but
    // caas-payload-builder.bundle.test.js now fails when the artifact and the
    // source disagree, so a stale bundle is caught in CI rather than shipping
    // silently. That guard compares behaviour, not bytes (the minifier mangles
    // names non-deterministically), so any later change to caas-payload-core.js
    // must still be rebuilt in the same PR.
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
    // public urls go extensionless. Declared per rule alongside htmlExt, but
    // resolved site-wide -- so this warns only that THIS cell was unreadable,
    // without asserting the outcome: another rule may still enable the policy.
    if (isFlagUnrecognized(rule.htmlIdentity)) {
      logIdentity(
        `unrecognized htmlIdentity value '${rule.htmlIdentity}' on rule '${rule.url}', `
        + 'ignored -- the effective value is resolved across all rules',
        'warning',
      );
    }
    const htmlIdentity = resolveHtmlIdentity(rules, rule, origin);
    const htmlIdentitySections = resolveHtmlIdentitySections(rules, rule);

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
    // the forced-.html normalization is a no-op and the ids fork regardless.
    //
    // Evaluated over every environment the RULE can reach, not just the ones
    // this action happens to target. The invariant ("one page, one id") is a
    // property of the rule, and the two actions target different env sets --
    // publish hits prod alone while preview hits prod and stage. Scoped to the
    // action, the identical misconfiguration was refused on every preview and
    // waved through on every publish, so prod cards got minted and stage got
    // none, with no rule-level signal that anything was wrong.
    //
    // Derived from the rule's own declared targets, NOT from
    // allowedHtmlExtEnvs: that is an allowlist for override COLUMN NAMES and is
    // always a superset of {prod, stage} by construction. Reusing it here
    // refused a rule that declares `targets: [{caasEnv:'prod'}]` and still
    // carries a leftover `htmlExtStage` cell -- a shape this very rollout
    // invites -- over a fork that rule can never reach. resolveTargets returns
    // rule.targets verbatim, so a narrowed rule genuinely cannot reach the
    // environments it omits; HTML_EXT_ENVS stays the fallback when it narrows
    // nothing.
    const declaredEnvs = Array.isArray(rule?.targets) && rule.targets.length
      ? [...new Set(rule.targets.map((t) => t?.caasEnv).filter((env) => typeof env === 'string' && env))]
      : HTML_EXT_ENVS;
    const ruleEnvs = declaredEnvs.length ? declaredEnvs : HTML_EXT_ENVS;
    // Unioned with the htmlExt values the build ACTUALLY grouped by. A target
    // whose caasEnv is absent or non-string is filtered out of declaredEnvs
    // above, but the build path above does no such filtering -- resolveHtmlExt
    // falls back to the rule-wide htmlExt for it, so it still contributes a
    // variant. Asserting on the rule's declared envs alone therefore traded the
    // old false refusal for a false ACCEPTANCE: two contentIds posted for one
    // page, with no error. Guard on what is about to be written, not only on
    // what the config says should be reachable.
    const reachableHtmlExts = new Set([
      ...byHtmlExt.keys(),
      ...ruleEnvs.map((env) => resolveHtmlExt(rule, env)),
    ]);
    const identityUrls = new Set([...reachableHtmlExts].map((htmlExt) => (
      toIdentityUrl(variantProdUrl(htmlExt), htmlIdentity, htmlIdentitySections)
    )));
    if (identityUrls.size > 1) {
      // Deliberately NOT the `skipped: true` shape. Five routine conditions
      // already return that (no rule, no card metadata, no content-type tag,
      // ...), so an operator watching skip counts cannot tell a page that was
      // never eligible from a misconfiguration that has stopped an entire site
      // from publishing. This is a refusal that needs a human, so it surfaces
      // as an error and logs.
      //
      // Two different causes reach here and they need different fixes, so the
      // message names the real one. Telling an operator who already set
      // htmlIdentity to "set htmlIdentity" sends them to re-check a cell that
      // is correct, with nothing pointing at the hardcoded host scope.
      const remedy = htmlIdentity
        ? `htmlIdentity is set, but host '${effHost}' is not covered by the identity policy `
          + '(it currently applies to business.adobe.com only), so the ids fork anyway. '
          + 'Roll the environments to the same htmlExt instead of splitting them.'
        : 'Set htmlIdentity on the rule.';
      logIdentity(
        `refusing to publish '${path}': htmlExt differs per environment but identity does not `
        + `converge, which would mint two contentIds for one page. ${remedy}`,
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
        htmlIdentitySections,
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
