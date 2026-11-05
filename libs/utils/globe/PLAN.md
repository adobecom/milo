# Globe consolidation plan

Working notes for refactoring `firefly-globe` and `globe-gallery` onto the shared layer in this folder.

## Ground rules (they shaped every decision)

- **No build step.** Every `.js` file is a runtime ES module request. Keep the module count per
  page at or below what it was (see the table below). Merge small things into an existing shared
  file rather than adding files.
- **One globe per page.** Module-level state is acceptable where it keeps signatures small, but
  prefer explicit injection when it is cheap.
- **No behaviour change by default.** When the two blocks differ only for historical reasons,
  consolidate into one function (a branch or option is fine; it can be cleaned up later). When a
  difference is real, keep it and say why. Behaviour changes are called out below.
- **Review each pattern before applying it.** Patterns must remove a measured duplication or a
  measured risk. No pattern for its own sake.
- Tests/lint: `npx eslint libs/utils/globe libs/c2/blocks/firefly-globe libs/c2/blocks/globe-gallery test/c2/blocks test/blocks/globe-gallery`
  and `npx wtr --config ./web-test-runner.config.mjs --node-resolve --port=2000 "test/c2/blocks/{firefly-globe,globe-gallery}/*.test.js" "test/blocks/globe-gallery/*.test.js"`.
- `libs/mep/ace1209/*` holds legacy copies of these blocks. Do not touch them.


## Pattern plan

Ordered by value/risk. Each item says what it fixes, the evidence, and the verdict. Apply one at
a time, with tests green and a visual check between steps.

### 1. Variant descriptor (Parameter Object / Configuration) - **do first**

*Problem:* `name`, `timeline`, flags are passed separately to six factory
calls per block, and `quote-particles.js` keeps a mutable module-level `GLOBE`.
*Proposal:* each block builds one frozen `variant` object (`name`,
`timeline`, feature flags). Factories read from it; `configureGlobe()` and the module state go away
(the particle module receives the variant in `createPullQuote`/`createQuoteParticles`).
*Why it is safe:* purely mechanical, no logic moves. *Cost:* touches call sites and tests.
Not a facade; it is just data.

### 2. Disposer (Resource-cleanup / RAII-style) - **do early**

*Problem:* `destroy()` is ~70 lines in each block, plus per-module `teardown()`s, each hand-pairing
every `addEventListener`/observer/timer with its removal.
*Proposal:* a tiny `createDisposer()` in `core.js`: `const on = disposer.listen(target, evt, fn,
opts)`, `disposer.add(fn)`, `disposer.dispose()`. Setup registers cleanup at the point of creation.
*Why:* removes a class of leak bugs that are hard to test; shrinks destroy paths; no new files.

### 3. Content provider (Adapter / Strategy for authoring) - **do after 1**

*Problem:* the blocks differ in where cards come from and how they render: Firefly API vs fragment
cards, image URL builders, `crossOrigin`, per-card `lang`, `renderModalContent`, `modalInfoHtml`,
canvas style. Today these are scattered optional callbacks (`getCrossOrigin`, `getCardLang`,
`loadModalUpgrade`, `renderContent`, `getSrc`...).
*Proposal:* each `authoring.js` exports one `contentSource` object with a fixed shape (load cards,
`cardImageUrl(i, px)`, `modalImageUrl`, `cardLang`, `renderModalContent`, `modalInfoHtml`,
`canvasStyle`). The runtime and shared factories take that one object. *Why:* the injected
surface becomes a documented interface instead of ~10 loose closures.

### 4. Placement/entry strategy (Strategy) - **the big one, do after 1-3**

*Problem:* the only structural difference between the runtimes is how cards enter and are
placed: gallery has arc -> grid -> fold staging; firefly is already a pinned sphere.
*Proposal:* one `entry` strategy interface per block: `createFrameInput/deriveFrame` (already in
`timeline.js`), `placeCard(card, frame)`, `updateCamera(frame)`, `pqAppearT()`, `copyLayers`
(arc copy). Firefly's strategy is "formed from the start" (a near no-op); gallery's carries the
~290 gallery-only lines. `timeline.js` is already the seed of this.
*Why it earns its place:* it is the actual variation point, it already exists informally, and it
unlocks item 5.

### 5. Shared runtime factory (Template Method by composition, Factory) - **last**

*Proposal:* `createGlobeRuntime(variant, contentSource, entryStrategy)` in a shared file runs the
lifecycle (build DOM -> init renderer/scene -> build cards -> layout -> tick -> destroy) and calls
the strategy where it differs. This is where the ~340 identical and ~700 near-identical runtime
lines move. *Composition, not inheritance:* the codebase is closure-based and the blocks differ by
a few functions, not by an "is-a" relationship; classes would fight the style and the injected
getters.
*Gate:* do not start until 1-4 are in, and move it in slices (state -> layout -> transforms ->
input -> lifecycle), tests plus a visual diff after each. The runtime has the thinnest test
coverage, so add characterization tests (card positions per frame for fixed inputs) before moving
code. Needs a file-budget check: this is likely a 6th shared file, within the budget.

### 6. Context object for module dependencies (Parameter Object) - **optional, with 5**

`createGlobeModal` and the other factories take 25-35 injected getters. After 5, replace the
getter soup with a small read-only `ctx` (`ctx.scene`, `ctx.camera`, `ctx.cards`, `ctx.bp`, ...)
built by the runtime. Do this only if it makes the modal readable; otherwise leave it.

## Patterns considered and rejected (for now)

- **Inheritance / classes.** Closure style plus tiny differences; a base class would add `this`
  plumbing and fragile overrides.
- **Mediator (formal).** The runtime closure already mediates modal, interaction, controls, a11y
  and cursor through getters. A separate mediator object would be indirection without a second
  implementation to justify it. Revisit only if item 5 leaves a hub that is hard to read.
- **Facade (`createGlobeKit(variant)` returning bound factories).** Subsumed by item 1. Add only
  if call sites stay noisy afterwards.
- **Observer / event bus.** Callbacks are 1:1 and explicit; a bus would hide data flow.
- **Singleton / DI container / Visitor / Decorator.** No need identified.
- **Explicit state-machine library.** The modal already has `MODAL_PHASE`; other states are small.

## Fix-first list (before the patterns)

Candidates to settle before starting item 1; confirm which to do:

1. `ui.js` is a grab-bag (a11y + controls + cursor + authoring helpers + hang + DOM skeleton).
   Option: split the authoring/skeleton half into a shared `authoring.js` (budget allows +1).
2. `core.js` mixes shaders, math, materials, layout helpers. Same option, lower priority.
3. Unused or over-exported symbols after the moves (e.g. things only the tests import).
4. Decide whether to share the ~55 identical tuning constants or keep them per block.
5. README drift: `firefly-globe/README.md` and `globe-gallery/README.md` still describe some of
   the old file layout in prose; re-read both after each step.
6. `test/blocks/globe-gallery/` duplicates part of `test/c2/blocks/globe-gallery/`; decide whether
   the old directory should go.
7. Behaviour differences adopted during consolidation (hang-quote text-indent for firefly,
   firefly a11y for gallery, `parsePullQuote` fix) need a visual/keyboard pass on real pages in
   Chrome, Safari and Firefox.
