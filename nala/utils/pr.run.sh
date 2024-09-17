#!/bin/bash

TAGS=""
REPORTER=""
EXCLUDE_TAGS="--grep-invert nopr"
EXIT_STATUS=0
PR_NUMBER=$(echo "$GITHUB_REF" | awk -F'/' '{print $3}')
echo "PR Number: $PR_NUMBER"

# Extract feature branch name from GITHUB_HEAD_REF
FEATURE_BRANCH="$GITHUB_HEAD_REF"
# Replace "/" characters in the feature branch name with "-"
FEATURE_BRANCH=$(echo "$FEATURE_BRANCH" | sed 's/\//-/g')
echo "Feature Branch Name: $FEATURE_BRANCH"

PR_BRANCH_LIVE_URL_GH="https://$FEATURE_BRANCH--$prRepo--$prOrg.hlx.live"
# set pr branch url as env
export PR_BRANCH_LIVE_URL_GH
export PR_NUMBER

echo "PR Branch live URL: $PR_BRANCH_LIVE_URL_GH"
echo "*******************************"

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

echo "*** Running Nala on $FEATURE_BRANCH ***"
echo "Tags : $TAGS"
echo "npx playwright test ${TAGS} ${EXCLUDE_TAGS} ${REPORTER}"

# Navigate to the GitHub Action path and install dependencies
cd "$GITHUB_ACTION_PATH" || exit
npm ci
npx playwright install --with-deps

# Run Playwright tests on the specific projects using root-level playwright.config.js
# This will be changed later
echo "*** Running tests on specific projects ***"
npx playwright test --config=./playwright.config.js ${TAGS} ${EXCLUDE_TAGS} --project=milo-live-chromium --project=milo-live-firefox ${REPORTER} || EXIT_STATUS=$?

# Check if tests passed or failed
if [ $EXIT_STATUS -ne 0 ]; then
  echo "Some tests failed. Exiting with error."
  exit $EXIT_STATUS
else
  echo "All tests passed successfully."
fi
