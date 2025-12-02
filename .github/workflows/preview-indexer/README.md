# Preview Indexer

A GitHub Actions-based system that automatically maintains preview indexes for DA (Document Authoring) sites by monitoring and processing Helix admin logs.

## Overview

The Preview Indexer tracks content preview activity across regional sites and maintains up-to-date preview indexes in the DA system. It supports both incremental updates based on recent activity and full regeneration of indexes for specific regions.

## Features

- **Incremental Updates**: Automatically tracks preview activity and updates indexes based on recent changes
- **Full Index Generation**: Regenerates complete preview indexes for specific regional paths
- **Multi-site Support**: Handles multiple DA sites (e.g., da-bacom, da-bacom-lingo)
- **Regional Path Filtering**: Supports region-specific indexing (e.g., /be_en/, /ch_fr/, /lu_de/)
- **State Management**: Maintains checkpoint data to track last successful runs
- **Retry Logic**: Built-in retry mechanism for failed API requests
- **Concurrent Processing**: Supports parallel processing of multiple sites

## Architecture

### Components

```
.github/workflows/preview-indexer/
├── incremental.js              # Incremental update entry point
├── full-index.js               # Full index generation entry point
├── package.json                # Node.js dependencies
└── internal/
    ├── indexer.js              # Core indexing logic
    ├── config.js               # Site configuration management
    ├── da-client.js            # DA API client
    ├── helix-client.js         # Helix admin API client
    ├── indexer-state.js        # State persistence
    └── utils.js                # Shared utilities
```

### State Directory

```
preview-indexer/state/
└── last-runs.json              # Checkpoint data for incremental runs
```

## GitHub Actions Workflows

### 1. Incremental Preview Indexer
**File**: `.github/workflows/preview-indexer.yaml`

Updates preview indexes based on recent activity from Helix admin logs.

**Triggers**: Manual workflow dispatch

**Inputs**:
- `lastRunISOFrom` (optional): Start timestamp for log fetching
- `lastRunISOTo` (optional): End timestamp for log fetching
- `site` (optional): Specific site to process (e.g., da-bacom)
- `siteRegions` (optional): Comma-separated regional paths (e.g., /be_en/, /ch_fr/, /lu_de/)

**Features**:
- Uses GitHub Actions cache to persist state across runs
- Prevents concurrent runs using workflow status checks
- Automatically fetches logs since last successful run
- Merges new preview paths with existing index data

### 2. Full Regional Preview Indexer
**File**: `.github/workflows/preview-indexer-full.yaml`

Generates complete preview indexes for specific regional paths.

**Triggers**: Manual workflow dispatch

**Inputs**:
- `site` (required): Site name (e.g., da-bacom) - must be in `PREVIEW_INDEXER_REPOS`
- `siteRegions` (required): Comma-separated regional paths (e.g., /be_en/, /ch_fr/, /lu_de/)

**Note**: Both inputs are mandatory for execution; the workflow will fail if either is missing.

**Features**:
- Fetches all preview paths for specified regions
- Replaces existing index data completely
- Useful for recovering from index corruption or initializing new regions

## Configuration

### Environment Variables

#### Required for Both Workflows

| Variable | Description |
|----------|-------------|
| `ROLLING_IMPORT_IMS_URL` | Adobe IMS authentication URL |
| `ROLLING_IMPORT_CLIENT_ID` | IMS OAuth client ID |
| `ROLLING_IMPORT_CLIENT_SECRET` | IMS OAuth client secret |
| `ROLLING_IMPORT_CODE` | IMS OAuth authorization code |
| `ROLLING_IMPORT_GRANT_TYPE` | IMS OAuth grant type |
| `GITHUB_TOKEN` | GitHub API token (automatically provided) |
| `PREVIEW_INDEXER_REPO` | Target DA repository |
| `PREVIEW_INDEXER_REPOS` | Comma-separated list of repos to process |
| `PREVIEW_INDEX_FILE` | Base path template for index files |
| `LINGO_CONFIG` | URL to lingo configuration JSON |

#### Site-Specific Configuration

For each site (e.g., `adobecom/da-bacom`), configure:

| Variable Pattern | Description | Example |
|-----------------|-------------|---------|
| `AEM_ADMIN_TOKEN_<ORG>_<REPO>` | Helix admin API token | `AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM` |
| `PREVIEW_INDEX_KEY_<ORG>_<REPO>` | Key for regional paths in lingo config | `PREVIEW_INDEX_KEY_ADOBECOM_DA_BACOM` |
| `EXCLUDE_PREVIEW_PATHS_<ORG>_<REPO>` | Comma-separated paths to exclude | `EXCLUDE_PREVIEW_PATHS_ADOBECOM_DA_BACOM` |
| `PREVIEW_INDEX_FILE_<ORG>_<REPO>` | Site-specific index path template | `PREVIEW_INDEX_FILE_ADOBECOM_DA_BACOM` |
| `PREVIEW_PATH_EXTN_<ORG>_<REPO>` | Site-specific preview path extention that needs to be applied e.g. .html | `PREVIEW_PATH_EXTN_ADOBECOM_DA_BACOM` |

**Notes**:
- Hyphens in org/repo names are converted to underscores and uppercased.
- `/target-preview/` is automatically added to exclude paths for all sites.

#### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PREVIEW_INDEXER_ORG` | Organization name for repositories | `adobecom` |
| `PREVIEW_INDEXER_CONCURRENCY` | Number of sites to process in parallel | `2` |
| `INDEXER_RETRY_ATTEMPTS` | Number of retry attempts for failed requests | `4` |
| `INDEXER_RETRY_DELAY` | Initial retry delay in milliseconds | `5` |
| `JOB_STATUS_POLL_INTERVAL` | Polling interval for bulk jobs (seconds) | `10` |
| `JOB_STATUS_TIMEOUT` | Timeout for bulk jobs (seconds) | `180` |
| `LOG_FETCH_MAX_REQUESTS` | Maximum number of log page requests per site | `10` |

### Index File Path Template

The `PREVIEW_INDEX_FILE` supports placeholders:
- `{REGION_PATH}`: Full regional path (e.g., `/be_en/`)
- `{REGION}`: Sanitized region name (e.g., `be_en`)

**Example**: `{REGION_PATH}/drafts/preview-index` → `/be_en/drafts/preview-index`

## How It Works

### Incremental Indexing Flow

1. **Check Concurrency**: Ensures no other workflow run is in progress
2. **Restore State**: Loads last run timestamp from GitHub Actions cache
3. **Fetch Logs**: Retrieves Helix admin logs since last run
4. **Filter Paths**: Extracts and filters preview paths from log entries
5. **Group by Region**: Organizes paths by regional roots
6. **Merge Data**: Combines new paths with existing index data from DA
7. **Save to DA**: Uploads updated index to DA system
8. **Trigger Preview**: Initiates Helix preview for the index file
9. **Update State**: Saves new checkpoint for next run

### Full Indexing Flow

1. **Check Concurrency**: Ensures no other workflow run is in progress
2. **Validate Input**: Confirms site and regions are provided
3. **Fetch All Paths**: Uses Helix bulk status API to get all preview paths
4. **Filter Paths**: Applies exclusion rules and file type filters
5. **Generate Index**: Creates complete index from scratch
6. **Save to DA**: Uploads index to DA system
7. **Trigger Preview**: Initiates Helix preview for the index file

### Path Filtering

Preview paths are filtered based on:
- **No file extension**: Paths with extensions (e.g., `.jpg`, `.pdf`) are excluded
- **Exclusion patterns**: Paths matching configured exclusion patterns are removed
- **Regional prefix**: Only paths starting with the regional root are included

## Local Development

### Prerequisites

- Node.js 21 or higher
- Access to required secrets and environment variables

### Setup

```bash
cd .github/workflows/preview-indexer
echo "registry=https://registry.npmjs.org/" > .npmrc
npm install
rm .npmrc
```

### Running Locally

Create a `.env` file with required environment variables:

```bash
# Authentication
ROLLING_IMPORT_IMS_URL=https://...
ROLLING_IMPORT_CLIENT_ID=...
ROLLING_IMPORT_CLIENT_SECRET=...
ROLLING_IMPORT_CODE=...
ROLLING_IMPORT_GRANT_TYPE=authorization_code

# Site Configuration
PREVIEW_INDEXER_REPOS=da-bacom,da-bacom-lingo
AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM=...
PREVIEW_INDEX_KEY_ADOBECOM_DA_BACOM=bacom
EXCLUDE_PREVIEW_PATHS_ADOBECOM_DA_BACOM=/target-preview/
LINGO_CONFIG=https://...

# Optional
LOCAL_RUN=true
```

#### Run Incremental Index

```bash
cd .github/workflows/preview-indexer
node --env-file=../../../.env incremental.js
```

#### Run Full Index

```bash
SITE="da-bacom" \
SITE_REGION_PATHS="/ar/,/br/" \
node --env-file=.env .github/workflows/preview-indexer/full-index.js
```

### Testing with Act

Use [act](https://github.com/nektos/act) to test GitHub Actions locally:

```bash
# Install act (macOS)
brew install act

# Run incremental workflow
act workflow_dispatch \
  --env GITHUB_RUN_ID=$(date +%s) \
  -j preview-indexer \
  -e act-event.json

# Run full workflow
act workflow_dispatch \
  --env GITHUB_RUN_ID=$(date +%s) \
  -j preview-indexer-full \
  -e act-event-full.json
```

Example `act-event.json`:
```json
{
  "event_name": "workflow_dispatch",
  "inputs": {
    "lastRunISOFrom": "2025-10-19T20:30:35.751Z",
    "lastRunISOTo": "2025-10-20T17:22:06.988Z",
    "site": "da-bacom",
    "siteRegions": "/ar/,/br/"
  }
}
```

`act-event-full.json`:
```json
{
  "event_name": "workflow_dispatch",
  "inputs": {
    "site": "da-bacom",
    "siteRegionPaths": "/ar/,/br/"
  }
}
```

## Output

### Preview Index Format

The generated preview index follows this structure:

```json
{
  "total": 150,
  "limit": 150,
  "offset": 0,
  "data": [
    { "Path": "/be_en/products/acrobat" },
    { "Path": "/be_en/products/photoshop" }
  ],
  ":colWidths": [200],
  ":sheetname": "data",
  ":type": "sheet"
}
```

### Index Locations

Indexes are saved to DA at paths like:
- `https://da.live/edit#/adobecom/da-bacom/be_en/shared/preview-index`
- `https://da.live/edit#/adobecom/da-bacom/lu_de/shared/preview-index`

And previewed at:
- `https://main--da-bacom--adobecom.aem.page/be_en/shared/preview-index.json`
- `https://main--da-bacom--adobecom.aem.page/lu_de/shared/preview-index.json`

### Logs

Each workflow run produces logs showing:
- Sites being processed
- Number of log entries fetched
- Preview paths discovered
- Index save status
- Preview trigger results

### State File

The `preview-indexer/state/last-runs.json` file contains:

```json
{
  "adobecom_da-bacom": {
    "lastRunISO": "2025-10-27T12:00:00.000Z"
  }
}
```

## Contributing

When modifying the preview indexer:

1. Test locally using the Node.js commands
2. Test with `act` to simulate GitHub Actions environment
3. Update documentation if adding new features or configuration
4. Ensure backward compatibility with existing state files

## Dependencies

- **axios**: HTTP client for API requests
- **axios-retry**: Automatic retry logic for failed requests
- **form-data**: Multipart form data for file uploads
- **p-queue**: For concurrent execution

See `package.json` for version details.

## License

See the repository root LICENSE file.

