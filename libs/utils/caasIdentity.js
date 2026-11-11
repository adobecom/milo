// CaaS card identity normalization.
//
// This is a LEAF module: pure string logic with no imports, so it is safe to
// import from tools/send-to-caas/caas-payload-core.js (which must stay
// bundle-able) as well as from libs/blocks/caas/utils.js. Keep it dependency
// free.
//
// That constraint is also why the generic flag parsers (isFlagEnabled and
// friends) live here rather than in a shared libs/utils/flags.js. Splitting
// them out is worth doing and is deferred only for scope: this change must not
// also move card identity around.
//
// Correcting an earlier version of this note: it claimed the move was blocked
// on relaxing the eslint import ban to a leaf allowlist. That is wrong, and was
// disproved by probe. `no-restricted-imports` genuinely cannot express the
// allowlist (negated `group` patterns are silently ignored), but the override
// already carries a `no-restricted-syntax` block, and a selector can:
//   ImportDeclaration[source.value!='./flags.js']
// plus THREE selectors that must be ADDED alongside it -- only
// `ImportExpression` exists in the override today
// (`ExportNamedDeclaration[source]` and `ExportAllDeclaration` appear there
// solely in prose, because `no-restricted-imports` covers re-exports while it
// is still in force). All four vectors have to land in the same commit that
// drops `no-restricted-imports`, or a leaf module re-exporting
// `export { x } from './getUuid.js'` lints clean and pulls a dependency into
// the poller bundle silently. So the move costs roughly an hour and a bundle
// rebuild, not a widened blast radius. Do not let this note talk you out of it.
//
// Until then, import them from here rather than writing a fourth variant --
// the drift this centralization exists to kill.
//
// BACOM is moving its public pages on business.adobe.com to extensionless
// URLs. Card identity (contentId/entityId) is a hash of the page URL, so
// dropping `.html` from the published URL would mint new ids and orphan every
// previously authored id reference. To avoid that, identity is computed from
// its own input: the identity pathname keeps exactly one terminal `.html`,
// regardless of what the public URL looks like.
//
// Scope is the host plus the authored flag, with ONE path carve-out. BACOM
// splits its content across repos (`da-bacom`, `da-bacom-blog`, ...) and each
// repo serves its own /.milo/caas/config.json, so the flag is normally scoped
// by whoever owns the content, and sections opt in through their own config.
//
// That boundary is not airtight: the flag also reaches the publishers from
// page metadata, which an author sets without a config change or a review.
// `/blog` is already published extensionless, so forcing `.html` onto its
// identity mints an id no card holds -- a section-wide orphaning with no error
// raised anywhere. It is therefore exempted here, below the config boundary,
// by toIdentityUrl. The exemption is deliberately kept at a single
// chokepoint every runtime shares: a publisher and a consumer that disagree
// about one page break every card in the section, silently.
//
// Keep the list minimal and anchored: an exemption silently neutralizes the
// flag for a section that later migrates TO `.html`.
//
// Only the identity hash input is affected. The public url, uci and CTA urls
// continue to use prodUrl untouched.

// Single-tenant by design, NOT an oversight. The migration this unblocks is
// bacom-only, and a tenant list that nobody is yet asking for would be
// unexercised configuration surface. Generalize to a configured allowlist when
// a second tenant actually migrates -- not before. Deliberately left without a
// tracking ticket: the trigger is a real second tenant, not a scheduled cleanup.
const BACOM_PROD_HOST = 'business.adobe.com';
const HTML_EXT = '.html';

// prodUrl reaches us in both schemed (`https://host/path`, from getProdUrl) and
// scheme-less (`host/path`, the hashing convention) forms. Split rather than
// use `new URL` so a scheme-less value is not misparsed, and so the exact
// original string is preserved everywhere we do not deliberately change it.
const splitUrl = (url) => {
  const scheme = url.match(/^https?:\/\//)?.[0] ?? '';
  const rest = url.slice(scheme.length);
  // The `.html` suffix applies to the pathname only, never to a query string
  // or fragment.
  const suffixIdx = rest.search(/[?#]/);
  const beforeSuffix = suffixIdx === -1 ? rest : rest.slice(0, suffixIdx);
  const suffix = suffixIdx === -1 ? '' : rest.slice(suffixIdx);
  const slashIdx = beforeSuffix.indexOf('/');
  const host = slashIdx === -1 ? beforeSuffix : beforeSuffix.slice(0, slashIdx);
  const pathname = slashIdx === -1 ? '' : beforeSuffix.slice(slashIdx);
  return { scheme, host, pathname, suffix };
};

// Collapse any number of trailing `.html` down to exactly one, so the result is
// identical whether the caller supplied `/foo`, `/foo.html` or `/foo.html.html`.
// Degenerate shapes are reproduced rather than cleaned up: when `.html` is
// requested, getProdUrl appends it without checking the path looks like a
// document, so a page published from `/fr/` really did hash `/fr/.html`, and
// "fixing" that here would orphan the card instead of preserving it.
// Case-sensitive on purpose: every publisher matched `.html` case-sensitively
// (`pathname.replace('.html', '')` in the bulk tool, `.endsWith('.html')` in
// getProdUrl), and identity is a hash of this exact string.
const stripHtml = (pathname) => {
  let path = pathname;
  while (path.endsWith(HTML_EXT)) path = path.slice(0, -HTML_EXT.length);
  return path;
};

const forceSingleHtml = (pathname) => `${stripHtml(pathname)}${HTML_EXT}`;

/**
 * Whether a url is in scope for the forced-`.html` identity policy: any BACOM
 * production url with a pathname.
 *
 * HOST scope, not policy effect. An exempt section answers true here and is
 * still left alone by toIdentityUrl -- callers asking "does the flag change
 * this id?" want policyAltersIdentity.
 * @param {string} url schemed or scheme-less url
 * @returns {boolean}
 */
export const isForcedHtmlIdentityUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const { host, pathname } = splitUrl(url);
  // Scope is decided by the configured production hostname, never by the
  // preview/aem host the content happened to be fetched from. Lowercased
  // because a host is case-insensitive, unlike the pathname.
  if (host.toLowerCase() !== BACOM_PROD_HOST) return false;
  return !!pathname;
};

// Authored flags reach the publishers from three places that each store values
// differently: a spreadsheet-backed config.json (every cell a string), bulk
// publisher presets (also strings) and page metadata (strings). Before this was
// centralized the codebase carried several near-miss variants -- some accepted
// only the exact lowercase `'true'`, so a sheet reading `TRUE` (what a
// spreadsheet produces when a user types an uppercase literal, or autocorrects)
// silently resolved to false. For a flag that governs card identity that is not
// a cosmetic inconsistency: it is the difference between preserving ids and
// orphaning every card on a site.
//
// One parser, used by every authored boolean on the identity path. Trimmed and
// lowercased so stray whitespace and casing cannot change meaning.
const TRUE_VALUES = new Set(['true', 'on']);
const FALSE_VALUES = new Set(['false', 'off']);

const normalize = (flag) => (typeof flag === 'string' ? flag.trim().toLowerCase() : null);

/**
 * Canonical parser for an authored boolean flag that defaults to OFF.
 * @param {string|boolean} flag authored value ('true'/'on' enable)
 * @returns {boolean}
 */
export const isFlagEnabled = (flag) => {
  if (flag === true) return true;
  const val = normalize(flag);
  // 'on' is the dominant convention for boolean page-metadata toggles in libs/.
  return val !== null && TRUE_VALUES.has(val);
};

/**
 * The PRE-EXISTING `htmlExt` config column, which must NOT use the canonical
 * parser above. It was shipped reading `=== true || === 'true'`, so a live cell
 * authored `TRUE`, `On` or ` true ` resolves to false today. Widening it would
 * flip those sites' public urls -- and prodUrl is the uuid v5 hash input, so it
 * would silently rehash every card they publish, at merge, with no rollback.
 *
 * Deliberately shared by BOTH runtimes that read this column (resolveHtmlExt in
 * the browser publisher, getProdUrl in the poller bundle). Pinning only one of
 * them is worse than widening both: the two publishers then disagree about the
 * same cell and mint two contentIds for one page, which is the precise failure
 * the env-split guard exists to prevent and which that guard cannot see,
 * because the fork is across runtimes rather than within one build.
 *
 * To opt in, author the cell as lowercase 'true'. That is an explicit action,
 * so the rehash happens when someone chooses it rather than when this merges.
 * @param {string|boolean} flag authored value
 * @returns {boolean}
 */
export const isLegacyHtmlExtEnabled = (flag) => flag === true || flag === 'true';

/**
 * Canonical parser for an authored boolean flag that defaults to ON, where only
 * an explicit falsey value turns it off. Needed because `rule.enabled === false`
 * is a strict boolean check, and a spreadsheet can only ever produce the STRING
 * `'false'` -- so a site asking for autopublish to be off was kept on.
 * @param {string|boolean} flag authored value ('false'/'off' disable)
 * @returns {boolean} true when the flag is explicitly turned off
 */
export const isFlagDisabled = (flag) => {
  if (flag === false) return true;
  const val = normalize(flag);
  return val !== null && FALSE_VALUES.has(val);
};

/**
 * Whether an authored value is present but means neither true nor false, e.g.
 * `'yes'` or `'1'`. Such a value is an authoring mistake that would otherwise
 * resolve silently to the default, so callers surface it rather than guess.
 * @param {string|boolean} flag authored value
 * @returns {boolean}
 */
export const isFlagUnrecognized = (flag) => {
  if (flag === undefined || flag === null || flag === true || flag === false) return false;
  const val = normalize(flag);
  if (val === null) return true;
  if (val === '') return false;
  return !TRUE_VALUES.has(val) && !FALSE_VALUES.has(val);
};

/**
 * Resolve the `htmlIdentity` feature flag. Authored by publishing teams in the
 * bulk publisher presets sheet, in each site's /.milo/caas/config.json and in
 * the `caas-identity-html` page metadata, so it can be turned on per site
 * without a code change.
 *
 * Deliberately not environment-scoped. A card's identity must not depend on
 * which CaaS environment it lands in: auto-publish builds one payload and posts
 * it to several targets, and promoting content from stage to prod must not mint
 * new ids. Rollout is staged by enabling the flag per site instead.
 *
 * @param {string|boolean} flag authored flag value ('true'/'on' enables)
 * @returns {boolean}
 */
// Currently a pure alias of isFlagEnabled, kept as a named entry point rather
// than inlined: it marks the call sites that specifically gate CARD IDENTITY,
// which is the one flag here whose misreading is unrecoverable (ids cannot be
// rehashed back once cards are published). Keeping the name means a future
// identity-only change -- an extra scope check, a kill switch -- lands in one
// place instead of needing those call sites to be rediscovered among every
// other isFlagEnabled caller.
export const isHtmlIdentityEnabled = (flag) => isFlagEnabled(flag);
/**
 * The url to hash into contentId/entityId. Returns prodUrl unchanged unless the
 * policy is enabled and the url is in scope, so an out-of-scope or flag-off
 * call is an exact no-op.
 *
 * Resolves the flag itself rather than trusting a truthy argument: this is a
 * public entry point reached from config-sheet values, where the string
 * 'false' would otherwise enable the policy and silently rehash every card.
 *
 * Module-private ON PURPOSE: it preserves whatever scheme it is given, but ids
 * are a uuid v5 of the SCHEME-LESS url. Exporting it alongside toIdentityUrl
 * published two near-identical normalizers where the more identity-sounding one
 * was the trap -- a caller passing getProdUrl's schemed output would hash a
 * schemed string, mint a different id and orphan the card, with no error and no
 * failing test. toIdentityUrl is the only supported entry point.
 *
 * @param {string} prodUrl scheme-less production url
 * @param {string|boolean} enabled authored or resolved feature-flag state
 * @returns {string} identity url
 */
const getCaasIdentityUrl = (prodUrl, enabled = false) => {
  if (!isHtmlIdentityEnabled(enabled) || !isForcedHtmlIdentityUrl(prodUrl)) return prodUrl;
  const { scheme, host, pathname, suffix } = splitUrl(prodUrl);
  return `${scheme}${host}${forceSingleHtml(pathname)}${suffix}`;
};

/**
 * Scheme strip + forced-`.html`, WITHOUT the extensionless-section carve-out.
 *
 * Card ids are a uuid v5 of the SCHEME-LESS production url, so producing one
 * is two steps: strip the scheme, then apply the policy. Both live here
 * because every caller that does only the second step by hand has to reproduce
 * the first, and the auto-publish convergence guard has to reproduce BOTH to
 * predict what the builder will hash.
 *
 * Module-private: this is only half the policy. toIdentityUrl is the exported
 * entry point, and a caller reaching past it to this one would skip the
 * carve-out and mint an id no card holds, with no error and no failing test.
 *
 * @param {string} prodUrl schemed or scheme-less production url
 * @param {string|boolean} enabled authored or resolved feature-flag state
 * @returns {string} the string to hash
 */
const toRawIdentityUrl = (prodUrl, enabled = false) => {
  const bare = typeof prodUrl === 'string' ? prodUrl.replace(/^https?:\/\//, '') : prodUrl;
  return getCaasIdentityUrl(bare, enabled);
};

// Sections published WITHOUT the extension, whose pages therefore have no
// `.html` form to force. Hardcoded rather than configured: half of this runs
// in the UMD/poller bundle, where no site config is reachable, and publisher
// and consumer MUST agree -- two sides that disagree about one page mint two
// different ids and every card in the section stops resolving, silently.
const EXTENSIONLESS_SECTIONS = ['blog'];

// Locale prefixes the extensionless sections are actually published under.
// Hardcoded for the same reason: this leaf cannot import a locale table, and a
// `[a-z]{2}(_[a-z]{2})?` shape heuristic would be wrong in both directions.
// TODO(MWPW-213847): if the blog repo indexes a new locale, add it here or its
// pages start having `.html` forced onto their ids.
const EXTENSIONLESS_SECTION_PREFIXES = ['au', 'de', 'fr', 'jp', 'kr', 'uk'];

/**
 * Whether a url is in a section that is published without the extension.
 *
 * Anchored to the first content segment, after at most one locale prefix, so
 * `/resources/blog/x` and `/products/blogging-tool` do NOT match. That
 * anchoring is load-bearing: both belong to the `.html`-publishing repo, and
 * exempting either would create the very divergence this prevents.
 *
 * @param {string} url schemed or scheme-less url
 * @returns {boolean}
 */
export const isExtensionlessSection = (url) => {
  if (!isForcedHtmlIdentityUrl(url)) return false;
  const { pathname } = splitUrl(url);
  const segments = stripHtml(pathname).split('/').filter(Boolean);
  const [first] = segments;
  if (!first) return false;
  const rest = EXTENSIONLESS_SECTION_PREFIXES.includes(first.toLowerCase())
    ? segments.slice(1)
    : segments;
  const [section] = rest;
  return !!section && EXTENSIONLESS_SECTIONS.includes(section.toLowerCase());
};

/**
 * The identity url, with the full forced-`.html` policy applied -- including
 * its carve-out for sections that are published extensionless.
 *
 * Every runtime that mints or reproduces an identity goes through this, so the
 * publisher, the removal path and the collection consumer cannot drift apart.
 * Gated on the flag like the rest of the policy: with the flag off nothing is
 * forced, so there is nothing to carve out, and rewriting ids for a site that
 * never opted in would orphan cards that resolve correctly today.
 *
 * @param {string} prodUrl production url of the page
 * @param {string|boolean} enabled authored htmlIdentity flag value
 * @returns {string} the string to hash
 */
export const toIdentityUrl = (prodUrl, enabled = false) => {
  if (!isHtmlIdentityEnabled(enabled) || !isExtensionlessSection(prodUrl)) {
    return toRawIdentityUrl(prodUrl, enabled);
  }
  // STRIP rather than decline to add: the per-environment htmlExt split means
  // the same page arrives as `/blog/x` from one environment and `/blog/x.html`
  // from another, and only normalizing to the extensionless form makes those
  // variants hash alike.
  const { scheme, host, pathname, suffix } = splitUrl(toRawIdentityUrl(prodUrl, false));
  return `${scheme}${host}${stripHtml(pathname)}${suffix}`;
};

/**
 * Whether the policy actually changes the id for a url -- the only question
 * worth warning on. Subsumes "is it in scope" and "was it authored with the
 * extension": an out-of-scope url, an already-`.html` url and an exempt
 * section all answer no, because for each of them both flag states hash the
 * same string.
 * @param {string} url schemed or scheme-less url
 * @returns {boolean}
 */
export const policyAltersIdentity = (url) => toIdentityUrl(url, true) !== toIdentityUrl(url, false);

/**
 * True when the policy is off and turning it on would change the url's id --
 * the one combination that silently resolves to an id no published card holds.
 *
 * Narrower than "in scope and flag off" by construction, via
 * policyAltersIdentity. Before a site completes its extensionless migration
 * its authored links still carry `.html`, and those resolve correctly with the
 * flag off; warning on them would fire on every bacom page today and train
 * readers to ignore the signal. In an exempt section the comparison inverts --
 * the bare form is the correct one and a link carrying `.html` is the miss.
 *
 * @param {string} url authored link, schemed or scheme-less
 * @param {string|boolean} enabled authored or resolved feature-flag state
 * @returns {boolean}
 */
export const isIdentityPolicyMiss = (url, enabled = false) => (
  !isHtmlIdentityEnabled(enabled) && policyAltersIdentity(url)
);
