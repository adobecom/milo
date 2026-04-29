# Milo — Claude Code Setup

This file documents everything needed to use Claude Code and its skills in this repo after a fresh clone.

---

## Quick start

```sh
git clone https://github.com/adobecom/milo.git
cd milo
bash bootstrap.sh
```

`bootstrap.sh` handles steps 1–4 automatically. It will print any remaining manual steps (auth) at the end.

---

## What the bootstrap script does

### 1. Node.js (via nvm)

Installs and activates Node **25** (pinned in `.nvmrc`). Installs nvm itself if not present.

### 2. Project dependencies

```sh
npm install
npx playwright install   # Chromium/Firefox/WebKit browsers for tests and skills
```

### 3. Global tools

| Tool | Purpose |
|------|---------|
| `@adobe/aem-cli` | Required for `npm run libs` (local dev server) |
| `da-auth-helper` | Required for `/build-content-from-figma` — uploads assets to DA |

### 4. Claude Code MCP servers

| MCP | Required by | Notes |
|-----|-------------|-------|
| Figma | `/build-block-from-figma`, `/build-content-from-figma` | Requires Figma Dev Mode access |
| Playwright | `/build-block-from-figma`, `/build-scroll-animation` | Browser automation |
| Fluffyjaws | `/build-block-from-figma` | Adobe EDS conventions. **Requires Adobe VPN** |

The script registers Figma and Playwright automatically. Fluffyjaws is registered if the Adobe VPN is reachable at run time; if not, re-run the script with VPN connected.

---

## Manual steps after bootstrap

The script prints these at the end, but for reference:

**1. Authenticate the Figma MCP**
In Claude Code, run `/mcp` → choose **figma** → sign in with your Figma account.

**2. Authenticate DA (for `/build-content-from-figma`)**
```sh
da-auth-helper login   # opens browser — choose the Skyline profile
da-auth-helper token   # verify the token is cached
```
The token is stored at `~/.aem/da-token.json` and refreshed automatically on expiry.

**3. Fluffyjaws (if VPN was not connected during bootstrap)**
Connect to Adobe VPN, then re-run `bash bootstrap.sh`.

After all steps, restart Claude Code and run `/mcp` to confirm all three MCP connections are active.

---

## Available skills

Run any skill by typing its name as a slash command in Claude Code.

### `/build-block-from-figma`

Builds a new C2 block component (`libs/c2/blocks/`) from Figma designs. Validates visually with Playwright screenshots, runs an axe-core accessibility audit (WCAG 2.2 AA), and a Lighthouse performance audit.

**Requires:** Figma MCP, Playwright MCP, Fluffyjaws MCP

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

## Common development commands

```sh
npm run libs          # serve milo at http://localhost:6456 (requires AEM CLI)
npm run test          # run unit tests
npm run lint          # lint JS and CSS
npx lighthouse <url>  # Lighthouse audit (lighthouse is in devDependencies)
```

For Nala E2E tests:

```sh
npm run nala local                            # run against local server
npm run nala local test=my-block.test.js      # single test file
```
