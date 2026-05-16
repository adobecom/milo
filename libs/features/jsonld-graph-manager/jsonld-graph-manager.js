/* eslint-disable no-use-before-define, no-continue */
import { debounce } from '../../utils/action.js';

const MANAGED_ATTR = 'data-milo-jsonld';
const MANAGED_VAL = 'graph';
const MANAGED_SEL = `script[type="application/ld+json"][${MANAGED_ATTR}="${MANAGED_VAL}"]`;
const UNMANAGED_SEL = `script[type="application/ld+json"]:not([${MANAGED_ATTR}="${MANAGED_VAL}"])`;
const DEBOUNCE_MS = 1000;
const REF_ARRAY_KEYS = new Set(['hasPart', 'mainEntity', 'itemListElement']);

const RULES = {
  WebPage: {
    idFragment: '#webpage',
    singleton: true,
    root: true,
    links: { publisher: 'Organization', breadcrumb: 'BreadcrumbList' },
  },
  Organization: { idSuffix: '/#organization', siteScoped: true, singleton: true },
  Article: {
    idFragment: '#article',
    linksBack: { isPartOf: 'WebPage', mainEntityOfPage: 'WebPage', publisher: 'Organization' },
  },
  BreadcrumbList: {
    idFragment: '#breadcrumb',
    singleton: true,
    linksBack: { isPartOf: 'WebPage' },
  },
  SoftwareApplication: {
    idFragment: '#softwareapplication',
    linksBack: { provider: 'Organization' },
  },
  HowTo: { idFragment: '#howto', linksBack: { isPartOf: 'WebPage' } },
  FAQPage: { idFragment: '#faq', linksBack: { isPartOf: 'WebPage' } },
  VideoObject: { idFragment: '#videoobject', repeatable: true },
  Event: { idFragment: '#event' },
  Offer: { idFragment: '#offer', repeatable: true },
  AggregateRating: { idFragment: '#aggregaterating', singleton: true },
};

const TYPE_TRANSFORMS = { Product: 'SoftwareApplication' };

const SOFTWARE_APP_SUBTYPES = new Set(['WebApplication', 'MobileApplication', 'VideoGame']);

const ORG_ID_ALIASES = new Set(['#org', '#publisher', '#adobe']);

export function siteRoot(hostname = window.location.hostname) {
  return /business|bacom/i.test(hostname)
    ? 'https://business.adobe.com'
    : 'https://www.adobe.com';
}

const ADOBE_CORPORATE_LOGO = 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg';

const AGGREGATE_RATING_MIN_VALUE = 3.2;
const AGGREGATE_RATING_MIN_COUNT = 100;

export function aggregateRatingMeetsThresholds(node) {
  if (!node) return false;
  const value = Number(node.ratingValue);
  const count = Number(node.ratingCount);
  if (!Number.isFinite(value) || value < AGGREGATE_RATING_MIN_VALUE) return false;
  if (!Number.isFinite(count) || count < AGGREGATE_RATING_MIN_COUNT) return false;
  return true;
}

export function defaultOrg(hostname) {
  const root = siteRoot(hostname);
  const isBusiness = root.includes('business');
  return {
    '@type': 'Organization',
    '@id': `${root}/#organization`,
    name: isBusiness ? 'Adobe for Business' : 'Adobe',
    url: `${root}/`,
    logo: {
      '@type': 'ImageObject',
      url: ADOBE_CORPORATE_LOGO,
      contentUrl: ADOBE_CORPORATE_LOGO,
    },
  };
}

export function canonicalUrl() {
  const link = document.head.querySelector('link[rel="canonical"]');
  if (link?.href) {
    const u = new URL(link.href);
    return `${u.origin}${u.pathname}`;
  }
  const u = new URL(window.location.href);
  return `${u.origin}${u.pathname}`;
}

export function pageScopedId(type) {
  const rule = RULES[type];
  if (!rule) return null;
  if (rule.siteScoped) return `${siteRoot()}${rule.idSuffix}`;
  return `${canonicalUrl()}${rule.idFragment}`;
}

export function flattenPayload(data) {
  if (!data || typeof data !== 'object') return [];
  if (Array.isArray(data)) return data.flatMap(flattenPayload);
  if (data['@graph'] != null) {
    const innerArr = Array.isArray(data['@graph']) ? data['@graph'] : [data['@graph']];
    const innerFlat = innerArr.flatMap(flattenPayload);
    const rest = { ...data };
    delete rest['@graph'];
    delete rest['@context'];
    if (rest['@type']) return [rest, ...innerFlat];
    return innerFlat;
  }
  return [data];
}

export function parsePayload(scriptEl) {
  try {
    const data = JSON.parse(scriptEl.textContent);
    return flattenPayload(data);
  } catch (e) {
    lanaLog(`Failed to parse JSON-LD: ${e.message}`, 'warn');
    return [];
  }
}

export function normalizeNode(node) {
  const out = { ...node };
  delete out['@context'];
  if (TYPE_TRANSFORMS[out['@type']]) out['@type'] = TYPE_TRANSFORMS[out['@type']];
  const type = out['@type'];
  if (!type) return out;
  if (SOFTWARE_APP_SUBTYPES.has(type)) {
    out['@id'] = pageScopedId('SoftwareApplication');
    return out;
  }
  const rule = RULES[type];
  if (!rule) return out;
  if (rule.repeatable && typeof out['@id'] === 'string') {
    const hashIdx = out['@id'].lastIndexOf('#');
    const producerFragment = hashIdx >= 0 ? out['@id'].slice(hashIdx) : null;
    if (producerFragment && producerFragment !== rule.idFragment) {
      out['@id'] = `${canonicalUrl()}${producerFragment}`;
      return out;
    }
  }
  out['@id'] = pageScopedId(type);
  return out;
}

export function canonicalizeOrgId(id) {
  if (typeof id !== 'string') return id;
  const hashIdx = id.lastIndexOf('#');
  if (hashIdx < 0) return id;
  const fragment = id.slice(hashIdx);
  if (!ORG_ID_ALIASES.has(fragment)) return id;
  const root = id.slice(0, hashIdx).replace(/\/$/, '');
  return `${root}/#organization`;
}

export function canonicalizeReferences(node) {
  for (const v of Object.values(node)) {
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item && typeof item === 'object') canonicalizeReferences(item);
      }
    } else if (v && typeof v === 'object') {
      if (v['@id'] && !v['@type']) v['@id'] = canonicalizeOrgId(v['@id']);
    }
  }
}

function canonicalOrigin() {
  const link = document.head.querySelector('link[rel="canonical"]');
  if (!link?.href) return null;
  try { return new URL(link.href).origin; } catch { return null; }
}

export function canonicalizeBreadcrumbItems(node) {
  if (node['@type'] !== 'BreadcrumbList') return;
  const items = node.itemListElement;
  if (!Array.isArray(items)) return;
  const prodOrigin = canonicalOrigin();
  if (!prodOrigin) return;
  const currentOrigin = window.location.origin;
  for (const li of items) {
    if (!li || typeof li.item !== 'string') continue;
    try {
      const u = new URL(li.item, window.location.href);
      const origin = u.origin === currentOrigin ? prodOrigin : u.origin;
      li.item = `${origin}${u.pathname}`;
    } catch { /* leave as-is */ }
  }
}

const PARENT_PAGE_PROPS = ['isPartOf', 'mainEntityOfPage'];

function maybeRewriteWebPageRef(val) {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return val;
  const isInlineWebPage = val['@type'] === 'WebPage';
  const id = val['@id'];
  const looksLikeWebPageRef = typeof id === 'string' && id.endsWith('#webpage');
  if (isInlineWebPage || looksLikeWebPageRef) {
    return { '@id': pageScopedId('WebPage') };
  }
  return val;
}

export function rewriteCrossPageRefs(node) {
  for (const prop of PARENT_PAGE_PROPS) {
    const val = node[prop];
    if (val == null) continue;
    if (Array.isArray(val)) {
      const rewritten = val.map(maybeRewriteWebPageRef);
      node[prop] = rewritten.length === 1 ? rewritten[0] : rewritten;
    } else {
      node[prop] = maybeRewriteWebPageRef(val);
    }
  }
}

function asArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

export function unionByRef(a, b) {
  const arrA = asArray(a);
  const arrB = asArray(b);
  const seen = new Set(arrA.map((n) => n['@id'] ?? JSON.stringify(n)));
  const result = [...arrA];
  for (const item of arrB) {
    const key = item['@id'] ?? JSON.stringify(item);
    if (!seen.has(key)) { seen.add(key); result.push(item); }
  }
  return result;
}

function priorityWeight(src) {
  if (src === 'generated') return 2;
  if (src === 'runtime') return 1;
  return 0;
}

export function mergeNodes(a, b, srcA, srcB) {
  const aWins = priorityWeight(srcA) >= priorityWeight(srcB);
  const [winner, loser] = aWins ? [a, b] : [b, a];
  const winnerSrc = aWins ? srcA : srcB;
  const loserSrc = aWins ? srcB : srcA;
  const out = { ...loser, ...winner };
  for (const key of Object.keys(loser)) {
    if (['@type', '@id', '@context'].includes(key)) continue;
    const vW = winner[key];
    const vL = loser[key];
    if (!(key in winner)) { out[key] = vL; continue; }
    if (REF_ARRAY_KEYS.has(key) || Array.isArray(vW) || Array.isArray(vL)) {
      out[key] = unionByRef(vW, vL);
    } else if (vW !== null && vL !== null && typeof vW === 'object' && typeof vL === 'object') {
      out[key] = mergeNodes(vW, vL, winnerSrc, loserSrc);
    }
  }
  const subtype = [a['@type'], b['@type']].find((t) => SOFTWARE_APP_SUBTYPES.has(t));
  if (subtype && [a['@type'], b['@type']].some((t) => t === 'SoftwareApplication' || SOFTWARE_APP_SUBTYPES.has(t))) {
    out['@type'] = subtype;
  }
  return out;
}

function effectiveType(t) {
  return SOFTWARE_APP_SUBTYPES.has(t) ? 'SoftwareApplication' : t;
}

export function injectLinks(nodes) {
  const byType = {};
  for (const node of nodes) {
    const t = node['@type'];
    if (!t) continue;
    if (!byType[t]) byType[t] = node;
    const eff = effectiveType(t);
    if (eff !== t && !byType[eff]) byType[eff] = node;
  }
  for (const node of nodes) {
    const rule = RULES[effectiveType(node['@type'])];
    if (!rule?.linksBack) continue;
    for (const [prop, targetType] of Object.entries(rule.linksBack)) {
      const target = byType[targetType];
      if (target?.['@id'] && !node[prop]) node[prop] = { '@id': target['@id'] };
    }
  }
  const webpage = byType.WebPage;
  if (webpage) {
    for (const [prop, targetType] of Object.entries(RULES.WebPage.links ?? {})) {
      const target = byType[targetType];
      if (target?.['@id'] && !webpage[prop]) webpage[prop] = { '@id': target['@id'] };
    }
    if (!webpage.mainEntity) {
      const primary = byType.Article ?? byType.NewsArticle ?? byType.SoftwareApplication;
      if (primary?.['@id']) webpage.mainEntity = { '@id': primary['@id'] };
    }
  }
}

function sortNodes(nodes) {
  const order = ['WebPage', 'Organization', 'Article', 'SoftwareApplication', 'BreadcrumbList'];
  return [...nodes].sort((a, b) => {
    const ai = order.indexOf(a['@type'] ?? '');
    const bi = order.indexOf(b['@type'] ?? '');
    return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
  });
}

const ENTITY_PROPS = ['publisher', 'author', 'creator', 'provider', 'brand', 'seller', 'offers', 'itemOffered', 'aggregateRating'];

function extractEntity(val) {
  if (!val || typeof val !== 'object' || Array.isArray(val) || !val['@type']) return null;
  if (!RULES[val['@type']] && !TYPE_TRANSFORMS[val['@type']]) return null;
  const normalized = normalizeNode(val);
  return normalized['@id'] ? normalized : null;
}

export function extractInlineEntities(node) {
  const extracted = [];
  for (const prop of ENTITY_PROPS) {
    const val = node[prop];
    if (val == null) continue;
    if (Array.isArray(val)) {
      node[prop] = val.map((item) => {
        const ent = extractEntity(item);
        if (!ent) return item;
        extracted.push(ent);
        return { '@id': ent['@id'] };
      });
    } else {
      const ent = extractEntity(val);
      if (ent) {
        extracted.push(ent);
        node[prop] = { '@id': ent['@id'] };
      }
    }
  }
  return extracted;
}

const DEBUG = new URLSearchParams(window.location.search).get('jsonld-graph-manager-debug') === 'true';

function debugLog(label, fn) {
  if (!DEBUG) return;
  // eslint-disable-next-line no-console
  console.log('[jsonld-graph-manager]', label, fn());
}

function lanaLog(msg, severity = 'info') {
  window.lana?.log(`JSON-LD: ${msg}`, { tags: 'jsonld-graph-manager', severity });
  const { hostname, search } = window.location;
  if (hostname === 'localhost' || hostname.endsWith('.page') || new URLSearchParams(search).has('lanadebug')) {
    // eslint-disable-next-line no-console
    if (severity === 'error') console.error(`JSON-LD: ${msg}`);
    // eslint-disable-next-line no-console
    else if (severity === 'warn') console.warn(`JSON-LD: ${msg}`);
  }
}

export function parseIgnoreParam(search = window.location.search) {
  const raw = new URLSearchParams(search).get('jsonld-graph-manager-ignore');
  if (!raw) return new Set();
  return new Set(raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
}

const IGNORE_TYPES = parseIgnoreParam();

export function shouldIgnoreScript(scriptEl, ignoreTypes) {
  if (!ignoreTypes || ignoreTypes.size === 0) return false;
  let data;
  try { data = JSON.parse(scriptEl.textContent); } catch { return false; }
  if (!data || typeof data !== 'object') return false;
  const items = Array.isArray(data) ? data : [data];
  const ids = [];
  for (const item of items) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    if ('@graph' in item) ids.push('graph');
    if (typeof item['@type'] === 'string') ids.push(item['@type'].toLowerCase());
  }
  if (ids.length === 0) return false;
  const matched = ids.filter((id) => ignoreTypes.has(id));
  if (matched.length === 0) return false;
  if (matched.length < ids.length) {
    const kept = ids.filter((id) => !matched.includes(id));
    lanaLog(
      `Ignored script has mixed types: matched [${matched.join(',')}], also contains [${kept.join(',')}]. Skipping entire script. Split producer into separate scripts, or use 'graph' to bypass intentionally.`,
      'warn',
    );
  }
  return true;
}

export class JsonLdGraphManager {
  constructor(options = {}) {
    this.graph = new Map();
    this.sources = new Map();
    this.queue = [];
    this.observer = null;
    this.isProcessing = false;
    this.ignoreTypes = options.ignoreTypes ?? IGNORE_TYPES;
    this.debouncedRebuild = debounce(() => this.rebuild(), DEBOUNCE_MS);
  }

  init() {
    document.querySelectorAll(UNMANAGED_SEL).forEach((el) => this.enqueue(el, 'bootDom'));

    this.observer = new MutationObserver((mutations) => {
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) this.collect(node);
      }
    });
    this.observer.observe(document.documentElement, { childList: true, subtree: true });

    this.rebuild();
  }

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
  }

  collect(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches?.(MANAGED_SEL)) return;
    if (node.matches?.('script[type="application/ld+json"]')) {
      this.enqueue(node, 'runtime');
      return;
    }
    node.querySelectorAll?.(UNMANAGED_SEL).forEach((el) => this.enqueue(el, 'runtime'));
  }

  enqueue(scriptEl, source = 'runtime') {
    if (shouldIgnoreScript(scriptEl, this.ignoreTypes)) {
      debugLog('ignored', () => ({
        source,
        location: `${scriptEl.parentElement?.tagName ?? 'detached'} > script`,
        payload: scriptEl.textContent.trim().slice(0, 200),
      }));
      return;
    }
    debugLog('enqueue', () => ({
      source,
      location: `${scriptEl.parentElement?.tagName ?? 'detached'} > script`,
      payload: scriptEl.textContent.trim(),
    }));
    this.queue.push({ scriptEl, source });
    if (source === 'runtime') this.debouncedRebuild();
  }

  rebuild() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      const batch = this.queue.splice(0);
      debugLog('rebuild', () => ({ batchSize: batch.length, graphSize: this.graph.size }));
      for (const { scriptEl, source } of batch) {
        const nodes = parsePayload(scriptEl);
        debugLog('parsed', () => ({ source, types: nodes.map((n) => n['@type']), nodeCount: nodes.length }));
        const parentTagName = scriptEl.parentElement?.tagName ?? 'already detached';
        scriptEl.remove();
        debugLog('removed from DOM', () => parentTagName);
        for (const raw of nodes) {
          const node = normalizeNode(raw);
          const inlined = extractInlineEntities(node);
          const toMerge = [node, ...inlined];
          for (const n of toMerge) {
            rewriteCrossPageRefs(n);
            canonicalizeBreadcrumbItems(n);
            canonicalizeReferences(n);
          }
          for (const n of toMerge) {
            const id = n['@id'] ?? n['@type'] ?? JSON.stringify(n);
            const prevSrc = this.sources.get(id) ?? 'bootDom';
            if (this.graph.has(id)) {
              this.graph.set(id, mergeNodes(this.graph.get(id), n, prevSrc, source));
            } else {
              this.graph.set(id, n);
            }
            if (priorityWeight(source) >= priorityWeight(prevSrc)) {
              this.sources.set(id, source);
            }
          }
        }
      }
      this.rewrite();
    } finally {
      this.isProcessing = false;
    }
  }

  rewrite() {
    const webpageId = pageScopedId('WebPage');
    if (!this.graph.has(webpageId)) {
      const url = canonicalUrl();
      this.graph.set(webpageId, { '@type': 'WebPage', '@id': webpageId, url });
    }
    const org = defaultOrg();
    const orgId = org['@id'];
    if (!this.graph.has(orgId)) {
      this.graph.set(orgId, org);
      this.sources.set(orgId, 'generated');
    } else {
      const prevSrc = this.sources.get(orgId) ?? 'bootDom';
      this.graph.set(orgId, mergeNodes(org, this.graph.get(orgId), 'generated', prevSrc));
      this.sources.set(orgId, 'generated');
    }
    const ratingId = pageScopedId('AggregateRating');
    const rating = this.graph.get(ratingId);
    if (rating && !aggregateRatingMeetsThresholds(rating)) {
      this.graph.delete(ratingId);
      this.sources.delete(ratingId);
      for (const n of this.graph.values()) {
        if (n.aggregateRating?.['@id'] === ratingId) delete n.aggregateRating;
      }
    }
    const saId = pageScopedId('SoftwareApplication');
    const sa = this.graph.get(saId);
    if (sa) {
      const hasOffers = sa.offers != null && !(Array.isArray(sa.offers) && sa.offers.length === 0);
      if (!hasOffers) {
        const offerId = pageScopedId('Offer');
        if (!this.graph.has(offerId)) {
          this.graph.set(offerId, {
            '@type': 'Offer',
            '@id': offerId,
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            category: 'Free Trial',
          });
          this.sources.set(offerId, 'generated');
        }
        sa.offers = [{ '@id': offerId }];
      }
    }
    const nodes = sortNodes([...this.graph.values()]);
    injectLinks(nodes);
    const payload = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, null, 2);
    let managed = document.head.querySelector(MANAGED_SEL);
    if (!managed) {
      managed = document.createElement('script');
      managed.type = 'application/ld+json';
      managed.setAttribute(MANAGED_ATTR, MANAGED_VAL);
      document.head.appendChild(managed);
    }
    managed.textContent = payload;
    debugLog('rewrite', () => ({ nodeCount: nodes.length, graph: nodes }));
  }
}

export default async function init() {
  if (window.miloJsonLdGraphManager) return;
  const manager = new JsonLdGraphManager();
  window.miloJsonLdGraphManager = manager;
  manager.init();
}
