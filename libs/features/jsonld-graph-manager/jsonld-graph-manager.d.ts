/**
 * A JSON-LD node — the base unit of the graph.
 * All schema.org entities are represented as `JsonLdNode` objects.
 * Top-level `@context` is stripped during normalization; it only
 * appears in the final serialized output at the `@graph` wrapper level.
 */
export interface JsonLdNode {
  '@type'?: string;
  '@id'?: string;
  '@context'?: string | Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Where a node entered the graph.
 * Priority order (highest to lowest): runtime > bootDom > default.
 * `mergeNodes` uses this to decide which side wins scalar conflicts.
 */
export type NodeSource = 'default' | 'bootDom' | 'runtime';

/** Immutable boot-time copy of a producer script and its captured payload. */
export interface BootScriptSnapshot {
  scriptEl: HTMLScriptElement;
  textContent: string;
}

/** Options accepted by `JsonLdGraphManager`. */
export interface GraphManagerOptions {
  /**
   * Node types (lowercase) whose source scripts are skipped entirely.
   * Defaults to the value of `parseIgnoreParam()` at module load time.
   */
  ignoreTypes?: Set<string>;
  /** Boot producer scripts captured before deferred manager initialization. */
  bootScripts?: BootScriptSnapshot[];
}

/**
 * Returns the canonical site root for the supplied hostname, or for the
 * canonical page hostname when omitted.
 * Business/bacom hostnames resolve to `https://business.adobe.com`;
 * everything else resolves to `https://www.adobe.com`.
 */
export function siteRoot(hostname?: string): string;

/**
 * Returns `true` when an `AggregateRating` node clears the minimum
 * thresholds (ratingValue ≥ 4.0, ratingCount ≥ 100).
 * Nodes that fail are pruned from the graph during `rewrite()`.
 */
export function aggregateRatingMeetsThresholds(node: JsonLdNode | null | undefined): boolean;

/**
 * Returns a minimal `Organization` node for the Adobe brand entity
 * corresponding to `siteRoot(hostname)`.
 * This is the fallback injected by `rewrite()` when no Organization
 * is present in the page's own JSON-LD.
 */
export function defaultOrg(hostname?: string): JsonLdNode;

/**
 * Returns the canonical page URL derived from the `<link rel="canonical">`
 * tag, stripped of query string and fragment.
 * Falls back to `location.origin + location.pathname`.
 */
export function canonicalUrl(): string;

/**
 * Returns the canonical `@id` for a given schema.org type based on
 * the rules registry. Site-scoped types (e.g. `Organization`) use the
 * site root; page-scoped types append their fragment to `canonicalUrl()`.
 * Returns `null` for unregistered types.
 */
export function pageScopedId(type: string): string | null;

/**
 * Recursively flattens a raw JSON-LD payload into a flat array of nodes.
 * Handles plain objects, arrays, and `@graph` wrappers.
 * `@context` properties on wrapper objects are discarded.
 */
export function flattenPayload(data: unknown): JsonLdNode[];

/**
 * Parses and flattens the JSON-LD content of a `<script>` element.
 * Parse errors are logged via `lana` and return an empty array.
 */
export function parsePayload(scriptEl: HTMLScriptElement): JsonLdNode[];

/**
 * Normalises a single node before it enters the graph:
 * - strips `@context`
 * - applies `TYPE_TRANSFORMS` (e.g. `Product` → `SoftwareApplication`)
 * - rewrites `@id` to the canonical page-scoped value for registered types
 * - preserves producer fragments or derives stable IDs on repeatable types
 */
export function normalizeNode(node: JsonLdNode): JsonLdNode;

/**
 * Rewrites a known Organization `@id` alias (e.g. `#org`, `#publisher`,
 * `#adobe`) to the canonical `/#organization` form.
 * Non-string values and unrecognised fragments are returned unchanged.
 */
export function canonicalizeOrgId(id: unknown): unknown;

/**
 * Walks all nested reference objects (`{ @id }` without `@type`) inside
 * `node` and canonicalizes any Organization `@id` aliases via
 * `canonicalizeOrgId`.
 */
export function canonicalizeReferences(node: JsonLdNode): void;

/**
 * Rewrites `itemListElement[].item` URLs in a `BreadcrumbList` node so
 * that origins matching the current non-canonical origin are replaced with
 * the canonical origin from `<link rel="canonical">`.
 * No-ops for non-BreadcrumbList nodes or when no canonical link exists.
 */
export function canonicalizeBreadcrumbItems(node: JsonLdNode): void;

/**
 * Recursively walks `value` and replaces any nested `{ @id }` reference whose
 * value appears as a key in `remap` with the remapped value.
 *
 * Producer payloads frequently cross-reference a node by its original `@id`
 * (e.g. an inline `Offer`'s `itemOffered` points at the parent `Product` id).
 * Once normalization rewrites that node's `@id` — most notably the
 * `Product` → `SoftwareApplication` transform — those back-references would
 * otherwise dangle. This remaps the references so they keep resolving.
 *
 * The node's own top-level `@id` is intentionally skipped: we remap
 * references, not identities, so a node is never aliased to another.
 */
export function remapReferences(value: unknown, remap: Map<string, string>): void;

/**
 * Rewrites `isPartOf` and `mainEntityOfPage` properties that contain an
 * inline `WebPage` object (or a `#webpage`-suffixed `@id` ref) to a
 * canonical `{ @id }` reference using the current `pageScopedId('WebPage')`.
 */
export function rewriteCrossPageRefs(node: JsonLdNode): void;

/**
 * Returns the union of two node-reference arrays by `@id` (falling back
 * to `JSON.stringify` for anonymous nodes).
 * Items already present in `a` are deduplicated; new items from `b` are appended.
 */
export function unionByRef(a: unknown, b: unknown): unknown[];

/**
 * Merges two nodes that share the same `@id` into one, using `srcA`/`srcB`
 * priority to resolve scalar conflicts (runtime > bootDom > default).
 * Array-valued properties and `REF_ARRAY_KEYS` are merged via `unionByRef`.
 * Nested object values are merged recursively.
 * When both types include a `SoftwareApplication` subtype, the more specific
 * subtype is preserved on the output.
 */
export function mergeNodes(a: JsonLdNode, b: JsonLdNode, srcA: NodeSource, srcB: NodeSource): JsonLdNode;

/**
 * Injects cross-entity `@id` links between nodes in the graph:
 * - `linksBack` rules add properties (e.g. `isPartOf`, `publisher`) to nodes
 *   that reference other types already present in the graph
 * - `WebPage.links` adds forward references (e.g. `publisher`, `breadcrumb`)
 * - `WebPage.mainEntity` is set to the first `Article`/`NewsArticle`/
 *   `SoftwareApplication` found if not already present
 *
 * Mutates `nodes` in place.
 */
export function injectLinks(nodes: JsonLdNode[]): void;

/**
 * Lifts embedded entities (matching `ENTITY_PROPS`) out of `node` into
 * their own top-level graph nodes. The inline value is replaced with a
 * `{ @id }` reference stub.
 * Returns the array of extracted nodes.
 */
export function extractInlineEntities(node: JsonLdNode): JsonLdNode[];

/**
 * Parses the `jsonld-graph-manager-ignore` query parameter from `search`
 * into a lowercased `Set` of type names (and the pseudo-type `"graph"`).
 * Returns an empty set when the parameter is absent.
 */
export function parseIgnoreParam(search?: string): Set<string>;

/**
 * Returns `true` when a `<script>` element should be skipped based on
 * the `ignoreTypes` set:
 * - The pseudo-type `"graph"` short-circuits: if the script contains any
 *   `@graph` wrapper (directly or as a top-level array element) and `"graph"`
 *   is on the ignore list, the whole script is bypassed with no further
 *   analysis.
 * - Otherwise the script is skipped when every type it contains is ignored.
 *   Type-name matching recurses into `@graph` wrappers via `flattenPayload`,
 *   so an ignored type matches whether it appears at top level or inside a
 *   wrapped graph.
 * - Mixed-type scripts (some ignored, some not) are skipped entirely with a
 *   `lana` warn rather than partially processed, so the caller can split the
 *   producer into separate scripts or use `"graph"` to bypass intentionally.
 */
export function shouldIgnoreScript(
  scriptEl: HTMLScriptElement,
  ignoreTypes: Set<string>,
  textContent?: string,
): boolean;

/** Single entry in the processing queue. */
interface QueueEntry {
  scriptEl: HTMLScriptElement;
  source: NodeSource;
  textContent: string;
}

/**
 * Singleton manager that owns the page-level JSON-LD graph.
 *
 * Lifecycle:
 * 1. `new JsonLdGraphManager(options?)` — allocates the instance
 * 2. `manager.init()` — scans existing DOM scripts and starts the
 *    `MutationObserver` to pick up runtime additions
 * 3. `manager.destroy()` — disconnects the observer (used in tests)
 *
 * Exposed as `window.miloJsonLd.manager` after `init()` runs.
 */
export class JsonLdGraphManager {
  /** Live graph: canonical `@id` (or `@type` fallback) → node */
  graph: Map<string, JsonLdNode>;
  /** Tracks the winning `NodeSource` for each graph key */
  sources: Map<string, NodeSource>;
  /** Maps pre-normalisation `@id` values to their post-normalisation form */
  idRemap: Map<string, string>;
  /** Pending script elements awaiting the next `rebuild()` pass */
  queue: QueueEntry[];
  /** Active DOM observer; `null` after `destroy()` */
  observer: MutationObserver | null;
  /** Prevents re-entrant `rebuild()` calls */
  isProcessing: boolean;
  /** Type names (lowercase) whose scripts are silently skipped */
  ignoreTypes: Set<string>;
  /** Immutable producer snapshots captured before deferred initialization. */
  bootScripts?: BootScriptSnapshot[];

  constructor(options?: GraphManagerOptions);

  /**
   * Bootstraps the manager: enqueues all pre-existing unmanaged JSON-LD
   * scripts from a supplied boot snapshot (or the DOM), attaches the
   * `MutationObserver`, and triggers the first transactional `rebuild()`.
   */
  init(bootScripts?: BootScriptSnapshot[]): void;

  /** Disconnects the `MutationObserver`. Safe to call multiple times. */
  destroy(): void;

  /**
   * Called by the `MutationObserver` for each added DOM node.
   * Enqueues matching `<script type="application/ld+json">` elements;
   * ignores the managed output script.
   */
  collect(node: Node): void;

  /**
   * Adds a script element to the queue.
   * Observed runtime additions trigger a debounced `rebuild()`; initialization
   * entries disable scheduling and use the explicit `rebuild()` at the end of `init()`.
   */
  enqueue(
    scriptEl: HTMLScriptElement,
    source?: NodeSource,
    textContent?: string,
    scheduleRebuild?: boolean,
  ): void;

  /**
   * Drains the queue into temporary state, normalises and merges its nodes,
   * then atomically replaces the managed script and commits state. Source
   * scripts and the previous graph are preserved when processing fails.
   * Re-entrant calls are dropped via `isProcessing`.
   */
  rebuild(options?: { throwOnError?: boolean }): boolean;

  /**
   * Finalises the graph and serialises it into the single managed
   * `<script type="application/ld+json" data-milo-jsonld="graph">` tag:
   * - ensures `WebPage` and `Organization` are always present
   * - prunes `AggregateRating` nodes that fail quality thresholds
   * - preserves producer Offers without synthesizing commercial data
   * - applies `idRemap` to fix dangling back-references
   * - calls `injectLinks` to wire cross-entity relationships
   * - sorts output nodes into a stable canonical order
   */
  rewrite(
    graph?: Map<string, JsonLdNode>,
    sources?: Map<string, NodeSource>,
    idRemap?: Map<string, string>,
  ): { nodes: JsonLdNode[]; payload: string };
}

/**
 * Feature entry point loaded by the Milo feature loader.
 * Creates a `JsonLdGraphManager`, stores it at `window.miloJsonLd.manager`,
 * and calls `manager.init()`. No-ops on repeat calls (idempotent).
 */
export default function init(options?: GraphManagerOptions): Promise<void>;
