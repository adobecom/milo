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

Only `push`, `preview`, and `publish` require auth.

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
- `--domain <name>`: filter to `www` or `business`
- `--geo <prefix>`: filter to a single base geo
- `--da-root <path>`: remote DA/AEM document root for `push`, `preview`, `publish`
- `--stages <list>`: comma-separated canonical stage ids
- `-h`, `--help`: print help

`--geo default` and `--geo root` both target the empty/root base geo.

Examples:

```bash
# Extract + transform locally
node --env-file=.env .github/workflows/html-sitemap/generate.ts extract --domain www --geo fr
node --env-file=.env .github/workflows/html-sitemap/generate.ts transform --domain www --geo fr

# Explicit multi-stage run
node --env-file=.env .github/workflows/html-sitemap/generate.ts --stages extract,transform-data,transform-da --domain business

# Delivery stages
node --env-file=.env .github/workflows/html-sitemap/generate.ts push --domain business --geo default --da-root /drafts/hgpa/html-sitemap
node --env-file=.env .github/workflows/html-sitemap/generate.ts preview --domain business --geo default --da-root /drafts/hgpa/html-sitemap
node --env-file=.env .github/workflows/html-sitemap/generate.ts publish --domain business --geo default --da-root /drafts/hgpa/html-sitemap
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

Expected roles:

- `config`: subdomain, production domain, host site, extended sitemap mode, optional DA template name
- `query-index-map`: per-site query-index path inventory with optional `enabled` opt-out
- `geo-map`: base geos, languages, and extended-geo mappings
- `page-copy`: base-geo page title, description, and section headings

The format is compatible with AEM multi-sheet JSON:

- https://www.aem.live/developer/spreadsheets#multi-sheet-format

Example:

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
      { "subdomain": "business", "baseGeo": "fr", "language": "fr", "extendedGeos": "ca_fr, ch_fr" }
    ]
  },
  "page-copy": {
    "data": [
      { "subdomain": "business", "baseGeo": "", "pageTitle": "Sitemap", "pageDescription": "Browse pages across this site by section, locale, and region.", "otherSitemapsHeading": "Other Regions", "extendedPagesHeading": "Additional Localized Pages" }
    ]
  }
}
```

See [SPEC.md](./SPEC.md#scope) for the current live inventory and meaning of those sheets.

`pageTitle`, `pageDescription`, and `locale` are exposed directly to the DA template. The metadata block in `templates/da-sitemap.html` is authored explicitly from those values rather than being assembled from prebuilt metadata rows in code.

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

- Raw region-nav fragment HTML used later for geo display labels
- Written by `extract`

`_extract/**/query-index.json`

- Raw query-index payloads fetched per site and geo
- Written by `extract`

`sitemap.json`

- Normalized intermediate data for one sitemap page
- Written by `transform-data`
- Consumed by `transform-da`
- Defines the render contract for the final sitemap page
- Uses extracted `regions.html` labels for `otherSitemapLinks[*].title` and `extendedGeoLinks[*].title` when available, stripping any trailing ` - <language>` suffix

Current top-level shape:

```json
{
  "subdomain": "business",
  "baseGeo": "",
  "domain": "business.adobe.com",
  "sections": {
    "baseGeoLinks": [],
    "otherSitemapLinks": [],
    "extendedGeoLinks": []
  }
}
```

`sitemap.html`

- DA-compatible HTML source document for one sitemap page
- Written by `transform-da`
- Consumed by `push`, `preview`, and `publish`
- This HTML document is the reference render output for the generator
- Old browser-specific sitemap blocks are not the normative contract here
- The editable template at `templates/da-sitemap.html` is the primary DA page reference
- The template supports simple `{{value}}`, `{{#if ...}}`, and `{{#each ...}}` blocks over normalized `sitemap.json` data
- The lightweight renderer that evaluates those blocks lives in `lib/render/template.ts`
- Template selection may be set per subdomain in the `config` sheet; if omitted it defaults to `da-sitemap.html`

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
- sibling sitemap links include only base geos that currently have sitemap output
- extended-geo links are subject to deduplication and `extendedSitemap` rules
- geo labels for section 2 and section 3 prefer extracted `regions.html` link text and strip any trailing ` - <language>` suffix before falling back to generated labels

### `transform-da`

Reads:

- `sitemap.json`

Writes:

- `sitemap.html`

Conditions that affect output:

- runs only where `sitemap.json` exists
- output is a DA HTML source document, not a DA-specific JSON format
- render semantics come from `sitemap.json` plus the DA page shell, not from old browser-specific sitemap blocks
- page copy comes from the `page-copy` sheet and can resolve `{{variable}}` placeholders against extracted placeholders data

### `push`

Reads:

- local `sitemap.html`

Writes:

- remote DA source document rooted at `--da-root`
- DA edit URLs for uploaded documents in stage output

Conditions that affect output:

- requires `--da-root`
- requires DA auth env vars
- skips geos with no local `sitemap.html`

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
- `domain`
- `geo`
- `da-root`

## Related

- [SPEC.md](./SPEC.md)
- [Preview Indexer](../preview-indexer/README.md)
- [Federal repo](https://github.com/adobecom/federal)

## License

See the repository root LICENSE file.
