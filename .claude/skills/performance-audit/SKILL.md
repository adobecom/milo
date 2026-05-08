---
name: performance-audit
description: >
  Advanced runtime performance analysis for web pages. Goes beyond Core Web
  Vitals to measure what Lighthouse can't: scroll FPS, main-thread saturation,
  GPU texture pressure, animation jank, long tasks, and resource weight.
  Accepts a live URL (runs Playwright, two passes: unthrottled + 4× CPU) or a
  Chrome DevTools performance trace (.json) for offline analysis.
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

### Phase 1: Baseline run — unthrottled desktop

Read `references/throttling-profiles.md` and `agents/metrics-collector.md` in parallel if not already in context.

**Execute the procedure from `agents/metrics-collector.md` directly using your Playwright MCP tools. Do NOT spawn a sub-agent.** Substitute:
- `%%PROFILE%%` → `desktop-baseline`
- `%%URL%%` → the target URL

The `browser_run_code` call returns a JSON string. Parse it and store as `baseline`.

### Phase 2: Throttled run — 4× CPU desktop

**Execute the procedure from `agents/metrics-collector.md` directly using your Playwright MCP tools. Do NOT spawn a sub-agent.** Substitute:
- `%%PROFILE%%` → `throttled-desktop`
- `%%URL%%` → the target URL

The `browser_run_code` call returns a JSON string. Parse it and store as `throttled`.

### Phase 3: Analyse traces

Read `references/core-web-vitals.md` and `agents/trace-analyser.md` in parallel if not already in context.

**Follow the procedure in `agents/trace-analyser.md` directly. Do NOT spawn a sub-agent.** Work through each dimension against the `baseline` and `throttled` MetricsBundles, running any source-code lookups (find, grep, Read) as directed by Step 0 of that file.

Produce the ordered findings list in memory; do not output it yet.

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

### Phase 5: Done

The browser was already closed by the Phase 2 metrics-collector step. No cleanup needed here.

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
