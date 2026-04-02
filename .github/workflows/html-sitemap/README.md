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
  --config <url|path>   Sitemap config JSON (default: ./sitemap-config.json)
  --domain <name>       Filter to a single domain: www | business
  --geo <prefix>        Filter to a single base geo (e.g. fr, de, "")
```

### Stages

#### `extract`

Fetches all source data for the specified scope.

1. Read the sitemap config (query index sources + geo map)
2. For each domain/geo in scope:
   - Fetch GNAV fragments (resolve source, follow section/column refs)
   - Fetch query index JSON for the base geo from each site
   - Fetch query index JSON for each extended geo from each site (warn on 404)
3. Save

The smallest unit of work is a single domain + base geo pair (e.g. `--domain www --geo fr`).

#### `transform`

Converts extracted data into DA-compatible page documents. No auth required.

1. Read intermediate extracted data
2. For each domain/geo in scope:
   - Build Section 1 (base geo links) from GNAV data, applying rendering rules
   - Build Section 2 (other sitemap links) from the geo map
   - Build Section 3 (extended geo links) from query index data, with deduplication
   - Resolve `{{placeholder}}` tokens
   - Assemble into page structure (H3 > H4 > UL)
3. Transform page structure into DA-compatible JSON document
4. Write output documents (JSON)

#### `push`

Uploads transformed documents to DA. **Requires IMS authentication.**

1. Read transform output documents
2. For each document: PUT to DA via the DA Admin API (IMS-authenticated)

#### `preview`

Triggers AEM preview for all pushed pages. **Requires AEM admin token.**

1. For each page: trigger preview via the Helix Admin API

#### `publish`

Triggers AEM publish for all previewed pages. **Requires AEM admin token.**

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

## Sitemap Config File

The generator reads a config file that defines the query index sources and geo map. Default location: `./sitemap-config.json`. Pass a different path or URL with `--config`.

The file uses AEM multi-sheet JSON format so it can eventually be served from a DA spreadsheet. The full source-of-truth data is in [SPEC.md](./SPEC.md#scope).

```json
{
  "query-index-map": {
    "total": 7,
    "offset": 0,
    "limit": 7,
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
    "total": 57,
    "offset": 0,
    "limit": 57,
    "data": [
      { "domain": "business", "baseGeo": "", "language": "en", "extendedGeos": "" },
      { "domain": "business", "baseGeo": "au", "language": "en", "extendedGeos": "" },
      { "domain": "www", "baseGeo": "", "language": "en", "extendedGeos": "ae_en, africa, be_en, ca, ..." },
      { "domain": "www", "baseGeo": "fr", "language": "fr", "extendedGeos": "be_fr, ca_fr, ch_fr, lu_fr" }
    ]
  },
  ":version": 3,
  ":names": ["query-index-map", "geo-map"],
  ":type": "multi-sheet"
}
```

## Prerequisites

- Node.js 24 or higher (supports native TypeScript execution)

## Setup

```bash
cd .github/workflows/html-sitemap
npm install
```

Create a `.env` file for local runs. Only `push`, `preview`, and `publish` require auth -- `extract` and `transform` run without credentials.

```bash
# Adobe IMS authentication endpoint
ROLLING_IMPORT_IMS_URL=https://...

# IMS OAuth client credentials
ROLLING_IMPORT_CLIENT_ID=...
ROLLING_IMPORT_CLIENT_SECRET=...

# IMS OAuth authorization code and grant type
ROLLING_IMPORT_CODE=...
ROLLING_IMPORT_GRANT_TYPE=authorization_code

# Helix admin token for da-bacom preview/publish
AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM=...

# Helix admin token for da-cc preview/publish
AEM_ADMIN_TOKEN_ADOBECOM_DA_CC=...

# GITHUB_TOKEN is provided automatically in Actions; set manually for local runs if needed

# Signals a local run (skips Actions-specific behaviour)
LOCAL_RUN=true
```

## Dependencies

TBD -- expected to be similar to preview-indexer:
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
