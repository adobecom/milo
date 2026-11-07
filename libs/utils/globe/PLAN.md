# Globe consolidation plan

Working notes for refactoring `firefly-globe` and `globe-gallery` onto the shared layer in this folder.
Delete this file before the branch merges.

## Ground rules (they shaped every decision)

- **No build step.** Every `.js` file is a runtime ES module request. Keep the module count per
  page low: each block loads its entry, `src/authoring.js`,
  `src/timeline.js` and the seven shared modules (`core`, `gl`, `interaction`, `authoring`, `modal`,
  `quote-particles`, `runtime`) plus `globe.css`. Merge small things into an existing shared file rather than adding files.
- **One globe per page is the normal case; two must not interfere.** Shared modules keep no
  per-instance state (the skeleton's `globeInstanceSeq` is the only module-level counter); `easePow` is injected
  per instance. Block-only CSS is scoped under the block root (`.root .globe-*`).
- **No behaviour change by default.** When the two blocks differ only for historical reasons,
  consolidate into one function (a branch or option is fine; it can be cleaned up later). When a
  difference is real, keep it and say why.
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

## Still to verify

- The handoff on a real GPU: the crosshair at the hung mark and at an overhanging line should not change
  at the raster-to-DOM swap. Checked by comparing screenshots of both states with a software renderer.
  Reduced motion should still show the rules.
- Firefox (headless Playwright Firefox would not launch in the dev environment) and Safari on a
  real device for the hang mark, RTL pull quote and the scrollbar gutter. Firefly and gallery were smoke-tested in Chromium and WebKit (desktop and mobile
  emulation) only.
- Keyboard path on both blocks: Tab/Shift+Tab through cards, backtab into the globe from below
  the quote.
- Tab into the globe from above the block (`suppressFocusSnap` in `runtime.js`) and the first
  pull-quote frame after a rebuild (`jumped` in `quote-particles.js`).

## Pattern plan

Consolidation comes first: move everything that is not a real difference into the shared runtime, then apply patterns to
what remains. Apply one step at a time, with the temporary goldens matching and a visual check between steps.

**Extensibility test.** A pattern earns its place if it makes one of these cheaper: a third block with its own
scroll choreography and content source, a new card layout, a new per-frame effect, or a bug fixed once.

**Where a difference goes,** in order of preference:

1. Remove it, if it is historical and behaviour does not change.
2. Make it data: a field on the frame or the spec.
3. Make it a named hook on the spec.

Never a behaviour flag checked inside shared code.

### 1. Safety net for the refactor - **in use**

Temporary golden values, never committed: capture from the code before a step, compare after. Committed goldens were
tried and removed because they fail on any visual tuning. The harness lives outside the repo and pins cards, camera and
clocks across both blocks. It does not compare pixels, so each step still needs a visual check. Delete it with this file.

### 2. Consolidate (Extract Module, Functional Core, Template Method by composition) - **done, visual check passed**

Entry files went from firefly 1,631 and gallery 1,964 lines to about 100 and 430. `runtime.js` is about 1,750 lines.

What is left per block:

- **Firefly:** breakpoints, content, the camera's entry distance, the JS entry lift and its browse target.
- **Gallery:** the same, plus what firefly does not have: arc, grid and fold placement, the ortho camera, arc copy.
- **Timelines:** the scroll-to-clock mapping.

Differences removed as historical, with goldens unchanged:

- Timeline names (`zoom*` and `entryT` to `travel*` and `sphereFormT`), the frame base, travel span math (firefly's
  `formPx` is 0).
- `updateActiveCamera` is one formula: the lerp into the sphere and the travel match at the seam in both blocks.
- The inside-sphere flip gate (`sphereFormed` in firefly, `scrollT > 0` in gallery): a formed camera at `scrollT` 0 is
  outside the sphere.
- `crossOrigin` and `lang` branches (gallery's cards have neither), `readCssVars` order, `fonts.ready` wiring.

Kept as data: `frame.orientReset`, `hintEntryT`, `hintRetirable`, `beforeEntry`, `sphGroupZ`; `pullQuote` and `modal`
options. One accepted golden change: firefly's `uWarp` on cards behind the camera, which are not drawn.

### 3. Two lifetimes: Disposer + Build scope - **done, awaiting visual check**

*Problem:* `destroy()` is about 65 lines in each block, hand-pairing every listener, observer and timer with its
removal, and hand-resetting about 28 pieces of state. Six of those resets (`fadeRefH`, `drag.isDragging`, `onScreen`, `masonryMorph`,
`wasBrowsing`, `cameraInsideSphere`) had no observable effect in the scenarios tried, and the `fadeRefH` comment records a past bug from a missed one. The list can only grow.

*Proposal:* two pieces, because they solve different failures.

- **Disposer:** `disposer.listen(target, evt, fn, opts)`, `disposer.add(fn)`, `disposer.dispose()`. Cleanup is
  registered where the resource is created and runs in reverse order.
- **Build scope:** split what lives for the block from what lives for one build. A rebuild drops the build object
  rather than resetting its fields, so a forgotten reset can no longer happen.
  - *Instance:* content, DOM, modal/a11y/controls/cursor/interaction closures, context-loss count, spin pause,
    `suppressFocusSnap`, `smoothY`, the texture generation.
  - *Build:* renderer, scene, cameras, cards, textures, frame state, hint state, the disposer.

*Watch:*

- `drag` and `sphereRotQuat` are shared by reference into instance-level closures. They stay on `createOrientation`, with
  its own `reset()`, not on the build.
- `destroy(false)` must keep the hoisted modal.
- `doLayout` compares against the previous `bp`.

A band-crossing rebuild must end in the same state as a fresh mount.

*Result:* `createDisposer` is in `core.js`, `createBuild` in `runtime.js`. `destroy()` went from about 60 lines to about
10. The field and the hint are built per build, so their `reset()` methods are gone, and so are the generation counter
and `hooks.onDestroy` (`ctx.disposer.add` replaces it). Hooks are created per build too.

Measured with a temporary benchmark, draw calls stubbed, 6 cards, against the code before this step:

- Frame cost and rebuild cost: no change beyond run-to-run noise.
- Old builds stay collectable; the number of live scene objects did not change.
- GPU leak fixed: the old `destroy()` disposed the renderer first, so later disposals freed nothing. After a mount and 8
  rebuilds, live programs went from 36 to 4 and live textures from 99 to 43. Of those 43, 36 are Three's 4 internal
  textures per renderer, which it never frees, and 7 belong to the live build. Shader objects did not change.

Cleanup pass after this step, goldens unchanged: the field, hint and orientation read `ctx` instead of about 40 getter
calls, the always-true `CA_ENABLED` is gone, dead guards are gone, and `initRuntime` is split into `doLayout`,
`loadTextures`, `rebuild` and `collapse`. Older comments stay where they help a future reader; ones the code already explains are gone. JS and CSS went from
241 KB to 226 KB. `ctx` already covers part of step 5.

### 4. Card layout (Strategy) - **after 3**

*Problem:* sphere versus barrel is the one variation both blocks share, and it is spread out: 10 `CYLINDER` references
per block and the same `cylinderMasonryLayout({...})` call twice per file, so four copies. A third layout means editing
all of them in both blocks.

*Proposal:* `sphereLayout` and `barrelLayout`, each with `solve(aspects, bp)` returning per-card slots (position,
quaternion, scale, world height) and `onTexture` / `onAllLoaded` for what happens as images land: resize in place, or
re-solve and morph. The remaining `CYLINDER` checks (hint mesh, cursor, root class) become properties of the layout.

Two real implementations exist today, so this is not speculative, and it is the cheapest route to a new layout.

### 5. Context object for module dependencies (Parameter Object) - **optional**

`createGlobeModal` takes 29 options, and each block passes about 30 `get*` getters in all. They exist because the modal outlives a build while
`scene` and `camera` do not, which step 3 makes explicit. A small read-only `ctx` pointing at the current build could
replace most of them. Do this only if it makes the modal readable; otherwise leave it.

## Patterns considered and rejected (for now)

Revisited with the measurements above.

- **A library of factories, each block owning its lifecycle (including Facade `createGlobeKit`).** Leaves `initRuntime`,
  `destroy` and `tick` duplicated per block, where the bugs have been.
- **One runtime with feature flags (`if (spec.hasArc)`).** Gallery's arc, grid and fold are about 335 lines of real
  behaviour. Flags would ship them to firefly and scatter the checks. Boolean flags stay only for small DOM choices
  like `hoistToBody`.
- **Pipeline / open stage list for `tick`.** Tempting, since `tick` is a list of stages, but it differs by 3 lines and its
  order is load-bearing. An open array lets a block reorder it by accident; named slots keep the order in the runtime.
- **State pattern for card phases.** A card's arc, grid, fold or sphere phase is derived each frame from pure clocks,
  with no stored state or transitions, which is why scrolling backwards just works. A state object would add the
  transitions this design avoids.
- **Inheritance / classes.** Closure style plus tiny differences; a base class would add `this` plumbing and fragile overrides.
- **Mediator (formal).** The runtime closure already mediates modal, interaction, controls, a11y and cursor. Revisit only
  if `createGlobeRuntime` becomes a hub that is hard to read.
- **Observer / event bus.** Callbacks are 1:1 and explicit, and frame order matters; a bus would hide both. The repeated
  `hintRetired = true` needs one function, not a bus.
- **Command for navigation tweens.** There is one pending tween, with no undo or history. `navNudge.kind` is enough.
- **Builder for the breakpoint profile.** It is one function with about 11 block-specific keys.
- **Entity-Component-System for cards.** There is one entity type, and all its behaviour runs in one loop.
- **Standalone variant descriptor, separate content-source object.** Three interfaces for two blocks; folded into the spec.
- **Clock renames as their own step.** Still only 4 more identical functions (47 vs 43), so not a step on its own. The
  rename had to happen, because shared code reads one name; it was done in step 2.
- **Null Object.** `createPullQuote` already behaves as one when no quote is authored. Nothing further to apply.
- **Explicit state-machine library.** The modal already has `MODAL_PHASE`; other states are small.
- **Singleton / DI container / Visitor / Decorator / Object Pool.** No need identified; scratch vectors already cover
  per-frame allocation.
