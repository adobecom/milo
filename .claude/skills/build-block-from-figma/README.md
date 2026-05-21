# build-block-from-figma

Builds a new C2 block component from Figma designs. Reads Figma frames, generates block JS and CSS under `libs/c2/blocks/`, then runs a visual comparison loop (Playwright), an axe-core accessibility audit (WCAG 2.2 AA), and a Lighthouse performance audit. Supports localhost dev servers and DA-published (`.aem.live`) pages via a remote feature branch.

---

## Prerequisites

### MCPs

| MCP | Notes |
|-----|-------|
| Figma | Official Figma MCP. Requires Figma Dev Mode access. |
| Playwright | Browser automation for visual validation. |
| Fluffyjaws | EDS/AEM convention lookups. Requires Adobe VPN. |

**Figma**

```sh
claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user
# Then in Claude: /mcp → choose figma → authenticate
```

**Playwright**

```sh
claude mcp add playwright npx @playwright/mcp@latest --scope user
```

**Fluffyjaws** (requires Adobe VPN)

Step 1 — install the CLI:

```sh
API_BASE=https://fluffyjaws.adobe.com; \
if curl -fsSL "$API_BASE/" -o /dev/null 2>/dev/null; then \
  curl -fsSL "$API_BASE/api/cli/install.sh" | bash; \
else echo "VPN required. Connect to VPN and retry." 1>&2; false; fi
```

Step 2 — add to `~/.claude.json` under `mcpServers`:

```json
"fluffyjaws": {
  "type": "stdio",
  "command": "/opt/homebrew/bin/fj",
  "args": ["mcp"]
}
```

After adding all three MCPs, close and reopen Claude, then run `/mcp` to confirm the connections are active.

### Node dev dependencies

Requires Node 22:

```sh
nvm install 22 && nvm alias default 22
npm install --save-dev lighthouse chrome-launcher @axe-core/playwright
```

---

## Run

```
/build-block-from-figma
```

The skill will prompt for:

| Input | Required | Example |
|-------|----------|---------|
| Preview URL | Yes | `http://localhost:6456/path` or `https://main--repo--org.aem.live/path` |
| Figma URL — Mobile (≤767 px) | At least one | Figma frame link |
| Figma URL — Tablet (768–1279 px) | No | Figma frame link |
| Figma URL — Desktop (≥1280 px) | No | Figma frame link |
| Base branch | No (default: `stage`) | `feature/my-branch` |

## Output

New files at `libs/c2/blocks/<name>/<name>.js` and `.css`, the block name registered in `C2_BLOCKS` in `utils.js`, a feature branch (remote mode), and a final summary with accessibility and performance results.
