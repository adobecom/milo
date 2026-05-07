# Playwright Setup Notes

Reference for `agents/metrics-collector.md`. Describes constraints and patterns for the Playwright MCP.

## Page lifecycle rules

- **Always call `browser_close` before `browser_run_code`** — resets the MCP's tracked page state.
- **Never call `browser_navigate` before `browser_run_code`** — it loads the page twice (once with `waitUntil: 'load'`, then `goto()` inside the script does it again).
- **Never call `context.newPage()`** inside `browser_run_code` — the MCP tracks a single page; creating a new one corrupts state.
- **Never close the page inside `browser_run_code`** — the MCP closes it on `browser_close`.

## Init scripts

`page.addInitScript()` must be called before `page.goto()`. Scripts added after navigation are not injected into the initial page load and miss early performance entries (LCP candidates, early layout shifts).

## Navigation strategy

Use `waitUntil: 'domcontentloaded'`, not `'load'` or `'networkidle'`:

- `'load'` waits for all subresources — can take 15–20 s on heavy pages
- `'networkidle'` can hang indefinitely on pages with long-polling or server-sent events
- `'domcontentloaded'` fires once HTML is parsed and synchronous scripts run (~2–5 s)

## Screenshots

Use `page.screenshot({ path, fullPage: false })` **inside the same `browser_run_code` call** as the metrics collection. The `browser_take_screenshot` MCP tool cannot write to a file path.

## CDP session

Create a CDP session once per `browser_run_code` call:

```javascript
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
```

Retrieve metrics after scroll and wait:

```javascript
const { metrics } = await cdp.send('Performance.getMetrics');
const cdpMap = Object.fromEntries(metrics.map(m => [m.name, m.value]));
```

Key metric names: `TaskDuration`, `ScriptDuration`, `RecalcStyleDuration`, `LayoutDuration`, `JSHeapUsedSize`, `GPUMainFrameUsedTextureMegaBytes`.
