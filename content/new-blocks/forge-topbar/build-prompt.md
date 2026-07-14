# build-block-from-figma — task: forge-topbar

Invoke the **build-block-from-figma** skill with the inputs below. New blocks
land in **C2** (libs/c2/blocks/), authoring approach follows the
`block-building.md` playbook (the C1-codified rules: probe outward, decorated
classes, move-don't-serialize, createTag, three-phase render, try/catch + lana.log,
LCP synchronous + enhancement async, JS < 300 LOC, CSS < 200 LOC).

## Inputs

- **Block name:** `forge-topbar`
- **Target path:** `/Users/osahin/repos/milo/.forge-worktrees/session-7221a6ef/libs/c2/blocks/forge-topbar` (NEVER libs/blocks/)
- **Milo branch:** `forge/session-7221a6ef-8ee` (cut off forge-a-panel)
- **Base branch:** `forge-a-panel`
- **Preview URL (LOCALHOST mode):** `http://localhost:3000/drafts/anonymous/forge/figma-7221a6?milolibs=local` — run Phase 5 in
  localhost mode against this Forge-served harness. Do NOT use remote-branch
  mode / `.aem.page`: Forge owns the push (shipBlocksToMilo) and the
  `?milolibs=` delivery.
- **Figma URL:** https://www.figma.com/design/wwVFJz6WUzjO3MpeKmpi1Q/my-figma-tester?node-id=0-1&p=f&t=Hgxutv9wkmLNNpmN-0
- **Figma node id:** 1:650

## Files in this task directory

- `author-content.html` — **THE CONTENT YOUR `decorate()` ACTUALLY RECEIVES AT RUNTIME.** DA serializes a block's content as FLAT, class-LESS, div-unwrapped semantic HTML (`<h2>/<p>/<picture>/<a>` in document order, NO grid/row/tile wrappers, NO Figma classes). This is the SOURCE OF TRUTH for *what content exists and in what order*. Your `init(el)` MUST probe THIS by content shape (never by an authored class) and RECONSTRUCT the rich layout from it. Your `mocks/body.html` test fixture MUST mirror THIS class-less shape — not `section.html` — or the test is a green-lie.
- `truth-target.css` — **VISUAL TARGET, REFERENCE ONLY — do NOT copy it.** This is the Figma section's CSS re-scoped to `.forge-topbar`. Its selectors describe the layout/grid/gaps/colour/type INTENT to reproduce, but its class names (e.g. `.usecase`, `.bento`, `.appicon`) DO NOT EXIST in `author-content.html` — porting it verbatim renders the block UNSTYLED. TRANSLATE its intentions into rules keyed on the classes YOUR `decorate()` stamps on the reconstructed DOM.
- the Figma screenshot at `<session>/screenshots/v0-figma-reference.png` (resolved by Forge's pipeline; Read it if your provisioned task dir has `figma-frame.png`) is the raster target — match its grid/spacing/colour/media fidelity.
- `section.html` — the faithful section's outerHTML WITH its Figma descriptive classes. Use it ONLY as a layout REFERENCE for grouping/intent; **its classes are stripped before `init()` runs**, so never key CSS or probes on them. Author against `author-content.html` (the real runtime shape), not this. **PROPORTIONS ARE NOT CLASSES:** the RELATIVE proportions `section.html` encodes — each item's aspect-ratio, relative size, and the count + order of repeated items — ARE the design, and they vanish from the runtime content. Read the ACTUAL per-item sequence out of `section.html` and preserve it in YOUR block as PROPORTIONS (a positional array of aspect-ratios/ratios in JS, or `:nth-child`/index-keyed rules, keyed on the DOM `init()` builds). NEVER invent, cycle, or approximate a cadence `section.html` already specifies — carry the real sequence. But express it RELATIVELY: translate any absolute frame value (literal px widths, gaps, heights) into responsive units (aspect-ratio, %, fr, flexible gaps, tokens). Do NOT pin Figma-frame pixels — the block renders in its own container, not the frame, so pinned widths/gaps break the layout (L27: no fixed design-width pixels).
- `starter.css` — the section's CSS, scoped under `.sf-sec-0` /
  `.forge-topbar`. For this DISTINCTIVE section it is a minimal STRUCTURAL FLOOR (keyed on `.foreground`/`.media`/`.content`) — replace it with CSS you author toward `truth-target.css` + the screenshot.
  Snap numeric values to `--s2a-*` tokens where exact matches exist (see `shared/extract/token-snap.js`).
- `page-globals.css` — page-level globals (:root tokens, resets, @font-face)
  hoisted OUT of the block CSS so the block stays forge-block-lint L10/L19-clean
  (do NOT inline these into `forge-topbar.css` — link them from the page head).
- `task.json` — structured form of these inputs.

## THE MAGIC STEP (this is a DISTINCTIVE section — reconstruct from flat content)

```
FLAT author-content.html (class-less, div-unwrapped)   <- the INPUT init(el) gets
        v
init(el)  ->  PROBE by content/order  ->  RECONSTRUCT rich DOM
              (createTag/createElement + append, in document order;
               add YOUR OWN .forge-topbar-scoped classes via classList.add)
        v
scoped .forge-topbar CSS  ->  styles ONLY the classes init() just stamped
        v
visual target = truth-target.css + the Figma screenshot  (author TOWARD it, do NOT port it)
```

Your job is a GOOD STARTING block, not a pixel-perfect one — Forge's in-app refine
loop perfects CSS-vs-screenshot afterward. See checklist rule C24 in the build
prompt (DA strips classes; reconstruct structure in JS).

## Required steps (from build-block-from-figma)

1. Phase 0: confirm `<meta name="foundation" content="c2">` on the preview
   page. C2 imports silently fall back to C1 without it.
2. Phase 1: gather the Figma context via the Figma MCP if the URL is set;
   otherwise work from section.html + starter.css alone (do NOT block on a
   missing Figma URL).
3. Phase 4: author `/Users/osahin/repos/milo/.forge-worktrees/session-7221a6ef/libs/c2/blocks/forge-topbar/forge-topbar.js` (`export default
   async function init(el)`) and `forge-topbar.css`. Register in
   `C2_BLOCKS` at `libs/utils/utils.js:111`. Emit the L22 test fixture
   (`mocks/body.html` + `forge-topbar.test.js`) so forge-block-lint passes.
4. Phases 5–7: Playwright visual match against section.html (LOCALHOST mode),
   axe a11y, Lighthouse perf.
5. Phase 8: Forge owns the push — leave the branch `forge/session-7221a6ef-8ee` for
   shipBlocksToMilo to commit + push and deliver via `?milolibs=`.

## Decision provenance

- R3 matcher decision: `ambiguous` (score: 0.74)
- Closest existing C2 block: `rich-content`

If the score is close to a tight/loose-variant threshold, consider whether
this should instead become a variant proposal on `rich-content`
via the `consonant-extract-refiner` skill before authoring a new block.
