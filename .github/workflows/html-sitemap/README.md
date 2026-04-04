# HTML Sitemap Generator

A GitHub Actions-based Node.js pipeline that generates localized HTML sitemap pages for Adobe's international sites and publishes them via DA and the AEM Admin API.

See [SPEC.md](./SPEC.md) for background, requirements, page structure, data sources, architecture, and the geo map.

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
  --domain <name>       Filter to a single domain: www | business
  --geo <prefix>        Filter to a single base geo (e.g. fr, de, "")
```

## Input

The generator uses a config file that defines the query index sources and geo map. Default location: https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json. Pass a different path or URL with `--config`.

The file uses format compatible with [AEM multi-sheet JSON](https://www.aem.live/developer/spreadsheets#multi-sheet-format), so config data can reside and any compatible backends (DA/Sharepoint).

Example:

```json
{
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
      { "domain": "business", "baseGeo": "", "language": "en", "extendedGeos": "" },
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

Data is outputed to `tmp/html-sitemap/{subdomain}/{baseGeo}` by default with a structure resembling the DA/Sharepoint location. Example:

```
/html-sitemap
  html-sitemap.json       # config file
  /business
    /raw
      /da-bacom
        query-index.json  # https://main--federal--adobecom.aem.live/federal/assets/data/lingo-site-mapping.json
    sitemap.da.json       # DA JSON Document
    sitemap.data.json     # HTML Sitemap data
    /de/
      /raw
        ...
    sitemap.da.json
    sitemap.data.json
    /es/
    /de/
    # etc
```

### Stages

#### `extract`

Fetches all source data for the specified scope:

- html-sitemap config file
- resolved gnav fragments and `placeholders.json` for each base geo
- `query-index.json` for each base geo and their extended geos

The smallest unit of work is a single domain + base geo pair (e.g. `--domain www --geo fr`). See [SPEC.md](./SPEC.md) for details.

#### `transform (data|da)`

Converts extracted data into DA-compatible page documents. No auth required.

For each domain/geo in scope:

1. `data` Transform extracted data into single generic data JSON
   - `base-geo-links` (Section 1) from GNAV data, applying selection rules
   - `other-sitemap-links` (Sector 2) from the geo map
   - `extended-geo-links` (Section 3) from query index data, with deduplication
   - Resolve `{{placeholder}}` tokens
2. `da` Transform generic data JSON into DA-compatible JSON
   - Assemble into page structure (H3 > H4 > UL)

See [SPEC.md](./SPEC.md) for details.

#### `push`

Uploads transformed documents to DA.

1. Read transform output documents, e.g. `sitemap.da.json`
2. For each document: PUT to DA via the DA Admin API (IMS-authenticated)

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
- **form-data**: Multipart form data for DA uploads

## Related

- [SPEC.md](./SPEC.md): Background, requirements, page structure, architecture, and source-of-truth data for this generator.
- [Preview Indexer](../preview-indexer/README.md): Similar GitHub Actions-based system for maintaining preview indexes. Shares authentication patterns and DA/AEM API integration.
- [Sitemap Base Block](../../../libs/blocks/sitemap-base/): Client-side block that renders sitemap content. The [`sitemap-gnav-proto`](https://github.com/adobecom/milo/tree/sitemap-gnav-proto) branch contains the GNAV prototype.
- [Federal repo](https://github.com/adobecom/federal): Hosts shared GNAV fragments and placeholders used by www.adobe.com.

## License

See the repository root LICENSE file.
