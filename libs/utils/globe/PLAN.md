# Globe consolidation plan

Working notes for refactoring `firefly-globe` and `globe-gallery` onto the shared layer in this folder.
Delete this file before the branch merges.

## Ground rules (they shaped every decision)

- **No build step.** Every `.js` file is a runtime ES module request. Keep the module count per
  page low: each block loads its entry, `src/authoring.js`,
  `src/timeline.js` and the six shared modules (`core`, `gl`, `interaction`, `authoring`, `modal`,
  `quote-particles`) plus `globe.css`. Merge small things into an existing shared file rather than adding files.
- **One globe per page is the normal case; two must not interfere.** Shared modules keep no
  per-instance state (the skeleton's `globeInstanceSeq` is the only module-level counter); `easePow` is injected
  per instance. Block-only CSS is scoped under the block root (`.root .globe-*`).
- **No behaviour change by default.** When the two blocks differ only for historical reasons,
  consolidate into one function (a branch or option is fine; it can be cleaned up later). When a
  difference is real, keep it and say why. Behaviour changes are called out below.
- **Review each pattern before applying it.** Patterns must remove a measured duplication or a
  measured risk. No pattern for its own sake.
- **Changes stay uncommitted and unstaged** so they can be reviewed before staging.
- Tests/lint: `npx eslint libs/utils/globe libs/c2/blocks/firefly-globe libs/c2/blocks/globe-gallery test/c2/blocks test/utils/globe`
  and `npx wtr --config ./web-test-runner.config.mjs --node-resolve --port=2000 "test/utils/globe/*.test.js" "test/c2/blocks/{firefly-globe,globe-gallery}/*.test.js"`.
- `libs/mep/ace1209/*` holds legacy copies of these blocks. Do not touch them.
- **JS/CSS ship unminified:** no new comments in code; document only tricky current behaviour in
  the READMEs (no rationale, no history).
- **CSS:** shared rules live in `globe.css`; a block rule that overrides a shared one must
  out-specify it (stylesheet load order is not guaranteed). First-paint rules (root height, the
  root background) stay in the block CSS. Within `globe.css`, min-width media queries for the same
  property stay in ascending order.

## Behaviour changes adopted

Everything else was kept identical.

- Firefly: opening-quote hang is a `text-indent`, not a `span.hang-opening-quote`.
- Gallery: a11y uses firefly's version (Tab handling, `preventScroll`, per-card `lang`), including hiding the
  focus ring when its card is gone.
- Gallery: `parsePullQuote` ignores `<p>` inside the quote element.
- Gallery: `.globe-empty` is `display: none`. It used to leave a blank viewport-tall block with the pull quote in it.
- Gallery: failures that were silent now log to lana (fragment request, no usable cards, no fragment link,
  WebGL renderer creation).
- Gallery: `rafLoop` schedules the next frame before `tick`, as firefly does, so a one-off error in `tick`
  costs one frame instead of freezing the globe.
- Gallery: `destroy` resets `cameraInsideSphere`, and both blocks reset the whole frame state, so a rebuild starts
  like a first load (gallery's hint plane is now created after a rebuild deep in the scroll, as on first load).
- Firefly: logs how many assets it skipped for having no rendition.
- Firefly: removing an ancestor of the block now destroys the runtime (`onRemoved`, Milo's body-subtree pattern).
- Firefly: the description gets the hang gutter (padding offset by an equal negative margin).
- Firefly: a11y card buttons no longer use `pointer-events: auto`.
- Both: crosshair rules paint under the DOM text, as under the raster, so nothing changes at the swap.
  A hung mark stays whole in front of the rule instead of being cut by it, as it is on stage.
- Both: modal dialog is `overflow: clip`; the page scrollbar gutter stays reserved and is painted
  dark while the modal is open (gallery gained the gutter).
- Both: pull-quote raster picks the letter-spacing that matches the DOM line width.

## Still to verify

- The handoff on a real GPU: the crosshair at the hung mark and at an overhanging line should not change
  at the raster-to-DOM swap. Checked by comparing screenshots of both states with a software renderer.
  Reduced motion should still show the rules.
- Firefox (headless Playwright Firefox would not launch in the dev environment) and Safari on a
  real device for the hang mark, RTL pull quote and the scrollbar gutter. Firefly and gallery were smoke-tested in Chromium and WebKit (desktop and mobile
  emulation) only.
- Keyboard path on both blocks: Tab/Shift+Tab through cards, backtab into the globe from below
  the quote.
- Tab into the globe from above the block (`suppressFocusSnap` in the block entry) and the first
  pull-quote frame after a rebuild (`jumped` in `quote-particles.js`).

## Backlog: mistakes and inconsistencies

Tackle one at a time, before the pattern work unless marked otherwise. Items marked *(extraction)*
can wait for the pattern step that moves that code, since one implementation has to be chosen then
anyway.

### Docs

18. Shared files say "see README" for content only the gallery README has: `core.js` (yaw-only geometry),
    `gl.js` (`releaseCanvasAfterUpload`), `modal.js` (`MODAL_RADIUS_PX`), `globe.css` (`hanging-punctuation`,
    Modal chrome). Move the shared behaviour into `README.md` here, or name the README they mean.
19. Shared `README.md` is wrong on two points: `name` isn't only for `daa-ll` (it also tags lana logs in
    `gl.js`), and `loadGlobeStyles()` isn't awaited at the top of `init` (it starts there and is awaited
    after the content fetch).
20. "The core" in comments and the gallery README means the block runtime, not `core.js`
    (for example `isBrowsing` in `interaction.js`). Pick one word for the runtime.

### Guards

21. Nothing in the test suite would catch the CSS and raster regressions found in review (cascade order in
    `globe.css`, rule paint order). Add a test that the raster and DOM paint rules under the text. Decide whether a
    computed-style check earns a place in the suite.

### Raster

22. **Bidi in the raster.** `rasterize` draws each line on its own, so on an RTL page Latin text reorders its
    line-edge punctuation (`,I love` in the raster against `I love…,` on the DOM) and visibly jumps at the
    swap. Seen with forced `dir="rtl"` on Latin content; check real RTL content before deciding.

## Pattern plan

Ordered by value and risk, from the measured duplication between the two entry files:

- 243 of firefly's 1,637 lines and 557 of gallery's 1,951 have no counterpart in the other block.
- About 41 runtime functions (about 314 lines) are identical apart from comments, and 46 top-level constants are identical.
- 22 functions share a name but really differ. Only 10 functions have no counterpart at all, all in gallery
  (arc, grid, fold, arc copy), plus `retireHint` in firefly.

So most of the job is moving identical code, which needs no pattern. What remains after that is the actual
variation point. Apply one step at a time, with tests green and a visual check between steps.

### 1. Characterization tests - **do first**

*Problem:* the runtimes have the thinnest test coverage and everything below moves their code.
*Proposal:* card positions, camera and clocks per frame for fixed scroll inputs, plus lifecycle checks
(rebuild, destroy leaves no listeners). `buildCards` calls `Math.random` for roll jitter, peel jitter and grid
tilts, so stub it.

### 2. Extract the identical subsystems (Extract Module, Parameter Object) - **do second**

*Problem:* the duplication above. *Proposal:* factories in a new shared `runtime.js`, moved in slices:

1. Shared constants and the scroll reader (`deQuantize`, `readScrollY`).
2. Sphere orientation: `sphereOrient`, `navNudge`, `rotateStep`, `centerCardOnScreen`, `centerModalCard`, the
   shared part of `updateSphereRotation`.
3. Card field: `resolveMasonryLayout`, `recomputeDragFlip`, `applyMotionCA`, `applyCardFit`, facing, hint mesh.
4. Lifecycle: ticker, context loss, observers (with step 3 below).

*Cost:* a 7th shared module, breaking the file budget above. It is worth one request if it removes this much
per block; re-check the count after slice 1 before committing to it.

### 3. Disposer (Resource-cleanup / RAII-style) - **with the lifecycle slice**

*Problem:* `destroy()` is about 70 lines in each block, plus per-module `teardown()`s, each hand-pairing
every `addEventListener`/observer/timer with its removal.
*Proposal:* a tiny `createDisposer()`: `disposer.listen(target, evt, fn, opts)`, `disposer.add(fn)`,
`disposer.dispose()`. Setup registers cleanup at the point of creation.
*Why:* removes a class of leak bugs that are hard to test and shrinks destroy paths.
*Watch:* runtimes rebuild in place, and `destroy(false)` must keep the hoisted modal.

### 4. Block spec (Strategy, Parameter Object) - **after 2**

*Problem:* what's left differs per block. *Proposal:* one frozen per-block `spec`, not separate variant,
content-source and entry objects. There are exactly two blocks, so three interfaces would be speculative.
Sections, to be confirmed by what step 2 leaves behind:

- **Identity:** `name`, `breakpoints`, and flags (`hoistToBody`, `bodyOpenClass`, `requireOnSphere`, `manageCanvas`).
- **Content:** where cards come from, card and modal image URLs, `crossOrigin`, per-card `lang`,
  `renderModalContent`, `modalInfoHtml`, `canvasStyle`.
- **Entry:** `createFrame`/`deriveFrame` (already in `timeline.js`), `placeCard`, `updateCamera`, cue timing,
  `snapToBrowseView`, canvas visibility, extra per-frame stages (`updateArcCopy`,
  `updateSphereGroupDepth`). Firefly's is "formed from the start"; gallery's carries arc, grid and fold.
  Hint retirement stays a per-block rule: firefly is interactive long before it forms, so its `retireHint` is
  gated on `sphereFormed`; gallery's callers can't run before its hint has finished appearing.

This replaces the earlier separate items for a variant descriptor, a content provider and a placement strategy.

### 5. Shared runtime factory (Template Method by composition, Factory) - **last**

*Proposal:* `createGlobeRuntime(spec)` runs the lifecycle (build DOM -> init renderer/scene -> build cards ->
layout -> tick -> destroy) and calls the spec where it differs. After steps 2 and 4 this should be mostly wiring.
*Composition, not inheritance:* the codebase is closure-based and the blocks differ by
a few functions, not by an "is-a" relationship; classes would fight the style and the injected
getters.

### 6. Context object for module dependencies (Parameter Object) - **optional, with 5**

`createGlobeModal` and the other factories take many injected getters. After 5, replace the
getter soup with a small read-only `ctx` (`ctx.scene`, `ctx.camera`, `ctx.cards`, `ctx.bp`, ...)
built by the runtime. Do this only if it makes the modal readable; otherwise leave it.

## Patterns considered and rejected (for now)

- **Standalone variant descriptor.** The earlier "six factory calls" claim was overstated: `name` goes to five
  calls, `timeline` and each flag to one. Too little to justify a step of its own; folded into the block spec.
- **Clock renames as a lead-in (`zoomT` to `scrollT`, `lenisY` to `scrollY`).** Makes only about 4 more functions
  identical. Rename when moving code if it helps, not as its own step.
- **Inheritance / classes.** Closure style plus tiny differences; a base class would add `this`
  plumbing and fragile overrides.
- **Mediator (formal).** The runtime closure already mediates modal, interaction, controls, a11y
  and cursor through getters. A separate mediator object would be indirection without a second
  implementation to justify it. Revisit only if step 5 leaves a hub that is hard to read.
- **Facade (`createGlobeKit(variant)` returning bound factories).** Subsumed by the block spec. Add only
  if call sites stay noisy afterwards.
- **Observer / event bus.** Callbacks are 1:1 and explicit; a bus would hide data flow.
- **Singleton / DI container / Visitor / Decorator.** No need identified.
- **Explicit state-machine library.** The modal already has `MODAL_PHASE`; other states are small.
