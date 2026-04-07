# HTML Sitemap Generator

A Node.js pipeline that builds localized HTML sitemap pages for Adobe sites and promotes them through DA and AEM.

`README.md` documents the public interface:

- CLI usage
- canonical stages
- required inputs
- output files and directories
- auth/env contract

See [SPEC.md](./SPEC.md) for the behavioral contract behind those stages:

- source-of-truth site and geo inventory
- GNAV and query-index discovery rules
- transform rules and page semantics
- fallback behavior and warning conditions

## Prerequisites

- Node.js 24 or higher

## Setup

```bash
cd .github/workflows/html-sitemap
npm install
```

From the repo root:

```bash
npm --prefix .github/workflows/html-sitemap install
npm --prefix .github/workflows/html-sitemap run typecheck
npm --prefix .github/workflows/html-sitemap run test
```

## Environment

Only `diff`, `push`, `preview`, and `publish` require auth.

```bash
# DA auth for service account / production automation
# Used when no direct DA bearer token override is provided.
ROLLING_IMPORT_IMS_URL=https://...
ROLLING_IMPORT_CLIENT_ID=...
ROLLING_IMPORT_CLIENT_SECRET=...
ROLLING_IMPORT_CODE=...
ROLLING_IMPORT_GRANT_TYPE=authorization_code

# Direct DA bearer token for local/manual runs
DA_SOURCE_TOKEN=...
DA_TOKEN=...

# AEM admin tokens for preview + publish
# Use the raw auth_token cookie value from https://admin.hlx.page/profile
# Resolved per site in this order (first match wins):
#   AEM_ADMIN_TOKEN_ADOBECOM_{SITE}  (e.g. AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM)
#   AEM_ADMIN_TOKEN_{SITE}           (e.g. AEM_ADMIN_TOKEN_DA_BACOM)
#   AEM_ADMIN_TOKEN                  (shared fallback)
#   AEM_TOKEN                        (shared fallback)
#   HLX_ADMIN_TOKEN                  (legacy fallback)
AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM=...
AEM_ADMIN_TOKEN_ADOBECOM_DA_CC=...
```

## CLI

Run help:

```bash
node .github/workflows/html-sitemap/generate.ts --help
```

Usage:

```text
node --env-file=.env generate.ts [stage] [mode] [options]
node --env-file=.env generate.ts --stages <list> [options]
```

`--env-file` is resolved relative to the current shell working directory, not relative to `.github/workflows/html-sitemap/`.

Canonical stage ids:

- `clean`
- `extract`
- `transform-data`
- `transform-da`
- `diff`
- `push`
- `preview`
- `publish`

Convenience shortcuts:

- `transform data` -> `transform-data`
- `transform da` -> `transform-da`
- `transform` -> `transform-data`, then `transform-da`

Rules:

- Positional stage mode and `--stages` are mutually exclusive.
- `--stages` accepts comma-separated canonical stage ids.
- Multi-stage execution order is normalized in code.
- Delivery stages are fail-fast in multi-stage runs:
  - a `push` failure stops the pipeline before `preview` or `publish`
  - a `preview` failure stops the pipeline before `publish`
- No stage selection prints help and exits non-zero.

Options:

- `--config <url|path>`: sitemap config JSON
- `--output <dir>`: local output root
- `--subdomain <name>`: filter to `www` or `business`
- `--geo <prefix>`: filter to a single base geo (development use; see note below)
- `--da-root <path>`: remote DA/AEM document root for `diff`, `push`, `preview`, `publish`
- `--force`: push even if remote content is unchanged (bypasses change detection)
- `--stages <list>`: comma-separated canonical stage ids
- `-h`, `--help`: print help

`--geo default` and `--geo root` both target the empty/root base geo.

`--subdomain` is safe to use in production — subdomains are independent and have separate manifests and output directories.

`--geo` is intended for local development and debugging. Section 2 sibling links are driven by the config `deploy` flag (not disk state), so they are consistent regardless of which geos were extracted. However, the per-subdomain manifest will only reflect the geos generated in that run. Production runs should omit `--geo` to generate complete manifests and let the config `deploy` flag control which pages get promoted.

Examples:

```bash
# Extract + transform locally
node --env-file=.env .github/workflows/html-sitemap/generate.ts extract --subdomain www --geo fr
node --env-file=.env .github/workflows/html-sitemap/generate.ts transform --subdomain www --geo fr

# Explicit multi-stage run
node --env-file=.env .github/workflows/html-sitemap/generate.ts --stages extract,transform-data,transform-da --subdomain business

# Delivery stages
node --env-file=.env .github/workflows/html-sitemap/generate.ts push --subdomain business --geo default --da-root /drafts/hgpa/html-sitemap
node --env-file=.env .github/workflows/html-sitemap/generate.ts preview --subdomain business --geo default --da-root /drafts/hgpa/html-sitemap
node --env-file=.env .github/workflows/html-sitemap/generate.ts publish --subdomain business --geo default --da-root /drafts/hgpa/html-sitemap
```

## Input Contract

The generator reads a multi-sheet JSON config file. Default:

- `https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json`

Override with `--config <url|path>`.

Expected top-level sheets:

- `config`
- `query-index-map`
- `geo-map`
- `page-copy`

The format is compatible with AEM multi-sheet JSON:

- https://www.aem.live/developer/spreadsheets#multi-sheet-format

### `config`

Maps each subdomain to its production domain, host site, and behavior settings.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Short name used as the output directory and filter key (`business`, `www`) |
| `domain` | yes | Production domain (`business.adobe.com`, `www.adobe.com`) |
| `site` | yes | Host site / repo name for AEM origin URLs (`da-bacom`, `da-cc`) |
| `extendedSitemap` | yes | `language` — include only the base geo's mapped extended geos; `all` — include every extended geo in the subdomain |
| `template` | no | DA template filename; defaults to `da-sitemap.html` |

### `query-index-map`

Maps each site to its query-index path.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Subdomain this row belongs to (falls back to `domain` field if absent) |
| `site` | yes | Site / repo name (`da-bacom`, `cc`, `edu`, etc.) |
| `queryIndexPath` | yes | Path to the query-index JSON on the site origin |
| `enabled` | no | Set to `true`, `1`, `yes`, or `on` to include in extraction; defaults to disabled when empty or omitted |

### `geo-map`

Maps each base geo to its language and extended-geo assignments.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Subdomain this row belongs to (falls back to `domain` field if absent) |
| `baseGeo` | no | Geo code for the base geo; empty string or omitted for the root geo |
| `language` | yes | Language code for this base geo (`en`, `fr`, `ja`, etc.) |
| `extendedGeos` | no | Comma-separated list of extended geo codes assigned to this base geo |
| `deploy` | no | Set to `true` to mark this geo for deployment; defaults to disabled when empty or omitted |

`deploy` controls two things:

- **Section 2 links**: only geos marked `deploy: true` appear in the "Other Sitemaps" section of any page, preventing links to pages that don't exist in production
- **Delivery stages**: `push`, `preview`, and `publish` only promote geos marked `deploy: true`

All geos are still extracted and transformed regardless of `deploy` status. This preserves full data, manifests, and the ability to inspect any geo locally.

### `page-copy`

Maps each base geo to render-time page strings.

| Field | Required | Description |
|-------|----------|-------------|
| `subdomain` | yes | Subdomain this row belongs to (falls back to `domain` field if absent) |
| `baseGeo` | no | Geo code; empty string or omitted for the root geo |
| `pageTitle` | yes | Page `<h1>` and metadata title; defaults to `Sitemap` if row is missing |
| `pageDescription` | yes | Metadata description |
| `otherSitemapsHeading` | no | Section 2 heading (sibling sitemaps) |
| `extendedPagesHeading` | no | Section 3 heading (extended geos) |

Page-copy strings may contain `{{variable}}` placeholders resolved from the extracted placeholder map. `pageTitle`, `pageDescription`, and `locale` are exposed directly to the DA template.

### Example

```json
{
  "config": {
    "data": [
      { "subdomain": "business", "domain": "business.adobe.com", "site": "da-bacom", "extendedSitemap": "all" },
      { "subdomain": "www", "domain": "www.adobe.com", "site": "da-cc", "extendedSitemap": "language", "template": "da-sitemap.html" }
    ]
  },
  "query-index-map": {
    "data": [
      { "subdomain": "business", "site": "da-bacom", "queryIndexPath": "/query-index.json" },
      { "subdomain": "www", "site": "cc", "queryIndexPath": "/cc-shared/assets/query-index.json", "enabled": "false" }
    ]
  },
  "geo-map": {
    "data": [
      { "subdomain": "business", "baseGeo": "", "language": "en", "extendedGeos": "ca, nl" },
      { "subdomain": "business", "baseGeo": "fr", "language": "fr", "extendedGeos": "ca_fr, ch_fr", "deploy": "true" }
    ]
  },
  "page-copy": {
    "data": [
      { "subdomain": "business", "baseGeo": "", "pageTitle": "Sitemap", "pageDescription": "Browse pages across this site by section, locale, and region.", "otherSitemapsHeading": "Other Regions", "extendedPagesHeading": "Additional Localized Pages" }
    ]
  }
}
```

See [SPEC.md](./SPEC.md#source-inventory) for the live catalog snapshots showing current site and geo data.

## Output Contract

All stages read and write under a single local output root. Default:

- `tmp/html-sitemap`

Paths below are relative to that root.

Representative layout:

```text
/html-sitemap
  html-sitemap.json
    /business
      /_extract
        /gnav
          gnav.html
          products.html
          manifest.json
        regions.html
        placeholders.json
        /da-bacom
          query-index.json
    sitemap.json
    sitemap.html
    manifest.json
    manifest.csv
    /fr
      /_extract
        /gnav
          gnav.html
          manifest.json
        regions.html
        placeholders.json
        /da-bacom
          query-index.json
        /extended
          /ca_fr
            /da-bacom
              query-index.json
      sitemap.json
      sitemap.html
```

### File Formats

`html-sitemap.json`

- Local copy of the resolved config input
- Written by `extract`

`_extract/gnav/*.html`

- Raw GNAV fragment HTML persisted from source `.plain.html`
- Written by `extract`

`_extract/gnav/manifest.json`

- Directory-level manifest for persisted GNAV artifacts
- Maps local files back to source provenance and fragment role
- Written by `extract`

`_extract/placeholders.json`

- Raw placeholders payload used later by transform
- Written by `extract`

`_extract/regions.html`

- Raw region-nav fragment HTML fetched from the host site's regions fragment
- Written by `extract`
- Used by `transform-data` to derive display labels for section 2 (other sitemaps) and section 3 (extended geos)
- Contains `<a>` elements whose `href` maps to a geo prefix and whose link text provides the authored geo label
- Any trailing ` - <language>` suffix in the link text is stripped before use
- Falls back to `Intl.DisplayNames`-generated labels when the fragment is unavailable or a geo is not represented

`_extract/**/query-index.json`

- Raw query-index payloads fetched per site and geo
- Written by `extract`

`sitemap.json`

- Normalized intermediate data for one sitemap page
- Written by `transform-data`
- Consumed by `transform-da`
- Defines the render contract for the final sitemap page
- Uses extracted `regions.html` labels for `otherSitemapLinks[*].title` and `extendedGeoLinks[*].title` when available, stripping any trailing ` - <language>` suffix

Shape:

```json
{
  "subdomain": "business",
  "baseGeo": "",
  "domain": "business.adobe.com",
  "sections": {
    "baseGeoLinks": [
      {
        "heading": "Products",
        "groups": [
          {
            "subheading": "Featured",
            "links": [{ "title": "Adobe Commerce", "url": "https://business.adobe.com/products/commerce", "path": "/products/commerce" }]
          }
        ]
      }
    ],
    "otherSitemapLinks": [
      { "geo": "fr", "title": "France", "url": "https://business.adobe.com/fr/sitemap.html" }
    ],
    "extendedGeoLinks": [
      {
        "geo": "br",
        "title": "Brazil",
        "links": [{ "title": "Adobe Firefly", "url": "https://business.adobe.com/br/products/firefly", "path": "/br/products/firefly" }]
      }
    ]
  }
}
```

| Section | Structure |
|---------|-----------|
| `baseGeoLinks` | Array of GNAV sections, each with a `heading` and `groups[]` of `{ subheading, links[] }` |
| `otherSitemapLinks` | Flat array of `{ geo, title, url }` for sibling sitemap pages |
| `extendedGeoLinks` | Array of `{ geo, title, links[] }` groups for extended-geo pages |

Each `link` has `title`, `url` (canonical production URL), and `path` (URL pathname).

`sitemap.html`

- DA-compatible HTML source document for one sitemap page
- Written by `transform-da`
- Consumed by `push`, `preview`, and `publish`
- This HTML document is the reference render output for the generator
- The editable template at `templates/da-sitemap.html` is the primary DA page reference
- Template selection may be set per subdomain in the `config` sheet; if omitted it defaults to `da-sitemap.html`
- See [Template Language](#template-language) for the template syntax reference

The rendered HTML includes `data-*` attributes on iterated elements for monitoring and programmatic access:

| Attribute | Location | Value |
|-----------|----------|-------|
| `data-section-index` | GNAV section container (`baseGeoLinks`) | Zero-based section index |
| `data-link-index` | Individual `<a>` elements within sections and extended geo groups | Zero-based link index within its parent loop |
| `data-geo-index` | Sibling sitemap `<a>` elements (`otherSitemapLinks`) | Zero-based geo index |
| `data-group-index` | Extended geo group container (`extendedGeoLinks`) | Zero-based group index |

These attributes are stable for the same inputs and can be used to locate specific items by position without parsing the full DOM.

`manifest.json`

- Per-subdomain build manifest summarizing every generated page
- Written by `transform-da` at `{subdomain}/manifest.json`
- Deterministic: same inputs always produce the same manifest, safe to diff across runs
- Diffing two manifests reveals which pages changed (hash differs), were added, or removed

Top-level shape:

```json
{
  "subdomain": "business",
  "pageCount": 11,
  "pages": [
    {
      "baseGeo": "",
      "domain": "business.adobe.com",
      "deploy": true,
      "sha256": "a1b2c3d4...",
      "baseGeoSectionCount": 6,
      "baseGeoLinkCount": 42,
      "otherSitemapLinkCount": 10,
      "extendedGeoGroupCount": 3,
      "extendedGeoLinkCount": 15,
      "totalLinkCount": 67
    }
  ]
}
```

Page entry fields:

| Field | Meaning |
|-------|---------|
| `baseGeo` | Geo code for this page (empty string = root) |
| `domain` | Production domain |
| `deploy` | Whether this geo is marked for deployment in `geo-map` |
| `sha256` | SHA-256 hash of the `sitemap.html` content (UTF-8 bytes) |
| `baseGeoSectionCount` | Number of GNAV navigation sections (section 1 groups) |
| `baseGeoLinkCount` | Total links across all section 1 groups |
| `otherSitemapLinkCount` | Number of sibling sitemap links (section 2) |
| `extendedGeoGroupCount` | Number of extended geo groups (section 3) |
| `extendedGeoLinkCount` | Total links across all section 3 groups |
| `totalLinkCount` | Sum of all link counts |

Pages are sorted by `baseGeo` for stable ordering. Pages that were skipped (no `sitemap.html`) are excluded.

`manifest.csv`

- CSV mirror of the `manifest.json` pages array
- Written by `transform-da` at `{subdomain}/manifest.csv`
- One header row followed by one row per page, same sort order as JSON
- Intended for stakeholders who prefer tabular data over JSON

## Stage Contract

### `clean`

Reads:

- nothing

Writes:

- removes the local `--output` directory

Conditions:

- local-only
- does not remove anything from DA or AEM

### `extract`

Reads:

- config from `--config`
- remote GNAV, placeholders, and query-index sources

Writes:

- `html-sitemap.json`
- `_extract/gnav/*.html`
- `_extract/gnav/manifest.json`
- `_extract/regions.html`
- `_extract/placeholders.json`
- `_extract/**/query-index.json`

Conditions that affect output:

- A base geo gets local output only if at least one base-geo query index succeeds and returns indexable rows.
- Extended-geo query indices are written under the owning base geo’s `_extract/extended/...`.
- Paginated query-index responses are fully fetched using `total`, `offset`, and `limit` before the merged payload is written locally.
- Region-nav fragment extraction is best-effort and may warn/skip without aborting extraction.
- Missing remote resources warn and continue.

### `transform-data`

Reads:

- previously extracted `_extract` artifacts for each eligible base geo

Writes:

- `sitemap.json`

Conditions that affect output:

- runs only for base geos that already have eligible extracted input
- sibling sitemap links include only base geos marked `deploy: true` in the config, regardless of local disk state
- extended-geo links are subject to deduplication and `extendedSitemap` rules
- geo labels for section 2 and section 3 prefer extracted `regions.html` link text and strip any trailing ` - <language>` suffix before falling back to generated labels

### `transform-da`

Reads:

- `sitemap.json`

Writes:

- `sitemap.html`
- `manifest.json` (per subdomain)
- `manifest.csv` (per subdomain)

Conditions that affect output:

- runs only where `sitemap.json` exists
- output is a DA HTML source document, not a DA-specific JSON format
- render semantics come from `sitemap.json` plus the DA page shell, not from old browser-specific sitemap blocks
- page copy comes from the `page-copy` sheet and can resolve `{{variable}}` placeholders against extracted placeholders data

### `diff`

Reads:

- local `sitemap.html` for each eligible geo
- remote DA source document at the corresponding `--da-root` path

Writes:

- nothing (read-only comparison)
- prints per-geo status: `changed`, `unchanged`, or `new` (not yet in DA)

Conditions that affect output:

- requires `--da-root`
- requires DA auth env vars
- skips geos with no local `sitemap.html`
- skips geos not marked `deploy: true` in `geo-map`
- compares the SHA-256 hash of local content against remote content fetched from DA
- a missing remote document is reported as `new`, not as an error

This stage is a dry-run companion to `push` — it shows what would change without writing anything. In multi-stage runs, `diff` can precede `push` to log which pages will be updated.

### `push`

Reads:

- local `sitemap.html`
- remote DA source document (for change detection)

Writes:

- remote DA source document rooted at `--da-root`
- DA edit URLs for uploaded documents in stage output

Conditions that affect output:

- requires `--da-root`
- requires DA auth env vars
- skips geos with no local `sitemap.html`
- skips geos not marked `deploy: true` in `geo-map`
- compares local content hash against remote before uploading; skips unchanged pages to preserve remote document timestamps
- `--force` bypasses the change detection and always uploads

### `preview`

Reads:

- local `sitemap.html` to determine which geos are eligible

Writes:

- AEM preview state for the corresponding remote document path under `--da-root`
- `.page` URLs for previewed documents in stage output

Conditions that affect output:

- requires `--da-root`
- requires AEM admin token env vars
- skips geos with no local `sitemap.html`
- skips geos not marked `deploy: true` in `geo-map`

### `publish`

Reads:

- local `sitemap.html` to determine which geos are eligible

Writes:

- AEM live/publish state for the corresponding remote document path under `--da-root`
- `.live` URLs for published documents in stage output

Conditions that affect output:

- requires `--da-root`
- requires AEM admin token env vars
- skips geos with no local `sitemap.html`
- skips geos not marked `deploy: true` in `geo-map`

## Template Language

The DA template at `templates/da-sitemap.html` uses a lightweight template language evaluated by `lib/render/template.ts` over the normalized render model derived from `sitemap.json`.

The syntax is a subset of [Handlebars](https://handlebarsjs.com/). Any valid template for this generator is also valid Handlebars, but only the features below are supported:

| Handlebars feature | Supported |
|--------------------|-----------|
| `{{value}}` interpolation | yes |
| `{{#if}}...{{/if}}` | yes |
| `{{else}}` | yes |
| `{{#unless}}...{{/unless}}` | yes |
| `{{#each}}...{{/each}}` | yes |
| `{{@index}}` / `{{@key}}` | yes |
| `{{.}}` / `{{this}}` | yes |
| Dot notation `{{a.b}}` | yes |
| HTML escaping by default | yes |
| `{{{raw}}}` triple-stash (no escape) | no |
| Partials `{{> partial}}` | no |
| Helpers `{{formatDate x}}` | no |

### Syntax

| Pattern | Behavior |
|---------|----------|
| `{{key}}` | Value interpolation, HTML-escaped |
| `{{key.nested}}` | Dot-notation property access |
| `{{.}}` or `{{this}}` | Current scope reference |
| `{{#if key}}...{{/if}}` | Conditional block |
| `{{#if key}}...{{else}}...{{/if}}` | Conditional with else branch |
| `{{#unless key}}...{{/unless}}` | Inverted conditional (renders when falsy) |
| `{{#each key}}...{{/each}}` | Iteration block |
| `{{@index}}` | Zero-based iteration index (inside `#each`) |
| `{{@key}}` | String key of current iteration item (inside `#each`) |

### Scope chain

- The root scope is the render model object
- Each `#each` iteration pushes the current array item as a new scope
- Lookups traverse inner-to-outer: a key in the current `#each` item shadows the same key in the parent scope
- Parent scope values remain accessible from nested blocks

### Truthiness

- Arrays: truthy when non-empty
- All other values: `Boolean(value)`

### Escaping

- All interpolated scalar values are HTML-escaped: `&`, `<`, `>`, `"`, `'`
- Literal HTML in the template (text nodes) is not escaped

### Standalone control lines

Lines containing only a control tag (`#if`, `/if`, `#each`, `/each`) plus optional whitespace are stripped from output to prevent blank lines.

### Error behavior

- Mismatched or missing closing tags throw
- `#each` on a non-array value warns and produces empty output
- Rendering an object as a scalar throws

## Package Layout

Implementation modules are grouped shallowly by responsibility:

- `lib/planning/`: config parsing, unit planning, and output availability
- `lib/extract/`: raw GNAV, placeholders, and query-index extraction
- `lib/transform/`: normalized sitemap data and DA HTML rendering
- `lib/delivery/`: DA upload and AEM preview/publish integration
- `lib/`: shared helpers used across those areas

## GitHub Actions Inputs

The workflow should expose the same interface as the CLI:

- `stages`
- `config`
- `output`
- `subdomain`
- `geo`
- `da-root`

## Related

- [SPEC.md](./SPEC.md)
- [Preview Indexer](../preview-indexer/README.md)
- [Federal repo](https://github.com/adobecom/federal)

## License

See the repository root LICENSE file.
