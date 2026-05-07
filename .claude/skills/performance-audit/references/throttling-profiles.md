# Throttling Profiles

Used by `agents/metrics-collector.md` to configure the Playwright browser per pass.

## `desktop-baseline`

Unthrottled desktop. Establishes best-case performance metrics.

| Setting | Value |
|---------|-------|
| Viewport | 1440 × 900 |
| CPU throttle | None (rate: 1) |
| Network throttle | None |
| User agent | Chromium default (desktop) |

## `throttled-desktop`

4× CPU slowdown. Approximates a mid-range laptop or a fast mobile device, and stress-tests JS-heavy pages.

| Setting | Value |
|---------|-------|
| Viewport | 1440 × 900 |
| CPU throttle | 4× (`Emulation.setCPUThrottlingRate { rate: 4 }`) |
| Network throttle | None |
| User agent | Chromium default (desktop) |

Both profiles use the same viewport so any regression between passes is purely CPU-bound — not caused by responsive layout differences.

## Applying CPU throttle

Set via CDP **before** navigation so the throttle is active for all JS parsing and execution:

```javascript
const cdp = await page.context().newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
// then navigate
await page.goto(url, { waitUntil: 'domcontentloaded' });
```
