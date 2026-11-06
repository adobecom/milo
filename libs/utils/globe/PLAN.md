# Globe consolidation plan

Working notes for refactoring `firefly-globe` and `globe-gallery` onto the shared layer in this folder.

## Ground rules (they shaped every decision)

- **No build step.** Every `.js` file is a runtime ES module request. Keep the module count per
  page low: each block loads its entry, `src/authoring.js`,
  `src/timeline.js` and the six shared modules (`core`, `gl`, `interaction`, `authoring`, `modal`,
  `quote-particles`) plus `globe.css`. Merge small things into an existing shared file rather than adding files.
- **One globe per page is the normal case; two must not interfere.** Shared modules keep no
  per-instance state (the modal id counter is the only module-level counter); `easePow` is injected
  per instance. Block-only CSS is scoped under the block root (`.root .globe-*`).
- **No behaviour change by default.** When the two blocks differ only for historical reasons,
  consolidate into one function (a branch or option is fine; it can be cleaned up later). When a
  difference is real, keep it and say why. Behaviour changes are called out below.
- **Review each pattern before applying it.** Patterns must remove a measured duplication or a
  measured risk. No pattern for its own sake.
- Tests/lint: `npx eslint libs/utils/globe libs/c2/blocks/firefly-globe libs/c2/blocks/globe-gallery test/c2/blocks test/utils/globe`
  and `npx wtr --config ./web-test-runner.config.mjs --node-resolve --port=2000 "test/utils/globe/*.test.js" "test/c2/blocks/{firefly-globe,globe-gallery}/*.test.js"`.
- `libs/mep/ace1209/*` holds legacy copies of these blocks. Do not touch them.
- **JS/CSS ship unminified:** no new comments in code; document only tricky current behaviour in
  the READMEs (no rationale, no history).
- **CSS:** shared rules live in `globe.css`; a block rule that overrides a shared one must
  out-specify it (stylesheet load order is not guaranteed). First-paint rules (root height, the
  root background) stay in the block CSS.

## Behaviour changes adopted

Everything else was kept identical.

- Firefly: opening-quote hang is a `text-indent`, not a `span.hang-opening-quote`.
- Gallery: a11y uses firefly's version (Tab handling, `preventScroll`, per-card `lang`).
- Gallery: `parsePullQuote` ignores `<p>` inside the quote element.
- Firefly: the description gets the hang gutter (padding offset by an equal negative margin).
- Firefly: a11y card buttons no longer use `pointer-events: auto`.
- Both: crosshair rules paint under the DOM text; modal dialog is `overflow: clip`; the page
  scrollbar gutter stays reserved and is painted dark while the modal is open (gallery gained
  the gutter).
- Both: pull-quote raster picks the letter-spacing that matches the DOM line width.

## Still to verify

- Firefox (headless Playwright Firefox would not launch in the dev environment) and Safari on a
  real device for the hang mark, RTL pull quote and the scrollbar gutter. Firefly and gallery were smoke-tested in Chromium and WebKit (desktop and mobile
  emulation) only.
- Keyboard path on both blocks: Tab/Shift+Tab through cards, backtab into the globe from below
  the quote.
- Tab into the globe from above the block (`suppressFocusSnap` in the block entry) and the first
  pull-quote frame after a rebuild (`jumped` in `quote-particles.js`).


## Pattern plan

Ordered by value/risk. Each item says what it fixes, the evidence, and the verdict. Apply one at
a time, with tests green and a visual check between steps.

### 1. Variant descriptor (Parameter Object / Configuration) - **do first**

*Problem:* `name`, `timeline`, flags are passed separately to six factory
calls per block.
*Proposal:* each block builds one frozen `variant` object (`name`,
`timeline`, feature flags). Factories read from it (`easePow` is already injected per instance).
*Why it is safe:* purely mechanical, no logic moves. *Cost:* touches call sites and tests.
Not a facade; it is just data.

### 2. Disposer (Resource-cleanup / RAII-style) - **do early**

*Problem:* `destroy()` is about 70 lines in each block, plus per-module `teardown()`s, each hand-pairing
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
surface becomes a documented interface instead of loose closures.

### 4. Placement/entry strategy (Strategy) - **the big one, do after 1-3**

*Problem:* the only structural difference between the runtimes is how cards enter and are
placed: gallery has arc -> grid -> fold staging; firefly is already a pinned sphere.
*Proposal:* one `entry` strategy interface per block: `createFrameInput/deriveFrame` (already in
`timeline.js`), `placeCard(card, frame)`, `updateCamera(frame)`, `pqAppearT()`, `copyLayers`
(arc copy). Firefly's strategy is "formed from the start" (a near no-op); gallery's carries the
gallery-only staging. `timeline.js` is already the seed of this.
*Why it earns its place:* it is the actual variation point, it already exists informally, and it
unlocks item 5.

### 5. Shared runtime factory (Template Method by composition, Factory) - **last**

*Proposal:* `createGlobeRuntime(variant, contentSource, entryStrategy)` in a shared file runs the
lifecycle (build DOM -> init renderer/scene -> build cards -> layout -> tick -> destroy) and calls
the strategy where it differs. This is where the identical and near-identical runtime
lines move. *Composition, not inheritance:* the codebase is closure-based and the blocks differ by
a few functions, not by an "is-a" relationship; classes would fight the style and the injected
getters.
*Gate:* do not start until 1-4 are in, and move it in slices (state -> layout -> transforms ->
input -> lifecycle), tests plus a visual diff after each. The runtime has the thinnest test
coverage, so add characterization tests (card positions per frame for fixed inputs) before moving
code. Needs a file-budget check: this would be a 7th shared file.

### 6. Context object for module dependencies (Parameter Object) - **optional, with 5**

`createGlobeModal` and the other factories take many injected getters. After 5, replace the
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
