# build-content-from-figma

Extracts content from Figma frames (text, headings, links, icons, images) and produces an authored HTML document following the C2 block authoring pattern. Downloads Figma assets locally, uploads them to DA via the admin API, then uploads the HTML document and optionally previews and publishes it.

---

## Prerequisites

### MCPs

| MCP | Notes |
|-----|-------|
| Figma | Official Figma MCP. Requires Figma Dev Mode access. |

**Figma**

```sh
claude mcp add --transport http figma https://mcp.figma.com/mcp --scope user
# Then in Claude: /mcp → choose figma → authenticate
```

After adding the MCP, close and reopen Claude, then run `/mcp` to confirm the connection is active.

### da-auth-helper

```sh
npm install -g github:adobe-rnd/da-auth-helper
da-auth-helper login  # choose the Skyline profile
```

The token is cached at `~/.aem/da-token.json` and refreshed automatically.

---

## Run

```
/build-content-from-figma
```

The skill will prompt for:

| Input | Required | Example |
|-------|----------|---------|
| Figma URL(s) | At least one per viewport | One URL per device size (mobile / tablet / desktop) |
| DA organization | Yes | `adobe` |
| DA repository | Yes | `my-site` |
| DA file path | Yes | `drafts/your-ldap/my-page.html` |

## Output

An HTML document uploaded to DA, media assets in the shadow folder (`content.da.live`), and optionally a previewed and published page. The DA edit link is reported in the final summary.
