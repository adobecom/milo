# HTML Sitemap Generator

A GitHub Actions-based Node.js pipeline that generates localized HTML sitemap pages for Adobe's international sites and publishes them via DA and the AEM Admin API.

See [SPEC.md](./SPEC.md) for background, requirements, page structure, and stage semantics.

## Prerequisites

- Node.js 24 or higher

## Setup

```bash
cd .github/workflows/html-sitemap
npm install

# or from repo root
# npm --prefix .github/workflows/html-sitemap install
```

### Environment

Ensure the following env vars are defined for DA and AEM related commands. `.env` also supported.

```bash
# DA auth for service account (production)
ROLLING_IMPORT_IMS_URL=https://...
ROLLING_IMPORT_CLIENT_ID=...
ROLLING_IMPORT_CLIENT_SECRET=...
ROLLING_IMPORT_CODE=...
ROLLING_IMPORT_GRANT_TYPE=authorization_code

# DA auth personal (dev)
DA_SOURCE_TOKEN=...

# AEM admin tokens for preview + publish
# Use the raw auth_token cookie value from https://admin.hlx.page/profile (dev)
AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM=...
AEM_ADMIN_TOKEN_ADOBECOM_DA_CC=...
```

## CLI

The generator is a Node.js CLI that follows an ETL pipeline. Each stage can be run independently or as part of a selected sequence. The same interface maps to both local execution and GitHub Actions workflow inputs.

### Usage

```
$ node .github/workflows/html-sitemap/generate.ts --help
HTML Sitemap Generator

Usage:
  node --env-file=.env generate.ts [stage] [mode] [options]
  node --env-file=.env generate.ts --stages <list> [options]

Stages:
  clean            Delete generated output data under --output
  extract          Fetch config, GNAV fragments, and query index files
  transform-data   Build normalized sitemap.json from extracted inputs
  transform-da     Build sitemap.html from sitemap.json
  push             Upload sitemap.html to DA under --da-root
  preview          Trigger AEM preview for pushed pages
  publish          Trigger AEM publish for previewed pages

Options:
  --config <url|path>   Sitemap config JSON (default: https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json)
  --output <dir>        Root directory for generated files (default: tmp/html-sitemap)
  --domain <name>       Filter to a single domain: www | business
  --geo <prefix>        Filter to a single base geo (e.g. fr, de, default)
  --da-root <path>      Remote DA folder root for push/preview/publish
  --stages <list>       Comma-separated stage ids
  -h, --help            Show this help

Examples:
  node --env-file=.env generate.ts --stages extract,transform-data,transform-da  --domain business --geo default --da-root /drafts/hgpa/html-sitemap
  node --env-file=.env generate.ts push --domain business --geo default --da-root /drafts/hgpa/html-sitemap
  node --env-file=.env generate.ts preview --domain business --geo default --da-root /drafts/hgpa/html-sitemap
  node --env-file=.env generate.ts publish --domain business --geo default --da-root /drafts/hgpa/html-sitemap
  node --env-file=.env generate.ts --stages extract,transform-data,transform-da,push,preview,publish
```

## Input

The generator uses a config file that defines the query index sources and geo map. Default location: https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json. Pass a different path or URL with `--config`.

Use `--geo default` (or `--geo root`) to target the root sitemap for a domain. Those aliases normalize to the empty base-geo key internally.

The file uses format compatible with [AEM multi-sheet JSON](https://www.aem.live/developer/spreadsheets#multi-sheet-format), so config data can reside in any compatible backend (DA, Sharepoint).

Example:

```json
{
  "config": {
    "data": [
      { "subdomain": "business", "domain": "business.adobe.com", "site": "da-bacom", "extendedSitemap": "all" },
      { "subdomain": "www", "domain": "www.adobe.com", "site": "da-cc", "extendedSitemap": "language" }
    ]
  },
  "query-index-map": {
    "data": [
      { "subdomain": "business", "site": "da-bacom", "queryIndexPath": "/query-index.json" },
      { "subdomain": "www", "site": "cc", "queryIndexPath": "/cc-shared/assets/query-index.json" },
      { "subdomain": "www", "site": "da-cc", "queryIndexPath": "/cc-shared/assets/query-index.json" },
      { "subdomain": "www", "site": "da-dc", "queryIndexPath": "/dc-shared/assets/query-index.json" },
      { "subdomain": "www", "site": "da-events", "queryIndexPath": "/events/query-index.json" },
      { "subdomain": "www", "site": "da-express-milo", "queryIndexPath": "/express/query-index.json" },
      { "subdomain": "www", "site": "edu", "queryIndexPath": "/edu-shared/assets/query-index.json" }
    ]
  },
  "geo-map": {
    "data": [
      { "subdomain": "business", "baseGeo": "", "language": "en", "extendedGeos": "br, ca, ca_fr, ch_de, ..." },
      { "subdomain": "business", "baseGeo": "au", "language": "en", "extendedGeos": "" },
      { "subdomain": "www", "baseGeo": "", "language": "en", "extendedGeos": "ae_en, africa, be_en, ca, ..." },
      { "subdomain": "www", "baseGeo": "fr", "language": "fr", "extendedGeos": "be_fr, ca_fr, ch_fr, lu_fr" }
      // etc.
    ]
  }
}
```

See [Scope in SPEC.md](./SPEC.md#scope).

### Output

All stages read and write under a single output root. By default that is `tmp/html-sitemap/` (relative to the current working directory). Override with `--output <dir>` (for example a CI artifact path or another disk location). Paths below are relative to that root.

Example layout:

```
/html-sitemap
  html-sitemap.json                # copy of config file (extract)
  /business
    /_extract                      # raw data folder (extract)
      /gnav                        # GNAV raw HTML
        gnav.html                  # top-level GNAV
        products.html              # section fragment
        ai.html                    # section fragment
        ...
        manifest.json              # source/path/type map for saved GNAV files
      placeholders.json            # globalnav placeholders
      /da-bacom
        query-index.json           # base geo query index
    sitemap.json                   # normalized data JSON (transform data)
    sitemap.html                   # DA source HTML (transform da)
    /de
      /_extract
        /gnav
          gnav.html                # localized GNAV for de
          ...
        placeholders.json
        /da-bacom
          query-index.json
        /extended
          /at
            /da-bacom
              query-index.json
          /ch_de
            /da-bacom
              query-index.json
      sitemap.json
      sitemap.html
```

### Stages

#### `extract`

Fetches all source data for the specified scope and writes raw files to disk:

- html-sitemap config file
- GNAV fragments (raw `.plain.html`) and `placeholders.json` under `_extract` for each base geo
- GNAV `manifest.json` for each base geo, mapping saved local files back to source URLs/paths and fragment roles
- `query-index.json` for each base geo and its mapped extended geos from each site, colocated under that base geo's `_extract` tree

The smallest unit of work is a single subdomain + base geo pair (e.g. `--domain www --geo fr`). The `--geo` flag scopes GNAV fetching to the specified base geo. Query indices are always fetched for all extended geos listed in the geo map for the subdomain (so transform has complete data regardless of `extendedSitemap` mode).

If a base geo's GNAV cannot be resolved, extract logs a warning, skips GNAV output for that base geo, and continues with the rest of the run. Missing query indices already follow the same warn-and-continue model.

##### Current Extract Semantics

- A base geo is treated as having sitemap output only when at least one base-geo query index succeeds and returns rows.
- Base geos that do not meet that rule leave no per-geo output folder behind.
- GNAV fragments and placeholders are only persisted for base geos that qualify for sitemap output.

##### Output Conventions

- `_extract` is internal pipeline state, not publishable content.
- A base-geo folder under the output root corresponds to a geo that currently qualifies to produce `sitemap.html` during transform.
- Extended-geo query indices are nested under the owning base geo's `_extract/extended/` subtree so each base geo is self-contained for transform.

##### Run Summary

- `extract` prints a final summary listing the base geos with sitemap output and the base geos without it.
- In this summary, "with sitemap output" means `extract` found enough base-geo query-index data for transform to consider emitting `sitemap.html`.

See [SPEC.md](./SPEC.md) for details.

Plain `transform` is a convenience alias that runs both atomic transform stages in order:

1. `transform-data`
2. `transform-da`

#### `transform (data|da)`

Converts extracted data into DA-compatible page documents. No auth required.

For each domain/geo in scope:

1. `data` Transform extracted data into single generic data JSON
   - `base-geo-links` (Section 1) from GNAV data, applying selection rules
   - `other-sitemap-links` (Section 2) from the geo map, but only for sibling base geos that currently have sitemap output
   - `extended-geo-links` (Section 3) from query index data, with deduplication on canonical paths after removing the geo prefix from both base-geo and extended-geo URLs — scoped by `extendedSitemap` config (`language` = base geo's mapped extended geos; `all` = every extended geo in the subdomain)
   - Resolve `{{placeholder}}` tokens
2. `da` Transform generic data JSON into a DA-compatible HTML source document
   - Assemble into page structure and write `sitemap.html`

See [SPEC.md](./SPEC.md) for details.

`transform data` reads only previously extracted local artifacts under each eligible base geo's `_extract` tree and writes `sitemap.json` next to that geo folder:

- `business/sitemap.json`
- `business/fr/sitemap.json`

The generated data file currently contains:

- `sections.baseGeoLinks`
- `sections.otherSitemapLinks`
- `sections.extendedGeoLinks`

`transform data` is also responsible for resolving placeholder tokens using the extracted `placeholders.json` data. That resolution applies to GNAV-derived labels and GNAV-derived links before the normalized data file is written.

Query-index titles are also normalized during `transform data`: title fallback is derived from the URL slug without any file extension, and trailing Adobe branding suffixes such as `- Adobe` or `| Adobe` are removed.

At the end of the run, `transform data` prints a summary of which base geos were transformed and which were skipped because no eligible `_extract` subtree was present.

#### `transform da`

Current DA source inspection indicates that DA stores the page source as plain HTML, not as a separate DA-specific page schema. `transform da` therefore reads `sitemap.json`, generates `sitemap.html`, and keeps the work local-only.

The current renderer:

- writes a full HTML source document
- uses a simple shell: `<body><header></header><main>...</main><footer></footer></body>`
- renders Milo-compatible authored markup for the primary sitemap sections inside `<main>`
- appends a metadata block in the source document

The renderer remains code-driven in TypeScript. A general-purpose templating engine is not used.

Current page-copy contract:

- H1 defaults to `Sitemap`
- metadata `title` matches the page title
- metadata `description` is a localized short description of the page
- page copy is localized by the base geo's configured language, with English fallback when no localized string is defined

Current section rendering contract:

- Intro uses authored `text` markup
- Section 1 uses authored `sitemap-base` markup
- Section 2 uses authored `sitemap-list` markup
- Section 3 uses authored `accordion` markup and retains the `sitemap-extended` class for preview parity with the draft reference

#### `push`

Uploads transformed documents to DA.

1. Read local transform output documents, e.g. `sitemap.html`, from `--output`
2. Map them to remote DA paths under `--da-root`
3. Create any missing folders beneath the provided DA root
4. Upload the HTML source document via the DA Source API (IMS-authenticated)

Example:

```bash
node --env-file=.env generate.ts push --domain business --geo default --da-root /drafts/hgpa/html-sitemap
```

Current scope is additive only: the pipeline creates or updates generated sitemap pages, but does not automatically remove or unpublish pages that fall out of scope. Cleanup is manual for now.

#### `clean`

Deletes the generated output directory at `--output` recursively. This is for local cleanup of extracted/transformed artifacts only; it does not remove anything from DA or AEM.

#### `preview`

Triggers AEM preview for all pushed pages.

1. For each page: trigger preview via the Helix Admin API

#### `publish`

Triggers AEM publish for all previewed pages.

1. For each page: trigger publish via the Helix Admin API

### GitHub Actions Workflow Inputs

The workflow exposes the same parameters as the CLI:

| Input | Description | Default |
|---|---|---|
| `stages` | Comma-separated canonical stage ids: `extract`, `transform-data`, `transform-da`, `push`, `preview`, `publish`, `clean` | |
| `output` | Output root directory (same as CLI `--output`) | `tmp/html-sitemap` |
| `domain` | Filter to domain: `www`, `business`, or blank for all | (all) |
| `geo` | Filter to base geo prefix, or blank for all | (all) |

## Dependencies

See [preview-indexer](../preview-indexer/README.md) for related DA, SP and AEM admin integration patterns.

- **typescript**: Local typechecking
- **parse5**: Server-side HTML parsing for GNAV transforms

## Related

- [SPEC.md](./SPEC.md): Background, requirements, page structure, architecture, source-of-truth data, and **reference implementation** (browser GNAV prototype vs server pipeline).
- [Preview Indexer](../preview-indexer/README.md): Similar GitHub Actions-based system for maintaining preview indexes. Shares authentication patterns and DA/AEM API integration.
- **GNAV reference (browser)**: Implemented in [`libs/blocks/sitemap-base/sitemap-base.js`](../../../libs/blocks/sitemap-base/sitemap-base.js) (unit tests: [`sitemap-base.test.js`](../../../test/blocks/sitemap-base/sitemap-base.test.js)). That block is the behavioral spec for GNAV resolution, section discovery, `#_inline` column fetching, exclusions, and placeholders. The [`sitemap-gnav-proto`](https://github.com/adobecom/milo/tree/sitemap-gnav-proto) branch is used to **preview** the same block on draft pages via `milolibs=…`; it is not the sole location of the source—the canonical file paths are under `libs/blocks/sitemap-base/` on whichever branch you have checked out.
- [Federal repo](https://github.com/adobecom/federal): Hosts shared GNAV fragments and placeholders used by www.adobe.com.

## License

See the repository root LICENSE file.
