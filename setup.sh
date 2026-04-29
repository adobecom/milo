#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# Milo — zero-to-Claude-Code in one command
#
# Paste into Terminal (no repo needed):
#
#   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/adobecom/milo/claudify-milo/setup.sh)"
#
# Already have the repo?  Run from inside it:
#   bash setup.sh
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
ok()   { echo -e "  ${GREEN}✔${NC}  $*"; }
info() { echo -e "  ${YELLOW}→${NC}  $*"; }
err()  { echo -e "  ${RED}✘${NC}  $*" >&2; }
step() { echo -e "\n${BOLD}── $* ──${NC}"; }

echo ""
echo -e "${BOLD}Milo — Claude Code setup${NC}"
echo "─────────────────────────"

# ── 1. Locate or clone the repo ───────────────────────────────────────────────
step "Repository"

# If already inside the milo repo use it, otherwise clone.
if [[ -f "$PWD/package.json" ]] && grep -q '@adobecom/milo' "$PWD/package.json" 2>/dev/null; then
  REPO_ROOT="$PWD"
  ok "Using existing repo at $REPO_ROOT"
else
  REPO_ROOT="${MILO_DIR:-$HOME/repos/milo}"
  if [[ -d "$REPO_ROOT/.git" ]]; then
    ok "Repo already at $REPO_ROOT"
  else
    info "Cloning → $REPO_ROOT"
    mkdir -p "$(dirname "$REPO_ROOT")"
    git clone -b claudify-milo https://github.com/adobecom/milo.git "$REPO_ROOT"
    ok "Cloned"
  fi
fi

# ── 2. Run the in-repo bootstrap ──────────────────────────────────────────────
bash "$REPO_ROOT/bootstrap.sh"

# ── 3. Launch Claude Code in the repo ────────────────────────────────────────
# Re-source nvm so freshly-installed npm globals are on PATH.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh" --no-use 2>/dev/null || true

# Find the claude binary — check PATH, then common install locations.
CLAUDE_BIN=""
for candidate in \
    "$(command -v claude 2>/dev/null || true)" \
    "$(npm bin -g 2>/dev/null)/claude" \
    "$HOME/.local/bin/claude" \
    "/usr/local/bin/claude" \
    "/opt/homebrew/bin/claude"; do
  [[ -x "${candidate:-}" ]] && { CLAUDE_BIN="$candidate"; break; }
done

echo ""
echo -e "${BOLD}────────────────────────────────────────────${NC}"
echo -e "${BOLD}  Setup complete!${NC}"
echo -e "${BOLD}────────────────────────────────────────────${NC}"
echo ""

if [[ -n "$CLAUDE_BIN" ]]; then
  echo -e "  Opening Claude Code in your milo workspace…"
  echo ""
  cd "$REPO_ROOT"
  exec "$CLAUDE_BIN"
else
  echo -e "  ${YELLOW}Claude Code CLI not found.${NC}"
  echo ""
  echo -e "  Install it:  ${BOLD}npm install -g @anthropic-ai/claude-code${NC}"
  echo -e "  Then open:   ${BOLD}claude $REPO_ROOT${NC}"
  echo ""
fi
