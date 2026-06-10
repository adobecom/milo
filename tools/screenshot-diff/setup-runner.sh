#!/usr/bin/env bash
# Bootstrap a Mac Mini as a self-hosted GitHub Actions runner for the
# screenshot-diff tool.
#
# Usage on each Mac Mini (after SCP'ing this script):
#   chmod +x setup-runner.sh
#   ./setup-runner.sh <runner-name> <gh-registration-url> <gh-registration-token>
#
# Where:
#   <runner-name>           — e.g. mac-mini-233, mac-mini-235, mac-mini-236
#   <gh-registration-url>   — https://github.com/JackySun9/milo (or org URL when promoted)
#   <gh-registration-token> — Token from GitHub UI: Settings → Actions → Runners → New runner
#
# After registration the runner is installed as a launchd service so it
# survives reboots automatically.

set -euo pipefail

NAME="${1:-}"
URL="${2:-}"
TOKEN="${3:-}"

if [[ -z "$NAME" || -z "$URL" || -z "$TOKEN" ]]; then
  echo "Usage: $0 <runner-name> <gh-url> <gh-token>"
  exit 1
fi

LABELS="self-hosted,macOS,screendiff"
RUNNER_VERSION="2.328.0"
ARCH="$(uname -m)"
case "$ARCH" in
  arm64) RUNNER_ARCH="osx-arm64" ;;
  x86_64) RUNNER_ARCH="osx-x64" ;;
  *) echo "Unsupported arch: $ARCH"; exit 1 ;;
esac

WORK_DIR="$HOME/actions-runner-screenshot-diff"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# 1. Toolchain — Node + Playwright system deps
if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]]; then
  echo "▶ Installing Node 20 via Homebrew"
  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew not found. Install from https://brew.sh first."
    exit 1
  fi
  brew install node@20
  brew link --overwrite --force node@20
fi
echo "✓ Node $(node -v)"

# 2. GitHub Actions runner agent
if [[ ! -f "./run.sh" ]]; then
  echo "▶ Downloading runner agent v${RUNNER_VERSION} ($RUNNER_ARCH)"
  curl -fL -o runner.tar.gz \
    "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-${RUNNER_ARCH}-${RUNNER_VERSION}.tar.gz"
  tar xzf runner.tar.gz
  rm runner.tar.gz
fi

# 3. Configure
echo "▶ Configuring runner '$NAME' for $URL"
./config.sh \
  --url "$URL" \
  --token "$TOKEN" \
  --name "$NAME" \
  --labels "$LABELS" \
  --work "_work" \
  --replace \
  --unattended

# 4. Install as launchd service (so it auto-starts on reboot)
echo "▶ Installing launchd service"
sudo ./svc.sh install
sudo ./svc.sh start

# 5. Smoke check
sleep 3
echo ""
echo "▶ Service status:"
sudo ./svc.sh status || true

echo ""
echo "✓ Done. Runner '$NAME' registered with labels: $LABELS"
echo "  Verify in GitHub: $URL/settings/actions/runners"
