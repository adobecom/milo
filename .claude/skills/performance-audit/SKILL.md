---
name: performance-audit
description: >
  Performance audit agent for web pages. Navigates to a URL with Playwright,
  captures Core Web Vitals (LCP, CLS, INP), FPS, and CPU/GPU metrics.
  Runs twice — unthrottled desktop and throttled desktop (4× CPU slowdown).
  Scrolls the page to collect runtime FPS and GPU texture pressure, then
  delegates trace analysis to the trace-analyser agent and produces prioritised,
  actionable improvement suggestions.
  Use when asked to audit page performance, analyse Core Web Vitals, profile a
  page, or investigate slowness on aem.live, production, or localhost URLs.
argument-hint: "[url]"
user_invocable: true
---

# performance-audit

Audit a web page's performance: Core Web Vitals, FPS, CPU/GPU — unthrottled then throttled.

## Phase 0: Validate input

The URL is the skill argument. If no argument was provided, output:
```
Usage: /performance-audit <url>
```
and stop. Do not ask the user for the URL interactively.

## Phase 1: Baseline run — unthrottled desktop

Read `references/throttling-profiles.md` and `agents/metrics-collector.md` in parallel — you need both before spawning the agent.

Output immediately before spawning the baseline agent:
```
|████░░░░░░░░░░░░░░░░|  20%  collecting baseline (unthrottled)…
```

Delegate to the `agents/metrics-collector.md` agent with:
- `url`: the target URL
- `profile`: `desktop-baseline`
- `screenshot_path`: `/tmp/perf-baseline.png`

The agent returns a `MetricsBundle` object. Store it as `baseline`.

Output immediately after the baseline bundle is received:
```
|████████░░░░░░░░░░░░|  40%  baseline done — collecting throttled (4× CPU)…
```

## Phase 2: Throttled run — 4× CPU desktop

Read `agents/metrics-collector.md` if not already in context.

Delegate to the `agents/metrics-collector.md` agent with:
- `url`: the target URL
- `profile`: `throttled-desktop`
- `screenshot_path`: `/tmp/perf-throttled.png`

The agent returns a `MetricsBundle` object. Store it as `throttled`.

Output immediately after the throttled bundle is received:
```
|████████████░░░░░░░░|  60%  throttled done — reading vitals thresholds…
```

## Phase 3: Analyse traces

Read `references/core-web-vitals.md` and `agents/trace-analyser.md` in parallel.

Output immediately before spawning the analyser:
```
|████████████████░░░░|  80%  analysing traces…
```

Delegate to the `agents/trace-analyser.md` agent with:
- `baseline`: the MetricsBundle from Phase 1
- `throttled`: the MetricsBundle from Phase 2

The agent returns an ordered list of findings with severity and fix recommendations.

Output once findings are received:
```
|██████████████████░░|  90%  writing report…
```

## Phase 4: Report

Produce a structured report using the findings from Phase 3. Group findings by category. Only render a category section if at least one finding belongs to it. Order categories: CPU → GPU → FPS → Animations → Layout → Network.

```
## Performance Audit — <URL>
Date: <today>

### Core Web Vitals

| Metric | Desktop (unthrottled) | Desktop (4× CPU) | Target  |
|--------|-----------------------|------------------|---------|
| LCP    | Xs                    | Xs               | ≤ 2.5s  |
| CLS    | X.XXX                 | X.XXX            | ≤ 0.10  |
| INP    | Xms                   | Xms              | ≤ 200ms |
| FPS    | X fps                 | X fps            | ≥ 60    |

### Resource Budget

| Type    | Count | Transfer | Largest       |
|---------|-------|----------|---------------|
| Images  | X     | X KB     | filename X KB |
| Scripts | X     | X KB     | filename X KB |
| Fonts   | X     | X KB     | filename X KB |

---

### CPU
<!-- only if CPU findings exist -->

1. **[CRITICAL/HIGH/MEDIUM] <Title>** — `<specific element, file, or selector>`
   What: <one sentence>
   Fix: <concrete code change, attribute, or config>
   Expected gain: <metric ↓/↑ value>

### GPU
<!-- only if GPU findings exist -->

1. ...

### FPS
<!-- only if FPS findings exist -->

1. ...

### Animations
<!-- only if Animations findings exist -->

1. ...

### Layout
<!-- only if Layout findings exist -->

1. ...

### Network
<!-- only if Network findings exist -->

1. ...
```

Cap at the top 8 findings total across all categories; within each category order by severity (CRITICAL → HIGH → MEDIUM). Each finding must name a specific element, file, or property — no generic advice. If all metrics are green, say so clearly and omit the category sections.

## Phase 5: Done

The browser was already closed by the Phase 2 metrics-collector agent (Step 10 of throttled-desktop profile). No cleanup needed here.

Output:
```
|████████████████████| 100%  done.
```
