// CaaS card identity normalization.
//
// This is a LEAF module: pure string logic with no imports, so it is safe to
// import from tools/send-to-caas/caas-payload-core.js (which must stay
// bundle-able) as well as from libs/blocks/caas/utils.js. Keep it dependency
// free.
//
// BACOM is moving its public pages on business.adobe.com to extensionless
// URLs. Card identity (contentId/entityId) is a hash of the page URL, so
// dropping `.html` from the published URL would mint new ids and orphan every
// previously authored id reference. To avoid that, identity is computed from
// its own input: the identity pathname keeps exactly one terminal `.html`,
// regardless of what the public URL looks like.
//
// Scope is the host plus the authored flag, with no path carve-outs. BACOM
// splits its content across repos (`da-bacom`, `da-bacom-blog`, ...) and each
// repo serves its own /.milo/caas/config.json, so the flag is already scoped
// by whoever owns the content. A hardcoded path exemption would sit *under*
// that boundary and silently neutralize the flag for a section that later
// migrates -- the failure mode being a section-wide orphaning with no error
// raised anywhere. Sections opt in by setting the flag in their own config.
//
// Only the identity hash input is affected. The public url, uci and CTA urls
// continue to use prodUrl untouched.

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
const forceSingleHtml = (pathname) => {
  let path = pathname;
  while (path.endsWith(HTML_EXT)) path = path.slice(0, -HTML_EXT.length);
  return `${path}${HTML_EXT}`;
};

/**
 * Whether a url is in scope for the forced-`.html` identity policy: any BACOM
 * production url with a pathname.
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
 * @param {string} prodUrl schemed or scheme-less production url
 * @param {string|boolean} enabled authored or resolved feature-flag state
 * @returns {string} identity url
 */
export const getCaasIdentityUrl = (prodUrl, enabled = false) => {
  if (!isHtmlIdentityEnabled(enabled) || !isForcedHtmlIdentityUrl(prodUrl)) return prodUrl;
  const { scheme, host, pathname, suffix } = splitUrl(prodUrl);
  return `${scheme}${host}${forceSingleHtml(pathname)}${suffix}`;
};
