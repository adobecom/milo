#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# Milo — zero-to-Claude-Code in one command
#
# Paste into Terminal (no repo needed):
#
#   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/adobecom/milo/stage/setup.sh)"
#
# Already have the repo?  Run from inside it:
#   bash setup.sh
#
# Safe to run multiple times — already-done steps are skipped.
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
ok()   { echo -e "  ${GREEN}✔${NC}  $*"; }
info() { echo -e "  ${YELLOW}→${NC}  $*"; }
skip() { echo -e "  ${YELLOW}–${NC}  $*"; }
err()  { echo -e "  ${RED}✘${NC}  $*" >&2; }
step() { echo -e "\n${BOLD}── $* ──${NC}"; }
manual_steps=()
add_manual() { manual_steps+=("$*"); }

# Arrow-key select menu. Usage: _pick "opt1" "opt2" ...  → sets _PICK to chosen index.
_pick() {
  local -a items=("$@")
  local cur=0 n=${#items[@]} key esc i
  tput civis 2>/dev/null || true
  for i in "${!items[@]}"; do
    [[ $i -eq $cur ]] \
      && echo -e "  ${GREEN}›${NC}  ${BOLD}${items[$i]}${NC}" \
      || echo -e "     ${items[$i]}"
  done
  while true; do
    IFS= read -r -s -n1 key
    if [[ $key == $'\x1b' ]]; then
      IFS= read -r -s -n2 esc
      case "$esc" in
        '[A') (( cur > 0   )) && (( cur-- )) || true ;;
        '[B') (( cur < n-1 )) && (( cur++ )) || true ;;
      esac
    elif [[ $key == '' ]]; then
      break
    fi
    printf "\033[%dA" "$n"
    for i in "${!items[@]}"; do
      [[ $i -eq $cur ]] \
        && echo -e "  ${GREEN}›${NC}  ${BOLD}${items[$i]}${NC}" \
        || echo -e "     ${items[$i]}"
    done
  done
  tput cnorm 2>/dev/null || true
  _PICK=$cur
}

echo ""
echo -e "${BOLD}Milo — Claude Code setup${NC}"
echo "─────────────────────────"

# ── 1. Locate or clone the repo ───────────────────────────────────────────────
step "Repository"

if [[ -f "$PWD/package.json" ]] && grep -q '@adobecom/milo' "$PWD/package.json" 2>/dev/null; then
  REPO_ROOT="$PWD"
  ok "Using existing repo at $REPO_ROOT"
else
  _default="${MILO_DIR:-$HOME/milo}"
  if [[ -d "$_default/.git" ]]; then
    REPO_ROOT="$_default"
    ok "Repo already at $REPO_ROOT"
  else
    # Ask where to clone on first run.
    echo ""
    echo -e "  Where should milo be cloned?"
    echo ""
    _pick \
      "Current folder  (${PWD/$HOME/\~}/milo)" \
      "Home folder     (~/milo)" \
      "Custom path"
    echo ""
    case $_PICK in
      0) REPO_ROOT="$PWD/milo" ;;
      1) REPO_ROOT="$HOME/milo" ;;
      2)
        read -r -p "  Path: " _input
        REPO_ROOT="${_input/#\~/$HOME}"
        ;;
    esac
    echo ""
    info "Cloning → $REPO_ROOT"
    mkdir -p "$(dirname "$REPO_ROOT")"
    git clone -b stage https://github.com/adobecom/milo.git "$REPO_ROOT"
    ok "Cloned"
  fi
fi

# ── 2. Node via nvm ───────────────────────────────────────────────────────────
step "Node.js"
NODE_VERSION="$(cat "$REPO_ROOT/.nvmrc" 2>/dev/null | tr -d '[:space:]' || echo "25")"

NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
_nvm_sh=""
for candidate in \
    "$NVM_DIR/nvm.sh" \
    "$(brew --prefix nvm 2>/dev/null)/nvm.sh" \
    "/usr/local/opt/nvm/nvm.sh"; do
  [[ -s "$candidate" ]] && { _nvm_sh="$candidate"; break; }
done

if [[ -n "$_nvm_sh" ]]; then
  source "$_nvm_sh"
elif ! command -v nvm &>/dev/null 2>&1; then
  info "nvm not found — installing..."
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  source "$NVM_DIR/nvm.sh"
fi

nvm install "$NODE_VERSION" --no-progress 2>&1 | grep -v "^$" || true
nvm use "$NODE_VERSION" 2>&1 | grep -v "^$" || true
nvm alias default "$NODE_VERSION" 2>&1 | grep -v "^$" || true
ok "Node $(node --version)  npm $(npm --version)"

# ── 3. Project dependencies ───────────────────────────────────────────────────
step "Project dependencies"
cd "$REPO_ROOT"

if [[ ! -d "$REPO_ROOT/node_modules" ]] || \
   [[ ! -f "$REPO_ROOT/node_modules/.package-lock.json" ]] || \
   [[ "$REPO_ROOT/package-lock.json" -nt "$REPO_ROOT/node_modules/.package-lock.json" ]]; then
  npm install --silent
  ok "npm packages installed"
else
  skip "npm packages already up to date"
fi

_pw_version="$(node -e "try{process.stdout.write(require('./node_modules/@playwright/test/package.json').version)}catch(e){}" 2>/dev/null || true)"
_pw_stamp="$REPO_ROOT/.playwright-stamp"
if [[ -n "$_pw_version" ]] && [[ "$(cat "$_pw_stamp" 2>/dev/null)" == "$_pw_version" ]]; then
  skip "Playwright browsers already installed (v$_pw_version)"
else
  npx playwright install --quiet 2>/dev/null || npx playwright install
  [[ -n "$_pw_version" ]] && echo "$_pw_version" > "$_pw_stamp" || true
  ok "Playwright browsers installed"
fi

# ── 4. AEM CLI ────────────────────────────────────────────────────────────────
step "AEM CLI  (needed for: npm run libs)"
if command -v aem &>/dev/null; then
  skip "aem already installed ($(aem --version 2>/dev/null || echo 'unknown version'))"
else
  npm install -g @adobe/aem-cli --silent
  ok "aem CLI installed"
fi

# ── 5. da-auth-helper ─────────────────────────────────────────────────────────
step "da-auth-helper  (needed for: /build-content-from-figma)"
if command -v da-auth-helper &>/dev/null; then
  skip "da-auth-helper already installed"
elif npm install -g github:adobe-rnd/da-auth-helper --silent 2>/dev/null; then
  ok "da-auth-helper installed"
else
  info "Could not install automatically — run manually:"
  add_manual "npm install -g github:adobe-rnd/da-auth-helper"
fi
if [[ ! -f "$HOME/.aem/da-token.json" ]]; then
  add_manual "Authenticate DA:  da-auth-helper login   (choose the Skyline profile)"
fi

# ── 6. Claude Code MCP servers ────────────────────────────────────────────────
step "Claude Code MCP servers"

# Re-source nvm so freshly-installed npm globals are on PATH.
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh" --no-use 2>/dev/null || true

CLAUDE_BIN=""
for candidate in \
    "$(command -v claude 2>/dev/null || true)" \
    "$(npm config get prefix 2>/dev/null)/bin/claude" \
    "$HOME/.local/bin/claude" \
    "/usr/local/bin/claude" \
    "/opt/homebrew/bin/claude"; do
  [[ -x "${candidate:-}" ]] && { CLAUDE_BIN="$candidate"; break; }
done

if [[ -z "$CLAUDE_BIN" ]]; then
  info "Claude Code CLI not found — skipping MCP registration"
  add_manual "Install Claude Code:  https://claude.ai/download"
  add_manual "Then re-run this script to register the MCP servers"
else
  _registered="$("$CLAUDE_BIN" mcp list 2>/dev/null || true)"

  _mcp_add() {
    local label="$1"; shift
    if "$CLAUDE_BIN" "$@" 2>/dev/null; then
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
    add_manual "Authenticate Figma MCP:  In Claude Code → /mcp → figma → sign in"
  fi

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
    _mcp_add "Fluffyjaws" mcp add fluffyjaws --scope user -- /opt/homebrew/bin/fj mcp
  else
    info "Fluffyjaws not reachable — Adobe VPN required"
    add_manual "Connect to Adobe VPN, then re-run:  bash $REPO_ROOT/setup.sh"
  fi
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}────────────────────────────────────────────${NC}"
echo -e "${BOLD}  Setup complete!${NC}"
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

if [[ -n "$CLAUDE_BIN" ]]; then
  echo -e "  When ready, open your workspace with:"
  echo -e "  ${BOLD}claude $REPO_ROOT${NC}"
else
  echo -e "  ${YELLOW}Claude Code CLI not found.${NC}"
  echo -e "  Install it:  ${BOLD}npm install -g @anthropic-ai/claude-code${NC}"
  echo -e "  Then open:   ${BOLD}claude $REPO_ROOT${NC}"
fi
echo ""
