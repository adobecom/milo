/* eslint-disable no-use-before-define, no-continue */
import { debounce } from '../utils/action.js';

const MANAGED_ATTR = 'data-milo-jsonld';
const MANAGED_VAL = 'graph';
const MANAGED_SEL = `script[type="application/ld+json"][${MANAGED_ATTR}="${MANAGED_VAL}"]`;
const UNMANAGED_SEL = `script[type="application/ld+json"]:not([${MANAGED_ATTR}="${MANAGED_VAL}"])`;
const DEBOUNCE_MS = 1000;
const REF_ARRAY_KEYS = new Set(['hasPart', 'mainEntity', 'itemListElement']);

// Encoding of the requirements sheet: https://milo.adobe.com/docs/authoring/structured-data-json-ld.json
// Each @type entry describes identity, singleton status, and default linkage edges.
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
  // TODO(spec §2.4): repeatable types get the same canonical id if they lack @id;
  // for v1 they are merged into one entry. Assign sequential ids in a later iteration.
  VideoObject: { idFragment: '#videoobject', repeatable: true },
  Event: { idFragment: '#event' },
  Offer: { idFragment: '#offer', repeatable: true },
};

// Producer-side @type values transformed to canonical types before normalization.
// Adobe.com pages do not market physical products; Product (e.g., from review block,
// merch cards) is rewritten to SoftwareApplication per the product-to-softwareapplication
// requirement.
const TYPE_TRANSFORMS = { Product: 'SoftwareApplication' };

// Defensive canonicalization: producer-supplied @id fragments that should map to the
// canonical site-wide Organization @id.
const ORG_ID_ALIASES = new Set(['#org', '#publisher', '#adobe']);

export function siteRoot(hostname = window.location.hostname) {
  return /business|bacom/i.test(hostname)
    ? 'https://business.adobe.com'
    : 'https://www.adobe.com';
}

export function defaultOrg(hostname) {
  const root = siteRoot(hostname);
  const isBusiness = root.includes('business');
  return {
    '@type': 'Organization',
    '@id': `${root}/#organization`,
    name: isBusiness ? 'Adobe for Business' : 'Adobe',
    url: `${root}/`,
    logo: `${root}/favicon.ico`,
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
  if (Array.isArray(data)) return data;
  if (data['@graph']) return Array.isArray(data['@graph']) ? data['@graph'] : [data['@graph']];
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
  const rule = RULES[type];
  if (!rule) return out;
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

// Walk reference stubs ({ "@id": "..." } with no @type) and rewrite known
// Organization @id aliases to the canonical form. Skips full nodes (which carry @type).
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

// Source priority per spec §2.4: generated (2) > runtime (1) > bootDom (0).
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
  return out;
}

export function injectLinks(nodes) {
  const byType = {};
  for (const node of nodes) {
    if (node['@type'] && !byType[node['@type']]) byType[node['@type']] = node;
  }
  for (const node of nodes) {
    const rule = RULES[node['@type']];
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
      const primary = byType.Article ?? byType.SoftwareApplication;
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

const ENTITY_PROPS = ['publisher', 'author', 'creator', 'provider', 'brand', 'seller', 'offers', 'itemOffered'];

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

export class JsonLdGraphManager {
  constructor() {
    this.graph = new Map();
    this.sources = new Map();
    this.queue = [];
    this.observer = null;
    this.isProcessing = false;
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
          for (const n of toMerge) canonicalizeReferences(n);
          for (const n of toMerge) {
            const id = n['@id'] ?? n['@type'] ?? JSON.stringify(n);
            const prevSrc = this.sources.get(id) ?? 'bootDom';
            if (this.graph.has(id)) {
              this.graph.set(id, mergeNodes(this.graph.get(id), n, prevSrc, source));
            } else {
              this.graph.set(id, n);
            }
            // Track max-priority source so subsequent merges use the right weight.
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
    if (this.graph.size === 0) return;
    // Synthesize a minimal WebPage root when producers haven't emitted one.
    const webpageId = pageScopedId('WebPage');
    if (!this.graph.has(webpageId)) {
      const url = canonicalUrl();
      this.graph.set(webpageId, { '@type': 'WebPage', '@id': webpageId, url });
    }
    // Ensure a canonical Organization is always present. Baseline fields (name, url, logo)
    // take graph-manager-generated priority so they win over any producer-supplied values.
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
