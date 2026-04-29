#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# Milo — Claude Code bootstrap
#
# Sets up everything needed to use the Claude Code skills in this repo.
# Safe to run multiple times — already-installed items are skipped.
#
# Usage (from repo root):
#   bash bootstrap.sh
#
# Or directly after cloning:
#   git clone https://github.com/adobecom/milo.git && cd milo && bash bootstrap.sh
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'
ok()   { echo -e "  ${GREEN}✔${NC}  $*"; }
info() { echo -e "  ${YELLOW}→${NC}  $*"; }
skip() { echo -e "  ${YELLOW}–${NC}  $*"; }
step() { echo -e "\n${BOLD}── $* ──${NC}"; }
manual_steps=()
add_manual() { manual_steps+=("$*"); }

# ── Repo root ─────────────────────────────────────────────────────────────────
# When piped via curl, BASH_SOURCE[0] is empty; fall back to CWD.
if [[ -n "${BASH_SOURCE[0]:-}" && "${BASH_SOURCE[0]}" != "bash" ]]; then
  REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
  REPO_ROOT="$(pwd)"
fi

if [[ ! -f "$REPO_ROOT/package.json" ]]; then
  err "Run this script from the milo repo root."
  exit 1
fi

echo ""
echo -e "${BOLD}Milo — Claude Code bootstrap${NC}"
echo "────────────────────────────"

# ── 1. Node via nvm ───────────────────────────────────────────────────────────
step "Node.js"
NODE_VERSION="$(cat "$REPO_ROOT/.nvmrc" 2>/dev/null | tr -d '[:space:]' || echo "25")"

# Source nvm from any of the common install locations.
NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
_nvm_sh=""
for candidate in \
    "$NVM_DIR/nvm.sh" \
    "$(brew --prefix nvm 2>/dev/null)/nvm.sh" \
    "/usr/local/opt/nvm/nvm.sh"; do
  [[ -s "$candidate" ]] && { _nvm_sh="$candidate"; break; }
done

if [[ -n "$_nvm_sh" ]]; then
  # shellcheck source=/dev/null
  source "$_nvm_sh"
elif ! command -v nvm &>/dev/null 2>&1; then
  info "nvm not found — installing..."
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  # shellcheck source=/dev/null
  source "$NVM_DIR/nvm.sh"
fi

nvm install "$NODE_VERSION" --no-progress 2>&1 | grep -v "^$" || true
nvm use "$NODE_VERSION" 2>&1 | grep -v "^$" || true
ok "Node $(node --version)  npm $(npm --version)"

# ── 2. Project dependencies ───────────────────────────────────────────────────
step "Project dependencies"
cd "$REPO_ROOT"
npm install --silent
ok "npm packages installed"

npx playwright install --quiet 2>/dev/null || npx playwright install
ok "Playwright browsers installed"

# ── 3. AEM CLI ────────────────────────────────────────────────────────────────
step "AEM CLI  (needed for: npm run libs)"
if command -v aem &>/dev/null; then
  skip "aem already installed ($(aem --version 2>/dev/null || echo 'unknown version'))"
else
  npm install -g @adobe/aem-cli --silent
  ok "aem CLI installed"
fi

# ── 4. da-auth-helper ─────────────────────────────────────────────────────────
step "da-auth-helper  (needed for: /build-content-from-figma)"
if command -v da-auth-helper &>/dev/null; then
  skip "da-auth-helper already installed"
elif npm install -g github:adobe-rnd/da-auth-helper --silent 2>/dev/null; then
  ok "da-auth-helper installed"
else
  info "Could not install automatically — run manually:"
  add_manual "npm install -g github:adobe-rnd/da-auth-helper"
fi
add_manual "Authenticate DA:  da-auth-helper login   (choose the Skyline profile)"

# ── 5. Claude Code MCP servers ────────────────────────────────────────────────
step "Claude Code MCP servers"
if ! command -v claude &>/dev/null; then
  info "Claude Code CLI not found — skipping MCP registration"
  add_manual "Install Claude Code:  https://code.claude.com"
  add_manual "Then re-run this script to register the MCP servers"
else
  _registered="$(claude mcp list 2>/dev/null || true)"

  # Helper: attempt a claude mcp add command; if it fails, queue a manual step.
  _mcp_add() {
    local label="$1"; shift
    if claude "$@" 2>/dev/null; then
      ok "$label MCP registered"
    else
      info "$label MCP could not be registered automatically — run manually:"
      add_manual "claude $*"
    fi
  }

  # Figma
  if echo "$_registered" | grep -qi "figma"; then
    skip "Figma MCP already registered"
  else
    _mcp_add "Figma" mcp add --transport http figma https://mcp.figma.com/mcp --scope user
  fi
  add_manual "Authenticate Figma MCP:  In Claude Code → /mcp → figma → sign in"

  # Playwright
  if echo "$_registered" | grep -qi "playwright"; then
    skip "Playwright MCP already registered"
  else
    _mcp_add "Playwright" mcp add playwright npx @playwright/mcp@latest --scope user
  fi

  # Fluffyjaws (requires Adobe VPN)
  if echo "$_registered" | grep -qi "fluffyjaws"; then
    skip "Fluffyjaws MCP already registered"
  elif curl -fsSL --max-time 3 https://fluffyjaws.adobe.com/ -o /dev/null 2>/dev/null; then
    curl -fsSL https://fluffyjaws.adobe.com/api/cli/install.sh | bash
    _mcp_add "Fluffyjaws" mcp add fluffyjaws --scope user -- /opt/homebrew/bin/fj mcp --api https://fluffyjaws.adobe.com
  else
    info "Fluffyjaws not reachable — Adobe VPN required"
    add_manual "Connect to Adobe VPN, then re-run:  bash bootstrap.sh"
  fi
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}────────────────────────────────────────────${NC}"
echo -e "${BOLD}  Bootstrap complete${NC}"
echo -e "${BOLD}────────────────────────────────────────────${NC}"

if [[ ${#manual_steps[@]} -gt 0 ]]; then
  echo ""
  echo -e "${YELLOW}  Remaining manual steps:${NC}"
  i=1
  for s in "${manual_steps[@]}"; do
    echo "  $i. $s"
    (( i++ ))
  done
fi

echo ""
echo "  Restart Claude Code, then run /mcp to verify"
echo "  all server connections are active."
echo ""
