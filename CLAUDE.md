# Milo — Claude Code Setup

This file documents everything needed to use Claude Code and its skills in this repo after a fresh clone.

---

## 1. Node.js version

This repo requires **Node 25** (LTS). Use [nvm](https://github.com/nvm-sh/nvm):

```sh
nvm install 25
nvm use 25          # or: nvm alias default 25 to set it globally
```

An `.nvmrc` is present in the repo root; `nvm use` (no arguments) will pick it up automatically.

---

## 2. Install project dependencies

```sh
npm install
npx playwright install   # downloads Chromium/Firefox/WebKit browsers used by tests and skills
```

---

## 3. Global tools

### AEM CLI — required for `npm run libs`

```sh
npm install -g @adobe/aem-cli
```

Verify: `aem --version`

### da-auth-helper — required for `build-content-from-figma`

Uploads HTML and media assets directly to Document Authoring (DA).

```sh
npm install -g github:adobe-rnd/da-auth-helper
da-auth-helper login    # opens browser — choose the Skyline profile
da-auth-helper token    # verify the token is cached
```

The token is stored at `~/.aem/da-token.json` and refreshed automatically on expiry.

---

## 4. Claude Code MCP servers

Skills in this repo rely on three MCP servers. Run these commands once per machine (they register globally with `--scope user`).

### Figma — required for `build-block-from-figma` and `build-content-from-figma`

```sh
claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user
```

Then in Claude: type `/mcp`, choose **figma**, and authenticate with your Figma account. Requires Figma Dev Mode access.

### Playwright — required for `build-block-from-figma` and `build-scroll-animation`

```sh
claude mcp add playwright npx @playwright/mcp@latest --scope user
```

### Fluffyjaws — required for `build-block-from-figma`

Provides authoritative Adobe EDS conventions. Requires Adobe VPN.

**Step 1 — install the CLI** (connect to VPN first):

```sh
API_BASE=https://fluffyjaws.adobe.com
if curl -fsSL "$API_BASE/" -o /dev/null 2>/dev/null; then
  curl -fsSL "$API_BASE/api/cli/install.sh" | bash
else
  echo "VPN required. Connect and retry."
fi
```

**Step 2 — register as an MCP server** in `~/.claude.json` under `mcpServers`:

```json
"fluffyjaws": {
  "type": "stdio",
  "command": "/opt/homebrew/bin/fj",
  "args": ["mcp", "--api", "https://fluffyjaws.adobe.com"]
}
```

After adding all MCPs, close and reopen Claude, then run `/mcp` to confirm all three connections are active.

---

## 5. Available skills

Run any skill by typing its name as a slash command in Claude Code.

### `/build-block-from-figma`

Builds a new C2 block component (`libs/c2/blocks/`) from Figma designs. Validates visually with Playwright screenshots, runs an axe-core accessibility audit (WCAG 2.2 AA), and a Lighthouse performance audit.

**Requires:** Figma MCP, Playwright MCP, Fluffyjaws MCP, Node 25, `npm install`

**Prompts for:**
- Preview URL (`http://localhost:6456/...` or `https://main--repo--org.aem.live/...`)
- Figma frame URLs for each viewport (mobile, tablet, desktop, HD)
- Base branch (default: `stage`)

**Outputs:** `libs/c2/blocks/<name>/<name>.js` + `.css`, block registered in `utils.js`, optional feature branch on `adobecom/milo`.

---

### `/build-content-from-figma`

Extracts content from Figma frames (text, headings, links, icons, images) and produces an authored HTML document. Downloads Figma assets locally, uploads them to DA via the admin API, then optionally previews and publishes.

**Requires:** Figma MCP, `da-auth-helper`

**Prompts for:**
- Figma frame URL(s), one per viewport
- DA organization, repository, and file path

**Outputs:** HTML + media uploaded to DA, edit link, optional preview/live URLs.

---

### `/build-scroll-animation`

Builds CSS scroll-driven animations for C2 blocks. Recommends existing `parallax-*` classes when possible, otherwise creates new ones using the Scroll-Driven Animations API. All CSS goes into the `@supports (animation-timeline: view())` block in `libs/c2/styles/styles.css`.

**Requires:** Playwright MCP

**Prompts for:**
- Block name (e.g. `base-card`)
- Preview URL
- Animation instructions (text description; screenshots of start/mid/end states are accepted, video is not)

**Outputs:** CSS appended to `libs/c2/styles/styles.css`, Playwright verification results per breakpoint, reduced-motion compliance status.

---

## 6. Common development commands

```sh
npm run libs          # serve milo at http://localhost:6456 (requires AEM CLI)
npm run test          # run unit tests
npm run lint          # lint JS and CSS
npx lighthouse <url>  # run a Lighthouse audit (lighthouse is in devDependencies)
```

For Nala E2E tests:

```sh
npm run nala local                            # run against local server
npm run nala local test=my-block.test.js      # single test file
```
