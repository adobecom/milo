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

# Purge the PR branch before running tests
echo "Purging branch: $FEATURE_BRANCH"
PURGE_URL="https://admin.hlx.page/code/$prOrg/$prRepo/$FEATURE_BRANCH/*"

echo "Executing: curl -si -X POST \"$PURGE_URL\""
PURGE_RESPONSE=$(curl -si -X POST "$PURGE_URL")

echo "Waiting 10 seconds for purge to complete..."
sleep 10

# Check if the purge was successful
if echo "$PURGE_RESPONSE" | grep -q "202"; then
  echo "Branch $FEATURE_BRANCH successfully purged"
else
  echo "Failed to purge branch $FEATURE_BRANCH"
  echo "Response: $PURGE_RESPONSE"
fi

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
echo -e "\n"
echo "*******************************"

# Navigate to the GitHub Action path and install dependencies
cd "$GITHUB_ACTION_PATH" || exit
npm ci
npx playwright install --with-deps

# Run Playwright tests on the specific projects using root-level playwright.config.js
# Support sharding if SHARD_INDEX and SHARD_TOTAL are provided
echo "*** Running tests on specific projects ***"

# Build sharding parameters if provided
SHARD_PARAMS=""
if [[ ! -z "$SHARD_INDEX" ]] && [[ ! -z "$SHARD_TOTAL" ]]; then
  SHARD_PARAMS="--shard=${SHARD_INDEX}/${SHARD_TOTAL}"
  echo "Running shard ${SHARD_INDEX} of ${SHARD_TOTAL}"
fi

npx playwright test --config=./playwright.config.js ${TAGS} ${EXCLUDE_TAGS} --project=milo-live-chromium --project=milo-live-firefox --project=milo-live-webkit ${SHARD_PARAMS} ${REPORTER} || EXIT_STATUS=$?

# Check if tests passed or failed
if [ $EXIT_STATUS -ne 0 ]; then
  echo "Some tests failed. Exiting with error."
  exit $EXIT_STATUS
else
  echo "All tests passed successfully."
fi
