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
    linksBack: { isPartOf: 'WebPage', mainEntityOfPage: 'WebPage', provider: 'Organization' },
  },
  HowTo: { idFragment: '#howto', linksBack: { isPartOf: 'WebPage' } },
  FAQPage: { idFragment: '#faq', linksBack: { isPartOf: 'WebPage' } },
  VideoObject: { idFragment: '#videoobject', repeatable: true },
  Event: { idFragment: '#event', repeatable: true },
  Offer: { idFragment: '#offer', repeatable: true },
  AggregateRating: { idFragment: '#aggregaterating', singleton: true },
};

const TYPE_TRANSFORMS = { Product: 'SoftwareApplication' };

const SOFTWARE_APP_SUBTYPES = new Set(['WebApplication', 'MobileApplication', 'VideoGame']);

const ORG_ID_ALIASES = new Set(['#org', '#publisher', '#adobe']);

const SITE_ROOTS = new Map([
  ['business.adobe.com', 'https://business.adobe.com'],
  ['bacom.adobe.com', 'https://business.adobe.com'],
  ['news.adobe.com', 'https://www.adobe.com'],
  ['www.adobe.com', 'https://www.adobe.com'],
]);

export function siteRoot(hostname = new URL(canonicalUrl()).hostname) {
  return SITE_ROOTS.get(hostname.toLowerCase()) ?? 'https://www.adobe.com';
}

const ADOBE_CORPORATE_LOGO = 'https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg';

const AGGREGATE_RATING_MIN_VALUE = 4.0;
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
  const u = new URL(link?.href || window.location.href);
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
    const innerArr = asArray(data['@graph']);
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
    return parsePayloadText(scriptEl.textContent);
  } catch (e) {
    lanaLog(`Failed to parse JSON-LD: ${e.message}`, 'warn');
    return [];
  }
}

function parsePayloadText(textContent) {
  return flattenPayload(JSON.parse(textContent));
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
  if (rule.repeatable) {
    out['@id'] = repeatableNodeId(out, type, rule);
    return out;
  }
  out['@id'] = pageScopedId(type);
  return out;
}

function repeatableNodeId(node, type, rule) {
  if (typeof node['@id'] === 'string') {
    const hashIdx = node['@id'].lastIndexOf('#');
    const producerFragment = hashIdx >= 0 ? node['@id'].slice(hashIdx) : null;
    if (producerFragment && producerFragment !== rule.idFragment) {
      return `${canonicalUrl()}${producerFragment}`;
    }
  }
  const identityKeys = {
    Event: ['url', 'name', 'startDate'],
    Offer: ['url', 'sku', 'price', 'priceCurrency', 'category'],
    VideoObject: ['contentUrl', 'embedUrl', 'url', 'name', 'uploadDate'],
  };
  const identity = (identityKeys[type] ?? [])
    .map((key) => node[key])
    .filter((value) => value != null && value !== '');
  if (identity.length === 0) return pageScopedId(type);
  const identityText = identity.join('|');
  const slug = identityText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
  let hash = 0;
  for (let i = 0; i < identityText.length; i += 1) {
    hash = (hash * 31 + identityText.charCodeAt(i)) % 2147483647;
  }
  return `${canonicalUrl()}${rule.idFragment}-${slug}-${hash.toString(36)}`;
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
    } catch { /* noop */ }
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

export function remapReferences(value, remap) {
  if (Array.isArray(value)) {
    value.forEach((item) => remapReferences(item, remap));
    return;
  }
  if (!value || typeof value !== 'object') return;
  if (typeof value['@id'] === 'string' && remap.has(value['@id'])) {
    value['@id'] = remap.get(value['@id']);
  }
  for (const [key, val] of Object.entries(value)) {
    if (key === '@id') continue;
    remapReferences(val, remap);
  }
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
  const itemKey = (item) => (
    item && typeof item === 'object' ? item['@id'] ?? JSON.stringify(item) : JSON.stringify(item)
  );
  const seen = new Set(arrA.map(itemKey));
  const result = [...arrA];
  for (const item of arrB) {
    const key = itemKey(item);
    if (!seen.has(key)) { seen.add(key); result.push(item); }
  }
  return result;
}

function priorityWeight(src) {
  if (src === 'default') return -1;
  if (src === 'runtime') return 1;
  return 0;
}

export function mergeNodes(a, b, srcA, srcB) {
  const aWins = priorityWeight(srcA) >= priorityWeight(srcB);
  const [winner, loser] = aWins ? [a, b] : [b, a];
  const [winnerSrc, loserSrc] = aWins ? [srcA, srcB] : [srcB, srcA];
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
  if (!webpage) return;
  for (const [prop, targetType] of Object.entries(RULES.WebPage.links ?? {})) {
    const target = byType[targetType];
    if (target?.['@id'] && !webpage[prop]) webpage[prop] = { '@id': target['@id'] };
  }
  if (!webpage.mainEntity) {
    const primary = byType.Article ?? byType.NewsArticle ?? byType.SoftwareApplication;
    if (primary?.['@id']) webpage.mainEntity = { '@id': primary['@id'] };
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

export function shouldIgnoreScript(scriptEl, ignoreTypes, textContent = scriptEl.textContent) {
  if (!ignoreTypes || ignoreTypes.size === 0) return false;
  let data;
  try { data = JSON.parse(textContent); } catch { return false; }
  if (!data || typeof data !== 'object') return false;

  const items = asArray(data);
  const hasWrapper = items.some((item) => (
    item && typeof item === 'object' && !Array.isArray(item) && '@graph' in item
  ));
  if (hasWrapper && ignoreTypes.has('graph')) return true;

  const types = flattenPayload(data)
    .map((n) => (typeof n?.['@type'] === 'string' ? n['@type'].toLowerCase() : null))
    .filter(Boolean);
  if (types.length === 0) return false;
  const matched = types.filter((t) => ignoreTypes.has(t));
  if (matched.length === 0) return false;
  if (matched.length < types.length) {
    const kept = types.filter((t) => !matched.includes(t));
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
    this.idRemap = new Map();
    this.queue = [];
    this.observer = null;
    this.isProcessing = false;
    this.ignoreTypes = options.ignoreTypes ?? IGNORE_TYPES;
    this.bootScripts = options.bootScripts;
    this.debouncedRebuild = debounce(() => this.rebuild(), DEBOUNCE_MS);
  }

  init(bootScripts = this.bootScripts) {
    const bootElements = new Set();
    if (bootScripts) {
      for (const { scriptEl, textContent } of bootScripts) {
        bootElements.add(scriptEl);
        this.enqueue(scriptEl, 'bootDom', textContent);
      }
    } else {
      document.querySelectorAll(UNMANAGED_SEL).forEach((el) => this.enqueue(el, 'bootDom'));
    }
    this.observer = new MutationObserver((mutations) => {
      for (const { addedNodes } of mutations) {
        for (const node of addedNodes) this.collect(node);
      }
    });
    this.observer.observe(document.documentElement, { childList: true, subtree: true });
    if (bootScripts) {
      document.querySelectorAll(UNMANAGED_SEL).forEach((el) => {
        if (!bootElements.has(el)) this.enqueue(el, 'runtime', el.textContent, false);
      });
    }
    try {
      this.rebuild({ throwOnError: true });
    } catch (e) {
      this.destroy();
      throw e;
    }
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

  enqueue(scriptEl, source = 'runtime', textContent = scriptEl.textContent, scheduleRebuild = true) {
    if (shouldIgnoreScript(scriptEl, this.ignoreTypes, textContent)) {
      debugLog('ignored', () => ({
        source,
        location: `${scriptEl.parentElement?.tagName ?? 'detached'} > script`,
        payload: textContent.trim().slice(0, 200),
      }));
      return;
    }
    debugLog('enqueue', () => ({
      source,
      location: `${scriptEl.parentElement?.tagName ?? 'detached'} > script`,
      payload: textContent.trim(),
    }));
    this.queue.push({ scriptEl, source, textContent });
    if (source === 'runtime' && scheduleRebuild) this.debouncedRebuild();
  }

  rebuild({ throwOnError = false } = {}) {
    if (this.isProcessing) return false;
    this.isProcessing = true;
    const batch = this.queue.splice(0);
    try {
      debugLog('rebuild', () => ({ batchSize: batch.length, graphSize: this.graph.size }));
      const graph = new Map(
        [...this.graph].map(([id, node]) => [id, JSON.parse(JSON.stringify(node))]),
      );
      const sources = new Map(this.sources);
      const idRemap = new Map(this.idRemap);
      const processedEntries = [];
      for (const entry of batch) {
        const { source, textContent } = entry;
        let nodes;
        try {
          nodes = parsePayloadText(textContent);
        } catch (e) {
          lanaLog(`Failed to parse JSON-LD: ${e.message}`, 'warn');
          continue;
        }
        processedEntries.push(entry);
        debugLog('parsed', () => ({ source, types: nodes.map((n) => n['@type']), nodeCount: nodes.length }));
        for (const raw of nodes) {
          const node = normalizeNode(raw);
          const rawId = raw['@id'];
          if (typeof rawId === 'string' && typeof node['@id'] === 'string' && rawId !== node['@id']) {
            idRemap.set(rawId, node['@id']);
          }
          const inlined = extractInlineEntities(node);
          const toMerge = [node, ...inlined];
          for (const n of toMerge) {
            rewriteCrossPageRefs(n);
            canonicalizeBreadcrumbItems(n);
            canonicalizeReferences(n);
            const id = n['@id'] ?? n['@type'] ?? JSON.stringify(n);
            const prevSrc = sources.get(id) ?? 'bootDom';
            if (graph.has(id)) {
              graph.set(id, mergeNodes(graph.get(id), n, prevSrc, source));
            } else {
              graph.set(id, n);
            }
            if (priorityWeight(source) >= priorityWeight(prevSrc)) {
              sources.set(id, source);
            }
          }
        }
      }
      const { nodes, payload } = this.rewrite(graph, sources, idRemap);
      const replacement = document.createElement('script');
      replacement.type = 'application/ld+json';
      replacement.setAttribute(MANAGED_ATTR, MANAGED_VAL);
      replacement.textContent = payload;
      const managed = document.head.querySelector(MANAGED_SEL);
      if (managed) managed.replaceWith(replacement);
      else document.head.appendChild(replacement);
      for (const { scriptEl } of processedEntries) {
        const parentTagName = scriptEl.parentElement?.tagName ?? 'already detached';
        scriptEl.remove();
        debugLog('removed from DOM', () => parentTagName);
      }
      this.graph = graph;
      this.sources = sources;
      this.idRemap = idRemap;
      debugLog('rewrite', () => ({ nodeCount: nodes.length, graph: nodes }));
      return true;
    } catch (e) {
      lanaLog(`Failed to rebuild JSON-LD graph: ${e.message}`, 'error');
      if (throwOnError) throw e;
      return false;
    } finally {
      this.isProcessing = false;
    }
  }

  rewrite(graph = this.graph, sources = this.sources, idRemap = this.idRemap) {
    const webpageId = pageScopedId('WebPage');
    if (!graph.has(webpageId)) {
      const url = canonicalUrl();
      graph.set(webpageId, { '@type': 'WebPage', '@id': webpageId, url });
      sources.set(webpageId, 'default');
    }
    const org = defaultOrg();
    const orgId = org['@id'];
    if (!graph.has(orgId)) {
      graph.set(orgId, org);
      sources.set(orgId, 'default');
    } else {
      const prevSrc = sources.get(orgId) ?? 'bootDom';
      graph.set(orgId, mergeNodes(org, graph.get(orgId), 'default', prevSrc));
      sources.set(orgId, prevSrc);
    }
    const ratingId = pageScopedId('AggregateRating');
    const rating = graph.get(ratingId);
    if (rating && !aggregateRatingMeetsThresholds(rating)) {
      graph.delete(ratingId);
      sources.delete(ratingId);
      for (const n of graph.values()) {
        if (n.aggregateRating?.['@id'] === ratingId) delete n.aggregateRating;
      }
    }
    const nodes = sortNodes([...graph.values()]);
    if (idRemap.size) {
      for (const node of nodes) {
        for (const [key, val] of Object.entries(node)) {
          if (key === '@id') continue;
          remapReferences(val, idRemap);
        }
      }
    }
    injectLinks(nodes);
    const payload = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, null, 2);
    return { nodes, payload };
  }
}

export default async function init(options = {}) {
  window.miloJsonLd = window.miloJsonLd ?? {};
  if (window.miloJsonLd.manager) return;
  const manager = new JsonLdGraphManager(options);
  manager.init(options.bootScripts);
  window.miloJsonLd.manager = manager;
}
