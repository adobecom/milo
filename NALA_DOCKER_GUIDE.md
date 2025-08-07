# Running Nala Tests Locally with Docker

This guide explains how to run Nala tests locally using Docker to troubleshoot failures that occur in GitHub Actions.

## Prerequisites

- Docker installed and running
- Access to the milo repository
- (Optional) IMS credentials for tests that require authentication

## Quick Start

```bash
# Run all tests (builds image on first run)
./run-nala-docker.sh

# Run tests with specific tag
./run-nala-docker.sh --tags '@smoke'

# Run tests against a specific branch URL
./run-nala-docker.sh --url 'https://feature-branch--milo--adobecom.aem.live'

# Run as a specific shard (useful for reproducing CI failures)
./run-nala-docker.sh --shard 1/6

# Force rebuild when dependencies change
./run-nala-docker.sh --rebuild
```

### Performance Note
The optimized script caches npm dependencies in the Docker image:
- First run: Builds image with dependencies (~2-3 minutes)
- Subsequent runs: Uses cached image (starts in ~10 seconds)
- Use `--rebuild` when package.json changes

## Environment Variables

The following environment variables can be set before running the script:

### Required for authenticated tests:
- `IMS_EMAIL`: Your IMS email address
- `IMS_PASS`: Your IMS password

### Optional:
- `FEATURE_BRANCH`: Branch name (default: main)
- `PR_BRANCH_LIVE_URL_GH`: Base URL to test against

## Command Line Options

- `--tags, -t <tags>`: Test tags to run (e.g., '@smoke' or '@regression')
- `--reporter, -r <name>`: Reporter to use (default: html,list)
- `--shard <index/total>`: Run specific shard (e.g., '1/4')
- `--branch, -b <name>`: Feature branch name (default: main)
- `--url, -u <url>`: Base URL to test against
- `--rebuild`: Force rebuild of Docker image (use when dependencies change)
- `--help, -h`: Show help message

## Examples

### Running tests with authentication:
```bash
export IMS_EMAIL="your-email@adobe.com"
export IMS_PASS="your-password"
./run-nala-docker.sh --tags '@authenticated'
```

### Reproducing a CI failure:
If a test failed in CI on shard 3 of 6:
```bash
./run-nala-docker.sh --shard 3/6 --url 'https://your-branch--milo--adobecom.aem.live'
```

### Running specific test files:
```bash
./run-nala-docker.sh --tags '@your-test-tag'
```

### Rebuilding after dependency changes:
```bash
# When package.json or package-lock.json change
./run-nala-docker.sh --rebuild
```

## Test Results

After running tests, results will be available in:
- `test-results/`: Raw test output and artifacts
- `test-html-results/`: HTML report (open index.html in browser)
- `playwright-report/`: Playwright's detailed report

## Docker Details

The optimized script builds a custom Docker image based on the official Playwright image (`mcr.microsoft.com/playwright:v1.54.0-noble`) which includes:
- All required browsers (Chromium, Firefox, WebKit)
- System dependencies for browser automation
- Node.js runtime
- **Cached npm dependencies** (rebuilt only when package files change)

This approach mirrors the GitHub Actions workflow for consistency between local and CI environments.

## Troubleshooting

### Permission issues
If you encounter permission issues, ensure the script is executable:
```bash
chmod +x run-nala-docker.sh
```

### Docker not running
Make sure Docker Desktop is running before executing the script.

### Network issues
If tests fail due to network issues, ensure your Docker has internet access and can reach the test URLs.

### Finding test tags
Look for `@tag` annotations in test files under the `nala/` directory:
```bash
grep -r "@" nala/ --include="*.test.js" | grep -E "@\w+" -o | sort | uniq
```