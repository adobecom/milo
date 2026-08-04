---
name: performance-audit
description: >
  Advanced runtime performance analysis for web pages. Goes beyond Core Web
  Vitals to measure what Lighthouse can't: scroll FPS, main-thread saturation,
  GPU texture pressure, animation jank, long tasks, and resource weight.
  Accepts a live URL (runs Playwright, two passes: unthrottled baseline, then
  4× CPU + network throttle combined) or a Chrome DevTools performance trace
  (.json) for offline analysis. On Milo/C2 pages, both passes also collect a
  per-component-block breakdown and Core Web Vitals automatically.
  Use when asked to audit performance, profile a page, or investigate
  scroll jank, CPU/GPU load, or animation issues on any URL.
argument-hint: "[url | trace.json]"
user_invocable: true
---

# performance-audit

Advanced runtime performance analysis: FPS, CPU/GPU, animations, long tasks — unthrottled then throttled.

**CRITICAL — No intermediate output.** Do not write ANY text to the user during Phases 1, 2, or 3. Tool calls (browser, file reads, Bash, grep) are allowed. Written commentary, status lines, progress updates, or any other text is strictly prohibited until Phase 4. The user will see only the final report.

## Phase 0: Validate input and route

Inspect the skill argument:

- **No argument** — output the usage message below and stop:
  ```
  Usage: /performance-audit <url>
         /performance-audit <path/to/trace.json>
  ```

- **Argument starts with `http://` or `https://`** — URL mode. Proceed to Phase 1.

- **Argument ends with `.json`** — read the first 100 bytes with Bash (`head -c 100 <path>`) to detect format:
  - Contains `"baseline"` and `"throttled"` keys → **Script Output Mode**. Skip to **Script Phase 1**.
  - Otherwise → **Chrome Trace Mode**. Skip to **Trace Phase 1**.

- **Anything else** — output the usage message above and stop.

---

## URL Mode

**There are exactly two passes against the target URL in this entire skill — Phase 1 and Phase 2 below.** `agents/metrics-collector.md` collects everything in each pass: page-wide FPS/CPU/resources *and*, automatically on Milo/C2 pages, the per-block breakdown and Core Web Vitals (`isMiloSite`/`blockBreakdown` fields) — there is no separate set of passes for block-level data. If a step seems to call for navigating to the target URL a third time, that's a sign the measurement belongs inside Phase 1 or Phase 2 instead, not a new pass.

### Phase 1: Baseline run — unthrottled desktop

Read `references/throttling-profiles.md` and `agents/metrics-collector.md` in parallel if not already in context.

**Execute the procedure from `agents/metrics-collector.md` directly using your Playwright MCP tools. Do NOT spawn a sub-agent.** Substitute:
- `%%PROFILE%%` → `desktop-baseline`
- `%%URL%%` → the target URL
- `%%BASELINE_BLOCK_COUNT%%` → `0` (no prior pass exists yet)

The `browser_run_code` call returns a JSON string. Parse it and store as `baseline`. On Milo/C2 pages this already includes `baseline.blockBreakdown`. Also note `baseline.settledBlockCount` — Phase 2 needs it.

### Phase 2: Throttled run — 4× CPU + network throttle, desktop

**Execute the procedure from `agents/metrics-collector.md` directly using your Playwright MCP tools. Do NOT spawn a sub-agent.** Substitute:
- `%%PROFILE%%` → `throttled-desktop` (CPU 4× **and** a real network throttle, applied together — see `references/throttling-profiles.md`)
- `%%URL%%` → the target URL
- `%%BASELINE_BLOCK_COUNT%%` → `baseline.settledBlockCount` from Phase 1 (a bare number). This is the cross-pass floor that stops the throttled pass from declaring itself settled during a mid-load lull with fewer real blocks than the page actually has — do not substitute `0` here.

The `browser_run_code` call returns a JSON string. Parse it and store as `throttled`. On Milo/C2 pages this already includes `throttled.blockBreakdown`.

### Phase 3: Analyse traces

Read `references/core-web-vitals.md` and `agents/trace-analyser.md` in parallel if not already in context.

**Follow the procedure in `agents/trace-analyser.md` directly. Do NOT spawn a sub-agent.** Work through each dimension against the `baseline` and `throttled` MetricsBundles, running any source-code lookups (find, grep, Read) as directed by Step 0 of that file.

Produce the ordered findings list in memory; do not output it yet.

### Phase 3.5: Per-block breakdown (always attempt, Milo/C2 pages only)

Check `baseline.isMiloSite` (already set by Phase 1 — no new page navigation needed to check this). If `true`, **always** run `agents/block-breakdown.md` — do not wait for the user to ask for a per-block view. It builds a network/GPU/CPU/CWV dashboard chart from `baseline.blockBreakdown` and `throttled.blockBreakdown` (both already collected), which Phase 4 always includes for these pages. `agents/block-breakdown.md` does open the browser once more, but only to screenshot the chart HTML it generates on a local file server — that is not a third test pass of the target URL. If `baseline.isMiloSite` is `false`, skip this phase silently — the block-name convention doesn't apply and forcing it produces garbage labels.

Store the resulting chart image path for Phase 4.

### Phase 4: Report (URL mode)

Use the two-column report format below. Findings include an **Affects** indicator: `baseline + throttled`, `throttled only`, or `baseline only`.

```
## Performance Audit — <URL>
Date: <today>

### Runtime Performance

| Metric | Desktop (unthrottled) | Desktop (4× CPU) | Target |
|--------|-----------------------|------------------|--------|
| Avg FPS (scroll) | X fps       | X fps            | ≥ 60   |

### Animations & Runtime

| Metric | Baseline | Throttled |
|--------|----------|-----------|
| Jank frames (>33ms) | X/X (X%) | X/X (X%) |
| P95 frame time | Xms | Xms |
| Max frame time | Xms | Xms |
| Long tasks (>50ms) | X | X |
| Worst long task | Xms | Xms |
| Total blocking time | Xms | Xms |

**Active animations detected:** (if any)
- `<selector>`: `<animationName>` (<duration>, <will-change if set>)

### Resource Budget

| Type    | Count | Transfer | Largest (decoded) |
|---------|-------|----------|-------------------|
| Images  | X     | X KB     | filename X KB     |
| Scripts | X     | X KB     | filename X KB     |
| Fonts   | X     | X KB     | filename X KB     |

---

### CPU / GPU / FPS / Animations / Layout / Network
(only sections with findings)

1. **[CRITICAL/HIGH/MEDIUM] <Title>** — `<specific element, file, or selector>`
   Affects: baseline + throttled | throttled only | baseline only
   What: <one sentence>
   Fix: <concrete code change, attribute, or config>
   Expected gain: <metric ↓/↑ value>
```

If Phase 3.5 ran (Milo/C2 page), append after the findings:

```
### Per-block breakdown

<one-sentence summary of what the chart shows — e.g. which block dominates network vs CPU vs GPU>

Chart: <scratchpad path to the dashboard image>
```

**Always run `open <path>` (macOS) on the chart image before ending the run — unconditional, every time, not only when asked.** Stating the path in chat is not sufficient on its own.

### Phase 5: Done

If Phase 3.5 did **not** run: the browser was already closed by the Phase 2 metrics-collector step. No cleanup needed here.

If Phase 3.5 **did** run: `agents/block-breakdown.md`'s own Step 4 owns final cleanup (it reopens the browser after Phase 2's close to screenshot the dashboard chart) and must end with `browser_close` — verify it actually happened rather than assuming. A browser left open here doesn't just leak a process; it holds the Playwright profile lock and can block the *next* session's `browser_navigate`/`browser_run_code` calls entirely until someone manually kills the stray process.

---

## Script Output Mode (output from standalone-audit.js)

### Script Phase 1: Load bundles

Read the JSON file using Bash (`cat <path>`). Parse it. The root object has `baseline` and `throttled` keys — each is a full MetricsBundle. Store them directly as `baseline` and `throttled`. No browser automation needed.

### Script Phase 2: Analyse

Read `references/core-web-vitals.md` and `agents/trace-analyser.md` in parallel if not already in context.

**Follow the procedure in `agents/trace-analyser.md` directly. Do NOT spawn a sub-agent.** Work through all dimensions against `baseline` and `throttled`, running source-code lookups (find, grep, Read) as directed by Step 0.

Produce the ordered findings list in memory; do not output it yet.

### Script Phase 3: Report

Use the same two-column report format as URL Mode Phase 4 (the data is identical). Findings include an **Affects** indicator.

---

## Trace Mode (when input is a .json file)

### Trace Phase 1: Parse Chrome profile

Read `agents/chrome-trace-parser.md` if not already in context.

**Execute the procedure from `agents/chrome-trace-parser.md` directly using Bash. Do NOT spawn a sub-agent.** Substitute `%%FILE_PATH%%` with the provided file path.

Capture the JSON string printed to stdout, parse it, and store as `baseline`. Set `throttled = baseline` (single-pass — no CPU throttle comparison available).

If the Bash command exits with a non-zero code, tell the user the file could not be parsed as a Chrome trace and stop.

### Trace Phase 2: Analyse

Read `references/core-web-vitals.md` and `agents/trace-analyser.md` in parallel if not already in context.

**Follow the procedure in `agents/trace-analyser.md` directly. Do NOT spawn a sub-agent.** Use `baseline` for both inputs. Skip Dimension 6 (CPU Throttle Regression) — it requires two different passes. Skip Dimension 2 animation audit analysis (animationAudit is empty in trace mode). Run source-code lookups (find, grep, Read) where applicable.

Produce the ordered findings list in memory; do not output it yet.

### Trace Phase 3: Report (trace mode)

Use the single-column report format below. Omit the Animations & Runtime "Active animations detected" section (not available from trace). Omit Resource Budget if `resourceTotals` is empty. Drop the "Affects" indicator from findings.

```
## Performance Audit — <filename> (Chrome trace)
Date: <today>
Source: Chrome DevTools performance recording

### Runtime Performance

| Metric | Recorded | Target |
|--------|----------|--------|
| Avg FPS | X fps    | ≥ 60   |

### Main Thread & Runtime

| Metric | Recorded |
|--------|----------|
| Jank frames (>33ms) | X/X (X%) |
| P95 frame time | Xms |
| Max frame time | Xms |
| Long tasks (>50ms) | X |
| Worst long task | Xms |
| Total blocking time | Xms |
| Task duration (total) | Xs |
| Script duration | Xs |
| Style recalc duration | Xs |
| Layout duration | Xs |

---

### CPU / GPU / FPS / Animations / Layout / Network
(only sections with findings)

1. **[CRITICAL/HIGH/MEDIUM] <Title>** — `<specific element, file, or selector>`
   What: <one sentence>
   Fix: <concrete code change, attribute, or config>
   Expected gain: <metric ↓/↑ value>
```

---

Cap at the top 20 findings total across all categories; within each category order by severity (CRITICAL → HIGH → MEDIUM). Each finding must name a specific element, file, or property — no generic advice. If all metrics are green, say so clearly and omit the category sections.
