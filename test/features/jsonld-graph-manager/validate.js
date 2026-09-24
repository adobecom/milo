// Test support: the executable form of the error-severity rules in rules.yaml.
//
// Not a test itself (no assertions) — a pure helper, consumed by
// conformance.test.js (which runs it against the live managed graph) and by
// rules-registry.test.js (which reads CHECKABLE_RULES). It is deliberately pure
// (no DOM, no window, no import of jsonld-graph-manager.js) so it can run over a
// plain parsed graph object.
//
// It covers the structural, machine-checkable subset of the error-severity
// rules (the invariants that hold on any managed graph regardless of producer).
// Behavioural rules (transforms, merge precedence) and producer-eligibility
// rules (required fields per Google rich-result type) are out of scope here:
// the golden cases cover behaviour, and eligibility is a source/authoring concern.
//
// Each predicate is keyed by its rules.yaml `name`; severity is read from the
// rules data so this file never restates it. rules-registry.test.js cross-checks
// that every predicate name is a real rule and that no checkable rule is missing.

// Primary content types that must link back to the page via isPartOf.
const PRIMARY_TYPES = new Set([
  'Article', 'NewsArticle',
  'SoftwareApplication', 'WebApplication', 'MobileApplication', 'VideoGame',
]);

// Mirrors aggregaterating-min-rating-* in rules.yaml.
const AGGREGATE_RATING_MIN_VALUE = 4.0;
const AGGREGATE_RATING_MIN_COUNT = 100;

const isObject = (v) => v != null && typeof v === 'object' && !Array.isArray(v);
const isPureRef = (v) => isObject(v) && Object.keys(v).length === 1 && typeof v['@id'] === 'string';

function collectPureRefs(value, acc) {
  if (Array.isArray(value)) { value.forEach((item) => collectPureRefs(item, acc)); return; }
  if (!isObject(value)) return;
  if (isPureRef(value)) acc.push(value['@id']);
  for (const val of Object.values(value)) collectPureRefs(val, acc);
}

function buildContext(graph) {
  const wrapper = Array.isArray(graph) ? { '@graph': graph } : (graph ?? {});
  const nodes = Array.isArray(wrapper['@graph']) ? wrapper['@graph'] : [];
  const byType = new Map();
  const ids = new Set();
  for (const node of nodes) {
    if (typeof node['@id'] === 'string') ids.add(node['@id']);
    const type = node['@type'];
    if (typeof type === 'string') {
      if (!byType.has(type)) byType.set(type, []);
      byType.get(type).push(node);
    }
  }
  const typed = (...types) => types.flatMap((t) => byType.get(t) ?? []);
  return { wrapper, nodes, byType, ids, typed };
}

// Each predicate returns an array of { message, nodeId? } for its rule.
const PREDICATES = {
  'graph-container-shape': ({ wrapper }) => {
    const out = [];
    if (wrapper['@context'] !== 'https://schema.org') out.push({ message: '@context must be "https://schema.org"' });
    if (!Array.isArray(wrapper['@graph'])) out.push({ message: '@graph must be an array' });
    return out;
  },

  'no-per-node-context': ({ nodes }) => nodes
    .filter((n) => '@context' in n)
    .map((n) => ({ nodeId: n['@id'], message: 'node carries its own @context' })),

  'all-nodes-have-id': ({ nodes }) => nodes
    .filter((n) => typeof n['@id'] !== 'string' || n['@id'] === '')
    .map((n) => ({ message: `node of @type "${n['@type']}" has no @id` })),

  'unique-node-ids': ({ nodes }) => {
    const seen = new Set();
    const out = [];
    for (const n of nodes) {
      const id = n['@id'];
      if (typeof id === 'string') {
        if (seen.has(id)) out.push({ nodeId: id, message: 'duplicate @id' });
        seen.add(id);
      }
    }
    return out;
  },

  'page-scoped-id-format': ({ nodes }) => nodes
    .filter((n) => typeof n['@id'] === 'string' && !/^https?:\/\/[^#]+#[\w-]+$/.test(n['@id']))
    .map((n) => ({ nodeId: n['@id'], message: '@id is not an absolute URL with a #fragment' })),

  // Every pure { @id } reference must resolve to a node in this graph. This is
  // the dangling-reference guard (the Product->SoftwareApplication transform used
  // to leave Offer.itemOffered pointing at the old #product id).
  'nodes-referenced-by-id': ({ nodes, ids }) => {
    const refs = [];
    for (const node of nodes) {
      for (const [key, val] of Object.entries(node)) {
        if (key !== '@id') collectPureRefs(val, refs);
      }
    }
    return [...new Set(refs)]
      .filter((id) => !ids.has(id))
      .map((id) => ({ nodeId: id, message: 'referenced @id does not resolve to a node in the graph' }));
  },

  'manager-baseline-graph': ({ typed }) => {
    const out = [];
    if (typed('WebPage').length === 0) out.push({ message: 'graph is missing the baseline WebPage node' });
    if (typed('Organization').length === 0) out.push({ message: 'graph is missing the baseline Organization node' });
    return out;
  },

  'webpage-canonical-singleton': ({ typed }) => (typed('WebPage').length > 1
    ? [{ message: `expected at most one WebPage, found ${typed('WebPage').length}` }] : []),

  'organization-singleton': ({ typed }) => (typed('Organization').length > 1
    ? [{ message: `expected at most one Organization, found ${typed('Organization').length}` }] : []),

  'breadcrumblist-singleton': ({ typed }) => (typed('BreadcrumbList').length > 1
    ? [{ message: `expected at most one BreadcrumbList, found ${typed('BreadcrumbList').length}` }] : []),

  'aggregaterating-singleton': ({ typed }) => (typed('AggregateRating').length > 1
    ? [{ message: `expected at most one AggregateRating, found ${typed('AggregateRating').length}` }] : []),

  'webpage-publisher-link': ({ typed }) => typed('WebPage')
    .filter((wp) => !isPureRef(wp.publisher))
    .map((wp) => ({ nodeId: wp['@id'], message: 'WebPage is missing a publisher { @id } link' })),

  'webpage-mainentity-link': ({ typed }) => typed('WebPage')
    .filter((wp) => !isPureRef(wp.mainEntity))
    .map((wp) => ({ nodeId: wp['@id'], message: 'WebPage is missing a mainEntity { @id } link' })),

  'primary-type-ispartof': ({ nodes }) => nodes
    .filter((n) => PRIMARY_TYPES.has(n['@type']) && !isPureRef(n.isPartOf))
    .map((n) => ({ nodeId: n['@id'], message: `${n['@type']} is missing an isPartOf { @id } link` })),

  'breadcrumblist-ispartof': ({ typed }) => typed('BreadcrumbList')
    .filter((bc) => !isPureRef(bc.isPartOf))
    .map((bc) => ({ nodeId: bc['@id'], message: 'BreadcrumbList is missing an isPartOf { @id } link' })),

  'aggregaterating-min-rating-value': ({ typed }) => typed('AggregateRating')
    .filter((ar) => !(Number(ar.ratingValue) >= AGGREGATE_RATING_MIN_VALUE))
    .map((ar) => ({ nodeId: ar['@id'], message: `ratingValue ${ar.ratingValue} is below ${AGGREGATE_RATING_MIN_VALUE}` })),

  'aggregaterating-min-rating-count': ({ typed }) => typed('AggregateRating')
    .filter((ar) => !(Number(ar.ratingCount) >= AGGREGATE_RATING_MIN_COUNT))
    .map((ar) => ({ nodeId: ar['@id'], message: `ratingCount ${ar.ratingCount} is below ${AGGREGATE_RATING_MIN_COUNT}` })),
};

// The set of rule names this validator can mechanically check. Exported so the
// registry test can assert it stays a subset of rules.yaml.
export const CHECKABLE_RULES = Object.keys(PREDICATES);

// validate(graph, rules) -> [{ rule, severity, message, nodeId? }]
// `graph` is the managed wrapper ({ @context, @graph }) or a bare node array.
// `rules` is the parsed rules.yaml array, the source of truth for severity.
export function validate(graph, rules = []) {
  const ctx = buildContext(graph);
  const severityByRule = new Map(rules.map((rule) => [rule.name, rule.severity]));
  const violations = [];
  for (const [name, predicate] of Object.entries(PREDICATES)) {
    const severity = severityByRule.get(name) ?? 'error';
    for (const found of predicate(ctx)) {
      violations.push({ rule: name, severity, ...found });
    }
  }
  return violations;
}
