#!/bin/bash

TAGS=""
REPORTER=""
EXCLUDE_TAGS="--grep-invert nopr"
EXIT_STATUS=0

echo "GITHUB_REF: $GITHUB_REF"
echo "GITHUB_HEAD_REF: $GITHUB_HEAD_REF"

if [[ "$GITHUB_REF" == refs/pull/* ]]; then
  # extract PR number and branch name
  PR_NUMBER=$(echo "$GITHUB_REF" | awk -F'/' '{print $3}')
  FEATURE_BRANCH="$GITHUB_HEAD_REF"
elif [[ "$GITHUB_REF" == refs/heads/* ]]; then
  # extract branch name from GITHUB_REF
  FEATURE_BRANCH=$(echo "$GITHUB_REF" | awk -F'/' '{print $3}')
else
  echo "Unknown reference format"
fi

# Replace "/" characters in the feature branch name with "-"
FEATURE_BRANCH=$(echo "$FEATURE_BRANCH" | sed 's/\//-/g')

echo "PR Number: ${PR_NUMBER:-"N/A"}"
echo "Feature Branch Name: $FEATURE_BRANCH"

repository=${GITHUB_REPOSITORY}
repoParts=(${repository//\// }) 
toRepoOrg=${repoParts[0]}
toRepoName=${repoParts[1]}

prRepo=${prRepo:-$toRepoName}
prOrg=${prOrg:-$toRepoOrg}

# Handle PR Branch Live URL
if [[ "$FEATURE_BRANCH" == "main" ]]; then
  PR_BRANCH_LIVE_URL_GH="https://milo.adobe.com"
else
  PR_BRANCH_LIVE_URL_GH="https://${FEATURE_BRANCH}--${prRepo}--${prOrg}.aem.live"
fi

# set pr branch url as env
export PR_BRANCH_LIVE_URL_GH
export PR_NUMBER

echo "PR Branch live URL: $PR_BRANCH_LIVE_URL_GH"

# Note: Branch purging is now handled by a separate GitHub Actions job
# This ensures it only happens once before all test shards begin

# Convert GitHub Tag(@) labels that can be grepped
for label in ${labels}; do
  if [[ "$label" = \@* ]]; then
    label="${label:1}"
    TAGS+="|$label"
  fi
done

# Remove the first pipe from tags if tags are not empty
[[ ! -z "$TAGS" ]] && TAGS="${TAGS:1}" && TAGS="-g $TAGS"

# Retrieve GitHub reporter parameter if not empty
# Otherwise, use reporter settings in playwright.config.js
REPORTER=$reporter
[[ ! -z "$REPORTER" ]] && REPORTER="--reporter $REPORTER"

echo "Running Nala on branch: $FEATURE_BRANCH "
echo "Tags : ${TAGS:-"No @tags or annotations on this PR"}"

# Display sharding info if available
if [[ ! -z "$SHARD_INDEX" ]] && [[ ! -z "$SHARD_TOTAL" ]]; then
  echo "Shard Configuration: Running shard ${SHARD_INDEX} of ${SHARD_TOTAL}"
fi

echo "Run Command : npx playwright test ${TAGS} ${EXCLUDE_TAGS} ${REPORTER}"
echo "Environment CI: $CI"
echo "SHARD_INDEX for JSON reporter: $SHARD_INDEX"
echo -e "\n"
echo "*******************************"

# Navigate to the GitHub Action path (dependencies already installed)
cd "$GITHUB_ACTION_PATH" || exit

# Skip dependency installation if running in GitHub Actions or Docker container
if [[ -z "$GITHUB_ACTIONS" ]] && [[ -z "$CONTAINER" ]]; then
  echo "Installing dependencies locally..."
  npm ci
  npx playwright install --with-deps
else
  echo "Dependencies already installed (GitHub Actions or Docker container)"
fi

# Run Playwright tests on the specific projects using root-level playwright.config.js
# Support sharding if SHARD_INDEX and SHARD_TOTAL are provided
echo "*** Running tests on specific projects ***"

# Debug environment variables
echo "SHARD_INDEX environment variable: ${SHARD_INDEX}"
echo "SHARD_TOTAL environment variable: ${SHARD_TOTAL}"

# Calculate optimal worker count for sharded tests
# When running sharded tests, adjust workers based on shard size
# This ensures we don't overwhelm resources with too many workers per shard
if [[ ! -z "$SHARD_INDEX" ]] && [[ ! -z "$SHARD_TOTAL" ]]; then
  # Formula: Use fewer workers when we have more shards (since tests are distributed)
  # Min 2 workers, max 7 workers, optimal is ~30 tests total / number of shards
  OPTIMAL_WORKERS=$((30 / SHARD_TOTAL))
  OPTIMAL_WORKERS=$((OPTIMAL_WORKERS < 2 ? 2 : OPTIMAL_WORKERS))
  OPTIMAL_WORKERS=$((OPTIMAL_WORKERS > 7 ? 7 : OPTIMAL_WORKERS))
  export PLAYWRIGHT_WORKERS=$OPTIMAL_WORKERS
  echo "Setting PLAYWRIGHT_WORKERS=$PLAYWRIGHT_WORKERS for shard $SHARD_INDEX/$SHARD_TOTAL"
fi

# Ensure output directories exist
mkdir -p test-results test-html-results

# Build sharding parameters if provided
SHARD_PARAMS=""
if [[ ! -z "$SHARD_INDEX" ]] && [[ ! -z "$SHARD_TOTAL" ]]; then
  SHARD_PARAMS="--shard=${SHARD_INDEX}/${SHARD_TOTAL}"
  echo "Running shard ${SHARD_INDEX} of ${SHARD_TOTAL}"
fi

# Check if specific test files are provided
if [[ ! -z "$TEST_FILES" ]]; then
  echo "Running specific test files: $TEST_FILES"
  
  FORCE_COLOR=0 PLAYWRIGHT_HTML_OPEN=never npx playwright test $TEST_FILES --config=./playwright.config.js ${TAGS} ${EXCLUDE_TAGS} --project=milo-live-chromium --project=milo-live-firefox --project=milo-live-webkit ${REPORTER} || EXIT_STATUS=$?
else
  # Use standard sharding
  FORCE_COLOR=0 PLAYWRIGHT_HTML_OPEN=never npx playwright test --config=./playwright.config.js ${TAGS} ${EXCLUDE_TAGS} --project=milo-live-chromium --project=milo-live-firefox --project=milo-live-webkit ${SHARD_PARAMS} ${REPORTER} || EXIT_STATUS=$?
fi


# Debug: Check what files were created
echo "Contents of test-results directory after test run:"
ls -la test-results/ || echo "test-results directory not found"

# Check for any JSON files
echo "JSON files in test-results:"
find test-results -name "*.json" -type f 2>/dev/null || echo "No JSON files found"

# Check for JSON files at root
echo "JSON files at root level:"
ls -la *.json 2>/dev/null || echo "No JSON files at root"

# Check if JSON report was created
if [ -f "test-results/test-results.json" ]; then
  echo "✓ JSON report created: test-results/test-results.json"
  if [[ ! -z "$SHARD_INDEX" ]]; then
    echo "  (Will be renamed to test-results-shard-${SHARD_INDEX}.json when collected)"
  fi
else
  echo "WARNING: No JSON report found at test-results/test-results.json"
fi

# Check if tests passed or failed
if [ $EXIT_STATUS -ne 0 ]; then
  echo "Some tests failed. Exiting with error."
  exit $EXIT_STATUS
else
  echo "All tests passed successfully."
fi
