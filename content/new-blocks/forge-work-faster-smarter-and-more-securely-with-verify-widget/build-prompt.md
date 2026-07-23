# build-block-from-figma — task: forge-work-faster-smarter-and-more-securely-with-verify-widget

Invoke the **build-block-from-figma** skill with the inputs below. New blocks
land in **C2** (libs/c2/blocks/), authoring approach follows the
`block-building.md` playbook (the C1-codified rules: probe outward, decorated
classes, move-don't-serialize, createTag, three-phase render, try/catch + lana.log,
LCP synchronous + enhancement async, JS < 300 LOC, CSS < 200 LOC).

## Inputs

- **Block name:** `forge-work-faster-smarter-and-more-securely-with-verify-widget`
- **Target path:** `/Users/osahin/repos/milo-logs-deploy/src/forge/shared/data/_repos/milo/.forge-worktrees/session-57777101-mrxldkif/libs/c2/blocks/forge-work-faster-smarter-and-more-securely-with-verify-widget` (NEVER libs/blocks/)
- **Milo branch:** `forge/session-57777101-18b` (cut off forge-a-panel)
- **Base branch:** `forge-a-panel`
- **Preview URL (LOCALHOST mode):** `http://localhost:3000/drafts/anonymous/forge/verify-widget-features-grid-demo-577771?milolibs=local` — run Phase 5 in
  localhost mode against this Forge-served harness. Do NOT use remote-branch
  mode / `.aem.page`: Forge owns the push (shipBlocksToMilo) and the
  `?milolibs=` delivery.
- **Figma URL:** (not provided — drive from section.html + starter.css alone; do NOT block on a missing Figma URL)
- **Figma node id:** (none — Figma-less lane; section.html is the visual source of truth)

## Files in this task directory

- `author-content.html` — **THE CONTENT YOUR `decorate()` ACTUALLY RECEIVES AT RUNTIME.** DA serializes a block's content as FLAT, class-LESS, div-unwrapped semantic HTML (`<h2>/<p>/<picture>/<a>` in document order, NO grid/row/tile wrappers, NO Figma classes). This is the SOURCE OF TRUTH for *what content exists and in what order*. Your `init(el)` MUST probe THIS by content shape (never by an authored class) and RECONSTRUCT the rich layout from it. Your `mocks/body.html` test fixture MUST mirror THIS class-less shape — not `section.html` — or the test is a green-lie.
- `section.html` — the faithful section's outerHTML WITH its Figma descriptive classes. Use it ONLY as a layout REFERENCE for grouping/intent; **its classes are stripped before `init()` runs**, so never key CSS or probes on them. Author against `author-content.html` (the real runtime shape), not this. **PROPORTIONS ARE NOT CLASSES:** the RELATIVE proportions `section.html` encodes — each item's aspect-ratio, relative size, and the count + order of repeated items — ARE the design, and they vanish from the runtime content. Read the ACTUAL per-item sequence out of `section.html` and preserve it in YOUR block as PROPORTIONS (a positional array of aspect-ratios/ratios in JS, or `:nth-child`/index-keyed rules, keyed on the DOM `init()` builds). NEVER invent, cycle, or approximate a cadence `section.html` already specifies — carry the real sequence. But express it RELATIVELY: translate any absolute frame value (literal px widths, gaps, heights) into responsive units (aspect-ratio, %, fr, flexible gaps, tokens). Do NOT pin Figma-frame pixels — the block renders in its own container, not the frame, so pinned widths/gaps break the layout (L27: no fixed design-width pixels).
- `starter.css` — the section's CSS, scoped under `.sf-sec-0` /
  `.forge-work-faster-smarter-and-more-securely-with-verify-widget`. Use as the starting point for `forge-work-faster-smarter-and-more-securely-with-verify-widget.css`; prune rules that don't apply.
  Snap numeric values to `--s2a-*` tokens where exact matches exist (see `shared/extract/token-snap.js`).
- `task.json` — structured form of these inputs.

## Required steps (from build-block-from-figma)

1. Phase 0: confirm `<meta name="foundation" content="c2">` on the preview
   page. C2 imports silently fall back to C1 without it.
2. Phase 1: gather the Figma context via the Figma MCP if the URL is set;
   otherwise work from section.html + starter.css alone (do NOT block on a
   missing Figma URL).
3. Phase 4: author `/Users/osahin/repos/milo-logs-deploy/src/forge/shared/data/_repos/milo/.forge-worktrees/session-57777101-mrxldkif/libs/c2/blocks/forge-work-faster-smarter-and-more-securely-with-verify-widget/forge-work-faster-smarter-and-more-securely-with-verify-widget.js` (`export default
   async function init(el)`) and `forge-work-faster-smarter-and-more-securely-with-verify-widget.css`. Register in
   `C2_BLOCKS` at `libs/utils/utils.js:111`. Emit the L22 test fixture
   (`mocks/body.html` + `forge-work-faster-smarter-and-more-securely-with-verify-widget.test.js`) so forge-block-lint passes.
4. Phases 5–7: Playwright visual match against section.html (LOCALHOST mode),
   axe a11y, Lighthouse perf.
5. Phase 8: Forge owns the push — leave the branch `forge/session-57777101-18b` for
   shipBlocksToMilo to commit + push and deliver via `?milolibs=`.

## Decision provenance

- R3 matcher decision: `ambiguous` (score: 0.49)
- Closest existing C2 block: `news`

If the score is close to a tight/loose-variant threshold, consider whether
this should instead become a variant proposal on `news`
via the `consonant-extract-refiner` skill before authoring a new block.
