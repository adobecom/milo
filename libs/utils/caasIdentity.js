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
// its own input: for non-blog BACOM pages the identity pathname keeps exactly
// one terminal `.html`, regardless of what the public URL looks like.
//
// Only the identity hash input is affected. The public url, uci and CTA urls
// continue to use prodUrl untouched.

const BACOM_PROD_HOST = 'business.adobe.com';
// The blog lives at the site root, optionally behind a single locale segment.
// Anchored, and `blog` must be a whole segment, so `/blog`, `/fr/blog` and
// `/mena_ar/blog/post` are exempt while `/resources/blog/x` (a content section,
// not a locale) and `/resources/jp/blog-post` are not. A bare
// `includes('/blog/')` would miss the landing pages and wrongly exempt
// `/resources/blog/x`; dropping to `includes('/blog')` would also exempt
// `/resources/jp/blog-post`, which is why `blog` must match a whole segment.
// The locale segment is length-bounded rather than `[^/]+` precisely to tell a
// locale (`fr`, `ch_fr`, `mena_ar`, `africa`) apart from a section name.
const BLOG_PATH = /^\/(?:[a-z]{2,6}(?:_[a-z]{2,3})?\/)?blog(?:\/|$)/i;
const HTML_EXT = '.html';

// prodUrl reaches us in both schemed (`https://host/path`, from getProdUrl) and
// scheme-less (`host/path`, the hashing convention) forms. Split rather than
// use `new URL` so a scheme-less value is not misparsed, and so the exact
// original string is preserved everywhere we do not deliberately change it.
const splitUrl = (url) => {
  const scheme = url.match(/^https?:\/\//)?.[0] ?? '';
  const rest = url.slice(scheme.length);
  // The blog exception and the `.html` suffix apply to the pathname only, never
  // to a query string or fragment.
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
 * Whether a url is in scope for the forced-`.html` identity policy: a BACOM
 * production url whose pathname is not under /blog/.
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
  if (!pathname) return false;
  return !BLOG_PATH.test(pathname);
};

/**
 * Resolve the `htmlIdentity` feature flag. Authored by publishing teams in the
 * bulk publisher presets sheet, in each site's /.milo/caas/config.json and in
 * the `caas-identity-html` page metadata, so it can be turned on per site
 * without a code change. Config sheets store booleans as strings, so both the
 * boolean and the string form are accepted, mirroring `getProdUrl`'s `htmlExt`.
 *
 * Deliberately not environment-scoped. A card's identity must not depend on
 * which CaaS environment it lands in: auto-publish builds one payload and posts
 * it to several targets, and promoting content from stage to prod must not mint
 * new ids. Rollout is staged by enabling the flag per site instead.
 *
 * @param {string|boolean} flag authored flag value ('true'/'on' enables)
 * @returns {boolean}
 */
export const isHtmlIdentityEnabled = (flag) => {
  if (flag === true) return true;
  if (typeof flag !== 'string') return false;
  const val = flag.trim().toLowerCase();
  // 'on' is the dominant convention for boolean page-metadata toggles in libs/.
  return val === 'true' || val === 'on';
};

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
