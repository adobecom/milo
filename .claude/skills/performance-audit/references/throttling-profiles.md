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

4× CPU slowdown **and** a real network throttle, applied together. Approximates a mid-range laptop or phone on a slow connection — not just a CPU-bound device on fast wifi. A real slow-mobile visitor is degraded on both axes at once, and CPU-only throttling under-states anything network-sensitive (LCP especially, and any script blocked waiting on a fetch).

| Setting | Value |
|---------|-------|
| Viewport | 1440 × 900 (same as baseline — any regression is throttle-driven, not layout-driven) |
| CPU throttle | 4× (`Emulation.setCPUThrottlingRate { rate: 4 }`) |
| Network throttle | `downloadThroughput`/`uploadThroughput`: 400 Kbps, `latency`: 150ms (`Network.emulateNetworkConditions`) |
| User agent | Chromium default (desktop) |

State these exact numbers in any report rather than naming an unverified preset like "Slow 4G" — throttling-preset names aren't standardized across tools, and asserting one you haven't checked is the same overclaiming mistake as guessing at code behavior instead of reading it.

## Applying combined CPU + network throttle

Set both via CDP **before** navigation so they're active for all JS parsing, execution, and the initial document/resource fetches:

```javascript
const cdp = await page.context().newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions', {
  offline: false,
  downloadThroughput: 400 * 1024 / 8, // 400 Kbps
  uploadThroughput: 400 * 1024 / 8,
  latency: 150, // ms RTT
});
// then navigate
await page.goto(url, { waitUntil: 'domcontentloaded' });
```
