# Milo — Claude Code Setup

Paste this into your terminal — no repo needed:

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/adobecom/milo/stage/setup.sh)"
```

It clones the repo, installs everything, and opens Claude Code automatically.

Two auth steps must be done manually afterward (browser OAuth flows):

1. **Figma MCP** — In Claude Code, run `/mcp` → choose **figma** → sign in.
2. **DA uploads** — `da-auth-helper login` (choose the Skyline profile). Token cached at `~/.aem/da-token.json`.

Then run `/mcp` to confirm all three MCP connections are active.

---

## Available skills

### `/build-block-from-figma`

Builds a new C2 block (`libs/c2/blocks/`) from Figma designs. Validates visually with Playwright, runs axe-core (WCAG 2.2 AA), and a Lighthouse audit.

**Requires:** Figma MCP, Playwright MCP, Fluffyjaws MCP

**Prompts for:** Preview URL, Figma frame URLs per viewport, base branch (default: `stage`)

**Outputs:** `libs/c2/blocks/<name>/<name>.js` + `.css`, block registered in `utils.js`, optional feature branch on `adobecom/milo`.

---

### `/build-content-from-figma`

Extracts content from Figma frames and produces an authored HTML document. Uploads assets and HTML to DA, optionally previews and publishes.

**Requires:** Figma MCP, `da-auth-helper`

**Prompts for:** Figma frame URL(s) per viewport, DA org / repo / file path

**Outputs:** HTML + media uploaded to DA, edit link, optional preview/live URLs.

---

### `/build-scroll-animation`

Builds CSS scroll-driven animations for C2 blocks using the Scroll-Driven Animations API. All CSS goes into the `@supports (animation-timeline: view())` block in `libs/c2/styles/styles.css`.

**Requires:** Playwright MCP

**Prompts for:** Block name, preview URL, animation instructions (screenshots of start/mid/end accepted; no video)

**Outputs:** CSS appended to `libs/c2/styles/styles.css`, Playwright verification per breakpoint, reduced-motion compliance status.

---

## Common development commands

```sh
npm run libs          # serve milo at http://localhost:6456 (requires AEM CLI)
npm run test          # run unit tests
npm run lint          # lint JS and CSS
npx lighthouse <url>  # Lighthouse audit
```

```sh
npm run nala local                            # Nala E2E tests against local server
npm run nala local test=my-block.test.js      # single test file
```
