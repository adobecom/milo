# HTML Sitemap Generator

A GitHub Actions-based Node.js pipeline that generates localized HTML sitemap pages for Adobe's international sites and publishes them via DA and the AEM Admin API.

See [SPEC.md](./SPEC.md) for background, requirements, page structure, and snapshot-dated **GNAV** and **query index / geo** sections (update those together when live data changes).

## CLI

The generator is a Node.js CLI that follows an ETL pipeline. Each stage can be run independently or as part of the full pipeline. The same interface maps to both local execution and GitHub Actions workflow inputs.

### Usage

```
node --env-file=.env generate.ts [stage] [options]

Stages:
  extract       Fetch config, GNAV fragments, and query index files
  transform     Convert extracted data into DA-compatible pages and other assets
  push          Push pages to DA
  preview       AEM preview pages
  publish       AEM publish pages
  clean         Delete generated output data under --output
  (none)        Run all stages in sequence

Options:
  --config <url|path>   Sitemap config JSON (default: https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json)
  --output <dir>        Root directory for all generated files (default: tmp/html-sitemap)
  --domain <name>       Filter to a single domain: www | business
  --geo <prefix>        Filter to a single base geo (e.g. fr, de, default)
  --da-root <path>      Remote DA folder root for push (e.g. /drafts/hgpa/html-sitemap)
```

## Input

The generator uses a config file that defines the query index sources and geo map. Default location: https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json. Pass a different path or URL with `--config`.

Use `--geo default` (or `--geo root`) to target the root sitemap for a domain. Those aliases normalize to the empty base-geo key internally.

The file uses format compatible with [AEM multi-sheet JSON](https://www.aem.live/developer/spreadsheets#multi-sheet-format), so config data can reside and any compatible backends (DA/Sharepoint).

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

The full source-of-truth data is in [SPEC.md](./SPEC.md#scope).
See [Scope in SPEC.md](./SPEC.md#scope).

### Output

All stages read and write under a single output root. By default that is `tmp/html-sitemap/` (relative to the current working directory). Override with `--output <dir>` (for example a CI artifact path or another disk location). Paths below are relative to that root.

Example layout:

```
/html-sitemap
  html-sitemap.json               # config file (extract)
  /business
    /_extract
      /gnav                        # GNAV raw HTML (extract)
        gnav.html                  # top-level GNAV
        products.html              # section fragment
        ai.html                    # section fragment
        ...
        manifest.json              # source/path/type map for saved GNAV files
      placeholders.json            # globalnav placeholders (extract)
      /da-bacom
        query-index.json           # base geo query index (extract)
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

### Examples

```bash
# Full pipeline, all domains and geos
node --env-file=.env generate.ts

# Remove generated local output
node --env-file=.env generate.ts clean

# Extract + transform only (no auth needed), single geo
node --env-file=.env generate.ts extract --domain www --geo fr
node --env-file=.env generate.ts transform data --domain www --geo fr

# Full pipeline, single domain
node --env-file=.env generate.ts --domain business

# Push, preview, publish individually (after extract + transform)
node --env-file=.env generate.ts push --domain www --geo fr
node --env-file=.env generate.ts preview --domain www --geo fr
node --env-file=.env generate.ts publish --domain www --geo fr
```

### GitHub Actions Workflow Inputs

The workflow exposes the same parameters as the CLI:

| Input | Description | Default |
|---|---|---|
| `stage` | Pipeline stage: `extract`, `transform`, `push`, `preview`, `publish`, `clean`, or blank for all | (all) |
| `output` | Output root directory (same as CLI `--output`) | `tmp/html-sitemap` |
| `domain` | Filter to domain: `www`, `business`, or blank for all | (all) |
| `geo` | Filter to base geo prefix, or blank for all | (all) |

## Prerequisites

- Node.js 24 or higher (supports native TypeScript execution)

## Setup

```bash
cd .github/workflows/html-sitemap
npm install
```

If you prefer to stay at the repo root, use npm's `--prefix` form to run this package in place:

```bash
npm --prefix .github/workflows/html-sitemap install
npm --prefix .github/workflows/html-sitemap run typecheck
npm --prefix .github/workflows/html-sitemap run test
```

Create a `.env` file for local runs. Only `push` (DA), `preview`, and `publish` (AEM) require auth.

```bash
# Production DA token source (used in Actions / shared automation)
ROLLING_IMPORT_IMS_URL=https://...
ROLLING_IMPORT_CLIENT_ID=...
ROLLING_IMPORT_CLIENT_SECRET=...
ROLLING_IMPORT_CODE=...
ROLLING_IMPORT_GRANT_TYPE=authorization_code

# Local short-lived DA override token
# Useful for personal testing; not the long-term production contract
DA_SOURCE_TOKEN=...

# AEM/Helix admin tokens for preview + publish
# Use the raw auth_token cookie value from admin.hlx.page/profile
# Do not prefix with Bearer or token; the CLI adds `Authorization: token ...`
AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM=...
AEM_ADMIN_TOKEN_ADOBECOM_DA_CC=...
```

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
