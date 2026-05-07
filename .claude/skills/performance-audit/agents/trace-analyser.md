# Trace Analyser Agent

Delegated from SKILL.md Phase 3. Receives two `MetricsBundle` objects (baseline and throttled), cross-references `references/core-web-vitals.md` for thresholds, and returns an ordered list of findings.

## Inputs

- `baseline` — MetricsBundle from the desktop-baseline pass
- `throttled` — MetricsBundle from the throttled-desktop pass

## Procedure

Read `references/core-web-vitals.md` before starting. Apply the thresholds defined there to classify each metric as Good / Needs Improvement / Poor.

### Step 0 — Verify named blocks and scripts against source code

Before writing any finding, look up every block name, script filename, or CSS class referenced in the MetricsBundle against the actual source. Do not assume an implementation based on the name alone.

For each block name that appears in `vitals.shifts[].sources` or in `resourceSummary` filenames:

1. Search for the block's JS file: `find . -name "<block-name>.js" -path "*/blocks/*" -o -name "<block-name>.js" -path "*/c2/*"`. If no JS file exists, the block is CSS-only — do not emit a JS-related finding for it.
2. If a JS file exists, grep it for: `addEventListener('scroll'`, `getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `style.setProperty`, `classList.add`, `classList.remove`, `requestAnimationFrame`. Read the surrounding 20 lines for any hits.
3. Check for a corresponding CSS file and grep it for `animation-timeline`, `scroll-timeline`, `will-change`, `transform` to understand whether the effect is already compositor-driven.

Only after confirming what the code actually does should you write the finding's `fix`. If the source shows the block is already using the correct approach (e.g. CSS `animation-timeline: view()`), do not flag it as a JS-driven problem — instead note that the block is already optimised for that dimension and look for the real source of the signal in other blocks.

For script filenames in `resourceSummary.script`, read the first 30 lines of the file to confirm its purpose before naming it in a finding.

---

Work through each dimension below. Only emit a finding when a threshold is breached or a clear inefficiency is detected. Assign severity and category:

- **CRITICAL** — Poor threshold breached on both passes
- **HIGH** — Poor on throttled, Needs Improvement on desktop; or a resource budget issue with clear fix
- **MEDIUM** — Needs Improvement on one pass; or a minor inefficiency likely to compound under load

Categories (assign exactly one per finding):
- **CPU** — main-thread tasks, script duration, INP, forced reflow, CPU throttle regression
- **GPU** — GPU texture pressure, compositor layers, will-change abuse
- **FPS** — frame drops during scroll, scroll handlers, rAF budget
- **Animations** — animation jank, scroll-driven effects, CSS vs JS animation paths
- **Network** — LCP resource fetch, render-blocking resources, large transfers, resource budget
- **Layout** — CLS, layout shifts, style recalc, forced layout (reflow)

---

### Dimension 1 — LCP  _(category: Network)_

1. Find the most likely LCP resource: the largest image or text block above the fold. Look in `baseline.resourceSummary.img` and `baseline.resourceSummary.fetch` for entries with high `decodedKB`.
2. Check if that resource has `renderBlocking: true` anywhere upstream (scripts or stylesheets ahead of it in the waterfall).
3. If `transferKB` is small but `decodedKB` is large (ratio > 5×): image is decoded at a size far larger than displayed — oversized for the viewport.
4. If `durationMs` is high relative to `transferKB` (slow KB/ms): TTFB is the bottleneck, not transfer.
5. If `throttled.vitals.lcpMs > 2 × baseline.vitals.lcpMs`: the bottleneck is network or JS init, not rendering. Flag for preload or server-side fixes.
6. Compare against thresholds. Emit finding with the specific resource filename and the fix.

Common fixes:
- Add `<link rel="preload" as="image" fetchpriority="high">` for the LCP image
- Remove `loading="lazy"` from above-fold images
- Serve WebP/AVIF via `<picture>` with `srcset`
- Add `fetchpriority="high"` attribute directly on `<img>`
- Defer non-critical scripts that block the LCP resource

---

### Dimension 2 — CLS  _(category: Layout)_

1. Sort `baseline.vitals.shifts` by `value` descending.
2. For each shift entry, inspect `sources` for the offending DOM node:
   - `<img>` without explicit `width`/`height` or `aspect-ratio` → missing size reservation
   - A font resource that loads after first paint → FOUT. Check `baseline.resourceSummary.font` for entries with `durationMs > 500`.
   - An element injected by JS (ads, banners, consent bars) → reserved space needed.
3. Sum shift values. Classify against threshold.
4. Emit one finding per distinct root cause (not per shift entry).

Common fixes:
- Set explicit `width` and `height` on `<img>` elements (browser computes `aspect-ratio` automatically)
- Add `aspect-ratio` in CSS for containers that hold dynamically loaded content
- Add `font-display: swap` or `optional` to `@font-face` declarations
- Reserve space for injected elements with `min-height`

---

### Dimension 3 — INP / Main Thread  _(category: CPU)_

1. Check `baseline.vitals.inpMs`. If INP > 200ms during scroll, the page has heavy event handlers or long tasks on the scroll path.
2. Check `baseline.cdp.taskDurationS`. If > 1s, the main thread is saturated.
3. Break down by sub-metric:
   - High `scriptDurationS` (> 0.3s): large JS bundles executing on load. Find entries in `baseline.resourceSummary.script` with high `transferKB`.
   - High `recalcStyleDurationS` (> 0.05s): style recalc triggered during scroll. Common causes: CSS `position: sticky` with complex selectors, animations on `top`/`left` instead of `transform`.
   - High `layoutDurationS` (> 0.02s): layout thrash — JS reads layout properties then writes, forcing multiple layouts per frame.
4. Emit finding with specific script filename or CSS property implicated.

Common fixes:
- Defer non-critical scripts: add `defer` or `async`
- Animate using `transform` and `opacity` (compositor-only) instead of `top`, `left`, `width`
- Use `contain: layout` on isolated blocks to limit layout scope
- Batch DOM reads before writes to avoid layout thrash

---

### Dimension 4 — FPS  _(category: FPS or GPU — use FPS for frame-drop findings, GPU for texture/layer findings)_

1. If `baseline.fps < 55`: the page drops frames even on a fast desktop. Likely heavy paint or many composited layers.
2. If `throttled.fps < 30`: severe jank on mobile. Usually heavy scroll handlers or GPU overload.
3. Check `baseline.cdp.gpuTextureMB`:
   - > 100 MB: too many large images decoded to GPU texture simultaneously, or too many compositor layers.
   - > 50 MB: borderline; flag if combined with low FPS.
4. Check for images with very high `decodedKB` (> 1000 KB): they occupy disproportionate GPU texture memory even if displayed small.

Common fixes:
- Remove blanket `will-change: transform` or `transform: translateZ(0)` — each creates a GPU layer
- Serve images at the actual display size, not oversized
- Use `content-visibility: auto` on off-screen sections to skip paint
- Replace JS scroll listeners with CSS scroll-driven animations (`animation-timeline: view()`)

---

### Dimension 5 — Resource Budget  _(category: Network)_

Use `baseline.resourceTotals` for counts and totals. Use `baseline.resourceSummary` to identify the largest individual files. Flag individual resources that exceed:

| Type | Single-file threshold | Reasoning |
|------|-----------------------|-----------|
| Image (decoded) | > 500 KB | Excessive GPU texture pressure |
| Image (transfer) | > 150 KB | Not compressed / no modern format |
| Script | > 80 KB (transfer) | Too large to parse quickly on mobile |
| Font | > 80 KB | Subset or use `font-display: optional` |
| Total transfer | > 1.5 MB | Page is over mobile budget |

For each flagged resource, name the filename and suggest the specific fix.

---

### Dimension 6 — Forced Reflow  _(category: CPU)_

Forced reflow (layout thrash) occurs when JavaScript reads a layout property — `offsetWidth`, `offsetHeight`, `getBoundingClientRect()`, `scrollTop`, `clientHeight`, etc. — immediately after writing to the DOM. The browser is forced to flush pending style changes and recalculate layout synchronously before returning the value. On a page with many elements or complex CSS, each forced reflow can block the main thread for tens of milliseconds.

#### Detection from MetricsBundle

1. **Primary signal**: `cdp.layoutDurationS > 0.02` (20ms) on desktop baseline indicates significant layout work. If it also exceeds `0.05` on the throttled pass, forced reflow is likely a material bottleneck.
2. **Secondary signal**: high `cdp.recalcStyleDurationS` alongside high `cdp.layoutDurationS` — interleaved style and layout time is the fingerprint of repeated forced reflow, as opposed to a single large layout pass at load.
3. **Tertiary signal**: low FPS during scroll combined with elevated `layoutDurationS` but low `scriptDurationS` — the bottleneck is not JS execution itself but layout recalculation triggered by JS reads.

#### Investigation steps

1. Compute the layout-to-script ratio: `cdp.layoutDurationS / cdp.scriptDurationS`. A ratio > 0.5 means layout is consuming more than half the JS budget — unusual for a well-optimised page and a strong indicator of thrash.
2. Check the resource list for third-party scripts (`type: 'script'` with an external hostname). Ad scripts, analytics, and tag managers are common sources of synchronous layout reads in scroll and resize handlers.
3. Look for scroll-linked behaviour on the page: sticky headers, parallax effects, lazy-load triggers, or progress bars — all common sites of `getBoundingClientRect()` calls inside event listeners.
4. If `throttled.cdp.layoutDurationS > 3 × baseline.cdp.layoutDurationS`: the reflow cost scales with CPU speed, confirming it is happening repeatedly (once per frame) rather than once at load.

#### Severity thresholds

| `layoutDurationS` (baseline) | Severity |
|------------------------------|----------|
| < 0.02 | No finding |
| 0.02 – 0.05 | MEDIUM |
| > 0.05 | HIGH |
| > 0.05 and throttled > 0.15 | CRITICAL |

#### Common fixes

- **Batch reads before writes**: read all layout properties first, then apply all DOM mutations — never interleave.
  ```javascript
  // Bad
  el.style.height = el.offsetHeight + 10 + 'px'; // read → write → read next iteration = thrash

  // Good
  const h = el.offsetHeight;    // read
  el.style.height = h + 10 + 'px'; // write
  ```
- **Cache layout values**: if the same property is needed in a loop, read it once outside the loop.
- **Use `ResizeObserver` instead of polling** `offsetWidth` on a timer or scroll event.
- **Replace scroll listeners with Intersection Observer** for lazy-load triggers and scroll-linked class toggling — no layout reads needed.
- **Replace scroll listeners with CSS scroll-driven animations** (`animation-timeline: view()`) for parallax and reveal effects — runs entirely on the compositor thread.
- **`requestAnimationFrame` batching**: if reads and writes must coexist, schedule reads at the top of the rAF callback and writes at the bottom, or split into two rAF callbacks.

Emit one finding that names the most likely JS site (third-party script filename, or the scroll/resize listener pattern detected) and references the specific CDP values that flagged it.

---

### Dimension 7 — CPU Throttle Regression  _(category: CPU; or Animations if FPS delta is the primary signal)_

Both passes use the same 1440×900 desktop viewport — only CPU speed differs. Any regression is therefore purely CPU-bound.

Compute:
- LCP delta: `(throttled.vitals.lcpMs - baseline.vitals.lcpMs) / baseline.vitals.lcpMs × 100`
- FPS delta: `baseline.fps - throttled.fps`
- TaskDuration delta: `throttled.cdp.taskDurationS / baseline.cdp.taskDurationS`

If LCP delta > 100%: LCP is gated on main-thread work (JS parsing or long tasks blocking paint), not on network fetch time. Highlight for script deferral or code-splitting.
If FPS delta > 20: scroll handlers, animations, or compositor layers don't scale with CPU — highlight for animation/listener audit.
If TaskDuration scales > 4× (matches throttle rate): main thread is fully saturated during load — no idle headroom. Highlight for task splitting or `scheduler.yield()`.

---

## Output

Return findings as an ordered list, highest severity first. Within the same severity, order by estimated user impact (LCP > CLS > INP > FPS > resource weight).

Each finding:

```
{
  "severity": "CRITICAL | HIGH | MEDIUM",
  "category": "CPU | GPU | FPS | Animations | Network | Layout",
  "title": "<short title>",
  "target": "<specific element, filename, selector, or property>",
  "what": "<one-sentence description>",
  "fix": "<concrete change: attribute, CSS property, or config>",
  "expectedGain": "<LCP ↓Xs / CLS ↓0.0X / FPS ↑X / size ↓X KB>"
}
```

Maximum 8 findings. If fewer than 3 dimensions show problems, still report all passing metrics explicitly so the main skill can include them in the report.
