// MEP "Highlight CaaS Content" — edit-in-Configurator badges and
// auto-derived card paths for [data-caas-block] / [data-card-url] surfaces.
//
// Extracted from mep-next.js for separation of concerns.

import { createTag, getConfig } from '../../../utils/utils.js';
import { mepCaasConfigUrls } from '../../../blocks/caas/utils.js';

const CAAS_BADGE_CLASS = 'mep-caas-edit-badge';
const PREVIEW_HOST_RE = /\.(aem|hlx)\.(page|live)$/;
const BLOG_PATH_RE = /^\/(?:[^/]+\/)?blog\//i;
const PREVIEW_REPO_HOST_RE = /^(.+?)--(.+?)--adobecom\.aem\.(page|live)$/;

// Called from mep-next.js's data-card-url badge-click handler to remap a
// prod-domain CaaS URL onto the current preview branch (so "open this card"
// stays in the same preview environment).
export function rewriteForPreviewHost(url) {
  if (!url) return url;
  const isPreview = PREVIEW_HOST_RE.test(window.location.host)
    || window.location.search.includes('milolibs=');
  if (!isPreview) return url;
  try {
    const u = new URL(url);
    const { prodDomains = ['business.adobe.com', 'www.adobe.com', 'news.adobe.com'] } = getConfig();
    if (!prodDomains.includes(u.host)) return u.toString();
    u.protocol = window.location.protocol;
    u.host = window.location.host;
    if (PREVIEW_HOST_RE.test(u.host)) u.pathname = u.pathname.replace(/\.html$/, '');
    return u.toString();
  } catch { return url; }
}

// Counterpart for blog URLs: when on a non-blog preview branch, redirects
// business.adobe.com/blog/… links to the parallel "-blog" repo preview host
// so cross-repo blog links stay inside the same branch context.
export function rewriteBlogPreviewHost(url) {
  if (!url) return null;
  const m = window.location.host.match(PREVIEW_REPO_HOST_RE);
  if (!m) return null;
  const [, branch, repo, env] = m;
  if (repo.endsWith('-blog')) return null;
  try {
    const u = new URL(url);
    if (u.host !== 'business.adobe.com') return null;
    if (!BLOG_PATH_RE.test(u.pathname)) return null;
    u.protocol = window.location.protocol;
    u.host = `${branch}--${repo}-blog--adobecom.aem.${env}`;
    u.pathname = u.pathname.replace(/\.html$/, '');
    return u.toString();
  } catch { return null; }
}

function derivePathsForCards(root = document) {
  root.querySelectorAll('[data-card-url]:not([data-card-path])').forEach((el) => {
    const href = el.dataset.cardUrl;
    if (!href) { el.dataset.cardPath = ''; return; }
    try {
      el.dataset.cardPath = new URL(href).pathname;
    } catch {
      el.dataset.cardPath = '';
    }
  });
}

export function injectCaasBadges() {
  document.querySelectorAll('[data-caas-block]').forEach((el) => {
    const prev = el.previousElementSibling;
    if (prev?.classList?.contains(CAAS_BADGE_CLASS)) return;
    const url = mepCaasConfigUrls.get(el);
    if (!url) return;
    const a = createTag(
      'a',
      {
        class: CAAS_BADGE_CLASS,
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'Edit in CaaS Configurator',
    );
    el.insertAdjacentElement('beforebegin', a);
  });
  derivePathsForCards();
}

export function removeCaasBadges() {
  document.querySelectorAll(`a.${CAAS_BADGE_CLASS}`).forEach((el) => el.remove());
  // Clear derived paths so they don't sit in the DOM as invisible state.
  document.querySelectorAll('[data-card-path]').forEach((el) => delete el.dataset.cardPath);
}

let caasObserver;
export function watchForCaasBlocks() {
  if (caasObserver) return;
  caasObserver = new MutationObserver((mutations) => {
    if (document.body.dataset.mepCaasHighlight !== 'true') return;
    const hasCaasMutation = mutations.some((m) => [...m.addedNodes].some((n) => (n.nodeType === 1)
      && (n.matches?.('[data-caas-block], [data-card-url]')
        || n.querySelector?.('[data-caas-block], [data-card-url]'))));
    if (hasCaasMutation) injectCaasBadges();
  });
  caasObserver.observe(document.body, { childList: true, subtree: true });
}

export function unwatchForCaasBlocks() {
  if (!caasObserver) return;
  caasObserver.disconnect();
  caasObserver = null;
}
