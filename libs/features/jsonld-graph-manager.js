import { debounce } from '../utils/action.js';

const ORG_ID = 'https://www.adobe.com/#organization';
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
  Organization: { id: ORG_ID, singleton: true },
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
  Product: { idFragment: '#product' },
};

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
  if (rule.id) return rule.id;
  return `${canonicalUrl()}${rule.idFragment}`;
}

export function flattenPayload(data) {
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
  const type = out['@type'];
  if (!type) return out;
  const rule = RULES[type];
  if (!rule) return out;
  out['@id'] = pageScopedId(type);
  return out;
}

export function unionByRef(a, b) {
  const arrA = a ? (Array.isArray(a) ? a : [a]) : [];
  const arrB = b ? (Array.isArray(b) ? b : [b]) : [];
  const seen = new Set(arrA.map((n) => n['@id'] ?? JSON.stringify(n)));
  const result = [...arrA];
  for (const item of arrB) {
    const key = item['@id'] ?? JSON.stringify(item);
    if (!seen.has(key)) { seen.add(key); result.push(item); }
  }
  return result;
}

// TODO(spec §2.4): promote to 4-level table:
//   graph-manager-generated > Milo feature/block > third-party runtime > initial page DOM
// v1 simplification: bootDom (0) < runtime (1).
function priorityWeight(src) { return src === 'runtime' ? 1 : 0; }

export function mergeNodes(a, b, srcA, srcB) {
  const aWins = priorityWeight(srcA) >= priorityWeight(srcB);
  const [winner, loser] = aWins ? [a, b] : [b, a];
  const out = { ...loser, ...winner };
  for (const key of Object.keys(loser)) {
    if (['@type', '@id', '@context'].includes(key)) continue;
    const vW = winner[key];
    const vL = loser[key];
    if (!(key in winner)) { out[key] = vL; continue; }
    if (REF_ARRAY_KEYS.has(key) || Array.isArray(vW) || Array.isArray(vL)) {
      out[key] = unionByRef(vW, vL);
    } else if (vW !== null && vL !== null && typeof vW === 'object' && typeof vL === 'object') {
      out[key] = mergeNodes(vW, vL, srcA, srcB);
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

function isDebugMode() {
  return new URLSearchParams(window.location.search).get('jsonld-graph-manager-debug') === 'true';
}

// eslint-disable-next-line no-console
function debugLog(...args) { if (isDebugMode()) console.debug('[jsonld-graph-manager]', ...args); }

function lanaLog(msg, severity = 'info') {
  window.lana?.log(`JSON-LD: ${msg}`, { tags: 'jsonld-graph-manager', severity });
  const { hostname, search } = window.location;
  if (hostname === 'localhost' || hostname.endsWith('.page') || new URLSearchParams(search).has('lanadebug')) {
    // eslint-disable-next-line no-console
    if (severity === 'error') console.error(`JSON-LD: ${msg}`);
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
        for (const node of addedNodes) this._collect(node);
      }
    });
    this.observer.observe(document.documentElement, { childList: true, subtree: true });

    this.rebuild();
  }

  _collect(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches?.(MANAGED_SEL)) return;
    if (node.matches?.('script[type="application/ld+json"]')) {
      this.enqueue(node, 'runtime');
      return;
    }
    node.querySelectorAll?.(UNMANAGED_SEL).forEach((el) => this.enqueue(el, 'runtime'));
  }

  enqueue(scriptEl, source = 'runtime') {
    debugLog('enqueue', {
      source,
      location: `${scriptEl.parentElement?.tagName ?? 'detached'} > script`,
      payload: scriptEl.textContent.trim(),
    });
    this.queue.push({ scriptEl, source });
    if (source === 'runtime') this.debouncedRebuild();
  }

  rebuild() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      const batch = this.queue.splice(0);
      debugLog('rebuild', { batchSize: batch.length, graphSize: this.graph.size });
      for (const { scriptEl, source } of batch) {
        const nodes = parsePayload(scriptEl);
        debugLog('parsed', { source, types: nodes.map((n) => n['@type']), nodeCount: nodes.length });
        scriptEl.remove();
        debugLog('removed from DOM', scriptEl.parentElement?.tagName ?? 'already detached');
        for (const raw of nodes) {
          const node = normalizeNode(raw);
          const id = node['@id'] ?? node['@type'] ?? JSON.stringify(node);
          if (this.graph.has(id)) {
            const prevSrc = this.sources.get(id) ?? 'bootDom';
            this.graph.set(id, mergeNodes(this.graph.get(id), node, prevSrc, source));
          } else {
            this.graph.set(id, node);
          }
          this.sources.set(id, source);
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
    debugLog('rewrite', { nodeCount: nodes.length, graph: JSON.parse(payload) });
    lanaLog(`Graph rewritten with ${nodes.length} nodes`);
  }
}

export default async function init() {
  if (window.__jsonLdGraphManager) return;
  const manager = new JsonLdGraphManager();
  window.__jsonLdGraphManager = manager;
  manager.init();
}
