# performance-audit

Audits Core Web Vitals, FPS, and CPU/GPU metrics for any web page — unthrottled desktop and mid-tier mobile — then produces prioritised, actionable improvement suggestions.

## Required MCP

Playwright must be installed via MCP:

```bash
claude mcp add playwright npx @playwright/mcp@latest --scope user
```

Restart Claude after adding, then confirm with `/mcp`. You should see `playwright` in the list.

## How to use

Run `/performance-audit` and provide a page URL. Accepted formats:

- Local dev server: `http://localhost:3000/path`
- AEM preview/live: `https://main--repo--org.aem.page/path`
- Production: any `https://` URL

## What it measures

**Two passes:**

| Pass | Viewport | CPU | Network |
|------|----------|-----|---------|
| Desktop baseline | 1440×900 | None | None |
| Desktop throttled | 1440×900 | 4× slowdown | None |

**Metrics collected each pass:**

- **LCP** — Largest Contentful Paint (via `PerformanceObserver`)
- **CLS** — Cumulative Layout Shift, with shift source DOM nodes
- **INP** — Interaction to Next Paint (longest event duration during scroll)
- **FPS** — Frames per second measured over a full-page scroll
- **Forced reflow** — Detected via `LayoutDuration` and layout-to-script ratio; flags JS that reads layout properties inside scroll/resize handlers
- **Resource timing** — URL, type, transfer KB, decoded KB, render-blocking flag
- **CDP metrics** — TaskDuration, ScriptDuration, RecalcStyleDuration, LayoutDuration, JSHeapUsedSize, GPUMainFrameUsedTextureMegaBytes

## Deliverables

- Side-by-side metric table (desktop vs. desktop throttle)
- Resource budget breakdown by type
- Up to 7 prioritised findings, each with a specific element or file and a concrete fix
- Screenshots saved to `/tmp/perf-baseline.png` and `/tmp/perf-throttled.png`
