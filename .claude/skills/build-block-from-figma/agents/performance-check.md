# Performance Check Subagent

This script is delegated from Phase 7 of the main SKILL.md.
Run **only after** the visual comparison loop (Phase 5) and the
accessibility audit (Phase 6) are complete.

---

## Target thresholds

The project maintains **Lighthouse scores above 90**.  The block must
not cause regressions.

| Metric | Target | Why it matters |
|--------|--------|----------------|
| **Overall score** | ≥ 90 | Composite performance health |
| **LCP** (Largest Contentful Paint) | ≤ 2.5 s | **Most important metric** — measures perceived load speed |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Layout stability |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | Responsiveness |
| **TBT** (Total Blocking Time) | ≤ 200 ms | Main-thread availability |

---

## Tool

Uses the `lighthouse` CLI (installed as a project dev dependency)
executed via Playwright MCP's shell/terminal access.

---

## Procedure

1. **Run Lighthouse** against the Playwright URL in headless Chrome:
   ```bash
   npx lighthouse <playwright-url> \
     --output=json \
     --output-path=/tmp/lighthouse-report.json \
     --chrome-flags="--headless --no-sandbox" \
     --only-categories=performance
   ```
2. **Parse** the JSON output and extract:
   - `categories.performance.score` (multiply by 100 for the percentage)
   - `audits['largest-contentful-paint'].numericValue` (LCP in ms)
   - `audits['cumulative-layout-shift'].numericValue` (CLS)
   - `audits['total-blocking-time'].numericValue` (TBT in ms)
   - `audits['interaction-to-next-paint'].numericValue` (INP in ms,
     if available — this may require user interaction to measure)
3. **Assess** each metric against the target thresholds.

---

## LCP-specific assessment

Since LCP is the most critical metric, perform additional analysis:

1. **Identify the LCP element** from the Lighthouse report:
   `audits['largest-contentful-paint'].details`.
2. **Check if the LCP element is inside the new block.**
   - If yes, the block directly impacts LCP.  Assess whether the
     block's CSS or JS is delaying the LCP paint.
   - If no, the block is not the LCP bottleneck — but still verify
     it doesn't add blocking resources.
3. **Common LCP pitfalls in blocks**:
   - JS that runs synchronously before the block's content is visible.
   - CSS that hides content on initial load and reveals it after a
     transition (e.g. `opacity: 0` → `opacity: 1` with a delay).
   - Large unoptimised images loaded eagerly above the fold.
   - Web fonts that block text rendering.

---

## What to check beyond Lighthouse

Using Playwright MCP, also verify:

1. **No render-blocking resources** added by the block:
   - The block's CSS is loaded asynchronously by the EDS framework
     (this should be automatic — just verify).
   - The block's JS does not introduce synchronous `<script>` tags.
2. **No excessive DOM size** — the block should not generate more DOM
   nodes than necessary.  Check the rendered block's element count.
3. **No unnecessary reflows** — if the block's JS modifies layout
   properties, ensure it batches reads and writes (this should already
   be covered by the JS acceptance criteria, but verify at runtime).

---

## Regression detection

If any metric is **worse than the target threshold**:

1. **Determine if the block is the cause.**  Compare the metric to a
   baseline by temporarily hiding the block (e.g. `display: none`) and
   re-running Lighthouse.
2. **If the block is the cause**, identify the specific resource or
   code path responsible and document it.
3. **Suggest fixes** but do not apply them automatically at this stage
   — performance fixes may require architectural decisions (e.g.
   deferring JS, lazy-loading a section, adjusting image strategy).
   Surface these to the user.

---

## Output format

Report the following metrics clearly:

```
Performance Report
──────────────────
Overall score:  XX / 100   [PASS/FAIL]
LCP:            X.Xs       [PASS/FAIL]
CLS:            X.XX       [PASS/FAIL]
INP:            XXX ms     [PASS/FAIL] (or N/A if not measurable)
TBT:            XXX ms     [PASS/FAIL]

LCP element:    <element description>
LCP in block:   Yes / No
```

---

## Obstacles Encountered

Compile and surface back to the main skill:

- Metrics that failed thresholds, with root cause analysis.
- Whether the new block is the cause of any regression.
- Suggested fixes for any performance issues.
- Any limitations in measurement (e.g. INP requires interaction,
  localhost vs production differences).
