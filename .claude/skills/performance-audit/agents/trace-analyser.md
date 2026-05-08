# Trace Analyser

Used by SKILL.md Phase 3. Receives two `MetricsBundle` objects (baseline and throttled), cross-references `references/core-web-vitals.md` for thresholds, and returns an ordered list of findings focused on runtime performance: FPS, CPU, GPU, animations, and resource weight.

## Inputs

- `baseline` — MetricsBundle from the desktop-baseline pass
- `throttled` — MetricsBundle from the throttled-desktop pass

## Procedure

Read `references/core-web-vitals.md` before starting. Apply the thresholds defined there to classify each metric as Good / Needs Improvement / Poor.

### Step 0 — Verify named blocks and scripts against source code

Before writing any finding, look up every block name, script filename, or CSS class referenced in the MetricsBundle against the actual source. Do not assume an implementation based on the name alone.

For each block name that appears in `animationAudit[].selector` or `resourceSummary` filenames:

1. Search for the block's JS file: `find . -name "<block-name>.js" -path "*/blocks/*" -o -name "<block-name>.js" -path "*/c2/*"`. If no JS file exists, the block is CSS-only — do not emit a JS-related finding for it.
2. If a JS file exists, grep it for: `addEventListener('scroll'`, `getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `style.setProperty`, `classList.add`, `classList.remove`, `requestAnimationFrame`. Read the surrounding 20 lines for any hits.
3. Check for a corresponding CSS file and grep it for `animation-timeline`, `scroll-timeline`, `will-change`, `transform`, `margin`, `top`, `left`, `width`, `height` inside `@keyframes` blocks (layout-triggering animation properties).

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
- **Animations** — animation jank, scroll-driven effects, CSS vs JS animation paths, long tasks during animation
- **Network** — LCP resource fetch, render-blocking resources, large transfers, resource budget
- **Layout** — style recalc, forced layout (reflow)

---

### Dimension 1 — INP / Main Thread  _(category: CPU)_

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

### Dimension 2 — Animation Runtime  _(category: Animations)_

Use the `scroll`, `longTasks`, `totalBlockingTimeMs`, and `animationAudit` fields from both bundles.

1. **Jank analysis** — check `baseline.scroll.jankFrames / baseline.scroll.totalFrames`:
   - > 10%: significant scroll jank. Report jank ratio, `rafP95`, and `rafMax`.
   - Check if `throttled.scroll.jankFrames` is significantly higher than baseline — if so, the jank is CPU-bound (likely JS-driven scroll handlers or forced reflow, not CSS).

2. **Long tasks** — inspect `baseline.longTasks` (sorted by `durationMs` desc):
   - If any task > 200ms: flag as blocking main thread during scroll/load.
   - Categorise by `startMs`: tasks with `startMs < 3000` are during page load; tasks with `startMs > 3000` are during idle/user interaction.
   - Report cumulative blocking time: `baseline.totalBlockingTimeMs`.

3. **Animation audit** — inspect `baseline.animationAudit` (cross-reference the CSS from Step 0):
   - Identify animations using layout-triggering properties (`margin`, `width`, `height`, `top`, `left`) inside `@keyframes` or `transition`. These run on the main thread and force recalc per frame.
   - Identify elements with `will-change` that is always-on (not conditional on `:hover`/interaction) — each creates a GPU compositor layer with memory overhead.
   - Identify scroll-driven animations (`animation-timeline: view()`) applied to many elements simultaneously.

4. Emit findings for each animation issue found, naming the specific `selector` and `animationName` from the audit.

Common fixes:
- Replace layout-property animations with `transform`/`opacity` equivalents
- Apply `will-change` only on `:hover`/`:focus-visible`, not unconditionally
- Limit `animation-timeline: view()` to a single coordinating container; animate children via CSS custom properties
- Wrap all `animation-timeline` rules in `@supports (animation-timeline: view())`

---

### Dimension 3 — FPS  _(category: FPS or GPU — use FPS for frame-drop findings, GPU for texture/layer findings)_

1. If `baseline.scroll.fpsAvg < 55`: the page drops frames even on a fast desktop. Likely heavy paint or many composited layers.
2. If `throttled.scroll.fpsAvg < 30`: severe jank on mobile. Usually heavy scroll handlers or GPU overload.
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

### Dimension 4 — Resource Budget  _(category: Network)_

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

### Dimension 5 — Forced Reflow  _(category: CPU)_

Forced reflow (layout thrash) occurs when JavaScript reads a layout property — `offsetWidth`, `offsetHeight`, `getBoundingClientRect()`, `scrollTop`, `clientHeight`, etc. — immediately after writing to the DOM.

1. **Primary signal**: `cdp.layoutDurationS > 0.02` on desktop baseline indicates significant layout work.
2. **Secondary signal**: high `cdp.recalcStyleDurationS` alongside high `cdp.layoutDurationS` — interleaved style and layout time is the fingerprint of repeated forced reflow.
3. **Tertiary signal**: low FPS during scroll combined with elevated `layoutDurationS` but low `scriptDurationS`.

Severity thresholds:

| `layoutDurationS` (baseline) | Severity |
|------------------------------|----------|
| < 0.02 | No finding |
| 0.02 – 0.05 | MEDIUM |
| > 0.05 | HIGH |
| > 0.05 and throttled > 0.15 | CRITICAL |

After verifying the source code (Step 0), name the specific function call or block file driving the reflow.

Common fixes:
- Batch reads before writes; never interleave
- Cache layout values in a variable outside loops
- Use `ResizeObserver` instead of polling `offsetWidth`
- Replace scroll listeners with `IntersectionObserver`
- Use `IntersectionObserverEntry.boundingClientRect` (already computed) instead of calling `getBoundingClientRect()` again

---

### Dimension 6 — CPU Throttle Regression  _(category: CPU; or Animations if FPS delta is the primary signal)_

Both passes use the same 1440×900 desktop viewport — only CPU speed differs. Any regression is therefore purely CPU-bound.

Compute:
- FPS delta: `baseline.scroll.fpsAvg - throttled.scroll.fpsAvg`
- TaskDuration delta: `throttled.cdp.taskDurationS / baseline.cdp.taskDurationS`
- RAF P95 delta: `throttled.scroll.rafP95 - baseline.scroll.rafP95`

If FPS delta > 20: scroll handlers, animations, or compositor layers don't scale with CPU — highlight for animation/listener audit.
If TaskDuration scales > 4× (matches throttle rate): main thread is fully saturated during load — no idle headroom. Highlight for task splitting or `scheduler.yield()`.

---

## Output

Return findings as an ordered list, highest severity first. Within the same severity, order by estimated user impact (INP > FPS > animations > resource weight).

Each finding must include an `"affects"` field indicating which pass(es) show the problem:
- `"baseline + throttled"` — problem present on both runs
- `"throttled only"` — problem only shows under CPU throttle
- `"baseline only"` — problem only shows on unthrottled run (unusual; note why)

```json
{
  "severity": "CRITICAL | HIGH | MEDIUM",
  "category": "CPU | GPU | FPS | Animations | Network | Layout",
  "affects": "baseline + throttled | throttled only | baseline only",
  "title": "<short title>",
  "target": "<specific element, filename, selector, or property>",
  "what": "<one-sentence description>",
  "fix": "<concrete change: attribute, CSS property, or config>",
  "expectedGain": "<LCP ↓Xs / CLS ↓0.0X / FPS ↑X / size ↓X KB>"
}
```

Maximum 20 findings. If fewer than 3 dimensions show problems, still report all passing metrics explicitly so the main skill can include them in the report.
