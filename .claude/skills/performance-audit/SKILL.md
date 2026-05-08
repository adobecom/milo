---
name: performance-audit
description: >
  Advanced runtime performance analysis for web pages. Goes beyond Core Web
  Vitals to measure what Lighthouse can't: scroll FPS, main-thread saturation,
  GPU texture pressure, animation jank, long tasks, and resource weight.
  Runs twice — unthrottled desktop and throttled desktop (4× CPU) — to
  separate CPU-bound regressions from inherent page weight.
  Use when asked to audit performance, profile a page, or investigate
  scroll jank, CPU/GPU load, or animation issues on any URL.
argument-hint: "[url]"
user_invocable: true
---

# performance-audit

Advanced runtime performance analysis: FPS, CPU/GPU, animations, long tasks — unthrottled then throttled.

**CRITICAL — No intermediate output.** Do not write ANY text to the user during Phases 1, 2, or 3. Tool calls (browser, file reads, grep) are allowed. Written commentary, status lines, progress updates, or any other text is strictly prohibited until Phase 4. The user will see only the final report.

## Phase 0: Validate input

The URL is the skill argument. If no argument was provided, output:
```
Usage: /performance-audit <url>
```
and stop. Do not ask the user for the URL interactively.

## Phase 1: Baseline run — unthrottled desktop

Read `references/throttling-profiles.md` and `agents/metrics-collector.md` in parallel if not already in context.

**Execute the procedure from `agents/metrics-collector.md` directly using your Playwright MCP tools. Do NOT spawn a sub-agent.** Substitute:
- `%%PROFILE%%` → `desktop-baseline`
- `%%URL%%` → the target URL
- `%%SCREENSHOT_PATH%%` → `/tmp/perf-baseline.png`

The `browser_run_code` call returns a JSON string. Parse it and store as `baseline`.

## Phase 2: Throttled run — 4× CPU desktop

**Execute the procedure from `agents/metrics-collector.md` directly using your Playwright MCP tools. Do NOT spawn a sub-agent.** Substitute:
- `%%PROFILE%%` → `throttled-desktop`
- `%%URL%%` → the target URL
- `%%SCREENSHOT_PATH%%` → `/tmp/perf-throttled.png`

The `browser_run_code` call returns a JSON string. Parse it and store as `throttled`.

## Phase 3: Analyse traces

Read `references/core-web-vitals.md` and `agents/trace-analyser.md` in parallel if not already in context.

**Follow the procedure in `agents/trace-analyser.md` directly. Do NOT spawn a sub-agent.** Work through each dimension against the `baseline` and `throttled` MetricsBundles, running any source-code lookups (find, grep, Read) as directed by Step 0 of that file.

Produce the ordered findings list in memory; do not output it yet.

## Phase 4: Report

Produce a structured report using the findings from Phase 3. Group findings by category. Only render a category section if at least one finding belongs to it. Order categories: CPU → GPU → FPS → Animations → Layout → Network.

Each finding must include an **Affects** indicator: `baseline + throttled`, `throttled only`, or `baseline only`.

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

### CPU
<!-- only if CPU findings exist -->

1. **[CRITICAL/HIGH/MEDIUM] <Title>** — `<specific element, file, or selector>`
   Affects: baseline + throttled | throttled only | baseline only
   What: <one sentence>
   Fix: <concrete code change, attribute, or config>
   Expected gain: <metric ↓/↑ value>

### GPU
<!-- only if GPU findings exist -->

### FPS
<!-- only if FPS findings exist -->

### Animations
<!-- only if Animations findings exist -->

### Layout
<!-- only if Layout findings exist -->

### Network
<!-- only if Network findings exist -->
```

Cap at the top 20 findings total across all categories; within each category order by severity (CRITICAL → HIGH → MEDIUM). Each finding must name a specific element, file, or property — no generic advice. If all metrics are green, say so clearly and omit the category sections.

## Phase 5: Done

The browser was already closed by the Phase 2 metrics-collector step. No cleanup needed here.
