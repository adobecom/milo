# Nala Test Environment Variables

This document describes all environment variables used in the Nala test infrastructure.

## Core Variables

### Test Configuration

| Variable | Description | Used In | Default |
|----------|-------------|---------|---------|
| `CI` | Indicates tests are running in CI environment | All scripts | `undefined` |
| `GITHUB_ACTIONS` | Set when running in GitHub Actions | pr.run.sh, Dockerfile | `undefined` |
| `CONTAINER` | Set when running inside Docker container | Dockerfile | `undefined` |

### URL Configuration

| Variable | Description | Used In | Default |
|----------|-------------|---------|---------|
| `PR_BRANCH_LIVE_URL_GH` | Primary test URL for PR branch | pr.run.sh, playwright.config.js | `https://milo.adobe.com` |
| `PR_BRANCH_LIVE_URL` | Fallback test URL | playwright.config.js | `undefined` |
| `LOCAL_TEST_LIVE_URL` | Local testing URL override | playwright.config.js | `undefined` |

### GitHub Context

| Variable | Description | Used In | Default |
|----------|-------------|---------|---------|
| `GITHUB_REF` | Git reference (branch/tag) | pr.run.sh | `undefined` |
| `GITHUB_HEAD_REF` | Head branch for PRs | pr.run.sh | `undefined` |
| `GITHUB_REPOSITORY` | Repository name (org/repo) | pr.run.sh | `undefined` |
| `GITHUB_ACTION_PATH` | Path to action workspace | pr.run.sh | `/workspace` |
| `PR_NUMBER` | Pull request number | pr.run.sh | `undefined` |

### Test Execution

| Variable | Description | Used In | Default |
|----------|-------------|---------|---------|
| `labels` | GitHub PR labels for test filtering | pr.run.sh | `undefined` |
| `reporter` | Playwright reporter override | pr.run.sh | `undefined` |
| `TEST_FILES` | Specific test files to run | pr.run.sh | `undefined` |
| `SHARD_INDEX` | Current shard number (1-based) | pr.run.sh | `undefined` |
| `SHARD_TOTAL` | Total number of shards | pr.run.sh | `undefined` |
| `PLAYWRIGHT_WORKERS` | Number of parallel workers | playwright.config.js | Auto-calculated |

### Authentication

| Variable | Description | Used In | Default |
|----------|-------------|---------|---------|
| `IMS_EMAIL` | IMS authentication email | run-nala-docker.sh | `undefined` |
| `IMS_PASS` | IMS authentication password | run-nala-docker.sh | `undefined` |

### Docker/Build

| Variable | Description | Used In | Default |
|----------|-------------|---------|---------|
| `PLAYWRIGHT_BROWSERS_PATH` | Playwright browser cache location | Dockerfile | `/ms-playwright` |
| `FORCE_COLOR` | Terminal color output control | pr.run.sh | `0` |
| `PLAYWRIGHT_HTML_OPEN` | Auto-open HTML report | pr.run.sh | `never` |

## Usage Examples

### Local Development
```bash
# Run tests locally with custom URL
LOCAL_TEST_LIVE_URL=http://localhost:3000 npm test

# Run specific test file
TEST_FILES=nala/blocks/accordion/accordion.test.js npm test
```

### Docker Testing
```bash
# Run with IMS credentials
IMS_EMAIL=test@adobe.com IMS_PASS=password ./run-nala-docker.sh

# Run with custom branch URL
PR_BRANCH_LIVE_URL_GH=https://feature--milo--adobecom.aem.live ./run-nala-docker.sh
```

### CI/GitHub Actions
```yaml
# Variables automatically set by GitHub Actions:
- GITHUB_REF
- GITHUB_HEAD_REF
- GITHUB_REPOSITORY
- GITHUB_ACTIONS=true

# Custom variables passed to containers:
- labels="${{ join(github.event.pull_request.labels.*.name, ' ') }}"
- SHARD_INDEX="${{ matrix.shard }}"
- SHARD_TOTAL="${{ needs.calculate-shards.outputs.shard-count }}"
```

## Notes

1. **URL Priority**: The system checks URLs in this order:
   - `PR_BRANCH_LIVE_URL_GH` (primary)
   - `PR_BRANCH_LIVE_URL` (fallback)
   - `LOCAL_TEST_LIVE_URL` (local override)
   - Default: `https://main--milo--adobecom.aem.live`

2. **Sharding**: When `SHARD_INDEX` is set, the worker count (`PLAYWRIGHT_WORKERS`) is dynamically calculated:
   - Formula: `30 / SHARD_TOTAL` (bounded between 2 and 7)
   - This ensures optimal parallelization per shard
   - Can be overridden by setting `PLAYWRIGHT_WORKERS` explicitly

3. **Docker Context**: The `CONTAINER` and `GITHUB_ACTIONS` variables prevent duplicate dependency installation when running in containers.

4. **Reporter Configuration**: JSON reporter is only enabled in CI mode to generate test results for analysis and timing optimization.