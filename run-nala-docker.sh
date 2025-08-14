#!/bin/bash

# Optimized Docker runner for Nala tests with proper caching
# This script builds a custom Docker image with cached dependencies

# Configuration
DOCKER_IMAGE_NAME="milo-nala-tests"
DOCKER_IMAGE_TAG="latest"
FULL_IMAGE_NAME="${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

# Default values
TAGS=""
REPORTER=""
SHARD_INDEX=""
SHARD_TOTAL=""
TEST_FILE=""
FEATURE_BRANCH="${FEATURE_BRANCH:-main}"
PR_BRANCH_LIVE_URL_GH="${PR_BRANCH_LIVE_URL_GH:-https://milo.adobe.com}"
REBUILD=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --tags|-t)
      TAGS="$2"
      shift
      shift
      ;;
    --reporter|-r)
      REPORTER="$2"
      shift
      shift
      ;;
    --shard)
      SHARD_CONFIG="$2"
      SHARD_INDEX=$(echo "$SHARD_CONFIG" | cut -d'/' -f1)
      SHARD_TOTAL=$(echo "$SHARD_CONFIG" | cut -d'/' -f2)
      shift
      shift
      ;;
    --branch|-b)
      FEATURE_BRANCH="$2"
      shift
      shift
      ;;
    --url|-u)
      PR_BRANCH_LIVE_URL_GH="$2"
      shift
      shift
      ;;
    --file|-f)
      TEST_FILE="$2"
      shift
      shift
      ;;
    --rebuild)
      REBUILD=true
      shift
      ;;
    --help|-h)
      echo "Usage: ./run-nala-docker.sh [options]"
      echo ""
      echo "Options:"
      echo "  --tags, -t <tags>        Test tags to run (e.g., '@smoke' or '@regression')"
      echo "  --file, -f <path>        Specific test file to run (e.g., 'fail.test.js')"
      echo "  --reporter, -r <name>    Reporter to use (default: html,list)"
      echo "  --shard <index/total>    Run specific shard (e.g., '1/4')"
      echo "  --branch, -b <name>      Feature branch name (default: main)"
      echo "  --url, -u <url>          Base URL to test against"
      echo "  --rebuild                Force rebuild of Docker image"
      echo "  --help, -h               Show this help message"
      echo ""
      echo "Examples:"
      echo "  # Run all tests"
      echo "  ./run-nala-docker.sh"
      echo ""
      echo "  # Run tests with specific tag"
      echo "  ./run-nala-docker.sh --tags '@smoke'"
      echo ""
      echo "  # Run specific test file"
      echo "  ./run-nala-docker.sh --file fail.test.js"
      echo ""
      echo "  # Force rebuild (when dependencies change)"
      echo "  ./run-nala-docker.sh --rebuild"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check if image exists or rebuild is requested
IMAGE_EXISTS=$(docker images -q ${FULL_IMAGE_NAME} 2> /dev/null)

if [[ -z "$IMAGE_EXISTS" ]] || [[ "$REBUILD" = true ]]; then
  echo "🏗️  Building Docker image with cached dependencies..."
  echo "   This is only needed when:"
  echo "   - First time running"
  echo "   - package.json changes"
  echo "   - Force rebuild with --rebuild"
  echo ""
  
  # Build the Docker image using the Dockerfile
  docker build -f Dockerfile.nala -t ${FULL_IMAGE_NAME} . || {
    echo "❌ Failed to build Docker image"
    exit 1
  }
  
  echo "✅ Docker image built successfully!"
  echo ""
else
  echo "📦 Using existing Docker image (dependencies cached)"
  echo "   Use --rebuild to force a rebuild"
  echo ""
fi

# Prepare environment variables
ENV_VARS=""
ENV_VARS="$ENV_VARS -e GITHUB_ACTION_PATH=/workspace"
ENV_VARS="$ENV_VARS -e GITHUB_REF=refs/heads/${FEATURE_BRANCH}"
ENV_VARS="$ENV_VARS -e GITHUB_HEAD_REF=${FEATURE_BRANCH}"
ENV_VARS="$ENV_VARS -e GITHUB_REPOSITORY=adobecom/milo"
ENV_VARS="$ENV_VARS -e PR_BRANCH_LIVE_URL_GH=${PR_BRANCH_LIVE_URL_GH}"
ENV_VARS="$ENV_VARS -e labels=${TAGS}"
ENV_VARS="$ENV_VARS -e reporter=${REPORTER}"
ENV_VARS="$ENV_VARS -e CI=true"

# Add test file if specified
if [[ ! -z "$TEST_FILE" ]]; then
  # Support both relative and full paths
  if [[ "$TEST_FILE" == /* ]]; then
    # Full path provided
    ENV_VARS="$ENV_VARS -e TEST_FILES=${TEST_FILE}"
  elif [[ "$TEST_FILE" == nala/* ]]; then
    # Path already includes nala/
    ENV_VARS="$ENV_VARS -e TEST_FILES=${TEST_FILE}"
  else
    # Just filename, add nala/ prefix
    ENV_VARS="$ENV_VARS -e TEST_FILES=nala/${TEST_FILE}"
  fi
fi

# Add shard configuration if provided
if [[ ! -z "$SHARD_INDEX" ]] && [[ ! -z "$SHARD_TOTAL" ]]; then
  ENV_VARS="$ENV_VARS -e SHARD_INDEX=${SHARD_INDEX}"
  ENV_VARS="$ENV_VARS -e SHARD_TOTAL=${SHARD_TOTAL}"
fi

# Add IMS credentials if available
if [[ ! -z "$IMS_EMAIL" ]]; then
  ENV_VARS="$ENV_VARS -e IMS_EMAIL=${IMS_EMAIL}"
fi
if [[ ! -z "$IMS_PASS" ]]; then
  ENV_VARS="$ENV_VARS -e IMS_PASS=${IMS_PASS}"
fi

echo "🐳 Starting Nala tests..."
echo "   Image: ${FULL_IMAGE_NAME}"
echo "   Branch: ${FEATURE_BRANCH}"
echo "   URL: ${PR_BRANCH_LIVE_URL_GH}"

if [[ ! -z "$TAGS" ]]; then
  echo "   Tags: ${TAGS}"
fi

if [[ ! -z "$SHARD_INDEX" ]]; then
  echo "   Shard: ${SHARD_INDEX}/${SHARD_TOTAL}"
fi

if [[ ! -z "$TEST_FILE" ]]; then
  echo "   Test file: ${TEST_FILE}"
fi

echo ""

# Run Docker container
# Mount all necessary files from current directory
# The image only contains runtime dependencies (Node, Playwright, npm packages)
docker run --rm -it \
  --ipc=host \
  -v "$(pwd)/playwright.config.js":/workspace/playwright.config.js:ro \
  -v "$(pwd)/nala":/workspace/nala:ro \
  -v "$(pwd)/test-results":/workspace/test-results \
  -v "$(pwd)/test-html-results":/workspace/test-html-results \
  -v "$(pwd)/playwright-report":/workspace/playwright-report \
  $ENV_VARS \
  $FULL_IMAGE_NAME

# Check exit status
EXIT_STATUS=$?

# Verify container actually ran
if [ $EXIT_STATUS -eq 125 ]; then
  echo ""
  echo "❌ Docker failed to run the container"
  echo "   This usually means:"
  echo "   - Docker daemon is not running"
  echo "   - Image failed to pull"
  echo "   - Permission issues"
  echo ""
  echo "Try running: docker pull $FULL_IMAGE_NAME"
  exit 125
fi
if [ $EXIT_STATUS -eq 0 ]; then
  echo ""
  echo "✅ Tests completed successfully!"
  echo ""
  echo "📊 Test results are available in:"
  echo "   - test-results/"
  echo "   - test-html-results/"
  echo "   - playwright-report/"
else
  echo ""
  echo "❌ Tests failed with exit code: $EXIT_STATUS"
  echo ""
  echo "📊 Check test results in:"
  echo "   - test-results/"
  echo "   - test-html-results/"
  echo "   - playwright-report/"
fi

exit $EXIT_STATUS
