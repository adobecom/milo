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
  (none)        Run all stages in sequence

Options:
  --config <url|path>   Sitemap config JSON (default: https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json)
  --output <dir>        Root directory for all generated files (default: tmp/html-sitemap)
  --domain <name>       Filter to a single domain: www | business
  --geo <prefix>        Filter to a single base geo (e.g. fr, de, "")
```

## Input

The generator uses a config file that defines the query index sources and geo map. Default location: https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json. Pass a different path or URL with `--config`.

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
      { "domain": "business", "site": "da-bacom", "queryIndexPath": "/query-index.json" },
      { "domain": "www", "site": "cc", "queryIndexPath": "/cc-shared/assets/query-index.json" },
      { "domain": "www", "site": "da-cc", "queryIndexPath": "/cc-shared/assets/query-index.json" },
      { "domain": "www", "site": "da-dc", "queryIndexPath": "/dc-shared/assets/query-index.json" },
      { "domain": "www", "site": "da-events", "queryIndexPath": "/events/query-index.json" },
      { "domain": "www", "site": "da-express-milo", "queryIndexPath": "/express/query-index.json" },
      { "domain": "www", "site": "edu", "queryIndexPath": "/edu-shared/assets/query-index.json" }
    ]
  },
  "geo-map": {
    "data": [
      { "domain": "business", "baseGeo": "", "language": "en", "extendedGeos": "br, ca, ca_fr, ch_de, ..." },
      { "domain": "business", "baseGeo": "au", "language": "en", "extendedGeos": "" },
      { "domain": "www", "baseGeo": "", "language": "en", "extendedGeos": "ae_en, africa, be_en, ca, ..." },
      { "domain": "www", "baseGeo": "fr", "language": "fr", "extendedGeos": "be_fr, ca_fr, ch_fr, lu_fr" }
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
    /raw
      /gnav                        # GNAV raw HTML (extract)
        gnav.html                  # top-level GNAV
        products.html              # section fragment
        ai.html                    # section fragment
        ...
        manifest.json              # source/path/type map for saved GNAV files
      placeholders.json            # globalnav placeholders (extract)
      /da-bacom
        query-index.json           # base geo query index (extract)
    sitemap.data.json              # page data JSON (transform data)
    sitemap.da.json                # DA document JSON (transform da)
    /de
      /raw
        /gnav
          gnav.html                # localized GNAV for de
          ...
        placeholders.json
        /da-bacom
          query-index.json
      sitemap.data.json
      sitemap.da.json
    /extended                      # extended geo query indices (extract)
      /br
        /da-bacom
          query-index.json
      /ca
        /da-bacom
          query-index.json
      # etc
```

### Stages

#### `extract`

Fetches all source data for the specified scope and writes raw files to disk:

- html-sitemap config file
- GNAV fragments (raw `.plain.html`) and `placeholders.json` for each base geo
- GNAV `manifest.json` for each base geo, mapping saved local files back to source URLs/paths and fragment roles
- `query-index.json` for each base geo and their extended geos from each site

The smallest unit of work is a single subdomain + base geo pair (e.g. `--domain www --geo fr`). The `--geo` flag scopes GNAV fetching to the specified base geo. Query indices are always fetched for all extended geos listed in the geo map for the subdomain (so transform has complete data regardless of `extendedSitemap` mode).

If a base geo's GNAV cannot be resolved, extract logs a warning, skips GNAV output for that base geo, and continues with the rest of the run. Missing query indices already follow the same warn-and-continue model.

See [SPEC.md](./SPEC.md) for details.

#### `transform (data|da)`

Converts extracted data into DA-compatible page documents. No auth required.

For each domain/geo in scope:

1. `data` Transform extracted data into single generic data JSON
   - `base-geo-links` (Section 1) from GNAV data, applying selection rules
   - `other-sitemap-links` (Section 2) from the geo map
   - `extended-geo-links` (Section 3) from query index data, with deduplication — scoped by `extendedSitemap` config (`language` = base geo's mapped extended geos; `all` = every extended geo in the subdomain)
   - Resolve `{{placeholder}}` tokens
2. `da` Transform generic data JSON into DA-compatible JSON
   - Assemble into page structure (H3 > H4 > UL)

See [SPEC.md](./SPEC.md) for details.

#### `push`

Uploads transformed documents to DA.

1. Read transform output documents, e.g. `sitemap.da.json`
2. For each document: PUT to DA via the DA Admin API (IMS-authenticated)

Current scope is additive only: the pipeline creates or updates generated sitemap pages, but does not automatically remove or unpublish pages that fall out of scope. Cleanup is manual for now.

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

# Extract + transform only (no auth needed), single geo
node --env-file=.env generate.ts extract --domain www --geo fr
node --env-file=.env generate.ts transform --domain www --geo fr

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
| `stage` | Pipeline stage: `extract`, `transform`, `push`, `preview`, `publish`, or blank for all | (all) |
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

Create a `.env` file for local runs. Only `push` (DA), `preview`, and `publish` (AEM) require auth.

```bash
# Adobe IMS authentication endpoint for DA
ROLLING_IMPORT_IMS_URL=https://...
ROLLING_IMPORT_CLIENT_ID=...
ROLLING_IMPORT_CLIENT_SECRET=...
ROLLING_IMPORT_CODE=...
ROLLING_IMPORT_GRANT_TYPE=authorization_code

# Helix admin token sfor da-bacom/da-cc preview/publish
AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM=...
AEM_ADMIN_TOKEN_ADOBECOM_DA_CC=...

# GITHUB_TOKEN is provided automatically in Actions; set manually for local runs if needed
```

## Dependencies

See [preview-indexer](../preview-indexer/README.md) for reuseable DA, SP and AEM clients and utilities.

- **typescript**: Native execution via Node 24 (no build step)
- **axios** / **axios-retry**: HTTP client with retry logic
- **linkedom**: Server-side DOM for parsing GNAV `.plain.html` fragments
- **form-data**: Multipart form data for DA uploads

## Related

- [SPEC.md](./SPEC.md): Background, requirements, page structure, architecture, source-of-truth data, and **reference implementation** (browser GNAV prototype vs server pipeline).
- [Preview Indexer](../preview-indexer/README.md): Similar GitHub Actions-based system for maintaining preview indexes. Shares authentication patterns and DA/AEM API integration.
- **GNAV reference (browser)**: Implemented in [`libs/blocks/sitemap-base/sitemap-base.js`](../../../libs/blocks/sitemap-base/sitemap-base.js) (unit tests: [`sitemap-base.test.js`](../../../test/blocks/sitemap-base/sitemap-base.test.js)). That block is the behavioral spec for GNAV resolution, section discovery, `#_inline` column fetching, exclusions, and placeholders. The [`sitemap-gnav-proto`](https://github.com/adobecom/milo/tree/sitemap-gnav-proto) branch is used to **preview** the same block on draft pages via `milolibs=…`; it is not the sole location of the source—the canonical file paths are under `libs/blocks/sitemap-base/` on whichever branch you have checked out.
- [Federal repo](https://github.com/adobecom/federal): Hosts shared GNAV fragments and placeholders used by www.adobe.com.

## License

See the repository root LICENSE file.
